var examData = JSON.parse($('input[name=examData]').val());
var regexEmail = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
Vue.use(window.vuelidate.default);
const { required, maxLength } = window.validators

Vue.component('exam-input', {
  props: ['value', 'labelname', 'name', 'required', 'inputclass', 'placeholder'],
  data () {
    return {
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : ''
    }
  },
  template: `
    <div class="col-12">
      <label v-html="labelname + requiredMark">
      </label>
      <input type="text" class="form-control" :class="inputclass" :name="name" @blur="handleInput" @input="handleInput" :placeholder="placeholder">
      <div class="form-view__input__text__inline"></div>
    </div>
  `,
  methods: {
    handleInput (e) {
      app.errors = [];
      this.$emit('value', e.target.value);
      if (e.target.value.length == 0) {
        app.errors = [app.message.requiredError('Full name')];
      } else if (e.target.value.length > 100) {
        app.errors = [app.message.maxlengthError('Full name', 100)];
      }
      showLineError(e.target, app.errors.length == 1);
    }
  }
});

Vue.component('exam-button', {
  props: ['type', 'id', 'text'],
  data() {
    return {
    }
  },
  template: `
    <button :type="type" class="btn btn-info" :id="id">{{ text }}</button>
  `
});

Vue.component('exam-switch', {
  props: ['restrict', 'labelname', 'name', 'required'],
  data() {
    return {
      label: this.labelname,
      fieldName: this.name,
      currentState: false,
      errormsg: ''
    }
  },
  template: `
      <div class="col-12">
        <div>
          <label :class="{'active-switch': isActive}" class="toggle_button" style="margin-top: 7px;">
              <span v-if="isActive" class="toggle_label"></span>
              <span v-if="!isActive" class="toggle_label"></span>
              <input
                :value="currentState"
                name="isActiveSendEmail"
                type="checkbox"
                @click="currentState = !currentState"
              >
              <span class="toggle_switch"></span>
          </label>
          <span style="padding-left:10px"> Send result to my email.</span>
        </div>
        <div class="col-12" style="padding: 0px" v-if="restrict != 1 && currentState">
        <label>{{ label }}:</label><span style="color: red; padding-left: 3px">*Required</span>
        <input
        type="text"
        @input="handlerInput"
        @blur="handlerInput"
        :name="name" 
        placeholder="Please enter your email"
        class="form-control no-outline"
        >
          <div class="form-view__input__text__inline"></div>
         <span class="red-text error-validate">{{ errormsg }}</span>
        </div>
      </div>
  `,
  methods: {
    handlerInput(e) {
      this.$emit('input', e.target.value);
      if (typeof app.validationMsg === 'function') {
        this.errormsg = app.validationMsg(this.name, this.label);
        showLineError(`[name="${this.name}"]`, this.errormsg !== undefined);
      }
    }
  },
  computed: {
    isActive() {
      return this.currentState;
    }
  }
});


Vue.component('exam-select-box', {
  props: ['value', 'labelname', 'name', 'inputclass', 'required', 'options'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name,
      requiredMark: this.required ? '<span style="color: red; padding-left: 3px">*Required</span>' : '',
      optData: this.options,
      optionList: '<option value="" disabled selected>Please choose your country</option>'
    }
  },
  template: `
            <div class="col-12">
                <label v-html="labelname + ':' + requiredMark" 
                style="margin-top:7px">
                </label>
              <div class="col-6" style="padding: 0px">
                  <select 
                    class="custom-select mr-sm-2 form-control input-color truncate-select" 
                    :id="name" 
                    :name="name" 
                    :value="value"
                    @input="handleInput"
                    @blur="handleInput"
                    v-html="optionList"
                    >
                      <option value="" disabled selected>Please choose your country</option>
                  </select>
                  <span class="red-text error-validate">{{ errormsg }}</span>
              </div>
            </div>`,
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
      if (typeof app.validationMsg === 'function') {
        this.errormsg = app.validationMsg(this.fieldName, this.labelname);
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

app = new Vue({
  el: '.vue-app',
  data: {
    exam: examData,
    message: validationMessage,
    errors: [],
    data: {
      email: null,
    }
  },
  validations: {
    data: {
      email: {
        required,
        maxLength: maxLength(256),
        email(value) {
          if (value === '' || value === null) {
            return true;
          }
          return regexEmail.test(value);
        }
      }
    }
  },
  methods: {
    validationMsg: function (field, label) {
      return getValidationMsg(this.$v.data[field], label);
    },
    checkForm: function (e) {
      e.preventDefault();
      this.$v.$touch();
      // button continue, start new test
      if (e.submitter) {
        // continue
        if (e.submitter.id === 'btn-continue') {
          this.$refs.form.action = window.location.origin + window.location.pathname + '/continue';
          this.$refs.form.submit();
        // start new test
        } else if (e.submitter.id === 'btn-new-test') {
          this.$refs.form.action = window.location.origin + window.location.pathname + '/new-test';
          this.$refs.form.submit();
        }
      }
      var validate = false;
      inputEmail = $(this.$refs.form).find('[name="email"]');
      if (inputEmail.length > 0 && this.$v.data.email.$anyError) {
        validate = true;
        inputEmail.focus();
        inputEmail.blur();
        inputEmail.focus();
      }
      this.errors = [];
      let name = $(this.$refs.form).find('[name="name"]').val();
      let inputName = $(this.$refs.form).find('[name="name"]');
      if (name === undefined || name.length == 0) {
        this.errors.push(this.message.requiredError('Full name'));
      } else if (name.length > 100) {
        this.errors.push(this.message.maxlengthError('Full name', 100));
      }
      if (this.$refs.name !== undefined && this.errors.length) {
        showLineError(inputName, true);
        inputName.focus();
        return false;
      } else {
        showLineError(inputName, false);
      }
      if (validate) {
        return false;
      }
  
      showLoading();
      this.$refs.form.submit();
    },
    switchAccount: function (e) {
      e.preventDefault();
      console.log(this.$refs.switchAccount)
      this.$refs.switchAccount.submit();
    }
  },
});

function showLineError(el, err) {
  if (err) {
    $(el).next('div.form-view__input__text__inline').addClass('line-red');
  } else {
    $(el).next('div.form-view__input__text__inline').removeClass('line-red');
  }
}