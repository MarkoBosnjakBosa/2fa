<template>
    <div id="home" class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarOptions" aria-controls="navbarOptions" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbarOptions" class="collapse navbar-collapse">
                <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="openHome()">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a id="userOptions" href="#" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{username}}</a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userOptions">
                            <a class="dropdown-item" href="#" @click="openSetup()">Setup</a>
                            <a class="dropdown-item" href="#">Profile</a>
                            <a class="dropdown-item" href="#" @click="logout()">Log out</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
        <div id="personalInformation">
            <form autocomplete="off" @submit.prevent="editUser()" enctype="multipart/form-data">
                <div class="profileIcon">
                    <i class="fas fa-edit fa-7x"></i>
                </div>
                <div class="form-group row">
                    <label for="username" class="col-md-2 col-form-label">Username:</label>
                    <div class="col-md-10">
                        <input type="text" id="username" class="form-control" :placeholder="user.username" disabled/>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="email" class="col-md-2 col-form-label">Email:</label>
                    <div class="col-md-10">
                        <input type="text" id="email" class="form-control" :placeholder="user.email" disabled/>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="firstName" class="col-md-2 col-form-label">First name:</label>
                    <div class="col-md-10">
                        <input type="text" id="firstName" class="form-control" :class="{'errorField' : firstNameError && userSubmitting}" v-model="user.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()"/>
                    </div>
                    <div class="col-md-2"></div>
                    <div class="col-md-10">
                        <small v-if="firstNameError && userSubmitting" class="form-text errorInput">Please provide a valid first name!</small>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="lastName" class="col-md-2 col-form-label">Last name:</label>
                    <div class="col-md-10">
                        <input type="text" id="lastName" class="form-control" :class="{'errorField' : lastNameError && userSubmitting}" v-model="user.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()"/>
                    </div>
                    <div class="col-md-2"></div>
                    <div class="col-md-10">
                        <small v-if="lastNameError && userSubmitting" class="form-text errorInput">Please provide a valid last name!</small>
                    </div>
                </div>
                <div v-if="userEdited" class="form-group editSuccessful">Personal information have been successfully edited!</div>
                <div class="form-group submitButton">
                    <button type="submit" class="btn btn-primary">Edit</button>
                </div>
            </form>
        </div>
        <div id="resetPassword">
            <form autocomplete="off" @submit.prevent="resetPassword()">
                <div class="resetPasswordIcon">
                    <i class="fas fa-key fa-7x"></i>
                </div>
                <div class="form-group row">
                    <label for="password" class="col-md-2 col-form-label">Password:</label>
                    <div class="col-md-10 input-group">
                        <input type="password" id="password" class="form-control" :class="{'errorField' : passwordError}" placeholder="Password" v-model="password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
                        <div class="input-group-append">
                            <button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
                        </div>
                    </div>
                    <div class="col-md-2"></div>
                    <div class="col-md-10">
                        <small v-if="passwordError" class="form-text errorInput">Please provide a valid password!</small>
                    </div>
                </div>
                <div v-if="passwordReset" class="form-group resetSuccessful">Your password has been successfully reset!</div>
                <div class="form-group submitButton">
                    <button type="submit" class="btn btn-primary">Reset</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    var axios = require("axios");

    export default {
        name: "profile",
        data() {
            return {
                username: "",
                userSubmitting: false,
                firstNameError: false,
                lastNameError: false,
                user: {
                    username: "",
                    email: "",
                    firstName: "",
                    lastName: ""
                },
                userEdited: false,
                passwordError: false,
                password: "",
                passwordReset: false
            }
        },
        methods: {
            isLoggedIn() {
                if(!this.$store.getters.isLoggedIn) this.$router.push("/login");
                this.username = this.$store.getters.getUser;
                this.checkStatus();
            },
            getUser() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUser/" + this.username).then(response => {
                    this.user = response.data.user;
                }).catch(error => console.log(error));
            },
            editUser() {
                this.userSubmitting = true;
                this.clearFirstNameStatus();
                this.clearLastNameStatus();
                var allowSubmit = true;
                if(this.invalidFirstName) {
                    this.firstNameError = true;
                    allowSubmit = false;
                }
                if(this.invalidLastName) {
                    this.lastNameError = true;
                    allowSubmit = false;
                }
                if(!allowSubmit) {
                    this.userEdited = false;
                    return;
                }
                var body = {username: this.username, firstName: this.user.firstName, lastName: this.user.lastName};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editUser", body).then(response => {
                    if(response.data.edited) {
                        this.userEdited = true;
                        this.firstNameError = false, this.lastNameError = false, this.userSubmitting = false;
                    } else {
                        var errorFields = response.data.errorFields;
                        if(errorFields.includes("firstName")) this.firstNameError = true;
                        if(errorFields.includes("lastName")) this.lastNameError = true;
                        this.userEdited = false;
                    }
                }).catch(error => console.log(error));
            },
            resetPassword() {
                this.clearPasswordStatus();
                if(this.invalidPassword) {
                    this.passwordError = true;
                    this.passwordReset = false;
                    return;
                }
                var body = {username: this.username, acceptanceToken: this.user.acceptanceToken, password: this.password};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/resetPassword", body).then(response => {
                    if(response.data.reset) {
                        this.passwordReset = true;
                        this.password = "";
                        this.passwordError = false;
                    } else {
                        this.passwordError = true;
                        this.passwordReset = false;
                    }
                }).catch(error => console.log(error));
            },
            openHome() {
                this.$router.push("/home");
            },
            openSetup() {
                this.$router.push("/setup");
            },
            checkStatus() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkStatus").then(response => console.log(response.data)).catch(error => console.log(error));
            },
            logout() {
                this.$store.dispatch("logout");
                this.$router.push("/login");
            },
            clearFirstNameStatus() { 
                this.firstNameError = false;
                this.userEdited = false;
            },
            clearLastNameStatus() { 
                this.lastNameError = false;
                this.userEdited = false;
            },
            clearPasswordStatus() { 
                this.passwordError = false; 
                this.passwordReset = false;
            },
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
            invalidFirstName() { return this.user.firstName === ""; },
            invalidLastName() { return this.user.lastName === ""; },
            invalidPassword() {
                var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                if(this.password != "" && passwordFormat.test(this.password)) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        created() {
            this.isLoggedIn();
            this.getUser();
        }
    }
</script>

<style scoped>
    #personalInformation {
        margin: 0 auto;
        max-width: 650px;
        text-align: center;
    }
    #resetPassword {
        margin: 0 auto;
        max-width: 650px;
        text-align: center;
    }
    .profileIcon, .resetPasswordIcon {
        margin-top: 20px;
		margin-bottom: 20px;
    }
    .editSuccessful, .resetSuccessful {
        color: #008000;
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