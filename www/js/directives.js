

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

           // outside the scope
           var wrapper = document.getElementById("wrap");
           var _wrapWidth = wrapper ? wrapper.scrollWidth : 0;
           var _wrapHeight = wrapper ? wrapper.scrollHeight : 0;
           var _wrapCenterX = Math.round(_wrapWidth / 2);
           var _wrapCenterY = Math.round(_wrapHeight / 2);

           //var _diskTurnClockwize = true;
           //var _diskTurnClockwizeLocked = false;
          var _DegCalibre   = 'NA';
          //var _lastEventX   = 0;
          //var _lastEventY   = 0;
          //var _lastDeg      = 0;



           function _computeCalibreDeg(el) {
              var degCalibre = 0;
              //if (eventX == _wrapCenterX || eventY == _wrapCenterY) return deg;

              var st = window.getComputedStyle(el[0], null);
              var tr = st.getPropertyValue("-webkit-transform") ||
                   st.getPropertyValue("-moz-transform") ||
                   st.getPropertyValue("-ms-transform") ||
                   st.getPropertyValue("-o-transform") ||
                   st.getPropertyValue("transform") ||
                   "fail...";

              if( tr === "none") return degCalibre;
              //console.log('Matrix: ' + tr);

              var values = tr.split('(')[1];
                  values = values.split(')')[0];
                  values = values.split(',');
              var a = values[0];
              var b = values[1];
              var c = values[2];
              var d = values[3];

              //var scale = Math.sqrt(a*a + b*b);

              var radians = Math.atan2(b, a);
              if ( radians < 0 ) {
                radians += (2 * Math.PI);
              }
              degCalibre = Math.round( radians * (180/Math.PI));

              // works!
              //console.log('Rotate: ' + degCalibre + 'deg');

              return degCalibre;
           }

           function _computeDeg(eventX, eventY, degCalibre) {
               var deg = 0;//_lastDegTmp++ % 360;
               if (eventX == _wrapCenterX || eventY == _wrapCenterY) return deg;
               //if (oldEventX == _wrapCenterX || oldEventY == _wrapCenterY) return deg;

               var Ax = eventX - _wrapCenterX;
               var Ay = eventY - _wrapCenterY;
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
           var touchable = true;//false;//for chrome test
           if (touchable) element[0].addEventListener('touchstart', function(e) {
                        //console.log('touchstart');
                        if (!e.touches || e.touches.length === 0) return;
                        e.preventDefault();
                        var X = e.touches[0].pageX;
                        var Y = e.touches[0].pageY;
                        _DegCalibre = _computeCalibreDeg(element);
                        _DegCalibre -= _computeDeg(X, Y,0);
                        _move = true;
                      },false);
           if (!touchable) element[0].addEventListener('mousedown', function(e) {
                        e.preventDefault();
                        var X = e.pageX;
                        var Y = e.pageY;
                        _DegCalibre = _computeCalibreDeg(element);
                        _DegCalibre -= _computeDeg(X, Y,0);
                        _move = true;
                      },false);

           if (touchable) element[0].addEventListener('touchmove', function(e) {
                        //console.log('touchmove');
                        if (!_move || _DegCalibre == 'NA' || !e.touches || e.touches.length === 0) return;
                        e.preventDefault();

                        var X = e.touches[0].pageX;
                        var Y = e.touches[0].pageY;

                        var deg = _computeDeg(X, Y,_DegCalibre);
                        element.css({'-webkit-transform':'rotate3d(0,0,1,'+deg+'deg)'});
                        //_lastEventX = X;
                        //_lastEventY = Y;
                        //console.log('touchmove end');
                        //$('#Log').append('<span>touchmove'+_lastEventX+'</span>');
                      },false);
           if (!touchable) element[0].addEventListener('mousemove', function(e) {
                        if (!_move || _DegCalibre == 'NA') return;
                        e.preventDefault();
                        var deg = _computeDeg(e.pageX, e.pageY,_DegCalibre);
                        element.css({'-webkit-transform':'rotate3d(0,0,1,'+deg+'deg)'});
                        //_lastEventX = e.pageX;
                        //_lastEventY = e.pageY;
                        $('#Log').text('<span>'+_DegCalibre+'</span></br><span>touchmove'+deg+'<span>');
                      },false);

           if (touchable) element[0].addEventListener('touchend', function(e) {_move = false; _DegCalibre = 'NA';},false);
           if (touchable) element[0].addEventListener('touchcancel', function(e) {_move = false; _DegCalibre = 'NA';},false);
           if (touchable) element[0].addEventListener('touchleave', function(e) {_move = false; _DegCalibre = 'NA';},false);

           if (!touchable) element[0].addEventListener('mouseup', function(e) {_move = false; _DegCalibre = 'NA';},false);
           if (!touchable) element[0].addEventListener('mouseout', function(e) {_move = false; _DegCalibre = 'NA';},false);
           if (!touchable) element[0].addEventListener('mouseenter', function(e) {_move = false; _DegCalibre = 'NA';},false);
           if (!touchable) element[0].addEventListener('mouseleave', function(e) {_move = false; _DegCalibre = 'NA';},false);
    };

});
