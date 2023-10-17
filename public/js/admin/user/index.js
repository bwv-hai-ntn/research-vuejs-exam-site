Vue.use(window.vuelidate.default)
const { required, maxLength } = window.validators

app = new Vue({
  el: '#app-main',
  data: {
    user: {
      userName: '1'
    }
  },
  methods:{
    handleClick: function (e) {
      this.$v.$touch();
      console.log({
        error: this.$v.$error
      })
    },
    validationMsg: function (field) {
      const label = {
        userName: 'user name'
      }
      return getValidationMsg(this.$v.user[field], label[field]);
    }
  },
  validations: {
    user: {
      userName: {
        required,
        maxLength: maxLength(10)
      }
    }
  }
});