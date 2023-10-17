Vue.component('exam-select', {
  props: ['value', 'labelname', 'name', 'inputclass', 'required', 'options', 'htmldescribed'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : '',
      htmlDescribed: this.htmldescribed 
      ? `<div style="font-size: 13px; opacity: 0.6">
          Score only shown if Total points is filled
        </div>` : '',
      OptData: Object.keys(this.options)
    }
  },
  template: `
            <div class="col-12 row" style="margin-top: 10px;">
              <div class="col-4">
                <label v-html="labelname + requiredMark" 
                style="margin-top:7px" class="purple-text">
                </label>
              </div>
              <div class="col-6">
                  <select 
                    class="custom-select mr-sm-2 form-control input-color" 
                    :id="name" 
                    :name="name" 
                    :value="value"
                    @input="handleInput"
                    @blur="handleInput"
                    >
                      <option v-for="(name, value) in OptData" v-if="!isNaN(name)"
                          v-bind:value="value">{{ options[name] }}</option>
                  </select>
                  <div v-html="htmlDescribed"></div>
              </div>
            </div>`,
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
      // call back
      if (typeof app.handleInput === 'function') {
        app.handleInput(e);
      }
      if (typeof app.validationMsg === 'function') {
        this.errormsg = app.validationMsg(this.fieldName, this.labelname);
      }
    }
  },
});

Vue.component('exam-select-box', {
  props: ['value', 'labelname', 'name', 'inputclass', 'required', 'options', 'htmldescribed'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : '',
      htmlDescribed: this.htmldescribed 
      ? `<div style="font-size: 13px; opacity: 0.6">
          Score only shown if Total points is filled
        </div>` : '',
      OptData: this.options
    }
  },
  template: `
            <div class="col-12 row" style="margin-top: 10px;">
              <div class="col-4">
                <label v-html="labelname + requiredMark" 
                style="margin-top:7px" class="purple-text">
                </label>
              </div>
              <div class="col-6">
                  <select 
                    class="custom-select mr-sm-2 form-control input-color truncate-select" 
                    :id="name" 
                    :name="name" 
                    :value="value"
                    @input="handleInput"
                    @blur="handleInput"
                    >
                      <option value=""></option>
                      <option v-for="item in OptData"
                          v-bind:value="item.id">{{ item.name }}</option>
                  </select>
                  <div v-html="htmlDescribed"></div>
              </div>
            </div>`,
  methods: {
    handleInput (e) {
      this.$emit('select', e.target.value);
      if (typeof app.validationMsg === 'function') {
        this.errormsg = app.validationMsg(this.fieldName, this.labelname);
      }
    }
  },
});

Vue.component('exam-select-box-object', {
  props: ['value', 'name', 'inputclass', 'required', 'options', 'htmldescribed', 'validateChildren', 'labelname'],
  data() {
    return {
      errormsg: '',
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : '',
      htmlDescribed: this.htmldescribed 
      ? `<div style="font-size: 13px; opacity: 0.6">
          Score only shown if Total points is filled
        </div>` : '',
      optData: this.options,
      optionList: ''
    }
  },
  template: `
            <div class="col-12 row">
              <div class="col-10">
                  <select 
                    class="custom-select mr-sm-2 form-control" 
                    :id="name" 
                    :name="name" 
                    @input="handleInput"
                    @blur="handleInput"
                    v-html="optionList"
                    >
                  </select>
                  <span class="red-text error-validate">{{ errormsg }}</span>
              </div>
            </div>`,
  methods: {
    handleInput (e) {
      this.$emit('select', e.target.value);
      var component = this.validateChildren ? app.$children[this.validateChildren] : app;
      if (typeof component.validationMsg === 'function') {
        this.errormsg = component.validationMsg(this.fieldName, this.labelname);
        showLineError(`[name="${this.fieldName}"]`, this.errormsg !== undefined);
      }
    }
  },
  created() {
    var value = this.value;
    var option = {};
    for (const key of Object.keys(this.optData)) {
      if (!isNaN(Number(key))) {
        let selected = '';
        if (option !== undefined && option.getValueForListKey === true) {
          if (value === this.optData[key]) {
            selected = 'selected';
          }
          this.optionList += `<option value="${this.optData[key]}" ${selected}>${this.optData[key]}</option>`;
        } else {
          if (Number(value) === Number(key)) {
            selected = 'selected';
          }
          this.optionList += `<option value="${key}" ${selected}>${this.optData[key]}</option>`;
        }
      }
    }
  }
});
