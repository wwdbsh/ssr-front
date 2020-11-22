<style scoped src="../css/permissions.css"> </style>

<template>
<div class='dashboard-main'>
<button class='logoutButton' @click="logOutClick()">Log out</button>
<button class='logoutButton' @click="goToDashboard()">Go to Dashboard</button>
    <table class='one-row-dashboard'>
    <h1> User Permissions </h1>
    </table>
</div>
</template>

<script>
export default {
  name: 'Permissions',
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
