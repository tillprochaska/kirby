export default (option, dayjsClass, dayjsFactory) => {
  // dayjs.nearest(unit, step)
  dayjsClass.prototype.nearest = function (unit = "day", step = 1) {
    const dt = this.clone();

    // define base reference for rounding
    let base;

    switch (unit) {
      case "second":
        base = dt.startOf("minute");
        break;
      case "minute":
        base = dt.startOf("hour");
        break;
      case "hour":
        base = dt.startOf("day");
        break;
      case "day":
        base = dt.startOf("month");
        break;
      case "month":
        base = dt.startOf("year");
        break;
      case "year":
        // get current century
        base = this.dayjs(
          Math.floor(parseInt(dt.format("YYYY")) / 100) * 100 +
            "-01-01 00:00:00"
        );
        break;
    }

    // create range with all possible step options
    // by adding a step to the base reference.
    let range = [];
    let current = base.clone();
    let max = dt.add(step, unit);
    let distance = base.add(step, unit).unix() - base.unix();

    while (current.unix() < max.unix()) {
      range.unshift(current);
      current = current.add(distance, unit);
    }

    // loop through range of options until we have found a
    // datetime that is less than half a step size away from the
    // provided datetime (and thus its nearest step)
    for (let i = 0; i < range.length; i++) {
      if (Math.abs(dt.unix() - range[i].unix()) <= distance / 2) {
        return range[i];
      }
    }
  };
};
