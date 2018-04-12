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
                i18n[lang][item.data.label] = item.data[lang];
            }
        }
        return {
            language: lang,
            i18n: i18n
        }
    }).then(function(options) {
        Formio.createForm(document.getElementById('formio'), config.project.concat('/', config.formPath), options).then(function(form) {
            document.getElementById('spinner').remove();
            form.language = options.language;
            form.on('submitDone', function(submission) {
                let title = options.i18n.resources[options.language]['Sent!'] || 'Sent!';
                let msg = options.i18n.resources[options.language]['Your submission has been sent!'] || 'Your submission has been sent!';
                let formio = document.getElementById('formio');
                formio.innerHTML = `<div class="alert alert-success"><strong><span class="glyphicon glyphicon-ok-sign"></span> ${title}</strong> ${msg}</div>`;
            });
        });
    }).catch(function(error) {
        console.log('form rendering error: ', error);
    });
    
    console.log(config);
}