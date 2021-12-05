export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.update = function (units = "date", dt) {
    const result = this.clone().utc();

    const map = {
      date: ["year", "month", "date"],
      time: ["hour", "minute", "second"]
    };

    for (const unit of map[units]) {
      result.set(unit, dt.get(unit));
    }

    return result;
  };
};
