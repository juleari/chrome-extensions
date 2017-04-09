(function(){
    ['events', 'skaters', 'news', 'next'].forEach(name => document.querySelector(`[data-menu-item=${name}]`).innerHTML = chrome.i18n.getMessage(name));

    document.querySelectorAll('.menu__item').forEach(el => el.addEventListener('click', () => {
        chrome.tabs.create({url: 'tab.html'});
    }));
})();
