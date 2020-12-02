const mixins = {
  methods: {
    highlightSearch(str) {
      if (!this.search || this.search === ' ') return str;
      const reg = new RegExp(this.search, 'gi');
      return str.replace(reg, function(str) {
        return '<strong>'+str+'</strong>'
      });
    },
    gotoCategory(id) {
      this.$router.push({
        name: 'CategoryItems',
        params: { categoryId: id },
      })
    }
  }
}

export default [mixins];
