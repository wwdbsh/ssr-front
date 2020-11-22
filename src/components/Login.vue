
<style scoped src="../css/login.css"> </style>
<template>

<div class="login-wrap">
	<div class="login-html">
		<input id="tab-1" type="radio" name="tab" class="log-in" checked><label for="tab-1" class="tab">Log In</label>
		<input id="tab-2" type="radio" name="tab" class="sign-up"><label for="tab-2" class="tab">Sign Up</label>
		<div class="login-form">
			<div class="log-in-htm">
				<div class="group">
					<label for="user" class="label">{{loginLabel}}</label>
					<input v-model="loginName" id="user" type="text" class="input"  autocomplete="email">
				</div>
				
				<!-- <div class="group">
					<input id="check" v-model="loginByUserName" type="checkbox" class="check" checked>
					<label for="check"><span class="icon"></span> Login By UserName?</label>
				</div> -->
				<div class="group">
					<label for="pass" class="label">Password</label>
					<input id="pass" v-model="loginPassword" type="password" class="input" data-type="password" autocomplete="current-password">
				</div>
				
				<!-- <div class="group">
					<input v-model="areYouAdmin" id="admin" type="checkbox" class="check">
					<label for="admin"><span class="icon"></span> Are you an admin user?</label>
				</div> -->
				<div class="group">
					<input @click='loginClicked()' type="submit" class="button" value="Log In">
				</div>
				<div class="hr"></div>
				<div class="group">
					<input id="check" type="checkbox" class="check">
					<label for="check"><span class="icon"></span> Forgot Password?</label>
				</div>
				<div><label style="color:white;">For admin account Mail us at</label></div>
				<div><a href="mailto:team3@albany.edu" style="color:white;">team3@gmail.com</a></div>
			</div>
			<div class="sign-up-htm">
				<div class="group">
					<label for="user" class="label">Username</label>
					<input v-model="username" id="user" type="text" class="input">
				</div>
				<div class="group">
					<label for="pass" class="label">Password</label>
					<input v-model="password" id="pass" type="password" class="input" data-type="password">
				</div>
				<div class="group">
					<label for="pass" class="label">Repeat Password</label>
					<input v-model="check_password" id="pass" type="password" class="input" data-type="password">
				</div>
				<div class="group">
					<label for="pass" class="label">Email Address</label>
					<input v-model="email" id="pass" type="text" class="input">
				</div>
				<div class="group">
					<input @click='signupClicked()' type="submit" class="button" value="Sign Up">
				</div>
				<div class="hr"></div>
				<div class="foot-lnk">
					<label for="tab-1">Already Member?</label>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
//import func from '../../vue-temp/vue-editor-bridge';
export default {
  name: 'Login',
  data: function () {
      return {
			username: "",
			password:"",
			check_password:"",
			email:"",
			loginName:"slee9@albany.edu",
			loginPassword: "1234",
			loginByUserName: false,
			areYouAdmin: false
        }
  },
  mounted:function(){
	  window.socket.emit('disconnect');
  },
  computed: {
    // a computed getter
    loginLabel: function () {
		return this.loginByUserName ? "Username" : "Email Address";
    }
  },
  methods: {
		initiateLogin: function(isAdmin) {
			this.$emit('LoginClicked', isAdmin);
		},
		
		clearFields: function() {
			this.email = "";
			this.username = "";
			this.password = "";
			this.check_password ="";
			this.loginName = "";
			this.loginPassword = "";
			this.loginByUserName = false;
		},

		signupClicked: function() {
			const socket = window.socket;
			var signUpCredentials = {
				USER_EMAIL: this.email, 
				USER_NAME: this.username,
				PASSWORD: this.password,
				CHK_PASSWORD: this.check_password
			};

			var thisComp = this;
			window.api_calls.signUp(signUpCredentials)
				.then(() => { 
					alert("Success!: Please Login.");
					socket.emit("sendsignalnewuser");
					this.email = "";
					this.username = "";
					this.password = "";
					this.check_password ="";
				})
				.catch((error) => {
					alert('Sign up failed. Please try again Reason : ' + error.response.data.REASON);
					thisComp.clearFields();
				});
		},

		loginClicked: function() {
			const socket = window.socket;
			
			var loginCredentials = { PASSWORD: this.loginPassword };
			if(this.loginByUserName) {
				loginCredentials.USER_NAME = this.loginName;
			}
			else {
				loginCredentials.USER_EMAIL = this.loginName;
			}
			console.log(loginCredentials);
			window.api_calls.login(loginCredentials)
				.then((response) => {
					console.log("LOGIN RESPONSE", response) 
					window.userId = response.data.USER_ID //TODO this isn't good
					window.userName = response.data.USER_NAME;
					this.clearFields();
					this.initiateLogin(response.data.IS_ADMIN);
					socket.emit("adduser", loginCredentials.USER_EMAIL);
					this.$cookies.set("ssr_cookie", loginCredentials.USER_EMAIL);
					this.$cookies.set("is_admin", response.data.IS_ADMIN);
					this.$cookies.set("username", response.data.USER_NAME);
				})
				.catch(() => {
					alert('Login Failed! Please check your credentials and try again');
				});
		},
  }
}
</script>
