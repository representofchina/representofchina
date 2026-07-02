import { ref, computed, onMounted } from 'vue'
import { search } from '../api.js'
import RepCard from '../components/RepCard.js'

export default {
  components: { RepCard },
  setup() {
    const page = ref(1)
    const data = ref({ total: 0, items: [], page: 1, page_size: 24 })
    const pages = computed(() =>
      Math.max(1, Math.ceil(data.value.total / data.value.page_size)))
    async function run() { data.value = await search({ has_avatar: true, page: page.value }) }
    function go(p) { page.value = p; run() }
    onMounted(run)
    return { page, pages, data, go }
  },
  template: `
  <div class="container">
    <div class="crumbs"><router-link to="/">首页</router-link> &gt; 代表风采</div>
    <div class="section-title"><h2>代表风采</h2></div>
    <div class="result-info">共 <b>{{ data.total }}</b> 名代表有公开照片</div>
    <div class="grid">
      <rep-card v-for="r in data.items" :key="r.id" :rep="r"></rep-card>
    </div>
    <div class="pager" v-if="pages > 1">
      <button :disabled="page<=1" @click="go(page-1)">上一页</button>
      <span>{{ page }} / {{ pages }}</span>
      <button :disabled="page>=pages" @click="go(page+1)">下一页</button>
    </div>
  </div>
  `,
}
