var examData = $('input[name=examData]').val() ?  JSON.parse($('input[name=examData]').val()) : [];
var anwserData = $('input[name=anwserData]').val() ?  JSON.parse($('input[name=anwserData]').val()) : [];
var bodyData = $('input[name=bodyData]').val() ?  JSON.parse($('input[name=bodyData]').val()) : [];
var afterSubmissionOpt = $('input[name=afterSubmissionOpt]').val() ?  JSON.parse($('input[name=afterSubmissionOpt]').val()) : [];
var onOffOpt = $('input[name=onOffOpt]').val() ?  JSON.parse($('input[name=onOffOpt]').val()) : [];
var userAuthor = $('input[name=userAuthor]').val() ?  JSON.parse($('input[name=userAuthor]').val()) : '';
var testTimeSettingOpt = $('input[name=testTimeSettingOpt]').val() ?  JSON.parse($('input[name=testTimeSettingOpt]').val()) : [];
// create array of value item After submission
let afterSubmissionOptVal = [];
Object.keys(afterSubmissionOpt).forEach(function(i,val){
  if(!isNaN(i)) {
    afterSubmissionOptVal.push(parseInt(i));
  }
})

// create array of value item Test time setting
let testTimeSettingOptVal = [];
Object.keys(testTimeSettingOpt).forEach(function(i,val){
  if(!isNaN(i)) {
    testTimeSettingOptVal.push(parseInt(i));
  }
});

Vue.use(window.vuelidate.default)
const { required, maxLength, duplicate } = window.validators

if(examData !== null) {
  app = new Vue({
    el: '.vue-app',
    data: {
      admin: {
          title: bodyData.title ? bodyData.title : examData.title,
          accessKey: bodyData.accessKey ? bodyData.accessKey : examData.accessKey,
          imagePath: bodyData.imagePath ? bodyData.imagePath : examData.imagePath,
          description: bodyData.description ? bodyData.description : examData.description,
          userRestrict: bodyData.userRestrict ? bodyData.userRestrict : examData.userRestrict,
          testTimeSetting: bodyData.testTimeSetting ? bodyData.testTimeSetting : (examData.testTimeSetting ? (testTimeSettingOptVal.includes(examData.testTimeSetting) ? examData.testTimeSetting : 0) : 0),
          testTime: bodyData.testTime ? bodyData.testTime : examData.testTime,
          totalPoints: bodyData.totalPoints ? bodyData.totalPoints : examData.totalPoints,
          passPercentage: bodyData.passPercentage ? bodyData.passPercentage : examData.passPercentage,
          showResult: bodyData.showResult ? bodyData.showResult : (examData.showResult ? (afterSubmissionOptVal.includes(examData.showResult) ? examData.showResult : 0) : 0),
          endMessage: bodyData.endMessage ? bodyData.endMessage : examData.endMessage,
          acceptAnswer: bodyData.title ? (bodyData.acceptAnswer ? onOffOpt.ON : onOffOpt.OFF) : examData.acceptAnswer,
          signinRestrict: bodyData.title ? (bodyData.signinRestrict ? onOffOpt.ON : onOffOpt.OFF) : examData.signinRestrict,
          limitResponse: bodyData.title ? (bodyData.limitResponse ? onOffOpt.ON : onOffOpt.OFF) : examData.limitResponse,
          shuffleQuestion: bodyData.title ? (bodyData.shuffleQuestion ? onOffOpt.ON : onOffOpt.OFF) : examData.shuffleQuestion,
          shuffleOption: bodyData.title ? (bodyData.shuffleOption ? onOffOpt.ON : onOffOpt.OFF) : examData.shuffleOption,
          permission: userAuthor,
          resultValidity: bodyData.resultValidity ? bodyData.resultValidity : examData.resultValidity,
          categories: null
      },
    },
    // when page loaded
    mounted() {
      if(anwserData !== null) {
        // show popup continueEditConfirm
        $('#examModal').modal('show');
      }
      // value of Access URL
      if($('input[name=accessKey]').val()) {
        $('input[name=urlStartTest]').val(window.location.origin + '/startTest/' + $('input[name=accessKey]').val());
      }
      // process of Passing percentage
      if(!$('input[name=totalPoints]').val()) {
        $('input[name=passPercentage]').prop('disabled', true).val("");
        $('input[name=passPercentage]').parents('div.col-12.row').find('label').addClass('disabled-text');
        $('input[name=passPercentage]').parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled');
      }
      // process of Total test time
      var testTime = $('input[name=testTime]');
      if($('select[name=testTimeSetting]').val() != testTimeSettingOpt['Set based on test']) {
        testTime.prop('disabled', true).val("");
        testTime.parents('div.col-12.row').find('label').addClass('disabled-text').find('span').addClass('disabled-text');;
        testTime.parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled').removeClass('line-red');
      }
       // process of Result validity
      if ($('select#showResult option:selected').val() != 2 && $('select#showResult option:selected').val() != 3) {
        $('input[name=resultValidity]').prop('disabled', true).val("");
        $('input[name=resultValidity]').parents('div.col-12.row').find('label').addClass('disabled-text');
        $('input[name=resultValidity]').parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled');
      }
    },
    methods:{
      handleClick: function (e) {
        this.$v.$touch();
      },
      handleButton: function (e) {
        // process submit button
        switch (e.target.id) {
          case 'cancel_btn':
            // redirect to ExamList
            showLoading();
            window.location.href = window.location.origin + '/admin/exam';
            break;
          case 'copy_btn':
            // copy exam
            showLoading();
            this.$refs.form.action = window.location.origin + '/admin/examSettings/' + examData.id + '/copy';
            this.$refs.form.submit();
            break;
          case 'delete_btn':
            // Delete exam
            showLoading();
            this.$refs.form.action = window.location.origin + '/admin/examSettings/' + examData.id + '/delete';
            this.$refs.form.submit();
            break;
          case 'revert_btn':
            // Revert exam
            showLoading();
            this.$refs.form.action = window.location.origin + '/admin/examSettings/' + examData.id + '/revert';
            this.$refs.form.submit();
            break;
          default:
            break;
        }
      },
      handleInput (e) {
        switch (e.target.name) {
          case 'accessKey':
            if(e.target.value) {
              $('input[name=urlStartTest]').val(window.location.origin + '/startTest/' + e.target.value);
            } else {
              $('input[name=urlStartTest]').val("");
            }
            break;
          case 'totalPoints':
            // process of Passing percentage
            var passPercentage = $('input[name=passPercentage]');
            if(e.target.value) {
              passPercentage.prop('disabled', false);
              passPercentage.parents('div.col-12.row').find('label').removeClass('disabled-text');
              passPercentage.parents('div.col-12.row').find('.form-view__input__text__inline').removeClass('form-view__input__text__inline_disabled');
            } else {
              passPercentage.prop('disabled', true).val("");
              passPercentage.parents('div.col-12.row').find('label').addClass('disabled-text');
              passPercentage.parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled');
            }
            break;
          case 'testTimeSetting':
            // process of Total test time
            var testTime = $('input[name=testTime]');
            if(e.target.value != testTimeSettingOpt['Set based on test']) {
              setTimeout(() => {
                testTime.prop('disabled', true).val('');
              }, 100);
              testTime.parents('div.col-12.row').find('label').addClass('disabled-text').find('span').addClass('disabled-text');
              testTime.parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled').removeClass('line-red');
              for (const field of Object.values(this.$children)) {
                if (field.fieldName === 'testTime') {
                  field.errormsg = '';
                }
              }
            } else {
              // bug #79753
              setTimeout(() => {
                if (testTime.val() === null || testTime.val() === undefined || testTime.val() === '') {
                  cursorFocus(testTime);
                  testTime.blur();
                }
              }, 100);
              testTime.prop('disabled', false);
              testTime.parents('div.col-12.row').find('label').removeClass('disabled-text').find('span').removeClass('disabled-text');;
              testTime.parents('div.col-12.row').find('.form-view__input__text__inline').removeClass('form-view__input__text__inline_disabled');
            }
            break;
          case 'showResult':
            var resultValidity = $('input[name=resultValidity]');
            if (e.target.value != 2 && e.target.value != 3) {
              this.$v.admin.resultValidity.$reset();
              resultValidity.prop('disabled', true).val("");
              resultValidity.parents('div.col-12.row').find('label').addClass('disabled-text');
              resultValidity.parents('div.col-12.row').find('.form-view__input__text__inline').addClass('form-view__input__text__inline_disabled');
            } else {
              resultValidity.prop('disabled', false);
              resultValidity.parents('div.col-12.row').find('label').removeClass('disabled-text');
              resultValidity.parents('div.col-12.row').find('.form-view__input__text__inline').removeClass('form-view__input__text__inline_disabled');
            }
            break;
          case 'testTime':
            break;
          case 'passPercentage':
            break;
          default:
            break;
        }
      },
      validationMsg: function (field, label) {
        return getValidationMsg(this.$v.admin[field], label);
      },
      handlerContinute: function(e) {
        // close popup
        $('#examModal').modal('hide');
      },
      handlerBackToExam: function(e) {
        // redirect to ExamList
        window.location.href = window.location.origin + '/admin/exam';
      },
      copyToClipboard: function(inpuId) {
        var copyText = document.getElementById(inpuId);
        var textArea = document.createElement("textarea");
        textArea.value = copyText.value;
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        document.execCommand("copy");
        textArea.remove();
      },
      recalculateHandle: function(e) {
        if(examData.id) {
          $.ajax({
            type: "get",
            dataType: 'json',
            url: '/admin/examSettings/recalculate/' + examData.id,
            success: function (res) {
              $('input[name=totalPoints]').val(res);
              var passPercentage = $('input[name=passPercentage]');
              passPercentage.prop('disabled', false);
              passPercentage.parents('div.col-12.row').find('label').removeClass('disabled-text');
              passPercentage.parents('div.col-12.row').find('.form-view__input__text__inline').removeClass('form-view__input__text__inline_disabled');
            },
            error: function(e) {
              console.log(e);
            },
          });
        }
      },
      checkForm: function (e) {
        e.preventDefault();
        if (e.submitter) {
          if (e.submitter.id === 'submit_btn') {
            // validate when submit
            this.$v.$touch();
            if (this.$v.admin.$error === true) {
              let firstError = '';
              for (const field of Object.keys(this.$v.admin)) {
                if (this.$v.admin[field] && this.$v.admin[field].$error === true) {
                  // Test time setting != 1 not check require Total points
                  if (field === 'testTime') {
                    if ($('select[name=testTimeSetting]').val() != testTimeSettingOpt['Set based on test']) {
                      continue;
                    }
                  }
                  firstError = firstError === '' ? field : firstError;
                  if (field === 'categories') {
                    $('#catogoties-btn').click();
                    $('#modify-btn').focus();
                  }
                  $(`[name="${field}"]`).focus();
                  $('#modify-btn').focus();
                  $(`[name="${field}"]`).focus();
                }
              }
              if (firstError !== "") {
                $(`[name="${firstError}"]`).focus();
                return false;
              }
            }
            // update or create exam
            this.$refs.form.action = window.location.pathname + '/update';
            this.$refs.form.submit();
          }
        }
      },
      onSaveData(constCbxCategory, cbxCategory) {
        $('#constCbxCategoryData').val(constCbxCategory);
        $('#cbxCategoryData').val(cbxCategory);
        if (this.admin.permission == 'AUTHOR') {
          this.admin.categories = cbxCategory;
        }
      },
      onCbxCategories(cbxCategory) {
        this.admin.categories = cbxCategory;
        if (this.admin.permission == 'ADMIN') {
          this.admin.categories = 'ADMIN';
        }
      },
      closeMessage: function(e) {
        $(document).find(".mess-submit").addClass('hide');
      }
    },
    validations: {
      admin: {
        title: {
          required,
          maxLength: maxLength(100)
        },
        accessKey: {
          required,
          maxLength: maxLength(100)
        },
        imagePath: {
          maxLength: maxLength(256)
        },
        description: {},
        userRestrict: {
          maxLength: maxLength(256)
        },
        testTimeSetting: {},
        testTime: {
          required,
          maxLength: maxLength(9)
        },
        resultValidity: {
          maxLength: maxLength(4)
        },
        totalPoints: {
          maxLength: maxLength(9)
        },
        passPercentage: {
          maxLength: maxLength(9)
        },
        showResult: {},
        endMessage: {},
        acceptAnswer: {},
        signinRestrict: {},
        limitResponse: {},
        shuffleQuestion: {},
        shuffleOption: {},
        categories: {
          required
        }
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

function cursorFocus(elem) {
  var x = window.scrollX;
  var y = window.scrollY;
  elem.focus();
  window.scrollTo(x, y);
}
