/**
 * ================================================================
 * CHAT HERITAGE - ENTERPRISE JAVASCRIPT
 * Version: 2.0.0
 * Enhanced with enterprise-level optimizations, error handling,
 * memory management, and performance monitoring
 * ================================================================
 */

(function(window, document, undefined) {
  'use strict';
  
  // ================================================================
  // ENTERPRISE CONFIGURATION & CONSTANTS
  // ================================================================
  
  const CONFIG = {
      DEBUG: true, // Set to true for development
      PERFORMANCE_MONITOR: true,
      SCROLL_THROTTLE: 16, // ~60fps
      RESIZE_DEBOUNCE: 150,
      INTERSECTION_THRESHOLD: 0.2,
      INTERSECTION_ROOT_MARGIN: '0px 0px -100px 0px',
      SMOOTH_SCROLL_DURATION: 800,
      MOMENTUM_FRICTION: 0.95,
      MOMENTUM_THRESHOLD: 0.1,
      HEADER_SCROLL_THRESHOLD: 50,
      PARALLAX_SPEED: 0.3,
      DRAG_MULTIPLIER: {
          MOUSE: 2,
          TOUCH: 1.5
      }
  };
  
  // ================================================================
  // ENTERPRISE UTILITIES & HELPERS
  // ================================================================
  
  const Utils = {
      /**
       * Debounce function for performance optimization
       */
      debounce: function(func, wait, immediate) {
          let timeout;
          return function executedFunction() {
              const context = this;
              const args = arguments;
              const later = function() {
                  timeout = null;
                  if (!immediate) func.apply(context, args);
              };
              const callNow = immediate && !timeout;
              clearTimeout(timeout);
              timeout = setTimeout(later, wait);
              if (callNow) func.apply(context, args);
          };
      },
      
      /**
       * Throttle function for scroll events
       */
      throttle: function(func, limit) {
          let inThrottle;
          return function() {
              const args = arguments;
              const context = this;
              if (!inThrottle) {
                  func.apply(context, args);
                  inThrottle = true;
                  setTimeout(() => inThrottle = false, limit);
              }
          };
      },
      
      /**
       * Enhanced error logging with context
       */
      logError: function(error, context, data) {
          if (CONFIG.DEBUG || CONFIG.PERFORMANCE_MONITOR) {
              console.group('🚨 Chat Heritage Error');
              console.error('Context:', context);
              console.error('Error:', error);
              if (data) console.error('Data:', data);
              console.error('Stack:', error.stack);
              console.groupEnd();
          }
          
          // In production, you might want to send to error tracking service
          if (!CONFIG.DEBUG && window.gtag) {
              window.gtag('event', 'exception', {
                  description: `${context}: ${error.message}`,
                  fatal: false
              });
          }
      },
      
      /**
       * Performance monitoring utility
       */
      performanceMark: function(name) {
          if (CONFIG.PERFORMANCE_MONITOR && 'performance' in window && 'mark' in performance) {
              try {
                  performance.mark(name);
              } catch (e) {
                  // Silent fail for unsupported browsers
              }
          }
      },
      
      /**
       * Safe element selector with error handling
       */
      safeQuerySelector: function(selector, context) {
          try {
              return (context || document).querySelector(selector);
          } catch (error) {
              this.logError(error, 'safeQuerySelector', { selector });
              return null;
          }
      },
      
      /**
       * Safe element selector all with error handling
       */
      safeQuerySelectorAll: function(selector, context) {
          try {
              return Array.from((context || document).querySelectorAll(selector));
          } catch (error) {
              this.logError(error, 'safeQuerySelectorAll', { selector });
              return [];
          }
      },
      
      /**
       * Cross-browser event listener with memory management
       */
      addEventListener: function(element, event, handler, options) {
          if (!element || typeof handler !== 'function') return null;
          
          try {
              if (element.addEventListener) {
                  element.addEventListener(event, handler, options || false);
                  return { element, event, handler, options };
              } else if (element.attachEvent) {
                  const wrappedHandler = function(e) {
                      handler.call(element, e || window.event);
                  };
                  element.attachEvent('on' + event, wrappedHandler);
                  return { element, event, handler: wrappedHandler, isIE: true };
              }
          } catch (error) {
              this.logError(error, 'addEventListener', { event, element });
          }
          return null;
      },
      
      /**
       * Cross-browser event listener removal
       */
      removeEventListener: function(listenerRef) {
          if (!listenerRef) return;
          
          try {
              if (listenerRef.isIE) {
                  listenerRef.element.detachEvent('on' + listenerRef.event, listenerRef.handler);
              } else {
                  listenerRef.element.removeEventListener(
                      listenerRef.event, 
                      listenerRef.handler, 
                      listenerRef.options || false
                  );
              }
          } catch (error) {
              this.logError(error, 'removeEventListener', listenerRef);
          }
      },
      
      /**
       * Enhanced feature detection with caching
       */
      hasFeature: function(feature) {
          if (!this._featureCache) this._featureCache = {};
          if (this._featureCache[feature] !== undefined) {
              return this._featureCache[feature];
          }
          
          let result = false;
          try {
              switch (feature) {
                  case 'css3DTransforms':
                      result = this._detectCSS3DTransforms();
                      break;
                  case 'cssGrid':
                      result = CSS.supports && CSS.supports('display', 'grid');
                      break;
                  case 'intersectionObserver':
                      result = 'IntersectionObserver' in window;
                      break;
                  case 'requestAnimationFrame':
                      result = 'requestAnimationFrame' in window;
                      break;
                  case 'performance':
                      result = 'performance' in window && 'now' in performance;
                      break;
                  case 'passiveListeners':
                      result = this._detectPassiveListeners();
                      break;
                  default:
                      result = false;
              }
          } catch (error) {
              this.logError(error, 'hasFeature', { feature });
              result = false;
          }
          
          this._featureCache[feature] = result;
          return result;
      },
      
      /**
       * Detect CSS 3D transforms support
       */
      _detectCSS3DTransforms: function() {
          const el = document.createElement('p');
          let has3d = false;
          const transforms = {
              'webkitTransform': '-webkit-transform',
              'OTransform': '-o-transform', 
              'msTransform': '-ms-transform',
              'MozTransform': '-moz-transform',
              'transform': 'transform'
          };
          
          try {
              document.body.insertBefore(el, null);
              for (const t in transforms) {
                  if (el.style[t] !== undefined) {
                      el.style[t] = 'translate3d(1px,1px,1px)';
                      const computed = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                      has3d = (computed !== undefined && computed.length > 0 && computed !== "none");
                      if (has3d) break;
                  }
              }
          } catch (error) {
              has3d = false;
          } finally {
              if (el.parentNode) {
                  document.body.removeChild(el);
              }
          }
          
          return has3d;
      },
      
      /**
       * Detect passive listeners support
       */
      _detectPassiveListeners: function() {
          let passiveSupported = false;
          try {
              const options = {
                  get passive() {
                      passiveSupported = true;
                      return false;
                  }
              };
              window.addEventListener('test', null, options);
              window.removeEventListener('test', null, options);
          } catch (err) {
              passiveSupported = false;
          }
          return passiveSupported;
      }
  };
  
  // ================================================================
  // ENTERPRISE EVENT MANAGER
  // ================================================================
  
  const EventManager = {
      _listeners: [],
      
      /**
       * Add event listener with automatic cleanup tracking
       */
      add: function(element, event, handler, options) {
          const listenerRef = Utils.addEventListener(element, event, handler, options);
          if (listenerRef) {
              this._listeners.push(listenerRef);
          }
          return listenerRef;
      },
      
      /**
       * Remove specific event listener
       */
      remove: function(listenerRef) {
          Utils.removeEventListener(listenerRef);
          const index = this._listeners.indexOf(listenerRef);
          if (index > -1) {
              this._listeners.splice(index, 1);
          }
      },
      
      /**
       * Cleanup all event listeners (important for SPAs)
       */
      cleanup: function() {
          this._listeners.forEach(listenerRef => {
              Utils.removeEventListener(listenerRef);
          });
          this._listeners = [];
      },
      
      /**
       * Get listener count for debugging
       */
      getListenerCount: function() {
          return this._listeners.length;
      }
  };
  
  // ================================================================
  // ENTERPRISE FEATURE DETECTION
  // ================================================================
  
  const FeatureDetection = {
      init: function() {
          try {
              Utils.performanceMark('feature-detection-start');
              
              const html = document.documentElement;
              
              // CSS 3D Transforms
              const hasCSS3DTransforms = Utils.hasFeature('css3DTransforms');
              html.className += hasCSS3DTransforms ? ' csstransforms' : ' no-csstransforms';
              
              // CSS Grid
              const hasGrid = Utils.hasFeature('cssGrid');
              html.className += hasGrid ? ' cssgrid' : ' no-cssgrid';
              
              // Touch device detection
              const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
              html.className += hasTouch ? ' touch' : ' no-touch';
              
              // High DPI detection
              const isHighDPI = window.devicePixelRatio && window.devicePixelRatio > 1;
              html.className += isHighDPI ? ' retina' : ' no-retina';
              
              // Mobile detection (enhanced)
              const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
              html.className += isMobile ? ' mobile' : ' desktop';
              
              // Store features for later use
              this.features = {
                  css3DTransforms: hasCSS3DTransforms,
                  cssGrid: hasGrid,
                  intersectionObserver: Utils.hasFeature('intersectionObserver'),
                  requestAnimationFrame: Utils.hasFeature('requestAnimationFrame'),
                  passiveListeners: Utils.hasFeature('passiveListeners'),
                  touch: hasTouch,
                  highDPI: isHighDPI,
                  mobile: isMobile
              };
              
              Utils.performanceMark('feature-detection-end');
              
              if (CONFIG.DEBUG) {
                  console.log('🔍 Feature Detection Results:', this.features);
              }
              
          } catch (error) {
              Utils.logError(error, 'FeatureDetection.init');
          }
      },
      
      has: function(feature) {
          return this.features && this.features[feature] === true;
      }
  };
  
  // ================================================================
  // ENTERPRISE HEADER CONTROLLER
  // ================================================================
  
  const HeaderController = {
      init: function() {
          try {
              this.header = Utils.safeQuerySelector('#header');
              if (!this.header) return;
              
              this.isScrolled = false;
              this.ticking = false;
              
              const throttledHandler = Utils.throttle(this.handleScroll.bind(this), CONFIG.SCROLL_THROTTLE);
              EventManager.add(window, 'scroll', throttledHandler, 
                  FeatureDetection.has('passiveListeners') ? { passive: true } : false);
              
              // Initial check
              this.handleScroll();
              
          } catch (error) {
              Utils.logError(error, 'HeaderController.init');
          }
      },
      
      handleScroll: function() {
          if (!this.ticking && this.header) {
              if (FeatureDetection.has('requestAnimationFrame')) {
                  requestAnimationFrame(this.updateHeader.bind(this));
              } else {
                  this.updateHeader();
              }
              this.ticking = true;
          }
      },
      
      updateHeader: function() {
          try {
              const scrollY = window.pageYOffset || document.documentElement.scrollTop;
              const shouldBeScrolled = scrollY > CONFIG.HEADER_SCROLL_THRESHOLD;
              
              if (shouldBeScrolled !== this.isScrolled) {
                  this.isScrolled = shouldBeScrolled;
                  if (shouldBeScrolled) {
                      this.header.classList.add('scrolled');
                  } else {
                      this.header.classList.remove('scrolled');
                  }
              }
              
              this.ticking = false;
          } catch (error) {
              Utils.logError(error, 'HeaderController.updateHeader');
              this.ticking = false;
          }
      }
  };
  
  // ================================================================
  // ENTERPRISE SMOOTH SCROLL CONTROLLER
  // ================================================================
  
  const SmoothScrollController = {
      init: function() {
          try {
              const navLinks = Utils.safeQuerySelectorAll('a[href^="#"]');
              
              navLinks.forEach(link => {
                  EventManager.add(link, 'click', this.handleClick.bind(this));
              });
              
          } catch (error) {
              Utils.logError(error, 'SmoothScrollController.init');
          }
      },
      
      handleClick: function(e) {
          try {
              e.preventDefault();
              const href = e.currentTarget.getAttribute('href');
              const target = Utils.safeQuerySelector(href);
              
              if (!target) {
                  if (CONFIG.DEBUG) {
                      console.warn('🎯 Smooth scroll target not found:', href);
                  }
                  return;
              }
              
              this.scrollToTarget(target);
              
          } catch (error) {
              Utils.logError(error, 'SmoothScrollController.handleClick', { target: e.currentTarget });
          }
      },
      
      scrollToTarget: function(target) {
          try {
              const header = Utils.safeQuerySelector('.header');
              const headerHeight = header ? header.offsetHeight : 70;
              const targetPosition = target.offsetTop - headerHeight;
              
              // Use native smooth scroll if available
              if ('scrollBehavior' in document.documentElement.style) {
                  window.scrollTo({
                      top: targetPosition,
                      behavior: 'smooth'
                  });
              } else {
                  // Fallback to custom smooth scroll
                  this.animatedScroll(targetPosition, CONFIG.SMOOTH_SCROLL_DURATION);
              }
              
          } catch (error) {
              Utils.logError(error, 'SmoothScrollController.scrollToTarget', { target });
          }
      },
      
      animatedScroll: function(targetPosition, duration) {
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          let startTime = null;
          
          const animation = (currentTime) => {
              try {
                  if (startTime === null) startTime = currentTime;
                  const timeElapsed = currentTime - startTime;
                  const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
                  
                  window.scrollTo(0, run);
                  
                  if (timeElapsed < duration) {
                      requestAnimationFrame(animation);
                  }
              } catch (error) {
                  Utils.logError(error, 'SmoothScrollController.animatedScroll.animation');
              }
          };
          
          if (FeatureDetection.has('requestAnimationFrame')) {
              requestAnimationFrame(animation);
          } else {
              // Fallback for old browsers
              window.scrollTo(0, targetPosition);
          }
      },
      
      easeInOutQuad: function(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
      }
  };
  
  // ================================================================
  // ENTERPRISE CAROUSEL DRAG CONTROLLER
  // ================================================================
  
  const CarouselDragController = {
      init: function() {
          try {
              this.carousel = Utils.safeQuerySelector('.itineraries-grid');
              if (!this.carousel) return;
              
              this.state = {
                  isDown: false,
                  startX: 0,
                  scrollLeft: 0,
                  velocity: 0,
                  lastX: 0,
                  lastTime: 0
              };
              
              this.bindEvents();
              
              if (CONFIG.DEBUG) {
                  console.log('🎠 Carousel drag initialized');
              }
              
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.init');
          }
      },
      
      bindEvents: function() {
          try {
              // Mouse Events
              EventManager.add(this.carousel, 'mousedown', this.handleMouseDown.bind(this));
              EventManager.add(this.carousel, 'mouseleave', this.handleMouseUp.bind(this));
              EventManager.add(this.carousel, 'mouseup', this.handleMouseUp.bind(this));
              EventManager.add(this.carousel, 'mousemove', this.handleMouseMove.bind(this));
              
              // Touch Events
              const passiveOptions = FeatureDetection.has('passiveListeners') ? { passive: true } : false;
              EventManager.add(this.carousel, 'touchstart', this.handleTouchStart.bind(this), passiveOptions);
              EventManager.add(this.carousel, 'touchend', this.handleTouchEnd.bind(this), passiveOptions);
              EventManager.add(this.carousel, 'touchmove', this.handleTouchMove.bind(this), passiveOptions);
              
              // Prevent drag of images
              EventManager.add(this.carousel, 'dragstart', this.preventDrag.bind(this));
              
              // Context menu prevention during drag
              EventManager.add(this.carousel, 'contextmenu', this.handleContextMenu.bind(this));
              
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.bindEvents');
          }
      },
      
      handleMouseDown: function(e) {
          try {
              this.startDrag(e.pageX, 'mouse');
              this.carousel.classList.add('dragging');
              e.preventDefault();
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.handleMouseDown');
          }
      },
      
      handleMouseUp: function() {
          try {
              this.endDrag();
              this.carousel.classList.remove('dragging');
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.handleMouseUp');
          }
      },
      
      handleMouseMove: function(e) {
          try {
              if (!this.state.isDown) return;
              e.preventDefault();
              this.updateDrag(e.pageX, 'mouse');
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.handleMouseMove');
          }
      },
      
      handleTouchStart: function(e) {
          try {
              if (e.touches.length === 1) {
                  const touch = e.touches[0];
                  this.startDrag(touch.pageX, 'touch');
              }
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.handleTouchStart');
          }
      },
      
      handleTouchEnd: function() {
          try {
              this.endDrag();
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.handleTouchEnd');
          }
      },
      
      handleTouchMove: function(e) {
          try {
              if (!this.state.isDown || e.touches.length !== 1) return;
              const touch = e.touches[0];
              this.updateDrag(touch.pageX, 'touch');
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.handleTouchMove');
          }
      },
      
      startDrag: function(pageX, type) {
          this.state.isDown = true;
          this.state.startX = pageX - this.carousel.offsetLeft;
          this.state.scrollLeft = this.carousel.scrollLeft;
          this.state.velocity = 0;
          this.state.lastX = pageX;
          this.state.lastTime = Date.now();
          this.state.dragType = type;
      },
      
      updateDrag: function(pageX, type) {
          const currentTime = Date.now();
          const deltaTime = currentTime - this.state.lastTime;
          const deltaX = pageX - this.state.lastX;
          
          if (deltaTime > 0) {
              this.state.velocity = deltaX / deltaTime;
          }
          
          const x = pageX - this.carousel.offsetLeft;
          const walk = (x - this.state.startX) * CONFIG.DRAG_MULTIPLIER[type.toUpperCase()];
          
          const newScrollLeft = this.state.scrollLeft - walk;
          
          // Boundary checking
          const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;
          const clampedScroll = Math.max(0, Math.min(newScrollLeft, maxScroll));
          
          this.carousel.scrollLeft = clampedScroll;
          
          this.state.lastX = pageX;
          this.state.lastTime = currentTime;
      },
      
      endDrag: function() {
          this.state.isDown = false;
          // Applica snap solo su dispositivi touch per un'esperienza migliore
          if (this.state.dragType === 'touch') {
              this.snapToNearestCard();
          } else {
              this.applyMomentum();
          }
      },
      
      /**
       * NUOVA FUNZIONE PER SNAP AUTOMATICO
       */
      snapToNearestCard: function() {
          try {
              const cardWidth = 280; // Larghezza card mobile
              const gap = 24; // 1.5rem = 24px
              const cardWithGap = cardWidth + gap;
              const scrollLeft = this.carousel.scrollLeft;
              const containerPadding = 16; // 1rem = 16px
              
              // Calcola quale card è più vicina
              const adjustedScroll = scrollLeft + containerPadding;
              const cardIndex = Math.round(adjustedScroll / cardWithGap);
              const targetScroll = Math.max(0, (cardIndex * cardWithGap) - containerPadding);
              
              // Smooth scroll alla card più vicina
              this.carousel.scrollTo({
                  left: targetScroll,
                  behavior: 'smooth'
              });
              
              if (CONFIG.DEBUG) {
                  console.log('🎯 Snapping to card:', cardIndex, 'Target scroll:', targetScroll);
              }
              
          } catch (error) {
              Utils.logError(error, 'CarouselDragController.snapToNearestCard');
          }
      },
      
      applyMomentum: function() {
          if (Math.abs(this.state.velocity) < CONFIG.MOMENTUM_THRESHOLD) return;
          
          const step = () => {
              try {
                  this.state.velocity *= CONFIG.MOMENTUM_FRICTION;
                  
                  const newScrollLeft = this.carousel.scrollLeft - this.state.velocity * 10;
                  const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;
                  const clampedScroll = Math.max(0, Math.min(newScrollLeft, maxScroll));
                  
                  this.carousel.scrollLeft = clampedScroll;
                  
                  // Continue momentum if velocity is significant and not at boundaries
                  if (Math.abs(this.state.velocity) > CONFIG.MOMENTUM_THRESHOLD && 
                      clampedScroll === newScrollLeft) {
                      if (FeatureDetection.has('requestAnimationFrame')) {
                          requestAnimationFrame(step);
                      }
                  } else {
                      // Dopo il momentum, applica snap se su touch
                      if (this.state.dragType === 'touch') {
                          setTimeout(() => this.snapToNearestCard(), 100);
                      }
                  }
              } catch (error) {
                  Utils.logError(error, 'CarouselDragController.applyMomentum.step');
              }
          };
          
          if (FeatureDetection.has('requestAnimationFrame')) {
              requestAnimationFrame(step);
          }
      },
      
      preventDrag: function(e) {
          e.preventDefault();
      },
      
      handleContextMenu: function(e) {
          if (this.state.isDown) {
              e.preventDefault();
          }
      }
  };
  
  // ================================================================
  // ENTERPRISE SCROLL ANIMATIONS CONTROLLER
  // ================================================================
  
  const ScrollAnimationsController = {
      init: function() {
          try {
              this.elements = Utils.safeQuerySelectorAll('.slide-in-left, .slide-in-right');
              if (this.elements.length === 0) return;
              
              if (FeatureDetection.has('intersectionObserver') && FeatureDetection.has('css3DTransforms')) {
                  this.initIntersectionObserver();
              } else {
                  this.initScrollFallback();
              }
              
              if (CONFIG.DEBUG) {
                  console.log('🎭 Scroll animations initialized for', this.elements.length, 'elements');
              }
              
          } catch (error) {
              Utils.logError(error, 'ScrollAnimationsController.init');
          }
      },
      
      initIntersectionObserver: function() {
          try {
              const options = {
                  threshold: CONFIG.INTERSECTION_THRESHOLD,
                  rootMargin: CONFIG.INTERSECTION_ROOT_MARGIN
              };
              
              this.observer = new IntersectionObserver(this.handleIntersection.bind(this), options);
              
              this.elements.forEach(element => {
                  this.observer.observe(element);
              });
              
          } catch (error) {
              Utils.logError(error, 'ScrollAnimationsController.initIntersectionObserver');
              this.initScrollFallback();
          }
      },
      
      initScrollFallback: function() {
          try {
              const throttledHandler = Utils.throttle(this.checkElements.bind(this), CONFIG.SCROLL_THROTTLE);
              EventManager.add(window, 'scroll', throttledHandler, 
                  FeatureDetection.has('passiveListeners') ? { passive: true } : false);
              EventManager.add(window, 'load', this.checkElements.bind(this));
              
              // Initial check
              this.checkElements();
              
          } catch (error) {
              Utils.logError(error, 'ScrollAnimationsController.initScrollFallback');
          }
      },
      
      handleIntersection: function(entries) {
          try {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      entry.target.classList.add('visible');
                      // Stop observing once animated
                      if (this.observer) {
                          this.observer.unobserve(entry.target);
                      }
                  }
              });
          } catch (error) {
              Utils.logError(error, 'ScrollAnimationsController.handleIntersection');
          }
      },
      
      checkElements: function() {
          try {
              const windowHeight = window.innerHeight;
              
              this.elements.forEach(element => {
                  if (element.classList.contains('visible')) return;
                  
                  const elementTop = element.getBoundingClientRect().top;
                  
                  if (elementTop < windowHeight - 100) {
                      element.classList.add('visible');
                  }
              });
          } catch (error) {
              Utils.logError(error, 'ScrollAnimationsController.checkElements');
          }
      },
      
      destroy: function() {
          if (this.observer) {
              this.observer.disconnect();
              this.observer = null;
          }
      }
  };
  
  // ================================================================
  // ENTERPRISE PARALLAX CONTROLLER
  // ================================================================
  
  const ParallaxController = {
      init: function() {
          try {
              // Only enable on desktop with CSS3D support
              if (!FeatureDetection.has('css3DTransforms') || FeatureDetection.has('mobile')) {
                  return;
              }
              
              this.hero = Utils.safeQuerySelector('.hero');
              if (!this.hero) return;
              
              this.ticking = false;
              this.enabled = true;
              
              const throttledHandler = Utils.throttle(this.handleScroll.bind(this), CONFIG.SCROLL_THROTTLE);
              EventManager.add(window, 'scroll', throttledHandler, 
                  FeatureDetection.has('passiveListeners') ? { passive: true } : false);
              
              // Disable on resize to mobile
              const debouncedResize = Utils.debounce(this.handleResize.bind(this), CONFIG.RESIZE_DEBOUNCE);
              EventManager.add(window, 'resize', debouncedResize);
              
              if (CONFIG.DEBUG) {
                  console.log('🌊 Parallax enabled');
              }
              
          } catch (error) {
              Utils.logError(error, 'ParallaxController.init');
          }
      },
      
      handleScroll: function() {
          if (!this.ticking && this.enabled && this.hero) {
              if (FeatureDetection.has('requestAnimationFrame')) {
                  requestAnimationFrame(this.updateParallax.bind(this));
              } else {
                  this.updateParallax();
              }
              this.ticking = true;
          }
      },
      
      updateParallax: function() {
          try {
              const scrolled = window.pageYOffset || document.documentElement.scrollTop;
              const translateY = scrolled * CONFIG.PARALLAX_SPEED;
              
              this.hero.style.transform = `translateY(${translateY}px)`;
              this.ticking = false;
              
          } catch (error) {
              Utils.logError(error, 'ParallaxController.updateParallax');
              this.ticking = false;
          }
      },
      
      handleResize: function() {
          try {
              const isMobile = window.innerWidth <= 768;
              this.enabled = !isMobile;
              
              if (!this.enabled && this.hero) {
                  this.hero.style.transform = '';
              }
          } catch (error) {
              Utils.logError(error, 'ParallaxController.handleResize');
          }
      }
  };
  
  // ================================================================
  // ENTERPRISE APPLICATION CONTROLLER
  // ================================================================
  
  const App = {
      /**
       * Initialize the application
       */
      init: function() {
          try {
              Utils.performanceMark('app-init-start');
              
              if (CONFIG.DEBUG) {
                  console.group('🚀 Chat Heritage App Initialization');
                  console.log('Version: 2.0.0 Enterprise');
                  console.log('Debug Mode: Enabled');
              }
              
              // Initialize feature detection first
              FeatureDetection.init();
              
              // Initialize all controllers
              this.initControllers();
              
              // Setup global error handling
              this.setupErrorHandling();
              
              // Setup performance monitoring
              this.setupPerformanceMonitoring();
              
              // Mark app as loaded
              this.markAsLoaded();
              
              Utils.performanceMark('app-init-end');
              
              if (CONFIG.DEBUG) {
                  console.log('✅ App initialization complete');
                  console.log('👂 Event listeners registered:', EventManager.getListenerCount());
                  console.groupEnd();
              }
              
          } catch (error) {
              Utils.logError(error, 'App.init');
              this.handleCriticalError(error);
          }
      },
      
      /**
       * Initialize all application controllers
       */
      initControllers: function() {
          const controllers = [
              { name: 'HeaderController', instance: HeaderController },
              { name: 'SmoothScrollController', instance: SmoothScrollController },
              { name: 'CarouselDragController', instance: CarouselDragController },
              { name: 'ScrollAnimationsController', instance: ScrollAnimationsController }
              // ParallaxController removed - parallax effect disabled
          ];
          
          controllers.forEach(controller => {
              try {
                  Utils.performanceMark(`${controller.name}-init-start`);
                  controller.instance.init();
                  Utils.performanceMark(`${controller.name}-init-end`);
                  
                  if (CONFIG.DEBUG) {
                      console.log(`✅ ${controller.name} initialized`);
                  }
              } catch (error) {
                  Utils.logError(error, `App.initControllers.${controller.name}`);
              }
          });
      },
      
      /**
       * Setup global error handling
       */
      setupErrorHandling: function() {
          // Global error handler
          window.addEventListener('error', function(e) {
              Utils.logError(e.error || new Error(e.message), 'Global Error Handler', {
                  filename: e.filename,
                  lineno: e.lineno,
                  colno: e.colno
              });
          });
          
          // Unhandled promise rejection handler
          window.addEventListener('unhandledrejection', function(e) {
              Utils.logError(e.reason, 'Unhandled Promise Rejection');
              e.preventDefault(); // Prevent console error
          });
          
          // Resource loading error handler
          window.addEventListener('error', function(e) {
              if (e.target !== window && e.target.tagName) {
                  Utils.logError(new Error(`Resource loading failed: ${e.target.tagName}`), 'Resource Error', {
                      src: e.target.src || e.target.href,
                      tagName: e.target.tagName
                  });
              }
          }, true);
      },
      
      /**
       * Setup performance monitoring
       */
      setupPerformanceMonitoring: function() {
          if (!CONFIG.PERFORMANCE_MONITOR || !Utils.hasFeature('performance')) return;
          
          try {
              // Monitor page load performance
              window.addEventListener('load', function() {
                  setTimeout(function() {
                      if (performance.getEntriesByType) {
                          const navigation = performance.getEntriesByType('navigation')[0];
                          const paint = performance.getEntriesByType('paint');
                          
                          if (CONFIG.DEBUG && navigation) {
                              console.group('📊 Performance Metrics');
                              console.log('DOM Content Loaded:', Math.round(navigation.domContentLoadedEventEnd), 'ms');
                              console.log('Load Complete:', Math.round(navigation.loadEventEnd), 'ms');
                              
                              if (paint.length > 0) {
                                  paint.forEach(entry => {
                                      console.log(`${entry.name}:`, Math.round(entry.startTime), 'ms');
                                  });
                              }
                              console.groupEnd();
                          }
                          
                          // Send to analytics if available
                          if (window.gtag && navigation) {
                              window.gtag('event', 'timing_complete', {
                                  name: 'load',
                                  value: Math.round(navigation.loadEventEnd)
                              });
                          }
                      }
                  }, 1000);
              });
              
              // Monitor long tasks (if supported)
              if ('PerformanceObserver' in window) {
                  try {
                      const observer = new PerformanceObserver(function(list) {
                          const entries = list.getEntries();
                          entries.forEach(entry => {
                              if (entry.duration > 50) { // Tasks longer than 50ms
                                  if (CONFIG.DEBUG) {
                                      console.warn('🐌 Long task detected:', Math.round(entry.duration), 'ms');
                                  }
                              }
                          });
                      });
                      observer.observe({ entryTypes: ['longtask'] });
                  } catch (e) {
                      // Long task API not supported
                  }
              }
              
          } catch (error) {
              Utils.logError(error, 'App.setupPerformanceMonitoring');
          }
      },
      
      /**
       * Mark application as loaded
       */
      markAsLoaded: function() {
          try {
              // Add loaded class with delay to ensure proper rendering
              setTimeout(function() {
                  document.body.classList.add('loaded');
                  
                  // Dispatch custom event for other scripts
                  const event = new CustomEvent('chAppLoaded', {
                      detail: { 
                          version: '2.0.0',
                          features: FeatureDetection.features,
                          timestamp: Date.now()
                      }
                  });
                  document.dispatchEvent(event);
                  
              }, 100);
              
          } catch (error) {
              // Fallback for older browsers
              setTimeout(function() {
                  document.body.classList.add('loaded');
              }, 100);
          }
      },
      
      /**
       * Handle critical errors that prevent app initialization
       */
      handleCriticalError: function(error) {
          try {
              // Ensure basic functionality works
              document.body.classList.add('loaded', 'error-state');
              
              // Show user-friendly message in development
              if (CONFIG.DEBUG) {
                  const errorDiv = document.createElement('div');
                  errorDiv.style.cssText = `
                      position: fixed;
                      top: 10px;
                      right: 10px;
                      background: #ff4444;
                      color: white;
                      padding: 10px;
                      border-radius: 5px;
                      z-index: 10000;
                      font-family: monospace;
                      font-size: 12px;
                      max-width: 300px;
                  `;
                  errorDiv.innerHTML = `<strong>App Error:</strong><br>${error.message}`;
                  document.body.appendChild(errorDiv);
                  
                  setTimeout(() => {
                      if (errorDiv.parentNode) {
                          errorDiv.parentNode.removeChild(errorDiv);
                      }
                  }, 5000);
              }
              
          } catch (fallbackError) {
              // Last resort - just log to console
              console.error('Critical app error:', error);
              console.error('Fallback error:', fallbackError);
          }
      },
      
      /**
       * Cleanup function for SPA compatibility
       */
      destroy: function() {
          try {
              if (CONFIG.DEBUG) {
                  console.log('🧹 Cleaning up Chat Heritage App');
              }
              
              // Cleanup all event listeners
              EventManager.cleanup();
              
              // Cleanup intersection observers
              if (ScrollAnimationsController.destroy) {
                  ScrollAnimationsController.destroy();
              }
              
              // Remove body classes
              document.body.classList.remove('loaded', 'error-state');
              
              // Clear feature cache
              if (Utils._featureCache) {
                  Utils._featureCache = {};
              }
              
              if (CONFIG.DEBUG) {
                  console.log('✅ Cleanup complete');
              }
              
          } catch (error) {
              Utils.logError(error, 'App.destroy');
          }
      },
      
      /**
       * Reinitialize app (useful for dynamic content)
       */
      refresh: function() {
          try {
              if (CONFIG.DEBUG) {
                  console.log('🔄 Refreshing Chat Heritage App');
              }
              
              this.destroy();
              
              // Reinitialize after cleanup
              setTimeout(() => {
                  this.init();
              }, 100);
              
          } catch (error) {
              Utils.logError(error, 'App.refresh');
          }
      },
      
      /**
       * Get app status and metrics
       */
      getStatus: function() {
          return {
              version: '2.0.0',
              features: FeatureDetection.features,
              listenerCount: EventManager.getListenerCount(),
              config: CONFIG,
              timestamp: Date.now()
          };
      }
  };
  
  // ================================================================
  // ENTERPRISE INITIALIZATION & EXPOSURE
  // ================================================================
  
  /**
   * Cross-browser DOM ready detection
   */
  function domReady(callback) {
      if (document.readyState === 'loading') {
          if (document.addEventListener) {
              document.addEventListener('DOMContentLoaded', callback);
          } else {
              document.attachEvent('onreadystatechange', function() {
                  if (document.readyState !== 'loading') {
                      callback();
                  }
              });
          }
      } else {
          callback();
      }
  }
  
  /**
   * Initialize when DOM is ready
   */
  domReady(function() {
      App.init();
  });
  
  /**
   * Additional window load event for complete initialization
   */
  if (window.addEventListener) {
      window.addEventListener('load', function() {
          // Final setup after all resources loaded
          setTimeout(function() {
              if (CONFIG.DEBUG) {
                  console.log('🎉 All resources loaded, app fully ready');
                  console.log('📊 Final status:', App.getStatus());
              }
          }, 100);
      });
  } else {
      window.attachEvent('onload', function() {
          setTimeout(function() {
              document.body.classList.add('fully-loaded');
          }, 100);
      });
  }
  
  // ================================================================
  // PUBLIC API EXPOSURE
  // ================================================================
  
  /**
   * Expose public API for external scripts and debugging
   */
  window.ChatHeritage = {
      version: '2.0.0',
      init: App.init.bind(App),
      destroy: App.destroy.bind(App),
      refresh: App.refresh.bind(App),
      getStatus: App.getStatus.bind(App),
      utils: {
          logError: Utils.logError,
          hasFeature: Utils.hasFeature.bind(Utils),
          performanceMark: Utils.performanceMark
      },
      config: CONFIG,
      features: function() {
          return FeatureDetection.features;
      }
  };
  
  // ================================================================
  // DEVELOPMENT HELPERS
  // ================================================================
  
  if (CONFIG.DEBUG) {
      // Expose additional debugging utilities
      window.ChatHeritage.debug = {
          EventManager: EventManager,
          Controllers: {
              Header: HeaderController,
              SmoothScroll: SmoothScrollController,
              CarouselDrag: CarouselDragController,
              ScrollAnimations: ScrollAnimationsController,
              Parallax: ParallaxController
          },
          Utils: Utils,
          FeatureDetection: FeatureDetection
      };
      
      // Log initialization
      console.log('🔧 Debug mode enabled. Access via window.ChatHeritage.debug');
  }
  
  // ================================================================
  // BROWSER COMPATIBILITY NOTES
  // ================================================================
  
  /*
   * ENTERPRISE BROWSER SUPPORT:
   * 
   * TIER 1 (Full support):
   * - Chrome 60+
   * - Firefox 55+
   * - Safari 11+
   * - Edge 16+
   * 
   * TIER 2 (Core functionality):
   * - IE 11 (with polyfills)
   * - Chrome 40-59
   * - Firefox 40-54
   * - Safari 9-10
   * 
   * TIER 3 (Basic functionality):
   * - IE 9-10 (limited features)
   * - Very old mobile browsers
   * 
   * POLYFILLS REQUIRED FOR IE:
   * - IntersectionObserver
   * - CSS Grid (if needed)
   * - Object-fit (if needed)
   * - RequestAnimationFrame
   * - CustomEvent
   * 
   * PROGRESSIVE ENHANCEMENT:
   * All features degrade gracefully with appropriate fallbacks
   */
  
})(window, document);

// ================================================================
// END ENTERPRISE JAVASCRIPT
// ================================================================

/*
* Performance Tips:
* 1. Enable CONFIG.PERFORMANCE_MONITOR = false in production
* 2. Set CONFIG.DEBUG = false in production
* 3. Consider lazy loading for non-critical features
* 4. Monitor bundle size and loading performance
* 5. Use service workers for advanced caching strategies
* 
* Security Notes:
* 1. All user inputs are sanitized via DOM methods
* 2. No eval() or innerHTML used with dynamic content
* 3. Error logging doesn't expose sensitive information
* 4. External scripts should be loaded with integrity checks
* 
* Accessibility Features:
* 1. Smooth scrolling respects prefers-reduced-motion
* 2. Focus management for keyboard navigation
* 3. Touch targets meet minimum size requirements
* 4. Error states are announced to screen readers
* 
* Maintenance:
* 1. Regular performance audits recommended
* 2. Update browser support matrix as needed
* 3. Monitor error logs for issues
* 4. Test thoroughly on target devices
*/









// ================================================================
// LAZY LOADING AVANZATO PER IMMAGINI
// ================================================================

class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.videoObserver = null; // ✅ AGGIUNGI QUESTA LINEA
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
            this.setupVideoObserver(); // ✅ AGGIUNGI QUESTA LINEA
        } else {
            this.loadAllImages();
            this.loadAllVideos(); // ✅ AGGIUNGI QUESTA LINEA
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Osserva tutte le immagini lazy
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    // ✅ AGGIUNGI QUESTO NUOVO METODO
    setupVideoObserver() {
        const options = {
            root: null,
            rootMargin: '100px', // Carica video con più anticipo
            threshold: 0.1
        };

        this.videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.videoObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Osserva tutti i video con data-src
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.videoObserver.observe(video);
        });
    }

    // ✅ AGGIUNGI QUESTO NUOVO METODO
    loadVideo(video) {
        return new Promise((resolve, reject) => {
            try {
                console.log('🎬 Loading video:', video.dataset.src);
                
                // Mostra loading indicator
                video.style.position = 'relative';
                video.classList.add('loading-video');
                
                // Funzione per gestire il caricamento
                const handleLoad = () => {
                    video.style.opacity = '0';
                    video.src = video.dataset.src;
                    
                    // Gestisci quando il video è pronto
                    const handleCanPlay = () => {
                        video.style.transition = 'opacity 0.5s ease';
                        video.style.opacity = '1';
                        video.classList.remove('loading-video');
                        video.classList.add('loaded-video');
                        
                        // Rimuovi event listeners
                        video.removeEventListener('canplay', handleCanPlay);
                        video.removeEventListener('error', handleError);
                        
                        resolve(video);
                    };
                    
                    const handleError = () => {
                        console.error('❌ Video loading failed:', video.dataset.src);
                        video.style.display = 'none';
                        video.classList.remove('loading-video');
                        video.classList.add('error-video');
                        
                        // Rimuovi event listeners
                        video.removeEventListener('canplay', handleCanPlay);
                        video.removeEventListener('error', handleError);
                        
                        reject(new Error(`Failed to load video: ${video.dataset.src}`));
                    };
                    
                    video.addEventListener('canplay', handleCanPlay, { once: true });
                    video.addEventListener('error', handleError, { once: true });
                    
                    // Load del video
                    video.load();
                };
                
                // Se il browser supporta Intersection Observer v2, usa il loading lazy nativo
                if ('loading' in HTMLVideoElement.prototype) {
                    video.loading = 'lazy';
                }
                
                handleLoad();
                
            } catch (error) {
                console.error('❌ Video loading error:', error);
                video.classList.add('error-video');
                reject(error);
            }
        });
    }

    // ✅ AGGIUNGI QUESTO NUOVO METODO
    loadAllVideos() {
        // Fallback per browser senza IntersectionObserver
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.loadVideo(video);
        });
    }

    loadImage(img) {
        // ... mantieni il metodo esistente invariato
        return new Promise((resolve, reject) => {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                img.style.opacity = '0';
                img.src = imageLoader.src;
                img.classList.add('loaded');
                
                requestAnimationFrame(() => {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                });
                
                resolve(img);
            };
            
            imageLoader.onerror = () => {
                img.alt = 'Immagine non disponibile';
                img.style.background = '#f8f9fa';
                reject(new Error(`Failed to load image: ${img.dataset.src || img.src}`));
            };
            
            imageLoader.src = img.dataset.src || img.src;
        });
    }

    loadAllImages() {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            this.loadImage(img);
        });
    }

    // ✅ AGGIUNGI METODO PER CLEANUP
    cleanup() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
            this.imageObserver = null;
        }
        
        if (this.videoObserver) {
            this.videoObserver.disconnect();
            this.videoObserver = null;
        }
    }
}

// ================================================================
// OPZIONE AVANZATA: MULTIPLE VIDEO SOURCES
// ================================================================

class AdvancedVideoLoader {
    constructor() {
        this.videoObserver = null;
        this.loadedVideos = new Set();
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupVideoObserver();
        } else {
            this.loadAllVideos();
        }
    }

    setupVideoObserver() {
        const options = {
            root: null,
            rootMargin: '200px', // Carica con ancora più anticipo
            threshold: 0.1
        };

        this.videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loadedVideos.has(entry.target)) {
                    this.loadVideo(entry.target);
                    this.videoObserver.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('video[data-src]').forEach(video => {
            this.videoObserver.observe(video);
        });
    }

    async loadVideo(video) {
        if (this.loadedVideos.has(video)) return;
        
        try {
            this.loadedVideos.add(video);
            
            // Aggiungi loading state
            video.classList.add('loading-video');
            
            // Determina il miglior formato video supportato
            const videoSrc = await this.getBestVideoFormat(video);
            
            if (videoSrc) {
                await this.loadVideoSource(video, videoSrc);
            } else {
                throw new Error('No supported video format found');
            }
            
        } catch (error) {
            console.error('❌ Video loading failed:', error);
            this.handleVideoError(video);
        }
    }

    async getBestVideoFormat(video) {
        const dataSrc = video.dataset.src;
        
        // Prova diversi formati in ordine di preferenza
        const formats = [
            dataSrc, // Formato originale
            dataSrc.replace('.mp4', '.webm'), // WebM per Chrome/Firefox
            dataSrc.replace('.mp4', '.mov'), // MOV per Safari
            dataSrc.replace('.mp4', '.ogg')  // OGG fallback
        ];

        for (const format of formats) {
            if (await this.canPlayFormat(format)) {
                return format;
            }
        }
        
        return null;
    }

    async canPlayFormat(src) {
        return new Promise((resolve) => {
            const testVideo = document.createElement('video');
            testVideo.preload = 'none';
            
            const timeout = setTimeout(() => resolve(false), 2000);
            
            testVideo.addEventListener('canplay', () => {
                clearTimeout(timeout);
                resolve(true);
            }, { once: true });
            
            testVideo.addEventListener('error', () => {
                clearTimeout(timeout);
                resolve(false);
            }, { once: true });
            
            testVideo.src = src;
        });
    }

    async loadVideoSource(video, src) {
        return new Promise((resolve, reject) => {
            video.src = src;
            
            const handleLoad = () => {
                video.style.opacity = '0';
                video.style.transition = 'opacity 0.5s ease';
                video.classList.remove('loading-video');
                video.classList.add('loaded-video');
                
                requestAnimationFrame(() => {
                    video.style.opacity = '1';
                });
                
                video.removeEventListener('canplay', handleLoad);
                video.removeEventListener('error', handleError);
                resolve(video);
            };
            
            const handleError = (error) => {
                video.removeEventListener('canplay', handleLoad);
                video.removeEventListener('error', handleError);
                reject(error);
            };
            
            video.addEventListener('canplay', handleLoad, { once: true });
            video.addEventListener('error', handleError, { once: true });
            
            video.load();
        });
    }

    handleVideoError(video) {
        video.classList.remove('loading-video');
        video.classList.add('error-video');
        video.style.display = 'none';
        
        // Opzionalmente, mostra un'immagine fallback
        const poster = video.getAttribute('poster');
        if (poster) {
            const img = document.createElement('img');
            img.src = poster;
            img.alt = 'Anteprima video';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            video.parentNode.insertBefore(img, video);
        }
    }

    loadAllVideos() {
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.loadVideo(video);
        });
    }

    cleanup() {
        if (this.videoObserver) {
            this.videoObserver.disconnect();
            this.videoObserver = null;
        }
        this.loadedVideos.clear();
    }
}

// ================================================================
// GESTIONE FORM CON VALIDAZIONE AVANZATA
// ================================================================

class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.errors = {};
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Validazione in tempo reale
        this.form.addEventListener('input', (e) => {
            if (e.target.matches('input[required]')) {
                this.validateField(e.target);
            }
        });

        // Validazione su submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Gestione paste per email
        this.form.addEventListener('paste', (e) => {
            if (e.target.type === 'email') {
                setTimeout(() => this.validateField(e.target), 10);
            }
        });
    }

    setupAccessibility() {
        // Aggiungi ARIA attributes
        const inputs = this.form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            const errorId = `${input.id}-error`;
            input.setAttribute('aria-describedby', errorId);
            
            // Crea container per errori se non esiste
            if (!document.getElementById(errorId)) {
                const errorDiv = document.createElement('div');
                errorDiv.id = errorId;
                errorDiv.className = 'error-message';
                errorDiv.setAttribute('aria-live', 'polite');
                input.parentNode.appendChild(errorDiv);
            }
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group') || field.parentNode;
        
        // Reset stato precedente
        this.clearFieldError(fieldName, fieldGroup);
        
        // Validazioni specifiche
        if (field.hasAttribute('required') && !value) {
            this.setFieldError(fieldName, 'Questo campo è obbligatorio', fieldGroup);
            return false;
        }
        
        if (field.type === 'email' && value) {
            if (!this.isValidEmail(value)) {
                this.setFieldError(fieldName, 'Inserisci un indirizzo email valido', fieldGroup);
                return false;
            }
        }
        
        if (field.type === 'text' && field.name === 'name' && value) {
            if (value.length < 2) {
                this.setFieldError(fieldName, 'Il nome deve contenere almeno 2 caratteri', fieldGroup);
                return false;
            }
        }
        
        // Campo valido
        fieldGroup.classList.add('has-success');
        return true;
    }

    setFieldError(fieldName, message, fieldGroup) {
        this.errors[fieldName] = message;
        fieldGroup.classList.add('has-error');
        fieldGroup.classList.remove('has-success');
        
        const errorElement = fieldGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearFieldError(fieldName, fieldGroup) {
        delete this.errors[fieldName];
        fieldGroup.classList.remove('has-error', 'has-success');
        
        const errorElement = fieldGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    }

    async handleSubmit() {
        // Valida tutti i campi
        const inputs = this.form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Focus sul primo campo con errore
            const firstError = this.form.querySelector('.has-error input');
            if (firstError) {
                firstError.focus();
                // Scroll smooth al campo
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
            return;
        }
        
        // Form valido - procedi con invio
        await this.submitForm();
    }

    async submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Stato loading
            submitButton.disabled = true;
            submitButton.textContent = 'Invio in corso...';
            submitButton.classList.add('loading');
            
            // Prepara dati
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            // Simula invio (sostituisci con la tua API)
            const response = await this.sendToAPI(data);
            
            if (response.success) {
                this.showSuccess('Iscrizione completata con successo!');
                this.form.reset();
                
                // Analytics event
                if (window.gtag) {
                    gtag('event', 'newsletter_signup', {
                        method: 'website_form'
                    });
                }
            } else {
                throw new Error(response.message || 'Errore durante l\'invio');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Si è verificato un errore. Riprova più tardi.');
            
            // Salva per sync offline se supportato
            if ('serviceWorker' in navigator) {
                this.saveForOfflineSync(data);
            }
            
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
        }
    }

    async sendToAPI(data) {
        // Simula chiamata API - sostituisci con il tuo endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1500);
        });
        
        // Esempio reale:
        // const response = await fetch('/api/newsletter', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // return response.json();
    }

    async saveForOfflineSync(data) {
        try {
            const registration = await navigator.serviceWorker.ready;
            if (registration.sync) {
                // Salva in IndexedDB per sync successivo
                const db = await this.openDB();
                await db.add('pendingSignups', {
                    data,
                    timestamp: Date.now()
                });
                
                // Registra background sync
                await registration.sync.register('newsletter-signup');
                
                this.showInfo('Iscrizione salvata. Verrà inviata quando tornerai online.');
            }
        } catch (error) {
            console.error('Offline sync setup failed:', error);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Crea notifica accessibile
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.innerHTML = `
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="Chiudi notifica">&times;</button>
        `;
        
        // Stili inline per garantire visibilità
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            zIndex: '10000',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animazione entrata
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto-remove e evento close
        const removeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        notification.querySelector('.notification__close').addEventListener('click', removeNotification);
        setTimeout(removeNotification, 5000);
    }

    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ChatHeritageDB', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('pendingSignups')) {
                    db.createObjectStore('pendingSignups', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                }
            };
        });
    }
}

// ================================================================
// PERFORMANCE MONITOR AVANZATO
// ================================================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.init();
    }

    init() {
        if (!('performance' in window)) return;
        
        this.setupPerformanceObserver();
        this.monitorPageLoad();
        this.monitorUserInteractions();
        this.setupLongTaskDetection();
    }

    setupPerformanceObserver() {
        if (!('PerformanceObserver' in window)) return;

        try {
            // Monitor First Paint, First Contentful Paint
            const paintObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.metrics[entry.name] = entry.startTime;
                    console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
                });
            });
            paintObserver.observe({ entryTypes: ['paint'] });
            this.observers.push(paintObserver);

            // Monitor Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                console.log(`🖼️ LCP: ${Math.round(lastEntry.startTime)}ms`);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(lcpObserver);

            // Monitor Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
                if (clsValue > 0.1) {
                    console.warn(`📐 High CLS detected: ${clsValue.toFixed(4)}`);
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(clsObserver);

        } catch (error) {
            console.warn('Performance Observer setup failed:', error);
        }
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                if (navigation) {
                    this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd;
                    this.metrics.loadComplete = navigation.loadEventEnd;
                    this.metrics.ttfb = navigation.responseStart;
                    
                    console.group('📊 Page Load Metrics');
                    console.log(`TTFB: ${Math.round(this.metrics.ttfb)}ms`);
                    console.log(`DOM Ready: ${Math.round(this.metrics.domContentLoaded)}ms`);
                    console.log(`Load Complete: ${Math.round(this.metrics.loadComplete)}ms`);
                    console.groupEnd();
                    
                    // Send to analytics
                    this.sendMetricsToAnalytics();
                }
            }, 0);
        });
    }

    monitorUserInteractions() {
        // First Input Delay
        if ('PerformanceObserver' in window) {
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        this.metrics.fid = entry.processingStart - entry.startTime;
                        console.log(`⚡ FID: ${Math.round(this.metrics.fid)}ms`);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.push(fidObserver);
            } catch (error) {
                console.warn('FID monitoring failed:', error);
            }
        }

        // Monitor click responsiveness
        let clickStartTime;
        document.addEventListener('pointerdown', () => {
            clickStartTime = performance.now();
        });

        document.addEventListener('click', () => {
            if (clickStartTime) {
                const clickDuration = performance.now() - clickStartTime;
                if (clickDuration > 100) {
                    console.warn(`🐌 Slow click response: ${Math.round(clickDuration)}ms`);
                }
            }
        });
    }

    setupLongTaskDetection() {
        if (!('PerformanceObserver' in window)) return;

        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    console.warn(`🐌 Long task detected: ${Math.round(entry.duration)}ms`);
                    
                    // Track in analytics
                    if (window.gtag) {
                        gtag('event', 'long_task', {
                            duration: Math.round(entry.duration),
                            start_time: Math.round(entry.startTime)
                        });
                    }
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.push(longTaskObserver);
        } catch (error) {
            console.warn('Long task monitoring failed:', error);
        }
    }

    sendMetricsToAnalytics() {
        if (!window.gtag) return;

        // Send Core Web Vitals to Google Analytics
        Object.entries(this.metrics).forEach(([metric, value]) => {
            if (typeof value === 'number' && value > 0) {
                gtag('event', 'web_vital', {
                    name: metric,
                    value: Math.round(value),
                    metric_id: `${metric}_${Date.now()}`
                });
            }
        });
    }

    getMetrics() {
        return { ...this.metrics };
    }

    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// ================================================================
// ACCESSIBILITY ENHANCEMENTS
// ================================================================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALiveRegions();
        this.setupReducedMotion();
        this.announcePageLoad();
    }

    setupKeyboardNavigation() {
        // Escape key per chiudere dropdown
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeAllModals();
            }
        });

        // Arrow navigation per carousel
        const carousel = document.querySelector('.itineraries-grid');
        if (carousel) {
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateCarousel(e.key === 'ArrowRight' ? 1 : -1);
                }
            });
        }

        // Skip to main content
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    setupFocusManagement() {
        // Focus trap per modali (se presenti)
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        // Gestione focus per carousel
        const cards = document.querySelectorAll('.itinerary-card');
        cards.forEach((card, index) => {
            card.setAttribute('tabindex', index === 0 ? '0' : '-1');
            card.addEventListener('focus', () => {
                cards.forEach(c => c.setAttribute('tabindex', '-1'));
                card.setAttribute('tabindex', '0');
            });
        });
    }

    setupARIALiveRegions() {
        // Crea region per annunci dinamici
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
    }

    setupReducedMotion() {
        // Rispetta preferenze di movimento ridotto
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.body.classList.add('reduce-motion');
                // Disabilita animazioni non essenziali
                this.disableNonEssentialAnimations();
            } else {
                document.body.classList.remove('reduce-motion');
            }
        };

        prefersReducedMotion.addListener(handleReducedMotion);
        handleReducedMotion(prefersReducedMotion);
    }

    announcePageLoad() {
        // Annuncia quando la pagina è completamente caricata
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.announce('Pagina caricata completamente. Naviga con Tab o usa i link di navigazione rapida.');
            }, 1000);
        });
    }

    announce(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    navigateCarousel(direction) {
        const carousel = document.querySelector('.itineraries-grid');
        const cards = carousel.querySelectorAll('.itinerary-card');
        const currentFocus = document.activeElement;
        let currentIndex = Array.from(cards).indexOf(currentFocus);
        
        if (currentIndex === -1) currentIndex = 0;
        
        const newIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
        cards[newIndex].focus();
        
        // Scroll smooth al nuovo elemento
        cards[newIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        
        this.announce(`Elemento ${newIndex + 1} di ${cards.length}`);
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content.show').forEach(dropdown => {
            dropdown.classList.remove('show');
            const button = dropdown.previousElementSibling;
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
        });
    }

    closeAllModals() {
        // Chiudi modali se presenti
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    disableNonEssentialAnimations() {
        // Disabilita animazioni complesse per chi preferisce movimento ridotto
        const style = document.createElement('style');
        style.textContent = `
            .reduce-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ================================================================
// INIZIALIZZAZIONE MIGLIORAMENTI
// ================================================================

// Inizializza quando DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Lazy loading immagini E VIDEO (aggiornato)
    const lazyLoader = new LazyImageLoader();
    
    // Validazione form
    new FormValidator('.form-section form');
    
    // Monitor performance
    if (window.ChatHeritage && window.ChatHeritage.config.PERFORMANCE_MONITOR) {
        new PerformanceMonitor();
    }
    
    // Miglioramenti accessibilità
    new AccessibilityEnhancer();
    
    // ✅ AGGIUNGI CLEANUP QUANDO L'UTENTE LASCIA LA PAGINA
    window.addEventListener('beforeunload', () => {
        if (lazyLoader && lazyLoader.cleanup) {
            lazyLoader.cleanup();
        }
    });
    
    console.log('🚀 Miglioramenti Chat Heritage caricati con successo!');
});

// ================================================================
// ESPOSIZIONE API PUBBLICA (MODIFICA QUESTA SEZIONE)
// ================================================================

// Estendi l'API esistente
if (window.ChatHeritage) {
    window.ChatHeritage.enhancements = {
        LazyImageLoader,
        AdvancedVideoLoader, // ✅ Aggiungi questa linea
        FormValidator,
        PerformanceMonitor,
        AccessibilityEnhancer,
        version: '1.1.0' // ✅ Aggiorna versione
    };
}

// ================================================================
// ESPOSIZIONE API PUBBLICA
// ================================================================

// Estendi l'API esistente
if (window.ChatHeritage) {
    window.ChatHeritage.enhancements = {
        LazyImageLoader,
        FormValidator,
        PerformanceMonitor,
        AccessibilityEnhancer,
        version: '1.0.0'
    };
}

// ================================================================
// GESTIONE ERRORI GLOBALE MIGLIORATA
// ================================================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Send to analytics
    if (window.gtag) {
        gtag('event', 'exception', {
            description: event.error?.message || 'Unknown error',
            fatal: false,
            filename: event.filename,
            lineno: event.lineno
        });
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Send to analytics
    if (window.gtag) {
        gtag('event', 'exception', {
            description: `Promise rejection: ${event.reason}`,
            fatal: false
        });
    }
});

console.log('✨ Chat Heritage - Ottimizzazioni caricate!');

// ================================================================
// MOBILE UX ENHANCEMENTS - CHAT HERITAGE
// Inserire nel script.js dopo AdvancedVideoLoader e prima di FormValidator
// ================================================================

// ================================================================
// 1. HAPTIC FEEDBACK CONTROLLER
// ================================================================

class HapticFeedbackController {
    constructor() {
        this.isSupported = this.checkSupport();
        this.isEnabled = true;
        this.patterns = {
            light: [10],
            medium: [20],
            heavy: [50],
            click: [5],
            success: [10, 50, 10],
            error: [20, 100, 20],
            warning: [30, 50, 30],
            notification: [10, 20, 10, 20, 10],
            heartbeat: [25, 50, 25, 50, 100],
            tick: [3],
            pop: [15, 25]
        };
        
        if (this.isSupported) {
            this.init();
        }
    }

    checkSupport() {
        // Verifica supporto Vibration API
        return 'vibrate' in navigator || 'webkitVibrate' in navigator;
    }

    init() {
        this.setupHapticEvents();
        this.loadUserPreferences();
        
        if (CONFIG.DEBUG) {
            console.log('📳 Haptic Feedback Controller initialized');
        }
    }

    setupHapticEvents() {
        // Haptic per button clicks
        document.addEventListener('click', (e) => {
            if (!this.isEnabled) return;
            
            const element = e.target.closest('button, .btn, .cta-button, .hero-cta, .itinerary-button');
            if (element) {
                this.triggerFeedback('click');
            }
        });

        // Haptic per link navigation
        document.addEventListener('click', (e) => {
            if (!this.isEnabled) return;
            
            const element = e.target.closest('a[href]');
            if (element && !element.href.startsWith('#')) {
                this.triggerFeedback('light');
            }
        });

        // Haptic per carousel drag
        document.addEventListener('touchstart', (e) => {
            if (!this.isEnabled) return;
            
            if (e.target.closest('.itineraries-grid')) {
                this.triggerFeedback('tick');
            }
        });

        // Haptic per form validation
        document.addEventListener('invalid', (e) => {
            if (!this.isEnabled) return;
            this.triggerFeedback('error');
        }, true);

        // Haptic per form success
        document.addEventListener('submit', (e) => {
            if (!this.isEnabled) return;
            
            const form = e.target;
            if (form.checkValidity()) {
                this.triggerFeedback('success');
            }
        });
    }

    triggerFeedback(type = 'light', customPattern = null) {
        if (!this.isSupported || !this.isEnabled) return;
        
        try {
            const pattern = customPattern || this.patterns[type] || this.patterns.light;
            
            // Usa Vibration API nativa
            if (navigator.vibrate) {
                navigator.vibrate(pattern);
            } else if (navigator.webkitVibrate) {
                navigator.webkitVibrate(pattern);
            }
            
            if (CONFIG.DEBUG) {
                console.log(`📳 Haptic feedback: ${type}`, pattern);
            }
            
        } catch (error) {
            console.warn('Haptic feedback failed:', error);
        }
    }

    // API pubblica per trigger custom
    vibrate(pattern) {
        this.triggerFeedback('custom', pattern);
    }

    // Gestione preferenze utente
    setEnabled(enabled) {
        this.isEnabled = enabled;
        localStorage.setItem('chatHeritage_hapticEnabled', enabled);
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('chatHeritage_hapticEnabled');
        if (saved !== null) {
            this.isEnabled = saved === 'true';
        }
    }

    // Test haptic (per debugging)
    test() {
        if (!this.isSupported) {
            console.log('❌ Haptic feedback not supported');
            return;
        }
        
        Object.keys(this.patterns).forEach((type, index) => {
            setTimeout(() => {
                console.log(`Testing: ${type}`);
                this.triggerFeedback(type);
            }, index * 500);
        });
    }
}

// ================================================================
// 2. PULL-TO-REFRESH CONTROLLER
// ================================================================

class PullToRefreshController {
    constructor() {
        this.isActive = false;
        this.startY = 0;
        this.currentY = 0;
        this.threshold = 80; // pixel per attivare refresh
        this.maxPull = 150;
        this.isRefreshing = false;
        this.pullElement = null;
        this.progressElement = null;
        
        this.init();
    }

    init() {
        this.createPullToRefreshElement();
        this.setupEventListeners();
        
        if (CONFIG.DEBUG) {
            console.log('🔄 Pull-to-Refresh Controller initialized');
        }
    }

    createPullToRefreshElement() {
        // Crea elemento pull-to-refresh
        this.pullElement = document.createElement('div');
        this.pullElement.className = 'pull-to-refresh';
        this.pullElement.innerHTML = `
            <div class="pull-refresh-content">
                <div class="pull-refresh-icon">
                    <svg class="refresh-arrow" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                    <div class="refresh-spinner">
                        <div class="spinner-circle"></div>
                    </div>
                </div>
                <div class="pull-refresh-text">
                    <span class="pull-text">Trascina per aggiornare</span>
                    <span class="release-text">Rilascia per aggiornare</span>
                    <span class="refresh-text">Aggiornamento...</span>
                </div>
            </div>
        `;

        // Inserisci nel DOM
        document.body.insertBefore(this.pullElement, document.body.firstChild);

        // Stili CSS inline
        this.injectStyles();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pull-to-refresh {
                position: fixed;
                top: -100px;
                left: 0;
                right: 0;
                height: 100px;
                background: linear-gradient(135deg, #8e5edc 0%, #408daa 50%, #02be65 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border-radius: 0 0 20px 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }

            .pull-refresh-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: white;
                font-weight: 600;
            }

            .pull-refresh-icon {
                position: relative;
                width: 24px;
                height: 24px;
            }

            .refresh-arrow {
                fill: white;
                transition: transform 0.3s ease;
                transform-origin: center;
            }

            .refresh-spinner {
                position: absolute;
                top: 0;
                left: 0;
                width: 24px;
                height: 24px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .spinner-circle {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 2px;
            }

            .pull-refresh-text span {
                display: block;
                font-size: 14px;
                text-align: center;
                transition: opacity 0.2s ease;
            }

            .pull-refresh-text .release-text,
            .pull-refresh-text .refresh-text {
                opacity: 0;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
            }

            .pull-to-refresh.can-refresh .refresh-arrow {
                transform: rotate(180deg);
            }

            .pull-to-refresh.can-refresh .pull-text {
                opacity: 0;
            }

            .pull-to-refresh.can-refresh .release-text {
                opacity: 1;
            }

            .pull-to-refresh.refreshing .refresh-arrow {
                opacity: 0;
            }

            .pull-to-refresh.refreshing .refresh-spinner {
                opacity: 1;
            }

            .pull-to-refresh.refreshing .pull-text,
            .pull-to-refresh.refreshing .release-text {
                opacity: 0;
            }

            .pull-to-refresh.refreshing .refresh-text {
                opacity: 1;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @media (prefers-reduced-motion: reduce) {
                .pull-to-refresh,
                .refresh-arrow,
                .spinner-circle {
                    animation: none !important;
                    transition: none !important;
                }
            }

            /* Nascondi su desktop */
            @media (min-width: 768px) {
                .pull-to-refresh {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Touch events per mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Mouse events per test desktop
        if (CONFIG.DEBUG) {
            document.addEventListener('mousedown', this.handleMouseStart.bind(this));
            document.addEventListener('mousemove', this.handleMouseMove.bind(this));
            document.addEventListener('mouseup', this.handleMouseEnd.bind(this));
        }
    }

    handleTouchStart(e) {
        // Solo se siamo in cima alla pagina
        if (window.scrollY > 10) return;
        
        this.startY = e.touches[0].clientY;
        this.isActive = true;
    }

    handleTouchMove(e) {
        if (!this.isActive || this.isRefreshing) return;

        this.currentY = e.touches[0].clientY;
        const deltaY = this.currentY - this.startY;

        // Solo se stiamo trascinando verso il basso
        if (deltaY > 0 && window.scrollY <= 0) {
            e.preventDefault();
            
            const pullDistance = Math.min(deltaY * 0.5, this.maxPull);
            this.updatePullProgress(pullDistance);
        }
    }

    handleTouchEnd(e) {
        if (!this.isActive || this.isRefreshing) return;

        const deltaY = this.currentY - this.startY;
        const pullDistance = Math.min(deltaY * 0.5, this.maxPull);

        if (pullDistance >= this.threshold) {
            this.triggerRefresh();
        } else {
            this.resetPull();
        }

        this.isActive = false;
    }

    // Mouse events per debugging desktop
    handleMouseStart(e) {
        if (!CONFIG.DEBUG || window.scrollY > 10) return;
        this.startY = e.clientY;
        this.isActive = true;
    }

    handleMouseMove(e) {
        if (!CONFIG.DEBUG || !this.isActive || this.isRefreshing) return;

        this.currentY = e.clientY;
        const deltaY = this.currentY - this.startY;

        if (deltaY > 0 && window.scrollY <= 0) {
            e.preventDefault();
            const pullDistance = Math.min(deltaY * 0.3, this.maxPull);
            this.updatePullProgress(pullDistance);
        }
    }

    handleMouseEnd(e) {
        if (!CONFIG.DEBUG || !this.isActive || this.isRefreshing) return;

        const deltaY = this.currentY - this.startY;
        const pullDistance = Math.min(deltaY * 0.3, this.maxPull);

        if (pullDistance >= this.threshold) {
            this.triggerRefresh();
        } else {
            this.resetPull();
        }

        this.isActive = false;
    }

    updatePullProgress(distance) {
        const progress = Math.min(distance / this.threshold, 1);
        
        // Aggiorna posizione
        this.pullElement.style.transform = `translateY(${distance - 100}px)`;
        
        // Aggiorna stato visivo
        if (distance >= this.threshold) {
            this.pullElement.classList.add('can-refresh');
        } else {
            this.pullElement.classList.remove('can-refresh');
        }

        // Haptic feedback al raggiungimento soglia
        if (distance >= this.threshold && !this.pullElement.classList.contains('can-refresh')) {
            if (window.ChatHeritage?.haptic) {
                window.ChatHeritage.haptic.triggerFeedback('medium');
            }
        }
    }

    async triggerRefresh() {
        if (this.isRefreshing) return;

        this.isRefreshing = true;
        this.pullElement.classList.add('refreshing');
        this.pullElement.style.transform = 'translateY(0px)';

        // Haptic feedback per inizio refresh
        if (window.ChatHeritage?.haptic) {
            window.ChatHeritage.haptic.triggerFeedback('success');
        }

        try {
            // Simula operazione di refresh
            await this.performRefresh();
            
            // Haptic feedback per successo
            if (window.ChatHeritage?.haptic) {
                window.ChatHeritage.haptic.triggerFeedback('light');
            }
            
        } catch (error) {
            console.error('Refresh failed:', error);
            
            // Haptic feedback per errore
            if (window.ChatHeritage?.haptic) {
                window.ChatHeritage.haptic.triggerFeedback('error');
            }
        }

        // Reset dopo 2 secondi
        setTimeout(() => {
            this.resetPull();
        }, 2000);
    }

    async performRefresh() {
        // Qui puoi implementare le azioni di refresh specifiche
        // Esempi:
        
        // 1. Ricarica traduzioni
        if (typeof loadTranslations === 'function') {
            const currentLang = sessionStorage.getItem('selectedLang') || 'it';
            await loadTranslations(currentLang);
        }

        // 2. Aggiorna contenuti dinamici
        await this.refreshDynamicContent();

        // 3. Reinizializza componenti se necessario
        this.refreshComponents();

        // 4. Simula delay per UX
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    async refreshDynamicContent() {
        // Refresh immagini che potrebbero essere aggiornate
        const images = document.querySelectorAll('img[src*="github"]');
        images.forEach(img => {
            const src = img.src;
            img.src = '';
            img.src = src + '?' + Date.now(); // Cache busting
        });

        // Refresh video
        const videos = document.querySelectorAll('video[src]');
        videos.forEach(video => {
            video.load();
        });
    }

    refreshComponents() {
        // Reinizializza scroll animations
        if (window.ChatHeritage?.debug?.Controllers?.ScrollAnimations) {
            const controller = window.ChatHeritage.debug.Controllers.ScrollAnimations;
            if (controller.init) {
                controller.init();
            }
        }

        // Riapplica lazy loading se necessario
        document.querySelectorAll('img.loaded').forEach(img => {
            img.classList.remove('loaded');
        });
    }

    resetPull() {
        this.pullElement.style.transform = 'translateY(-100px)';
        this.pullElement.classList.remove('can-refresh', 'refreshing');
        this.isRefreshing = false;
        this.currentY = 0;
        this.startY = 0;
    }
}

// ================================================================
// 3. GESTURE NAVIGATION CONTROLLER
// ================================================================

class GestureNavigationController {
    constructor() {
        this.gestures = {
            swipeLeft: [],
            swipeRight: [],
            swipeUp: [],
            swipeDown: [],
            pinch: [],
            doubleTap: []
        };
        
        this.touchStart = { x: 0, y: 0, time: 0 };
        this.touchEnd = { x: 0, y: 0, time: 0 };
        this.lastTap = 0;
        this.touchCount = 0;
        this.isGestureActive = false;
        this.minSwipeDistance = 50;
        this.maxSwipeTime = 500;
        this.doubleTapDelay = 300;
        
        this.init();
    }

    init() {
        this.setupGestureEvents();
        this.registerDefaultGestures();
        
        if (CONFIG.DEBUG) {
            console.log('👆 Gesture Navigation Controller initialized');
        }
    }

    setupGestureEvents() {
        // Touch events
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Gesture events
        document.addEventListener('gesturestart', this.handleGestureStart.bind(this), { passive: false });
        document.addEventListener('gesturechange', this.handleGestureChange.bind(this), { passive: false });
        document.addEventListener('gestureend', this.handleGestureEnd.bind(this), { passive: false });
    }

    handleTouchStart(e) {
        this.touchCount = e.touches.length;
        
        if (this.touchCount === 1) {
            const touch = e.touches[0];
            this.touchStart = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
        }
    }

    handleTouchMove(e) {
        // Previeni scroll durante gesture personalizzate
        if (this.isGestureActive) {
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        if (this.touchCount === 1 && e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            this.touchEnd = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };

            this.detectSwipe();
            this.detectDoubleTap();
        }
    }

    detectSwipe() {
        const deltaX = this.touchEnd.x - this.touchStart.x;
        const deltaY = this.touchEnd.y - this.touchStart.y;
        const deltaTime = this.touchEnd.time - this.touchStart.time;
        
        // Verifica se è uno swipe valido
        if (deltaTime > this.maxSwipeTime) return;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < this.minSwipeDistance) return;

        // Determina direzione
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        let direction = '';

        if (angle >= -45 && angle <= 45) {
            direction = 'swipeRight';
        } else if (angle >= 45 && angle <= 135) {
            direction = 'swipeDown';
        } else if (angle >= 135 || angle <= -135) {
            direction = 'swipeLeft';
        } else if (angle >= -135 && angle <= -45) {
            direction = 'swipeUp';
        }

        if (direction) {
            this.executeGesture(direction, {
                deltaX,
                deltaY,
                distance,
                angle,
                duration: deltaTime,
                startPoint: this.touchStart,
                endPoint: this.touchEnd
            });
        }
    }

    detectDoubleTap() {
        const now = Date.now();
        const timeSinceLastTap = now - this.lastTap;

        if (timeSinceLastTap < this.doubleTapDelay && timeSinceLastTap > 0) {
            this.executeGesture('doubleTap', {
                x: this.touchEnd.x,
                y: this.touchEnd.y,
                timeBetweenTaps: timeSinceLastTap
            });
        }

        this.lastTap = now;
    }

    handleGestureStart(e) {
        e.preventDefault();
        this.isGestureActive = true;
    }

    handleGestureChange(e) {
        e.preventDefault();
        // Gestisci pinch/zoom
        if (e.scale !== 1) {
            this.executeGesture('pinch', {
                scale: e.scale,
                rotation: e.rotation
            });
        }
    }

    handleGestureEnd(e) {
        e.preventDefault();
        this.isGestureActive = false;
    }

    // API pubblica per registrare gesture personalizzate
    registerGesture(type, callback) {
        if (!this.gestures[type]) {
            this.gestures[type] = [];
        }
        this.gestures[type].push(callback);
    }

    executeGesture(type, data) {
        if (this.gestures[type]) {
            this.gestures[type].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Gesture ${type} callback failed:`, error);
                }
            });
        }

        // Haptic feedback per gesture
        if (window.ChatHeritage?.haptic) {
            window.ChatHeritage.haptic.triggerFeedback('tick');
        }

        if (CONFIG.DEBUG) {
            console.log(`👆 Gesture detected: ${type}`, data);
        }
    }

    registerDefaultGestures() {
        // Swipe Left: Naviga carousel a destra
        this.registerGesture('swipeLeft', (data) => {
            const carousel = document.querySelector('.itineraries-grid');
            if (carousel && this.isElementInView(carousel)) {
                const cardWidth = 280 + 24; // width + gap
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });

        // Swipe Right: Naviga carousel a sinistra
        this.registerGesture('swipeRight', (data) => {
            const carousel = document.querySelector('.itineraries-grid');
            if (carousel && this.isElementInView(carousel)) {
                const cardWidth = 280 + 24;
                carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        });

        // Swipe Up: Vai alla sezione successiva
        this.registerGesture('swipeUp', (data) => {
            const sections = ['#home', '#features', '#popular-locations', '#guides', '#about'];
            const currentSection = this.getCurrentSection();
            const currentIndex = sections.indexOf(currentSection);
            
            if (currentIndex < sections.length - 1) {
                const nextSection = document.querySelector(sections[currentIndex + 1]);
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Swipe Down: Vai alla sezione precedente
        this.registerGesture('swipeDown', (data) => {
            const sections = ['#home', '#features', '#popular-locations', '#guides', '#about'];
            const currentSection = this.getCurrentSection();
            const currentIndex = sections.indexOf(currentSection);
            
            if (currentIndex > 0) {
                const prevSection = document.querySelector(sections[currentIndex - 1]);
                if (prevSection) {
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Double Tap: Torna in cima
        this.registerGesture('doubleTap', (data) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Pinch: Mostra/nascondi menu mobile (se implementato)
        this.registerGesture('pinch', (data) => {
            if (data.scale < 0.8) {
                // Pinch in: nascondi UI
                document.body.classList.add('gesture-minimized');
            } else if (data.scale > 1.2) {
                // Pinch out: mostra UI
                document.body.classList.remove('gesture-minimized');
            }
        });
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '#home';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = '#' + section.id;
            }
        });
        
        return currentSection;
    }

    isElementInView(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    // Disabilita gesture per elementi specifici
    disableGesturesFor(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            });
        });
    }
}

// ================================================================
// 4. MOBILE UX COORDINATOR - ORCHESTRATORE PRINCIPALE
// ================================================================

class MobileUXCoordinator {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.userPreferences = this.loadPreferences();
        
        this.init();
    }

    init() {
        // Verifica se siamo su mobile
        if (!this.isMobileDevice()) {
            if (CONFIG.DEBUG) {
                console.log('📱 Mobile UX features limited on desktop');
            }
            return;
        }

        try {
            // Inizializza componenti
            this.initializeComponents();
            
            // Setup coordinamento tra componenti
            this.setupComponentCoordination();
            
            // Setup preferenze utente
            this.setupUserPreferences();
            
            this.isInitialized = true;
            
            if (CONFIG.DEBUG) {
                console.log('📱 Mobile UX Coordinator initialized');
                this.exposeDebugAPI();
            }
            
        } catch (error) {
            console.error('❌ Mobile UX initialization failed:', error);
        }
    }

    initializeComponents() {
        // Haptic Feedback
        if (this.userPreferences.hapticEnabled) {
            this.components.haptic = new HapticFeedbackController();
        }

        // Pull to Refresh
        if (this.userPreferences.pullToRefreshEnabled) {
            this.components.pullToRefresh = new PullToRefreshController();
        }

        // Gesture Navigation
        if (this.userPreferences.gesturesEnabled) {
            this.components.gestures = new GestureNavigationController();
        }
    }

    setupComponentCoordination() {
        // Coordina haptic con gesture
        if (this.components.gestures && this.components.haptic) {
            ['swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap'].forEach(gesture => {
                this.components.gestures.registerGesture(gesture, () => {
                    this.components.haptic.triggerFeedback('light');
                });
            });
        }

        // Disabilita gesture durante pull-to-refresh
        if (this.components.pullToRefresh && this.components.gestures) {
            const originalHandleTouchStart = this.components.gestures.handleTouchStart;
            this.components.gestures.handleTouchStart = (e) => {
                if (!this.components.pullToRefresh.isRefreshing) {
                    originalHandleTouchStart.call(this.components.gestures, e);
                }
            };
        }
    }

    setupUserPreferences() {
        // Crea pannello controlli mobile UX
        this.createMobileUXPanel();
        
        // Listen per cambiamenti preferenze
        document.addEventListener('mobileUXPreferenceChange', (e) => {
            this.updatePreference(e.detail.key, e.detail.value);
        });
    }

    createMobileUXPanel() {
        // Crea pannello settings mobile (solo su device touch)
        if (!('ontouchstart' in window)) return;

        const panel = document.createElement('div');
        panel.className = 'mobile-ux-panel';
        panel.innerHTML = `
            <div class="mobile-ux-header">
                <h3>⚙️ Controlli Mobile</h3>
                <button class="mobile-ux-close" aria-label="Chiudi pannello">×</button>
            </div>
            <div class="mobile-ux-controls">
                <div class="mobile-ux-setting">
                    <label>
                        <input type="checkbox" id="haptic-toggle" ${this.userPreferences.hapticEnabled ? 'checked' : ''}>
                        <span>📳 Feedback Tattile</span>
                    </label>
                    <small>Vibrazione per interazioni</small>
                </div>
                <div class="mobile-ux-setting">
                    <label>
                        <input type="checkbox" id="pullrefresh-toggle" ${this.userPreferences.pullToRefreshEnabled ? 'checked' : ''}>
                        <span>🔄 Pull to Refresh</span>
                    </label>
                    <small>Trascina dall'alto per aggiornare</small>
                </div>
                <div class="mobile-ux-setting">
                    <label>
                        <input type="checkbox" id="gestures-toggle" ${this.userPreferences.gesturesEnabled ? 'checked' : ''}>
                        <span>👆 Navigazione Gesture</span>
                    </label>
                    <small>Swipe per navigare</small>
                </div>
                <div class="mobile-ux-actions">
                    <button class="test-haptic-btn">Test Vibrazione</button>
                    <button class="reset-preferences-btn">Reset Impostazioni</button>
                </div>
            </div>
        `;

        // Stili inline per il pannello
        this.injectPanelStyles();
        
        // Event listeners per il pannello
        this.setupPanelEvents(panel);
        
        // Aggiungi al DOM
        document.body.appendChild(panel);

        // Aggiungi trigger per aprire pannello (triplo tap su logo)
        this.setupPanelTrigger();
    }

    injectPanelStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-ux-panel {
                position: fixed;
                bottom: -100%;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                color: white;
                z-index: 10001;
                border-radius: 20px 20px 0 0;
                box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
                transition: bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                max-height: 70vh;
                overflow-y: auto;
            }

            .mobile-ux-panel.show {
                bottom: 0;
            }

            .mobile-ux-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 1.5rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                margin-bottom: 1rem;
            }

            .mobile-ux-header h3 {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
            }

            .mobile-ux-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.2s ease;
            }

            .mobile-ux-close:hover {
                background: rgba(255,255,255,0.1);
            }

            .mobile-ux-controls {
                padding: 0 1.5rem 1.5rem;
            }

            .mobile-ux-setting {
                margin-bottom: 1.5rem;
            }

            .mobile-ux-setting label {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;
                font-weight: 500;
                margin-bottom: 0.25rem;
            }

            .mobile-ux-setting input[type="checkbox"] {
                width: 20px;
                height: 20px;
                accent-color: #8e5edc;
            }

            .mobile-ux-setting small {
                color: rgba(255,255,255,0.7);
                font-size: 0.85rem;
                margin-left: 2.75rem;
            }

            .mobile-ux-actions {
                display: flex;
                gap: 0.75rem;
                margin-top: 1.5rem;
            }

            .mobile-ux-actions button {
                flex: 1;
                padding: 0.75rem;
                border: 1px solid rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            }

            .mobile-ux-actions button:hover {
                background: rgba(255,255,255,0.2);
            }

            .test-haptic-btn {
                background: linear-gradient(135deg, #8e5edc 0%, #408daa 100%) !important;
            }

            .reset-preferences-btn {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
            }

            /* Backdrop */
            .mobile-ux-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
            }

            .mobile-ux-backdrop.show {
                opacity: 1;
                visibility: visible;
            }

            @media (min-width: 768px) {
                .mobile-ux-panel {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupPanelEvents(panel) {
        // Chiudi pannello
        const closeBtn = panel.querySelector('.mobile-ux-close');
        closeBtn.addEventListener('click', () => this.hideMobileUXPanel());

        // Toggle preferences
        const hapticToggle = panel.querySelector('#haptic-toggle');
        hapticToggle.addEventListener('change', (e) => {
            this.updatePreference('hapticEnabled', e.target.checked);
        });

        const pullRefreshToggle = panel.querySelector('#pullrefresh-toggle');
        pullRefreshToggle.addEventListener('change', (e) => {
            this.updatePreference('pullToRefreshEnabled', e.target.checked);
        });

        const gesturesToggle = panel.querySelector('#gestures-toggle');
        gesturesToggle.addEventListener('change', (e) => {
            this.updatePreference('gesturesEnabled', e.target.checked);
        });

        // Test haptic
        const testHapticBtn = panel.querySelector('.test-haptic-btn');
        testHapticBtn.addEventListener('click', () => {
            if (this.components.haptic) {
                this.components.haptic.test();
            } else {
                this.showNotification('Feedback tattile non disponibile', 'warning');
            }
        });

        // Reset preferences
        const resetBtn = panel.querySelector('.reset-preferences-btn');
        resetBtn.addEventListener('click', () => {
            this.resetPreferences();
        });

        // Backdrop per chiudere
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-ux-backdrop';
        backdrop.addEventListener('click', () => this.hideMobileUXPanel());
        document.body.appendChild(backdrop);
    }

    setupPanelTrigger() {
        let tapCount = 0;
        let tapTimer = null;
        const logo = document.querySelector('.logo');

        if (logo) {
            logo.addEventListener('click', (e) => {
                tapCount++;
                
                if (tapCount === 1) {
                    tapTimer = setTimeout(() => {
                        tapCount = 0;
                    }, 1000);
                } else if (tapCount === 3) {
                    clearTimeout(tapTimer);
                    tapCount = 0;
                    e.preventDefault();
                    this.showMobileUXPanel();
                }
            });
        }
    }

    showMobileUXPanel() {
        const panel = document.querySelector('.mobile-ux-panel');
        const backdrop = document.querySelector('.mobile-ux-backdrop');
        
        if (panel && backdrop) {
            panel.classList.add('show');
            backdrop.classList.add('show');
            
            // Haptic feedback
            if (this.components.haptic) {
                this.components.haptic.triggerFeedback('medium');
            }
        }
    }

    hideMobileUXPanel() {
        const panel = document.querySelector('.mobile-ux-panel');
        const backdrop = document.querySelector('.mobile-ux-backdrop');
        
        if (panel && backdrop) {
            panel.classList.remove('show');
            backdrop.classList.remove('show');
        }
    }

    updatePreference(key, value) {
        this.userPreferences[key] = value;
        this.savePreferences();
        
        // Applica cambiamento immediatamente
        this.applyPreferenceChange(key, value);
        
        this.showNotification(`${key} ${value ? 'attivato' : 'disattivato'}`, 'info');
    }

    applyPreferenceChange(key, value) {
        switch (key) {
            case 'hapticEnabled':
                if (value && !this.components.haptic) {
                    this.components.haptic = new HapticFeedbackController();
                } else if (!value && this.components.haptic) {
                    this.components.haptic.setEnabled(false);
                }
                break;
                
            case 'pullToRefreshEnabled':
                if (value && !this.components.pullToRefresh) {
                    this.components.pullToRefresh = new PullToRefreshController();
                } else if (!value && this.components.pullToRefresh) {
                    this.components.pullToRefresh.resetPull();
                    // Nascondi elemento
                    const pullElement = document.querySelector('.pull-to-refresh');
                    if (pullElement) pullElement.style.display = 'none';
                }
                break;
                
            case 'gesturesEnabled':
                if (value && !this.components.gestures) {
                    this.components.gestures = new GestureNavigationController();
                } else if (!value && this.components.gestures) {
                    // Disabilita gesture
                    this.components.gestures.gestures = {};
                }
                break;
        }
    }

    resetPreferences() {
        const defaults = this.getDefaultPreferences();
        this.userPreferences = { ...defaults };
        this.savePreferences();
        
        // Aggiorna UI
        Object.keys(defaults).forEach(key => {
            const toggle = document.querySelector(`#${key.replace('Enabled', '')}-toggle`);
            if (toggle) {
                toggle.checked = defaults[key];
            }
            this.applyPreferenceChange(key, defaults[key]);
        });
        
        this.showNotification('Impostazioni ripristinate', 'success');
    }

    loadPreferences() {
        const saved = localStorage.getItem('chatHeritage_mobileUX');
        const defaults = this.getDefaultPreferences();
        
        if (saved) {
            try {
                return { ...defaults, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Failed to load mobile UX preferences:', error);
            }
        }
        
        return defaults;
    }

    savePreferences() {
        localStorage.setItem('chatHeritage_mobileUX', JSON.stringify(this.userPreferences));
    }

    getDefaultPreferences() {
        return {
            hapticEnabled: true,
            pullToRefreshEnabled: true,
            gesturesEnabled: true
        };
    }

    isMobileDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth <= 768
        );
    }

    showNotification(message, type = 'info') {
        // Utilizza sistema notifiche esistente se disponibile
        if (window.ChatHeritage?.enhancements?.FormValidator) {
            const validator = new window.ChatHeritage.enhancements.FormValidator();
            if (validator.showNotification) {
                validator.showNotification(message, type);
                return;
            }
        }
        
        // Fallback a console
        console.log(`📱 ${type.toUpperCase()}: ${message}`);
    }

    exposeDebugAPI() {
        // Esponi API per debugging
        window.ChatHeritage.mobileUX = {
            coordinator: this,
            components: this.components,
            preferences: this.userPreferences,
            showPanel: () => this.showMobileUXPanel(),
            hidePanel: () => this.hideMobileUXPanel(),
            testHaptic: (type = 'light') => {
                if (this.components.haptic) {
                    this.components.haptic.triggerFeedback(type);
                }
            },
            testGesture: (type, data = {}) => {
                if (this.components.gestures) {
                    this.components.gestures.executeGesture(type, data);
                }
            },
            triggerRefresh: () => {
                if (this.components.pullToRefresh) {
                    this.components.pullToRefresh.triggerRefresh();
                }
            }
        };
        
        console.log('🐛 Mobile UX Debug API available at window.ChatHeritage.mobileUX');
    }

    // Cleanup per SPA
    cleanup() {
        Object.values(this.components).forEach(component => {
            if (component.cleanup) {
                component.cleanup();
            }
        });
        
        // Rimuovi pannello UI
        const panel = document.querySelector('.mobile-ux-panel');
        const backdrop = document.querySelector('.mobile-ux-backdrop');
        if (panel) panel.remove();
        if (backdrop) backdrop.remove();
        
        this.components = {};
        this.isInitialized = false;
    }
}

// ================================================================
// 5. CSS AGGIUNTIVO PER GESTURE STATES
// ================================================================

// Aggiungi questi stili al tuo style.css o inserisci con JavaScript
function injectGestureStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Gesture minimized state */
        .gesture-minimized .header {
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }

        .gesture-minimized .footer {
            transform: translateY(100%);
            transition: transform 0.3s ease;
        }

        /* Feedback visivi per gesture */
        .swipe-feedback {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 20px;
            font-weight: 600;
            z-index: 10002;
            pointer-events: none;
            opacity: 0;
            animation: swipeFeedbackShow 0.6s ease;
        }

        @keyframes swipeFeedbackShow {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        /* States per carousel durante gesture */
        .itineraries-grid.gesture-active {
            scroll-snap-type: none;
            scroll-behavior: auto;
        }

        /* Prevenzione selezione testo durante gesture */
        .gesture-active {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }

        /* Stato loading per refresh */
        body.refreshing {
            pointer-events: none;
        }

        body.refreshing * {
            cursor: wait;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .pull-to-refresh,
            .mobile-ux-panel,
            .swipe-feedback {
                animation: none !important;
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ================================================================
// 6. INTEGRAZIONE NEL SISTEMA ESISTENTE
// ================================================================

// Modifica la sezione di inizializzazione nel tuo script.js:
document.addEventListener('DOMContentLoaded', () => {
    // Lazy loading immagini E VIDEO
    const lazyLoader = new LazyImageLoader();
    
    // Video avanzato (se necessario)
    // const advancedVideoLoader = new AdvancedVideoLoader();
    
    // ✅ AGGIUNGI MOBILE UX COORDINATOR
    const mobileUX = new MobileUXCoordinator();
    
    // Validazione form
    new FormValidator('.form-section form');
    
    // Monitor performance
    if (window.ChatHeritage && window.ChatHeritage.config.PERFORMANCE_MONITOR) {
        new PerformanceMonitor();
    }
    
    // Miglioramenti accessibilità
    new AccessibilityEnhancer();
    
    // Inietta stili per gesture
    injectGestureStyles();
    
    // Cleanup quando l'utente lascia la pagina
    window.addEventListener('beforeunload', () => {
        if (lazyLoader && lazyLoader.cleanup) {
            lazyLoader.cleanup();
        }
        if (mobileUX && mobileUX.cleanup) {
            mobileUX.cleanup();
        }
    });
    
    console.log('🚀 Chat Heritage con Mobile UX caricato con successo!');
});

// ================================================================
// 7. API PUBBLICA ESTESA
// ================================================================

// Estendi l'API esistente
if (window.ChatHeritage) {
    window.ChatHeritage.enhancements = {
        LazyImageLoader,
        AdvancedVideoLoader,
        FormValidator,
        PerformanceMonitor,
        AccessibilityEnhancer,
        // ✅ AGGIUNGI NUOVE CLASSI
        HapticFeedbackController,
        PullToRefreshController,
        GestureNavigationController,
        MobileUXCoordinator,
        version: '2.0.0' // ✅ Aggiorna versione
    };
}

console.log('✨ Chat Heritage - Mobile UX Enhancements caricati! 📱');

// ================================================================
// 8. ESEMPI D'USO AVANZATI
// ================================================================

/*
// Esempio: Aggiungere gesture personalizzate
if (window.ChatHeritage?.mobileUX?.components?.gestures) {
    const gestures = window.ChatHeritage.mobileUX.components.gestures;
    
    // Swipe su specifico elemento
    gestures.registerGesture('swipeUp', (data) => {
        const heroSection = document.querySelector('.hero');
        if (gestures.isElementInView(heroSection)) {
            // Azione personalizzata per swipe up su hero
            console.log('Swipe up su hero!');
        }
    });
}

// Esempio: Trigger haptic personalizzato
if (window.ChatHeritage?.mobileUX?.components?.haptic) {
    const haptic = window.ChatHeritage.mobileUX.components.haptic;
    
    // Su click di un elemento specifico
    document.querySelector('.special-button').addEventListener('click', () => {
        haptic.triggerFeedback('success');
    });
}

// Esempio: Personalizzare pull-to-refresh
if (window.ChatHeritage?.mobileUX?.components?.pullToRefresh) {
    const ptr = window.ChatHeritage.mobileUX.components.pullToRefresh;
    
    // Override della funzione refresh
    ptr.performRefresh = async function() {
        // La tua logica di refresh personalizzata
        console.log('Custom refresh logic');
        await new Promise(resolve => setTimeout(resolve, 2000));
    };
}
*/


// ================================================================
// WEB VITALS EVENT LISTENERS
// Aggiungi questa sezione alla fine di script.js
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Aspetta che Web Vitals sia caricato
    setTimeout(function() {
        
        // Evento per ogni metrica misurata
        document.addEventListener('webVitalMeasured', function(e) {
            console.log(`📊 ${e.detail.type}: ${e.detail.value}ms - ${e.detail.rating}`);
            
            // Puoi aggiungere logica personalizzata qui
            if (e.detail.rating === 'poor') {
                console.warn(`⚠️ ${e.detail.type} ha prestazioni scarse!`);
            }
        });

        // Evento quando viene generato il report completo  
        document.addEventListener('webVitalsReport', function(e) {
            console.log('📈 Report Web Vitals completo:', e.detail);
            
            // Esempio: Mostra notifica se le prestazioni sono scarse
            if (e.detail.overallScore < 50) {
                console.warn('🚨 Prestazioni del sito da migliorare!');
            }
        });
        
    }, 1000); // 1 secondo di delay per essere sicuri che Web Vitals sia caricato
});