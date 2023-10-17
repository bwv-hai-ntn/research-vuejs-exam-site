Vue.component('exam-checked', {
  props: ['type', 'name', 'value', 'text', 'id', 'checkedflag'],
  data() {
    return {
    }
  },
  template: `
    <div>
      <label class="label-width-full">
        <div class="pointer">
         <input 
         class="pointer" 
         @focusin="focusInHander"
         @change="changeHander"
         :type="type" 
         :name="name" 
         :value="value" 
         :id="id" 
         :checked="checkedflag == 'checked'">
          <pre v-html="text"></pre>
        </div>
      </label>
    </div>
  `,
  methods: {
    focusInHander() {
      this.$emit('id-input-children', this.id);
    },
    changeHander(e) {
      this.$emit('id-input-children', undefined);
      var form = document.createElement('form');
      form.setAttribute('method', 'POST');
      var element = $('input[id="' + this.id + '"]').parent().parent().parent().parent();
      var copyElement = element.clone();
      form.appendChild(copyElement[0]);
      var data = app.getDataForm($(form));
      app.saveDataSingle(data, {
        type: 'checkbox',
        id: this.id
      });
    }
  }
});

Vue.component('exam-input', {
  props: ['value', 'labelname', 'name', 'inputclass', 'placeholder', 'id'],
  data() {
    return {
    }
  },
  template: `
    <div class="col-12">
      <input type="text"
       class="form-control" 
       @input="handleInput" 
       :value="value" 
       :id="id"
       @focusout="focusOutHander"
       @focusin="focusInHander"
       :class="inputclass" 
       :name="name" 
       :placeholder="placeholder">
      <div class="form-view__input__text__inline"></div>
    </div>
  `,
  methods: {
    focusInHander() {
      this.$emit('id-input-children', this.id);
    },
    focusOutHander(e) {
      this.$emit('id-input-children', undefined);
      var form = $('form:visible:first');
      var data = this.$root.$refs.button.getDataForm(form);
      this.$root.$refs.button.checkValidate(data);
      var validate = this.$root.$refs.button.checkValidate(data);
      if (!validate) {
        var index = this.id + '_';
        var answerText = {};
        answerText[index] = e.target.value;
        app.saveDataSingle({
          answerText
        }, {
          type: 'text',
          id: this.id
        });
      }
    },
    handleInput(e) {
      var form = $('form:visible:first');
      var data = this.$root.$refs.button.getDataForm(form);
      this.$root.$refs.button.checkValidate(data);
      this.$root.$refs.button.checkValidate(data);
    }
  }
});

Vue.component('exam-input-hidden', {
  props: ['value', 'name'],
  data() {
    return {
    }
  },
  template: `
    <input type="hidden" :name="name"" :value="value">
  `,
});

Vue.component('exam-button', {
  props: ['type', 'id', 'text'],
  data() {
    return {
    }
  },
  template: `
    <button :type="type" :id="id" v-on:click="handleButton">{{ text }}</button>
  `,
  created() {
    this.$root.$refs.button = this;
  },
  methods: {
    handleButton: function (e) {
      var form = $('form:visible:first');
      var btnBack = $('#btn-back');
      var btnNext = $('#btn-next');
      var btnSubmit = $('#btn-submit');
      var data = this.getDataForm(form);

      // when overTime dont check validate
      if(!btnSubmit.attr('timeleft') && this.checkValidate(data, true)) {
        return false;
      }

      switch (e.target.id) {
        case 'btn-back':
          form.addClass('hide');
          form.prev().removeClass('hide');
          // show button next
          btnNext.removeClass('hide');
          // hide button submit
          btnSubmit.addClass('hide');
          // hide button back
          if (!form.prev().prev().attr('exam-section-id')) {
            btnBack.addClass('hide');
          }
          // callback
          if (typeof app.countDown === 'function') {
            app.countDown();
          }
          window.scrollTo(0,0);
          btnBack.blur();
          break;
        case 'btn-next':
          form.addClass('hide');
          form.next().removeClass('hide');
          // show button back
          btnBack.removeClass('hide');
          // hide button next
          if (!form.next().next().attr('exam-section-id')) {
            btnNext.addClass('hide');
            // show button submit
            btnSubmit.removeClass('hide');
          }
          setCookie('nextFlag', true, 1);
          // callback
          if (typeof app.countDown === 'function') {
            app.countDown();
          }
          window.scrollTo(0,0);
          btnNext.blur();
          break;
        case 'btn-submit':
        default:
          break;
      }
      // set currentPage
      setCookie('currentPage', $('form:visible:first').index() - 2, 1);
      this.saveData(e.target.id);
    },
    getDataForm(form) {
      var paramObj = {};
      // convert data to object
      $.each(form.serializeArray(), function(_, kv) {
        if (typeof paramObj[kv.name] === 'string') {
          paramObj[kv.name] = [paramObj[kv.name], kv.value];
        } else if (typeof paramObj[kv.name] === 'object') {
          paramObj[kv.name] = [
            ...paramObj[kv.name],
            kv.value
          ];
        } else {
          paramObj[kv.name] = kv.value;
        }
      });
      // format object
      var data = {
        radio: {},
        checkbox: {},
        answerText: {},
     };
     
     for(var key of Object.keys(paramObj)) {
       if (key.split('_').length == 2) {
        var type = key.split('_')[0];
        var questionId = key.split('_')[1];
        data[type][`${questionId}_`] = paramObj[key];
       }
     };

     return data;
    },
    checkValidate(data, scroll = false) {
      app.errors.answerText = {};
      let errFlag = false;
      let answerTexts = data.answerText;
      let elScroll = false;
      
      let objKeys = Object.keys(answerTexts);
      if (objKeys.length) {
        for (const key of objKeys) {
          var inputName = '[name="answerText_'+parseInt(key)+'"]';
          if(`${answerTexts[key]}`.length > 400) {
            errFlag = true;
            app.errors.answerText[key] = validationMessage.maxlengthError('Answer', 400);
            if (elScroll === false) {
              elScroll = key;
            }

            app.showLineError(inputName, true);
          } else {
            app.showLineError(inputName, false);
          }
        }
      }

      // scroll to error
      if (elScroll && scroll == true) {
        $('[name="answerText_'+parseInt(elScroll)+'"]').closest('div.from-content')[0].scrollIntoView()
        $('[name="answerText_'+parseInt(elScroll)+'"]').focus();
      }

      return errFlag;
    },
    saveData(btnId) {
      showLoading();
      if (btnId === 'btn-submit') {
        // save answer
        $.ajax({
          type: "get",
          url: '/startTest/' + $('[access-key]').attr('access-key') + '?referer=testing',
          success: function (_res) {
            if ($('#btn-submit').attr('timeleft') === 'true') {
              hideLoading();
              // show popup timeleft
              $('#examModal').modal('show');
            } else {
              // redirect to endTest
              window.location.href = window.location.origin + '/endTest/' + $('[access-key]').attr('access-key');
            }
          },
          error: function(e) {
            window.location.href = window.location.origin + '/startTest/' + $('[access-key]').attr('access-key');
          },
        });
      } else {
        // hideLoading();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    }
  }
});

var examData = $('input[name=examHidden]').val() ?  JSON.parse($('input[name=examHidden]').val()) : [];

app = new Vue({
  el: '.vue-app',
  data: {
    errors: {
      answerText: {}
    },
    status: null,
    intervalCount: '',
    valueInputForcus: undefined,
  },
  mounted : function(){
    var lastSection = false;
    if (!$('form:visible:first').next().attr('exam-section-id')) {
      lastSection = true;
    }
    this.countDown(lastSection);
  },
  methods: {
    idInputChildren(id) {
      this.valueInputForcus = id;
    },
    showLineError: function(el, err) {
      if (err) {
        $(el).addClass('error');
        $(el).next('div.form-view__input__text__inline').addClass('line-red');
      } else {
        $(el).removeClass('error');
        $(el).next('div.form-view__input__text__inline').removeClass('line-red');
      }
    },
    switchAccount: function (e) {
      e.preventDefault();
      var form = document.createElement("form");
      form.method = "POST";
      form.action = "/login/google";
      document.body.appendChild(form);

      form.submit();
    },
    countDown: function(lastSection) {
      lastSection = typeof lastSection !== undefined ? lastSection : true;
      // set currentPage
      setCookie('currentPage', $('form:visible:first').index() - 2 , 1);
      var testTimeSetting = examData.testTimeSetting;
      var elCountDown = this.$refs.countdown;
      var that = this;
      if (elCountDown) {
        if (elCountDown.innerText == '00:00:00') {
          if ($('form:visible:first').next().attr('exam-section-id')) {
            lastSection = false;
          }
          if (testTimeSetting == 2 && !lastSection) {
            return false;
          }
          // set timeleft is true
          $('#btn-submit').attr('timeleft', 'true');
          $('#btn-submit').click();
          return false;
        } else {
          that.intervalCount = setInterval(function() {
            var currentTime = elCountDown.innerText;
            var newTime = moment(`0000-01-01 ${currentTime}`).add(-1, 'seconds').format('HH:mm:ss');
            // set new time
            elCountDown.innerText = newTime;
            // save to cookies
            setCookie('timeLeft', newTime, 1);
            // clear interval when count-down to 0
            if (newTime == '00:00:00') {
              clearInterval(that.intervalCount);
              if(testTimeSetting == 2 && !lastSection) {
                // click button btn-next
                $('#btn-next').click();
                return false;
              }
              // set timeleft is true
              $('#btn-submit').attr('timeleft', 'true');
              // click button submit
              if (that.valueInputForcus) {
                $('#' + that.valueInputForcus).blur();
                that.valueInputForcus = undefined;
                setTimeout(() => {
                  $('#btn-submit').click();
                }, 200);
                return false;
              } else {
                $('#btn-submit').click();
              }
              return false;
            }
          }, 1000)
        }
      }
    },
    handlerTimeout: function(e) {
      // redirect to endTest
      window.location.href = window.location.origin + '/endTest/' + $('[access-key]').attr('access-key');
    },
    denyEnter: function(e) {
      e.preventDefault();
      return false;
    },
    getElementIcon(infoElement) {
      var element = null;
      if (infoElement.type == 'checkbox') {
        element = $('input[id="' + infoElement.id + '"]').parent().parent().parent().parent().next();
      } else if (infoElement.type == 'text') {
        element = $('#' + infoElement.id).parent().parent().next();
      }
      return element;
    },
    async saveDataSingle(data, infoElement) {
      var that = this;
      var divShowIcon = this.getElementIcon(infoElement);
      var iconSuccess = `
      <label>
        <i class="fa fa-circle success-circle" aria-hidden="true">
          <i 
          class="fa fa-check success-check"
          aria-hidden="true"></i>
          </i>
        <span class="message-success">Your answer has been recorded.</span>
      </label>
      `;
      var iconSending = `
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom icon-sending" @click="handle"></i>
        <span class="message-sending">Sending...</span>`;
      var iconSendingFail = `
        <label class="status-message-icon" data-type="${infoElement.type}" data-id="${infoElement.id}">
          <i class="fa fa-circle fail-circle" aria-hidden="true">
          <span class="fail-check">!</span>
          </i>
          <span class="message-network">Sending failed!<br>Please check your network connection and press here to resend.</span>
        </label>`;
      var recodingFailed = `
        <label class="status-message-icon" data-type="${infoElement.type}" data-id="${infoElement.id}">
          <i class="fa fa-circle fail-circle" aria-hidden="true">
          <span class="fail-check">!</span>
          </i>
          <span class="message-network">Recording failed!<br>Please reload the page and try again, or contact administrator for support.</span>
        </label>`;
      try {
        $.ajax({
          type: "POST",
          url: "/process_testing",
          data,
          tryCountConnect: 0,
          tryCountSave: 0,
          beforeSend: function () {
            divShowIcon.html(iconSending);
          },
          success: function (response) {
            divShowIcon.html(iconSuccess);
          },
          error: function (xhr, textStatus, errorThrown) {
            if (errorThrown == '') {
              if (this.tryCountConnect < 3) {
                setTimeout(() => {
                  this.tryCountConnect++;
                  //try again
                  $.ajax(this);
                  return;
                }, 3000);
              } else {
                divShowIcon.html(iconSendingFail);
              }
            }
            if (errorThrown == 'Bad Request') {
              if (this.tryCountSave < 3) {
                setTimeout(() => {
                  this.tryCountSave++;
                  //try again
                  $.ajax(this);
                  return;
                }, 3000);
              } else {
                divShowIcon.html(recodingFailed);
              }
            }
          }
        });
      } catch (err) {
      }
    },
    getDataForm: function (form) {
      var paramObj = {};
      // convert data to object
      $.each(form.serializeArray(), function (_, kv) {
        if (typeof paramObj[kv.name] === 'string') {
          paramObj[kv.name] = [paramObj[kv.name], kv.value];
        } else if (typeof paramObj[kv.name] === 'object') {
          paramObj[kv.name] = [
            ...paramObj[kv.name],
            kv.value
          ];
        } else {
          paramObj[kv.name] = kv.value;
        }
      });
      // format object
      var data = {
        radio: {},
        checkbox: {},
        answerText: {},
      };

      for (var key of Object.keys(paramObj)) {
        if (key.split('_').length == 2) {
          var type = key.split('_')[0];
          var questionId = key.split('_')[1];
          data[type][`${questionId}_`] = paramObj[key];
        }
      };

      return data;
    },
  }
});

$(document).on('click', '.status-message-icon', function () {
  var type = $(this).data('type');
  var id = $(this).data('id');
  if (type && id) {
    if (type == 'text') {
      var index = id + '_';
      var answerText = {};
      answerText[index] = $(`input[id="${id}"]`).val();
      app.saveDataSingle({
        answerText
      }, {
        type,
        id
      });
    } else if (type == 'checkbox') {
      var form = document.createElement('form');
      form.setAttribute('method', 'POST');
      var element = $(this).parent().prev();
      var copyElement = element.clone();
      form.appendChild(copyElement[0]);
      var data = app.getDataForm($(form));
      app.saveDataSingle(data, {
        type,
        id
      });
    }
  }
});
