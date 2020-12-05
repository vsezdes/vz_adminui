export var DateFormat= {
  methods: {
    formatDateToString(date){
      if (!date)return ''

      let d = new Date(+date).toLocaleString()
      return d.replace(',','').slice(0,-3) // 07.08.2020 04:30
    }
  }
}
