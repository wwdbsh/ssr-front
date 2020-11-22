<style scoped src="../css/chatroom.css"></style>

<template>
<div class="chat-main">
<div class="container-fluid h-100">
			<div class="row justify-content-center h-100">
				<div class="col-md-3 col-xl-3 chat"><div class="chat-windows card mb-sm-3 mb-md-0 contacts_card">
					<div class="card-header">
						<div class="input-group">
							<input type="text" placeholder="Create Breakout Room" name="" class="form-control plus" v-model="newRoomName">
							<div class="input-group-prepend">
								<span class="input-group-text search_btn" @click="createNewRoom()"><em class="fas fa-plus"></em></span>
							</div>
						</div>
					</div>
					<div class="card-body contacts_body">
						<ul class="contacts">
						<li @click="clickClassRoom(index)"  v-for="(item, index) in classRooms" :key="item.key" class="hover-classroom" :class="{active : activeIndex == index, inactive : activeIndex != index, breakout : item.parent_chatroom_id}">
							<div class="d-flex bd-highlight">
								<div class="user_info">
									<span>{{item.chatroom_name}}</span> <br/>
									<h6 class="class-number">{{item.parent_chatroom_id ? "Breakout Room" : "Primary Chatroom"}}</h6>
								</div>
							</div>
						</li>
						</ul>
					</div>
					<div class="card-footer">

						<div class="input-group">
							<input type="button" value="Manage Classrooms" class="form-control" v-on:click="clickManageClassRoom()">
						</div>
					</div>
				</div></div>
				<div class="col-md-10 col-xl-9 chat">
					<div class="card chat-windows">
						<div class="card-header msg_head">
							<div class="d-flex bd-highlight">
								<div class="user_info">
									<span>{{currentName}}</span> <br/>
									<h5><strong>Class Number:</strong> {{currentId}}</h5>
									<form id="filterForm">
									<label for="attatchmentCheckbox"> <i class="fas fa-paperclip" style="font-size:1.5em;"></i></label>
									<input type="checkbox" id="attatchmentCheckbox" style="margin-right:2em;" v-model="filterAttatchment">
									<select id="selectFilter" v-model="filterTag"> <option value="" selected> No filter </option> <option v-for="tag in tagList" v-bind:key="tag"> {{tag}}</option> </select>
									</form>
									
								</div>
							</div>
							<span id="action_menu_btn"><i @click="logOutClick()" class="fas fa-arrow-alt-circle-left hover-finger"></i></span>
							<button @click="turnOnDashboard()" v-if='this.$cookies.get("is_admin") === "1"' class='input-group-text go_to_admin_btn'>Go to admin page</button>
							<div class="action_menu">
								<ul>
									<li><i class="fas fa-user-circle"></i> View profile</li>
									<li><i class="fas fa-users"></i> Add to close friends</li>
									<li><i class="fas fa-plus"></i> Add to group</li>
									<li><i class="fas fa-ban"></i> Block</li>
								</ul>
							</div>
						</div>
						<div id="message_holder" class="card-body msg_card_body ">
							<div v-for="(item) in filterMessages(filterTag, filterAttatchment)" :key="item.message_id" :class="item.type === 'sent' ? 'justify-content-end': 'justify-content-start'" class="d-flex mb-5">
								<div class="msg_cotainer" style="white-space: pre;">
									<span v-html="boldifyTags(item.message)"> </span>
									<button v-if="item.file_flag === 'true'"><a v-bind:href="item.file_path">DOWNLOAD</a></button>
									<span class="msg_time">{{item.date}}</span>
									<span class="msg_user">Sent By: {{item.username}}</span>
								</div>
							</div>
						</div>
						<div class="card-footer">
							<div class="input-group">
								<div class="input-group-prepend">
									<input type="file" ref="file" style="display:none" name="file" @change="onSelect()"/>
									<span class="input-group-text attach_btn" @click="clickFileBox()"><i class="fas fa-paperclip"></i></span>
								</div>
								<!--
								<div class="input-group-prepend">
									<span class="input-group-text upload_btn" @click="uploadFile()">upload</span>
								</div>
								-->
								<textarea ref="msgContent" class="form-control type_msg" placeholder="Type your message..." v-model="newMessage" @keyup.enter="sendMessageByEnter"></textarea>
								<div class="input-group-append">
									<span class="input-group-text send_btn" @click="sendMessage()"><i class="fas fa-location-arrow"></i></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		
        </div>
        </div>
		
</template>
<script>
import Vue from 'vue'

export default {
  name: 'Chatroom',
  props:['chatroomname'],
  data: function () {
		return {
		classRooms: [],
		activeIndex: 0,
		currentRoom: "",
		recievedMessagesCurrentWindow: [],
		sentMessagesCurrentWindow: [], 
		allMessages:[], 
		currentId: 0, 
		parentId: null,
		currentName: "",
		newRoomName:"",
		file:null,
		autoget: false,
		highestMessageId: 0,
		autoscroll: true,
		socket:window.socket,
		newMessage:"",
		IDX:0,
		formData:null,
		filterTag:"",
		filterAttatchment : false,
		tagList:[],
		searchRoomName:""
	}
  },
  mounted: function() {
	//var data = JSON.stringify({ CHATROOM_ID:1 });
	this.currentName = "";
	this.currentId = -1;
	// this.loadChatRooms();
	// this.clearMessages();
	//this.requestNewMessages(1, 0);
	
  },
  created:function(){
	window.onbeforeunload = () => {
		if(!this.$cookies.isKey("ssr_cookie")){
			this.socket.emit('disconnect');
		}
	}
	this.socket.on('updatechat', (username, email, data, fileFlag) => {
		if(data !== undefined){
			const date = this.getWorldTime(-4);
			Vue.set(this.allMessages, this.IDX, {
				date:date.substring(0, 10) + " - " + date.substring(12, 19),
				message:data,
				tags:this.extractTags(data),
				message_id:this.IDX++,
				username:username,
				file_flag:fileFlag,
				file_path:"#"
			});
			this.tagListDirty = true;
			Vue.nextTick(() => {document.getElementById("message_holder").scrollTop = 1e9;});
		}
	});
	this.socket.on("updatefilechat", (username, email, data, fileFlag, message_id) => {
		let request = null;
		if(username === window.userName){
			this.formData.append("message_id", message_id);
			request = window.api_calls.fileUpload(this.formData);
		}else{
			request = window.api_calls.fileDownload(message_id)
		}
		request.then((res) => {
			console.log(res.data.FILE_PATH);
			const date = this.getWorldTime(-4);
			Vue.set(this.allMessages, this.IDX, {
				date:date.substring(0, 10) + " - " + date.substring(12, 19),
				message:data,
				message_id:this.IDX++,
				username:username,
				file_flag:fileFlag,
				file_path:res.data.FILE_PATH
			})
			Vue.nextTick(() => {document.getElementById("message_holder").scrollTop = 1e9;});
		});
	});
	this.socket.on("senduserid", (user_id) => {
		window.user_id = user_id; //TODO: ugly
		this.loadChatRooms(user_id);
	});
  },
  watch:{
	//   allMessages : function(a, b) {console.log("ALL MESSAGES", a, b)}
  },
  methods: {
	onSelect:function(){
		const file = this.$refs.file.files[0];
		this.file = file;
		this.newMessage = this.file.name;
		console.log(this.file);
	},
	turnOnDashboard:function(){
		this.currentId = "";
		this.currentName = "Select a chatroom to get started";
		this.clearMessages();
		this.$emit('GoToDashboard');
	},
	clickFileBox:function(){
		this.$refs.file.click();
	},
	clickManageClassRoom:function(){
		this.socket.emit("exitroom");
		this.clearMessages();
		this.$emit('manage-classroom-clicked')
	},
	uploadFile: async function(){
		if(this.file !== null){
			this.formData = new FormData();
			this.formData.append("file", this.file);
			this.formData.append("username", window.userName);
			this.socket.emit("sendchat", this.newMessage, "true");
			this.newMessage = "";
			this.file = null;
			this.$refs.file.value = null;
			this.$refs.msgContent.focus();
		}else{
			alert("please choose a file");
		}
	},
	logOutClick: function() {
		this.clearMessages();
        this.$emit('LogOutClick');
    },
	clickClassRoom: function(index) {
		this.activeIndex = index;
		this.currentName = this.classRooms[index].chatroom_name;
		this.currentId = this.classRooms[index].chatroom_id;
		this.parentId = this.classRooms[index].parent_chatroom_id
		this.clearMessages();
		this.autoscroll = true;
		this.requestNewMessages();
		this.socket.emit("switchroom", this.currentId);
		this.filterTag = ""
		document.getElementById("selectFilter").options.selectedIndex = 1
		this.tagListDirty = true;
	},
	clearMessages : function() {
		console.log("clearing messages")
		console.log(this, this.allMessages)
		this.allMessages = {}
		this.highestMessageId = 0
		console.log("mesages cleared")
	},
	requestNewMessages : function() {
		console.log("REQUESTING NEW MESSAGES", window.api_calls)
		const request = window.axios.post(window.api_calls.api_url + window.api_calls.getNewerMessagesEndpoint, {
			"CHATROOM_ID" : this.currentId,
			"MESSAGE_ID" : this.highestMessageId
		});
		request.then(this.handleMessages);
		request.catch(this.handleError); 
	},
	handleMessages : function(response) {
		if(response.data.CHATROOM_ID && response.data.CHATROOM_ID != this.currentId) return;
		console.log("HANDLING MESSAGES")
		console.log(response)
		let content = response.data.CONTENT
		this.tagListDirty = true;
		for(let i in content) {
			let msg = content[i]
			if(msg.message_id > this.highestMessageId) this.highestMessageId = msg.message_id
			//if(this.allMessages[msg.message_id]) continue;	//message already loaded
			let date = new Date(msg.post_time * 1000)
			let iso = date.toISOString()
			msg.date = iso.substring(0, 10) + " - " + iso.substring(12, 19)
			console.log(msg);
			//this.allMessages[msg.message_id] = msg
			Vue.set(this.allMessages, msg.message_id, msg)
			console.log("PUSHING MESSAGE", msg);
			this.IDX = msg.message_id + 1;
		}
		Vue.nextTick(() => {
			document.getElementById("message_holder").scrollTop = document.getElementById("message_holder").scrollHeight
		});
		console.log(this.allMessages);
		console.log("FINISHED HANDLING MESSAGES");
		},
	createNewRoom: function(){
		if(this.newRoomName === ""){
			alert("Please type a room title.");
			return;
		}
		window.api_calls.createBreakout(this.newRoomName, this.parentId || this.currentId, ()=>{
			window.socket.emit("requestsenduserid", window.user_id)
		});
		this.newRoomName = ""
	},
	sendMessageByEnter: function(event) {
		if(event.shiftKey === true && event.key === "Enter") return ;
		if(this.newMessage === "\n"){
			this.newMessage = "";
			return ;
		}
		let text = this.newMessage;
		if(text.charAt(text.length-1) === "\n"){
			this.newMessage = this.newMessage.slice(0, text.length-1);
		}
		if(!this.file)
			this.socket.emit("sendchat", this.newMessage, "false");
		else
			this.uploadFile()
		this.newMessage = ""
		this.$refs.msgContent.focus();
		this.tagListDirty = true;
	},
	sendMessage: function() {
		if(this.newMessage === "\n"){
			this.newMessage = "";
			return ;
		}
		let text = this.newMessage;
		if(text.charAt(text.length-1) === "\n"){
			this.newMessage = this.newMessage.slice(0, text.length-1);
		}
		if(!this.file)
			this.socket.emit("sendchat", this.newMessage, "false");
		else
			this.uploadFile()
		this.newMessage = ""
		this.$refs.msgContent.focus();
		this.tagListDirty = true;
	},
	loadChatRooms: function(user_id) {
		console.log("LOADING CHAT ROOMS")
		var thisComp = this;
		window.api_calls.getChatroomsByUserId(user_id)
		.then((response) => {
			this.classRooms = []
			response.data.CONTENT.forEach((room) => {
					room.key = room.parent_chatroom_id ? room.parent_chatroom_id * 1e6 + room.chatroom_id : room.chatroom_id * 1e6
				});
			response.data.CONTENT.sort((a, b) => {return  a.key - b.key})
			console.log("CONTENT")
			for(let i in response.data.CONTENT) {
				Vue.set(this.classRooms, i, response.data.CONTENT[i])
			}
			this.$data.classRooms = this.classRooms
			thisComp.currentName = "Select a chatroom to get started";//thisComp.classRooms.length ? thisComp.classRooms[0].chatroom_name : "No classrooms found.";
			thisComp.currentId = "";
			// thisComp.currentId = thisComp.classRooms.length ? thisComp.classRooms[0].chatroom_id : 0;
		});
		// window.api_calls.getAllChatRooms()
		// .then((response) => { 
		// 	console.log(response);
		// 	this.classRooms = []
		// 	response.data.CONTENT.forEach((room) => {
		// 			room.key = room.parent_chatroom_id ? room.parent_chatroom_id * 1e6 + room.chatroom_id : room.chatroom_id * 1e6
		// 		});
		// 	response.data.CONTENT.sort((a, b) => {return  a.key - b.key})
		// 	console.log("CONTENT")
		// 	for(let i in response.data.CONTENT) {
		// 		Vue.set(this.classRooms, i, response.data.CONTENT[i])
		// 	}
		// 	this.$data.classRooms = this.classRooms
		// 	thisComp.currentName = thisComp.classRooms.length ? thisComp.classRooms[0].chatroom_name : "No classrooms found.";
		// 	thisComp.currentId = thisComp.classRooms.length ? thisComp.classRooms[0].chatroom_id : 0;
		// });
	},
	getWorldTime: function (tzOffset) {
		const now = new Date();
		const tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (tzOffset * 3600000);
		now.setTime(tz);

		const s =
			this.leadingZeros(now.getFullYear(), 4) + '-' +
			this.leadingZeros(now.getMonth() + 1, 2) + '-' +
			this.leadingZeros(now.getDate(), 2) + ' ' +
			this.leadingZeros(now.getHours(), 2) + ':' +
			this.leadingZeros(now.getMinutes(), 2) + ':' +
			this.leadingZeros(now.getSeconds(), 2);

		return s;
	},
	leadingZeros: function (n, digits) {
		let zero = '';
		n = n.toString();

		if (n.length < digits) {
			for (let i = 0; i < digits - n.length; i++)
			zero += '0';
		}
		return zero + n;
	},
	boldifyTags: function(str) {
		let re = /#[a-zA-Z_]+/g
		return str.replace(re, function(s) {/*console.log("BOLDIFY", s);*/ return '<b>' + s + '</b>'})
	},
	filterMessages : function(filterTag, filterAttatchment) {
		let out = []
		let foundTags = {}
		if(this.tagListDirty)
			this.tagList = []
		for(let i in this.allMessages) {
			let message = this.allMessages[i]
			if(this.tagListDirty) {
				for(let j in message.tags) {
					let tag = message.tags[j]
					if(! (tag in foundTags) ) {
						this.tagList.push(tag)
						foundTags[tag] = true
					}
				}
			}
			let hasFile = Boolean(message.file_flag === "true")
			let tagPass = (!filterTag || message.tags.includes(filterTag.toLowerCase()))
			let attatchPass = (!filterAttatchment || hasFile)
			let bothPass = !(!(tagPass == true) || !(attatchPass == true))
			if(bothPass) {
				out.push(message)
			}
		}
		if(this.tagListDirty) {
			this.tagList.sort()
			this.tagListDirty = false;
		}
		return out;
	},
	extractTags: function(message) {
		let re = /#[a-zA-Z_]+/g
		let matches = message.toLowerCase().match(re)
		if(matches == null) return {}
		return matches.map((s) => s.substring(1));
	}
  }
}
</script>