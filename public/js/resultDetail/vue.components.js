var answerData = $('input[name=answerData]').val() ?  JSON.parse($('input[name=answerData]').val()) : [];

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
      var form = $('.sectionForm');
      form.each(function(i, ele){
        var examQuestionPoints = JSON.parse($(ele).find('input[name=examQuestionPoints]').val());
        var answersPoints = JSON.parse($(ele).find('input[name=answersPoints]').val());
        $(ele).find('#pointsSection').html(answersPoints + ' of ' + examQuestionPoints + ' points');
      });
      // fix heigth of header
      if ($('.header-result').height() > 70) {
        $('#exam-title').css('margin-top', '100px');
      }
    },
    methods:{
      handleClick: function (e) {
        this.$v.$touch();
      },
      checkForm: function (e) {
        e.preventDefault();
      },
      // loadmore data
      loadmoreResultDetail: function(e) {
        showLoading();
        var formHide = $('.sectionForm:hidden');
        setTimeout(() => {
          formHide.each(function(i, ele){
            if (i <= 4) {
              $(ele).removeClass('hide');
            }
          });
          // hide load more button
          if (formHide.length < 5) {
            $('#loadmore-result-detail').css('visibility', 'hidden').closest('.loadmore').css('cursor', 'default');
          }
          hideLoading()
        }, 200);
      }
    },
    validations: {
      admin: {
      }
    }
  });
}