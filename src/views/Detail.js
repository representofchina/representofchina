import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getRep, avatarUrl, sourceLabel } from '../api.js'

export default {
  setup() {
    const route = useRoute()
    const rep = ref(null)
    const notFound = ref(false)
    const avatar = computed(() => rep.value ? avatarUrl(rep.value) : null)

    const LABELS = [
      ['姓名', 'name'], ['性别', 'gender'], ['民族', 'ethnicity'], ['党派', 'party'],
      ['任届', 'term'], ['代表团/选举单位', 'delegation'], ['出生年月', 'birth'],
      ['职务', 'position'], ['简介', 'bio'], ['联系方式', 'contact'],
    ]
    const rows = computed(() =>
      rep.value ? LABELS.filter(([, k]) => rep.value[k]).map(([label, k]) => ({ label, val: rep.value[k] })) : [])

    async function load() {
      notFound.value = false; rep.value = null
      const r = await getRep(route.params.id)
      if (r) rep.value = r; else notFound.value = true
    }
    onMounted(load)
    watch(() => route.params.id, load)
    return { rep, notFound, avatar, rows, sourceLabel }
  },
  template: `
  <div class="container">
    <div class="crumbs">
      <router-link to="/">首页</router-link> &gt;
      <router-link to="/directory">代表名录</router-link> &gt; 代表详情
    </div>
    <div v-if="notFound" class="empty">未找到该代表</div>
    <div v-else-if="!rep" class="empty">加载中…</div>
    <div v-else class="detail">
      <div class="photo">
        <img v-if="avatar" :src="avatar" alt="代表照片">
        <div v-else class="ph">&#128100;</div>
      </div>
      <div class="fields">
        <h2>{{ rep.name }}</h2>
        <span class="tag src">{{ sourceLabel(rep.source) }}</span>
        <table><tbody>
          <tr v-for="row in rows" :key="row.label">
            <td class="k">{{ row.label }}</td><td>{{ row.val }}</td>
          </tr>
          <tr v-if="!rep.contact">
            <td class="k">联系方式</td><td style="color:#aaa">官网未公开</td>
          </tr>
          <tr v-if="rep.source_url && rep.source_url.startsWith('http')">
            <td class="k">信息来源</td>
            <td><a :href="rep.source_url" target="_blank" style="color:var(--red)">查看官网原始页面 &#8599;</a></td>
          </tr>
        </tbody></table>
      </div>
    </div>
  </div>
  `,
}
