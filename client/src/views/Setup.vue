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
                        <p>Scan the QR code or enter the secret in Google Authenticator</p>
                        <img :src="authentication.dataURL" alt="..." class="img-thumbnail">
                        <form autocomplete="off" @submit.prevent="verifyAuthentication()">
                            <div class="form-group">
                                <label for="otpToken">Otp token:</label>
                                <input type="text" id="otpToken" class="form-control" v-model="otpToken"/>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger" @click="disableAuthentication()">Disable</button>
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
		data: function(){
            return {
                username: "admin",
                authentication: {
                    secret: "",
                    tempSecret: ""
                },
                otpToken: ""
            }
        },
		methods: {
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
                var body = {otpToken: this.otpToken, username: this.username};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/verifyAuthentication", body).then(response => {
                    if(response.data.verified) {
                        this.authentication.secret = this.authentication.tempSecret;
                        this.authentication.tempSecret = "";
                    }
                }).catch(error => console.log(error));
            },
            disableAuthentication() {
                var body = {username: this.username};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/disableAuthentication", body).then(response => {
                    if(response.data.disabled) {
                        this.$router.push("/login");
                    }
                }).catch(error => console.log(error));
            }
        },
        created() {
            this.getAuthentication();
        }
    }
</script>

<style scoped>
    #setupInformation {
        margin: 0 auto;
        max-width: 500px;
    }
    .authenticationSuccessful {
        color: #008000;
		margin-bottom: 10px;
    }
</style>