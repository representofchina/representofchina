import { ref, onMounted } from 'vue'
import { stats } from '../api.js'

const NAV = [
  { to: '/', key: 'home', label: '首页' },
  { to: '/directory', key: 'directory', label: '代表名录' },
  { to: '/profiles', key: 'profiles', label: '代表风采' },
  { to: '/duties', key: 'duties', label: '履职动态' },
  { to: '/service', key: 'service', label: '为民服务' },
  { to: '/about', key: 'about', label: '关于我们' },
]

export default {
  setup() {
    const total = ref(null)
    onMounted(async () => {
      try { total.value = (await stats()).total } catch (e) {}
    })
    return { NAV, total }
  },
  template: `
  <div class="topbar"><div class="container">
    <span>全国人民代表为人民服务网</span>
    <span><a href="#">网站无障碍</a><a href="#">繁体中文</a><a href="#">适老版</a></span>
  </div></div>
  <header class="masthead"><div class="container">
    <img class="emblem" src="assets/national-emblem.svg" alt="中华人民共和国国徽">
    <div class="titles">
      <h1>全国人民代表为人民服务网</h1>
      <div class="en">REPRESENTATIVES OF THE PEOPLE · SERVING THE PEOPLE</div>
    </div>
    <div class="spacer"></div>
    <div class="quick" v-if="total">收录代表 <b>{{ total }}</b> 名</div>
  </div></header>
  <nav class="nav"><div class="container">
    <router-link v-for="n in NAV" :key="n.to" :to="n.to"
      :class="{active: $route.meta.nav === n.key}">{{ n.label }}</router-link>
  </div></nav>
  `,
}
