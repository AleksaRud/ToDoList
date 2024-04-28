<script setup lang="ts">

</script>

<template>
  
  <div class="header">
    <RouterLink to="/">Таски</RouterLink>
    <RouterLink to="/people">Люди</RouterLink>
  </div>
    <RouterView/>
  
</template>

<style scoped>
  .header{
    display: flex;
    flex-direction: row;
    gap: 100px;
    justify-content: center;
  }
</style>
