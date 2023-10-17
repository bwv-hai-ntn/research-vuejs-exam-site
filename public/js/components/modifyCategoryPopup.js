Vue.component('exam-modify-popup', {
    props: ['exam', 'labelname', 'name'],
    data() {
        return {
            errormsg: '',
            label: this.labelname,
            fieldName: this.name,
            examId: this.exam,
            examCategoryName: null,
            constTableData: [],
            tableData: [],
            cbxCategory: [],
            constCbxCategory: [],
            categories: null
        }
    },
    template: `
        <div>
            {{this.categories}}
            <button type="button" id="modify-btn" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg">Modify</button>
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
                                    <div class="col-12 row" style="margin-top: 10px;">
                                        <div class="col-4">
                                            <label style="margin-top:7px" class="purple-text">
                                                Category name
                                            </label>
                                        </div>
                                        <div class="col-8">
                                        <input type="text" v-model="examCategoryName" class="form-control no-outline input-color" v-on:keydown.enter.prevent="denyEnter">
                                        </div>
                                    </div>
                                </div>
                                <div class="row row-search">
                                    <div class="col-md-12" style="padding-right: 0px">
                                        <button type="button" id="exam-popup-search" class="btn btn-info float-right" @click="searchCategory()">Search</button>
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
                            <button type="button" id="catogoties-btn" class="btn btn-info float-right" @click="saveData()">Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-view__input__text__inline" style="border-top: none"></div>
            <span class="red-text error-validate">{{ errormsg }}</span>
        </div>
    `,
    async beforeMount(){
        var categoryName = this.examCategoryName;
        if (categoryName == null) {
            categoryName = '';
        }
        const url = `/admin/category/getCategoryByName?categoryName=${categoryName}`;
        const content = await fetch(url, {
            method: "GET"
        });
        const catagoryData = await content.json();
        this.tableData = catagoryData;
        this.constTableData = catagoryData;
        // get categories
        let response = await fetch('/admin/exam/searchExam?status=0&limitFlag=false', {
            method: "GET"
        });
        let data = await response.json();
        for (const item of data.rows.exams) {
            if (this.examId !== '' && item.id == this.examId) {
                this.categories = item.categoryName
                this.constCbxCategory = item.categoryId;
                break;
            }
        }
        this.cbxCategory = [...new Set(this.constCbxCategory.map((item) => item))];
        this.$emit('getcbxcategories', Array.isArray(this.categories) ? this.categories.join(',') : this.categories);
    },
    methods: {
        clearInput() {
            $('input[name=category-name]').val('');
            this.examCategoryName = ''
        },
        async searchCategory() {
            var categoryName = this.examCategoryName;
            if (categoryName == null) {
                categoryName = '';
            }
            const url = `/admin/category/getCategoryByName?categoryName=${categoryName}`;
            const content = await fetch(url, {
                method: "GET"
            });
            const catagoryData = await content.json();
            this.tableData = catagoryData;
        },
        async saveData() {
            this.$emit('saved', this.constCbxCategory.join(','), this.cbxCategory.join(','));
            const arrayCategory = [];
            for (const i of this.constTableData) {
                if (this.cbxCategory.indexOf(i.id) !== -1) {
                    arrayCategory.push(i.name);
                }
            }
            this.categories = arrayCategory.join(", ");
            $('#modal').modal('hide');
            // check validate
            if (typeof app.validationMsg === 'function') {
                const that = this;
                that.errormsg = app.validationMsg(that.fieldName, that.labelname);
                showLineError(`[name="${that.fieldName}"]`, that.errormsg !== undefined);
            }
        },
        numberFormat(x) {
            return numberFormat(x);
        },
        denyEnter: function(e) {
          e.preventDefault();
          return false;
        }
    }
});