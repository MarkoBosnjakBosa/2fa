import {createRouter, createWebHistory} from "vue-router";
import Registration from "../views/Registration.vue";
import Login from "../views/Login.vue";
import ForgotCredentials from "../views/ForgotCredentials.vue";
import ResetPassword from "../views/ResetPassword.vue";
import Setup from "../views/Setup.vue";
import Authentication from "../views/Authentication.vue";
import Profile from "../views/Profile.vue";
import Home from "../views/Home.vue";
import PageNotFound from "../views/PageNotFound.vue";

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
		path: "/forgot/credentials",
		name: "ForgotCredentials",
		component: ForgotCredentials
	},
	{
		path: "/reset/password",
		name: "ResetPassword",
		component: ResetPassword
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
		path: "/profile",
		name: "Profile",
		component: Profile
	},
	{
		path: "/home",
		name: "Home",
		component: Home
	},
	{
		path: "/:catchAll(.*)",
		name: "PageNotFound",
		component: PageNotFound
	}
]

const router = createRouter({history: createWebHistory(process.env.BASE_URL), routes});

export default router;
