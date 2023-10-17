var queryData = JSON.parse($('input[name=queryData]').val()) ? JSON.parse($('input[name=queryData]').val()) : [];
var processingFailed = $('input[name=processingFailed]').val();
var sentEmailSuccessfully = $('input[name=sentEmailSuccessfully]').val();

Vue.use(window.vuelidate.default)
const { required, maxLength, email } = window.validators
Vue.component('clear-button', {
    template: `
      <button type="button" class="btn btn-success float-right btn-clear" v-on:click="handleButton">Clear</button>
      `,
    methods: {
      handleButton: function() {
        $(document).find(".mess-submit").addClass('hide');
        $('input[type="text"]').val('');
        $('input[type="number"]').val('');
        $('input[name="result"]').prop('checked', false);
        $('input[name="result"][value=""]').prop('checked', true);
        $('input[name="status"]').prop('checked', false);
        $('input[name="status"][value="1"]').prop('checked', true);
        app.admin.examName = '';
        app.admin.examEmail = '';
        app.admin.totalFrom = '';
        app.admin.totalTo = '';
        app.admin.percentageFrom = '';
        app.admin.percentageTo = '';
        app.admin.status = [1];
        app.admin.result = [];
      }
    }
  });

Vue.component('exam-table', {
  props: ['data', 'count', 'static', 'messageList', 'option', 'permission', 'straswers', 'completed', 'exam', 'show'],
    data() {
      return {
        answers: this.data,
        countAnswers: this.count,
        valueList: this.static,
        currentPage: offset !== null ? parseInt(offset, 10) : 1,
        completedAnswers: this.completed,
        passedAnswers: this.straswers,
        iconColumnAcvite: 'id-increase',
        moment: moment
      };
    },
    created() {
      if (/^\/admin\/answer\/([0-9]+)\/view$/.test(sessionStorage.getItem('history')) === false) {
        setTimeout(async () => {
          $(document).find(".mess-submit").addClass('hide');
          $('input[type="text"]').val('');
          $('input[type="number"]').val('');
          $('input[name="result"]').prop('checked', false);
          $('input[name="result"][value=""]').prop('checked', true);
          $('input[name="status"]').prop('checked', false);
          $('input[name="status"][value="1"]').prop('checked', true);
          app.admin.examName = '';
          app.admin.examEmail = '';
          app.admin.totalFrom = '';
          app.admin.totalTo = '';
          app.admin.percentageFrom = '';
          app.admin.percentageTo = '';
          app.admin.status = [1];
          app.admin.result = [];
          }, 100);
      } 
    },
  template: `
      <div>
      <div class="row row-button-search" style="margin-bottom: 10px">
          <div class="col-md-12">
              <button type="button" class="btn btn-info float-right" id="exam-search" @click="searchButton()">Search</button>
              <clear-button>
              </clear-button>
          </div>
      </div>
      <div class="no-padding tableFixHead responsive-tb"  id="table-div">
          <hr class="bottom-header">
          <table id="data-table" class="table table-row-color magrin-bot-0" style="width: 100%;" fixed-header>
                <thead>
                  <tr style="color: #673ab7;">
                      <th>
                      <div class="relative w-30">
                        <span class="pd-3">ID</span>
                        <svg @click="sort('id', 'increase');" :class="iconColumnAcvite == 'id-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                          <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                        </svg>
                        <svg @click="sort('id', 'decrease');" :class="iconColumnAcvite == 'id-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </div>
                      </th>
                      <th>
                          <div class="w-200 relative">
                            <span class="pd-3">Examinee name</span>
                            <svg @click="sort('examineeName', 'increase')" :class="iconColumnAcvite == 'examineeName-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                              <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                            </svg>
                            <svg @click="sort('examineeName', 'decrease')" :class="iconColumnAcvite == 'examineeName-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                              <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                          </div>
                      </th>
                      <th>
                          <div class="w-200 relative">
                            <span class="pd-3">Examinee email</span>
                            <svg @click="sort('examineeEmail', 'increase')" :class="iconColumnAcvite == 'examineeEmail-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                              <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                            </svg>
                            <svg @click="sort('examineeEmail', 'decrease')" :class="iconColumnAcvite == 'examineeEmail-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                              <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                          </div>
                      </th>
                      <th>
                        <div class="relative w-100" style="width: 70px;">
                          <span class="pd-3">Country</span>
                          <svg @click="sort('country', 'increase')" :class="iconColumnAcvite == 'country-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                          </svg>
                          <svg @click="sort('country', 'decrease')" :class="iconColumnAcvite == 'country-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                          </svg>
                        </div>
                      </th>
                      <th>
                        <div class="relative w-100">
                          <span class="pd-3">Status</span>
                          <svg @click="sort('status', 'increase')" :class="iconColumnAcvite == 'status-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                          </svg>
                          <svg @click="sort('status', 'decrease')" :class="iconColumnAcvite == 'status-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                          </svg>
                        </div>
                      </th>
                      <th>
                       <div class="relative w-150">
                          <span class="pd-3 max-content">Completed at</span>
                          <svg @click="sort('completedAt', 'increase')" :class="iconColumnAcvite == 'completedAt-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                          </svg>
                          <svg @click="sort('completedAt', 'decrease')" :class="iconColumnAcvite == 'completedAt-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                          </svg>
                        </div>
                      <th>
                      <div class="relative" style="width:100px">
                      <span class="pd-3 max-content">Total score</span>
                      <svg @click="sort('totalScore', 'increase')" :class="iconColumnAcvite == 'totalScore-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                      <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                    </svg>
                    <svg @click="sort('totalScore', 'decrease')" :class="iconColumnAcvite == 'totalScore-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                      </div>
                      </th>
                      <th>
                      <div class="relative" style="width:145px">
                      <span class="pd-3 max-content">Score percentage</span>
                      <svg @click="sort('scorePercentage', 'increase')" :class="iconColumnAcvite == 'scorePercentage-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                        <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                      </svg>
                      <svg @click="sort('scorePercentage', 'decrease')" :class="iconColumnAcvite == 'scorePercentage-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                      </div>
                      </th>
                      <th>
                        <div class="w-100 relative">
                            <span class="pd-3">Result</span>
                            <svg @click="sort('result', 'increase')" :class="iconColumnAcvite == 'result-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                            <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                          </svg>
                          <svg @click="sort('result', 'decrease')" :class="iconColumnAcvite == 'result-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                          </svg>
                        </div>
                      </th>
                      <th></th>
                      <th v-if="show">
                      <div class="relative w-150">
                        <span class="pd-3 max-content">Access key</span>
                        <svg @click="sort('accessKey', 'increase')" :class="iconColumnAcvite == 'accessKey-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                          <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                        </svg>
                        <svg @click="sort('accessKey', 'decrease')" :class="iconColumnAcvite == 'accessKey-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </div>
                      </th>
                      <th v-if="show"></th>
                      <th v-if="show">
                       <div class="relative w-150">
                        <span class="pd-3 max-content">Expired at</span>
                        <svg @click="sort('expiredAt', 'increase')" :class="iconColumnAcvite == 'expiredAt-increase' ? 'color-svg' : ''" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill icon-color icon-up" viewBox="0 0 16 16">
                          <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                        </svg>
                        <svg @click="sort('expiredAt', 'decrease')" :class="iconColumnAcvite == 'expiredAt-decrease' ? 'color-svg' : ''" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill icon-color icon-down" viewBox="0 0 16 16">
                          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </div>
                      </th>
                      <th v-if="showHeaderSendResult()"><span class="max-content"></span></th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="item in answers" :key="item.id">
                      <td>
                          <a :href="item.id + '/view'">{{ item.id }}</a>
                      </td>
                      <td class="truncate">
                          {{ item.name }}
                      </td>
                      <td class="truncate">
                          {{ item.email }}
                      </td>
                      <td>
                        <span v-if="item.country == valueList.country.Vietnam || item.country == valueList.country.Japan">
                          {{ valueList.country[item.country ] }}
                        </span>
                      </td>
                      <td>
                      <span v-if="item.completedTest == valueList.examStatusAnswer.Completed">{{ valueList.examStatusAnswer[item.completedTest] }}</span>
                      <span v-else> {{ valueList.examStatusAnswer[0] }} </span>
                      </td>
                      <td class="w-100">
                        {{ formatDateTime(item.completedAt) }}
                      </td>
                      <td class="truncate w-150" v-text="formatNumber(item.totalScore)">
                      </td>
                      <td class="w-170">
                      <span v-if="item.scorePercentage" v-text="formatPercent(item.scorePercentage)"></span>
                      </td>
                      <td class="truncate">
                      <span v-if="item.passExam == valueList.examListResultCheckBox.Failed || item.passExam == valueList.examListResultCheckBox.Passed">{{ valueList.examListResultCheckBox[item.passExam] }}</span>
                      </td>
                      <td>
                        <button type= "button" id="btn-delete" class="btn btn-header" @click="btnDelete(item.id)">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                      </td>
                      <td v-if="show" class="w-200 truncate">
                        {{ item.accessToken }}
                      </td>
                      <td v-if="show">
                        <button v-if="item.accessToken" type= "button" class="btn btn-copy btn-copy-custom" @click="copyToClipboard(item.accessToken, item.id)">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                            </svg>
                        </button>
                      </td>
                      <td v-if="show" class="truncate w-200">
                      {{ formatDateTime(item.expiredAt) }}
                      </td>
                      <td class="w-200" v-if="showHeaderSendResult()">
                        <button style="min-width: 130px" v-if="item.email != null && item.completedTest == valueList.examStatusAnswer.Completed" type="button" data-target=".bd-example-modal-lg" class="btn btn-info btn-modify" @click="sendEmail(item.id)">Send result</button>
                      </td>
                  </tr>
                  <tr v-if="this.countAnswers == 0">
                    <td colspan="14">No results found.</td>
                  </tr>
              </tbody>
          </table>
      </div>
  
      <div class="pagination">
          <span v-if="this.countAnswers != 0" class="total-result"><b>{{ numberFormat(this.countAnswers) }}</b> results found</span>
          <div v-if="this.countAnswers != 0" class="pagination-content">
              <exam-paginate
              :total-pages="Number.isInteger(this.countAnswers / 50) ? this.countAnswers / 50 : Number.parseInt(this.countAnswers / 50) + 1"
              :current-page="this.currentPage"
              @pagechanged="onPageChange"
              >
              </exam-paginate>
          </div>
      </div>
    <div class="float-right" :style="[ countAnswers > 0 ? {'margin-top': '-54px'} : {} ]" >
      <table>
        <tr>
            <td class="purple-text">Completed answers </td>
            <td style="padding-left: 10px" class="truncate w-100">{{ completedAnswers }}</td>
        </tr>
        <tr>
            <td class="purple-text">Passed answers</td>
            <td style="padding-left: 10px" class="truncate w-100">{{ passedAnswers }}</td>
        </tr>
      </table>
    </div>
      </div>
      `,
  methods: {
    async sendEmail(answerId) {
      showLoading();
      try {
        var url = '/admin/answer/sendEmail';
        var response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            examId: this.exam.id,
            answerId
          })
        });
        if (response.ok) {
          $('#exam-search').click();
          $(document).find(".mess-submit").addClass('success-text').removeClass('hide failed-text');
          $(document).find(".mess-alert").text(sentEmailSuccessfully);
          hideLoading();
        } else {
          $(document).find(".mess-submit").addClass('failed-text').removeClass('hide success-text');
          $(document).find(".mess-alert").text(processingFailed);
          hideLoading();
        }
      } catch (err) {
        $(document).find(".mess-submit").addClass('failed-text').removeClass('hide success-text');
        $(document).find(".mess-alert").text(processingFailed);
        hideLoading();
      }
    },
    formatDateTime(data) {
      return data ? this.moment(data).format('YYYY/MM/DD HH:mm:ss') : data;
    },
    showHeaderSendResult() {
      return this.valueList.showResult[this.exam.showResult] !== undefined;
    },
    showSendResult(email) {
      return this.valueList.showResult[this.exam.showResult] !== undefined && email !== null;
    },
    changeColor(e) {
      
    },
    formatNumber(totalScore) {
      if (totalScore) {
        totalScore = totalScore.toString().replace(/(.)(?=(\d{3})+$)/g, '$1,');
      }
      return totalScore;
    },
    formatPercent(scorePercentage) {
      if (scorePercentage) {
        var arrNumber = scorePercentage.toString().split(".");
        var number = '';
        if (arrNumber[0]) {
          number = this.formatNumber(arrNumber[0]).toString();
        }
        if (arrNumber[1]) {
          number = number + '.' + arrNumber[1];
        }
        return number + '%';
      }
      return scorePercentage;
    },
    sort(column, type) {
      var columnTable = {
        id: 'id',
        examineeName: 'examineeName',
        examineeEmail: 'examineeEmail',
        status: 'status',
        totalScore: 'totalScore',
        scorePercentage: 'scorePercentage',
        result: 'result',
        country: 'country',
        completedAt: 'completedAt',
        accessKey: 'accessKey',
        expiredAt: 'expiredAt'
      }
      var typeSort = {
        increase: 'increase',
        decrease: 'decrease'
      }
      //add class color
      this.iconColumnAcvite = column + '-' + type;
      // sort
      switch (column) {
        case columnTable.id:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => answer.id], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => answer.id], ['desc']);
          }
          break;
        case columnTable.accessKey:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer =>
              answer.accessToken ? answer.accessToken.toLowerCase() : answer.accessToken],
              ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer =>
              answer.accessToken ? answer.accessToken.toLowerCase() : answer.accessToken],
              ['desc']);
          }
          break;
        case columnTable.examineeName:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => answer.name ? answer.name.toLowerCase() : answer.name], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => answer.name ? answer.name.toLowerCase(): answer.name], ['desc']);
          }
          break;
        case columnTable.examineeEmail:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => answer.email ? answer.email.toLowerCase(): answer.email], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => answer.email ? answer.email.toLowerCase(): answer.email], ['desc']);
          }
          break;
        case columnTable.status:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => {
              if (answer.completedTest == this.valueList.examStatusAnswer.Completed) {
                return this.valueList.examStatusAnswer[answer.completedTest];
              }
              return this.valueList.examStatusAnswer[0];
            }], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => {
              if (answer.completedTest == this.valueList.examStatusAnswer.Completed) {
                return this.valueList.examStatusAnswer[answer.completedTest];
              }
              return this.valueList.examStatusAnswer[0];
            }], ['desc']);
          }
          break;
        case columnTable.totalScore:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => answer.totalScore], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => answer.totalScore], ['desc']);
          }
          break;
        case columnTable.scorePercentage:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => answer.scorePercentage], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => answer.scorePercentage], ['desc']);
          }
          break;
        case columnTable.result:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => {
              if (answer.passExam == this.valueList.examListResultCheckBox.Failed || answer.passExam == this.valueList.examListResultCheckBox.Passed) {
                return this.valueList.examListResultCheckBox[answer.passExam];
              }
              return '';
            }], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => {
              if (answer.passExam == this.valueList.examListResultCheckBox.Failed || answer.passExam == this.valueList.examListResultCheckBox.Passed) {
                return this.valueList.examListResultCheckBox[answer.passExam];
              }
              return '';
            }], ['desc']);
          }
          break;
        case columnTable.country:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => {
              if (answer.country == this.valueList.country.Vietnam || answer.country == this.valueList.country.Japan) {
                return this.valueList.country[answer.country];
              }
              return '';
            }], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => {
              if (answer.country == this.valueList.country.Vietnam || answer.country == this.valueList.country.Japan) {
                return this.valueList.country[answer.country];
              }
              return '';
            }], ['desc']);
          }
          break;
        case columnTable.completedAt:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => {
              return this.moment(answer.completedAt).format('YYYY/MM/DD HH:mm:ss') ;
            }], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => {
              return this.moment(answer.completedAt).format('YYYY/MM/DD HH:mm:ss') ;
            }], ['desc']);
          }
          break;
        case columnTable.expiredAt:
          if (type == typeSort.increase) {
            this.answers = _.orderBy(this.answers, [answer => {
              return this.moment(answer.expiredAt).format('YYYY/MM/DD HH:mm:ss');
            }], ['asc']);
          }
          if (type == typeSort.decrease) {
            this.answers = _.orderBy(this.answers, [answer => {
              return this.moment(answer.expiredAt).format('YYYY/MM/DD HH:mm:ss');
            }], ['desc']);
          }
          break;
        default:
          break;
      }
    },
    async btnDelete(id) {
      showLoading();
      var url = '/admin/answer/' + id;
      await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
          method: "POST"
      }).finally(hideLoading());
      this.onPageChange(this.currentPage);
    },
    copyToClipboard: function (text, answerId) {
      var textArea = document.createElement("textarea");
      textArea.value = window.location.origin + '/resultDetail/' + answerId + '/accessToken/'+text;
      document.body.appendChild(textArea);
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      document.execCommand("copy");
      textArea.remove();
    },
    checked(id) {
      var listId = this.cbxCategory.join("");
      if (listId.indexOf(id) !== -1) {
        return true;
      }
      return false;
    },
    numberFormat(x) {
      return numberFormat(x);
    },
    async onPageChange(page) {
      this.currentPage = page;
      // callback
      if (typeof app.searchForm === 'function') {
        var data = await app.searchForm(this.currentPage);
        this.answers = data.rows;
        this.countAnswers = data.count;
      }
    },
    async searchButton() {
      // callback
      if (typeof app.searchForm === 'function') {
        this.currentPage = 1;
        var data = await app.searchForm(0);
        this.answers = data.rows;
        this.countAnswers = data.count;
        this.passedAnswers = data.strPassedAnswers;
        this.completedAnswers = data.countCompleted;
        setTimeout(() => {
          setHeightTable(true);
        }, 100);
      }
    },
  }
});

var url = new URL(window.location.href);
var offset = url.searchParams.get("offset");
var examId = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
app = new Vue({
    el: '.vue-app',
    data: {
      admin: {
        examName: queryData.examName !== undefined ? queryData.examName : '',
        examEmail: queryData.examEmail !== undefined ? queryData.examEmail : '',
        totalFrom: queryData.totalFrom !== undefined ? queryData.totalFrom : '',
        totalTo: queryData.totalTo !== undefined ? queryData.totalTo : '',
        percentageFrom: queryData.percentageFrom !== undefined ? queryData.percentageFrom : '',
        percentageTo: queryData.percentageTo !== undefined ? queryData.percentageTo : '',
        status: queryData.status !== undefined && queryData.status !== '' ? queryData.status : [],
        result: queryData.result !== undefined && queryData.result !== '' ? queryData.result : []
      },
      examId: 0,
      currentPage: offset !== null ? parseInt(offset, 10) : 1,
    },
    methods: {
      checkForm() {

      },
       async handleButton(e) {
        showLoading();
        // process submit button
        switch (e.target.id) {
          case 'cancel_btn':
            // redirect to ExamList
            window.location.href = window.location.origin + '/admin/exam';
            break;
          case 'copy_btn':
            // copy exam
            this.$refs.form.action = window.location.origin + '/admin/answer/' + examId + '/copy';
            this.$refs.form.submit();
            break;
          case 'delete_btn':
            // Delete exam
            this.$refs.form.action = window.location.origin + '/admin/answer/' + examId + '/delete';
            this.$refs.form.submit();
            break;
          case 'revert_btn':
            // Revert exam
            this.$refs.form.action = window.location.origin + '/admin/answer/' + examId + '/revert';
            this.$refs.form.submit();
            break;
          default:
            hideLoading();
            break;
        }

      },
      onStatusChange(data) {
        this.admin.cbxStatus = data;
      },
      async searchForm(page) {
        $(document).find(".mess-submit").addClass('hide');
        showLoading();
        var url = `/admin/answer/search?examId=${examId}&examName=${this.admin.examName}&examEmail=${this.admin.examEmail}&totalFrom=${this.admin.totalFrom}&totalTo=${this.admin.totalTo}&percentageFrom=${this.admin.percentageFrom}&percentageTo=${this.admin.percentageTo}&status=${this.admin.status}&result=${this.admin.result}`;
        if (page !== 0) {
            url = url + `&offset=${page}`;
        }
        var response = await fetch(url, {
            method: "GET"
        });
        //proceed once the first promise is resolved.
        var data = await response.json().finally(hideLoading());
        return data;
      },
      closeMessage: function(e) {
        $(document).find(".mess-submit").addClass('hide');
      }
    },
    validations: {
        admin: {
          title: {},
          accessKey: {},
          description: {},
          category: {},
          cbxStatus: {}
        }
      }
});

setHeightTable();

$(window).resize(function () {
  setHeightTable(true);
});

/**
 * auto set height for table
 */
function setHeightTable(dirty) {
  if (dirty) {
    $('.responsive-tb').css({
      'height': $(window).height() + 'px',
    });
  }
  var heightTable = $(window).height();
  $('.responsive-tb').css('height', heightTable + 'px');
  var heightDocument = $(document).height();
  var heightWindow = $(window).height();
  var redundant = heightDocument - heightWindow + 5;
  heightTable -= redundant;
  $('.responsive-tb').css({
    'height': heightTable + 'px',
  });
  var minHeightWindow = 57;
  var display = 'none';
  if (heightTable > minHeightWindow) {
    display = 'block';
  }
  $('.bottom-header').css({
    display: display
  });
  // set bottom header
  if ($('.responsive-tb').height() < $('#table-div')[0].scrollHeight) {
    $('.bottom-header').css({
      width: '98.5%'
    })
  } else {
    $('.bottom-header').css({
      width: '100%'
    })
  }
}