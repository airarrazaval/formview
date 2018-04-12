function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getFormConfig() {
    let configString = atob(getParameterByName('form'));
    return {
        project: getParameterByName('project', configString) || 'https://examples.form.io',
        formPath: getParameterByName('path', configString) || 'example',
        translations: {
            language: getParameterByName('lang') || 'en',
            path: getParameterByName('i18n', configString) || 'translations'
        }
    }
}

window.onload = function() {
    let config = getFormConfig();
    
    let translationsUrl = config.project.concat('/', config.translations.path, '/submission');
    let filter = '?limit=1000&select=data.label,data.' + config.translations.language;
    
    Formio.request(translationsUrl + filter, 'get').then(function(items) {
        let lang = config.translations.language;
        let i18n = {};
        i18n[lang] = {}
        for(let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.data.hasOwnProperty(lang)) {
                console.log(item.data.label, item.data[lang]);
                config.translations.i18n[lang][item.data.label] = item.data[lang];
            }
        }
        return {
            language: lang,
            i18n: i18n
        }
    }).then(function(options) {
        console.log(options);
        Formio.createForm(document.getElementById('formio'), config.project.concat('/', config.formPath), options).then(function(form) {
            form.language = options.language;
        })
    }).catch(function(error) {
        console.log('form rendering error: ', error);
    });
    
    console.log(config);
}