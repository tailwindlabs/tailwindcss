#[inline(always)]
pub const fn gurantee(expr: bool) {
  #[cfg(debug_assertions)]
  if !expr {
    panic!("gurantee failed")
  }

  unsafe {
    std::hint::assert_unchecked(expr)
  }
}
