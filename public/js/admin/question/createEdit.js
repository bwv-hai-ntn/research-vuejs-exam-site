/* @components: sectionTree */
Vue.use(window.vuelidate.default)
const { required, maxLength } = window.validators

const processingFailed = 'Something went wrong. Please refresh the page and try again.';
const examData = JSON.parse($('input[name=examData]').attr('data-value') );
const anwserData = JSON.parse($('input[name=anwserData]').attr('data-value') );
const sectionsData = JSON.parse($('input[name=examSectionsData]').attr('data-value') );
const sectionPage = JSON.parse($('input[name=sectionPage]').attr('data-value') );

app = new Vue({
  el: '.vue-app',
  data: {
    sectionList: sectionsData,
    sections: sectionsData.length > 0 ? [sectionsData[sectionPage]] : sectionsData,
    current_section: Number(sectionPage),
    section_count: sectionsData.length,
    select_options,
    testTimeSettingData: examData.testTimeSetting,
    testTime: examData.testTime
  },
  mounted() {
    $('.section-content').css('opacity', 1)
    if(anwserData.length !== 0) {
      // show popup continueEditConfirm
      $('#examModal').modal('show');
    };
    setTimeout(() => {
      validateAll();
    }, 100);
    sortOption();
    sortQuestion();
    sortSectionList();
    processUploadFile();
  },
  computed: {    
    // get totalTestTime in examSection
    totalTestTotalSection: function(){
      let sum = 0;
      this.sectionList.forEach(function(obj) {
         sum += obj.testTime ? parseInt(obj.testTime) : 0;
      });
     return sum;
   }
  },
  methods: {
    addSectionPopup(callback) {
      $.ajax({
        type: "post",
        dataType: 'json',
        url: `${window.location.pathname}/addSectionPopup`,
        beforeSend: function () {
            showLoading();
        },
        success: function (res) {
          hideLoading();
          // call when save success
          if (typeof callback === 'function') {
            callback(res);
          }
        },
        error: function (e) {
          hideLoading();
          $(document).find(".header-custom-popup").text(processingFailed);
        },
      });
    },
    checkForm: function (e) {
      return true;
    },
    handleButton: function (e) {
      // process submit button
      switch (e.target.id) {
        case 'copy_btn':
          // copy exam
          showLoading();
          this.$refs.form.action = window.location.origin + '/admin/question/' + examData.id + '/copy';
          this.$refs.form.submit();
          break;
        case 'delete_btn':
          // Delete exam
          showLoading();
          this.$refs.form.action = window.location.origin + '/admin/question/' + examData.id + '/delete';
          this.$refs.form.submit();
          break;
        case 'revert_btn':
          // Revert exam
          showLoading();
          this.$refs.form.action = window.location.origin + '/admin/question/' + examData.id + '/revert';
          this.$refs.form.submit();
          break;
        default:
          break;
      }
    },
    handlerContinute: function(e) {
      // close popup
      $('#examModal').modal('hide');
    },
    handlerBackToExam: function(e) {
      // redirect to ExamList
      window.location.href = window.location.origin + '/admin/exam';
    },
    addQuestion: function(e, indexs) {
      const sectionIndex = indexs.sectionIndex;
      const questionIndex = indexs.questionIndex;
      const questionChildIndex = indexs.questionChildIndex;
      const level = indexs.level;

      // exam section
      const section = this.sections[sectionIndex];
      if (section) {
        if (typeof section.questions !== 'object') {
          this.sections[sectionIndex].questions = [];
        }
        // exam question
        const question = section.questions[questionIndex];

        switch (indexs.btnId) {
          case 'btn-add-question':
            let newQuestion = {
              examSectionId: section.id,
              answerType: 1,
              questionOptions: [],
              questions: [],
              points: '',
              rightAnswerByText: '',
              content: '',
              picturePath: '',
              audioPath: '',
            };
            // save data
            createNew({data: newQuestion, type: 'addQuestion'},
              (res) => {
                // push to master data
                section.questions.push({ ...newQuestion, id: res.id, sort: res.sort });
              }
            );
            break;
          case 'btn-add-question-to-question':
            
            if (typeof question.questions !== 'object') {
              question.questions = [];
            }
            // save data
            let newQuestionToQuestion = {
              examSectionId: section.id,
              higherExamQuestionId: question.id,
              answerType: 1,
              questionOptions: [],
              points: '',
              rightAnswerByText: '',
              content: '',
              picturePath: '',
              audioPath: ''
            }
            createNew({data: newQuestionToQuestion, type: 'addQuestion'}, 
              (res) => {
                // push to master data
                question.questions.push({ ...newQuestionToQuestion, id: res.id, sort: res.sort});
              }
            );
            break;
          case 'btn-add-option':
            if (typeof question.questionOptions !== 'object') {
              question.questionOptions = [];
            }
            let examQuestionId;
            let sort;
            let tmpQuestion = question;
            let id = {
              questionId: question.id
            }
            if (!level) {
              // add option to question level 1
              examQuestionId = question.id;
              sort = question.questionOptions.length ? question.questionOptions[question.questionOptions.length - 1].sort + 1 : 1;
            } else if (level == 2) {
              // add option to question level 2
              const questionChild = question.questions[questionChildIndex];
              if (typeof questionChild.questionOptions !== 'object') {
                questionChild.questionOptions = [];
              }
              id.questionChildId = questionChild.id;
              examQuestionId = questionChild.id;
              sort = questionChild.questionOptions.length ? questionChild.questionOptions[questionChild.questionOptions.length - 1].sort + 1 : 1;
              tmpQuestion = questionChild;
            }

            // save data
            let newQuestionOption = {
              examQuestionId,
              sort,
              content: '',
              rightAnswer: ''
            };
            createNew({data: newQuestionOption, type: 'addOption'},
              (res) => {
                // push to master data
                tmpQuestion.questionOptions.push({ ...newQuestionOption, id: res.id });
                blurPoints(id);
              }
            );
            break;
        }
      }
    },
    removeOption: function (e, indexs) {
      processRemoveOption(e, indexs, this.sections);
    },
    dupplicationOption: function (e, indexs) {
      processDupplicationOption(e, indexs, this.sections);
    },
    dupplicationQuestion: function (indexs, question) {
      processDupplicationQuestion(indexs, question, this.sections);
    },
    deleteQuestion: function (indexs, question) {
      processDeleteQuestion(indexs, question, this.sections);
    },
    menuMoreOption: function(e, question_id, higher) {
      processOpenMenuMoreOption(e.target, question_id, higher)
    },
    handleUpdateOption: function(e, indexs) {
      const checked = e.target.checked;
      // exam section
      const section = this.sections[indexs.sectionIndex];
      if (section) {
        // exam question
        const question = section.questions[indexs.questionIndex];
        let tmlOptions = question.questionOptions;
        if (indexs.questionChildIndex !== undefined) {
          tmlOptions = question.questions[indexs.questionChildIndex].questionOptions;
        }

        if (e.target.type === 'radio') {
          for (const tmlOption of tmlOptions) {
            tmlOption.rightAnswer = null;
          }
        }

        tmlOptions[indexs.optionIndex].rightAnswer = checked ? 1 : null;
        var multiData = [];
        for (const tmlOption of tmlOptions) {
          multiData.push({
            id: tmlOption.id,
            rightAnswer: tmlOption.rightAnswer
          })
        }
        updateQuestionOption({
          multiData: multiData,
          examQuestionId: question.id
        });
      }
    },
    removeImageAudio: function(type, indexs) {
      // exam section
      const section = this.sections[indexs.sectionIndex];
      if (section) {
        // exam question
        let tmpQuestion = section.questions[indexs.questionIndex];
        if (indexs.questionChildIndex !== undefined) {
          tmpQuestion = tmpQuestion.questions[indexs.questionChildIndex];
        }
        updateQuestion({
          id: tmpQuestion.id,
          data: {
            [type]: null
          }
        }, (res) => {
          // remove image/audio
            tmpQuestion[type] = null;
        }, true);
      }
    },
    addFilePath: function (options, filePath) {
      // exam section
      const section = this.sections[options.sectionIndex];
      if (section) {
        // exam question
        let questions = section.questions;

        if (options.questionIndex !== undefined && options.questionIndex !== null && options.questionIndex !== '') {
          questions = section.questions[options.questionIndex].questions;
        }
        let question = questions.filter((e) => e.id === Number(options.question_id));
        question = question.length > 0 ? question[0] : {};
        if (question.id) {
          let columnName = 'picturePath';
          if (options.type === 'audio') {
            columnName = 'audioPath';
          }
          question[columnName] = filePath;
        }
      }
    },
    popup_deleteSection: function(section_index, sectionId) {
      popup_deleteSection(section_index, sectionId, this);
    },
    popup_btnSelect: function(sectionId) {
      var questionId = $('#sectionChoice').attr('questionId');
      var questionIndex = $('#sectionChoice').attr('questionIndex');
      updateQuestion({
        id: questionId,
        type: 'popupBtnSelect',
        data: {
          examSectionId: sectionId
        }
      }, (res) => {
          // hide modal
          $('#sectionChoice').modal('hide');
          // remove question by key
          this.sections[0].questions.splice(questionIndex, 1);
      }, true);
    }
  },
  validations: {
    sections: {
      $each: {
        title: {
          maxLength: maxLength(100)
        },
        testTime: {
          required: (value, model) => {
            if (examData.testTimeSetting == 2 && (value == null || value == '')) {
              return false;
            }
            return true;
          },
          maxLength: maxLength(9)
        },
        description: {},
        questions: {
          $each: {
            answerType: {},
            content: {},
            rightAnswerByText: {
              required: (value, model) => {
                if (model.points !== null && model.points !== '' && (value == null || value == '')) {
                  return false;
                }
                return true;
              },
              maxLength: maxLength(400)
            },
            points: {
              maxLength: maxLength(5)
            },
            explanation: {},
            questionOptions: {
              $each: {
                rightAnswer: {
                  required: (value, a) => {
                    return false;
                  }
                },
                content: {
                  required,
                  maxLength: maxLength(256)
                }
              }
            },
            questions: {
              $each: {
                answerType: {},
                content: {},
                rightAnswerByText: {
                  required: (value, model) => {
                    if (model.points !== null && model.points !== '' && (value == null || value == '')) {
                      return false;
                    }
                    return true;
                  },
                  maxLength: maxLength(400)
                },
                points: {
                  maxLength: maxLength(5)
                },
                explanation: {},
                questionOptions: {
                  $each: {
                    rightAnswer: {
                      required: (value) => {
                        return false;
                      }
                    },
                    content: {
                      required,
                      maxLength: maxLength(256)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

/**
 * save to databasse
 */
function createNew(data, callback) {
  $.ajax({
    type: "post",
    dataType: 'json',
    data,
    url: `${window.location.pathname}/addData`,
    beforeSend: function() {
      showLoading();
    },
    success: function (res) {
      hideLoading();
      // call when save success
      if (typeof callback === 'function') {
        callback(res);
      }
    },
    error: function (e) {
      if (data.type == 'addQuestion') {
        hideLoading();
        // error add question child
        if (data.data.higherExamQuestionId) {
          errorProcessingFailed(data.data.higherExamQuestionId);
        } else {
          // error add question parent
          $(document).find("[processing-failed='add-question-parent']").text(processingFailed);
        }
      } else if (data.type == 'dupplicateQuestion') {
        errorProcessingFailed(data.data.id);
      } else {
        // error add question option
        errorProcessingFailed(data.data.examQuestionId);
      }
    },
  });
}

/**
 * update to databasse
 */
function updateQuestion(data, callback, loading) {
  $.ajax({
    type: "post",
    dataType: 'json',
    data,
    url: `${window.location.pathname}/updateQuestion`,
    beforeSend: function() {
      if (loading) {
        showLoading();
      }
    },
    success: function (res) {
      hideLoading();
      // call when save success
      if (typeof callback === 'function') {
        callback(res);
      }
    },
    error: function (e) {
      if (data.type == 'popupBtnSelect') {
        hideLoading();
        $(document).find(".header-custom-popup-choice").text(processingFailed);
      } else {
        errorProcessingFailed(data.id);
      }
    },
  });
}

function updateExamSection(data, callback, loading) {
  $.ajax({
    type: "post",
    dataType: 'json',
    data,
    url: `${window.location.pathname}/updateExamSection`,
    beforeSend: function() {
      if (loading) {
        showLoading();
      }
    },
    success: function (res) {
      hideLoading();
      // call when save success
      if (typeof callback === 'function') {
        callback(res);
      }
    },
    error: function (e) {
      errorProcessingFailed();
    },
  });
}

function updateQuestionOption(data, callback, loading) {
  $.ajax({
    type: "post",
    dataType: 'json',
    data,
    url: `${window.location.pathname}/updateQuestionOption`,
    beforeSend: function() {
      if (loading) {
        showLoading();
      }
    },
    success: function (res) {
      hideLoading();
      // call when save success
      if (typeof callback === 'function') {
        callback(res);
      }
    },
    error: function (e) {
      errorProcessingFailed(data.examQuestionId);
    },
  });
}

/**
 * remove options
 */
function processRemoveOption(e, indexs, sections) {
  const sectionIndex = indexs.sectionIndex;
  const questionIndex = indexs.questionIndex;
  const questionChildIndex = indexs.questionChildIndex;
  const optionIndex = indexs.optionIndex;

  // exam section
  const section = sections[sectionIndex];
  if (section) {
    // exam question
    const question = section.questions[questionIndex];
    let tmlOptions = question.questionOptions;
    let id = {
      questionId: question.id
    };
    if (questionChildIndex !== undefined) {
      tmlOptions = question.questions[questionChildIndex].questionOptions;
      id.questionChildId = question.questions[questionChildIndex].id;
    }
    // save into DB
    removeExecute(
      {
        id: tmlOptions[optionIndex].id,
        examQuestionId: question.id
      },
      'removeOption',
      () => {
        // remove option by key
        tmlOptions.splice(optionIndex, 1); 
        blurPoints(id);
      }
    )
  }
}

function blurPoints(id) {
  let elementPoints;
  if (id.questionChildId) {
    elementPoints = $($("div[question_child_id='" + id.questionChildId + "']").find('.choice').children()[1]);
  } else {
    elementPoints = $($("div[question_id='" + id.questionId + "']").find('#btn-remove-option').children()[1]);
  }

  setTimeout(() => {
    var inputPoints = elementPoints.find('input');
    var elErrorRightAnswer = elementPoints.closest('.choice').find('.rightAnswer');
    if (inputPoints.val() !== '') {
      var checkeds = inputPoints.closest('.choice').find('[type="radio"]:checked, [type="checkbox"]:checked');
      if (!checkeds.length) {
        elErrorRightAnswer.text(validationMessage.requiredError('Right answer'));
      } else {
        elErrorRightAnswer.text('');
      }

      inputPoints.closest('.choice').find('[type="radio"], [type="checkbox"]').on('input', function (ev) {
        var checkeds = inputPoints.closest('.choice').find('[type="radio"]:checked, [type="checkbox"]:checked');
        if (!checkeds.length) {
          elErrorRightAnswer.text(validationMessage.requiredError('Right answer'));
        } else {
          elErrorRightAnswer.text('');
        }
      })
    } else {
      elErrorRightAnswer.text('');
    }
  }, 100);
}

/**
 * process delete question
 */
function processDeleteQuestion (indexs, question, sections) {
  // exam section
  const section = sections[indexs.sectionIndex];
  if (section) {
    // exam question
    let questions = section.questions;

    if (indexs.questionIndex !== undefined) {
      questions = section.questions[indexs.questionIndex].questions;
    }

    let tmlQuestion = questions.filter((e) => e.id === question.id);
    tmlQuestion = tmlQuestion.length > 0 ? tmlQuestion[0] : {};
    if (tmlQuestion.id) {
      removeExecute({
        examQuestionId: tmlQuestion.id,
        id: tmlQuestion.id
      }, 'removeQuestion', () => {
        // remove question by key
        questions.splice(questions.indexOf(tmlQuestion), 1);
      })
    }
  }
}

/**
 * remove to DB
 */
function removeExecute(data, type, callback) {
  // save to DB
  $.ajax({
    type: "post",
    dataType: 'json',
    url: `${window.location.pathname}/${type}/${data.id}`,
    beforeSend: function() {
      showLoading();
    },
    success: function (res) {
      hideLoading();
      // call when save success
      if (typeof callback === 'function') {
        callback();
      }
    },
    error: function (e) {
      errorProcessingFailed(data.examQuestionId);
    },
  });
}

/**
 * process dupplication option
 */
function processDupplicationOption(e, indexs, sections) {
  // exam section
  const section = sections[indexs.sectionIndex];
  if (section) {
    // exam question
    const question = section.questions[indexs.questionIndex];
    let tmlOptions = question.questionOptions;
    if (indexs.questionChildIndex !== undefined) {
      tmlOptions = question.questions[indexs.questionChildIndex].questionOptions;
    }
    const data = {
      idDuplidate: tmlOptions[indexs.optionIndex].id,
      examQuestionId: tmlOptions[indexs.optionIndex].examQuestionId,
      content: tmlOptions[indexs.optionIndex].content,
      rightAnswer: tmlOptions[indexs.optionIndex].rightAnswer,
      sort: tmlOptions[indexs.optionIndex].sort
    };

    createNew({ data, type: 'dupplicateOption' }, (res) => {
      tmlOptions.push({ ...data, id: res.id });
      // resort
      tmlOptions = _.sortBy(tmlOptions, [
        function (item) {
          if (item.sort == null) {
            item.sort = -9999999
          }
          return item.sort;
        },
        , 'id'], ['asc', 'asc']);
      if (indexs.questionChildIndex !== undefined) {
        question.questions[indexs.questionChildIndex].questionOptions = tmlOptions;
        blurPoints({ questionChildId: question.questions[indexs.questionChildIndex].id});
      } else {
        question.questionOptions = tmlOptions;
        blurPoints({ questionId: question.id });
      }
    });
  }
}

/**
 * process dupplication question
 */
function processDupplicationQuestion (indexs, question, sections) {
  // exam section
  const section = sections[indexs.sectionIndex];
  if (section) {
    // exam question
    let questions = section.questions;

    if (indexs.questionIndex !== undefined) {
      questions = section.questions[indexs.questionIndex].questions;
    }
    let tmlQuestion = questions.filter((e) => e.id === question.id);
    tmlQuestion = tmlQuestion.length > 0 ? tmlQuestion[0] : {};
    if (tmlQuestion.id) {
      createNew({data: {id: tmlQuestion.id}, type: 'dupplicateQuestion'}, (res) => {
        questions.push(res);
        // resort
        questions = _.sortBy(questions, [
          function (item) {
            if (item.sort == null) {
              item.sort = -9999999
            }
            return item.sort;
          },
          , 'id'], ['asc', 'asc']);
        if (indexs.questionIndex !== undefined) {
          section.questions[indexs.questionIndex].questions = questions;
        } else {
          section.questions = questions;
        }
      })
    }
  }
}


/**
 * update sort
 */
function sortExecute(data, callback) {
  $.ajax({
    type: "post",
    dataType: 'json',
    data,
    url: `${window.location.pathname}/sortData`,
    success: function (res) {
      // call when save success
      if (typeof callback === 'function') {
        callback(res);
      }
    },
    error: function(e) {
      if (e.responseJSON.dataError.examQuestionId) {
        errorProcessingFailed(e.responseJSON.dataError.examQuestionId);
      } else {
        hideLoading();
        if (data.type == 'examSection') {
          $(document).find(".header-custom-popup").text(processingFailed);
        }
      }
    },
  });
}

/**
 * sort option
 */
function sortOption() {
  $('.content-wrapper').delegate('.option-sortable', 'mouseenter', () => {
    $( ".option-sortable" ).sortable({
      revert: true,
      handle: '.bi-grip-vertical', // drag by icon
      update: function(e, ui) {
        var el = $(e.target);
        var data = [];
        var options = el.find('[type="radio"], [type="checkbox"]');
        var sort = 1;
        for (var option of options) {
          data.push({id: option.getAttribute('option_id'), sort})
          sort++;
        }
        sortExecute({
          type: 'examQuestionOption',
          data,
          examQuestionId: app.sectionList[el.attr('section_index')].questions[el.attr('question_index')].id
        });
      }
    });
    $( ".option-sortable" ).disableSelection();

  })
}

/**
 * sort sections list
 */
function sortSectionList() {
  $('.content-wrapper').delegate('.section-sortable', 'mouseenter', () => {
    $( ".section-sortable" ).sortable({
      revert: true,
      handle: '.bi-grip-vertical', // drag by icon
      update: function(e, ui) {
        var el = $(e.target);
        var currentId = ui.item.find('svg[sectionid]').attr('sectionid');
        var data = [];
        var reSortSectionList = [];
        var elements = el.find('svg[sectionid]');
        var sort = 1;
        for (var element of elements) {
          var sectionId = Number(element.getAttribute('sectionid'));
          data.push({id: sectionId, sort});
          reSortSectionList.push(app.sectionList.filter(e => e.id === sectionId)[0]);
          sort++;
        }

        app.sectionList = [];
        setTimeout(() => {
          app.sectionList = reSortSectionList;
          app.current_section = app.sectionList.findIndex(e => e.id == currentId);
        }, 1)

        sortExecute({type: 'examSection', data});
      }
    });
    $( ".section-sortable" ).disableSelection();
  })
}

/**
 * sort question
 */
function sortQuestion() {
  // question
  $('.content-wrapper').delegate('.question-sortable', 'mouseenter', () => {
    $( ".question-sortable" ).sortable({
      revert: true,
      handle: '.question-sort', // drag by icon
      update: function(e, ui) {
        var questions = $(e.target).find('div[question_id]');
        var data = [];
        var sort = 1;
        for (var question of questions) {
          data.push({id: question.getAttribute('question_id'), sort})
          sort++;
        }
        sortExecute({type: 'examQuestion', data});
      }
    });
  });

  // question-child
  $('.content-wrapper').delegate('.question-child-sortable', 'mouseenter', () => {
    $( ".question-child-sortable" ).sortable({
      revert: true,
      handle: '.question-child-sort', // drag by icon
      update: function(e, ui) {
        var questions = $(e.target).find('div[question_child_id]');
        var data = [];
        var sort = 1;
        for (var question of questions) {
          data.push({id: question.getAttribute('question_child_id'), sort})
          sort++;
        }
        sortExecute({ type: 'examQuestion', data }, () => {
          $(e.target).find('.question-child-sort').css('cursor', 'move');
        });
      },
      over: function (event, ui) {
        $(event.target).find('.question-child-sort').css('cursor', 'move')
      },
      out: function (event, ui) {
        $(event.target).find('.question-child-sort').css('cursor', 'not-allowed')
      },
      stop: function (event, ui) {
        $(event.target).find('.question-child-sort').css('cursor', 'move')
      },
    });
  });
}

/**
 * processOpenMenuMoreOption
 */
function processOpenMenuMoreOption(buttoner, question_id, higher) {
  const idContainer = `#menu-more-${higher ? 'higher-' : ''}${question_id}`;
  $('[id^="menu-more-"').not(idContainer).hide();
  if (question_id) {
    var container = $(idContainer);

    if (container.is(":hidden")) {
      // container.slideToggle("slow");
      container.show();
    }

    $(document).mouseup(function(e) {
      if (
        !container.is(e.target) && container.has(e.target).length === 0 &&
        !$(buttoner).is(e.target) && $(buttoner).has(e.target).length === 0
      ) {
        container.hide();
      }
    });
  }
}

/**
 * process upload file
 */
function processUploadFile() {
  $('[type="file"]').on('input', function(e) {
    var type = e.target.id;
    var file = e.target.files[0];
    var typeFile = 'image';
    var maxSize = 1024 * 1024; // 1MB
    var maxSizeText = '1MB';
    var allowExt = ['PNG', 'JPG', 'JPEG'];
    if (type == 'audio') {
      maxSize = maxSize * 5; // 5MB
      allowExt = ['MP3'];
      maxSizeText = '5MB';
      typeFile = 'audio';
    }

    var fileExt = (file.name || '').split('.').pop().toLocaleUpperCase();
    if (allowExt.indexOf(fileExt) < 0) {
      alert(validationMessage.fileFormatError(typeFile, `${allowExt.join(', ')}`));
    } else if (maxSize < file.size) {
      alert(validationMessage.fileSizeError(maxSizeText));
    } else {
      var formData = new FormData();
      formData.append("file", file);
      formData.append("examQuestionId", $(e.target).attr('question-id') );
      formData.append("examId", examData.id);

      var options = {
        question_id: $(e.target).attr('question-id'),
        questionIndex: $(e.target).attr('questionIndex'),
        sectionIndex: $(e.target).attr('sectionIndex'),
        type: type
      }
      $.ajax({
        url : `/admin/file/upload/${type}`,
        type : 'POST',
        data : formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
          showLoading();
        },
        success: function (res) {
          hideLoading();
          app.addFilePath(options, res.filePath);
        },
        error: function (e) {
          errorProcessingFailed(options.question_id);
        },
      });
    }

    e.target.value = '';
  })
}

function showLineError(el, err) {
  if (err) {
    $(el).next('div.form-view__input__text__inline').addClass('line-red');
  } else {
    $(el).next('div.form-view__input__text__inline').removeClass('line-red');
  }
}

function popup_addSection() {
  // $('#sectionList').modal('hide');
  // $('.btn-add-section').click();
  app.addSectionPopup((res) => {
    app.sectionList.push(res);
    app.section_count = app.section_count + 1;
  });
}

function popup_deleteSection(section_index, sectionId, vueApp) {
  if (sectionId == vueApp.sections[0].id) {
    $('#sectionList').modal('hide');
    $('.btn-delete-section').click();
  } else {
    $.ajax({
      type: "post",
      dataType: 'json',
      url: `${window.location.pathname}/deleteSection/${sectionId}?json=true`,
      beforeSend: function() {
        showLoading();
      },
      success: function (res) {
        hideLoading();
        vueApp.sectionList.splice(section_index, 1);
        vueApp.section_count = vueApp.section_count - 1;
        var indexSectionCurrent = vueApp.sectionList.findIndex((section) => {
          return section.id == vueApp.sections[0].id;
        });
        vueApp.current_section = indexSectionCurrent;
      },
      error: function (e) {
        hideLoading();
        $(document).find(".header-custom-popup").text(processingFailed);
      },
    });
  }
}

$(document).on('click', 'input[type="checkbox"], input[type="radio"]', function () {
  var elementPoints = $(this).parent().parent().prev().prev().prev().find('input');
  var elementMessage = $(this).parent().parent().next();
  elementPoints.blur();
  if (!elementPoints.val()) {
    elementMessage.css({'display': 'none'});
  }
});

$(document).on('input', 'input[type="number"]', function (e) {
  var divInputText = $(this).parent().parent().prev();
  var input = divInputText.find('input[type="text"]');
  if (input) {
    input.focus();
    $(this).focus();
  }
});

var placeCursor = null;
$(document).on('focusin', 'textarea, input, select', function (e) {
  if ($(e.target).is('input') || $(e.target).is('textarea')) {
    placeCursor = e.target;
  } else {
    placeCursor = null;
  }
});

var enableFocusout = true;
$(document).on('focusout', 'textarea, input', function (e) {
  if (!enableFocusout) {
    return;
  }
  e.preventDefault();
  enableFocusout = false;
  validateAll();
  setTimeout(() => {
    if (enableFocusout) {
      $(placeCursor).blur();
      $(placeCursor).focus();
    }
    enableFocusout = true;
  }, 100);
});

$(document).on('change', 'select', function () {
  setTimeout(() => {
    validateAll();
  }, 200);
});

// specchange /5
function validateAll() {
  $('textarea').each(function (e) {
    if ($(this).val() === null || $(this).val() === undefined || $(this).val() === '') {
      cursorFocus($(this));
      $(this).blur();
    }
  });
  $(document).find('input').not("input[type='hidden'], input[type='checkbox'], input[type='file']").each(function (e) {
    cursorFocus($(this));
    $(this).blur();
  });
}

function cursorFocus(elem) {
  var x = window.scrollX;
  var y = window.scrollY;
  elem.focus();
  window.scrollTo(x, y);
}

function errorProcessingFailed(examQuestionId) {
  hideLoading();
  if (!examQuestionId) {
    $(document).find("[processing-failed='section']").text(processingFailed);
  }
  var question = $(document).find("[question_id='" + examQuestionId + "']");
  var questionChild = $(document).find("[question_child_id='" + examQuestionId + "']");
  if (question.length > 0) {
    question.find("[processing-failed='" + examQuestionId + "']").text(processingFailed);
  } else {
    questionChild.find("[processing-failed='" + examQuestionId + "']").text(processingFailed);
  }
}