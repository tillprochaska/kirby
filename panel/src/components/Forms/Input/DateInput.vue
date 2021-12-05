<template>
  <k-text-input
    ref="input"
    v-bind="$props"
    :class="`k-${type}-input`"
    :placeholder="display"
    :spellcheck="false"
    :value="formatted"
    type="text"
    @blur="onBlur"
    @focus="$emit('focus')"
    @input="onInput"
    @invalid="onInvalid"
    @keydown.down.stop.prevent="onDown"
    @keydown.up.stop.prevent="onUp"
    @keydown.enter="onEnter"
    @keydown.tab="onTab"
  />
</template>

<script>
import { autofocus, disabled, id, required } from "@/mixins/props.js";

import { required as validateRequired } from "vuelidate/lib/validators";

export const props = {
  mixins: [autofocus, disabled, id, required],
  props: {
    /**
     * dayjs format to parse and display the datetime
     * @example `MM/DD/YY`
     */
    display: {
      type: String,
      default: "DD.MM.YYYY"
    },
    /**
     * The last allowed date
     * @example `2025-12-31 22:30:00`
     */
    max: String,
    /**
     * The first allowed date
     * @example `2020-01-01 01:30:00`
     */
    min: String,
    step: {
      type: Object,
      default() {
        return {
          size: 1,
          unit: "day"
        };
      }
    },
    type: {
      type: String,
      default: "date"
    },
    /**
     * The date must be provided as iso date string
     * @example `2012-12-12 22:33:00`
     */
    value: String
  }
};

/**
 * @example <k-input v-model="date" type="date" name="date" />
 */
export default {
  mixins: [props],
  inheritAttrs: false,
  data() {
    return {
      // convert ISO string from props to dayjs object
      dt: this.toDatetime(this.value),
      temp: null
    };
  },
  computed: {
    /**
     * DOM input element
     */
    input() {
      return this.$refs.input.$refs.input;
    },
    /**
     * Formatted string for datetime object
     */
    formatted() {
      return this.pattern.format(this.dt);
    },
    /**
     * dayjs object for current value of input element
     * (rounded to nearest step)
     */
    parsed() {
      let dt = this.pattern.interpret(this.temp);

      console.log(this.vvalue);

      if (dt) {
        dt = dt.nearest(this.step.unit, this.step.size);
      }

      return dt;
    },
    /**
     * dayjs pattern class for `display` pattern
     */
    pattern() {
      return this.$library.dayjs.pattern(this.display);
    },
    /**
     * Pattern part for current cursor selection in input
     */
    selected() {
      return this.pattern.at(
        this.input.selectionStart,
        this.input.selectionEnd
      );
    }
  },
  watch: {
    value(value) {
      this.dt = this.toDatetime(value);
      this.onInvalid();
    }
  },
  mounted() {
    this.onInvalid();
  },
  methods: {
    /**
     * Helper method to emit values in ISO format
     * @param {string} event to be emitted
     * @param {Object} dt dayjs object to emit
     */
    emit(event, dt = this.dt) {
      const iso = this.pattern.iso(dt);
      this.$emit(event, iso);
    },
    /**
     * Focuses the input element
     * @public
     */
    focus() {
      this.$refs.input.focus();
    },
    /**
     * Increment/decrement the current dayjs object based on the
     * cursor position in the input element and ensuring steps
     * @param {string} operator `add` or `substract`
     * @public
     */
    manipulate(operator) {
      // since manipulation command can occur
      // while typing new value, make sure to
      // first commit current input value to `dt` object
      this.dt = this.parsed;

      // if no parsed result exist, use current datetime
      if (this.dt === null) {
        this.dt = this.dayjs().nearest(...this.step);
        this.emit("update");
        return;
      }

      // what unit to alter and by how much:
      // as default use the step unit and size
      let unit = this.step.unit;
      let size = this.step.size;

      // if a part in the input is selected,
      // manipulate that part
      if (this.selected !== null) {
        // handle  meridiem to toggle between am/pm
        // instead of e.g. skipping to next day
        if (this.selected.unit === "meridiem") {
          operator = this.dt.format("a") === "pm" ? "subtract" : "add";
          unit = "hour";
          size = 12;
        } else {
          // handle manipulation of all other units
          unit = this.selected.unit;

          // only use step size for step unit,
          // otherwise use size of 1
          if (unit !== this.step.unit) {
            size = 1;
          }
        }
      }

      // change `dt` by determined size and unit
      // and emit as `update` event
      this.dt = this.dt[operator](size, unit);
      this.emit("update");
    },
    /**
     * When blurring the input, commit its
     * parsed value as datetime object
     */
    onBlur() {
      this.dt = this.parsed;
      this.emit("update");
    },
    /**
     * Decrement the currently
     * selected input part
     * @public
     */
    onDown() {
      this.manipulate("subtract");
    },
    /**
     * When hitting enter, blur the input
     * but also emit additional event
     */
    onEnter() {
      this.onBlur();
      this.emit("enter");
    },
    /**
     * When input value changes, emit
     * parsed dayjs object without committing
     * it yet to own data `dt` variable
     */
    onInput(input) {
      this.temp = input;
      this.emit("input", this.parsed);
    },
    onInvalid($invalid, $v) {
      this.$emit("invalid", $invalid || this.$v.$invalid, $v || this.$v);
    },
    /**
     * Increment the currently
     * selected input part
     * @public
     */
    onUp() {
      this.manipulate("add");
    },
    /**
     * Handle tab key in input
     *
     * a. cursor is somewhere in the input, no selection
     *    => select the part where the cursor is located
     * b. cursor selection already covers a part fully
     *    => select the next part
     * c. cursor selection covers more than one part
     *    => select the last affected part
     * d. cursor selection cover last part
     *    => tab should blur the input, focus on next tabbale element
     */
    onTab(event) {
      if (
        this.selected.start === this.$refs.input.$refs.input.selectionStart &&
        this.selected.end === this.$refs.input.$refs.input.selectionEnd
      ) {
        if (this.selected.index === this.pattern.parts.length - 1) {
          return;
        }

        this.select(this.pattern.parts[this.selected.index + 1]);
      } else {
        this.select();
      }

      // prevent event and propagation
      // so that the focus does not move out of input
      event.preventDefault();
      event.stopPropagation();
    },
    /**
     * Sets the cursor selection in the input element
     * that includes the provided part
     * @param {Object} part
     * @public
     */
    select(part) {
      if (!part) {
        part = this.selected;
      }

      this.input.setSelectionRange(part.start, part.end + 1);
    },
    /**
     * Converts ISO string to dayjs object
     * @param {string} string
     * @public
     */
    toDatetime(string) {
      return this.$library.dayjs.utc(string, "YYYY-MM-DD HH:mm:ss");
    }
  },
  validations() {
    return {
      value: {
        min: this.min
          ? (value) =>
              this.$library.dayjs
                .utc(value)
                .validate(this.min, "isAfter", this.step.unit)
          : true,
        max: this.max
          ? (value) =>
              this.$library.dayjs
                .utc(value)
                .validate(this.max, "isBefore", this.step.unit)
          : true,
        required: this.required ? validateRequired : true
      }
    };
  }
};
</script>
