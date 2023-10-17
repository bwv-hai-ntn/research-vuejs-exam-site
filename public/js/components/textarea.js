Vue.component('exam-textarea', {
  props: ['value', 'labelname', 'name', 'required', 'customclass'],
  data() {
    return {
      rows: 1,
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
          <textarea 
            type="text" 
            class="form-control no-outline input-color"
            :class=customclass
            :rows="rows"
            :name="name"
            :value="value"
            @input="handleInput"
            @blur="handleInput"
          >
          </textarea>
          <div class="form-view__input__text__inline"></div>
          <span class="red-text error-validate">{{ errormsg }}</span>
      </div>
    </div>`,
  mounted() {
    // set height textarea follow text
    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  },
  beforeMount() {
    if (typeof this.value == 'string') {
      this.rows = (this.value.match(/\n/g) || []).length + 1;
    }
  },
  methods: {
    handleInput (e) {
      this.$emit('input', e.target.value);
      if (typeof e.target.value == 'string') {
        this.rows = (e.target.value.match(/\n/g) || []).length + 1;
      }
      if (typeof app.validationMsg === 'function') {
        this.errormsg = app.validationMsg(this.fieldName, this.labelname);
        showLineError(`[name="${this.fieldName}"]`, this.errormsg !== undefined);
      }
    }
  }
});