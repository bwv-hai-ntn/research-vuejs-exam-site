Vue.component('exam-paginate', {
    props: ['totalPages', 'currentPage'],
    data () {
        return {
            maxVisibleButtons: 2
        };
    },
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
          for (let i = 1; i <= this.totalPages; i++ ) {
            range.push({
              name: i,
              isDisabled: i === this.currentPage 
            });
          }
          return range;
        },
        isInFirstPage() {
          return this.currentPage === 1;
        },
        isInLastPage() {
          return this.currentPage === this.totalPages;
        },
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
          return this.currentPage === page;
        },
    }
});