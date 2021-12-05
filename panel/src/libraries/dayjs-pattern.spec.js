import { combinations, DayjsUnitTokensMap } from "./dayjs-pattern.js";
import dayjs from "./dayjs.js";

describe("combinations", () => {
  it("for multiple segments", () => {
    const result = combinations([
      ["A", "AA"],
      ["B", "BB"],
      ["C", "CC"]
    ]);

    expect(result).to.deep.equal([
      ["A"],
      ["AA"],
      ["A", "B"],
      ["AA", "B"],
      ["A", "BB"],
      ["AA", "BB"],
      ["A", "B", "C"],
      ["AA", "B", "C"],
      ["A", "BB", "C"],
      ["AA", "BB", "C"],
      ["A", "B", "CC"],
      ["AA", "B", "CC"],
      ["A", "BB", "CC"],
      ["AA", "BB", "CC"]
    ]);
  });

  it("for date tokens", () => {
    const result = combinations([
      ["YY", "YYYY"],
      ["M", "MM"],
      ["D", "DD"]
    ]);

    expect(result).to.deep.equal([
      ["YY"],
      ["YYYY"],
      ["YY", "M"],
      ["YYYY", "M"],
      ["YY", "MM"],
      ["YYYY", "MM"],
      ["YY", "M", "D"],
      ["YYYY", "M", "D"],
      ["YY", "MM", "D"],
      ["YYYY", "MM", "D"],
      ["YY", "M", "DD"],
      ["YYYY", "M", "DD"],
      ["YY", "MM", "DD"],
      ["YYYY", "MM", "DD"]
    ]);
  });

  it("for 0 segments", () => {
    const result = combinations([]);
    expect(result).to.deep.equal([]);
  });
});

describe("DayjsUnitTokensMap", () => {
  it("12 h", () => {
    const map = DayjsUnitTokensMap(true);
    expect(map.hour).to.deep.equal(["h", "hh"]);
    expect(map.meridiem).to.deep.equal(["a"]);
  });
  it("24 h", () => {
    const map = DayjsUnitTokensMap(false);
    expect(map.hour).to.deep.equal(["H", "HH"]);
    expect(map.meridiem).to.deep.equal([]);
  });
});

describe("DayjsPattern.at", () => {
  it("YYYY-MM-DD", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.at(0).unit).to.equal("year");
    expect(pattern.at(2).unit).to.equal("year");
    expect(pattern.at(5).unit).to.equal("month");
    expect(pattern.at(6).unit).to.equal("month");
    expect(pattern.at(9).unit).to.equal("day");
  });

  it("MM/DD/YY HH:mm", () => {
    const pattern = dayjs.pattern("MM/DD/YY HH:mm");
    expect(pattern.at(0).unit).to.equal("month");
    expect(pattern.at(1).unit).to.equal("month");
    expect(pattern.at(3).unit).to.equal("day");
    expect(pattern.at(4).unit).to.equal("day");
    expect(pattern.at(6).unit).to.equal("year");
    expect(pattern.at(10).unit).to.equal("hour");
  });
});

describe("DayjsPattern.format", () => {
  it("no value", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.format()).to.equal(null);
  });

  it("invalid value", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.format("aaaa-bb-cc")).to.equal(null);
  });

  it("valid string value", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.format("2020-03-01")).to.equal("2020-03-01");
  });

  it("valid dayjs object", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    const value = dayjs("2020-03-01");
    expect(pattern.format(value)).to.equal("2020-03-01");
  });

  it("custom format", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    const value = dayjs("2020-03-01");
    expect(pattern.format(value, "MM/DD/YY")).to.equal("03/01/20");
  });

  it("time format", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    const value = dayjs("16:03:7", "HH:mm:ss");
    expect(pattern.format(value, "HH:mm:ss")).to.equal("16:03:07");
  });
});

describe("DayjsPattern.interpret", () => {
  it("YYYY-MM-DD", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    let result;

    // exact format, all parts
    result = pattern.interpret("2020-08-01");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2020);
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(1);

    // fuzzy format, all parts
    result = pattern.interpret("20-8-1");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2020);
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(1);

    // exact format, some parts
    result = pattern.interpret("2020");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2020);
    expect(result.month()).to.equal(0);
    expect(result.date()).to.equal(1);

    // fuzzy format, some parts
    result = pattern.interpret("20");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2020);
    expect(result.month()).to.equal(0);
    expect(result.date()).to.equal(1);

    // fuzzy format, different separators
    result = pattern.interpret("20/8/1");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2020);
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(1);
  });

  it("MM/DD/YY HH:mm", () => {
    const pattern = dayjs.pattern("MM/DD/YY HH:mm");
    let result;

    // exact format, all parts
    result = pattern.interpret("08/15/15 19:03");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2015);
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(15);
    expect(result.hour()).to.equal(19);
    expect(result.minute()).to.equal(3);

    // fuzzy format, all parts
    result = pattern.interpret("8/2/15 8:3");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2015);
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(2);
    expect(result.hour()).to.equal(8);
    expect(result.minute()).to.equal(3);

    // exact format, some parts
    result = pattern.interpret("08/02");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(dayjs().year());
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(2);
    expect(result.hour()).to.equal(0);
    expect(result.minute()).to.equal(0);

    // fuzzy format, some parts
    result = pattern.interpret("8/2");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(dayjs().year());
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(2);
    expect(result.hour()).to.equal(0);
    expect(result.minute()).to.equal(0);

    // fuzzy format, different separators
    result = pattern.interpret("8-2-15 8.3");
    expect(result.isValid()).to.equal(true);
    expect(result.year()).to.equal(2015);
    expect(result.month()).to.equal(7);
    expect(result.date()).to.equal(2);
    expect(result.hour()).to.equal(8);
    expect(result.minute()).to.equal(3);
  });

  it("HH:mm:ss", () => {
    const pattern = dayjs.pattern("HH:mm:ss");
    let result;

    // exact format, all parts
    result = pattern.interpret("19:03:22");
    expect(result.hour()).to.equal(19);
    expect(result.minute()).to.equal(3);
    expect(result.second()).to.equal(22);

    // fuzzy format, all parts
    result = pattern.interpret("8:3:7");
    expect(result.hour()).to.equal(8);
    expect(result.minute()).to.equal(3);
    expect(result.second()).to.equal(7);

    // exact format, some parts
    result = pattern.interpret("19:03");
    expect(result.hour()).to.equal(19);
    expect(result.minute()).to.equal(3);
    expect(result.second()).to.equal(0);

    // fuzzy format, some parts
    result = pattern.interpret("7:3");
    expect(result.hour()).to.equal(7);
    expect(result.minute()).to.equal(3);
    expect(result.second()).to.equal(0);

    // fuzzy format, different separators
    result = pattern.interpret("7/3-2");
    expect(result.hour()).to.equal(7);
    expect(result.minute()).to.equal(3);
    expect(result.second()).to.equal(2);
  });

  it("hh:mm a", () => {
    const pattern = dayjs.pattern("hh:mm a");
    let result;

    // exact format, all parts
    result = pattern.interpret("07:03 pm");
    expect(result.hour()).to.equal(19);
    expect(result.minute()).to.equal(3);

    // fuzzy format, all parts
    result = pattern.interpret("7:3 am");
    expect(result.hour()).to.equal(7);
    expect(result.minute()).to.equal(3);

    // exact format, some parts
    result = pattern.interpret("19:03");
    expect(result.hour()).to.equal(19);
    expect(result.minute()).to.equal(3);

    // fuzzy format, some parts
    result = pattern.interpret("7:3");
    expect(result.hour()).to.equal(7);
    expect(result.minute()).to.equal(3);

    result = pattern.interpret("7");
    expect(result.hour()).to.equal(7);
    expect(result.minute()).to.equal(0);

    // fuzzy format, different separators
    result = pattern.interpret("7/3-pm");
    expect(result.hour()).to.equal(19);
    expect(result.minute()).to.equal(3);
  });

  it("empty values", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.interpret(null)).to.equal(null);
    expect(pattern.interpret("")).to.equal(null);
  });
});

describe("Datetime.iso", () => {
  it("invalid value", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.iso("aaa")).to.equal("Invalid Date");
  });

  it("full iso", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.iso("2020-03-01")).to.equal("2020-03-01 00:00:00");
  });

  it("time only", () => {
    const pattern = dayjs.pattern("HH:mm:ss");
    expect(pattern.iso("15:03:12")).to.equal("15:03:12");
  });
});

describe("DayjsPattern.is12h", () => {
  it("YYYY-MM-DD", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.is12h).to.equal(false);
  });
  it("YYYY-MM-DD HH:mm", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD HH:mm");
    expect(pattern.is12h).to.equal(false);
  });
  it("HH:mm", () => {
    const pattern = dayjs.pattern("HH:mm");
    expect(pattern.is12h).to.equal(false);
  });
  it("hh:mm a", () => {
    const pattern = dayjs.pattern("hh:mm a");
    expect(pattern.is12h).to.equal(true);
  });
});

describe("DayjsPattern.isTime", () => {
  it("YYYY-MM-DD", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.isTime).to.equal(false);
  });
  it("YYYY-MM-DD HH:mm", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD HH:mm");
    expect(pattern.isTime).to.equal(false);
  });
  it("HH:mm", () => {
    const pattern = dayjs.pattern("HH:mm");
    expect(pattern.isTime).to.equal(true);
  });
  it("HH:mm:ss", () => {
    const pattern = dayjs.pattern("HH:mm:ss");
    expect(pattern.isTime).to.equal(true);
  });
  it("hh:mm a", () => {
    const pattern = dayjs.pattern("hh:mm a");
    expect(pattern.isTime).to.equal(true);
  });
});

describe("DayjsPattern.parts", () => {
  it("YYYY-MM-DD", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.parts).to.deep.equal([
      { unit: "year", tokens: ["YY", "YYYY"], start: 0, end: 3 },
      { unit: "month", tokens: ["M", "MM"], start: 5, end: 6 },
      { unit: "day", tokens: ["D", "DD"], start: 8, end: 9 }
    ]);
  });

  it("MM/DD/YY HH:mm", () => {
    const pattern = dayjs.pattern("MM/DD/YY HH:mm");
    expect(pattern.parts).to.deep.equal([
      { unit: "month", tokens: ["M", "MM"], start: 0, end: 1 },
      { unit: "day", tokens: ["D", "DD"], start: 3, end: 4 },
      { unit: "year", tokens: ["YY", "YYYY"], start: 6, end: 7 },
      { unit: "hour", tokens: ["H", "HH"], start: 9, end: 10 },
      { unit: "minute", tokens: ["m", "mm"], start: 12, end: 13 }
    ]);
  });
});

describe("DayjsPattern.separators", () => {
  it("YYYY-MM-DD", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD");
    expect(pattern.separators).to.deep.equal(["-", "-"]);
  });

  it("MM/DD/YY HH:mm", () => {
    const pattern = dayjs.pattern("MM/DD/YY HH:mm");
    expect(pattern.separators).to.deep.equal(["/", "/", " ", ":"]);
  });
});

describe("DayjsPattern.tokens", () => {
  it("year", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.tokens("year")).to.deep.equal(["YY", "YYYY"]);
  });
  it("month", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.tokens("month")).to.deep.equal(["M", "MM"]);
  });
  it("day", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.tokens("day")).to.deep.equal(["D", "DD"]);
  });
  it("hour", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.tokens("hour")).to.deep.equal(["h", "hh"]);
  });
  it("hour - 24h", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD HH:mm");
    expect(pattern.tokens("hour")).to.deep.equal(["H", "HH"]);
  });
  it("minute", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.tokens("minute")).to.deep.equal(["m", "mm"]);
  });
  it("second", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.tokens("second")).to.deep.equal(["s", "ss"]);
  });
  it("meridiem", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.tokens("meridiem")).to.deep.equal(["a"]);
  });
  it("meridiem - 24h", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD HH:mm");
    expect(pattern.tokens("meridiem")).to.deep.equal([]);
  });
});

describe("DayjsPattern.unit", () => {
  it("year", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.unit("YYYY")).to.equal("year");
    expect(pattern.unit("YY")).to.equal("year");
  });
  it("month", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.unit("MM")).to.equal("month");
    expect(pattern.unit("M")).to.equal("month");
  });
  it("day", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.unit("DD")).to.equal("day");
    expect(pattern.unit("D")).to.equal("day");
  });
  it("hour", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.unit("hh")).to.equal("hour");
    expect(pattern.unit("h")).to.equal("hour");
  });
  it("minute", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.unit("mm")).to.equal("minute");
    expect(pattern.unit("m")).to.equal("minute");
  });
  it("second", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.unit("ss")).to.equal("second");
    expect(pattern.unit("s")).to.equal("second");
  });
  it("meridiem", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD hh:mm a");
    expect(pattern.unit("a")).to.equal("meridiem");
  });
});

describe("DayjsPattern.units", () => {
  it("YYYY-MM-DD HH:mm", () => {
    const pattern = dayjs.pattern("YYYY-MM-DD HH:mm");
    expect(pattern.units()).to.deep.equal([
      "year",
      "month",
      "day",
      "hour",
      "minute"
    ]);
  });
});

describe("DayjsPattern.variations", () => {
  it("YYYY-MM-DD", () => {
    const variations = dayjs.pattern("YYYY-MM-DD").variations();
    expect(variations).to.deep.equal([
      "YYYY-MM-DD",
      "YY-MM-DD",
      "YYYY-M-DD",
      "YY-M-DD",
      "YYYY-MM-D",
      "YY-MM-D",
      "YYYY-M-D",
      "YY-M-D",
      "YYYY-MM",
      "YY-MM",
      "YYYY-M",
      "YY-M",
      "YYYY",
      "YY"
    ]);
  });

  it("MM/DD/YY HH:mm", () => {
    const variations = dayjs.pattern("MM/DD/YY HH:mm").variations();
    expect(variations).to.deep.equal([
      "MM/DD/YYYY HH:mm",
      "M/DD/YYYY HH:mm",
      "MM/D/YYYY HH:mm",
      "M/D/YYYY HH:mm",
      "MM/DD/YY HH:mm",
      "M/DD/YY HH:mm",
      "MM/D/YY HH:mm",
      "M/D/YY HH:mm",
      "MM/DD/YYYY H:mm",
      "M/DD/YYYY H:mm",
      "MM/D/YYYY H:mm",
      "M/D/YYYY H:mm",
      "MM/DD/YY H:mm",
      "M/DD/YY H:mm",
      "MM/D/YY H:mm",
      "M/D/YY H:mm",
      "MM/DD/YYYY HH:m",
      "M/DD/YYYY HH:m",
      "MM/D/YYYY HH:m",
      "M/D/YYYY HH:m",
      "MM/DD/YY HH:m",
      "M/DD/YY HH:m",
      "MM/D/YY HH:m",
      "M/D/YY HH:m",
      "MM/DD/YYYY H:m",
      "M/DD/YYYY H:m",
      "MM/D/YYYY H:m",
      "M/D/YYYY H:m",
      "MM/DD/YY H:m",
      "M/DD/YY H:m",
      "MM/D/YY H:m",
      "M/D/YY H:m",
      "MM/DD/YYYY HH",
      "M/DD/YYYY HH",
      "MM/D/YYYY HH",
      "M/D/YYYY HH",
      "MM/DD/YY HH",
      "M/DD/YY HH",
      "MM/D/YY HH",
      "M/D/YY HH",
      "MM/DD/YYYY H",
      "M/DD/YYYY H",
      "MM/D/YYYY H",
      "M/D/YYYY H",
      "MM/DD/YY H",
      "M/DD/YY H",
      "MM/D/YY H",
      "M/D/YY H",
      "MM/DD/YYYY",
      "M/DD/YYYY",
      "MM/D/YYYY",
      "M/D/YYYY",
      "MM/DD/YY",
      "M/DD/YY",
      "MM/D/YY",
      "M/D/YY",
      "MM/DD",
      "M/DD",
      "MM/D",
      "M/D",
      "MM",
      "M"
    ]);
  });

  it("h:m", () => {
    const variations = dayjs.pattern("h:m a").variations();
    expect(variations).to.deep.equal([
      "hh:mm a",
      "h:mm a",
      "hh:m a",
      "h:m a",
      "hh:mm",
      "h:mm",
      "hh:m",
      "h:m",
      "hh",
      "h"
    ]);
  });
});
