function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        console.log(results);
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
    
    console.log('getting translations...');
    Formio.request(translationsUrl + filter, 'get').then(function(items) {
        console.log('tarnslations received! total labels: ', items.length);
        let lang = config.translations.language;
        let i18n = {};
        i18n[lang] = {}
        for(let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.hasOwnProperty(lang)) {
                config.translations.i18n[lang] = item[lang];
            }
        }
        console.log(i18n);
        return {
            language: lang,
            i18n: i18n
        }
    }).then(function(options) {
        console.log('getting form...', options);
        Formio.createForm(document.getElementById('formio'), config.project.concat('/', config.formPath), options).then(function(form) {
            console.log('form received!')
            form.language = options.language;
            console.log('form language set: ', options.language);
        })
    }).catch(function(error) {
        console.log('form rendering error: ', error);
    });
    
    console.log(config);
}