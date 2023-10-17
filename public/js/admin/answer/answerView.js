var answerData = $('input[name=answerData]').val() ?  JSON.parse($('input[name=answerData]').val()) : [];
const examIdHidden =  $('input[name=examIdHidden]').val();
const answerIdHidden =  $('input[name=answerIdHidden]').val();

Vue.use(window.vuelidate.default)
const { required, maxLength } = window.validators

if(answerData !== null) {
  app = new Vue({
    el: '.vue-app',
    data: {
      admin: {
        
      },
    },
    // when page loaded
    mounted() {
      // fill examQuestionPoints
      var form = $('.sectionForm:visible:first');
      var examQuestionPoints = JSON.parse(form.find('input[name=examQuestionPoints]').val());
      var answersPoints = JSON.parse(form.find('input[name=answersPoints]').val());
      form.find('#pointsSection').html(answersPoints + ' of ' + examQuestionPoints + ' points');
    },
    methods:{
      handleClick: function (e) {
        this.$v.$touch();
      },
      handleButton: function (e) {
        var form = $('.sectionForm:visible:first');
        var btnBack = $('#btn-back');
        var btnNext = $('#btn-next');
        switch (e.target.id) {
          case 'btn-back':
            form.addClass('hide');
            form.prev().removeClass('hide');
            // show button next
            btnNext.removeClass('hide');
            // hide button back
            if (!form.prev().prev().attr('exam-section-id')) {
              btnBack.addClass('hide');
            }
            window.scrollTo(0,0);
            btnBack.blur();
            // set currentPage
            setCookie('currentPageView', $('.sectionForm:visible:first').index() - 1, 1);
            showLoading();
            window.location.href = window.location.origin + '/admin/answer/' + answerIdHidden + '/view';
            break;
          case 'btn-next':
            form.addClass('hide');
            form.next().removeClass('hide');
            // show button back
            btnBack.removeClass('hide');
            // hide button next
            if (!form.next().next().attr('exam-section-id')) {
              btnNext.addClass('hide');
            }
            window.scrollTo(0,0);
            btnNext.blur();
            // set currentPage
            setCookie('currentPageView', $('.sectionForm:visible:first').index() - 1, 1);
            showLoading();
            window.location.href = window.location.origin + '/admin/answer/' + answerIdHidden + '/view';
            break;
          case 'list_btn':
              // show popup section view
              $('#examModal').modal('show');
            break;
          case 'backtolist_btn':
              // redirect to ExamList
              window.location.href = window.location.origin + '/admin/answer/' + examIdHidden;
              break;
          case 'copy_btn':
              // copy exam
              showLoading();
              this.$refs.form.action = window.location.origin + '/admin/examSettings/' + examIdHidden + '/copy';
              this.$refs.form.submit();
              break;
            case 'delete_btn':
              // Delete exam
              this.$refs.form.action = window.location.origin + '/admin/examSettings/' + examIdHidden + '/delete';
              this.$refs.form.submit();
              break;
            case 'revert_btn':  
              // Revert exam
              this.$refs.form.action = window.location.origin + '/admin/examSettings/' + examIdHidden + '/revert';
              this.$refs.form.submit();
              break;
          default:
            break;
        }
      },
      validationMsg: function (field, label) {
        return getValidationMsg(this.$v.admin[field], label);
      },
      handleClickTitle: function(e) {
        // close popup
        $('#examModal').modal('hide');
        var form = $('form:visible:first');
        var btnBack = $('#btn-back');
        var btnNext = $('#btn-next');
        form.addClass('hide');
        // hide button next
        if (!form.next().next().attr('exam-section-id')) {
          btnNext.addClass('hide');
        }
        // hide button back
        if (!form.prev().prev().attr('exam-section-id')) {
          btnBack.addClass('hide');
        }
        // set currentPage
        setCookie('currentPageView', e.target.id, 1);
        showLoading();
        window.location.href = window.location.origin + '/admin/answer/' + answerIdHidden + '/view';
      },
      checkForm: function (e) {
        e.preventDefault();
      }
    },
    validations: {
      admin: {
      }
    }
  });
}

function showLineError(el, err) {
  if (err) {
    $(el).next('div.form-view__input__text__inline').addClass('line-red');
  } else {
    $(el).next('div.form-view__input__text__inline').removeClass('line-red');
  }
}