

// Directives


//console.log('directiveswww');

angular.module('myNatiApp.directives', []).
directive('appVersion', ['version', function(version) {
      'use strict';
      return function(scope, elm, attrs) {
          elm.text(version);
      };
}])
.directive('natiTurn', function() {
      'use strict';

      return function(scope, element, attrs) {

           //console.log('natiTurn');
           var touchable = true;//false;//for chrome test

          // Browser capabilities
          var isAndroid = (/android/gi).test(navigator.appVersion),
          isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
          isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
          touchable = 'ontouchstart' in window && !isTouchPad;

          var _DegCalibre   = 0;
          var _LastDeg = 0;
          function _computeCalibre(el) {
              var calibre = {degree:null, scale:null};
              //if (eventX == _wrapCenterX || eventY == _wrapCenterY) return deg;

              var st = window.getComputedStyle(el[0], null);
              var tr = st.getPropertyValue("-webkit-transform") ||
                   st.getPropertyValue("-moz-transform") ||
                   st.getPropertyValue("-ms-transform") ||
                   st.getPropertyValue("-o-transform") ||
                   st.getPropertyValue("transform") ||
                   "none";

              if( tr === "none") return calibre;
              //console.log('Matrix: ' + tr);

              var values = tr.split('(')[1];
                  values = values.split(')')[0];
                  values = values.split(',');
              var a = values[0];
              var b = values[1];
              var c = values[2];
              var d = values[3];

              var iscale = Math.sqrt(a*a + b*b);

              var radians = Math.atan2(b, a);
              if ( radians < 0 ) {
                radians += (2 * Math.PI);
              }
              var idegree = Math.round( radians * (180/Math.PI));

              // works!
              //console.log('Rotate: ' + degCalibre + 'deg');
              calibre = {degree:idegree, scale:iscale};


              return calibre;
           }

           function _computeDeg(el, eventX, eventY, degCalibre) {
              var deg = null;//_lastDegTmp++ % 360;
              var elCenterX = 0;
              var elCenterY = 0;
              if (el && el[0]) {
                var wrap = $('.wrap');
                var calibre = _computeCalibre(wrap);

                //var x = document.elementFromPoint(eventX, eventY);
                //var width = getComputedStyle(el[0]).getPropertyValue('width');
                //var height = getComputedStyle(el[0]).getPropertyValue('height');
                elCenterX =  calibre.scale * ((el[0].offsetWidth/2) + (el[0].offsetLeft));
                elCenterY =  calibre.scale * ((el[0].offsetHeight/2) + (el[0].offsetTop));
              }

              if (eventX == elCenterX || eventY == elCenterY) return deg;
              //if (oldEventX == _wrapCenterX || oldEventY == _wrapCenterY) return deg;

              var Ax = eventX - elCenterX;
              var Ay = eventY - elCenterY;
              //var Arad = Math.atan(Ay / Ax);
              var Arad = Math.atan2(Ay, Ax);
              if ( Arad < 0 ) {
                Arad += (2 * Math.PI);
              }
              var Adeg = Math.round(Arad * 180 / Math.PI);

              deg = (Adeg + degCalibre) % 360;
              return deg;
           }


           var _move = false;
           if (touchable) element[0].addEventListener('touchstart', function(e) {
                        //console.log('touchstart');
                        if (!e.touches || e.touches.length === 0) return;
                        e.preventDefault();
                        _move = true;
                        var X = e.touches[0].pageX;
                        var Y = e.touches[0].pageY;
                        var degA = _computeCalibre(element).degree;
                        var degB = _computeDeg(element, X, Y,0);
                        //if (!degA) degA = 0;
                        if (degA  !== null && degB  !== null) _DegCalibre = degA -degB;
                      },false);
           if (!touchable) element[0].addEventListener('mousedown', function(e) {
                        e.preventDefault();
                        _move = true;
                        var X = e.pageX;
                        var Y = e.pageY;
                        var degA = _computeCalibre(element).degree;
                        var degB = _computeDeg(element, X, Y,0);
                        //if (!degA) degA = 0;
                        if (degA  !== null && degB !== null) _DegCalibre = degA -degB;
                      },false);

           if (touchable) element[0].addEventListener('touchmove', function(e) {
                        //console.log('touchmove');
                        if (!_move || !e.touches || e.touches.length === 0) return;
                        e.preventDefault();
                        var X = e.touches[0].pageX;
                        var Y = e.touches[0].pageY;
                        var deg = _computeDeg(element, X, Y,_DegCalibre);
                        if (deg !== null) element.css({'-webkit-transform':'rotate3d(0,0,1,'+deg+'deg)'});
                        if (deg !== null) _LastDeg  = deg;
                      },false);
           if (!touchable) element[0].addEventListener('mousemove', function(e) {
                        if (!_move) return;
                        e.preventDefault();
                        var X = e.pageX;
                        var Y = e.pageY;
                        var deg = _computeDeg(element,X,Y,_DegCalibre);
                        if (deg !== null) element.css({'-webkit-transform':'rotate3d(0,0,1,'+deg+'deg)'});
                        if (deg !== null) _LastDeg  = deg;
                      },false);

           if (touchable) element[0].addEventListener('touchend', function(e) {_move = false; _DegCalibre = _LastDeg;},false);
           if (touchable) element[0].addEventListener('touchcancel', function(e) {_move = false; _DegCalibre = _LastDeg;},false);
           if (touchable) element[0].addEventListener('touchleave', function(e) {_move = false; _DegCalibre = _LastDeg;},false);

           if (!touchable) element[0].addEventListener('mouseup', function(e) {_move = false; _DegCalibre = _LastDeg;},false);
           if (!touchable) element[0].addEventListener('mouseout', function(e) {_move = false; _DegCalibre = _LastDeg;},false);
           if (!touchable) element[0].addEventListener('mouseenter', function(e) {_move = false; _DegCalibre = _LastDeg;},false);
           if (!touchable) element[0].addEventListener('mouseleave', function(e) {_move = false; _DegCalibre = _LastDeg;},false);
    };

});
