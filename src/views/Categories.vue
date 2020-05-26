<template>
  <v-container fluid>
    <v-card
      v-for="cat in categories"
      :key="cat.id"
      class="ma-3"
      max-width="300"
    >
      <v-card-title>{{ cat.title }}</v-card-title>
      <v-card-text>
        <div v-for="cat2 in cat.children" :key="cat2.id">
          - {{ cat2.title }}
          <div v-for="cat3 in cat2.children" :key="cat3.id">
            - - - {{ cat3.title }}
          </div>
        </div>
      </v-card-text>
    </v-card>
    {{ categories }}
  </v-container>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    categories: gql`query {
      categories {
        id
        title
        children {
          id
          title
          children {
            id
            title
          }
        }
      }
    }`,
  },
}
</script>
