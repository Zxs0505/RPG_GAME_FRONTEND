import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Hero from "../views/Hero.vue";
import Battle from "../views/Battle.vue";
import Backpack from "../views/Backpack.vue";
import Equipment from "../views/Equipment.vue";
import History from "../views/History.vue";

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/home",
        component: Home
    },
    {
        path: "/hero",
        component: Hero
    },
    {
        path: "/battle",
        component: Battle
    },

    {
        path: "/skill",
        component: () => import("../views/Skill.vue")
    },
    
    {
        path: "/backpack",
        component: Backpack
    },
    {
        path: "/equipment",
        component: Equipment
    },

    {
        path: "/shop",
        component: () => import("../views/Shop.vue")
    },

    {
        path: "/register",
        component: () => import("../views/Register.vue")
    },


    {
        path: "/profile",
        component: () => import("../views/Profile.vue")
    },

    {
        path: "/history",
        component: History
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;