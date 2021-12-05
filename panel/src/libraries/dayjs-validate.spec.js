import dayjs from "./dayjs.js";

describe("dayjs.validate()", () => {
  it("no parameters", () => {
    expect(dayjs().validate()).to.equal(true);
    expect(dayjs("Invalid").validate()).to.equal(false);
  });

  it("invalid dayjs object", () => {
    expect(dayjs("Invalid").validate("2020-01-01")).to.equal(false);
  });

  it("min by day", () => {
    let result;
    result = dayjs("2020-01-05").validate("2020-01-05", "isAfter");
    expect(result).to.equal(true);
    result = dayjs("2020-01-06").validate("2020-01-05", "isAfter");
    expect(result).to.equal(true);
    result = dayjs("2020-01-04").validate("2020-01-05", "isAfter");
    expect(result).to.equal(false);
  });

  it("min by month", () => {
    let result;
    result = dayjs("2020-01-05").validate("2020-01-05", "isAfter", "month");
    expect(result).to.equal(true);
    result = dayjs("2020-01-06").validate("2020-01-05", "isAfter", "month");
    expect(result).to.equal(true);
    result = dayjs("2020-01-04").validate("2020-01-05", "isAfter", "month");
    expect(result).to.equal(true);
    result = dayjs("2019-12-12").validate("2020-01-05", "isAfter", "month");
    expect(result).to.equal(false);
  });

  it("max by day", () => {
    let result;
    result = dayjs("2020-01-05").validate("2020-01-05", "isBefore");
    expect(result).to.equal(true);
    result = dayjs("2020-01-06").validate("2020-01-05", "isBefore");
    expect(result).to.equal(false);
    result = dayjs("2020-01-04").validate("2020-01-05", "isBefore");
    expect(result).to.equal(true);
  });

  it("max by month", () => {
    let result;
    result = dayjs("2020-01-05").validate("2020-01-05", "isBefore", "month");
    expect(result).to.equal(true);
    result = dayjs("2020-01-06").validate("2020-01-05", "isBefore", "month");
    expect(result).to.equal(true);
    result = dayjs("2020-01-04").validate("2020-01-05", "isBefore", "month");
    expect(result).to.equal(true);
    result = dayjs("2020-02-12").validate("2020-01-05", "isBefore", "month");
    expect(result).to.equal(false);
  });

  it("time-only", () => {
    let result;
    result = dayjs("2020-01-05 15:05:00").validate(
      "15:05:00",
      "isBefore",
      "second"
    );
    expect(result).to.equal(true);
    result = dayjs("2020-01-05 15:00:00").validate(
      "15:05:00",
      "isBefore",
      "second"
    );
    expect(result).to.equal(true);
    result = dayjs("2020-01-05 15:10:00").validate(
      "15:05:00",
      "isBefore",
      "second"
    );
    expect(result).to.equal(false);
  });
});
