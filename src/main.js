import Vue from 'vue'
import App from './App.vue'
import io from "socket.io-client";
// const socket = io('http://localhost:4000'); 
const socket = io('http://ec2-35-174-165-153.compute-1.amazonaws.com:4000'); 
window.socket = socket;
import VueCookies from "vue-cookies";

window.vue = Vue;
window.axios = require('axios');
window.api_calls = {
  // api_url: 'http://localhost:4000',
  api_url: 'http://ec2-35-174-165-153.compute-1.amazonaws.com:4000',
  getChatroomsByUserIdEndPoint:"/chatroomPage/getChatroomsByUserId",
  getBansByUserIdEndPoint:"/chatroomPage/getBansByUserId",
  getAllChatRoomsEndPoint: "/chatroomPage/getChatrooms",
  signUpEndpoint: "/signupPage/signupByEmail",
  loginByEmailNameEndpoint: "/loginPage/loginByEmail",
  loginByUserNameEndpoint: "/loginPage/logoutUserAcc",
  getNewerMessagesEndpoint: "/chatPage/getNewerMessages",
  createNewRoomEndpoint:"/chatRoomPage/createNewChatRoom",
  fileUploadEndpoint:"/chatPage/upload",
  fileDownloadEndpoint:"/chatPage/download",
  createBreakoutEndpoint:"/breakoutPage/createBreakout",
  sendMessageEndpoint:"/chatPage/sendMessage",
  logoutUserAccEndpoint:"/loginPage/logoutUserAcc",
  deleteUserAccEndpoint:"/loginPage/deleteUserAccByEmailAddrAndPwd",
  banUserEndpoint:"/adminPage/banUserById",
  getAllUserInfoEndpoint:"/adminPage/getAllUserInformation",
  getAllChatUsersEndpoint: "/adminPage/getAllUserInformation",
  assignClassesEndpoint:"/adminPage/assignClasses",
  leaveClassesEndpoint:"/adminPage/removeUserById",
  getEmail :function() {
	  let email = window.vue.$cookies.get("ssr_cookie")
	  return email;
  },
  banUserById: function(user_id, classes){
    const request = window.axios.post(this.api_url + this.banUserEndpoint, {USER_ID:user_id, CLASSES:classes});
    request
    .then(result => console.log('(1) Success banUserById:', result))
    .catch(error => console.error('(1) Error banUserById:', error));
    return request;
  },

  assignClasses: function(user_id, classes){
    console.log("assigning")
    const request = window.axios.post(this.api_url + this.assignClassesEndpoint, {USER_ID:user_id, CLASSES:classes});
    request
    .then(result => console.log('(1) Success assignClasses:', result))
    .catch(error => console.error('(1) Error assignClasses:', error));
    return request;
  },
  leaveClasses: function(user_id, classes){
    console.log("leaving")
    const request = window.axios.post(this.api_url + this.leaveClassesEndpoint, {USER_ID:user_id, CLASSES:classes});
    request
    .then(result => console.log('(1) Success leaveClasses:', result))
    .catch(error => console.error('(1) Error leaveClasses:', error));
    return request;
  },
  getChatroomsByUserId : function (user_id) {
      const request = window.axios.post(this.api_url + this.getChatroomsByUserIdEndPoint, {USER_ID:user_id});
      request
      .then(result => console.log('(1) Success getChatroomsByUserId:', result))
      .catch(error => console.error('(1) Error getChatroomsByUserId:', error));

      return request;
  },
  getBansByUserId : function (user_id) {
    const request = window.axios.post(this.api_url + this.getBansByUserIdEndPoint, {USER_ID:user_id});
    request
    .then(result => console.log('(1) Success getBansByUserId:', result))
    .catch(error => console.error('(1) Error getBansByUserId:', error));

    return request;
},

  getAllChatRooms : function () {
    console.log("GET ALL CHAT ROOMS", )
      const request = window.axios.get(this.api_url + this.getAllChatRoomsEndPoint);
      
      request
      .then(result => console.log('(1) Success getAllChatRooms:', result))
      .catch(error => console.error('(1) Error getAllChatRooms:', error));

      return request;
  },

  signUp : function (signUpCredentials) {
    const request = window.axios.post(this.api_url + this.signUpEndpoint, signUpCredentials);
    
    request
    .then(result => console.log('(1) Success SignUp:', result))
    .catch(error => console.error('(1) Error SignUp:', error));

    return request;
  },

  login : function (loginCredentials) {
    const endpoint = loginCredentials.USER_EMAIL ? this.loginByEmailNameEndpoint : this.loginByUserNameEndpoint;
    const request = window.axios.post(this.api_url + endpoint, loginCredentials);
    
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));

    return request;
  },

  createNewRoom: function(roomName) {
    const request = window.axios.post(this.api_url + this.createNewRoomEndpoint, {ROOM_NAME:roomName});
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));
    return request;
  },

  fileUpload: function(file){
    const request = window.axios.post(this.api_url + this.fileUploadEndpoint, file);
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));
    return request;
  },

  fileDownload: function(message_id){
    const request = window.axios.post(this.api_url + this.fileDownloadEndpoint, {MSG_ID:message_id});
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));
    return request;
  },

  createBreakout: function(name, parent, cb) {
    console.log("CREATE BREAKOUT")
    const request = window.axios.post(this.api_url + this.createBreakoutEndpoint, {
      "BREAKOUT_NAME" : name,
      "PARENT_ID" : parent
    })
    request.then(cb())
    request.catch(result => console.error("(1) Error creating breakout", result))
  },

  sendMessage: function(user_id, chatroom_id, message) {
    console.log("SENDING MESSAGE", user_id, chatroom_id, message)
    const request = window.axios.post(this.api_url + this.sendMessageEndpoint, {
      "USER_ID" : user_id,
      "CHATROOM_ID" : chatroom_id,
      "MESSAGE" : message
    })
    request.then("MESSAGE SUCCESSFULLY SENT");
    request.error((error) => console.error("Something went wrong sending message:", error))
  },
  logout:function(user_email){
    const request = window.axios.post(this.api_url + this.logoutUserAccEndpoint, {USER_EMAIL:user_email});
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));
    return request;
  },

  deleteUserAcc:function(user_email, password){
    const request = window.axios.post(this.api_url + this.deleteUserAccEndpoint, {USER_EMAIL:user_email, PASSWORD:password});
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));
    return request;
  },

  banUser:function(user_email){
    const request = window.axios.post(this.api_url + this.deleteUserAccEndpoint, {USER_EMAIL:user_email});
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));
    return request;
  },
  getAllChatUsers: function(){
    const request = window.axios.post(this.api_url + this.getAllChatUsersEndpoint);
    request
    .then(result => console.log('(1) Success Login:', result))
    .catch(error => console.error('(1) Error Login:', error));
    return request;
  }
}

Vue.config.productionTip = false
Vue.use(VueCookies);
Vue.$cookies.config("7d");

new Vue({
  render: h => h(App),
}).$mount('#app')

