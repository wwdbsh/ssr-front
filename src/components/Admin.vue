<style scoped src="../css/admin.css"> </style>

<template>

<div class='dashboard-main'>


<div class="row">
  <div class="column1">
     <div>
         <h1> users 1 </h1>
         <ul>
             <li v-for="(item) in allUserslist" :key="item.userId">
                 <p>{{item.Name}}</p>
                <p> {{item.userid}}</p>
            </li>
        </ul>
    </div>
  </div>
</div>
      
  <div class="column2"></div>


</div>

</template>

<script>
export default {
  name: 'Admin',
  methods: {
      logOutClick: function() {
           this.$emit('LogOutClick');
      },

      goToDashboard: function() {
          this.$emit('GoToDashboard');
      },

      allUsers: function() {
          var allUsers = [];
          allUsers.push({Name:"User1" , userid: "1"});
          allUsers.push({Name:"User2" , userid: "2"});
          return allUsers;
      }
  },
  mounted: function() {
      this.allUserslist = this.allUsers();

  },
  data: function() {
      return{

      
      allUserslist:[]
      }
  }
}
</script>

