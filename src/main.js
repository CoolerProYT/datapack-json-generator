import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import Home from "./pages/Home.vue";
import ArrowData from "./pages/ArrowData.vue";

const app = createApp(App);
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/arrowplus/arrow_data', component: ArrowData },
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});

app.use(router);
app.mount('#app');
