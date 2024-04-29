<script setup lang="ts">

</script>

<template>
  
  <div class="header">
    <RouterLink to="/">
      <div class="tasks-icon"></div>
      Задачи
    </RouterLink>
    <RouterLink to="/people">
      <div class="users-icon"></div>
      Пользователи
    </RouterLink>
  </div>
    <RouterView/>
  
</template>

<style scoped>
  .router-link-active{
    background-color: #87BBA2;
  }
  a{
    text-decoration: none;
    color: #FFFFFF;
    font-size: 18px;
    font-weight: 600;
    padding: 20px 100px;
    transition: all 0.3s;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  a:active{
    text-decoration: none;
    color: #FFFFFF;
  }
  a:hover, a:focus{
    text-decoration: none;
    color: #FFFFFF;
    background-color: #87BBA2;
  }
  .header{
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #5D737E;
    height: fit-content;
  }
  .tasks-icon{
    width: 28px;
    height: 28px;
    background-image: url('./assets/task.svg');
    background-repeat: no-repeat;
    background-size: contain;
  }
  .users-icon{
    width: 28px;
    height: 28px;
    background-image: url('./assets/users.svg');
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>
