import DragDrop from './components/DragDrop.vue'
import People from './components/People.vue'

import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
  routes: [
    {path:'/', component: DragDrop},
    {path:'/people', component: People},
  ],
  history: createWebHistory(),
  
})

export default router