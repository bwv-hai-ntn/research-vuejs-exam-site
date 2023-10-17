Vue.use(window.vuelidate.default)

Vue.component('information-list', {
  data() {
    return {
      informationList: [],
    };
  },
  mounted() {
    $this = this;
    $.ajax({
      type: "get",
      dataType: 'json',
      url: '/getInformation?limit=6',
      success: function (res) {
        $this.informationList = res.data;

        if (res.headerOpen) {
          $('button[data-bs-target="#navbarHeader"]').trigger('click');
        }
        hideLoading();
      },
      error: function(e) {
        console.log(e);
        hideLoading();
      },
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

      otherInformations = _.orderBy(otherInformations, ['sort', 'id'], ['asc', 'asc']);

      this.informationList = [first];
      this.informationList = this.informationList.concat(otherInformations);
    }
  },
});

app = new Vue({
  el: '.vue-app',
  data: {
    pickups: [],
    recommendations: [],
  },
  mounted() {
  },
  methods: {},
});