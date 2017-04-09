(function(){
    var MENU = ['events', 'skaters', 'news'];
    MENU.forEach(name => $(`.menu__item_${name}`).html(chrome.i18n.getMessage(name)));
})();
