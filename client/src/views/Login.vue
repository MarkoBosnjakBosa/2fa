<template>
	<div id="login" class="container-fluid">
		<form autocomplete="off" @submit.prevent="loginUser()">
			<div class="loginIcon">
				<i class="fas fa-lock fa-7x"></i>
			</div>
			<div class="form-group">
				<input type="text" id="username" class="form-control" :class="{'errorField' : usernameError}" placeholder="Username" v-model="user.username" @keyup="checkUsername()" @change="checkUsername()" @input="checkUsername()"/>
				<small v-if="usernameError" class="form-text errorInput">Please provide a valid username!</small>
			</div>
			<div class="form-group">
				<div class="input-group">
					<input type="password" id="password" class="form-control" :class="{'errorField' : passwordError && submitting}" placeholder="Password" v-model="user.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
					<div class="input-group-append">
						<button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError && submitting}" @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
					</div>
				</div>
				<small v-if="passwordError && submitting" class="form-text errorInput">Please provide a valid password!</small>
			</div>
			<div v-if="noPasswordMatch" class="form-group loginFailed">Password does not match!</div>
			<div class="form-group forgotCredentialsDiv">
				<a href="#" @click="forgotCredentials()">Forgot credentials?</a>
			</div>
			<div class="form-group submitDiv">
				<button type="submit" class="btn btn-primary submitButton">Log in</button>
			</div>
			<div class="form-group registerDiv">Not a member? <a href="#" @click="register()">Register</a></div>
		</form>
	</div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	var axios = require("axios");
	
	export default {
		name: "login",
		data() {
			return {
				submitting: false,
				usernameError: false,
				passwordError: false,
				user: {
					username: "",
					password: ""
				},
				noPasswordMatch: false
			}
		},
		methods: {
			checkUsername() {
				var body = {username: this.user.username};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkUsername", body).then(response => {
					if(response.data.exists) {
						this.usernameError = false;
					} else {
						if(response.data.empty) {
							this.usernameError = false;
						} else {
							this.usernameError = true;
						}
					}
				}).catch(error => console.log(error));
			},
			loginUser() {
				this.submitting = true;
				this.clearUsernameStatus();
				this.clearPasswordStatus();
				var allowSubmit = true;
				if(this.invalidUsername) {
					this.usernameError = true;
					allowSubmit = false;
				}
				if(this.invalidPassword) {
					this.passwordError = true;
					allowSubmit = false;
				}
				if(!allowSubmit) {
					this.noPasswordMatch = false;
					return;
				}
				var body = {username: this.user.username, password: this.user.password};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/login", body).then(response => {
					if(response.data.authentication && !response.data.valid && response.data.otpToken) {
						this.user = {username: "", password: ""};
						this.usernameError = false, this.passwordError = false, this.noPasswordMatch = false, this.submitting = false;
						const username = response.data.username;
						this.$store.dispatch("authenticate", {username});
						this.$router.push("/authentication");
					} else {
						if(response.data.valid) {
							this.user = {username: "", password: ""};
							this.usernameError = false, this.passwordError = false, this.noPasswordMatch = false, this.submitting = false;
							const token = response.data.token;
							const user = response.data.user;
							this.$store.dispatch("login", {token, user});
							this.$router.push("/home");
						} else {
							if(response.data.allowed) {
								this.noPasswordMatch = true;
							} else {
								var errorFields = response.data.errorFields;
								if(errorFields.includes("username")) this.usernameError = true;
								if(errorFields.includes("password")) this.passwordError = true;
								this.noPasswordMatch = false;
							}
						}
					}
				}).catch(error => console.log(error));
			},
			forgotCredentials() {
				this.$router.push("/forgot/credentials");
			},
			register() {
				this.$router.push("/registration");
			},
			clearUsernameStatus() { this.usernameError = false; },
			clearPasswordStatus() { this.passwordError = false; },
			togglePassword() {
				var type = document.getElementById("password").getAttribute("type");
				switch(type) {
					case "password": {
						document.getElementById("password").setAttribute("type", "text");
						document.getElementById("togglePassword").classList.remove("fa-eye");
						document.getElementById("togglePassword").classList.add("fa-eye-slash");
						return;
					}
					case "text": {
						document.getElementById("password").setAttribute("type", "password");
						document.getElementById("togglePassword").classList.remove("fa-eye-slash");
						document.getElementById("togglePassword").classList.add("fa-eye");
						return;
					}
				}
			}
		},
		computed: {
			invalidUsername() { 
				var usernameFormat = /^[a-z0-9_.-]*$/;
				if(this.user.username != "" && usernameFormat.test(this.user.username)) {
					return false;
				} else {
					return true;
				}
			},
			invalidPassword() {
				var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
				if(this.user.password != "" && passwordFormat.test(this.user.password)) {
					return false;
				} else {
					return true;
				}
			}
		}
	}
</script>

<style scoped>
	#login {
		margin: 0 auto;
		max-width: 400px;
	}
	.loginIcon {
		text-align: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}
	.forgotCredentialsDiv {
		text-align: right;
	}
	.submitButton {
		width: 100%;
	}
	.submitDiv, .registerDiv {
		text-align: center;
	}
	.loginFailed {
		color: #ff0000;
		margin-bottom: 10px;
	}
	.errorField {
		border: 1px solid #ff0000;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
	}
	.errorIcon {
		border: 1px solid #ff0000;
		border-left: 0px;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
	}
	.errorInput {
		color: #ff0000;
	}
</style>