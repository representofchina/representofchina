import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.js'
import Directory from './views/Directory.js'
import Profiles from './views/Profiles.js'
import Detail from './views/Detail.js'
import Article from './views/Article.js'

const routes = [
  { path: '/', component: Home, meta: { nav: 'home' } },
  { path: '/directory', component: Directory, meta: { nav: 'directory' } },
  { path: '/profiles', component: Profiles, meta: { nav: 'profiles' } },
  { path: '/rep/:id', component: Detail },
  { path: '/duties', component: Article, props: { topic: 'duties' }, meta: { nav: 'duties' } },
  { path: '/service', component: Article, props: { topic: 'service' }, meta: { nav: 'service' } },
  { path: '/about', component: Article, props: { topic: 'about' }, meta: { nav: 'about' } },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})
