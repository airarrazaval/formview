console.log('starting')
var app = new Vue({
  el: '#app',
  data () {
    return {
      loading: true,
      showHeader: true,
      project: 'https://examples.form.io',
      formPath: 'example',
      translationsPath: 'translations',
      options: {
        language: 'en',
        i18n: {}
      }
    }
  },
  methods: {
    getParameterByName (name, url) {
      if (!url) {
        url = window.location.href
      }
      name = name.replace(/[\[\]]/g, "\\$&")
      let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
      let results = regex.exec(url)
      if (!results) { 
        return null
      }
      if (!results[2]) {
        return ''
      }
      return decodeURIComponent(results[2].replace(/\+/g, " "))
    },
    createTranslations () {
      let filter = '?limit=1000&select=data.label,data.'.concat(this.options.language)
      let url = this.project.concat('/', this.translationsPath, '/submission')
      return Formio.request(url + filter, 'get').then((items) => {
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          if (item.data.hasOwnProperty(this.options.language)) {
            this.options.i18n[this.options.language][item.data.label] = item.data[this.options.language]
          }
        }
      })
      return this.options
    },
    createForm () {
      return Formio.createForm(this.element, this.project.concat('/', this.formPath), this.options)
    }
  },
  computed: {
    element () {
      return document.getElementById('formio')
    }
  },
  created () {
    let configString = atob(this.getParameterByName('form'))
    this.project = this.getParameterByName('project', configString) || 'https://examples.form.io'
    this.formPath = this.getParameterByName('path', configString) || 'example'
    this.translationsPath = this.getParameterByName('i18n', configString) || 'translations'
    this.options.language = this.getParameterByName('lang') || 'en'
    this.options.i18n[this.options.language] = {}
    this.showHeader = this.getParameterByName('header') ? parseInt(this.getParameterByName('header')) : true
    this.createTranslations().then((options) => {
      this.createForm().then((form) => {
        this.loading = false
        form.language = this.options.language
      })
    })
  }
})