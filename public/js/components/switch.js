Vue.component('exam-switch', {
  props: ['disabled', 'id', 'defaultstate', 'name', 'value', 'defaultvalue'],
  data() {
    return {
      currentState: (this.defaultvalue !== null && this.defaultvalue !== undefined) ? (this.defaultvalue !== 1 ? 0 : this.defaultvalue) : this.defaultstate,
    }
  },
  template: `
    <label :for="id + '_button'" :class="{'active-switch': isActive}" class="toggle_button" style="margin-top: 7px;">
        <span v-if="isActive" class="toggle_label"></span>
        <span v-if="!isActive" class="toggle_label"></span>
        <input 
          type="checkbox" 
          :id="id + '_button'" 
          :name="name" 
          @click="handleClick"
          v-model="checkedValue"
        >
        <span class="toggle_switch"></span>
    </label>
  `,
  methods:{
    handleClick: function (e) {
      // handel click signinRestrict
      if(this.name === 'signinRestrict') {
        var userRestrict = $('input[name=userRestrict]');
        var limitResponse = $('input[name=limitResponse]');
        if(this.currentState) {
          // Restrict domain
          userRestrict.prop('disabled', true).val("");
          userRestrict.parents('div.col-12.row').find('label').addClass('disabled-text');
          userRestrict.parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled');
          // Limit to 1 response
          limitResponse.prop('disabled', true);
          limitResponse.parents('div.col-12.row').find('label').addClass('disabled-text');
          limitResponse.parents('label.toggle_button').removeClass('active-switch');
        } else {
          // Restrict domain
          userRestrict.prop('disabled', false);
          userRestrict.parents('div.col-12.row').find('label').removeClass('disabled-text');
          userRestrict.parents('div.col-12.row').find('.form-view__input__text__inline').removeClass('form-view__input__text__inline_disabled');
          // Limit to 1 response
          limitResponse.prop('disabled', false);
          limitResponse.parents('div.col-12.row').find('label').removeClass('disabled-text');
        }
      }
      if (typeof app.handleClick === 'function')
        app.handleClick(e)
    }
  },
  mounted() {
    // disabled elemnt when Requires sign in OFF
    if (this.name === "signinRestrict") {
      if(!this.currentState) {
        // Restrict domain
        $('input[name=userRestrict]').prop('disabled', true).val("");
        $('input[name=userRestrict]').parents('div.col-12.row').find('label').addClass('disabled-text');
        $('input[name=userRestrict]').parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled');
        // Limit to 1 response
        $('input[name=limitResponse]').prop('disabled', true);
        $('input[name=limitResponse]').parents('div.col-12.row').find('label').addClass('disabled-text');
      }
    }
  },
  computed: {
    isActive() {
      return this.currentState;
    },
    checkedValue: {
      get() {
        return this.currentState;
      },
      set(newValue) {
        this.currentState = newValue;
        this.val = 1;
        this.$emit('change', newValue);
      }
    }
  }
});