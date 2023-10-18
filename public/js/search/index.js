Vue.use(VeeValidate);

const messages = {
  gte: ($1, $2) => `The ${$1} must be greater than or equal to ${$2}`,
  number: (param) => `The ${param} must be a number.`
};

const dict = {
  custom: {
    priceFrom: {
      isNumber: messages.number('priceFrom')
    },
    priceTo: {
      isNumber: messages.number('priceTo'),
      isBigger: messages.gte('priceTo', 'priceFrom')
    },
    createdDateTo: {
      isGreaterDate: messages.gte('createdDateTo', 'createdDateFrom')
    }
  }
};

VeeValidate.Validator.localize('en', dict);

VeeValidate.Validator.extend(
  'isBigger',
  (value, [otherValue]) => {
    return Number(value) >= Number(otherValue);
  },
  {
    hasTarget: true
  }
);

VeeValidate.Validator.extend(
  'isGreaterDate',
  (value, [otherValue]) => {
    if (
      moment(value, 'YYYY-MM-DD', true).isValid() &&
      moment(otherValue, 'YYYY-MM-DD', true).isValid()
    ) {
      const dateTo = moment(value, 'YYYY-MM-DD');
      const dateFrom = moment(otherValue, 'YYYY-MM-DD');

      return moment(dateFrom).isSameOrBefore(dateTo, 'day');
    }
    return true;
  },
  {
    hasTarget: true
  }
);

VeeValidate.Validator.extend('isNumber', (value) => {
  return (value == '') | /^\d+$/.test(value);
});

// userHeader
Vue.component('information-list', {
  data() {
    return {
      informationList: []
    };
  },
  mounted() {
    $this = this;
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: '/getInformation?limit=6',
      success: function(res) {
        $this.informationList = res.data;

        if (res.headerOpen) {
          $('button[data-bs-target="#navbarHeader"]').trigger('click');
        }
        hideLoading();
      },
      error: function(e) {
        console.log(e);
        hideLoading();
      }
    });
  },
  template: `
    <div class="container">
      <div class="row">
        <div class="col-sm-8 col-md-7 py-4">
          <h4 class="text-white" v-if="informationList.length >= 1">{{ informationList[0].title }}</h4>
          <p class="text-muted word-break-text break-line-text" v-if="informationList.length >= 1">{{ informationList[0].description }}</p>
        </div>
        <div class="col-sm-4 offset-md-1 py-4">
          <h4 class="text-white">Other Information</h4>
          <ul class="list-unstyled">
            <li v-if="informationList.length > 1" v-for="(information, index) in informationList.slice(1)"><a href="#" @click="rearrangeInformationList(index + 1)" class="text-white">{{ truncate(information.title, 100) }}</a></li>
          </ul>
        </div>
      </div>
    </div>
    `,
  methods: {
    truncate(string, length) {
      if (string !== null && string !== undefined && string.length > length) {
        return `${string.substr(0, length - 1)}...`;
      } else {
        return string;
      }
    },
    rearrangeInformationList(index) {
      let otherInformations = this.informationList.slice(1);
      let first = this.informationList[index];
      otherInformations[index - 1] = this.informationList[0];

      otherInformations = _.orderBy(
        otherInformations,
        ['sort', 'id'],
        ['asc', 'asc']
      );

      this.informationList = [first];
      this.informationList = this.informationList.concat(otherInformations);
    }
  }
});

const EventBus = new Vue();

Vue.component('clear-button', {
  template: `
    <button type="button" class="btn btn-success" v-on:click="handleButton">Clear</button>
    `,
  methods: {
    handleButton: function(e) {
      $('input[name="productName"]').val('');
      $('input[name="priceFrom"]').val('');
      $('input[name="priceTo"]').val('');
      $('input[name="createdDateFrom"]').val('');
      $('input[name="createdDateTo"]').val('');
      $('input[name="featuredFlg"]').each(function(el) {
        $(this).prop('checked', true);
      });
      app.featuredFlg = [0, 1];
      app.productName = '';
      app.priceFrom = '';
      app.priceTo = '';
      app.createdDateFrom = '';
      app.createdDateTo = '';

      EventBus.$emit('statuschanged', [0, 1]);
    }
  }
});

Vue.component('product-input', {
  props: ['value', 'labelname', 'name', 'inputclass', 'placeholder'],
  data() {
    return {
      errormsg: '',
      label: this.labelname,
      fieldName: this.name
    };
  },
  template: `
      <div class="col-12 row" style="margin-top: 10px;">
        <div class="col-4">
            <label v-html="labelname" 
            style="margin-top:7px" class="purple-text">
            </label>
        </div>
        <div class="col-8">
          <input type="text"
          class="form-control no-outline input-color"
          :value="value" 
          @input="handleInput"
          :class="inputclass"
          :name="name"
          @blur="handleInput"
          :placeholder="placeholder">
        </div>
      </div>`,
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    }
  }
});

Vue.component('product-checkbox', {
  props: ['labelname', 'options', 'inputclass', 'name', 'value'],
  data() {
    return {
      label: this.labelname,
      CbxData: Object.keys(this.options),
      cbxStatus: [0, 1]
    };
  },
  template: `
    <div class="col-12 row">
        <div class="col-4">
            <div class="col-form-label purple-text" v-html="label"></div>
        </div>
        <div class="col-6">
        <div class="form-group row" style="margin-left: -5px">
            <div class="custom-checkbox" v-for="(status, value) in CbxData" v-if="!isNaN(status)">
                <input type="checkbox" :name="name" v-bind:value="value" v-model="cbxStatus" :checked="true" @change="statusChange()" />
                <span class="custom-checkbox__label">{{options[status]}}</span>
            </div>
        </div>
        </div>
    </div>
    `,
  methods: {
    statusChange(data) {
      data
        ? (this.cbxStatus = data)
        : this.$emit('statuschanged', this.cbxStatus);
    }
  },
  created() {
    EventBus.$on('statuschanged', this.statusChange);
  },
  destroyed() {
    EventBus.$off('statuschanged', this.statusChange);
  }
});

Vue.component('input-from-to', {
  props: [
    'valuefrom',
    'valueto',
    'labelname',
    'name',
    'inputclass',
    'placeholder'
  ],
  data() {
    return {
      label: this.labelname,
      fieldName: this.name,
      valFrom: this.valuefrom ? this.valuefrom : '',
      valTo: this.valueto ? this.valueto : '',
      rules: {
        valFrom: 'isNumber',
        valTo: 'isNumber|isBigger:' + this.name + 'From'
      }
    };
  },
  template: `
      <div class="col-12 d-flex" style="margin-top: 10px;" >
        <div class="col-4">
            <label v-html="labelname" style="margin-top:7px" class="purple-text"></label>
        </div>
        <div class="col-3">
          <input type="text"
          class="form-control no-outline input-color"
          v-validate="'isNumber'"
          ref='priceFrom'
          @input="inputFrom"
          @blur="inputFrom"
          :class="inputclass"
          :name="name + 'From'"
          :placeholder="placeholder">
          <span>{{ errors.first('priceFrom') }}</span>
        </div>
        <span class="among">~</span>
        <div class="col-3">
          <input type="text"
          class="form-control no-outline input-color"
          v-validate="'isNumber|isBigger:priceFrom'"
          @input="inputTo"
          @blur="inputTo"
          :class="inputclass"
          :name="name + 'To'"
          :placeholder="placeholder">
          <span>{{ errors.first('priceTo') }}</span>
        </div>
      </div>`,
  methods: {
    inputFrom: function(e) {
      this.$emit('input-from', e.target.value);
    },
    inputTo: function(e) {
      this.$emit('input-to', e.target.value);
    }
  },
  mounted() {
    this.$validator.validateAll();
  }
});

Vue.component('date-from-to', {
  props: [
    'valuefrom',
    'valueto',
    'labelname',
    'name',
    'inputclass',
    'placeholder'
  ],
  data() {
    return {
      label: this.labelname,
      fieldName: this.name,
      valFrom: this.valuefrom ? this.valuefrom : '',
      valTo: this.valueto ? this.valueto : '',
      rules: {
        valTo: 'isGreaterDate:' + this.name + 'From'
      }
    };
  },
  template: `
      <div class="col-12 d-flex" style="margin-top: 10px;" >
        <div class="col-4">
            <label v-html="labelname" style="margin-top:7px" class="purple-text"></label>
        </div>
        <div class="col-3">
          <input type="date"
          class="form-control no-outline input-color"
          ref='createdDateFrom'
          @input="inputFrom"
          @blur="inputFrom"
          :class="inputclass"
          :name="name + 'From'"
          :placeholder="placeholder">
        </div>
        <span class="among">~</span>
        <div class="col-3">
          <input type="date"
          class="form-control no-outline input-color"
          v-validate="'isGreaterDate:createdDateFrom'"
          @input="inputTo"
          @blur="inputTo"
          :class="inputclass"
          :name="name + 'To'"
          :placeholder="placeholder">
          <span>{{ errors.first('createdDateTo') }}</span>
        </div>
      </div>`,
  methods: {
    inputFrom: function(e) {
      this.$emit('input-from', e.target.value);
    },
    inputTo: function(e) {
      this.$emit('input-to', e.target.value);
    }
  },
  mounted() {
    this.$validator.validateAll();
  }
});

Vue.component('product-paginate', {
  props: ['totalPages', 'currentPage'],
  template: `
      <ul class="pagination">
          <li class="pagination-item">
            <button type="button" class="btn" :class="isInFirstPage ? 'btn-paginate' : ''" v-on:click="onClickFirstPage" :disabled="isInFirstPage">
                ≪
            </button>
          </li>
          <li class="pagination-item">
            <button type="button" class="btn" :class="isInFirstPage ? 'btn-paginate' : ''" v-on:click="onClickPreviousPage" :disabled="isInFirstPage">
                <
            </button>
          </li>
          <li v-for="page in pages" class="pagination-item"
            v-if="Math.abs(page.name - currentPage) < 3 || page.name == totalPages || page.name == 1">
            <span v-if="page.name == totalPages && Math.abs(page.name - currentPage) > 3" class="three_dot">...</span>
            <button type="button" class="btn" v-on:click="onClickPage(page.name)" :disabled="page.isDisabled" 
              :class="{ active: isPageActive(page.name)}">
                {{ page.name }}
            </button>
            <span v-if="page.name == 1 && Math.abs(page.name - currentPage) > 3" class="three_dot">...</span>
          </li>
          <li class="pagination-item">
            <button type="button" class="btn btn-next" :class="isInLastPage ? 'btn-paginate' : ''" v-on:click="onClickNextPage" :disabled="isInLastPage">
                >
            </button>
          </li>
          <li class="pagination-item">
            <button type="button" class="btn btn-last" :class="isInLastPage ? 'btn-paginate' : ''" v-on:click="onClickLastPage" :disabled="isInLastPage">
                ≫
            </button>
          </li>
      </ul>
  `,
  computed: {
    pages() {
      const range = [];
      for (let i = 1; i <= this.totalPages; i++) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        });
      }
      return range;
    },
    isInFirstPage() {
      return (this.currentPage ? this.currentPage : 1) === 1;
    },
    isInLastPage() {
      return (this.currentPage ? this.currentPage : 1) === this.totalPages;
    }
  },
  methods: {
    onClickFirstPage() {
      this.$emit('pagechanged', 1);
    },
    onClickPreviousPage() {
      this.$emit('pagechanged', this.currentPage - 1);
    },
    onClickPage(page) {
      this.$emit('pagechanged', page);
    },
    onClickNextPage() {
      this.$emit('pagechanged', this.currentPage + 1);
    },
    onClickLastPage() {
      this.$emit('pagechanged', this.totalPages);
    },
    isPageActive(page) {
      return (this.currentPage ? this.currentPage : 1) === page;
    }
  }
});

Vue.component('product-table', {
  props: ['data', 'count', 'currentPage'],
  data() {
    return {
      message: []
    };
  },
  template: `
    <div>
      <div class="row" style="margin-bottom: 10px;margin-top: 10px;">
          <div class="text-end">
              <button type="button" class="btn btn-success" id="search-button" @click="searchButton()">Search</button>
              <clear-button></clear-button>
              <button type="button" class="btn btn-success" id="import-button" @click="importButton()">Import CSV</button>
              <input type="file" id="upload" style="display:none" @change="uploadFile()">
          </div>
      </div>

      <div class="messages" v-if="this.message.length > 0">
        <div class="alert alert-danger" role="alert" v-for="item in this.message" :key="item.id" >{{ item }}</div>
      </div>

      <div class="pagination" v-if="this.count != 0">
        <span class="total-result"> {{ showMessage(this.currentPage) }} </span>
        <div class="pagination-content">
            <product-paginate
            :total-pages="Math.ceil(this.count / 10)"
            :current-page="this.currentPage"
            @pagechanged="onPageChange"
            >
            </product-paginate>
        </div>
      </div>

      <div class="table-container">
      <table class="table table-row-color magrin-bot-0">
              <thead class="text-vertical">
                  <tr>
                      <th>
                          <div class="w-200">
                          </div>
                      </th>
                      <th>
                          <div class="w-100">
                              <span>Product name</span>
                          </div>
                      </th>
                      <th>
                          <div class="w-100">
                              <span>Price</span>
                          </div>
                      </th>
                      <th>
                          <div class="w-100">
                              <span>Image</span>
                          </div>
                      </th>
                      <th>
                          <div class="w-100">
                              <span>Feature Flag</span>
                          </div>
                      </th>
                      <th>
                          <div class="w-100">
                              <span>Total Quantity Order</span>
                          </div>
                      </th>
                      <th>
                          <div class="w-100">
                              <span>Oder Count</span>
                          </div>
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="item in data" :key="item.id">
                      <td class="truncate">
                        <button type="button" class="btn btn-primary" id="edit-button">Edit</button>
                        <button type="button" class="btn btn-danger" id="delete-button" v-on:click="deleteButton(item.id)">Delete</button>
                      </td>
                      <td class="truncate">
                          {{ item.name }}
                      </td>
                      <td class="truncate">
                          {{ item.price }}
                      </td>
                      <td>
                          <img src="item.imagePath"></img>
                      </td>
                      <td class="truncate">
                          {{ item.featuredFlg==0? 'No' : 'Yes' }}
                      </td>
                      <td class="truncate">
                          {{ item.totalQuantityOrder }}
                      </td>
                      <td class="truncate">
                          {{ item.orderCount }}
                      </td>
                    </tr>
                  <tr class="text-center" v-if="this.count == 0">
                      <td colspan="21">No results found.</td>
                  </tr>
              </tbody>
          </table>
      </div>
    </div>
    `,
  methods: {
    searchButton() {
      this.$emit('search', 1);
      this.message = [];
    },
    numberFormat(x) {
      return numberFormat(x);
    },
    showMessage() {
      const offset = (this.currentPage - 1) * 10;

      return `Show ${offset + 1} to ${offset + this.data.length} of ${
        this.count
      } entries `;
    },
    onPageChange(page) {
      this.$emit('search', page);
    },
    async deleteButton(id) {
      await $.ajax({
        type: 'POST',
        url: '/search/delete',
        data: { id: id },
        success: function() {},
        error: function(e) {
          console.log(e);
        }
      });
      this.onPageChange(this.currentPage);
    },
    importButton() {
      $('#upload').click();
    },
    async uploadFile() {
      const formData = new FormData();
      formData.append('file', $('#upload')[0].files[0]);

      const response = await $.ajax({
        method: 'POST',
        dataType: 'json',
        url: '/search/import',
        data: formData,
        cache: false,
        contentType: false,
        processData: false
      });

      response.message ? (this.message = response.message) : [];

      this.onPageChange(this.currentPage);
    }
  }
});

let init = true;

app = new Vue({
  el: '.vue-app',
  data() {
    return {
      productName: '',
      featuredFlg: [0, 1],
      priceFrom: '',
      priceTo: '',
      createdDateFrom: '',
      createdDateTo: '',
      products: [],
      countProducts: '',
      currentPage: ''
    };
  },
  async created() {
    this.currentPage = 1;
    init ? await this.searchForm(1) : (init = false);
  },
  methods: {
    onStatusChange(data) {
      this.featuredFlg = data;
    },
    async searchForm(page) {
      this.currentPage = page;

      const data = {
        productName: this.productName,
        featuredFlg: this.featuredFlg,
        priceFrom: this.priceFrom,
        priceTo: this.priceTo,
        createdDateFrom: this.createdDateFrom,
        createdDateTo: this.createdDateTo
      };

      try {
        const response = await $.ajax({
          type: 'get',
          dataType: 'json',
          url: '/search',
          data: { data, page: page }
        });

        this.products = response.rows;
        this.countProducts = response.count;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    updateCurrentPage(page) {
      this.currentPage = page;
    }
  }
});
