<template>
	<div id="registration" class="container-fluid">
		<form autocomplete="off" @submit.prevent="createUser()">
			<div class="registrationIcon">
				<i class="fas fa-pencil-alt fa-7x"></i>
			</div>
			<div class="form-group">
				<input type="text" id="username" class="form-control" :class="{'errorField' : usernameError && submitting}" placeholder="Username" v-model="user.username" ref="first" @focus="clearUsernameStatus()" @keypress="clearUsernameStatus()"/>
				<small v-if="usernameError && submitting" class="form-text errorInput">Please provide a valid username!</small>
			</div>
			<div class="form-group">
				<input type="text" id="email" class="form-control" :class="{'errorField' : emailError && submitting}" placeholder="Email" v-model="user.email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
				<small v-if="emailError && submitting" class="form-text errorInput">Please provide a valid email!</small>
			</div>
			<div class="form-group">
				<div class="input-group">
					<input type="password" id="password" class="form-control" :class="{'errorField' : passwordError && submitting}" placeholder="Password" v-model="user.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
					<div class="input-group-append">
						<button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError && submitting}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
					</div>
				</div>
				<small v-if="passwordError && submitting" class="form-text errorInput">Please provide a valid password!</small>
			</div>
			<div class="form-group">
				<input type="text" id="firstName" class="form-control" :class="{'errorField' : firstNameError && submitting}" placeholder="First name" v-model="user.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()"/>
				<small v-if="firstNameError && submitting" class="form-text errorInput">Please provide a valid first name!</small>
			</div>
			<div class="form-group">
				<input type="text" id="lastName" class="form-control" :class="{'errorField' : lastNameError && submitting}" placeholder="Last name" v-model="user.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()"/>
				<small v-if="lastNameError && submitting" class="form-text errorInput">Please provide a valid last name!</small>
			</div>
			<div v-if="userCreated" class="form-group creationSuccessful">
				<div>User has been successfully created!</div>
				<div>Please visit your inbox and confirm your registration!</div>
			</div>
			<div v-if="alreadyExists == 'username'" class="form-group creationFailed">Username already exists!</div>
			<div v-if="alreadyExists == 'email'" class="from-group creationFailed">Email already exists!</div>
			<div class="form-group buttonsDiv">
				<button type="submit" class="btn btn-primary">Submit</button>
				<button type="button" class="btn btn-danger resetForm" @click="resetForm()">Reset</button>
			</div>
			<div class="form-group loginDiv">
				<button type="button" class="btn btn-info" @click="login()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
			</div>
		</form>
	</div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	var axios = require("axios");

	export default {
		name: "registration",
		data() {
			return {
				submitting: false,
				usernameError: false,
				emailError: false,
				passwordError: false,
				firstNameError: false,
				lastNameError: false,
				user: {
					username: "",
					email: "",
					password: "",
					firstName: "",
					lastName: ""
				},
				userCreated: false,
				alreadyExists: ""
			}
		},
		methods: {
			createUser() {
				this.submitting = true;
				this.clearUsernameStatus();
				this.clearEmailStatus();
				this.clearPasswordStatus();
				this.clearFirstNameStatus();
				this.clearLastNameStatus();
				var allowSubmit = true;
				if(this.invalidUsername) {
					this.usernameError = true;
					allowSubmit = false;
				}
				if(this.invalidEmail) {
					this.emailError = true;
					allowSubmit = false;
				}
				if(this.invalidPassword) {
					this.passwordError = true;
					allowSubmit = false;
				}
				if(this.invalidFirstName) {
					this.firstNameError = true;
					allowSubmit = false;
				}
				if(this.invalidLastName) {
					this.lastNameError = true;
					allowSubmit = false;
				}
				if(!allowSubmit) {
					this.alreadyExists = "";
					this.userCreated = false;
				return;
				}
				var body = {username: this.user.username, email: this.user.email, password: this.user.password, firstName: this.user.firstName, lastName: this.user.lastName};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createUser", body).then(response => {
					if(response.data.created) {
						this.userCreated = true;
						this.$refs.first.focus();
						this.user = {username: "", email: "", password: "", firstName: "", lastName: ""};
						this.alreadyExists = "";
						this.usernameError = false, this.emailError = false, this.passwordError = false, this.firstNameError = false, this.lastNameError = false, this.submitting = false;
					} else {
						if(response.data.alreadyExists) {
							this.alreadyExists = response.data.field;
							this.userCreated = false;
						} else {
							var errorFields = response.data.errorFields;
							if(errorFields.includes("username")) this.usernameError = true;
							if(errorFields.includes("email")) this.emailError = true;
							if(errorFields.includes("password")) this.passwordError = true;
							if(errorFields.includes("firstName")) this.firstNameError = true;
							if(errorFields.includes("lastName")) this.lastNameError = true;
							this.alreadyExists = "";
							this.userCreated = false;
						}
					}
				}).catch(error => console.log(error));
			},
			login() {
				this.$router.push("/login");
			},
			clearUsernameStatus() { this.usernameError = false; },
			clearEmailStatus() { this.emailError = false; },
			clearPasswordStatus() { this.passwordError = false; },
			clearFirstNameStatus() { this.firstNameError = false; },
			clearLastNameStatus() { this.lastNameError = false; },
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
			},
			resetForm() {
				this.user = {username: "", email: "", password: "", firstName: "", lastName: ""};
				this.alreadyExists = "";
				this.usernameError = false, this.emailError = false, this.passwordError = false, this.firstNameError = false, this.lastNameError = false, this.userCreated = false, this.submitting = false;
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
			invalidEmail() {
				var emailFormat = /\S+@\S+\.\S+/;
				if(this.user.email != "" && emailFormat.test(this.user.email)) {
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
			},
			invalidFirstName() { return this.user.firstName === ""; },
			invalidLastName() { return this.user.lastName === ""; }
		}
	}
</script>

<style scoped>
	#registration {
		margin: 0 auto;
		max-width: 500px;
	}
	.registrationIcon {
		text-align: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}
	.resetForm {
		margin-left: 10px;
	}
	.buttonsDiv, .loginDiv {
		text-align: center;
	}
	.creationSuccessful {
		color: #008000;
		margin-bottom: 10px;
	}
	.creationFailed {
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