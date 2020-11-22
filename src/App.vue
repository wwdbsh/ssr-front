<template>
  <div id="app">
    <img v-show="!dashboardSwitch && !classRoomSwitch && !accountSwitch && !permissionsSwitch && !adminSwitch && !addClassroomSwitch" class="logo" alt="Vue logo" src="./assets/logo.png">
    <Login @LoginClicked='loginClicked($event)' @SignupClicked='signupClicked($event)'
       v-show='!dashboardSwitch && !classRoomSwitch && !accountSwitch && !permissionsSwitch && !adminSwitch && !addClassroomSwitch' />
    
    <Dashboard
         @LogOutClick='logoutClicked()' 
         @TurnOnClassRoomClick='turnOnClassRoomClicked()'
         @NavigationClicked = 'dashboardNavigationClicked($event)'
         v-show='dashboardSwitch' />
    
    <Chatroom @manage-classroom-clicked='addClassroomClicked()'
    @LogOutClick='logoutClicked()'
    @GoToDashboard='goToDashboardClicked()'
        v-show='classRoomSwitch' :chatroomname='CurrentChatRoom' />

    <Permissions
      @LogOutClick='logoutClicked()' 
      @GoToDashboard='goToDashboardClicked()' 
      v-show='permissionsSwitch' />

    <Accounts 
      @LogOutClick='logoutClicked()' 
      @GoToDashboard='goToDashboardClicked()' 
      v-show='accountSwitch'/>

    <Admin 
       @LogOutClick='logoutClicked()'
       @GoToDashboard='goToDashboardClicked()' 
       v-show='adminSwitch' />
    <AddClassroom 
      @stop-adding-classrooms='returnToChatroom()'
      v-show="addClassroomSwitch"
      ref="addClassroomRef"
    />
    
  </div>
</template>
<script>
import vue from 'vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Permissions from './components/Permissions.vue'
import Accounts from './components/Accounts.vue'
import Admin from './components/Admin.vue'
import Chatroom from './components/Chatroom.vue'
import AddClassroom from './components/AddClassroom.vue'
//import func from '../vue-temp/vue-editor-bridge'

export default {
  name: 'App',
  components: {
    Login,
    Dashboard,
    Chatroom,
    Permissions,
    Accounts,
    Admin,
    AddClassroom
  },
  data: function() {
    return {
      dashboardSwitch: false,
      classRoomSwitch: false,
      adminSwitch: false,
      accountSwitch: false,
      permissionsSwitch: false,
      addClassroomSwitch: false,
      ChatRoomList: [],
      CurrentChatRoom: "New",
      socket:window.socket
    }
  },
  mounted: function() {
    if(this.$cookies.isKey("ssr_cookie")){
      window.userName = this.$cookies.get("username");
      this.socket.emit("adduser", this.$cookies.get("ssr_cookie"));
      if(this.$cookies.get("is_admin") === "1"){
        this.dashboardSwitch = true;
      }else{
        this.classRoomSwitch = true;
      }
    }
    var thisComponent = this;
  },

  methods: {
    loginClicked: function(areYouAdmin) {
      if(areYouAdmin)
        this.dashboardSwitch = true;
      else{
        this.dashboardSwitch = false;
        this.turnOnClassRoomClicked();
      }
    },
    logoutClicked: function() {
      this.socket.emit("logout");
      this.$cookies.remove("ssr_cookie");
      this.$cookies.remove("is_admin");
      this.$cookies.remove("username");
      this.dashboardSwitch = false;
      this.classRoomSwitch = false;
      this.permissionsSwitch = false;
      this.accountSwitch = false;
      this.adminSwitch = false;
    },
    turnOnClassRoomClicked: function() {
      this.classRoomSwitch = true;
      this.dashboardSwitch = false;
    },
    goToDashboardClicked: function () {
      this.classRoomSwitch = false;
      this.dashboardSwitch = true;
      this.permissionsSwitch = false;
      this.accountSwitch = false;
      this.adminSwitch = false;
    },
    dashboardNavigationClicked: function(clickSourceFromDashboard) {
      this.dashboardSwitch = false;
      if(clickSourceFromDashboard == 'Permissions') { this.permissionsSwitch = true;}
      else if (clickSourceFromDashboard == 'Admin') { this.adminSwitch = true;}
      else if (clickSourceFromDashboard == 'Accounts') { this.accountSwitch = true;}
    },
    addClassroomClicked: function() {
      console.log("HERE I AM");
      this.$refs.addClassroomRef.init(window.user_id);
      this.classRoomSwitch = false;
      this.addClassroomSwitch = true;
    },
    returnToChatroom: function() {
      console.log("HERE I AM");
      this.classRoomSwitch = true;
      this.addClassroomSwitch = false;
      window.socket.emit("requestsenduserid", window.user_id)
    }
  }
}
</script>

<style>
  @import url('https://use.fontawesome.com/releases/v5.5.0/css/all.css');
  @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  color: grey;
  margin-top: 20px;
}
h1 {
  color: white;
}
.logo {
  border-radius: 20px;
}
body {
  /*background-color:#BEB2FF;*/
  background:url(https://pixy.org/src2/600/6001618.jpg) no-repeat center;
  backdrop-filter: blur(2px);
  height: 100%;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; 
}

</style>
