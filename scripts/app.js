function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getFormConfig() {
    let query = atob(getParameterByName('form'));
    
    return 
}

window.onload = function() {
    let configString = atob(getParameterByName('form'));
    let config = {
        project: getParameterByName('project', configString) || 'https://examples.form.io',
        formPath: getParameterByName('path', configString) || 'example',
        lang: getParameterByName('lang') || 'en'
    }
    
    
    console.log(config);
}