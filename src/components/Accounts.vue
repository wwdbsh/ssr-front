<style scoped src="../css/accounts.css"> </style>

<template>
<div class='dashboard-main'>
<button class='logoutButton' @click="logOutClick()">Log out</button>
<button class='logoutButton' @click="goToDashboard()">Go to Dashboard</button>
    <table class='one-row-dashboard'>
    <h1> Account Settings</h1>
    </table>
</div>
</template>

<script>
export default {
  name: 'Accounts',
  methods: {
      logOutClick: function() {
           this.$emit('LogOutClick');
      },

      goToDashboard: function() {
          this.$emit('GoToDashboard');
      }
  }
}
</script>
