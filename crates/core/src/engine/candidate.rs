use std::{iter::empty, rc::Rc, sync::Arc};
use bstr::ByteSlice;

use crate::util::segment;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Candidate {
  raw: Vec<u8>,
  important: bool,
  variants: Vec<Variant>,
  utilities: Vec<Utility>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Variant {
  /// Arbitrary variants are variants that take a selector and generate a variant
  /// on the fly.
  ///
  /// E.g.: `[&_p]`
  Arbitrary {
    selector: Vec<u8>,

    /// If true, it can be applied as a child of a compound variant
    compounds: bool,

    /// Whether or not the selector is a relative selector
    /// @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selector_structure#relative_selector
    relative: bool,
  },

  /// Static variants are variants that don't take any arguments.
  ///
  /// E.g.: `hover`
  Static {
    root: Vec<u8>,
    compounds: bool,
  },

  /// Functional variants are variants that can take an argument. The argument is
  /// either a named variant value or an arbitrary variant value.
  ///
  /// E.g.:
  ///
  /// - `aria-disabled`
  /// - `aria-[disabled]`
  /// - `@container-size`          -> @container, with named value `size`
  /// - `@container-[inline-size]` -> @container, with arbitrary variant value `inline-size`
  /// - `@container`               -> @container, with no value
  Functional {
    root: Vec<u8>,
    value: Option<VariantValue>,
    modifier: Option<CandidateModifier>,

    /// If true, it can be applied as a child of a compound variant
    compounds: bool,
  },

  /// Compound variants are variants that take another variant as an argument.
  ///
  /// E.g.:
  ///
  /// - `has-[&_p]`
  /// - `group-*`
  /// - `peer-*`
  Compound {
    root: Vec<u8>,
    variant: Box<Variant>,
    modifier: Option<CandidateModifier>,

    /// If true, it can be applied as a child of a compound variant
    compounds: bool,
  }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Utility {
  /// Arbitrary candidates are candidates that register utilities on the fly with
  /// a property and a value.
  ///
  /// Examples:
  /// - `[color:red]`
  /// - `[color:red]/50`
  /// - `[color:red]/50!`
  Arbitrary {
    property: Vec<u8>,
    value: Vec<u8>,
    modifier: Option<CandidateModifier>,
  },

  ///  Static candidates are candidates that don't take any arguments.
  ///
  ///  Examples:
  ///  - `underline`
  ///  - `flex`
  Static {
    root: Vec<u8>,
  },

  ///  Static candidates are candidates that don't take any arguments.
  ///
  ///  Examples:
  ///  - `underline`
  ///  - `flex`
  Functional {
    root: Vec<u8>,
    value: Option<UtilityValue>,
    modifier: Option<CandidateModifier>,
  }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum UtilityValue {
  Arbitrary {
    /// bg-[color:--my-color]
    ///     ^^^^^
    data_type: Option<Vec<u8>>,

    /// bg-[#0088cc]
    ///     ^^^^^^^
    /// bg-[var(--my_variable)]
    ///     ^^^^^^^^^^^^^^^^^^
    value: Vec<u8>,
  },

  Named {
    /// bg-red-500
    ///    ^^^^^^^
    ///
    /// w-1/2
    ///   ^
    value: Vec<u8>,

    /// w-1/2
    ///   ^^^
    fraction: Option<Vec<u8>>
  }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum VariantValue {
  Arbitrary {
    value: Vec<u8>,
  },

  Named {
    value: Vec<u8>,
  }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CandidateModifier {
  Arbitrary {
    /// bg-red-500/[50%]
    ///             ^^^
    value: Vec<u8>
  },

  Named {
    /// bg-red-500/50
    ///            ^^
    value: Vec<u8>,
  }
}

pub struct DesignSystem {
  prefix: Option<Vec<u8>>,
  utilities: Utilities,
}

pub struct Utilities {
  //
}

impl Utilities {
  pub fn has(&self, utility: &[u8]) -> bool {
    false
  }
}

pub fn parse_candidate(input: &[u8], design: Rc<DesignSystem>) -> Option<Candidate> {
  let raw = input.to_vec();

  // hover:focus:underline
  // ^^^^^ ^^^^^^           -> Variants
  //             ^^^^^^^^^  -> Base
  let mut raw_variants = segment(input, b':');

  if let Some(prefix) = &design.prefix {
    let Some(new_variants) = raw_variants.strip_prefix(prefix) else {
      return None;
    };

    if new_variants.is_empty() {
      return None;
    }

    raw_variants = new_variants.to_vec();
  }

  // Safety: At this point it is safe to use TypeScript's non-null assertion
  // operator because even if the `input` was an empty string, splitting an
  // empty string by `:` will always result in an array with at least one
  // element.
  let mut base = raw_variants.pop().unwrap();

  let mut parsed_variants: Vec<Variant> = Vec::with_capacity(raw_variants.len());

  for i in (0..raw_variants.len()).rev() {
    let parsed_variant = parse_variant(raw_variants[i]);
    if parsed_variant.is_none() {
      return None;
    }

    parsed_variants.push(parsed_variant.unwrap())
  }

  let mut important = false;
  let mut negative = false;

  // Candidates that end with an exclamation mark are the important version with
  // higher specificity of the non-important candidate, e.g. `mx-4!`.
  if let Some(new_base) = base.strip_suffix(b"!") {
    important = true;
    base = new_base;
  }

  // Legacy syntax with leading `!`, e.g. `!mx-4`.
  else if let Some(new_base) = base.strip_prefix(b"!") {
    important = true;
    base = new_base;
  }

  // Candidates that start with a dash are the negative versions of another
  // candidate, e.g. `-mx-4`.
  if let Some(new_base) = base.strip_prefix(b"-") {
    negative = true;
    base = new_base;
  }

  let mut utilities: Vec<Utility> = vec![];

  // Check for an exact match of a static utility first as long as it does not
  // look like an arbitrary value.
  if design.utilities.has(base) && !base.contains(&b'[') {
    utilities.push(Utility::Static {
      root: base.to_vec(),
    });
  }

  // Figure out the new base and the modifier segment if present.
  //
  // E.g.:
  //
  // ```
  // bg-red-500/50
  // ^^^^^^^^^^    -> Base without modifier
  //            ^^ -> Modifier segment
  // ```
  let parts = segment(base, b'/');

  // If there's more than one modifier, the utility is invalid.
  //
  // E.g.:
  //
  // - `bg-red-500/50/50`
  if parts.len() > 2 {
    return None;
  }

  // let [baseWithoutModifier, modifierSegment = null, additionalModifier] = segment(base, '/')


  Some(Candidate {
    raw: raw.to_vec(),
    important,
    variants: parsed_variants.to_vec(),
    utilities,
  })
}

fn parse_variant(input: &[u8]) -> Option<Variant> {
  return Some(Variant::Static { root: vec![], compounds: false })
}

fn parse_arbitrary_property(base: &[u8]) -> Option<Utility> {
  // Arbitrary properties must start and end with square brackets.
  let Some(base) = base.strip_prefix(b"[") else {
    return None;
  };

  let Some(base) = base.strip_suffix(b"]") else {
    return None;
  };

  // The property part of the arbitrary property can only start with a-z
  // lowercase or a dash `-` in case of vendor prefixes such as `-webkit-`
  // or `-moz-`.
  //
  // Otherwise, it is an invalid candidate, and skip continue parsing.
  if base[0] != b'-' && !(base[0] >= b'a' && base[0] <= b'z') {
    return None
  }

  // Arbitrary properties consist of a property and a value separated by a
  // `:`. If the `:` cannot be found, then it is an invalid candidate, and we
  // can skip continue parsing.
  //
  // Since the property and the value should be separated by a `:`, we can
  // also verify that the colon is not the first or last character in the
  // candidate, because that would make it invalid as well.
  let Some(idx) = base.find(b":") else {
    return None;
  };

  if idx == 0 || idx == base.len() - 1 {
    return None;
  }

  let property = base[..idx].to_vec();
  let value = base[idx+1..].to_vec();

  // let value = decodeArbitraryValue(base.slice(idx + 1))

  Some(Utility::Arbitrary {
    property,
    value,
    modifier: None,
  })
}
