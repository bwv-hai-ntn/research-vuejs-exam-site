Vue.component('exam-input', {
  props: ['value', 'labelname', 'name', 'inputclass', 'placeholder', 'required'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : ''
    }
  },
  template: `
      <div class="col-12 row" style="margin-top: 10px;">
        <div class="col-4">
            <label v-html="labelname + requiredMark" 
            style="margin-top:7px" class="purple-text">
            </label>
        </div>
        <div class="col-8">
          <input type="text"
          class="form-control no-outline input-color"
          :value="value" 
          @input="handleInput"
          :class="inputclass"
          :name="name"
          @blur="handleInput"
          v-on:keydown.enter.prevent="denyEnter"
          :placeholder="placeholder">
          <div class="form-view__input__text__inline"></div>
          <span class="red-text error-validate">{{ errormsg }}</span>
        </div>
      </div>`,
  methods: {
    handleInput (e) {
        this.$emit('input', e.target.value);
        // callback
        if (typeof app.handleInput === 'function') {
          app.handleInput(e);
        }

        if (typeof app.validationMsg === 'function') {
          this.errormsg = app.validationMsg(this.fieldName, this.labelname);
          showLineError(`[name="${this.fieldName}"]`, this.errormsg !== undefined);
        }
    },
    denyEnter: function(e) {
      e.preventDefault();
      return false;
    }
  }
});

Vue.component('input-from-to', {
  props: ['valuefrom', 'valueto', 'labelname', 'name', 'inputclass', 'placeholder', 'required'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      valFrom: this.valuefrom ? this.valuefrom : '',
      valTo: this.valueto ? this.valueto : '',
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : ''
    }
  },
  template: `
      <div class="col-12 row" style="margin-top: 10px;">
        <div class="col-4">
            <label v-html="labelname + requiredMark" 
            style="margin-top:7px" class="purple-text">
            </label>
        </div>
        <div class="col-4">
          <input type="number"
          class="form-control no-outline input-color"
          :value="valFrom" 
          @input="inputFrom"
          @keypress="onlyNumber"
          @blur="inputFrom"
          :class="inputclass"
          :name="name + 'From'"
          :placeholder="placeholder">
          <div class="form-view__input__text__inline"></div>
          <span class="red-text error-validate">{{ errormsg }}</span>
        </div>
        <span class="among">~</span>
        <div class="col-4">
          <input type="number"
          class="form-control no-outline input-color"
          :value="valTo" 
          @input="inputTo"
          @keypress="onlyNumber"
          @blur="inputTo"
          :class="inputclass"
          :name="name + 'To'"
          :placeholder="placeholder">
          <div class="form-view__input__text__inline"></div>
          <span class="red-text error-validate">{{ errormsg }}</span>
        </div>
      </div>`,
  methods: {
    onlyNumber: function (e) {
      if (!((e.which > 47 && e.which < 58)
        || e.which === 8)) {
        e.preventDefault();
      }
    },
    inputFrom: function(e) {
      this.$emit('input-from', e.target.value);
    },
    inputTo: function(e) {
        this.$emit('input-to', e.target.value);
    }
  }
});