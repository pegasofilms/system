import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Posts from '@/pages/Posts.vue';
import Dogs from '@/pages/Dogs.vue';
import Jokes from '@/pages/Jokes.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts
      },
      {
    path: '/dogs',
    name: 'Dogs',
    component: Dogs
      },
      {
    path: '/jokes',
    name: 'Jokes',
    component: Jokes
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
