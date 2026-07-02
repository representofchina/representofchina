import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { stats, search, sourceLabel } from '../api.js'
import RepCard from '../components/RepCard.js'
import VideoShowcase from '../components/VideoShowcase.js'

const NOTICES = [
  { t: '关于建设全国人民代表为人民服务网的说明', d: '2026-06-30' },
  { t: '人大代表依法履职，密切联系人民群众', d: '2026-06-28' },
  { t: '代表资料库数据来源与更新说明', d: '2026-06-25' },
  { t: '坚持和完善人民代表大会制度', d: '2026-06-20' },
  { t: '充分发挥人大代表在全过程人民民主中的作用', d: '2026-06-18' },
]

export default {
  components: { RepCard, VideoShowcase },
  setup() {
    const router = useRouter()
    const kw = ref('')
    const s = ref(null)
    const featured = ref([])

    function goSearch() {
      router.push({ path: '/directory', query: kw.value ? { q: kw.value } : {} })
    }
    onMounted(async () => {
      s.value = await stats()
      const r = await search({ has_avatar: true, page: 1 })
      featured.value = r.items.slice(0, 8)
    })
    return { kw, s, featured, goSearch, sourceLabel, NOTICES }
  },
  template: `
  <section class="hero"><div class="container">
    <h2>人民选我当代表 · 我当代表为人民</h2>
    <p>汇集各级人民代表大会代表公开信息，方便人民群众了解、联系自己的代表。</p>
    <div class="search-box">
      <input v-model="kw" @keydown.enter="goSearch" placeholder="输入代表姓名，查询代表信息…">
      <button @click="goSearch">搜 索</button>
    </div>
    <div class="stats" v-if="s">
      <div><div class="n">{{ s.total }}</div><div class="l">收录代表</div></div>
      <div><div class="n">{{ s.with_avatar }}</div><div class="l">含代表照片</div></div>
      <div v-for="b in s.by_source" :key="b.source">
        <div class="n">{{ b.count }}</div><div class="l">{{ sourceLabel(b.source) }}</div>
      </div>
    </div>
  </div></section>

  <video-showcase></video-showcase>

  <div class="container">
    <div class="cols">
      <div>
        <div class="section-title"><h2>代表风采</h2>
          <router-link class="more" to="/profiles">更多 &gt;&gt;</router-link></div>
        <div class="grid">
          <rep-card v-for="r in featured" :key="r.id" :rep="r"></rep-card>
        </div>
      </div>
      <div>
        <div class="section-title"><h2>通知公告</h2></div>
        <div class="notice"><ul>
          <li v-for="(n,i) in NOTICES" :key="i">
            <span><span class="dot">●</span>{{ n.t }}</span>
            <span class="date">{{ n.d }}</span>
          </li>
        </ul></div>
        <div class="section-title" style="margin-top:24px"><h2>快速入口</h2></div>
        <div class="notice"><ul>
          <li><router-link to="/directory"><span class="dot">●</span>代表名录查询</router-link></li>
          <li><router-link to="/profiles"><span class="dot">●</span>代表风采（含照片）</router-link></li>
          <li><router-link to="/service"><span class="dot">●</span>为民服务</router-link></li>
          <li><router-link to="/about"><span class="dot">●</span>关于本站</router-link></li>
        </ul></div>
      </div>
    </div>
  </div>
  `,
}
