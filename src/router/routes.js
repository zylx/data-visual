const Home = () => import(/* webpackChunckName: "home" */ '@/views/Home.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

export default routes