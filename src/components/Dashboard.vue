<style scoped src="../css/dashboard.css">
</style>

<template>
  <div class="dashboard-main">
    <button class="logoutButton" @click="turnOnClassRoom()">Go to class</button>
    <button class="logoutButton" @click="logOutClick()">Log out</button>
    <!-- <table class='one-row-dashboard'>
        <tr>
            <td>
                <table>
                    <tr>
                    <td class='left-side-cell'>
                        <button  @click='turnOnClassRoom()' class='button-link'> Go To Chatroom </button>

                    </td>
                    </tr>

                    <tr>
                    <td class='left-side-cell'>
                        <button @click='accountInfoClicked()' class='button-link'> Account Info</button>
                    </td>
                    </tr>

                    <tr>
                    <td class='left-side-cell'>
                        <button  @click='adminClicked()' class='button-link'> Administration </button>
                    </td>
                    </tr>
                    <tr>
                    <td class='left-side-cell'>
                        <button @click='permissionsClicked()' class='button-link' >Permissions</button>

                    </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table> -->

    <div class="row">
      <div class="column2 column-margin">
        <div class="container-fluid h-100">
          <div class="row justify-content-center h-100">
            <div class="col-md-12 col-xl-12 chat">
              <div class="chat-windows card mb-sm-3 mb-md-0 contacts_card">
                <div class="card-header">
                  <div class="input-group">
                    <h3>List of Users</h3>
                    <div class="input-group-prepend"></div>
                  </div>
                  <ul class="contacts">
                    <li
                      @click="clickUser(index)"
                      v-for="(item, index) in allUserslist"
                      :key="item.user_id"
                      class="hover-classroom"
                      :class="activeIndex == index ? 'active' : 'inactive'"
                    >
                      <div class="d-flex bd-highlight">
                        <div class="user_info">
                          <span style="color: white; font-size: 1.5em">{{
                            item.name
                          }}</span>
                          <br />
                          <h6 class="class-number">
                            User Id: {{ item.user_id }}
                          </h6>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column2">
        <div class="container-fluid h-100">
          <div class="row justify-content-center h-100">
            <div class="col-md-12 col-xl-12 chat">
              <div class="chat-windows card mb-sm-3 mb-md-0 contacts_card">
                <div class="card-header">
                  <h3>List of Classes</h3>
                  <div class="input-group"></div>
                  <ul class="contacts">
                    <li
                      @click="clickClassRoom(index)"
                      v-for="(item, index) in classRooms"
                      :key="item.chatroom_id"
                      class="hover-classroom"
                      :class="activeIndex == index ? 'active' : 'inactive'"
                      :id = "'class_' + item.classroom_id"
                    >
                      <div class="d-flex bd-highlight">
                        <div class="user_info">
                          <span style="color: white; font-size: 1.5em">{{
                            item.chatroom_name
                          }}</span>
                          <br />
                          <h6 class="class-number">
                            Class Number: {{ item.chatroom_id }}
                          </h6>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column1">
        <div class="">
          <div class="container-fluid h-100">
            <div class="row justify-content-center h-100">
              <div class="col-md-12 col-xl-12 chat">
                <div class="chat-windows card mb-sm-3 mb-md-0 contacts_card">
                  <div class="card-header">
                    <h3>
                      List of Classes for <b> {{ this.selectedUser }} </b>
                    </h3>
                    <div class="input-group">
                      <ul style="width: 100%" class="contacts">
                        <li
                          v-for="(item, index) in userClasses"
                          :key="item.user_id"
                          class="hover-classroom"
                          :class="activeIndex == index ? 'active' : 'inactive'"
                        >
                          <div class="d-flex bd-highlight">
                            <div class="user_info">
                              <span style="color: white; font-size: 1.5em">{{
                                item.chatroom_name
                              }}</span>
                              <br />
                              <h6 class="class-number">
                                Class Number: {{ item.chatroom_id }}
                              </h6>
                            </div>
                          </div>
                        </li>
                        <input
                          @click="signupClicked()"
                          type="submit"
                          class="button"
                          value="Assign Classes"
                          style="margin: 5px"
                        />
                        <input
                          @click="banClicked()"
                          type="submit"
                          class="button"
                          value="Ban User From Classes"
                          style="margin: 5px"
                        />
                        <input
                          @click="clickdelete()"
                          type="submit"
                          class="button"
                          value="Clear List"
                          style="margin: 5px"
                        />
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-header" style="width: 100%">
      <div class="input-group">
        <form action="#" @submit.prevent="handlesubmit">
          <input
            type="text"
            placeholder="Create new classroom"
            name=""
            class="form-control plus"
            v-model="newRoomName"
            style="display: inline"
          />
          <div class="input-group-prepend">
            <span class="input-group-text search_btn" @click="handlesubmit()"
              ><em class="fas fa-plus"></em
            ></span>
          </div>
        </form>
      </div>
      <div>
        <select id="selectThemeClass" @change="loadColors">
            <option v-for="chatroom in classRooms " v-bind:key="chatroom.chatroom_id" :value="chatroom.classroom_id"> {{chatroom.chatroom_name}} </option>
        </select>
        <label for="foregroundColor" style="background-color:white;"> First color </label>
        <input type="color" id="foregroundColor" v-model="primary_color">
        <label for="backgroundColor" style="background-color:white;"> Second color </label>
        <input type="color" id="backgroundColor" v-model="secondary_color">
        <button @click = "resetTheme" style="background-color:white;"> Reset </button>
        <button @click = "applyTheme" style="background-color:white;"> Apply Theme </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  created: function () {
    this.socket.on("updateuserlistofdashboard", () => {
      window.api_calls.getAllChatUsers().then((response) => {
        console.log(response);
        this.allUserslist = response.data.USER_LIST;
        this.allUserslist.forEach((user) => {
          user.name =
            user.name.charAt(0).toUpperCase() +
            user.name.slice(1).toLowerCase();
        });
      });
    });
    this.socket.on(
      "updaterooms",
      (classroom_title, chatroom_title, classroom_id, chatroom_id) => {
        this.onClassroomCreated(chatroom_title, classroom_id, chatroom_id);
      }
    );
  },
  methods: {
    banClicked: function () {
      const user_id = this.allUserslist[this.activeUserIndex].user_id;
      const classes = this.userClasses.map((c) => c.chatroom_id);
      window.api_calls
        .banUserById(user_id, classes)
        .then((res) => console.log(res));
      alert("Ban success");
      this.userClasses = [];
    },
    signupClicked: function () {
      const user_id = this.allUserslist[this.activeUserIndex].user_id;
      const classes = this.userClasses.map((c) => c.chatroom_id);
      window.api_calls
        .assignClasses(user_id, classes)
        .then((res) => console.log(res));
      alert("Classes added success");
      this.userClasses = [];
    },
    logOutClick: function () {
      this.$emit("LogOutClick");
    },
    turnOnClassRoom: function () {
      this.$emit("TurnOnClassRoomClick");
    },
    adminClicked: function () {
      this.$emit("NavigationClicked", "Admin");
    },
    permissionsClicked: function () {
      this.$emit("NavigationClicked", "Permissions");
    },
    accountInfoClicked: function () {
      this.$emit("NavigationClicked", "Accounts");
    },
    allUsers: function () {
      var allUsers = [];
      allUsers.push({ Name: "Student User1", userid: "1" });
      allUsers.push({ Name: "Student User2", userid: "2" });
      allUsers.push({ Name: "Student User3", userid: "3" });
      allUsers.push({ Name: "Student User4", userid: "4" });
      allUsers.push({ Name: "Student User5", userid: "5" });
      return allUsers;
    },
    clickUser: function (userIndex) {
      this.activeUserIndex = userIndex;
      this.selectedUser = this.allUserslist[this.activeUserIndex].name;
      this.userClasses = [];
    },
    clickClassRoom: function (index) {
      var thisComp = this;
      if (this.userClasses.includes(this.classRooms[index])) return;
      this.userClasses.push(thisComp.classRooms[index]);
      this.currentName = this.classRooms[index].chatroom_name;
      this.currentId = this.classRooms[index].chatroom_id;
    },
    clickdelete: function (index) {
      // var thisComp = this;
      this.userClasses = [];
      // this.userClasses.splice(thisComp.classRooms[index]);
    },
    createNewRoom: function () {
      this.socket.emit("createclassroom", this.newRoomName, this.newRoomName);
      this.newRoomName = "";
    },
    handlesubmit: function (e) {
      console.log("Preventing submission");
      //e.preventDefault();
      this.createNewRoom();
    },
    onClassroomCreated: function (name, classid, chatid) {
      let content = {
        chatroom_id: chatid,
        classroom_id: classid,
        chatroom_type: "primary",
        parent_chatroom_id: null,
        chatroom_name: name,
      };
      this.classRooms.push(content);
    },
    loadColors : function() {
        console.log("loadColors")
        let s = document.getElementById("selectThemeClass")
        let classid = s.value
        let target = this.classRooms.find(function c(e) {return e.classroom_id == classid})
        document.getElementById("foregroundColor").value = target.primary_color
        document.getElementById("backgroundColor").value = target.secondary_color
    },
    applyTheme : function() {
        console.log("applyTheme")
        let s = document.getElementById("selectThemeClass")
        let classid = s.value
        let target = this.classRooms.find(function c(e) {return e.classroom_id == classid})
        target.primary_color = document.getElementById("foregroundColor").value
        target.secondary_color = document.getElementById("backgroundColor").value
        this.setElementColor("class_" + classid, this.primary_color, this.secondary_color)
        window.api_calls.setTheme(classid, this.primary_color, this.secondary_color, null)
    },
    resetTheme : function() {
        this.primary_color = "#048179"
        this.secondary_color = "#023aa1"
    },
    setElementColor(id, fore, back) {
        document.getElementById(id).style.backgroundImage = 'linear-gradient(to right, ' + fore + ', '+back+')'
    }
  },

  createAllMessages: function () {
    var allMessagesObject = [];

    for (
      var index = 0;
      index < this.recievedMessagesCurrentWindow.length;
      index++
    ) {
      var recievedMessage = this.recievedMessagesCurrentWindow[index];
      allMessagesObject.push({
        message: recievedMessage,
        type: "recieved",
        currentMessageId: allMessagesObject.length,
      });

      var sentMessage = this.sentMessagesCurrentWindow[index];
      allMessagesObject.push({
        message: sentMessage,
        type: "sent",
        currentMessageId: allMessagesObject.length,
      });
    }
    return allMessagesObject;
  },

  mounted: function () {
    var thisComp = this;
    window.api_calls.getAllChatRooms().then((response) => {
      console.log(response);
      thisComp.classRooms = response.data.CONTENT.filter(function (m) {
        return !m.parent_chatroom_id;
      });
      thisComp.classRooms.forEach((room) => {
          this.primary_color = this.primary_color || room.primary_color
          this.secondary_color = this.secondary_color || room.secondary_color
        room.chatroom_name =
          room.chatroom_name.charAt(0).toUpperCase() +
          room.chatroom_name.slice(1).toLowerCase();
        window.vue.nextTick( function() {this.setElementColor("class_" + room.classroom_id, room.primary_color, room.secondary_color)}, this)
      });
      thisComp.currentName = thisComp.classRooms.length
        ? thisComp.classRooms[0].chatroom_name
        : "No classrooms found.";
      thisComp.currentId = thisComp.classRooms.length
        ? thisComp.classRooms[0].chatroom_id
        : 0;
    });

    window.api_calls.getAllChatUsers().then((response) => {
      console.log(response);
      thisComp.allUserslist = response.data.USER_LIST;
      thisComp.allUserslist.forEach((user) => {
        user.name =
          user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase();
      });
    });
  },
  data: function () {
    return {
      allUserslist: [],
      classRooms: [],
      activeIndex: 0,
      activeUserIndex: 0,
      classesPerUser: [],
      newRoomName: "",
      userClasses: [],
      selectedUser: "",
      socket: window.socket,
      primary_color: null,
      secondary_color: null
    };
  },
};
</script>