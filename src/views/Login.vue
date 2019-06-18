
<template>
    <div class="loginBg">
        <div id="app">
            <v-app>
                <v-content style="background-image: url('./img/login.jpg')!important; background-position: center; background-size: cover;">
                    <v-container fill-height="fill-height">
                        <v-layout align-center="align-center" justify-center="justify-center">
                        <v-snackbar :color="color" :top="true" :right="true" v-model="snackbar" dark>
                            <div>{{message}}</div>
                            <v-icon size="16" @click="snackbar = false">
                                mdi-close-circle
                            </v-icon>
                        </v-snackbar>  

                        <v-flex class="login-form text-xs-center"> 
                            <div class="display-2 mb-3" style="color: #fff">
                            <!-- Flopay Inventory -->
                            VentIT
                            </div>
                            <v-card light="light">
                            <v-card-text>
                                <div class="subheading">
                                    <template v-if="options.isLoggingIn">Log in to your portal</template>
                                    <template v-else>Crate a new account</template>
                                </div>
                                <v-form>
                                    <v-text-field v-if="!options.isLoggingIn" v-model="user.name" light="light" label="Name" prepend-icon="mdi-person" autofocus=autofocus></v-text-field> 
                                    
                                    <v-text-field v-model="user.email" light="light" label="Email" type="email" prepend-icon="mdi-email" autofocus=autofocus></v-text-field>
                                    
                                    <v-text-field v-model="user.password" light="light" label="Password" prepend-icon="mdi-lock" type="password" autofocus=autofocus></v-text-field>
                                    
                                    <v-checkbox v-if="options.isLoggingIn" v-model="options.shouldStayLoggedIn" light="light" label="Stay logged in?" hide-details="hide-details"></v-checkbox>
                                    
                                    <v-btn v-if="options.isLoggingIn" @click.prevent="login" block="block" type="submit" class="black mt-4" :loading="loading">LOGIN</v-btn>
                                    <v-btn v-else block="block" type="submit" @click.prevent="options.isLoggingIn = true" class="black">Sign up</v-btn>
                                </v-form>
                            </v-card-text>  
                            </v-card>
                            <!-- <div v-if="options.isLoggingIn">
                                Don't have an account?
                                <v-btn light="light" @click="options.isLoggingIn = false" class="signup">Sign up</v-btn>
                            </div> -->
                        </v-flex>
                        </v-layout>
                    </v-container>
                </v-content>
                <!-- <v-footer app="app">
                    <v-flex class="text-xs-center">© 2018. All rights reserved.</v-flex>
                </v-footer> -->
            </v-app>
        </div>        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Login',
    metaInfo: {
        link: [
            { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css' },
        ],
        // script: [
        //     { src: 'https://cdn.jsdelivr.net/npm/vuetify/dist/vuetify.js' }
        // ]           
    },    
    data() {
            return {
                message: 'This is a temp message',
                color: 'success',
                colors: [
                'purple',
                'info',
                'success',
                'warning',
                'error'
                ],
                top: true,
                bottom: false,
                left: false,
                right: false,
                snackbar: false,
                user: {
                email: '',
                password: '',
                name: 'John Doe',
                },
                options: {
                isLoggingIn: true,
                shouldStayLoggedIn: true,
                },
                loading: false
            }
    },
    methods: {
        login() {
            this.loading = true
            this.$store.dispatch('login', {email: this.user.email, password: this.user.password})
            .then((response) => {
                this.loading = false

                if (response.data.status) {
                    this.message = response.data.response.message
                    this.color = 'success'
                    this.snackbar = true

                    this.$session.start()
                    this.$session.set('client', JSON.stringify(response.data.response.data))
                    localStorage.setItem('token', response.data.response.data.token)

                    if (this.$session.has('client')) {
                        this.$router.push('/dashboard')
                    } 
                } else {
                    this.message = response.data.response.message
                    this.color = 'error'
                    this.snackbar = true
                }
            })
            .catch((error) => {
                this.loading = false
                this.message = `${error}`
                this.color = 'error'
                this.snackbar = true
            })
        },

        snack (...args) {
        this.top = false
        this.right = false

        for (const loc of args) {
            this[loc] = true
        }

        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]

        this.snackbar = true
        }        
    },
    computed: {
        ...mapGetters({
            // login: 'isLogin'
        })
    }
}
</script>

<style lang="scss" scoped>
.login-form{
    max-width: 500px
}

.signup {
    color: #000!important;
    background: #fff;
}

.loginBg {
    background-image: url('/assets/images/login.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>

