<template>
<div style="background: rgba(1,1,1,.25);">
    <table width=80% style="margin-left:auto; margin-right:auto">
        <tr width="100%">
            <td width="100%" style="text-align:left; font-size:24px" > {{this.text}}</td>
            <td> <button v-on:click="$emit('press', buttontext, entryid)"> {{this.buttontext}} </button> </td>
        </tr>
    </table> 
</div>
</template>
<script>
import vue from 'vue'
export default {
    props:["entryid", "text", "buttontext"]
};
</script>