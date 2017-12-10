/*!
 * OffCanvas (https://github.com/deivydasv/offcanvas/)
 * Version: 0.0.1
 * Last update on: 2017-12-10 14:46:37
 * Author: Deivydas Vaseris
 */

var load = function() {
    // manual implentation
    var trigger = document.querySelector('.js-trigger-1');
    var nav = document.querySelector('#nav2');
    plugin = new OffCanvas(nav);
    trigger.addEventListener('click', function(){
        plugin.toggle();
    });
    nav.addEventListener('offcanvas.pre.show', function(){
        trigger.classList.add('is-active');
    });
    nav.addEventListener('offcanvas.pre.hide', function(){
        trigger.classList.remove('is-active');
    });
};
document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', load) : load();