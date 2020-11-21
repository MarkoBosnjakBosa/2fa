<template>
    <div id="home" class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarOptions" aria-controls="navbarOptions" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbarOptions" class="collapse navbar-collapse">
                <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a id="userOptions" href="#" class="nav-link dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{username}}</a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userOptions">
                            <a class="dropdown-item" href="#" @click="openSetup()">Setup</a>
                            <a class="dropdown-item" href="#" @click="openProfile()">Profile</a>
                            <a class="dropdown-item" href="#" @click="logout()">Log out</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
        <div id="homeInformation">
            <h1>Welcome to 2fa!</h1>
            <img src="../assets/2faImage.jpg" alt="2fa Image" class="img-fluid" width="500" height="500"/>
        </div>
    </div>
</template>

<script>
    import "bootstrap";
    import "bootstrap/dist/css/bootstrap.min.css";
    var axios = require("axios");

    export default {
        name: "home",
        data() {
            return {
                username: ""
            }
        },
        methods: {
            isLoggedIn() {
                if(!this.$store.getters.isLoggedIn) this.$router.push("/login");
                this.username = this.$store.getters.getUser;
                this.checkStatus();
            },
            openSetup() {
                this.$router.push("/setup");
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
            }
        },
        created() {
            this.isLoggedIn();
        }
    }
</script>

<style scoped>
    #homeInformation {
        margin: 0 auto;
        max-width: 500px;
        text-align: center;
    }
    h1 {
        margin-top: 20px;
    }
</style>