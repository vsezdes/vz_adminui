<template>
 <v-card
    class="mx-auto"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline" v-if="smallTitle">
          {{ title }}
        </div>
        <v-list-item-title v-else class="headline mb-1">
          {{ title }}
        </v-list-item-title>
        <v-divider class="mb-3" />
        <slot />
      </v-list-item-content>
    </v-list-item>
    <v-card-actions>
      <slot name="buttons" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Box',
  props: {
    title: {
      type: String,
      default: 'Default header'
    },
    smallTitle: {
      type: Boolean,
      default: false,
    }
  }
}
</script>
