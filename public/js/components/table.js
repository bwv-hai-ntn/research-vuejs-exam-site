Vue.component('exam-table', {
  props: ['name', 'inputclass', 'title', 'value'],
  data() {
    return {
      OpTitle:  Object.keys(this.title),
      OptData: this.value
    };
  },
  template: `
        <table class="table table-striped magrin-bot-0">
            <thead>
                <tr style="color: #673ab7;">
                    <th v-for="(name, value) in OpTitle">
                      <span>{{ title[name] }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="item in OptData" :key="item.id">
                <td v-for="(name, index) in title">{{item[index]}}</td>
              </tr>
            </tbody>
        </table>
    `
});
