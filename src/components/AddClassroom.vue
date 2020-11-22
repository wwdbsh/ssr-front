<style scoped src="../css/chatroom.css"></style>
<template>
<div class="">
  <!-- Top pane - Title, return button -->
  <div class="card-header">
  <h1 style="display:inline"> Manage Classrooms </h1>
  <button v-on:click="$emit('stop-adding-classrooms')"> Return to Classrooms </button>
  </div>
  <hr>
  <div class="row">
  <!-- Left pane - List current primary chatrooms -->
  <div class="col-xl-6 card chat-windows">
    <h2> Your classrooms </h2>
    <hr>
    <class-entry @press="handlepress" v-for="chatroom in allChatrooms.filter(inFilter)" v-bind:key=chatroom.chatroom_id :entryid=chatroom.chatroom_id :text=chatroom.chatroom_name buttontext="leave"/>
  </div>
  <!-- Right pane - List current primary chatrooms -->
  <div class="col-xl-6 card chat-windows">
    <h2> Search for classrooms </h2>
    <hr>
    <input type="text" v-model="query" placeholder="Filter"/>
    <class-entry @press="handlepress" v-for="chatroom in allChatrooms.filter(searchFilter)" v-bind:key=chatroom.chatroom_id :entryid=chatroom.chatroom_id :text=chatroom.chatroom_name :buttontext="chatroom.chatroom_id in bannedChatroomIds ? 'banned' : 'join'" disabled="chatroom.chatroom_id in bannedChatroomIds"/>
  </div>
  </div>
</div>
</template>
<script>
import vue from 'vue';
import ClassEntry from './ClassEntry.vue';
export default {
  data: function(){
    return {
      force:false,
      currentChatroomIds: {},
      bannedChatroomIds:{},
      allChatrooms: [],
      query: ""
    }
  },
  components: { ClassEntry },
  mounted: function() {
  },
  methods: {
    handlepress: function(f, id) {
      this.force = false;
      if(f == "leave") {
        vue.set(this.currentChatroomIds,id, false)
        window.api_calls.leaveClasses(window.user_id, [id]);
      }else if (f == "join") {
        vue.set(this.currentChatroomIds,id, true)
        window.api_calls.assignClasses(window.user_id, [id]);
      }
    },
    init: function(user_id) {
      this.query = ""
      console.log("LOADING CHAT ROOMS - CLASS LIST")
      let thisp = this
      window.api_calls.getChatroomsByUserId(user_id).then((response) => {
        this.currentChatroomIds = {}
        let chatrooms = response.data.CONTENT
        this.currentChatrooms = chatrooms.filter(function(m) {return !m.parent_chatroom_id});
        this.currentChatrooms.forEach(element => {
          vue.set(this.currentChatroomIds, element.chatroom_id, true)
        });
        console.log(this.currentChatroomIds)
        console.log("CURRENT CHATROOMS", this.currentChatrooms)
      })
      window.api_calls.getAllChatRooms().then(function(response) {
        console.log("RESPONSE2", response)
        let chatrooms = response.data.CONTENT
        thisp.allChatrooms = chatrooms.filter(function(m) {return !m.parent_chatroom_id});
      })
      window.api_calls.getBansByUserId(window.user_id).then(function(response) {
        console.log("RESPONSE3", response)
        let chatrooms = response.data.CONTENT
        chatrooms.forEach(element => {
          vue.set(thisp.bannedChatroomIds, element, true)
        });
      })
    },

    searchFilter: function(element) {
      if(this.force) return true;
      let name = element.chatroom_name.toLowerCase()
      let id = element.chatroom_id
      if(this.currentChatroomIds[id]) return false;
      let q = this.query.toLowerCase() 
      let queries = q.split(" ")
      for(let qi in queries) {
          if(queries[qi].length > 0 && name.search(queries[qi]) == -1)
            return false;
      }
      console.log("FILTERED", element)
      return element;
    },
    inFilter: function(element) {
      return this.currentChatroomIds[element.chatroom_id] == true || this.force;
    }
  }
};
</script>