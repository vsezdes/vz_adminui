<template>
  <div id="app">
    <router-view/>
    <Alert />
  </div>
</template>

<script>
import Alert from "./components/Alert";
export default {
  name:'app',
  components:{
    Alert
  }
}
</script>
