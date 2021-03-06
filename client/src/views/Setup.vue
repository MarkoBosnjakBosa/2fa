<template>
    <div id="setup" class="container-fluid">
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
                            <a class="dropdown-item" href="#">Authentication</a>
                            <a class="dropdown-item" href="#" @click="openProfile()">Profile</a>
                            <a class="dropdown-item" href="#" @click="logout()">Log out</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
        <div id="setupInformation">
            <h1>Two-factor authentication</h1>
            <div class="row">
                <div class="col-md-10">
                    <div v-if="authentication.secret" class="authenticationSuccessful">
                        <b>2fa has been successfully enabled!</b>
                    </div>
                    <button v-if="!authentication.secret" class="btn btn-primary" @click="enableAuthentication()">Enable</button>
                    <div v-if="authentication.tempSecret">
                        <div class="scanDiv">Scan the QR code and enter the secret key:</div>
                        <img :src="authentication.dataURL" alt="QR Code" class="img-thumbnail">
                        <form autocomplete="off" @submit.prevent="verifyAuthentication()">
                            <div class="form-group">
                                <input type="text" id="otpToken" class="form-control" :class="{'errorField' : otpTokenError}" placeholder="Otp token" v-model="otpToken" @focus="clearOtpTokenStatus()" @keypress="clearOtpTokenStatus()"/>
                                <small v-if="otpTokenError" class="form-text errorInput">Please provide a valid otp token!</small>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-md-2">
                    <button v-if="authentication.secret" type="button" class="btn btn-danger" @click="disableAuthentication()">Disable</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    var axios = require("axios");

    export default {
        name: "setup",
        data() {
            return {
                username: "",
                authentication: {
                    secret: "",
                    tempSecret: ""
                },
                otpTokenError: false,
                otpToken: ""
            }
        },
        methods: {
            isLoggedIn() {
                if(!this.$store.getters.isLoggedIn) this.$router.push("/login");
                this.username = this.$store.getters.getUser;
                this.checkStatus();
            },
            getAuthentication() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getAuthentication/" + this.username).then(response => {
                    if(response.data.authenticated) {
                        this.authentication = response.data.authentication;
                    }
                }).catch(error => console.log(error));
            },
            enableAuthentication() {
                var body = {username: this.username};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/enableAuthentication", body).then(response => {
                    if(response.data.authenticated) {
                        this.authentication = response.data.authentication;
                    }
                }).catch(error => console.log(error));
            },
            verifyAuthentication() {
                this.clearOtpTokenStatus();
                if(this.invalidOtpToken) {
                    this.otpTokenError = true;
                    return;
                }
                var body = {otpToken: this.otpToken, username: this.username};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/verifyAuthentication", body).then(response => {
                    if(response.data.verified) {
                        this.authentication.secret = this.authentication.tempSecret;
                        this.authentication.tempSecret = "";
                        this.otpTokenError = false;
                    } else {
                        this.otpTokenError = true;
                    }
                }).catch(error => console.log(error));
            },
            disableAuthentication() {
                var body = {username: this.username};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/disableAuthentication", body).then(response => {
                    if(response.data.disabled) {
                        this.logout();
                    }
                }).catch(error => console.log(error));
            },
            openHome() {
                this.$router.push("/home");
            },
            openProfile() {
                this.$router.push("/profile");
            },
            checkStatus() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkStatus").then(response => console.log(response.data)).catch(error => console.log(error));
            },
            logout() {
                this.$store.dispatch("logout");
                this.$router.push("/login");
            },
            clearOtpTokenStatus() { this.otpTokenError = false; },
        },
        computed: {
            invalidOtpToken() { return this.otpToken === ""; }
        },
        created() {
            this.isLoggedIn();
            this.getAuthentication();
        }
    }
</script>

<style scoped>
    #setupInformation {
        margin: 0 auto;
        max-width: 500px;
    }
    h1 {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .scanDiv {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    form {
        margin-top: 10px;
    }
    .authenticationSuccessful {
        color: #008000;
        margin-bottom: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>