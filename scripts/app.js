console.log('starting')
var app = new Vue({
  el: '#app',
  data () {
    return {
      form: null,
      loading: true,
      showHeader: true,
      project: 'https://examples.form.io',
      formPath: 'example',
      translationsPath: 'translations',
      languages: ['en'],
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
    addResponsiveWrapper (element) {
      let wrapper = document.createElement('div')
      let parent = element.parentElement
      let sibling = element.nextSibling
      if (element && element.localName === 'table') {
        wrapper.className = 'table-responsive'
      }
      wrapper.appendChild(element)
      if (sibling) {
        parent.insertBefore(wrapper, sibling)
      } else {
        parent.appendChild(wrapper)
      }
    },
    createTranslations () {
      let filter = '?limit=1000&select=data.label,data.' + this.languages.join(',data.')
      console.log(filter)
      let url = this.project.concat('/', this.translationsPath, '/submission')
      return Formio.request(url + filter, 'get').then((items) => {
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          for (let j = 0; j < this.languages.length; j++) {
              let lang = this.languages[j]
              if (item.data.hasOwnProperty(lang)) {
                this.options.i18n[lang][item.data.label] = item.data[lang]
              }
          }
          
        }
      })
      return this.options
    },
    createForm () {
      return Formio.createForm(this.element, this.project.concat('/', this.formPath), this.options)
    },
    setLanguage (lang) {
        console.log('setting language: ', lang)
        this.form.language = lang
    },
    getLanguageName (lang) {
        console.log(lang)
        switch (lang) {
            case 'en': return 'English'
            case 'es': return 'Español'
            case 'fr': return 'Français'
            case 'ru': return 'Русский'
            case 'zh': return '中文'
            case 'ar': return 'عربى'
            default: return 'Unknown'
        }
    }
  },
  computed: {
    element () {
      return document.getElementById('formio')
    }
  },
  created () {
    let configString = atob(this.getParameterByName('form'))
    this.project = this.getParameterByName('project', configString) || this.project
    this.formPath = this.getParameterByName('path', configString) || this.formPath
    this.translationsPath = this.getParameterByName('i18n', configString) || this.translationsPath
    this.languages = this.getParameterByName('lang') ? this.getParameterByName('lang').split(',') : this.languages
    this.options.language = this.languages[0]
    for (let i in this.languages) {
        this.options.i18n[this.languages[i]] = {}
    }
    this.showHeader = this.getParameterByName('header') ? parseInt(this.getParameterByName('header')) : true
    this.createTranslations().then((options) => {
      this.createForm().then((form) => {
        this.loading = false
        this.form = form
        this.setLanguage(this.options.language)
        let tables = document.getElementsByTagName('table')
        for (let i =0; i < tables.length; i++) {
          let table = tables[i]
          console.log(table)
          this.addResponsiveWrapper(table)
        }
          
      })
    })
  }
})