import { ref, onMounted } from 'vue'
import { getVideos, videoUrl, avatarUrlById } from '../api.js'

export default {
  setup() {
    const list = ref([])
    const track = ref(null)

    function scrollByCards(dir) {
      const el = track.value
      if (!el) return
      const card = el.querySelector('.vcard')
      const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
      el.scrollBy({ left: dir * step, behavior: 'smooth' })
    }

    // 同一时刻只播放一个视频
    function onPlay(e) {
      const cur = e.target
      track.value?.querySelectorAll('video').forEach(v => { if (v !== cur) v.pause() })
    }

    onMounted(async () => {
      list.value = await getVideos()
    })

    return { list, track, scrollByCards, onPlay, videoUrl, avatarUrlById }
  },
  template: `
  <section class="vshow" v-if="list.length">
    <div class="container">
      <div class="vshow-head">
        <div class="vshow-badge">代表发声 · 立法呼吁</div>
        <h2>为动物保护立法发声</h2>
        <p>人民代表倾听民声、回应关切——听听代表们对动物保护立法的郑重呼吁。</p>
      </div>
      <div class="vshow-carousel">
        <button class="vnav prev" @click="scrollByCards(-1)" aria-label="上一个">&#10094;</button>
        <div class="vshow-track" ref="track">
          <div class="vcard" v-for="v in list" :key="v.id">
            <div class="vwrap">
              <video :src="videoUrl(v.file)" :poster="avatarUrlById(v.id)"
                controls preload="none" playsinline @play="onPlay"></video>
            </div>
            <div class="vmeta">
              <router-link class="vname" :to="'/rep/' + v.id">{{ v.name }}</router-link>
              <span class="vtag" v-if="v.delegation">{{ v.delegation }}代表</span>
            </div>
            <p class="vquote">{{ v.quote }}</p>
          </div>
        </div>
        <button class="vnav next" @click="scrollByCards(1)" aria-label="下一个">&#10095;</button>
      </div>
    </div>
  </section>
  `,
}
