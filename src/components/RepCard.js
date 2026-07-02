import { computed } from 'vue'
import { avatarUrl, sourceLabel } from '../api.js'

export default {
  props: { rep: { type: Object, required: true } },
  setup(props) {
    const avatar = computed(() => avatarUrl(props.rep))
    const meta = computed(() => [
      props.rep.ethnicity, props.rep.party, props.rep.term, props.rep.birth, props.rep.position,
    ].filter(Boolean).join(' · '))
    return { avatar, meta, sourceLabel }
  },
  template: `
  <router-link :to="'/rep/' + rep.id" class="rep-card">
    <img v-if="avatar" class="avatar" loading="lazy" :src="avatar" alt="代表照片">
    <div v-else class="ph">&#128100;</div>
    <div class="info">
      <div class="nm">{{ rep.name }}</div>
      <span class="tag src">{{ sourceLabel(rep.source) }}</span>
      <span v-if="rep.gender" class="tag">{{ rep.gender }}</span>
      <span v-if="rep.delegation" class="tag">{{ rep.delegation }}</span>
      <div class="meta">{{ meta }}</div>
    </div>
  </router-link>
  `,
}
