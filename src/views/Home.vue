<template>
  <BaseTemplate>
    <div class="home">
      <img alt="Vue logo" src="../assets/logo.svg">
      Homepage will be here
    </div>
  </BaseTemplate>
</template>

<script>
// @ is an alias to /src
import BaseTemplate from '@/views/BaseTemplate.vue';
export default {
  name: 'Home',
  components: {
    BaseTemplate,
  }
}
</script>
