// Get form configuration
const scripts = document.getElementsByTagName('script');
const thisScript = scripts[ scripts.length - 1 ];
const form = thisScript.getAttribute('form') || 'https://examples.form.io/example';
const lang = thisScript.getAttribute('lang') ? thisScript.getAttribute('lang').split(',') : ['en'];
const defaultLanguage = lang[0];
// const multilang = thisScript.getAttribute('multilang') || false;

// Add Form.io dependancies
let head = document.getElementsByTagName('head')[0];
let formiojs = document.createElement('script');
formiojs.src = 'https://unpkg.com/formiojs@latest/dist/formio.full.min.js';
formiojs.type = 'text/javascript';
let formiocss = document.createElement('link');
formiocss.href = 'https://unpkg.com/formiojs@latest/dist/formio.full.min.css';
formiocss.rel = 'stylesheet';
head.appendChild(formiocss);
head.appendChild(formiojs);

// Build Form.io DOM element
let id = `formio-${Math.random().toString(36).substring(7)}`;
let code = `<div id="${id}"></div>`;
/*
if (multilang) {
    code = '<div id="formio-lang-btns" class="btn-group"></div>' + code;
}
*/
document.write(code);

// Render form on load
window.onload = function () {
    window.getLanguageName = function(lang) {
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
    };
    // Create formio instance
    let el = document.getElementById(id);
    let formio = new Formio(form);
    let options = {
        language: defaultLanguage,
        i18n: {}
    }
    let translationsUrl = formio.projectUrl.concat('/translations/submission?limit=1000&select=data.label');
    for (let i = 0; i < lang.length; i++) {
        options.i18n[lang[i]] = {};
        translationsUrl += ',data.' + lang[i]
    }
    Formio.request(translationsUrl, 'get').then(function(submissions) {
        for (let i = 0; i < submissions.length; i++) {
            for (let j = 0; j < lang.length; j++) {
                if (submissions[i].data.hasOwnProperty(lang[j])) {
                    options.i18n[lang[j]][submissions[i].data.label] = submissions[i].data[lang[j]];
                }
            }
        }
        Formio.createForm(el, formio.formUrl, options).then(function(form) {
            /*
            if (multilang) {
                let btns = document.getElementById('formio-lang-btns');
                if (lang.length > 1) {
                    for (let i = 0; i < lang.length; i++) {
                        let btn = document.createElement('button');
                        btn.className = 'btn btn-default';
                        btn.addEventListener('click', function() {
                            form.language = lang[i];
                        });
                        btn.innerText = getLanguageName(lang[i]);
                        btns.appendChild(btn);
                    }
                }
            }
            */
            form.language = defaultLanguage;
        });
    });
    thisScript.remove();
}

