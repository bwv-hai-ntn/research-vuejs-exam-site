Vue.component('exam-input-nolabel', {
  props: ['value', 'labelname', 'name', 'inputclass', 'placeholder', 'required', 'iconflag', 'colorclass'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : '',
      iconFlag: this.iconflag ? 
        (this.iconflag === 'true' ? 
        `<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-check2 green-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>` :
        `<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-x wrong-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`) : '',
    }
  },
  template: `
      <div class="col-12 row" :class="colorclass">
        <div class="col-10">
          <input type="text"
          class="form-control no-outline"
          :value="value" 
          @input="handleInput"
          :class="colorclass"
          :name="name"
          @blur="handleInput"
          disabled
          :placeholder="placeholder">
          <div class="form-view__input__text__inline"></div>
          <span class="red-text error-validate">{{ errormsg }}</span>
        </div>
        <label class="col-2" v-html="iconFlag" style="margin-top: 10px;"></label>
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
    }
  }
});

Vue.component('input-nolabel', {
  props: ['value', 'labelname', 'name', 'inputclass', 'placeholder', 'required', 'iconflag', 'colorclass', 'readonly', 'validateChildren'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : '',
      iconFlag: this.iconflag ? 
        (this.iconflag === 'true' ? 
        `<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-check2 green-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>` :
        `<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-x red-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`) : '',
    }
  },
  template: `
      <div class="col-12 row" :class="colorclass">
        <div class="col-10">
          <input type="text"
          class="form-control no-outline input-color"
          :value="value" 
          @input="handleInput"
          :class="colorclass"
          :name="name"
          @blur="handleInput"
          :readonly="readonly"
          :placeholder="placeholder">
          <div class="form-view__input__text__inline"></div>
          <span class="red-text error-validate" v-html="errormsg"></span>
        </div>
        <label class="col-2" v-html="iconFlag" style="margin-top: 10px;"></label>
      </div>`,
  methods: {
    handleInput: function(e) {
      this.$emit('input', e.target.value);
      var component = this.validateChildren ? app.$children[this.validateChildren] : app;
      if (typeof component.validationMsg === 'function') {
        this.errormsg = component.validationMsg(this.fieldName, this.labelname);
        showLineError(`[name="${this.fieldName}"]`, this.errormsg !== undefined);
      }
  }
  }
});
