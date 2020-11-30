const mixins = {
  methods: {
    highlightSearch(str) {
      if (!this.search || this.search === ' ') return str;
      const reg = new RegExp(this.search, 'gi');
      return str.replace(reg, function(str) {
        return '<strong>'+str+'</strong>'
      });
    },
  }
}

export default [mixins];
