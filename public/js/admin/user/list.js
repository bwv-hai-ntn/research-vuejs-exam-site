var queryData = JSON.parse($('input[name=queryData]').val()) ? JSON.parse($('input[name=queryData]').val()) : [];

Vue.use(window.vuelidate.default)
const { required, maxLength } = window.validators
var regexEmail = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
Vue.component('search-button', {
  props: ['type', 'id', 'text'],
  data() {
    return {};
  },
  template: `
      <button :type="type" class="btn btn-info float-right" :id="id">{{ text }}</button>
    `,
});

Vue.component('clear-button', {
  template: `
    <button type="button" class="btn btn-success float-right btn-clear" v-on:click="handleButton">Clear</button>
    `,
  methods: {
    handleButton: function(e) {
      $('input[name="userName"]').val('');
      $('input[name="email"]').val('');
      $('select[name="category"] option:selected').prop('selected', false);
      $('input[name="authority"]').prop('checked', false);
      app.admin.authority = [];
      app.admin.userName = '';
      app.admin.email = '';
      app.admin.category = '';
    }
  }
});

Vue.component('exam-table', {
  props: ['data', 'count', 'static', 'messageList', 'option', 'messages'],
  data() {
    return {
      isHidden: false,
      users: this.data,
      countUsers: this.count,
      valueList: this.static,
      dataInputCategory: {
        cbxCategory: [],
        constCbxCategory: [],
        userId: 0,
        constTableData: this.option,
        tableData: this.option,
      },
      examCategoryName: null,
      currentPage: offset !== null ? parseInt(offset, 10) : 1,
      dataInputEditUser: {
          id: null,
          userNameEdit: null,
          emailEdit: null,
          authorityEdit: null
      },
        htmlAddUser: '',
      msgValidate: null
    };
  },
  template: `
    <div>
    <div class="row" style="margin-bottom: 10px;margin-top: 10px">
        <div class="col-md-12">
            <button type="button" class="btn btn-info float-right" id="exam-search" @click="searchButton()">Search</button>
            <clear-button>
            </clear-button>
        </div>
    </div>
    <div class="table-responsive no-padding tableFixHead responsive-tb"id="table-div">
        <hr class="bottom-header">
        <table id="data-table" class="table table-row-color magrin-bot-0" style="width: 100%;">
            <thead>
                <tr style="color: #673ab7;">
                    <th width="6%"><span>ID</span></th>
                    <th width="20%">
                        <div class="w-200">
                            <span>User name</span>
                        </div>
                    </th>
                    <th width="20%">
                        <div class="w-200">
                            <span>Email</span>
                        </div>
                    </th>
                    <th width="10%">
                        <div class="w-100">
                            <span>Authority</span>
                        </div>
                    </th>
                    <th :style="isHidden ? 'width:12%': 'width:6%'">
                    </th>
                    <th :style="isHidden ? 'width:12%': 'width:6%'">
                    </th>
                    <th width="20%">
                        <div class="w-200">
                            <span>User categories</span>
                        </div>
                    </th>
                    <th v-if="!isHidden" width="12%">
                        <div class="w-100">
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id" v-bind:id="user.id">
                    <td>
                        {{ user.id }}
                    </td>
                    <td class="user truncate user-name">
                        <span v-if="!isHidden || dataInputEditUser.id != user.id">{{ user.userName }}</span>
                        <span v-else-if="dataInputEditUser.id == user.id">
                            <input-nolabel
                            labelname="User name"
                            name="userNameEdit"
                            :required="true"
                            :errorMsg="validationMsg('userNameEdit')"
                            v-model="$v.dataInputEditUser.userNameEdit.$model"
                            :validateChildren="4"
                            v-bind:value="dataInputEditUser.userNameEdit"
                            @input="dataInputEditUser.userNameEdit = $event"
                            ></input-nolabel>
                        </span>
                    </td>
                    <td class="user truncate email">
                        <span v-if="!isHidden || dataInputEditUser.id != user.id">{{ user.email }}</span>
                        <span v-else-if="dataInputEditUser.id == user.id">
                           <div class="col-12 row">
                           <div class="col-10">
                           <input type="text" name="emailEdit" v-model="$v.dataInputEditUser.emailEdit.$model" @blur="$v.dataInputEditUser.emailEdit.$touch" class="form-control no-outline input-color">
                            <div class="form-view__input__text__inline" :class="$v.dataInputEditUser.emailEdit.$anyError ? 'line-red': ''"></div>
                            <span class="red-text error-validate" v-if="!$v.dataInputEditUser.emailEdit.required && !$v.dataInputEditUser.emailEdit.$pending && $v.dataInputEditUser.emailEdit.$anyDirty">{{ msgValidate.requiredError('Email') }} </span>
                             <span class="red-text error-validate" v-if="!$v.dataInputEditUser.emailEdit.maxLength && !$v.dataInputEditUser.emailEdit.$pending && $v.dataInputEditUser.emailEdit.$anyDirty">{{ msgValidate.maxlengthError('Email', 256) }} </span>
                             <span class="red-text error-validate" v-if="!$v.dataInputEditUser.emailEdit.email && !$v.dataInputEditUser.emailEdit.$pending && $v.dataInputEditUser.emailEdit.$anyDirty">{{ msgValidate.emailError() }} </span>
                             </div> 
                             <label class="col-2" style="margin-top: 10px;"></label>
                             </div>
                        </span>
                    </td>
                    <td class="user">
                        <span v-if="!isHidden || dataInputEditUser.id != user.id">
                            <span v-if="user.authority == valueList.authorityScreen.Admin || user.authority == valueList.authorityScreen.Author">{{ valueList.authorityScreen[user.authority] }}</span>
                        </span>
                        <span v-else-if="dataInputEditUser.id == user.id">
                            <exam-select-box-object
                            name="authorityEdit"
                            labelname="Authority"
                            v-model="$v.dataInputEditUser.authorityEdit.$model"
                            v-bind:value="dataInputEditUser.authorityEdit"
                            :options="valueList.authorityScreen"
                            :required="true"
                            :errorMsg="validationMsg('authorityEdit')"
                            :validateChildren="4"
                            @select="dataInputEditUser.authorityEdit = $event"
                            ></exam-select-box-object>
                        </span>
                    </td>
                    <td class="text-center">
                       <button v-if="!isHidden" type= "button" id="btn-edit" class="btn btn-header" v-on:click="editUser(user, $event)">
                            <svg width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                       </button>
                       <button v-else-if="dataInputEditUser.id == user.id" type="button" tabindex="-1" class="btn btn-info" @click="btnSave">Save</button>
                    </td>
                    <td class="text-center">
                    <button v-if="!isHidden" type= "button" id="btn-delete" class="btn btn-header" @click="btnDelete(user.id)">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                    <button v-else-if="dataInputEditUser.id == user.id" type="button" @click="btnCancel" class="btn btn-info btn-clear">Cancel</button>
                    </td>
                    <td class="truncate">
                    <span>{{ user.arrUserCategories }}</span>
                    </td>
                    <td v-if="!isHidden" class="text-center">
                        <button v-if="user.authority != valueList.authorityScreen.Admin" type="button" class="btn btn-info btn-modify" data-toggle="modal" data-target=".bd-example-modal-lg" v-on:click="onClickModify(user.id, user.userCategory)">Modify</button>
                    </td>
                </tr>
                <tr v-if="users.length == 0"><td colspan="8">{{ messages.noResults }}</td></tr>
                <tr v-if="isHidden && dataInputEditUser.id == null">
                    <td></td>
                    <td class="user">
                        <input-nolabel
                            labelname="User name"
                            name="userNameEdit"
                            :required="true"
                            v-model="$v.dataInputEditUser.userNameEdit.$model"
                            :errorMsg="validationMsg('userNameEdit')"
                            :validateChildren="4"
                            v-bind:value="dataInputEditUser.userNameEdit"
                            @input="dataInputEditUser.userNameEdit = $event"
                        ></input-nolabel>
                    </td>
                    <td class="user">
                        <div class="col-12 row">
                            <div class="col-10">
                                <input type="text" name="emailEdit" v-model="$v.dataInputEditUser.emailEdit.$model" @input="$v.dataInputEditUser.emailEdit.$touch" @blur="$v.dataInputEditUser.emailEdit.$touch" class="form-control no-outline input-color">
                                <div class="form-view__input__text__inline" :class="$v.dataInputEditUser.emailEdit.$anyError ? 'line-red': ''"></div>
                                <span class="red-text error-validate" v-if="!$v.dataInputEditUser.emailEdit.required && !$v.dataInputEditUser.emailEdit.$pending && $v.dataInputEditUser.emailEdit.$anyDirty">{{ msgValidate.requiredError('Email') }} </span>
                                <span class="red-text error-validate" v-if="!$v.dataInputEditUser.emailEdit.maxLength && !$v.dataInputEditUser.emailEdit.$pending && $v.dataInputEditUser.emailEdit.$anyDirty">{{ msgValidate.maxlengthError('Email', 256) }} </span>
                                <span class="red-text error-validate" v-if="!$v.dataInputEditUser.emailEdit.email && !$v.dataInputEditUser.emailEdit.$pending && $v.dataInputEditUser.emailEdit.$anyDirty">{{ msgValidate.emailError() }} </span>
                            </div> 
                        <label class="col-2" style="margin-top: 10px;"></label>
                        </div>
                    </td>
                    <td class="user">
                        <exam-select-box-object
                        name="authorityEdit"
                        labelname="Authority"
                        v-bind:value="1"
                        :options="valueList.authorityScreen"
                        :required="true"
                        :errorMsg="validationMsg('authorityEdit')"
                        :validateChildren="4"
                        @select="dataInputEditUser.authorityEdit = $event"
                        ></exam-select-box-object>
                    </td>
                    <td>
                    <button type="button" class="btn btn-info" @click="submitAdd">Add</button>
                    </td>
                    <td>
                    <button type="button" @click="btnCancel" class="btn btn-info btn-clear">Cancel</button>
                    </td>
                    <td></td>
                </tr>
                <div v-if="!isHidden" v-html="htmlAddUser"></div>
            </tbody>
        </table>
    </div>

    <div class="pagination" style="display:block">
        <span v-if="this.countUsers != 0" class="total-result"><b>{{ numberFormat(this.countUsers) }}</b> results found</span>
        <div v-if="!isHidden" class="float-right div-bi-plus">
          <svg viewBox="0 0 16 16" class="bi bi-plus svg-add" @click="btnAdd">
          <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
          <div class="text-add">Add user</div>
        </div>
    </div>

    <div id="modal" class="modal fade bd-example-modal-lg" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
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
                            <tbody v-if="dataInputCategory.tableData.length > 0" id="allocate-table-body">
                                <tr v-for="item in dataInputCategory.tableData" :key="item.id">
                                    <td class="col-xs-2 d-flex justify-content-center">
                                        <input type="checkbox" v-model="dataInputCategory.cbxCategory" name="cbxCategory" :value="item.id" :checked="true">
                                    </td>
                                    <td class="col-xs-2">
                                        {{item.id}}
                                    </td>
                                    <td class="col-xs-8 truncate" >
                                        {{item.name}}
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                            <tr>
                                <td colspan="3">{{ messages.noResults }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer" style="display: block;">
                    <span id="total-result" class="total-result total-result-mobal" v-if="dataInputCategory.tableData.length != 0"><b>{{ numberFormat(dataInputCategory.tableData.length) }}</b> results found</span>
                    <span class="total-result float-right" style="margin-left:350px; margin-top:5px; color: #673ab7">Checking {{ numberFormat(dataInputCategory.cbxCategory.length) }} categories</span>
                    <button type="button" class="btn btn-success float-right btn-clear" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-info float-right" @click="btnSaveCategory()">Save</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    `,
    validations: {
        dataInputEditUser: {
            userNameEdit: {
              required,
              maxLength: maxLength(100)
            },
            emailEdit: {
                required,
                maxLength: maxLength(256),
                email(value) {
                  if (value === '' || value === null) {
                    return true;
                  }
                  return regexEmail.test(value);
                },
            },
            authorityEdit: {
              required
            }
        }
    },
    created() {
      this.msgValidate = validationMessage;
      setTimeout(() => {
        $('input[name="userName"]').val('');
        $('input[name="email"]').val('');
        $('select[name="category"] option:selected').prop('selected', false);
        $('input[name="authority"]').prop('checked', false);
        app.admin.authority = '';
        app.admin.userName = '';
        app.admin.email = '';
        app.admin.category = '';
        }, 100);
    },
    methods: {
        btnAdd() {
          this.isHidden = true;
          this.dataInputEditUser.authorityEdit = 1;
          var heightTable = $('.tableFixHead table').height();
          $(".tableFixHead ").animate({ scrollTop: heightTable }, 1000);
        },
        async submitAdd() {
            if (this.checkValidateSubmit()) {
              showLoading();
              var url = '/admin/user';
              fetch(url, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(this.dataInputEditUser)
              }).then(response => response.json()).then(data => {
                var elementMessage = $('.mess-submit');
                if(data.message) {
                  elementMessage.css({display: 'inherit'}).addClass('failed-text');
                  elementMessage.find('.text-message').text(data.message);
                } else {
                  elementMessage.css({display: 'none'});
                  elementMessage.find('.text-message').text('');
                  this.onPageChange(this.currentPage);
                  this.btnCancel();
                }
              }).finally(hideLoading());
            }
        },
        validationMsg: function (field, label) {
          return getValidationMsg(this.$v.dataInputEditUser[field], label);
        },
        async btnDelete(id) {
          var url = '/admin/user/' + id + '/delete';
          await fetch(url, {
            method: "POST"
          }).finally(hideLoading());
          this.onPageChange(this.currentPage);
          this.isHidden = false;
        },
        checkValidateSubmit() {
            this.$v.$touch();
            if (this.$v.dataInputEditUser.authorityEdit.required &&
                this.$v.dataInputEditUser.emailEdit.required &&
                this.$v.dataInputEditUser.emailEdit.email &&
                this.$v.dataInputEditUser.emailEdit.maxLength &&
                this.$v.dataInputEditUser.userNameEdit.required &&
                this.$v.dataInputEditUser.userNameEdit.maxLength) {
                    this.$v.dataInputEditUser.$reset();
                    return true;
            }
            let firstError = '';
            for (const field of Object.keys(this.$v.dataInputEditUser)) {
              if (this.$v.dataInputEditUser[field]) {
                if (this.$v.dataInputEditUser[field].$error) {
                  firstError = firstError === '' ? field : firstError;
                }
                $(`[name="${field}"]`).focus();
              }
            }
            $(`[name="${firstError}"]`).focus();
            return false;
        },
        async btnSave() {
            if (this.checkValidateSubmit()) {
              showLoading();
              var url = '/admin/user';
              fetch(url, {
                headers : { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(this.dataInputEditUser)
              }).then(response => {
                return response.json();
              }).then(data => {
                var elementMessage = $('.mess-submit');
                if(data.message) {
                  elementMessage.css({display: 'inherit'}).addClass('failed-text');
                  elementMessage.find('.text-message').text(data.message);
                } else {
                  elementMessage.css({display: 'none'});
                  elementMessage.find('.text-message').text('');
                  this.onPageChange(this.currentPage);
                  this.btnCancel();
                }
              }).finally(hideLoading());
            }
        },
      btnCancel() {
        this.addTruncate();
        this.isHidden = false;
        this.dataInputEditUser.id = null;
        this.dataInputEditUser.userNameEdit = null;
        this.dataInputEditUser.emailEdit = null;
        this.dataInputEditUser.authorityEdit = null;
        this.$v.dataInputEditUser.$reset();
        $('button').blur();
      },
      removeTruncate() {
        $('#' + this.dataInputEditUser.id).find('.user-name').removeClass('truncate');
        $('#' + this.dataInputEditUser.id).find('.email').removeClass('truncate');
      },
      addTruncate() {
        $('#' + this.dataInputEditUser.id).find('.user-name').addClass('truncate');
        $('#' + this.dataInputEditUser.id).find('.email').addClass('truncate');
      },
      editUser(user, e) {
        this.isHidden = true;
        this.dataInputEditUser.id = user.id;
        this.dataInputEditUser.userNameEdit = user.userName;
        this.dataInputEditUser.emailEdit = user.email;
        this.dataInputEditUser.authorityEdit = user.authority;
        this.removeTruncate();
      },
      categoryName(name) {
        return name !== '' ? name : 'No results found.';
      },
      onClickModify(id, userCategory) {
        var unique = [...new Set(userCategory.map((category) => category.category.id))];
        this.dataInputCategory.cbxCategory = unique;
        this.dataInputCategory.userId = id;
      },
      checked(id) {
        var listId = this.dataInputCategory.cbxCategory.join("");
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
          if (!name) {
            name = '';
          }
          if (name != null) {
            name = name.toLowerCase();
          }
          var tmpData = [];
          if(this.dataInputCategory.constTableData.length > this.dataInputCategory.tableData.length) {
            this.dataInputCategory.tableData = this.dataInputCategory.constTableData;
          }
          for (var item of this.dataInputCategory.tableData) {
            if (item.name.toLowerCase().indexOf(name) !== -1) {
              tmpData.push(item);
            }
          }
          this.dataInputCategory.tableData = tmpData;
        },
        async btnSaveCategory() {
          var url = '/admin/user/category'
          var response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
              userId: this.dataInputCategory.userId,
              cbxCategory: this.dataInputCategory.cbxCategory
            })
          });
          $('#modal').modal('hide');
          this.onPageChange(this.currentPage);
        },
        numberFormat(x) {
          return numberFormat(x);
        },
        async onPageChange(page) {
          this.currentPage = page;
          // callback
          if (typeof app.searchForm === 'function') {
            var data = await app.searchForm(this.currentPage);
            this.users = data.rows;
            this.countUsers = data.count;
          }
        },
        async searchButton() {
          $('.mess-submit').css({display: 'none'});
          this.isHidden = false;
          this.dataInputEditUser.id = null;
          this.dataInputEditUser.userNameEdit = null;
          this.dataInputEditUser.emailEdit = null;
          this.dataInputEditUser.authorityEdit = null;
          // callback
          if (typeof app.searchForm === 'function') {
              this.currentPage = 1;
              var data = await app.searchForm(0);
              this.users = data.rows;
            this.countUsers = data.count;
            setTimeout(() => {
              setHeightTable(true);
            }, 100);
          }
        },
    }
});

var url = new URL(window.location.href);
var offset = url.searchParams.get("offset");

app = new Vue({
el: '.vue-app',
data: {
  admin: {
  userName: queryData.title !== undefined ? queryData.title : '',
  email: queryData.email !== undefined ? queryData.email : '',
  category: queryData.category !== undefined ? queryData.category : '',
  authority: queryData.authority !== undefined ? queryData.authority : [],
  },
  examId: 0,
  currentPage: offset !== null ? parseInt(offset, 10) : 1,
},
  methods: {
    closeAlertMessage() {
      $('.mess-submit').css({display: 'none'});
    },
    onStatusChange(data) {
      this.admin.authority = data;
    },
    async searchForm(page) {
      var category = $('#category').val();
      showLoading();
      var url = `/admin/user/searchUser?userName=${this.admin.userName}&email=${this.admin.email}&category=${category}&authority=${this.admin.authority}`;
      if (page !== 0) {
        var url = `/admin/user/searchUser?userName=${this.admin.userName}&email=${this.admin.email}&category=${category}&authority=${this.admin.authority}&offset=${page}`;
      }
      var response = await fetch(url, {
        method: "GET"
      });
      //proceed once the first promise is resolved.
      var data = await response.json().finally(hideLoading());
      //proceed only when the second promise is resolved
      return data;
    }
}
});

function showLineError(el, err) {
    if (err) {
      $(el).next('div.form-view__input__text__inline').addClass('line-red');
    } else {
      $(el).next('div.form-view__input__text__inline').removeClass('line-red');
    }
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
      'height': $(window).height() + 'px'
    });
  }
  var heightTable = $(window).height();
  $('.responsive-tb').css('height', heightTable + 'px');
  var heightDocument = $(document).height();
  var heightWindow = $(window).height();
  var redundant = heightDocument - heightWindow + 1;
  heightTable -= redundant;
  $('.responsive-tb').css({
    'height': heightTable + 'px',
  });
  var minHeightWindow = 40;
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