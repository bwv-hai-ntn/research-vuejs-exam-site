Vue.component('exam-number', {
  props: ['value', 'labelname', 'name', 'inputclass', 'placeholder', 'required', 'recalculateflag', 'textsub'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : '',
      recalculateButton: this.recalculateflag 
      ? `<button type="button" class="btn btn-info" id="btn-recalculate" v-on:click="recalculateHandle">
          Recalculate points
          </button>
          <div style="font-size: 13px; opacity: 0.6; text-align: center;">
            Auto-grading based on assigned point values
          </div>` : ''
    }
  },
  template: `
      <div class="col-12 row" style="margin-top: 10px;">
        <div class="col-4">
          <label v-html="labelname + requiredMark" 
          style="margin-top:7px" class="purple-text">
          </label>
        </div>
        <div class="col-2">
          <input type="number"
            step=any
            min=0
            class="form-control no-outline input-color"
            :value="value" 
            @input="handleInput"
            :class="inputclass"
            :name="name"
            @blur="handleInput"
            @keypress="onlyNumber"
            :placeholder="placeholder"
          >
          <div class="form-view__input__text__inline"></div>
        </div>
        <span style="margin-top: 7px;">{{ textsub }}</span>
        <div class="col-5" v-html="recalculateButton" style="text-align: center;"></div>
        <div class="col-12 row">
          <div class="col-4"></div>
          <div class="col-8">
            <span class="red-text error-validate">{{ errormsg }}</span>
          </div>
        </div>
      </div>`,    
  mounted(e) {
    $('#btn-recalculate').click(function(){
      // callback
      if (typeof app.handleInput === 'function') {
        app.recalculateHandle(e);
      }
    });
  },
  methods: {
    onlyNumber: function(e) {
      if(!((e.which > 47 && e.which < 58) 
        || e.which === 8)) {
          e.preventDefault();
      }
    },
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