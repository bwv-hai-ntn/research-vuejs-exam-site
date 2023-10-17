Vue.use(window.vuelidate.default)
const { required, maxLength } = window.validators

Vue.component('clear-button', {
    template: `
      <button type="button" class="btn btn-success float-right btn-clear" v-on:click="handleButton">Clear</button>
      `,
    methods: {
      handleButton: function(e) {
        $('input[type="text"]').val('');
        app.admin.category = '';
      }
    }
});

Vue.component('category-table', {
    props: ['data', 'permission'],
    data() {
        return {
            catagoryList: this.data,
            errormsg: null,
            isAdd: false,
            isUpdate: false,
            admin: {
                categoryName: null,
                categoryUpdateName: null
            }
        };
    },
    created() {
        setTimeout(() => {
            app.admin.category = '';
          }, 100);
    },
    template:`
        <div>
            <div class="row row-search" style="margin-bottom: 10px">
                <div class="col-md-12">
                    <button type="button" class="btn btn-info float-right" id="exam-search" @click="searchCategory()">Search</button>
                    <clear-button>
                    </clear-button>
                </div>
            </div>
            <div class="table-responsive no-padding tableFixHead responsive-tb" id="table-div">
                <table id="data-table" class="table table-row-color magrin-bot-0" style="width: 100%;">
                   <hr class="bottom-header">  
                  <thead>
                        <tr style="color: #673ab7;">
                            <th class="w-50"><span>ID</span></th>
                            <th :style="!isAdd && !isUpdate ? 'width:82%' : 'width:68%'">
                                <span>Category name</span>
                            </th>
                            <th v-if="permission == 'ADMIN'" :style="!isAdd && !isUpdate ? 'width:6%' : 'width:12%'"></th>
                            <th v-if="permission == 'ADMIN'" :style="!isAdd && !isUpdate ? 'width:6%' : 'width:12%'"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in catagoryList" :key="item.id">
                            <td width="6%">
                                {{item.id}}
                            </td>
                            <td class="truncate">
                                <div v-if="item.isUpdate == true">
                                    <input type="text"
                                        v-model="$v.admin.categoryUpdateName.$model"
                                        @input="validationMsg('categoryUpdateName', 'Category name')"
                                        @blur="validationMsg('categoryUpdateName', 'Category name')"
                                        class="form-control no-outline input-color" style="margin-right: 10px"/>
                                    <div class="form-view__input__text__inline"></div>
                                    <span class="red-text error-validate">{{ errormsg }}</span>
                                </div>
                                <span v-if="!item.isUpdate">
                                    {{item.name}}
                                </span>
                            </td>
                            <td v-if="permission == 'ADMIN'">
                              <span v-if="!isUpdate && !isAdd">
                                <button type="button" id="btn-update" class="btn btn-header" style="margin-right: 10px" @click="onChangeIsUpdate(item.id, 'update')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg>
                                </button>
                             </span>
                              <div style="display: flex" v-if="item.isUpdate == true">
                                <button type="button" class="btn btn-info float-right" @click="saveData(item.id)">Save</button>
                               </div>
                            </td>
                            <td v-if="permission == 'ADMIN'">
                                <span v-if="!isUpdate && !isAdd">
                                    <button type="button" id="btn-delete" class="btn btn-header" style="margin-left: 10px" @click="deleteCataegory(item.id)">
                                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>
                                </span>
                                <div style="display: flex" v-if="item.isUpdate == true">
                                    <button style="margin-left: 0px;" type="button" class="btn btn-success float-right btn-clear" @click="onChangeIsUpdate(item.id, 'cancel')">Cancel</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="isAdd == true">
                            <td>
                            </td>
                            <td>
                                <input type="text"
                                    v-model="$v.admin.categoryName.$model"
                                    @input="validationMsg('categoryName', 'Category name')"
                                    @blur="validationMsg('categoryName', 'Category name')"
                                    class="form-control no-outline input-color" style="margin-right: 10px"/>
                                <div class="form-view__input__text__inline"></div>
                                <span class="red-text error-validate">{{ errormsg }}</span>
                            </td>
                            <td>
                              <div style="display: flex">
                                <button type="button" class="btn btn-info float-right" @click="saveData(0)">Add</button>
                              </div>
                            </td>
                            <td>
                                <div style="display: flex">
                                    <button style="margin-left: 0px;" type="button" class="btn btn-success float-right btn-clear" @click="onChangeIsAdd()">Cancel</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-if="this.catagoryList.length == 0">
                    <tr><td colspan="4"> No results found.</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" style="display: block;">
                <span class="total-result" v-if="this.catagoryList.length != 0"><b style="font-size: 20px;">{{ numberFormat(this.catagoryList.length) }}</b> results found</span>
                <div class="float-right div-bi-plus" v-if="!isAdd && !isUpdate && permission == 'ADMIN'">
                <svg viewBox="0 0 16 16" class="bi bi-plus svg-add" @click="onChangeIsAdd()">
                  <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                </svg>
                <div class="text-add">Add category</div>
                </div>
            </div>
        </div>
    `,
    methods: {
        onChangeIsUpdate(id, flg) {
            this.catagoryList.forEach((value, index) => {
                if (value.id == id) {
                    this.catagoryList[index].isUpdate = !this.catagoryList[index].isUpdate;
                    if (flg == 'cancel') {
                        this.admin.categoryUpdateName = null;
                    } else {
                        this.admin.categoryUpdateName = this.catagoryList[index].name;
                    }
                }
            });
            this.errormsg = null;
            this.isUpdate = !this.isUpdate;
        },
        onChangeIsAdd() {
          this.admin.categoryName = null;
          this.errormsg = null;
          this.isAdd = !this.isAdd;
          if (this.isAdd) {
            var heightTable = $('.tableFixHead table').height();
            $(".tableFixHead ").animate({ scrollTop: heightTable }, 1000);
          }
        },
        async searchCategory() {
            if (typeof app.searchForm == 'function') {
                showLoading()
                const paramCategory = app.admin.category != undefined && app.admin.category != null ? app.admin.category : '';
                const url = `/admin/category/getCategoryByName?categoryName=${paramCategory}`;
                const content = await fetch(url, {
                    method: "GET"
                }).catch(() => { hideLoading(); });
                const catagoryData = await content.json();
                this.catagoryList = catagoryData;
              hideLoading();
              setTimeout(() => {
                setHeightTable(true);
              }, 100);
            }
        },
        numberFormat(data) {
            return numberFormat(data);
        },
        validationMsg: function (field, label) {
            this.errormsg = getValidationMsg(this.$v.admin[field], label);
            showLineError(`[name="${this.fieldName}"]`, this.errormsg !== undefined);
        },
        async saveData(id) {
            if (id == 0) { // add category
                this.validationMsg('categoryName', 'Category name');
            } else { // update category
                this.validationMsg('categoryUpdateName', 'Category name');
            }
            if (this.errormsg == null) {
                showLoading();
                const rawResponse = await fetch('/admin/category/saveDataCatagory', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        categoryId: id,
                        categoryName: id == 0 ? this.admin.categoryName : this.admin.categoryUpdateName
                    })
                }).catch(() => { hideLoading() });
                const content = await rawResponse.json();
                if (content.status == 'isExist') {
                    this.errormsg = ' This Category name has already been used.';
                    hideLoading();
                    return;
                }
                if (content.status == 'ok') {
                    var categoryName = app.admin.category;
                    if (app.admin.category == null) {
                        categoryName = '';
                    }
                    const url = `/admin/category/getCategoryByName?categoryName=${categoryName}`;
                    const content = await fetch(url, {
                        method: "GET"
                    });
                    const catagoryData = await content.json();
                    this.catagoryList = catagoryData;
                }
                // reset data
                this.admin.categoryUpdateName = null;
                this.admin.categoryName = null;
                this.isAdd = false;
                this.isUpdate = false;
                hideLoading();
            }
        },
        async deleteCataegory(id) {
            showLoading();
            const rawResponse = await fetch('/admin/category/deleteCategory', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    categoryId: id,
                })
            }).catch(() => { hideLoading() });
            const result = await rawResponse.json();
            if (result.status == 'ok') {
                var categoryName = app.admin.category;
                if (app.admin.category == null) {
                    categoryName = '';
                }
                const url = `/admin/category/getCategoryByName?categoryName=${categoryName}`;
                const content = await fetch(url, {
                    method: "GET"
                }).catch(() => { hideLoading() });
                const catagoryData = await content.json();
                this.catagoryList = catagoryData;
            }
            // reset data
            this.admin.categoryUpdateName = null;
            this.admin.categoryName = null;
            this.isAdd = false;
            this.isUpdate = false;
            hideLoading();
        }
    },
    validations: {
        admin: {
            categoryName: {
                required,
                maxLength: maxLength(100)
            },
            categoryUpdateName: {
                required,
                maxLength: maxLength(100)
            }
        }
    }
});

app = new Vue({
    el: '.vue-app',
    data: {
        admin: {
          category: null
        }
    },
    methods: {
        searchForm() {
            return this.admin.category;
        }
    },
    validations: {
        admin: {
          category: {}
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
      'height': $(window).height() + 'px',
    });
  }
  var heightTable = $(window).height();
  $('.responsive-tb').css('height', heightTable + 'px');
  var heightDocument = $(document).height();
  var heightWindow = $(window).height();
  var redundant = heightDocument - heightWindow;
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
      width: '98.55%'
    })
  } else {
    $('.bottom-header').css({
      width: '100%'
    })
  }
}