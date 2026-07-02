import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search, stats } from '../api.js'
import RepCard from '../components/RepCard.js'

export default {
  components: { RepCard },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const f = reactive({ q: '', source: '', delegation: '', gender: '', has_avatar: false })
    const page = ref(1)
    const data = ref({ total: 0, items: [], page: 1, page_size: 24 })
    const sources = ref([])
    const loading = ref(false)

    const pages = computed(() =>
      Math.max(1, Math.ceil(data.value.total / data.value.page_size)))

    async function run() {
      loading.value = true
      data.value = await search({ ...f, page: page.value })
      loading.value = false
    }
    function applyFilters() { page.value = 1; sync(); run() }
    function go(p) { page.value = p; sync(); run() }
    function sync() {
      const q = {}
      for (const k of ['q', 'source', 'delegation', 'gender']) if (f[k]) q[k] = f[k]
      if (f.has_avatar) q.has_avatar = '1'
      if (page.value > 1) q.page = page.value
      router.replace({ query: q })
    }
    function fromRoute() {
      f.q = route.query.q || ''
      f.source = route.query.source || ''
      f.delegation = route.query.delegation || ''
      f.gender = route.query.gender || ''
      f.has_avatar = route.query.has_avatar === '1'
      page.value = parseInt(route.query.page || 1)
    }

    onMounted(async () => {
      sources.value = (await stats()).by_source
      fromRoute(); run()
    })
    watch(() => route.query, () => {})

    return { f, page, pages, data, sources, loading, applyFilters, go }
  },
  template: `
  <div class="container">
    <div class="crumbs">
      <router-link to="/">首页</router-link> &gt; 代表名录
    </div>
    <div class="filters">
      <input type="text" v-model="f.q" @keydown.enter="applyFilters" placeholder="按姓名搜索…">
      <select v-model="f.source">
        <option value="">全部来源</option>
        <option v-for="s in sources" :key="s.source" :value="s.source">{{ s.source }} ({{ s.count }})</option>
      </select>
      <input type="text" v-model="f.delegation" placeholder="代表团/选举单位" style="width:160px">
      <select v-model="f.gender">
        <option value="">性别</option><option value="男">男</option><option value="女">女</option>
      </select>
      <label><input type="checkbox" v-model="f.has_avatar"> 仅看有照片</label>
      <button class="btn" @click="applyFilters">搜索</button>
    </div>

    <div class="result-info">共匹配 <b>{{ data.total }}</b> 条，第 {{ data.page }} / {{ pages }} 页</div>
    <div v-if="loading" class="empty">加载中…</div>
    <div v-else-if="!data.items.length" class="empty">没有匹配的记录</div>
    <div v-else class="grid">
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
