Vue.use(window.vuelidate.default)

jQuery.fn.extend({
  showLoading: function() {
    this.LoadingOverlay('show', {
      maxSize: 70,
    });
  },
  hideLoading: function() {
    this.LoadingOverlay('hide');
  },
});

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

Vue.component('recommendation-list', {
  props: ['recommendations'],
  data() {
    return {
    };
  },
  template: `
    <section class="py-5 text-center container" v-if="recommendations && recommendations.length">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-1">

          <div class="col" v-if="recommendations" v-for="recommendation of recommendations">
            <div class="card shadow-sm">
              <svg v-if="!recommendation.imagePath" class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns=""
                role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef"
                  dy=".3em"></text>
              </svg>
              <a class="title-link" :href="recommendation.redirectUrl">
                <img style="width: 100%; height: 225px;" v-if="recommendation.imagePath" :src="recommendation.imagePath"/>
              </a>
              <div class="card-body">
                <a class="title-link" :href="recommendation.redirectUrl">
                  <h5 class="card-title">{{ truncate(recommendation.title, 100) }}</h5>
                </a>
                <p class="card-text break-line-text">{{ truncate(recommendation.note, 100) }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">{{ formatDate(recommendation.postPeriodFrom) }}</small>
                </div>
              </div>
            </div>
          </div>

      </div>
    </section>
    `,
  methods: {
    formatDate(date) {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const dateObject = new Date(date);

      if (date) {
        date = monthNames[dateObject.getMonth()] + ' ' + ('0' + dateObject.getDate()).slice(-2) + '/' + dateObject.getFullYear();
      }
      return date;
    },
    truncate(string, length) {
      if (string !== null && string !== undefined && string.length > length) {
        return `${string.substr(0, length - 1)}...`;
      } else {
        return string;
      }
    }
  },
});

Vue.component('pickup-list', {
  props: ['pickups', 'messagelist'],
  data() {
    return {
    };
  },
  template: `
    <div>
      <div class="album py-2 bg-light">
      <div class="container">
        <p v-if="pickups.length === 0">{{ messagelist.noRecord }}</p>
        <div class="container px-1 py-1" id="icon-grid" v-if="pickups" v-for="pickup of pickups">
        <a :href="'/pickup/' + pickup.id" class="title-link">
          <h3 class="pb-2 border-bottom word-break-word">
            {{ truncate(pickup.title, 100) }}
          </h3>
        </a>

          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 py-3">
          <p v-if="!pickup.pickupDetail.length">
            {{ messagelist.noRecord }}
          </p >

          <template v-if="pickup.pickupDetail.length" v-for="pickupDetail of pickup.pickupDetail">
            <div class="col d-flex align-items-start">
              <svg class="bi text-muted flex-shrink-0 me-3" width="1.75em" height="1.75em">
                <use xlink:href="#bootstrap"></use>
              </svg>
              <div>
              <a class="title-link" :href="pickupDetail.exam ? '/startTest/' + pickupDetail.exam.accessKey : '#'">
                <h2 class="word-break-word fw-bold mb-0 fs-4">
                  {{ truncate(pickupDetail.title || (pickupDetail.exam ? pickupDetail.exam.title : '' ), 100) }}          
                </h2>
              </a>
              <p class="word-break-word break-line-text">
                {{ truncate(pickupDetail.note || (pickupDetail.exam ? pickupDetail.exam.description : '' ), 100) }}
              </p>
              </div>
            </div>
          </template>
          </div>
        </div>
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
    }
  },
});

app = new Vue({
  el: '.vue-app',
  data: {
    pickups: [],
    recommendations: [],
    messagelist: JSON.parse($('[name="messageList"]').val()),
  },
  mounted() {
    $('#pickupList').showLoading();
    $.ajax({
      type: "get",
      dataType: 'json',
      url: '/getPickup',
      success: function (res) {
        app.pickups = res.data;
        $('#pickupList').hideLoading();
      },
      error: function(e) {
        console.log(e);
        $('#pickupList').hideLoading();
      },
    });

    $('#recommendationList').showLoading();
    $.ajax({
      type: "get",
      dataType: 'json',
      url: '/getRecommendation?limit=8',
      success: function (res) {
        app.recommendations = res.data;
        $('#recommendationList').hideLoading();
      },
      error: function(e) {
        console.log(e);
        $('#recommendationList').hideLoading();
      },
    });
  },
  methods: {},
});