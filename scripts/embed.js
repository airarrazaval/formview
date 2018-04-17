const scripts = document.getElementsByTagName('script');
const thisScript = scripts[ scripts.length - 1 ];
const project = thisScript.getAttribute('project') || 'examples';
const formPath = thisScript.getAttribute('path') || 'example';
const langs = thisScript.getAttribute('langs') ? thisScript.getAttribute('langs').split(',') : ['en'];
const defaultLanguage = langs[0];
const url = `https://${project}.form.io/${formPath}`;
console.log(url);
let head = document.getElementsByTagName('head')[0];
let formiojs = document.createElement('script');
formiojs.src = 'https://unpkg.com/formiojs@latest/dist/formio.full.min.js';
formiojs.type = 'text/javascript';
let formiocss = document.createElement('link');
formiocss.href = 'https://unpkg.com/formiojs@latest/dist/formio.full.min.css';
formiocss.rel = 'stylesheet';
head.appendChild(formiocss);
head.appendChild(formiojs);


let id = `formio-${Math.random().toString(36).substring(7)}`;
let code = `<div id="${id}"></div>`;
document.write(code);

window.onload = function () {
    let el = document.getElementById(id);
    Formio.createForm(el, url);
}

