import dayjs from "./dayjs.js";

describe("dayjs.nearest()", () => {
  it("10 seconds", () => {
    let result;

    result = dayjs("2021-08-18 00:00:00").nearest("second", 10);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 00:00:00"
    );

    result = dayjs("2021-08-18 19:27:13").nearest("second", 10);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 19:27:10"
    );

    result = dayjs("2021-08-18 10:59:59").nearest("second", 10);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 11:00:00"
    );
  });

  it("30 seconds", () => {
    let result;

    result = dayjs("2000-01-11 22:35:15").nearest("second", 30);
    expect(result.format("HH:mm:ss")).to.equal("22:35:30");

    result = dayjs("2000-01-11 22:35:30").nearest("second", 30);
    expect(result.format("HH:mm:ss")).to.equal("22:35:30");

    result = dayjs("2000-01-11 22:35:45").nearest("second", 30);
    expect(result.format("HH:mm:ss")).to.equal("22:36:00");
  });

  it("5 minutes", () => {
    let result;

    result = dayjs("2021-08-18 00:00:00").nearest("minute", 5);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 00:00:00"
    );

    result = dayjs("2021-08-18 19:27:15").nearest("minute", 5);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 19:25:00"
    );

    result = dayjs("2021-08-18 10:59:00").nearest("minute", 5);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 11:00:00"
    );
  });

  it("2 hours", () => {
    let result;

    result = dayjs("2021-08-18 00:00:00").nearest("hour", 2);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 00:00:00"
    );

    result = dayjs("2021-08-18 19:27:15").nearest("hour", 2);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 20:00:00"
    );

    result = dayjs("2021-08-18 23:59:00").nearest("hour", 2);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-19 00:00:00"
    );
  });

  it("1 day", () => {
    let result;

    result = dayjs("2021-08-17").nearest("day", 1);
    expect(result.format("YYYY-MM-DD")).to.equal("2021-08-17");

    result = dayjs("2021-08-17 19:27:15").nearest("day", 1);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-18 00:00:00"
    );

    result = dayjs("2021-08-31 23:59:00").nearest("day", 1);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-09-01 00:00:00"
    );
  });

  it("1 month", () => {
    let result;

    result = dayjs("2021-08-17").nearest("month", 1);
    expect(result.format("YYYY-MM-DD")).to.equal("2021-09-01");

    result = dayjs("2021-08-13 19:27:15").nearest("month", 1);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-08-01 00:00:00"
    );

    result = dayjs("2021-08-31 23:59:00").nearest("month", 1);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2021-09-01 00:00:00"
    );

    result = dayjs("2021-12-31 23:59:00").nearest("month", 1);
    expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
      "2022-01-01 00:00:00"
    );
  });

  // it("step: 1 year", () => {
  //   const dt = new Datetime(dayjs, "YYYY-MM-DD HH:mm:ss", { unit: "year" });
  //   let result;

  //   result = dt.nearest(dayjs("2021-05-17 00:00:00"));
  //   expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
  //     "2021-01-01 00:00:00"
  //   );

  //   result = dt.nearest(dayjs("2021-09-31 23:59:00"));
  //   expect(result.format("YYYY-MM-DD HH:mm:ss")).to.equal(
  //     "2022-01-01 00:00:00"
  //   );
  // });

  // it("YYYY-MM-DD by 5 days", () => {
  //   const dt = new Datetime(dayjs, "YYYY-MM-DD", { size: 5 });
  //   let result;

  //   result = dt.nearest(dayjs("2020-03-07"));
  //   expect(result.format("YYYY-MM-DD")).to.equal("2020-03-06");
  // });

  // it("YYYY-MM-DD HH:mm by 1 day (default)", () => {
  //   const dt = new Datetime(dayjs, "YYYY-MM-DD HH:mm");
  //   let result;

  //   result = dt.parseToNearest("2020-03-16 15:10");
  //   expect(result.format("YYYY-MM-DD HH:mm")).to.equal("2020-03-17 00:00");
  // });

  // it("YYYY-MM-DD by 5 days", () => {
  //   const dt = new Datetime(dayjs, "YYYY-MM-DD", { unit: "day", size: 5 });
  //   let result;

  //   result = dt.nearest(dayjs("2020-03-07"));
  //   expect(result.format("YYYY-MM-DD")).to.equal("2020-03-06");
  // });

  // it("HH:mm by 15 minutes", () => {
  //   const dt = new Datetime(dayjs, "HH:mm", { unit: "minute", size: 15 });
  //   let result;

  //   result = dt.parseToNearest("12:01");
  //   expect(result.format("HH:mm")).to.equal("12:00");

  //   result = dt.parseToNearest("12:25");
  //   expect(result.format("HH:mm")).to.equal("12:30");
  // });
});
