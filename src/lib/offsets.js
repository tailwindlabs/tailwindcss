// @ts-check

import bigSign from '../util/bigSign'

/**
 * @typedef {'base' | 'defaults' | 'components' | 'utilities' | 'variants' | 'user'} Layer
 */

/**
 * @typedef {object} RuleOffset
 * @property {Layer} layer The layer that this rule belongs to
 * @property {Layer} parentLayer The layer that this rule originally belonged to. Only different from layer if this is a variant.
 * @property {bigint} arbitrary 0n if false, 1n if true
 * @property {bigint} variants Dynamic size. 1 bit per registered variant. 0n means no variants
 * @property {bigint} parallelIndex Rule index for the parallel variant. 0 if not applicable.
 * @property {bigint} index Index of the rule / utility in it's given *parent* layer. Monotonically increasing.
 */

export class Offsets {
  /**
   * Offsets for the next rule in a given layer
   *
   * @type {Record<Layer, bigint>}
   */
  offsets = {
    defaults: 0n,
    base: 0n,
    components: 0n,
    utilities: 0n,
    variants: 0n,
    user: 0n,
  }

  /**
   * Positions for a given layer
   *
   * @type {Record<Layer, bigint>}
   */
  layerPositions = {
    defaults: 0n,
    base: 1n,
    components: 2n,
    utilities: 3n,
    variants: 4n,

    // There isn't technically a "user" layer, but we need to give it a position
    // Because it's used for ordering user-css from @apply
    user: 5n,
  }

  /**
   * The total number of functions currently registered across all variants (including arbitrary variants)
   *
   * @type {bigint}
   */
  reservedVariantBits = 0n

  /**
   * Positions for a given variant
   *
   * @type {Map<string, bigint>}
   */
  variantOffsets = new Map()

  constructor(context) {
    this.context = context
  }

  /**
   * @param {Layer} layer
   * @returns {RuleOffset}
   */
  create(layer) {
    return {
      layer,
      parentLayer: layer,
      arbitrary: 0n,
      variants: 0n,
      parallelIndex: 0n,
      index: this.offsets[layer]++,
    }
  }

  /**
   * @param {Layer} layer
   * @returns {RuleOffset}
   */
  arbitraryProperty() {
    return {
      ...this.create('utilities'),
      arbitrary: 1n,
    }
  }

  /**
   * Get the offset for a variant
   *
   * @param {string} variant
   * @param {number} index
   */
  forVariant(variant, index = 0) {
    let offset = this.variantOffsets.get(variant)
    if (offset === undefined) {
      throw new Error(`Cannot find offset for unknown variant ${variant}`)
    }

    return offset + BigInt(index)
  }

  /**
   *
   * @param {RuleOffset} offset
   * @param {bigint} bitmask
   */
  applyVariantSort(offset, bitmask) {
    return {
      ...offset,
      variants: offset.variants | bitmask,
    }
  }

  /**
   * Each variant gets 1 bit per function / rule registered.
   * This is because multiple variants can be applied to a single rule and we need to know which ones are present and which ones are not.
   * Additionally, every unique group of variants is grouped together in the stylesheet.
   *
   * This grouping is order-independent. For instance, we do not differentiate between `hover:focus` and `focus:hover`.
   *
   * @param {string[]} variants
   */
  recordVariants(variants) {
    for (const variant of variants) {
      this.recordVariant(variant, this.context.variantMap.get(variant).length)
    }
  }

  /**
   * The same as `recordVariants` but for a single arbitrary variant at runtime.
   * @param {string} variant
   * @param {number} fnCount
   *
   * @returns {bigint} The highest offset for this variant
   */
  recordVariant(variant, fnCount = 1) {
    this.variantOffsets.set(variant, 1n << this.reservedVariantBits)

    // Ensure space is reserved for each "function" in the parallel variant
    // by offsetting the next variant by the number of parallel variants
    // in the one we just added.

    // Single functions that return parallel variants are NOT handled separately here
    // They're offset by 1 (or the number of functions) as usual
    // And each rule returned is tracked separately since the functions are evaluated lazily.
    // @see `RuleOffset.parallelIndex`
    this.reservedVariantBits += BigInt(fnCount)

    return 1n << this.reservedVariantBits
  }

  /**
   * @param {RuleOffset} a
   * @param {RuleOffset} b
   * @returns {bigint}
   */
  compare(a, b) {
    // Sort layers together
    if (a.layer !== b.layer) {
      return this.layerPositions[a.layer] - this.layerPositions[b.layer]
    }

    // Sort variants in the order they were registered
    if (a.variants !== b.variants) {
      return a.variants - b.variants
    }

    // Make sure each rule returned by a parallel variant is sorted in ascending order
    if (a.parallelIndex !== b.parallelIndex) {
      return a.parallelIndex - b.parallelIndex
    }

    // Always sort arbitrary properties after other utilities
    if (a.arbitrary !== b.arbitrary) {
      return a.arbitrary - b.arbitrary
    }

    // Sort utilities, components, etc… in the order they were registered
    return a.index - b.index
  }

  /**
   * @template T
   * @param {T[]} list
   * @param {(item: T) => RuleOffset} getOffset
   * @returns {T[]}
   */
  sort(list, getOffset) {
    return list.sort((a, b) => bigSign(this.compare(getOffset(a), getOffset(b))))
  }
}
