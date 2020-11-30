<template>
  <div>
    <v-text-field
      clearable
      outlined
      label="Искать"
      prepend-inner-icon="mdi-magnify"
      v-model="search"
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
          <v-list>
            <v-list-item
              :class="{ 'search-category': true, active: i === selectedIndex }"
              v-for="(item, i) in results"
              :key="i"
              @mouseover="onFocus(i)"
            >
              <v-list-item-icon>
                <v-icon v-text="`mdi-${item.icon}`" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-html="highlightSearch(item.title)" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="7">
          <v-sheet
            color="#F6F6F6"
            class="search-products px-3 py-3 ml-n6"
            height="100%"
          >
            <div v-if="searchProducts.length > 0">
              <SearchItem
                v-for="item in searchProducts"
                :item="item"
                :search="search"
                :key="item.id"
                @on-expand="$emit('on-expand', $event)"
              />
            </div>
            <div v-else>Категория пуста</div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
    <v-card
      v-else-if="search && search.length > 2"
      class="search-results">
      <v-card-title>Ничего не найдено</v-card-title>
    </v-card>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapActions } from 'vuex';
import SearchItem from '@/components/SearchItem';
import mixins from '@/mixins';

export default {
  name: 'Search',
  components: {
    SearchItem,
  },
  mixins,
  data() {
    return {
      search: '',
      results: [],
      selectedIndex: 0,
      loading: false,
    };
  },
  computed: {
    searchProducts() {
      if (this.results.length < 1) return [];
      return [...this.results[this.selectedIndex].items];
    },
  },
  watch: {
    search(val) {
      if(val && val.length > 2) {
        this.doSearch(val);
      } else {
        this.results = [];
      }
    }
  },
  methods: {
    ...mapActions(['alert']),
    onFocus(e) {
      this.selectedIndex = e;
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
              price
              images {
                url
              }
            }
          }
        }`),
        variables: {
          search: str,
        }
      }).then(res => {
        this.loading = false;
        console.warn('res', res.data.search);
        this.results = [...res.data.search];
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

.search-category {
  &:hover, &.active {
    background: #F6F6F6 !important;
    cursor: pointer;
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
