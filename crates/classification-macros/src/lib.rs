use proc_macro::TokenStream;
use quote::quote;
use syn::{
    parse_macro_input, punctuated::Punctuated, token::Comma, Attribute, Data, DataEnum,
    DeriveInput, Expr, ExprLit, ExprRange, Ident, Lit, RangeLimits, Result, Variant,
};

/// A custom derive that supports:
///
/// - `#[bytes(…)]` for single byte literals
/// - `#[bytes_range(…)]` for inclusive byte ranges (b'a'..=b'z')
/// - `#[fallback]` for a variant that covers everything else
///
/// Example usage:
///
/// ```rust
/// use classification_macros::ClassifyBytes;
///
/// #[derive(Clone, Copy, ClassifyBytes)]
/// enum Class {
///     #[bytes(b'a', b'b', b'c')]
///     Letters,
///
///     #[bytes_range(b'0'..=b'9')]
///     Digits,
///
///     #[fallback]
///     Other,
/// }
/// ```
/// Then call `b'a'.into()` to get `Example::SomeLetters`.
#[proc_macro_derive(ClassifyBytes, attributes(bytes, bytes_range, fallback))]
pub fn classify_bytes_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);

    // This derive only works on an enum
    let Data::Enum(DataEnum { variants, .. }) = &ast.data else {
        return syn::Error::new_spanned(
            &ast.ident,
            "ClassifyBytes can only be derived on an enum.",
        )
        .to_compile_error()
        .into();
    };

    let enum_name = &ast.ident;

    let mut byte_map: [Option<Ident>; 256] = [const { None }; 256];
    let mut fallback_variant: Option<Ident> = None;

    // Start parsing the variants
    for variant in variants {
        let variant_ident = &variant.ident;

        // If this variant has #[fallback], record it
        if has_fallback_attr(variant) {
            if fallback_variant.is_some() {
                let err = syn::Error::new_spanned(
                    variant_ident,
                    "Multiple variants have #[fallback]. Only one allowed.",
                );
                return err.to_compile_error().into();
            }
            fallback_variant = Some(variant_ident.clone());
        }

        // Get #[bytes(…)]
        let single_bytes = get_bytes_attrs(&variant.attrs);

        // Get #[bytes_range(…)]
        let range_bytes = get_bytes_range_attrs(&variant.attrs);

        // Combine them
        let all_bytes = single_bytes
            .into_iter()
            .chain(range_bytes)
            .collect::<Vec<_>>();

        // Mark them in the table
        for b in all_bytes {
            byte_map[b as usize] = Some(variant_ident.clone());
        }
    }

    // If no fallback variant is found, default to "Other"
    let fallback_ident = fallback_variant.expect("A variant marked with #[fallback] is missing");

    // For each of the 256 byte values, fill the table
    let fill = byte_map
        .clone()
        .into_iter()
        .map(|variant_opt| match variant_opt {
            Some(ident) => quote!(#enum_name::#ident),
            None => quote!(#enum_name::#fallback_ident),
        });

    // Generate the final expanded code
    let expanded = quote! {
        impl #enum_name {
            pub const TABLE: [#enum_name; 256] = [
                #(#fill),*
            ];
        }

        impl From<u8> for #enum_name {
            fn from(byte: u8) -> Self {
                #enum_name::TABLE[byte as usize]
            }
        }

        impl From<&u8> for #enum_name {
            fn from(byte: &u8) -> Self {
                #enum_name::TABLE[*byte as usize]
            }
        }
    };

    TokenStream::from(expanded)
}

/// Checks if a variant has `#[fallback]`
fn has_fallback_attr(variant: &Variant) -> bool {
    variant
        .attrs
        .iter()
        .any(|attr| attr.path().is_ident("fallback"))
}

/// Get all single byte literals from `#[bytes(…)]`
fn get_bytes_attrs(attrs: &[Attribute]) -> Vec<u8> {
    let mut assigned = Vec::new();
    for attr in attrs {
        if attr.path().is_ident("bytes") {
            match parse_bytes_attr(attr) {
                Ok(list) => assigned.extend(list),
                Err(e) => panic!("Error parsing #[bytes(...)]: {}", e),
            }
        }
    }
    assigned
}

/// Parse `#[bytes(...)]` as a comma-separated list of **byte literals**, e.g. `b'a'`, `b'\n'`.
fn parse_bytes_attr(attr: &Attribute) -> Result<Vec<u8>> {
    // We'll parse it as a list of syn::Lit separated by commas: e.g. (b'a', b'b')
    let items: Punctuated<Lit, Comma> = attr.parse_args_with(Punctuated::parse_terminated)?;
    let mut out = Vec::new();
    for lit in items {
        match lit {
            Lit::Byte(lb) => out.push(lb.value()),
            _ => {
                return Err(syn::Error::new_spanned(
                    lit,
                    "Expected a byte literal like b'a'",
                ))
            }
        }
    }
    Ok(out)
}

/// Get all byte ranges from `#[bytes_range(...)]`
fn get_bytes_range_attrs(attrs: &[Attribute]) -> Vec<u8> {
    let mut assigned = Vec::new();
    for attr in attrs {
        if attr.path().is_ident("bytes_range") {
            match parse_bytes_range_attr(attr) {
                Ok(list) => assigned.extend(list),
                Err(e) => panic!("Error parsing #[bytes_range(...)]: {}", e),
            }
        }
    }
    assigned
}

/// Parse `#[bytes_range(...)]` as a comma-separated list of range expressions, e.g.:
/// `b'a'..=b'z', b'0'..=b'9'`
fn parse_bytes_range_attr(attr: &Attribute) -> Result<Vec<u8>> {
    // We'll parse each element as a syn::Expr, then see if it's an Expr::Range
    let exprs: Punctuated<Expr, Comma> = attr.parse_args_with(Punctuated::parse_terminated)?;
    let mut out = Vec::new();

    for expr in exprs {
        if let Expr::Range(ExprRange {
            start: Some(start),
            end: Some(end),
            limits,
            ..
        }) = expr
        {
            let from = extract_byte_literal(&start)?;
            let to = extract_byte_literal(&end)?;

            match limits {
                RangeLimits::Closed(_) => {
                    // b'a'..=b'z'
                    if from <= to {
                        out.extend(from..=to);
                    }
                }
                RangeLimits::HalfOpen(_) => {
                    // b'a'..b'z'  => from..(to-1)
                    if from < to {
                        out.extend(from..to);
                    }
                }
            }
        } else {
            return Err(syn::Error::new_spanned(
                expr,
                "Expected a byte range like b'a'..=b'z'",
            ));
        }
    }

    Ok(out)
}

/// Extract a u8 from an expression that can be:
///
/// - `Expr::Lit(Lit::Byte(...))`, e.g. b'a'
/// - `Expr::Lit(Lit::Int(...))`, e.g. 0x80 or 255
fn extract_byte_literal(expr: &Expr) -> Result<u8> {
    if let Expr::Lit(ExprLit { lit, .. }) = expr {
        match lit {
            // Existing case: b'a'
            Lit::Byte(lb) => Ok(lb.value()),

            // New case: 0x80, 255, etc.
            Lit::Int(li) => {
                let value = li.base10_parse::<u64>()?;
                if value <= 255 {
                    Ok(value as u8)
                } else {
                    Err(syn::Error::new_spanned(
                        li,
                        format!("Integer literal {} out of range for a byte (0..255)", value),
                    ))
                }
            }

            _ => Err(syn::Error::new_spanned(
                lit,
                "Expected b'...' or an integer literal in range 0..=255",
            )),
        }
    } else {
        Err(syn::Error::new_spanned(
            expr,
            "Expected a literal expression like b'a' or 0x80",
        ))
    }
}
