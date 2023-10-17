var queryData = JSON.parse($('input[name=queryData]').val()) ? JSON.parse($('input[name=queryData]').val()) : [];

Vue.use(window.vuelidate.default)
const { required, maxLength } = window.validators

Vue.component('clear-button', {
  template: `
    <button type="button" class="btn btn-success float-right btn-clear" v-on:click="handleButton">Clear</button>
    `,
  methods: {
    handleButton: function(e) {
      $('input[type="text"]').val('');
      $('select option:selected').prop('selected', false);
      $('input[type="checkbox"]').prop('checked', false);
      $('input[type="checkbox"][value="0"]').prop('checked', true);
      app.admin.cbxStatus = [0];
      app.admin.title = '';
      app.admin.description = '';
      app.admin.accessKey = '';
    }
  }
});

Vue.component('exam-table', {
  props: ['data', 'count', 'static', 'messageList', 'option', 'permission'],
  data() {
    return {
      exams: this.data,
      countExams: this.count,
      valueList: this.static,
      tableData: this.option,
      cbxCategory: [],
      constCbxCategory: [],
      examId: 0,
      examCategoryName: '',
      constTableData: this.option,
      currentPage: offset !== null ? parseInt(offset, 10) : 1,
    };
  },
  created() {
    setTimeout(() => {
        $('input[type="text"]').val('');
        $('select option:selected').prop('selected', false);
        $('input[type="checkbox"]').prop('checked', false);
        $('input[type="checkbox"][value="0"]').prop('checked', true);
        app.admin.cbxStatus = [0];
        app.admin.title = '';
        app.admin.description = '';
        app.admin.accessKey = '';
      }, 100);
  },
  template: `
    <div>
    <div class="row" style="margin-bottom: 10px;margin-top: 10px;">
        <div class="col-md-12">
            <button type="button" class="btn btn-info float-right" id="exam-search" @click="searchButton()">Search</button>
            <clear-button>
            </clear-button>
        </div>
    </div>
    <div class="table-responsive no-padding tableFixHead responsive-tb" id="table-div">
        <hr class="bottom-header-exam-list">  
        <table id="data-table" class="table table-row-color magrin-bot-0" style="width: 100%;">
            <thead class="text-vertical">
                <tr style="color: #673ab7;">
                    <th><span>ID</span></th>
                    <th>
                        <div class="w-200">
                            <span>Exam title</span>
                        </div>
                    </th>
                    <th>
                        <div class="w-100">
                            <span>Access key</span>
                        </div>
                    </th>
                    <th></th>
                    <th>
                        <div class="w-200">
                            <span>Exam description</span>
                        </div>
                    </th>
                    <th><span></span></th>
                    <th>
                        <div class="w-200">
                            <span>Exam categories</span>
                        </div>
                    </th>
                    <th></th>
                    <th><span>Accepting responses</span></th>
                    <th><span>Requires sign in</span></th>
                    <th>
                        <div class="w-200">
                            <span>Restrict domain</span>
                        </div>
                    </th>
                    <th class="w-200"><span style="display: block;inline-size: max-content;">Limit to <br>1 response</span></th>
                    <th>
                        <div class="w-100">
                            <span>Total test time</span>
                        </div>
                    </th>
                    <th>
                        <div class="w-100">
                            <span>Number of questions</span>
                        </div>
                    </th>
                    <th>
                        <div class="w-100">
                            <span>Total points</span>
                        </div>
                    </th>
                    <th><span>Passing percentage</span></th>
                    <th>
                        <div class="w-270">
                            <span>After submission</span>
                        </div>
                    </th>
                    <th>
                        <div class="w-150">
                            <span>Result validity</span>
                        </div>
                    </th>
                    <th>
                        <div class="w-150">
                            <span>Shuffle question order</span>
                        </div>
                    </th>
                    <th>
                        <div class="w-150">
                            <span>Shuffle option order</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in exams" :key="item.id" :style="item.deleted != null ? 'background-color: lightgray;': ''" >
                    <td>
                        <a :href="examCreateEdit(item.id)">{{ item.id }}</a>
                    </td>
                    <td class="truncate">
                        {{ item.title }}
                    </td>
                    <td class="truncate">
                        {{ item.accessKey }}
                    </td>
                    <td>
                        <button type= "button" class="btn btn-copy custom-btn-copy" v-if="item.accessKey !== null" v-on:click="copyToClipboard(item.accessKey)">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                                <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/>
                            </svg>
                        </button>
                    </td>
                    <td class="truncate">
                        {{ item.description }}
                    </td>
                    <td>
                        <span>
                            <button type= "button" id="btn-delete" class="btn btn-header" v-if="item.deleted === null" v-on:click="deleteAndRevert(item.id, 'delete')">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                            </button>
                            <button type= "button" id="btn-revert" class="btn btn-header" v-if="item.deleted !== null" v-on:click="deleteAndRevert(item.id, 'revert')">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-counterclockwise" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                                </svg>
                            </button>
                        </span>
                    </td>
                    <td class="truncate">
                        {{ categoryName(item.categoryName) }}
                    </td>
                    <td>
                        <div>
                          <button type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg" 
                            v-on:click="onClickModify(item.id, item.categoryId)">Modify</button>
                        </div>
                    </td>
                    <td>
                        {{ valueList.onOff[item.acceptAnswer] }}
                    </td>
                    <td>
                        {{ valueList.onOff[item.signinRestrict] }}
                    </td>
                    <td class="truncate">
                        {{ item.userRestrict }}
                    </td>
                    <td>
                        {{ valueList.onOff[item.limitResponse] }}
                    </td>
                    <td class="truncate">
                        <span v-if="item.testTimeSetting == valueList.testTimeSetting['Set based on test'] && item.testTime !== null && item.testTime !== 'undefined'">
                            {{ numberFormat(item.testTime) }} minutes
                        </span>
                        <span v-if="item.testTimeSetting == valueList.testTimeSetting['Set based on section'] && item.testTimeTotal">
                            {{ numberFormat(item.testTimeTotal) }} minutes
                        </span>
                    </td>
                    <td>
                        {{ numberFormat(item.questions) }}
                    </td>
                    <td>
                        {{ numberFormat(item.totalPoints) }}
                    </td>
                    <td>
                        <div v-if="item.passPercentage !== null">{{ numberFormat(item.passPercentage) }}%</div>
                    </td>
                    <td>
                        {{ valueList.afterSubmission[item.showResult] }}
                    </td>
                    <td>
                     <div v-if="item.resultValidity !== null">{{ numberFormat(item.resultValidity) }} minutes</div>
                    </td>
                    <td>
                        {{ valueList.onOff[item.shuffleQuestion] }}
                    </td>
                    <td>
                        {{ valueList.onOff[item.shuffleOption] }}
                    </td>
                </tr>
                <tr v-if="this.countExams == 0">
                    <td colspan="21">No results found.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="pagination" v-if="this.countExams != 0">
        <span class="total-result"><b>{{ numberFormat(this.countExams) }}</b> results found</span>
        <div class="pagination-content">
            <exam-paginate
            :total-pages="Number.isInteger(this.countExams / 50) ? this.countExams / 50 : Number.parseInt(this.countExams / 50) + 1"
            :current-page="this.currentPage"
            @pagechanged="onPageChange"
            >
            </exam-paginate>
        </div>
    </div>

    <div id="modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modify Categories</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 0">
                    <div class="col-md-12">
                        <div class="row row-search">
                            <div class="col-md-8">
                                <!-- Exam title -->
                                <exam-input
                                labelname="Category name"
                                name="category-name"
                                v-model="examCategoryName"
                                ></exam-input>
                            </div>
                        </div>
                        <div class="row row-search">
                            <div class="col-md-12" style="padding-right: 0px">
                                <button type="button" id="exam-popup-search" class="btn btn-info float-right" @click="searchCategory(examCategoryName)">Search</button>
                                <button type="button" class="btn btn-success float-right btn-clear" v-on:click="clearInput">Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-body" style="padding: 0; margin-top: 10px">
                    <div id="collapse">
                        <table class="table table-fixed table-striped" width="100%">
                            <thead>
                                <tr style="color: #673ab7;">
                                    <th class="col-xs-2"></th>
                                    <th class="col-xs-2">ID</th>
                                    <th class="col-xs-8">Category name</th>
                                </tr>
                            </thead>
                            <tbody id="allocate-table-body">
                                <tr v-for="item in tableData" :key="item.id">
                                    <td class="col-xs-2 d-flex justify-content-center">
                                        <input type="checkbox" v-model="cbxCategory" name="cbxCategory" :value="item.id" :checked="true">
                                    </td>
                                    <td class="col-xs-2">
                                        {{item.id}}
                                    </td>
                                    <td class="col-xs-8 truncate" >
                                        {{item.name}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer" style="display: block;">
                    <span id="total-result" class="total-result total-result-mobal" v-if="tableData.length != 0"><b>{{ numberFormat(tableData.length) }}</b> results found</span>
                    <span id="total-result" class="total-result total-result-mobal" v-if="tableData.length == 0">No results found.</span>
                    <span class="total-result float-right" style="margin-left:350px; margin-top:5px; color: #673ab7">Checking {{ numberFormat(cbxCategory.length) }} categories</span>
                    <button type="button" class="btn btn-success float-right btn-clear" data-dismiss="modal">Cancel</button>
                    <button type="button"  id="btn-categories-save" class="btn btn-info float-right" @click="saveData()">Save</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    `,
    methods: {
        examCreateEdit(id) {
            return "/admin/examSettings/"+id;
        },
        copyToClipboard: function(text) {
            var textArea = document.createElement("textarea");
            textArea.value = window.location.origin+'/startTest/'+text;
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            document.execCommand("copy");
            textArea.remove();
        },
        async deleteAndRevert(id, flag) {
            showLoading();
            await $.ajax({
                type: "POST",
                url: "/admin/exam/deleteAndRevert",
                data: {id: id, flag: flag},
                success: function(result) {
                    // location.reload();
                },
                error: function(e) {
                    console.log(e);
                },
                finally: function() {
                    hideLoading();
                }
            });
            await this.onPageChange(this.currentPage);
        },
        categoryName(name) {
           return name !== '' ? name : '';
        },
        onClickModify(id, examCategoryId) {
            examCategoryName = '';
            this.examId = id
            const unique = [...new Set(examCategoryId.map((item) => item))];
            this.cbxCategory = unique
            this.constCbxCategory = examCategoryId
        },
        checked(id) {
            var listId = this.cbxCategory.join("");
            if (listId.indexOf(id) !== -1) {
                return true;
            }
            return false;
        },
        clearInput(e) {
            $('input[name=category-name]').val('');
            this.examCategoryName = ''
        },
        searchCategory(name) {
            if (name != null) {
                name = name.toLowerCase();
            }
            let tmpData = [];
            if(this.constTableData.length > this.tableData.length) {
                this.tableData = this.constTableData;
            }
            for (const item of this.tableData) {
                if (item.name.toLowerCase().indexOf(name) !== -1) {
                    tmpData.push(item);
                }
            }
            this.tableData = tmpData;
        },
        async saveData() {
            $('#btn-categories-save').prop('disabled', true);
            await $.ajax({
                type: "POST",
                url: "/admin/exam/saveExamCategory",
                data: {
                    examId: this.examId,
                    cbxCategory: this.cbxCategory,
                    constCbxCategory: this.constCbxCategory
                },
                success: function() {
                    setTimeout(() => {
                        $('#btn-categories-save').prop('disabled', false);
                    }, 500);
                },
                error: function(e) {
                    console.log(e);
                },
                finally: function() {
                    hideLoading();
                    $('#modal').modal('hide');
                }
            });
            await this.onPageChange(this.currentPage);
            hideLoading();
            $('#modal').modal('hide');
        },
        numberFormat(x) {
            return numberFormat(x);
        },
        async onPageChange(page) {
            this.currentPage = page;
            // callback
            if (typeof app.searchForm === 'function') {
                var data = await app.searchForm(this.currentPage);
                this.exams = data.rows.exams;
                this.countExams = data.count.length;
            }
        },
        async searchButton() {
            // callback
            if (typeof app.searchForm === 'function') {
              this.currentPage = 1;
              var data = await app.searchForm(0)
              this.exams = data.rows.exams;
              this.countExams = data.count.length;
              setTimeout(() => {
                setHeightTable(true);
              }, 100);
            }
        },
    }
});

var url = new URL(window.location.href);
var offset = url.searchParams.get("offset");

if (queryData !== null) {
  app = new Vue({
    el: '.vue-app',
    data: {
      admin: {
        title: queryData.title !== undefined ? queryData.title : '',
        accessKey: queryData.accessKey !== undefined ? queryData.accessKey : '',
        description: queryData.description !== undefined ? queryData.description.title : '',
        category: queryData.category !== undefined ? queryData.category : '',
        cbxStatus: queryData.status !== undefined ? queryData.status : [0]
      },
      examId: 0,
      currentPage: offset !== null ? parseInt(offset, 10) : 1,
    },
    methods: {
      onStatusChange(data) {
        this.admin.cbxStatus = data;
      },
      async searchForm(page) {
        var category = $('#category').val();
        showLoading();
        var url = `/admin/exam/searchExam?title=${this.admin.title}&accessKey=${this.admin.accessKey}&description=${this.admin.description}&category=${category}&status=${this.admin.cbxStatus}`;
        if (page !== 0) {
            url = `/admin/exam/searchExam?title=${this.admin.title}&accessKey=${this.admin.accessKey}&description=${this.admin.description}&category=${category}&status=${this.admin.cbxStatus}&offset=${page}`;
        }
        
        let response = await fetch(url, {
            method: "GET"
        });
        //proceed once the first promise is resolved.
        let data = await response.json().finally(hideLoading());
        //proceed only when the second promise is resolved
        return data;
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
}

setHeightTable();

$(window).resize(function () {
  setHeightTable(true);
})

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
  var redundant = heightDocument - heightWindow + 3;
  heightTable -= redundant;
  $('.responsive-tb').css({
    'height': heightTable + 'px',
  });
    var minHeightWindow = 81;
    var display = 'none';
    if (heightTable > minHeightWindow) {
        display = 'block';
    }
    $('.bottom-header-exam-list').css({
        display: display
    });
  // set bottom header
  if ($('.responsive-tb').height() < $('#table-div')[0].scrollHeight) {
    $('.bottom-header-exam-list').css({
      width: '98.5%'
    })
  } else {
    $('.bottom-header-exam-list').css({
      width: '100%'
    })
  }
}