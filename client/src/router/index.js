import {createRouter, createWebHistory} from "vue-router";
import Registration from "../views/Registration.vue";
import Login from "../views/Login.vue";
import Setup from "../views/Setup.vue";
import Authentication from "../views/Authentication.vue";
import Home from "../views/Home.vue";

const routes = [
	{
		path: "/registration",
		name: "Registration",
		component: Registration
	},
	{
		path: "/login",
		name: "Login",
		component: Login
	},
	{
		path: "/setup",
		name: "Setup",
		component: Setup
	},
	{
		path: "/authentication",
		name: "Authentication",
		component: Authentication
	},
	{
		path: "/home",
		name: "Home",
		component: Home
	}
]

const router = createRouter({history: createWebHistory(process.env.BASE_URL), routes});

export default router;
