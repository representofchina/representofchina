import AppHeader from './components/AppHeader.js'
import AppFooter from './components/AppFooter.js'

export default {
  components: { AppHeader, AppFooter },
  template: `
    <app-header></app-header>
    <main><router-view></router-view></main>
    <app-footer></app-footer>
  `,
}
