import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import nearest from "./dayjs-nearest.js";
import pattern from "./dayjs-pattern.js";
import utc from "dayjs/plugin/utc";
import validate from "./dayjs-validate.js";

dayjs.extend(customParseFormat);
dayjs.extend(nearest);
dayjs.extend(pattern);
dayjs.extend(utc);
dayjs.extend(validate);

export default dayjs;
