<template>
  <div>
    <v-text-field
      clearable
      outlined
      label="Искать"
      prepend-inner-icon="mdi-magnify"
      @input="onChange"
      :loading="loading"
      loader-height="3"
      class="search-field mb-0"
    />
    <v-card
      v-if="results.length > 0"
      tile
      class="search-results"
    >
      <v-row>
        <v-col cols="5">
          <v-list dense>
            <v-list-item
              link
              v-for="(item, i) in results"
              :key="i"
              @focus="onFocus"
            >
              <v-list-item-icon>
                <v-icon v-text="`mdi-${item.icon}`" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="7">
          <v-sheet
            color="secondary"
            class="float-right search-products"
          >
            {{ searchProducts }}
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapActions } from 'vuex';

export default {
  name: 'Search',
  data() {
    return {
      results: [],
      loading: false,
    };
  },
  computed: {
    searchProducts() {
      return [];
    },
  },
  methods: {
    ...mapActions(['alert']),
    onChange(str) {
      if(str && str.length > 2) {
        this.doSearch(str);
      } else {
        this.results = [];
      }
    },
    onFocus(e) {
      console.error(e);
    },
    doSearch(str) {
      this.loading = true;
      this.$apollo.query({
        query: gql(`query search($search: String!) {
          search(search: $search) {
            id
            title
            icon
            items {
              id
              title
            }
          }
        }`),
        variables: {
          search: str,
        }
      }).then(res => {
        this.loading = false;
        console.warn('res', res.data.search);
        this.results = res.data.search;
      }).catch(err => {
        this.loading = false;
        console.error('error', err);
        this.alert({
          type: 'error',
          message: err,
        });
      })
    }
  }
}
</script>

<style lang="scss">
.search-field {
  background: #FFF;
  max-width: 1200px !important;
  margin: 0 auto !important;
  .v-input__slot {
    margin: 0;
  }
  .v-text-field__details {
    display: none;
  }
}
.search-results {
  max-width: 1200px !important;
  margin: 0 auto !important;
}
.search-products {
  width: 100%;
  margin-left: -40px;
}
</style>
