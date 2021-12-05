export const DayjsUnitTokensMap = (is12h) => ({
  year: ["YY", "YYYY"],
  month: ["M", "MM"],
  day: ["D", "DD"],
  hour: is12h ? ["h", "hh"] : ["H", "HH"],
  minute: ["m", "mm"],
  second: ["s", "ss"],
  meridiem: is12h ? ["a"] : []
});

/**
 * Generates all combinations for each
 * segment variation, also allowing for trailing
 * segments to be dropped
 * @param {string[][]} segments
 * @return {string[][]}
 */
export function combinations(segments) {
  return segments.reduce((a, b, i) => {
    const segment = segments.slice(0, i + 1);

    let results = segment
      .reverse()
      .reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

    // for single elements, make sure to be wrapped in arrays
    if (Array.isArray(results[0]) === false) {
      results = results.map((a) => [a]);
    }

    // Remove null from results and adjust order
    const variation = results.map((a) => a.filter((b) => b).reverse());

    return a.concat(variation);
  }, []);
}

export class DayjsPattern {
  constructor(dayjs, pattern) {
    this.dayjs = dayjs;
    this.pattern = pattern;

    // set if 12/24 hours clock
    const parts = this.pattern.split(/\W/);
    this.is12h = parts.includes("h") || parts.includes("hh");

    // get unit-tokens map
    this.map = DayjsUnitTokensMap(this.is12h);

    // get array of parts
    this.parts = parts.map((part, index) => {
      const unit = this.unit(part);
      const start = this.pattern.indexOf(part);
      return {
        index,
        unit,
        tokens: this.tokens(unit),
        start,
        end: start + (part.length - 1)
      };
    });

    // get array of separators
    this.separators = this.pattern.match(/[\W]/g);

    // set if time-only pattern
    const units = this.units();
    this.isTime =
      (units.includes("year") ||
        units.includes("month") ||
        units.includes("day")) === false;
  }

  at(start, end) {
    // if just a single cursor and not a range is passed
    if (!end) {
      end = start;
    }

    // if everything is selected, return true
    if (start === 0 && end === this.pattern.length) {
      return true;
    }

    // based on the current cursor position,
    // return the matching part
    return this.parts.filter(
      (part) => part.start <= start && part.end >= end - 1
    )[0];
  }

  /**
   * Returns a string for the dayjs object
   * in the format of the pattern.
   * @param {Object} dt
   * @returns {string}
   */
  format(dt, format = this.pattern) {
    if (typeof dt === "string") {
      dt = this.parse(dt);
    }

    if (!dt || !dt.isValid()) {
      return null;
    }

    return dt.format(format);
  }

  /**
   * Returns a dayjs object for the provided input, if possible,
   * by matching it against all variations of the pattern.
   * @param {string} input
   * @returns {Object|null}
   */
  interpret(input) {
    if (typeof input === "string" && input !== "") {
      // loop through all pattern variations to find
      // first result where input is a valid date
      const variations = this.variations();

      for (let i = 0; i < variations.length; i++) {
        const dt = this.parse(input, variations[i]);

        if (dt.isValid() === true) {
          return dt;
        }
      }
    }

    return null;
  }

  /**
   * Returns an iso string for the dayjs object.
   * If the pattern only uses time units, a shorter format
   * with just time units is used.
   * @param {Object} dt
   * @returns {string}
   */
  iso(dt) {
    dt = this.parse(dt);
    const format = this.isTime ? "HH:mm:ss" : "YYYY-MM-DD HH:mm:ss";
    return dt.format(format);
  }

  /**
   * Generates dayjs object from input
   * @param {string} input
   * @param {string} format uses the pattern as default
   * @returns {Object}
   */
  parse(input, format) {
    if (!input) {
      return null;
    }

    if (typeof input === "object" && input.isValid()) {
      return input;
    }

    if (!format && this.isTime === true) {
      format = "HH:mm:ss";
    }

    if (!format) {
      return this.dayjs.utc(input);
    }

    return this.dayjs.utc(input, format);
  }

  /**
   * Returns all tokens for a unit
   * @param {string} unit
   * @returns {array}
   */
  tokens(unit) {
    return this.map[unit];
  }

  /**
   * Returns unit for the provided token
   * @param {string} token
   * @returns {string}
   */
  unit(token) {
    const index = Object.values(this.map).findIndex((tokens) =>
      tokens.includes(token)
    );
    return Object.keys(this.map)[index];
  }

  /**
   * Returns an array of all units
   * included in the pattern
   * @returns {array}
   */
  units() {
    return this.parts.map((x) => x.unit);
  }

  variations() {
    const segments = this.parts.map((x) => x.tokens);
    // generate all possible combination of tokens
    const variations = combinations(segments).reverse();
    // join combinations to pattern strings by adding in
    // separators from original pattern
    return variations.map((x) =>
      x.reduce((a, b, i) => a + this.separators[i - 1] + b)
    );
  }
}

export default (option, dayjsClass, dayjsFactory) => {
  // dayjs.pattern("YYYY-MM-DD")
  dayjsFactory.pattern = (pattern) => new DayjsPattern(dayjsFactory, pattern);
};
