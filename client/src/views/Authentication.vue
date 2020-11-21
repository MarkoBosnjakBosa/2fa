<template>
    <div id="authentication" class="container-fluid">
        <form autocomplete="off" @submit.prevent="loginUser()">
            <div class="authenticationIcon">
                <i class="far fa-hand-paper fa-7x"></i>
            </div>
            <div class="form-group">
                <input type="text" id="otpToken" class="form-control" :class="{'errorField' : otpTokenError}" placeholder="Otp token" v-model="otpToken" @focus="clearOtpTokenStatus()" @keypress="clearOtpTokenStatus()"/>
                <small v-if="otpTokenError" class="form-text errorInput">Please provide a valid otp token!</small>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	var axios = require("axios");
	
	export default {
		name: "authentication",
		data() {
			return {
				otpTokenError: false,
                otpToken: ""
			}
		},
		methods: {
			loginUser() {
                this.clearOtpTokenStatus();
                if(this.invalidOtpToken) {
                    this.otpTokenError = true;
                    return;
                }
                var options = {headers: {["x-otp"]: this.otpToken}};
                var username = this.$store.getters.isAuthenticated;
				var body = {username: username, otpToken: this.otpToken};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/login", body, options).then(response => {
					if(response.data.authentication && response.data.valid) {
                        const token = response.data.token;
                        const user = response.data.user;
                        this.$store.dispatch("login", {token, user});
                        this.$router.push("/home");
					} else {
                        this.otpTokenError = true;
                    }
				}).catch(error => console.log(error));
			},
			clearOtpTokenStatus() { this.otpTokenError = false; }
		},
		computed: {
			invalidOtpToken() { return this.otpToken === ""; }
		}
	}
</script>

<style scoped>
    #authentication {
        margin: 0 auto;
        max-width: 500px;
        text-align: center;
    }
    .authenticationIcon {
        margin-top: 20px;
		margin-bottom: 20px;
    }
    .errorField {
		border: 1px solid #ff0000;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
	}
	.errorInput {
		color: #ff0000;
	}
</style>
