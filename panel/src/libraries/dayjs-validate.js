export default (option, dayjsClass, dayjsFactory) => {
  /**
   * Validates  datetime against an
   * upper or lower (min/max) limit
   *
   * @param {string} reference
   * @param {string} condition
   * @param {string} unit
   * @returns {bool}
   */
  dayjsClass.prototype.validate = function (
    reference,
    condition,
    unit = "day"
  ) {
    if (!this.isValid()) {
      return false;
    }

    // if no reference is provided, just make sure
    // the dayjs object is valid
    if (!reference) {
      return this.isValid();
    }

    // generate dayjs object for reference
    reference = this.utc(reference);

    // whether input is the reference or within the condition (upper/lower)
    // compared against the unit
    return this.isSame(reference, unit) || this[condition](reference, unit);
  };
};
