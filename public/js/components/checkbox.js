Vue.component('exam-checkbox', {
  props: ['labelname', 'options', 'inputclass', 'name', 'value'],
  data() {
    return {
        label: this.labelname,
        CbxData: Object.keys(this.options),
        listValue: !Array.isArray(this.value) ? this.value : this.value.join(""),
        cbxStatus: [0]
    }
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
    statusChange() {
      this.$emit('statuschanged', this.cbxStatus);
    }
  }
});
Vue.component('exam-checked', {
    props: ['type', 'name', 'value', 'text', 'id', 'checkedflag', 'iconflag', 'colorclass', 'disabled'],
    data() {
      return {
        iconFlag: this.iconflag ?
          (this.iconflag === 'true' ? 
            `<svg style="margin-top: 6px;" width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-check2 green-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>` :
            `<svg style="margin-top: 6px;" width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-x red-text" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>`) : '',
      }
    },
    template: `
      <div class="col-12 row" :class="colorclass">
        <label class="col-10" style="margin-top: 10px;">
          <div>
            <input class="mgr-5" :type="type" :name="name" :value="value" :id="id" :checked="checkedflag == 'checked'" :disabled="disabled">
            <pre v-html="text"></pre>
          </div>
        </label>
        <label class="col-2" v-html="iconFlag"></label>
      </div>`,
      methods: {
      }
});

Vue.component('input-checkbox', {
  props: ['labelname', 'options', 'inputclass', 'name', 'value'],
  data() {
    return {
      label: this.labelname,
      CbxData: Object.keys(this.options),
      cbxStatus: this.value !== undefined ? this.value : []
    }
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
    statusChange() {
      this.$emit('statuschanged', this.cbxStatus);
    }
  },
});

