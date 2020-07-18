<template>
  <BaseTemplate>
    <v-card
        class="mx-auto text-center"
        max-width="850"
        style="padding-top: 65px"
    >
<!--      <IconPageNotFound></IconageNotFound>-->
      <v-card-subtitle class="pb-0">
        <h1 style="color: red;margin-bottom: -100px">404</h1>
        <div class="" style="height: 400px;width:800px;background-position:center;;background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);"></div>

      </v-card-subtitle>

      <v-card-text class="text--primary">
        <div>Извините, запрашиваемая страница не найдена</div>
      </v-card-text>

      <v-card-actions>
        <router-link to="/">
        <v-btn
            color="orange"
            text
        >
          на главную
        </v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </BaseTemplate>
</template>

<script>
import BaseTemplate from "@/views/BaseTemplate";
// import IconPageNotFound from "@/components/IconPageNotFound";
export default {
name: "404",
  components: {
  // IconPageNotFound,
    BaseTemplate}
}
</script>

<style scoped>

</style>