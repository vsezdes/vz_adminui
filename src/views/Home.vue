<template>
  <BaseTemplate>
    <div class="home">
      <img alt="Vue logo" src="../assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
  </BaseTemplate>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import BaseTemplate from '@/components/BaseTemplate.vue';
export default {
  name: 'Home',
  components: {
    BaseTemplate,
    HelloWorld
  }
}
</script>
