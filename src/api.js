// 数据访问层：双模式
//  - API 模式：存在 Python 后端时，走 /api/* 与 /avatar/<id>
//  - 静态模式：纯静态部署（Cloudflare/GitHub Pages），读取 /data/reps.json 与 /avatars/<id>.jpg
import { ref } from 'vue'

const PAGE_SIZE = 24

export const mode = ref('detecting')   // 'api' | 'static'
let _all = null                        // 静态模式下的全量数据缓存
let _ready = null

async function detect() {
  try {
    const r = await fetch('/api/stats', { cache: 'no-store' })
    if (r.ok) { mode.value = 'api'; return }
  } catch (e) { /* fall through */ }
  mode.value = 'static'
  const r = await fetch('data/reps.json')
  _all = await r.json()
}

export function init() {
  if (!_ready) _ready = detect()
  return _ready
}

export function avatarUrl(rep) {
  if (!rep || !rep.has_avatar) return null
  return mode.value === 'api' ? `/avatar/${rep.id}` : `avatars/${rep.id}.jpg`
}

export function avatarUrlById(id) {
  return mode.value === 'api' ? `/avatar/${id}` : `avatars/${id}.jpg`
}

// 视频始终作为静态资源部署，直接读取相对路径
export function videoUrl(file) { return `video/${file}` }

let _videos = null
export async function getVideos() {
  if (_videos) return _videos
  try {
    const r = await fetch('data/videos.json', { cache: 'no-store' })
    _videos = r.ok ? await r.json() : []
  } catch (e) { _videos = [] }
  return _videos
}

function matches(r, f) {
  if (f.q && !(r.name || '').includes(f.q)) return false
  if (f.source && r.source !== f.source) return false
  if (f.delegation && !(r.delegation || '').includes(f.delegation)) return false
  if (f.gender && r.gender !== f.gender) return false
  if (f.has_avatar && !r.has_avatar) return false
  return true
}

export async function search(f = {}) {
  await init()
  const page = Math.max(1, parseInt(f.page || 1))
  if (mode.value === 'api') {
    const p = new URLSearchParams()
    if (f.q) p.set('q', f.q)
    if (f.source) p.set('source', f.source)
    if (f.delegation) p.set('delegation', f.delegation)
    if (f.gender) p.set('gender', f.gender)
    if (f.has_avatar) p.set('has_avatar', '1')
    p.set('page', page)
    const r = await fetch('/api/search?' + p.toString())
    return await r.json()
  }
  const hits = _all.filter(r => matches(r, f))
  const start = (page - 1) * PAGE_SIZE
  return {
    total: hits.length, page, page_size: PAGE_SIZE,
    items: hits.slice(start, start + PAGE_SIZE),
  }
}

export async function stats() {
  await init()
  if (mode.value === 'api') {
    const r = await fetch('/api/stats')
    return await r.json()
  }
  const by = {}
  let withAvatar = 0
  for (const r of _all) {
    by[r.source] = (by[r.source] || 0) + 1
    if (r.has_avatar) withAvatar++
  }
  const by_source = Object.entries(by).map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
  return { total: _all.length, with_avatar: withAvatar, by_source }
}

export async function getRep(id) {
  await init()
  id = parseInt(id)
  if (mode.value === 'api') {
    const r = await fetch('/api/rep/' + id)
    if (!r.ok) return null
    return await r.json()
  }
  return _all.find(r => r.id === id) || null
}

export const SOURCE_LABELS = { bjrd: '北京市人大', npc: '全国人大' }
export function sourceLabel(s) { return SOURCE_LABELS[s] || s }
