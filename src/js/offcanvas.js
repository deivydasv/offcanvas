"use strict";

var OffCanvas = (function() {
    
    // private properties
    
    var Classes = {
        BASE: 'js-offcanvas',
        OVERLAY: 'js-offcanvas-overlay',
        TRANSITIONING: 'is-transitioning',
        VISIBLE: 'is-visible',
        TARGET_VISIBLE: 'is-active',
        RIGHT_SIDE: 'is-right',
    };

    var VerticalScrollTolerance = 80; // cancel swiping if swiped verticaly more
    var HorizontalScrollTolerance = 60; // hide() if swiped more

    // hide() if swiped more than HorizontalScrollToleranceQuick and faster than HorizontalScrollToleranceQuickTime
    var HorizontalScrollToleranceQuick = 30;
    var HorizontalScrollToleranceQuickTime = 200; //ms
    
    // constructor
    
    var OffCanvas = function(element) {
        var self = this;
        
        self.element = getElement( element );
 
        if (!self.element) {
            throw new Error('Element not specified');
        }

        if (self.element.OffCanvas) {
            return self.element.OffCanvas;
        }

        self.element.classList.add( Classes.BASE );
        self.body = document.body;


        // search for existing overlay
        var childs = Array.prototype.slice.call(self.body.children);
        childs.forEach(function(child){
            if (child.classList.contains( Classes.OVERLAY )) {
                self.overlay = child;
            }
        });
        if (!self.overlay) {
            // create overlay element
            self.overlay = document.createElement('div');
            self.overlay.classList.add( Classes.OVERLAY );
            self.body.appendChild(self.overlay);
        }
        
        self.on = function(event) {
            on(event, self);
        };

        if (self.isVisible()) {
            bindEvents(self);
        }

        self.element.OffCanvas = self;
    }
    

    // public methods

    OffCanvas.prototype.show = function(force) {
        var self = this;
        var el = self.element;
        var body = self.body;

        if (self.isVisible() || self.isTransitioning()) {
            return;
        }

        // check for other offcanvas'es
        var other = self.body.querySelectorAll( '.' + Classes.BASE );
        Array.prototype.slice.call(other).forEach(function(element){
            if (element != el) {
                var offcanvas = element.OffCanvas || new OffCanvas(element);
                // stop if other is transitioning
                if (offcanvas.isTransitioning()) {
                    return;
                }
                // hide other if it is visible
                else if (offcanvas.isVisible()) {
                    offcanvas.hide(force);
                }
            }
        });

        dispatchEvent(el, 'pre.show');
        triggerCheck(self, true);

        el.scrollTop = 0;
        fixScrollBar(body, true);
        
        if (force) {
            el.classList.add( Classes.VISIBLE );
            bindEvents(self)
            dispatchEvent(el, 'show');
            return;
        }

        var afterTransition = function() {
            removeTransitionEndListener(el, afterTransition);
            el.classList.remove( Classes.TRANSITIONING );
            bindEvents(self);
            dispatchEvent(el, 'show');
        };

        addTransitionEndListener(el, afterTransition);
        el.classList.add( Classes.TRANSITIONING );
        el.classList.add( Classes.VISIBLE );
    };

    OffCanvas.prototype.hide = function(force) {
        var self = this;
        var el = self.element;
        var body = self.body;

        if (!self.isVisible() || self.isTransitioning()) {
            return;
        } 

        triggerCheck(self, false);
        dispatchEvent(el, 'pre.hide');

        unbindEvents(self);

        if (force) {
            el.classList.remove( Classes.VISIBLE );
            fixScrollBar(body, false);
            dispatchEvent(el, 'hide');
            return;
        }

        var afterTransition = function() {
            removeTransitionEndListener(el, afterTransition);
            el.classList.remove( Classes.TRANSITIONING );
            fixScrollBar(body, false);
            dispatchEvent(el, 'hide');
        };

        addTransitionEndListener(el, afterTransition);
        el.classList.add( Classes.TRANSITIONING );
        el.classList.remove( Classes.VISIBLE );
    };

    OffCanvas.prototype.toggle = function(force) {
        var self = this;
        if (self.isVisible()) {
            self.hide(force);
        } 
        else {
            self.show(force);   
        }
    };

    OffCanvas.prototype.isVisible = function() {
        var self = this;
        return self.element.classList.contains( Classes.VISIBLE );
    };

    OffCanvas.prototype.isTransitioning = function() {
        var self = this;
        return self.element.classList.contains( Classes.TRANSITIONING );
    };

    OffCanvas.prototype.isOnLeftSide = function() {
        var self = this;
        return !self.element.classList.contains( Classes.RIGHT_SIDE );
    };

    // private methods

    // find trigger to add/remove class
    function triggerCheck(self, show) {
        var triggers = document.body.querySelectorAll('[data-offcanvas]');
        
        Array.prototype.slice.call(triggers).forEach(function(trigger) {
            var datatarget;
            if (trigger.dataset.offcanvasTarget !== undefined) {
                datatarget = trigger.dataset.offcanvasTarget;
            }
            else if (trigger.hasAttribute('href')) {
                datatarget = trigger.getAttribute('href');
            }

            var target = datatarget ? document.body.querySelector(datatarget) : null;
             
            if (target) {
                if (target.isSameNode(self.element)) {
                    if (show)
                        trigger.classList.add( Classes.TARGET_VISIBLE );
                    else {
                        trigger.classList.remove( Classes.TARGET_VISIBLE);
                    }
                }
            }
        });
    }


    // bind event listeners
    function bindEvents(self) {
        self.overlay.addEventListener('click', self.on);
        self.body.addEventListener('touchstart', self.on);
        self.body.addEventListener('touchmove', self.on);
        self.body.addEventListener('touchend', self.on);
        self.body.addEventListener('touchcancel', self.on);
    }
    
    // unbind event listeners
    function unbindEvents(self) {
        self.overlay.removeEventListener('click', self.on);
        self.body.removeEventListener('touchstart', self.on);
        self.body.removeEventListener('touchmove', self.on);
        self.body.removeEventListener('touchend', self.on);
        self.body.removeEventListener('touchcancel', self.on);
    }
    
    // switch events
    function on(event, self) {
        switch(event.type) {
            case 'click': 
                onClick(event, self);
                break;
            case 'touchstart': 
                onTouchStart(event, self);
                break;
            case 'touchmove': 
                onTouchMove(event, self);
                break;
            case 'touchend': 
                onTouchEnd(event, self);
                break;
            case 'touchcancel': 
                onTouchCancel(event, self);
                break;
        }
    }
    
    function onClick(event, self) {
        self.hide();
    }

    function onTouchStart(event, self) {
        if (typeof event.touches === 'undefined') {
            return;
        }
        self._touch = true;
        self._startTime = new Date();
        self._startX = self._currentX = event.touches[0].pageX;
        self._scrollTop = self.element.scrollTop;
    }
    
    function onTouchMove(event, self) {
        if (!self._touch) {
            return;
        }
        self._currentX = event.touches[0].pageX;
        var diff = self._currentX - self._startX;

        // stop if scrolling vertically
        if (Math.abs(self._scrollTop - self.element.scrollTop) > VerticalScrollTolerance) {
            self._touch = false;
            self.element.style.transform = self.element.style.WebkitTransform = null;
            return;
        }
        
        // stop if scrolling to wrong side
        if ((diff > 0 && self.isOnLeftSide()) || (diff < 0 && !self.isOnLeftSide())) {
            self.element.style.transform = self.element.style.WebkitTransform = null;
            self._currentX = self._startX;
            return;
        }

        self.element.style.transform = self.element.style.WebkitTransform = 'translateX(' + diff + 'px)';
    }
    
    function onTouchEnd(event, self) {
        if (!self._touch) {
            return;
        }
        var el = self.element;
        var body = self.body;
        
        self._touch = false;
        var diff = self._currentX - self._startX;
        var time = new Date() - self._startTime;
        var w = el.offsetWidth;

        // hide() - if move distance more than 60, or more than 30 and slide time less than 200ms
        if (Math.abs(diff) > HorizontalScrollTolerance || (Math.abs(diff) > HorizontalScrollToleranceQuick && time < HorizontalScrollToleranceQuickTime)) {

            triggerCheck(self, false);
            dispatchEvent(el, 'pre.hide');

            unbindEvents(self);
            
            var afterTransition = function() {
                removeTransitionEndListener(el, afterTransition);
                el.classList.remove( Classes.TRANSITIONING );
                el.style.transition = null;
                el.style.transform = null;
                fixScrollBar(body, false);
                dispatchEvent(el, 'hide');
            };

            addTransitionEndListener(el, afterTransition);
            el.style.transition = el.style.Webtransition = '-webkit-transform .3s ease-out, transform .3s ease-out';
            el.style.transform = el.style.WebkitTransform = null;
            el.classList.add( Classes.TRANSITIONING );
            el.classList.remove( Classes.VISIBLE );
        }
        else {
            el.style.transform = el.style.WebkitTransform = null;
        }
    }

    function onTouchCancel(event, self) {
        if (!self._touch) {
            return;
        }
        self._touch = false;
        self.element.style.transform = self.element.style.WebkitTransform = null;
    }

    function getTransitionEnd() {
        return 'transition' in document.documentElement.style ? 'transitionend' : 
        'WebkitTransition' in document.documentElement.style ? 'webkitTransitionEnd' : null;
    }

    function dispatchEvent(element, name) {
        var event;
        try {
            event = new Event('offcanvas.' + name);
        }
        catch (error) {
            event = document.createEvent('Event');
            event.initEvent('offcanvas.' + name, false, false);
        }
        element.dispatchEvent(event);
    }

    function addTransitionEndListener(element, callback) {
        var transitionEnd = getTransitionEnd();

        // no transition support
        if (!transitionEnd) {
            callback();
            return;
        }

        element.addEventListener(transitionEnd, callback);
    }

    function removeTransitionEndListener(element, callback) {
        var transitionEnd = getTransitionEnd();

        // no transition support
        if (!transitionEnd) {
            return;
        }

        element.removeEventListener(transitionEnd, callback);
    }

    // removes scrollbar and keeps width
    function fixScrollBar(element, hide) {
        if (hide) {
            var w = element.offsetWidth;
            element._backupOfpaddingRight = element.style.paddingRight;
            element._backupOfoverflowX = element.style.overflowX;
            element.style.overflowY = 'hidden';
            // add padding to compensate scrollbar
            element.style.paddingRight = parseFloat(getComputedStyle(element).paddingRight) + 
                (element.offsetWidth - w) + 'px';
        }
        else {
            // bring everything back
            element.style.paddingRight = element._backupOfpaddingRight;
            element.style.overflowY = element._backupOfoverflowX;
        }
    }

    function getElement(value) {
        if (value instanceof HTMLElement) {
            return value;
        }
        else if (typeof value == 'string') {
            return document.querySelector(value);
        }
        else {
            return null;
        }
    }

    // init
    (function(){
        document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

        function init() {
            // check all triggers to add class and init plugin
            checkTriggers();

            // attach trigger click events
            addEventClick();
        }
        
        function checkTriggers() {
            var triggers = document.body.querySelectorAll('[data-offcanvas]');
            
            Array.prototype.slice.call(triggers).forEach(function(trigger) {
                var datatarget;
                if (trigger.dataset.offcanvasTarget !== undefined) {
                    datatarget = trigger.dataset.offcanvasTarget;
                }
                else if (trigger.hasAttribute('href')) {
                    datatarget = trigger.getAttribute('href');
                }

                var target = datatarget ? document.body.querySelector(datatarget) : null;

                if (target) {
                    var offcanvas = target.OffCanvas || new OffCanvas(target);
                    if (offcanvas.isVisible())
                        trigger.classList.add( Classes.TARGET_VISIBLE );
                    else {
                        trigger.classList.remove( Classes.TARGET_VISIBLE );
                    }
                }
            });
        }

        function addEventClick() {
            document.body.addEventListener('click', function(event) {
                var trigger;
                for(var element = event.target; element != document.body; element = element.parentElement) {
                    if (element.dataset.offcanvas !== undefined) {
                        trigger = element;
                        break;
                    }
                }
                if (!trigger) 
                    return;

                event.preventDefault();
                triggerClick(trigger);
            });

            function triggerClick(trigger) {
                var datatarget;
                if (trigger.dataset.offcanvasTarget !== undefined) {
                    datatarget = trigger.dataset.offcanvasTarget;
                }
                else if (trigger.hasAttribute('href')) {
                    datatarget = trigger.getAttribute('href');
                }
    
                if (!datatarget)
                    return;

                var target = document.body.querySelector(datatarget);
                if (!target)
                    return;
                    
                var action = (trigger.dataset.offcanvas.match(/(show|hide)/gi) || ['toggle'])[0].toLowerCase();
                var force = trigger.dataset.offcanvasForce === "" || /^(1|true|yes)$/gi.test(trigger.dataset.offcanvasForce) ? true : false;
                var offcanvas = target.OffCanvas || new OffCanvas(target);
                offcanvas[action](force); 
            }
        }
    })();

    return OffCanvas;
})();