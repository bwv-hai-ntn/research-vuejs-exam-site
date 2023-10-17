Vue.component('section-textarea', {
  props: ['value', 'placeholder', 'customclass', 'error', 'labelname', 'table', 'column', 'question'],
  data() {
    return {
      rows: 1,
      errormsg: ''
    }
  },
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
    handleBlur(e) {
      this.handleMain(e);
    },
    handleInput: _.debounce(function (e) {
      this.handleMain(e);
    }, 1000),
    handleMain(e) {
      this.$emit('input', e.target.value);
      let value = '';
      if (typeof e.target.value == 'string') {
        this.rows = (e.target.value.match(/\n/g) || []).length + 1;
        value = e.target.value.replace(/\r\n/g, '\n');
      }

      this.errormsg = getValidationMsg(this.error, this.labelname);
      showLineError(e.target, this.errormsg !== undefined);
      // save to DB
      if (!this.errormsg) {
        switch (this.table) {
          case 'examSection':
            updateExamSection({
              id: app.sections[0].id,
              data: {
                [this.column]: value
              }
            });
            break;
          case 'examQuestion':
            updateQuestion({
              id: this.question.id,
              data: {
                [this.column]: value
              }
            });
            break;
        }
      }
    }
  },
  template: `
    <div class="form-textarea">
      <textarea
        @input="handleInput"
        @blur="handleBlur"
        :value="value"
        :placeholder=placeholder
        :class=customclass
        class="form-control no-outline" :rows="rows"></textarea>
      <div class="form-view__input__text__inline"></div>
      <span class="red-text error-validate">{{ errormsg }}</span>
    </div>
  `
})

Vue.component('section-select', {
  props: ['placeholder', 'customclass', 'options', 'value', 'not_show_no_anwser', 'question'],
  data() {
    return {
      selectedValue: '',
    }
  },
  methods: {
    inArray(arr, value) {
      const dataInArr = _.find(arr, function (data) { return data == value });
      return dataInArr;
    },
    handleInput: function (e) {
      if(!this.inArray(Object.keys(this.options), e.target.value)) {
        return;
      }
      this.$emit('input', e.target.value);
      this.selectedValue = e.target.value;
      updateQuestion({
        id: this.question.id,
        data: {
          answerType: e.target.value
        }
      });
      // value = option[Multiple choice] then upload value radio to null
      if (Number(e.target.value) === 1) {
        var multiData = [];
        setTimeout(() => {
          $(`[type="radio"][name="radio${this.question.id}"]:not(:checked)`).each(function (k, el) {
            multiData.push({
              id: el.getAttribute('option_id'),
              rightAnswer: null
            });
          });
          if (multiData.length > 0) {
            updateQuestionOption({
              examQuestionId: this.question.id,
              multiData: multiData
            });
          }
        }, 100);
      }
      if (Number(e.target.value) === 0) {
        this.question.points = '';
        this.question.explanation = '';
      }
      // value = option[Checkboxes] then upload value
      if (Number(e.target.value) === 2) {
        var multiData = [];
        setTimeout(() => {
          $(`[type="checkbox"][checkbox="checkbox${this.question.id}"]`).each(function (k, el) {
            multiData.push({
              id: el.getAttribute('option_id'),
              rightAnswer: $(el).prop('checked') ? 1 : null
            });
          })
          if (multiData.length > 0) {
            updateQuestionOption({
              examQuestionId: this.question.id,
              multiData: multiData
            });
          }
        }, 100);
      }
    }
  },
  created() {
    this.selectedValue = this.value
  },
  template: `
    <select 
      class="form-control"
      @input="handleInput"
      @blur="handleInput"
      v-model="selectedValue"
    >
      <option
        v-for="(id, key) in Object.keys(options)" v-if="!isNaN(id) && (!not_show_no_anwser || (not_show_no_anwser && id != 0))"
        v-bind:value="id"
        :selected="id == value"
      >{{ options[id] }}
      </option>
    </select>
  `
})

Vue.component('section-input-textarea', {
  props: ['value', 'placeholder', 'customclass', 'name', 'type', 'error', 'table', 'labelname', 'question', 'question_option', 'column', 'parent_model'],
  data() {
    return {
      errormsg: '',
      rows: 1,
    }
  },
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
    onlyNumber: function (e) {
      if (this.type == 'number') {
        if (!((e.which > 47 && e.which < 58)
          || e.which === 8)) {
          e.preventDefault();
        }
      }
    },
    handleBlur(e) {
      this.handleMain(e);
    },
    handleInput: _.debounce(function (e) {
      this.handleMain(e);
    }, 1000),
    handleMain(e) {
      this.$emit('input', e.target.value);
      this.errormsg = getValidationMsg(this.error, this.labelname);
      showLineError(e.target, this.errormsg !== undefined);
      // save to DB
      if (!this.errormsg) {
        switch (this.table) {
          case 'examSection':
            updateExamSection({
              id: app.sections[0].id,
              data: {
                [this.column]: e.target.value
              }
            });
            break;
          case 'examQuestion':
            updateQuestion({
              id: this.question.id,
              data: {
                [this.column]: e.target.value
              }
            });
            break;
          case 'examQuestionOption':
            updateQuestionOption({
              examQuestionId: this.question_option.examQuestionId,
              id: this.question_option.id,
              data: {
                [this.column]: e.target.value
              }
            });
            break;
        }
      }
    }
  },
  template: `
    <div>
      <textarea
        :value="value"
        class="form-control no-outline"
        :class="customclass"
        :name="name"
        :rows="rows"
        @input="handleInput"
        @blur="handleBlur"
        @keypress="onlyNumber"
        :placeholder="placeholder">
        </textarea>
      <div class="form-view__input__text__inline"></div>
      <span class="red-text error-validate">{{ errormsg }}</span>
    </div>
  `
})

Vue.component('section-input', {
  props: ['value', 'placeholder', 'customclass', 'name', 'type', 'error', 'table', 'labelname', 'question', 'question_option', 'column', 'parent_model'],
  data() {
    return {
      errormsg: ''
    }
  },
  methods: {
    onlyNumber: function(e) {
      if (this.type == 'number') {
        if(!((e.which > 47 && e.which < 58) 
          || e.which === 8)) {
            e.preventDefault();
        }
      }
    },
    handleBlur(e) {
      this.handleMain(e);
    },
    handleInput: _.debounce(function (e) {
      this.handleMain(e);
    }, 1000),
    handleMain(e) {
      this.$emit('input', e.target.value);
      this.errormsg = getValidationMsg(this.error, this.labelname);
      showLineError(e.target, this.errormsg !== undefined);
      // save to DB
      if (!this.errormsg) {
        switch (this.table) {
          case 'examSection':
            updateExamSection({
              id: app.sections[0].id,
              data: {
                [this.column]: e.target.value
              }
            });
            break;
          case 'examQuestion':
            updateQuestion({
              id: this.question.id,
              data: {
                [this.column]: e.target.value
              }
            });
            break;
          
          case 'examQuestionOption':
            updateQuestionOption({
              examQuestionId: this.question_option.examQuestionId,
              id: this.question_option.id,
              data: {
                [this.column]: e.target.value
              }
            });
            break;
        }
      }
    }
  },
  template: `
    <div>
      <input 
        :type="type"
        :value="value"
        class="form-control no-outline"
        :class="customclass"
        :name="name"
        @input="handleInput"
        @blur="handleBlur"
        @keypress="onlyNumber"
        :placeholder="placeholder">
      <div class="form-view__input__text__inline"></div>
      <span class="red-text error-validate">{{ errormsg }}</span>
    </div>
  `
})

Vue.component('image-audio', {
  props: ['question', 'question_options', 'section_index', 'question_index', 'question_child_index'],
  methods: {
    removeImage: function(e) {
      app.removeImageAudio('picturePath', {
        sectionIndex: this.section_index,
        questionIndex: this.question_index,
        questionChildIndex: this.question_child_index,
      });
    },
    removeAudio: function(e) {
      app.removeImageAudio('audioPath', {
        sectionIndex: this.section_index,
        questionIndex: this.question_index,
        questionChildIndex: this.question_child_index,
      });
    }
  },
  template: `
  <div class="col-12 fix-on-row" style="padding: 0">
    <div v-if="question.picturePath">
      <div class="exam-img img-thumbnail noselect">
        <div class="img-del" v-on:click="removeImage">
          <svg width="19" height="16" fill="currentColor" viewBox="0 0 16 16" class="bi bi-trash" style="margin-bottom: 3px;">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
          </svg>
        </div>
        <img :src="question.picturePath">
      </div>
    </div>

    <div v-if="question.audioPath">
      <div class="exam-img noselect">
        <audio controls>
          <source :src="question.audioPath">
          Your browser does not support the audio element.
        </audio>
        <div class="audio-del" v-on:click="removeAudio">
          <svg width="19" height="16" fill="currentColor" viewBox="0 0 16 16" class="bi bi-trash" style="margin-bottom: 3px;">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
  `
})

Vue.component('multiple-choice', {
  props: ['type', 'question', 'question_options', 'section_index', 'question_index', 'question_child_index', 'v_model'],
  data() {
    return {
      radioState: null,
      isCheckForRadio: true
    }
  },
  created() {
    // specchange #79411
    // 3/ radio button have many answerType = 1
    if (this.type == 'radio') {
      var countRightAnswer = 0;
      for (var question of this.question_options) {
        if (question.rightAnswer == 1) {
          countRightAnswer++;
        }
      }
      if (countRightAnswer > 1) {
        this.isCheckForRadio = false;
      }
    }
  },
  mounted() {
    $('.choice input[type="number"]').on('input blur', function (e) {
      var elErrorRightAnswer = $(e.target).closest('.choice').find('.rightAnswer');
      elErrorRightAnswer.css({ 'display': 'block' });
      if (e.target.value !== '') {
        var checkeds = $(e.target).closest('.choice').find('[type="radio"]:checked, [type="checkbox"]:checked');
        if (!checkeds.length) {
          elErrorRightAnswer.text(validationMessage.requiredError('Right answer'));
        } else {
          elErrorRightAnswer.text('');
        }

        $(e.target).closest('.choice').find('[type="radio"], [type="checkbox"]').on('input', function(ev) {
          var checkeds = $(e.target).closest('.choice').find('[type="radio"]:checked, [type="checkbox"]:checked');
          if (!checkeds.length) {
            elErrorRightAnswer.text(validationMessage.requiredError('Right answer'));
          } else {
            elErrorRightAnswer.text('');
          }
        })
      } else {
        elErrorRightAnswer.text('');
      }
    })
  },
  methods: {
    handlerClick(e) {
      var radio = e.target;
      if (radio.type == 'radio') {
        var questionChecked = null;
        for (var question of this.question_options) {
          if (question.rightAnswer == 1) {
            questionChecked = question.id;
          }
        }
        if (e.target.getAttribute('option_id') == questionChecked && this.isCheckForRadio) {
          this.radioState = radio;
        }
        if (this.radioState === radio) {
          $(radio).prop('checked', false);
          this.radioState = null;
          e.target.checked = false;
        } else {
          this.radioState = radio;
        }
        if (typeof app.handleUpdateOption === 'function') {
          app.handleUpdateOption(e, {
            sectionIndex: this.section_index,
            questionIndex: this.question_index,
            questionChildIndex: this.question_child_index,
            optionIndex: e.target.getAttribute('option_index')
          });
        }
      }
    },
    handleUpdateOption: function (e) {
      if (typeof app.handleUpdateOption === 'function' && e.target.type == 'checkbox') {
        app.handleUpdateOption(e, {
          sectionIndex: this.section_index,
          questionIndex: this.question_index,
          questionChildIndex: this.question_child_index,
          optionIndex: e.target.getAttribute('option_index')
        });
      }
    }
  },
  template: `
    <div class="choice">
      <div class="col-9 fix-on-row">
        <strong>Please choose correct answer{{ type == 'checkbox' ? '(s)' : '' }} if points is filled:</strong>        
      </div>
      <div class="col-2 fix-on-row mg-bt-10">
        <section-input
          column="points"
          :question="question"
          table="examQuestion"
          labelname="Points"
          :error="v_model.points"
          :parent_model="v_model"
          type="number"
          v-model="v_model.points.$model"
          customclass="textarea-section-normal"
          placeholder=""></section-input>
      </div>
      <div class="col-1 fix-on-row" style="padding-top: 5px"> points</div>
      <div class="clearfix"></div>
      <div class="option-sortable" 
        :section_index="section_index"
        :question_index="question_index"
        :question_child_index="question_child_index"
      >
        <div class="mg-bt-10" v-for="(questionOption, option_index) in question_options">
          <move-vertical></move-vertical>
          <input 
            class="radio-options" 
            :type="type"
            v-on:click="handlerClick"
            :checked="isCheckForRadio && questionOption.rightAnswer == 1"
            :name=" type == 'radio' ? type + questionOption.examQuestionId : ''"
            :option_index="option_index"
            :option_id="questionOption.id"
            :checkbox="type + questionOption.examQuestionId"
            @change="handleUpdateOption"
          >
          <div class="col-8 fix-on-row">
            <section-input-textarea
              column="content"
              :question_option="questionOption"
              table="examQuestionOption"
              labelname="Option content"
              :error="v_model.questionOptions.$each[option_index].content"
              type="text"
              v-model="v_model.questionOptions.$each[option_index].content.$model"
              customclass="textarea-section-normal"
              placeholder="Option content (required)"></section-input-textarea>
          </div>
          <remove-option
            :section_index="section_index"
            :question_index="question_index"
            :question_child_index="question_child_index"
            :option_index="option_index"
          ></remove-option>
          <dupplication
            :section_index="section_index"
            :question_index="question_index"
            :question_child_index="question_child_index"
            :option_index="option_index"
          ></dupplication>
          <div class="clearfix"></div>
        </div>
      </div>
      <span class="red-text error-validate rightAnswer"></span>
      <div class="clearfix"></div>
    </div>
  `
});

Vue.component('add-question', {
  props: ['text', 'id', 'section_index', 'question_index', 'question_child_index', 'level', 'not_mg_bt'],
  methods: {
    addQuestion: function(e) {
      if (typeof app.addQuestion === 'function') {
        app.addQuestion(e, {
          sectionIndex: this.section_index,
          questionIndex: this.question_index,
          questionChildIndex: this.question_child_index,
          level: this.level,
          btnId: this.id
        });
      }
    }
  },
  template: `
    <div class="center">
      <svg viewBox="0 0 16 16" class="bi bi-plus"
        v-on:click="addQuestion"
        :id="id"
        :section-index="section_index"
        :question-index="question_index"
        :question-child-index="question_child_index"
        :level="level"
      >
        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
      <div class="noselect">{{ text }}</div>
    </div>
  `
})

Vue.component('move-vertical', {
  props: [''],
  methods: {
  },
  template: `
    <div class="fix-on-row move-vertical">
      <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-grip-vertical" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
    </div>
  `
})

Vue.component('move-question', {
  props: ['customclass'],
  methods: {
  },
  template: `
  <div class="center">
    <svg class="bi bi-grid-3x2-gap-fill" :class="customclass">
      <path d="M1 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4zM1 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9z"/>
    </svg>
  </div>
  `
})

Vue.component('question-more-option', {
  props: ['question_id', 'higher'],
  methods: {
    menuMoreOption: function(e) {
      if (typeof app.dupplicationOption === 'function') {
        app.menuMoreOption(e, this.question_id, this.higher)
      }
    }
  },
  template: `
    <button class="question-more-option" v-on:click="menuMoreOption">
      <svg width="1em" height="1em">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    </button>
  `
})

Vue.component('menu-more-option', {
  props: ['question', 'customclass', 'higher', 'question_index', 'section_index', 'question_parent'],
  methods: {
    dupplicationQuestion: function(e) {
      var data = {
        questionIndex: this.question_index,
        sectionIndex: this.section_index
      }
      if (this.question_parent) {
        delete data.questionIndex;
      }
      app.dupplicationQuestion(data, this.question);
    },
    deleteQuestion: function (e) {
      var data = {
        questionIndex: this.question_index,
        sectionIndex: this.section_index
      }
      if (this.question_parent) {
        delete data.questionIndex;
      }
      app.deleteQuestion(data, this.question);
    },
    addPicture: function (e) {
      var data = {
        'question-id': this.question.id,
        'questionIndex': this.question_index !== undefined ? this.question_index : '',
        'sectionIndex': this.section_index
      };
      if (this.question_parent) {
        delete data.questionIndex;
      }
      $('#image').attr(data);
      $('#image').click();
    },
    addAudio: function (e) {
      var data = {
        'question-id': this.question.id,
        'questionIndex': this.question_index !== undefined ? this.question_index : '',
        'sectionIndex': this.section_index
      };
      if (this.question_parent) {
        delete data.questionIndex;
      }
      $('#audio').attr(data);
      $('#audio').click();
    },
    moveToOtherSection: function(e) {
      $('#sectionChoice').modal('show');
      $('#sectionChoice').removeAttr('questionId questionIndex')
      $('#sectionChoice').attr({
        'questionId': this.question.id,
        'questionIndex': this.question_index
      })
    }
  },
  template: `
    <div class="col-3 float-left menu-more-option hidden" :class="customclass" :id="'menu-more-' + (higher ? 'higher-' : '') + question.id">
      <div class="noselect mg-bt-10" v-if="higher" v-on:click="moveToOtherSection">
        <svg width="16" height="16" fill="currentColor" class="bi bi-forward-fill" viewBox="0 0 16 16" style="margin-bottom: 3px;">
          <path d="M9.77 12.11l4.012-2.953a.647.647 0 0 0 0-1.114L9.771 5.09a.644.644 0 0 0-.971.557V6.65H2v3.9h6.8v1.003c0 .505.545.808.97.557z"/>
        </svg>
        Move to other section
      </div>
      <div class="noselect mg-bt-10" v-on:click="dupplicationQuestion">
        <svg width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16" style="margin-bottom: 3px;">
          <path fill-rule="evenodd" d="M4 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4z"/>
          <path d="M6 0h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1H4a2 2 0 0 1 2-2z"/>
        </svg>
        Duplicate
      </div>
      <div class="noselect mg-bt-10" v-on:click="deleteQuestion">
        <svg width="19" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" style="margin-bottom: 3px;">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        Delete
      </div>
      <div class="noselect mg-bt-10" v-if="question.picturePath == null || question.picturePath == ''"
        v-on:click="addPicture"
      >
        <svg width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v9l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15.002 9.5V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
        Add picture
      </div>
      <div class="noselect mg-bt-10" v-if="question.audioPath == null || question.audioPath == ''"
        v-on:click="addAudio"
      >
        <svg width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16" style="margin-bottom: 4px;">
          <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg>
        &nbsp;Add audio
      </div>
    </div>
  `
})

Vue.component('dupplication', {
  props: ['id', 'section_index', 'question_index', 'question_child_index', 'option_index'],
  methods: {
    dupplicationOption: function(e) {
      if (typeof app.dupplicationOption === 'function') {
        app.dupplicationOption(e, {
          sectionIndex: this.section_index,
          questionIndex: this.question_index,
          questionChildIndex: this.question_child_index,
          optionIndex: this.option_index
        })
      }
    }
  },
  template: `
    <div class="fix-on-row dupplication-icon"
      v-on:click="dupplicationOption"
    >
      <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-files">
        <path fill-rule="evenodd" d="M4 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4z"/>
        <path d="M6 0h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1H4a2 2 0 0 1 2-2z"/>
      </svg>
    </div>
  `
})

Vue.component('remove-option', {
  props: ['id', 'section_index', 'question_index', 'question_child_index', 'option_index'],
  methods: {
    removeOption: function(e) {
      if (typeof app.removeOption === 'function') {
        app.removeOption(e, {
          sectionIndex: this.section_index,
          questionIndex: this.question_index,
          questionChildIndex: this.question_child_index,
          optionIndex: this.option_index
        })
      }
    }
  },
  template: `
    <div class="remove-option fix-on-row">
      <svg
        v-on:click="removeOption"
        width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-x"
      >
        <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </div>
  `
});

Vue.component('button-list', {
  props: ['sections', 'current_section', 'section_count'],
  methods: {
    addSection: function(e) {
      showLoading();
      const form = document.createElement("form");
      form.method = "POST";
      form.action = window.location.pathname + '/addSection/' + this.section_count;
      document.body.appendChild(form);
      form.submit();
    },
    deleteSection: function(e) {
      showLoading();

      const sectionId = this.sections[0].id;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = window.location.pathname + '/deleteSection/' + sectionId;
      document.body.appendChild(form);
      form.submit();
    },
    preSection: function(e) {
      window.location.href = `${window.location.pathname}?sectionPage=${this.current_section - 1}`;
    },
    nextSection: function(e) {
      window.location.href = `${window.location.pathname}?sectionPage=${this.current_section + 1}`;
    },
    sectionList: function(e) {
      $('#sectionList').modal('show');
    }
  },
  template: `
    <div class="col col-12 mg-bt-10">
      <button class="btn btn-success mg-r-10 btn-add-section btn-custom" v-on:click="addSection">
        <svg width="20" height="20" fill="currentColor" class="bi" viewBox="0 0 14 14" style="margin-bottom: 4px;">
          <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Add section
      </button>
      <button class="btn btn-danger mg-r-10 btn-delete-section btn-custom" v-if="sections.length > 0" v-on:click="deleteSection">
        <svg width="19" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" style="margin-bottom: 3px;">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        Delete section
      </button>
      <button class="btn btn-light mg-r-10 btn-custom btn-next"
        v-if="current_section > 0"
        v-on:click="preSection"
      >
        Previous section
      </button>
      <button class="btn btn-info mg-r-10 btn-custom" v-if="section_count > 0" v-on:click="sectionList">
        <svg width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
        Section list
      </button>
      <button class="btn btn-light mg-r-10 btn-custom btn-next"
        v-if="section_count > 1 && current_section < section_count - 1"
        v-on:click="nextSection">
        Next section
      </button>
    </div>
  `
});