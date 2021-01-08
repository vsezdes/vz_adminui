<template>
 <v-card
    class="box mx-auto"
    outlined
  >
    <div :class="{ headline: true, 'small': !bigTitle }">
      {{ title }}
    </div>
    <v-divider class="mb-3" />
    <div class="content">
      <slot />
    </div>
    <v-divider  />
    <v-card-actions >
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
    bigTitle: {
      type: Boolean,
      default: false,
    }
  }
}
</script>

<style lang="scss">
.box {
  .headline {
    background: #f5f5f5;
    padding: 5px 15px !important;
    font-weight: bold;
    &.small {
      font-size: 14px !important;
      line-height: 18px;
      text-transform: uppercase;
    }
  }
  .content {
    min-height: 180px;
    padding: 3px 15px;
  }
  .v-card__actions {
    background: #FDFDFD;
    min-height: 45px;
  }
}
</style>
