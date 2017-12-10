var expect = chai.expect;
var nav1 = document.getElementById('nav1');
var nav2 = document.getElementById('nav2');    
var trigger1 = document.getElementById('trigger1');
var trigger2 = document.getElementById('trigger2');   
var click = document.createEvent('Events');
var transitionDuration;
var nav1transitionendCallback = function(){};
var nav2transitionendCallback = function(){};
var Classes = {
    BASE: 'js-offcanvas',
    OVERLAY: 'js-offcanvas-overlay',
    TRANSITIONING: 'is-transitioning',
    VISIBLE: 'is-visible',
    TARGET_VISIBLE: 'is-active',
    RIGHT_SIDE: 'is-right',
};

describe('OffCanvas', function(){
    before(function(){
        click.initEvent('click', true, true);
        // var el = document.createElement('div');
        // el.classList.add(Classes.BASE, Classes.TRANSITIONING);
        // document.body.appendChild(el);
        // var style = getComputedStyle(el);
        // var duration = style.transitionDuration || style.webkitTransitionDuration;
        // transitionDuration = parseFloat(duration);
        // if (/[^m]s/i.test(duration)) {
        //     transitionDuration *= 2000;
        // }
        nav1.addEventListener('transitionend', function(){
            nav1transitionendCallback();
        });
        nav2.addEventListener('transitionend', function(){
            nav2transitionendCallback();
        });
    });
    it('should exist', function(){
      expect(OffCanvas).to.be.not.undefined;
      expect(OffCanvas).to.be.a('function');
    });

    it('should throw error when element not specified', function(){
      expect(function() { 
          new OffCanvas() 
        }).to.throw(Error);

      expect(function() { 
        new OffCanvas('.not-existing-element') 
      }).to.throw();
    });

    it('should create instance', function(){
      var plugin = new OffCanvas('#nav2');
      expect(plugin).to.be.an.instanceof(OffCanvas);

      var plugin2 = new OffCanvas( document.getElementById('nav2') );
      expect(plugin2).to.be.an.instanceof(OffCanvas);

      // from triggers
      expect(nav1.OffCanvas).to.be.an.instanceof(OffCanvas);
    });

    it('should avoid duplicate instance', function(){
      var plugin2 = new OffCanvas( document.getElementById('nav2') );
      expect(nav2.OffCanvas).to.be.equal(plugin2);
    });

    it('should add classes to elements', function(){
        expect(Array.from(nav1.classList)).to.include( Classes.BASE );
        expect(Array.from(nav2.classList)).to.include( Classes.BASE );
    });

    it('should create overlay', function(){
        var overlay = document.querySelector( '.' + Classes.OVERLAY );
        expect(overlay).to.be.instanceof(HTMLElement);
    });

    it('should not duplicate overlay', function(){
        var overlays = document.querySelectorAll( '.' + Classes.OVERLAY );
        expect(overlays).to.have.lengthOf(1);
    });

    it('should show if is opened', function(){
        expect(nav1.OffCanvas.isVisible()).to.be.true;
        expect(Array.from(nav1.classList)).to.include( Classes.VISIBLE );
        expect(nav2.OffCanvas.isVisible()).to.be.false;
        expect(Array.from(nav2.classList)).to.not.include( Classes.VISIBLE );
    });

    it('should add class to trigger if opened', function(){
        expect(Array.from(trigger1.classList)).to.include( Classes.TARGET_VISIBLE );
        expect(Array.from(trigger2.classList)).to.not.include( Classes.TARGET_VISIBLE );
    });

    it('should show if is on left sided', function(){
        expect(nav1.OffCanvas.isOnLeftSide()).to.be.false;
        expect(nav2.OffCanvas.isOnLeftSide()).to.be.true;
    }); 

    it('should force show/hide', function(){
        if (nav1.OffCanvas.isVisible()) {
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
            
            nav1.OffCanvas.show(true);
            expect(nav1.OffCanvas.isVisible()).to.be.true;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
        }
        else {
            nav1.OffCanvas.show(true);
            expect(nav1.OffCanvas.isVisible()).to.be.true;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
            
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
        }
    });

    it('should force toggle', function(){
        if (nav1.OffCanvas.isVisible()) {
            nav1.OffCanvas.toggle(true);
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
            
            nav1.OffCanvas.toggle(true);
            expect(nav1.OffCanvas.isVisible()).to.be.true;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
        }
        else {
            nav1.OffCanvas.toggle(true);
            expect(nav1.OffCanvas.isVisible()).to.be.true;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
            
            nav1.OffCanvas.toggle(true);
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
        }
    });

    it('should show/hide', function(done){
        if (!nav1.OffCanvas.isVisible()) {
            nav1.OffCanvas.show(true);
        }
        nav1transitionendCallback = function () {
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
                expect(nav1.OffCanvas.isVisible()).to.be.false;
                nav1transitionendCallback = function () {
                    setTimeout(function () {
                        expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                        expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
                        expect(nav1.OffCanvas.isVisible()).to.be.true;
                        nav1transitionendCallback = function(){};
                        done();
                    }, 200);
                };
                setTimeout(function () {
                    expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                    expect(Array.from(nav1.classList)).to.include(Classes.TRANSITIONING);
                    expect(nav1.OffCanvas.isVisible()).to.be.true;
                }, 200);
                nav1.OffCanvas.show();
            }, 200);
        };
        setTimeout(function () {
            expect(nav1.OffCanvas.isTransitioning()).to.be.true;
            expect(Array.from(nav1.classList)).to.include(Classes.TRANSITIONING);
            expect(nav1.OffCanvas.isVisible()).to.be.false;
        }, 200);
        nav1.OffCanvas.hide();
    });

    it('should toggle', function(done){
        if (!nav1.OffCanvas.isVisible()) {
            nav1.OffCanvas.show(true);
        }
        nav1transitionendCallback = function () {
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
                expect(nav1.OffCanvas.isVisible()).to.be.false;
                nav1transitionendCallback = function () {
                    setTimeout(function () {
                        expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                        expect(Array.from(nav1.classList)).to.not.include(Classes.TRANSITIONING);
                        expect(nav1.OffCanvas.isVisible()).to.be.true;
                        nav1transitionendCallback = function(){};
                        done();
                    }, 200);
                };
                setTimeout(function () {
                    expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                    expect(Array.from(nav1.classList)).to.include(Classes.TRANSITIONING);
                    expect(nav1.OffCanvas.isVisible()).to.be.true;
                }, 200);
                nav1.OffCanvas.toggle();
            }, 200);
        };
        setTimeout(function () {
            expect(nav1.OffCanvas.isTransitioning()).to.be.true;
            expect(Array.from(nav1.classList)).to.include(Classes.TRANSITIONING);
            expect(nav1.OffCanvas.isVisible()).to.be.false;
        }, 200);
        nav1.OffCanvas.toggle();
    });

    it('should hide then clicked on overlay', function(done) {
        nav1.OffCanvas.show(true);
        nav1transitionendCallback = function(){
            setTimeout(function(){
                expect(nav1.OffCanvas.isVisible()).to.be.false;
                nav1transitionendCallback = function(){};
                done();
            }, 200);
        };
        setTimeout(function () {
            expect(nav1.OffCanvas.isTransitioning()).to.be.true;
            expect(nav1.OffCanvas.isVisible()).to.be.false;
        }, 200);
        nav1.OffCanvas.overlay.dispatchEvent(click);
    });
    
    it('should not show if is allready visible', function(done) {
        nav1.OffCanvas.show(true);
        expect(nav1.OffCanvas.isVisible()).to.be.true;
        nav1.OffCanvas.show();
        setTimeout(function(){
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            done();
        }, 200);
    });
    
    it('should not hide if is allready hidden', function(done) {
        nav1.OffCanvas.hide(true);
        expect(nav1.OffCanvas.isVisible()).to.be.false;
        nav1.OffCanvas.hide();
        setTimeout(function(){
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            done();
        }, 200);
    });

    it('should not show if is transitioning', function(done) {
        nav1.OffCanvas.hide(true);
        expect(nav1.OffCanvas.isVisible()).to.be.false;
        nav1transitionendCallback = function(){
            nav1transitionendCallback = function(){};
            setTimeout(function(){
                done();
            }, 200);
        };
        setTimeout(function(){
            expect(nav1.OffCanvas.isTransitioning()).to.be.true;
            expect(nav1.OffCanvas.isVisible()).to.be.true;
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isVisible()).to.be.true;
        }, 200);
        nav1.OffCanvas.show();
    });

    it('should not hide if is transitioning', function(done) {
        nav1.OffCanvas.hide(true);
        expect(nav1.OffCanvas.isVisible()).to.be.false;
        nav1transitionendCallback = function(){
            nav1transitionendCallback = function(){};
            setTimeout(function(){
                done();
            }, 200);
        };
        setTimeout(function(){
            expect(nav1.OffCanvas.isTransitioning()).to.be.true;
            expect(nav1.OffCanvas.isVisible()).to.be.true;
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isVisible()).to.be.true;
        }, 200);
        nav1.OffCanvas.show();
    });

    it('should invoke events on show', function(done){
        nav1.OffCanvas.hide(true);
        var invoked = [];
        var fx = function(e) {
            invoked.push(e.type);
        }
        nav1.addEventListener('offcanvas.pre.show', fx);
        nav1.addEventListener('offcanvas.show', fx);
        nav1transitionendCallback = function(){
            nav1transitionendCallback = function(){};
            setTimeout(function(){
                nav1.removeEventListener('offcanvas.pre.show', fx);
                nav1.removeEventListener('offcanvas.show', fx);
                expect(invoked).to.eql(["offcanvas.pre.show", "offcanvas.show"]);
                done();
            }, 200);
        };
        nav1.OffCanvas.show();
    });

    it('should invoke events on hide', function(done){
        nav1.OffCanvas.show(true);
        var invoked = [];
        var fx = function(e) {
            invoked.push(e.type);
        }
        nav1.addEventListener('offcanvas.pre.hide', fx);
        nav1.addEventListener('offcanvas.hide', fx);
        nav1transitionendCallback = function(){
            nav1transitionendCallback = function(){};
            setTimeout(function(){
                nav1.removeEventListener('offcanvas.pre.hide', fx);
                nav1.removeEventListener('offcanvas.hide', fx);
                expect(invoked).to.eql(["offcanvas.pre.hide", "offcanvas.hide"]);
                done();
            }, 200);
        };
        nav1.OffCanvas.hide();
    });

    it('should add/remove class to trigger', function(){
        nav1.OffCanvas.hide(true);
        expect(Array.from(trigger1.classList)).to.not.include(Classes.TARGET_VISIBLE);
        nav1.OffCanvas.show(true);
        expect(Array.from(trigger1.classList)).to.include(Classes.TARGET_VISIBLE);
        nav1.OffCanvas.hide(true);
        expect(Array.from(trigger1.classList)).to.not.include(Classes.TARGET_VISIBLE);
    });

    describe('[data]', function(){
        it('should show on trigger (data-offcanvas="show") click', function(done){
            var trigger = document.getElementById('t1a');
            nav1.OffCanvas.hide(true);
            nav1transitionendCallback = function(){
                setTimeout(function(){
                    expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                    expect(nav1.OffCanvas.isVisible()).to.be.true;
                    nav1transitionendCallback = function(){};
                    done();
                }, 200);
            };
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                expect(nav1.OffCanvas.isVisible()).to.be.true;
            }, 200);
            trigger.dispatchEvent(click);
        });
        
        it('should hide on trigger (data-offcanvas="hide") click', function(done){
            var trigger = document.getElementById('t1b');
            nav1.OffCanvas.show(true);
            nav1transitionendCallback = function(){
                setTimeout(function(){
                    expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                    expect(nav1.OffCanvas.isVisible()).to.be.false;
                    nav1transitionendCallback = function(){};
                    done();
                }, 200);
            };
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                expect(nav1.OffCanvas.isVisible()).to.be.false;
            }, 200);
            trigger.dispatchEvent(click);
        });
        
        it('should toggle on trigger (data-offcanvas="toggle") click', function(done){
            var trigger = document.getElementById('t1c');
            nav1.OffCanvas.hide(true);
            nav1transitionendCallback = function(){
                setTimeout(function(){
                    expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                    expect(nav1.OffCanvas.isVisible()).to.be.true;
                    nav1transitionendCallback = function(){
                        setTimeout(function(){
                            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                            expect(nav1.OffCanvas.isVisible()).to.be.false;
                            nav1transitionendCallback = function(){ };
                            done();
                        }, 200);
                    };
                    setTimeout(function () {
                        expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                        expect(nav1.OffCanvas.isVisible()).to.be.false;
                    }, 200);
                    trigger.dispatchEvent(click);
                }, 200);
            };
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                expect(nav1.OffCanvas.isVisible()).to.be.true;
            }, 200);
            trigger.dispatchEvent(click);
        });
        
        it('should toggle on trigger (data-offcanvas) click', function(done){
            var trigger = document.getElementById('t1d');
            nav1.OffCanvas.hide(true);
            nav1transitionendCallback = function(){
                setTimeout(function(){
                    expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                    expect(nav1.OffCanvas.isVisible()).to.be.true;
                    nav1transitionendCallback = function(){
                        setTimeout(function(){
                            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                            expect(nav1.OffCanvas.isVisible()).to.be.false;
                            nav1transitionendCallback = function(){ };
                            done();
                        }, 200);
                    };
                    setTimeout(function () {
                        expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                        expect(nav1.OffCanvas.isVisible()).to.be.false;
                    }, 200);
                    trigger.dispatchEvent(click);
                }, 200);
            };
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.true;
                expect(nav1.OffCanvas.isVisible()).to.be.true;
            }, 200);
            trigger.dispatchEvent(click);
        });

        it('should force show on trigger (data-offcanvas-force="1") click', function(done){
            var trigger = document.getElementById('t2a');
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                expect(nav1.OffCanvas.isVisible()).to.be.true;
                done();
            }, 200);
            trigger.dispatchEvent(click);
        });

        it('should force hide on trigger (data-offcanvas-force="true") click', function(done){
            var trigger = document.getElementById('t2b');
            nav1.OffCanvas.show(true);
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(nav1.OffCanvas.isVisible()).to.be.true;
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                expect(nav1.OffCanvas.isVisible()).to.be.false;
                done();
            }, 200);
            trigger.dispatchEvent(click);
        });

        it('should force toggle on trigger (data-offcanvas-force="yes") click', function(done){
            var trigger = document.getElementById('t2c');
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                expect(nav1.OffCanvas.isVisible()).to.be.true;
                setTimeout(function () {
                    expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                    expect(nav1.OffCanvas.isVisible()).to.be.false;
                    done();
                }, 200);
                trigger.dispatchEvent(click);
            }, 200);
            trigger.dispatchEvent(click);
        });

        it('should force toggle on trigger (data-offcanvas-force) click', function(done){
            var trigger = document.getElementById('t2d');
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                expect(nav1.OffCanvas.isVisible()).to.be.true;
                setTimeout(function () {
                    expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                    expect(nav1.OffCanvas.isVisible()).to.be.false;
                    done();
                }, 200);
                trigger.dispatchEvent(click);
            }, 200);
            trigger.dispatchEvent(click);
        });

        it('should use (data-offcanvas-target="...") if exists', function(done){
            var trigger = document.getElementById('t3');
            nav1.OffCanvas.hide(true);
            expect(nav1.OffCanvas.isTransitioning()).to.be.false;
            expect(nav1.OffCanvas.isVisible()).to.be.false;
            setTimeout(function () {
                expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                expect(nav1.OffCanvas.isVisible()).to.be.true;
                setTimeout(function () {
                    expect(nav1.OffCanvas.isTransitioning()).to.be.false;
                    expect(nav1.OffCanvas.isVisible()).to.be.false;
                    done();
                }, 200);
                trigger.dispatchEvent(click);
            }, 200);
            trigger.dispatchEvent(click);
        });
    });
});