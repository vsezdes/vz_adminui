<template>
  <BaseTemplate>
    <v-card
      class="mx-auto text-center"
      max-width="90vw"
      max-height="50vt"
      style="overflow: hidden"

    >
      <v-card-text
      >
        <h1  class="fourzerofour" style="font-size: 10vw;margin-top:40px;color: red;position: absolute;z-index: 1" >404</h1>
        <v-img style="width:100%;position: relative"
                      src="../assets/404image.gif"/>

        <div style="position: relative;">Извините, запрашиваемая страница не найдена</div>
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
  name: "PageNotFound",
  components: {
    // IconPageNotFound,
    BaseTemplate
  }
}
</script>