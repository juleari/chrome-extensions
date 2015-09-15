'use strict';
function transit() {
    $('.slides__list').addClass('slides__list_transition');
}

function tabs(evt) {

    $(document).on({
        click: function(){
            var index = $(this).attr('data-index');
            showSlide(index);
        }
    }, 'li[data-index]');

    $(document).on({
        click: function(){
            var index = parseInt($('.tabs__item_active').attr('data-index')),
                direction = /next/.test(this.className) ? 1 : -1;

            showSlide(index + direction);
        }
    }, '.navigation');
    
    showSlide(localStorage['rdial_slide_number'] || 0);
    
    setTimeout(transit, 500);

    /**
     * Sets given slide
     *
     * @param {number} index
     */
    function showSlide (index) {

        var tabs = $('.tabs__item');

        // Unselecting current tab
        $('.tabs__item_active').removeClass('tabs__item_active');

        // Selecting right tab
        tabs.eq(index).addClass('tabs__item_active');

        // Scrolling slides
        $('.slides__list').css('left', - index * 100 + '%');
        
        localStorage['rdial_slide_number'] = index;
        
        $('.navigation_disabled').addClass('navigation');
        $('.navigation_disabled').removeClass('navigation_disabled');
        if (index == 0) {
            $('.navigation_prev').addClass('navigation_disabled');
            $('.navigation_prev').removeClass('navigation');
        }
        if (index == 2) {
            $('.navigation_next').addClass('navigation_disabled');
            $('.navigation_next').removeClass('navigation');
        }

        return index;
    }


    tabs.onKeyup = function(event) {
        console.log(' keyup event.which: ', event.which);
        var index = +document.querySelector('.tabs__item_active').getAttribute('data-index');
        if (37 === event.which) {
            if (index != 0)
                showSlide(index - 1 );        
        } else if (39 === event.which) {
            if (index != 2)
                showSlide(index + 1 )       
        }
    }
    document.addEventListener('keyup', tabs.onKeyup, false);    

};


document.addEventListener('DOMContentLoaded', tabs, false);

var b = document.body;
b.onresize = function(){ 
    $('.cell').css('height', $('.slides__inner').css('height'));
    
    var w = parseInt($('body').css('width')) - 80;
    $('iframe[data-topic]').css('width', w + 'px');
}
console.log(b.onresize);