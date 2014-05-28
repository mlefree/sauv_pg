

// Controllers



angular.module('myNatiApp.controllers', [])
  .controller('CtrlNavigation', ['$scope', function($scope) {
    'use strict';

    // Disk Lock
    $scope.navigIsLocked = window.localStorage.getItem("navigIsLocked", false);
    $scope.navigToggleLock = function(){
      $scope.navigIsLocked = !$scope.navigIsLocked;
      window.localStorage.setItem("navigIsLocked", $scope.navigIsLocked);
    };



    $scope.navigStyles =  [
                            {code:'en_acide',   css:'css/natiwheel_en_acidule.css',  title:'Acidule (EN)'},
                            {code:'fr_acide',   css:'css/natiwheel_fr_acidule.css',  title:'Acidule (FR)'},
                            {code:'fr_mixte',   css:'css/natiwheel_fr_mixte.css',    title:'Mixte (FR)'},
                            {code:'fr_pastel',   css:'css/natiwheel_fr_pastel.css',  title:'Pastel (FR)'}
                          ];
    $scope.navigStyle = JSON.parse(window.localStorage.getItem('navigStyle'));
    $scope.setNavigStyle = function(styleCode){
        if (!styleCode) {
          // Init Style
          if (!$scope.navigStyle || !$scope.navigStyle.code) {
              $scope.navigStyle = $scope.navigStyles[0];
          }
          styleCode = $scope.navigStyle.code;
        }

        for(var i = 0; i < $scope.navigStyles.length; i++){
          var nstyle = $scope.navigStyles[i];
          if (nstyle.code == styleCode){
            // Set the style
            $scope.navigStyle = nstyle;
            $('#natistyle').attr({href : $scope.navigStyle.css});
            window.localStorage.setItem("navigStyle", JSON.stringify($scope.navigStyle));
          }
        }
    };
    $scope.setNavigStyle();



            $('#f1').click(function() {
                //alert('F1');
                var data = {direction:'left', velocity : 2};
                handleTouchyDrag(null,null, data);
            });
            $('#f2').click(function() {
                //alert('F2');
                var data = {direction:'right', velocity : 2};
                handleTouchyDrag(null,null, data);
            });

            // $('#natistyleSelector').change(function() {
            //
            //     var style = $("#natistyleSelector").val();
            //     setStyle(style);
            // });




  }])
  .controller('CtrlHelp', ['$scope', function($scope) {
    'use strict';
    $scope.helpLang = window.localStorage.getItem('helpLang','EN');
    $scope.setHelpLang = function(langCode){
      $scope.helpLang = langCode;
      window.localStorage.setItem('helpLang',$scope.helpLang);
    };


    $scope.$on('$destroy', function (event) {
        var langCode = ($scope.navigStyle && $scope.navigStyle.code) ? $scope.navigStyle.code : null;
        $scope.setNavigStyle(langCode);
    });


  }])
  .controller('CtrlDisk', ['$scope', function($scope) {
    'use strict';

    $scope.diskZoom = 1;
    $scope.diskDeg1 = window.localStorage.getItem('diskDeg1',0);
    $scope.diskDeg2 = window.localStorage.getItem('diskDeg2',0);
    $scope.diskDeg3 = window.localStorage.getItem('diskDeg3',0);

    // outside the scope
    //var _diskZoom = $scope.diskZoom;

    $scope.storeAnimations = function() {
      window.localStorage.setItem('diskDeg1',$scope.diskDeg1);
      window.localStorage.setItem('diskDeg2',$scope.diskDeg2);
      window.localStorage.setItem('diskDeg3',$scope.diskDeg3);
    };

    $scope.diskIsFront = true;
    $scope.diskToggleFront = function(hmEvent){
      $scope.diskIsFront = !$scope.diskIsFront;
    };

    function _computeZoom(hmEvent, oldValue) {
      var value = 0;
      if (!oldValue) oldValue = 1;
      value = oldValue * hmEvent.gesture.scale;
      // console.log('hmEvent.gesture.scale = '+hmEvent.gesture.scale);
      // console.log('hmEvent.gesture.distance = '+hmEvent.gesture.distance);
      // console.log('hmEvent.gesture.deltaX = '+hmEvent.gesture.deltaX);
      // console.log('hmEvent.gesture.deltaY = '+hmEvent.gesture.deltaY);
      // console.log('hmEvent.gesture.velocityX = '+hmEvent.gesture.velocityX);
      // console.log('hmEvent.gesture.velocityY = '+hmEvent.gesture.velocityY);
      //if (value > 0) value = 1 / Math.log10(value); else value = 1;
      return value;
    }

    function _computeElementDeg(el) {
        var degCalibre = 0;

        var st = window.getComputedStyle(el[0], null);
        var tr = st.getPropertyValue("-webkit-transform") ||
             st.getPropertyValue("-moz-transform") ||
             st.getPropertyValue("-ms-transform") ||
             st.getPropertyValue("-o-transform") ||
             st.getPropertyValue("transform") ||
             "none";
        if( tr === "none") return degCalibre;
        //console.log('Matrix: ' + tr);

        var values = tr.split('(')[1];
            values = values.split(')')[0];
            values = values.split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];
        var radians = Math.atan2(b, a);
        if ( radians < 0 ) {
          radians += (2 * Math.PI);
        }
        degCalibre = Math.round( radians * (180/Math.PI));

        return degCalibre;
    }

    $scope.diskRotateEnd = function(diskId, hmEvent) {

      if (diskId == 1) $scope.diskDeg1 = _computeElementDeg(hmEvent.element);
      if (diskId == 2) $scope.diskDeg2 = _computeElementDeg(hmEvent.element);
      if (diskId == 3) $scope.diskDeg3 = _computeElementDeg(hmEvent.element);

      $scope.storeAnimations();
    };

    $scope.diskPinch = function(hmEvent) {

      //console.log('hm-pinch="handleGesture($event)"');
      //console.log(hmEvent.type);
      //$scope.diskRotateLog = hmEvent.type;//JSON.stringify(hmEvent.gesture);
      //$scope.type = evhmEventent.type;
      _diskZoom = _computeZoom(hmEvent,_diskZoom);

                  var wrapEl  =   $("#wrap");


                 // $("#wrap #front *").css({'-webkit-transform-origin': ' '+frameWidth /2+'px '+frameHeight/2+'px'});

                  wrapEl.css({'-webkit-transform-origin-x':'0'});
                  wrapEl.css({'-webkit-transform-origin-y':'0'});
                  wrapEl.css({'-webkit-transform':'scale(' + _diskZoom + ',' + _diskZoom + ')'});

    };

    /*
    var degs1 = 0;
    var degs2 = 0;
    var degs3 = 0;
    var lock = false;

    var recto = true;
    var zoom = 1;



    var bodyWidth = $("body").width();



                zoom = zoom * bodyWidth / 1280;
                degs1 = getDeg(1);
                degs2 = getDeg(2);
                degs3 = getDeg(3);
                handleTouchyPinch();
                handleTouchyReset();




    var setDeg = function(deg, id){

        //var foo = localStorage.getItem("bar");
        // ...
        var newDeg = parseInt(deg);
        window.localStorage.setItem("n_"+id, newDeg);
    };

    var getDeg = function(id){

        var did = "n_"+id;
        var deg =  0;
        if (typeof window.localStorage[did] == 'undefined')
            deg =  0;
        else
            deg = window.localStorage.getItem("n_"+id);

        var degInt = parseInt(deg);
        return degInt;
        // ...
        //localStorage.setItem("bar", foo);
    };

    var handleTouchyReset = function(){
         $('#wheel1').css('webkitTransform','rotate3d(0,0,0,'+ degs1 +'deg)');
         $('#wheel2').css('webkitTransform','rotate3d(0,0,0,'+ degs2 +'deg)');
         $('#wheelA').css('webkitTransform','rotate3d(0,0,0,'+ degs3 +'deg)');

    };

    var handleTouchyRotate1 = function (e, phase, $target, data,onlyOneTime) {

        if (phase === 'move') {
            degs1 += data.degreeDelta;// / zoom;

           // $('#wheel1').css({'-webkit-transform-origin': ' '+frameWidth /2+'px '+frameHeight/2+'px'});
            $('#wheel1').css('webkitTransform','rotate3d(0,0,0,'+ degs1 +'deg)'); // 3d transforms are not working on the galaxy tab 7" ?
            //$target.css('webkitTransform','rotate('+ degs +'deg) transformZ(0)'); // check this out.  much worse on motorola xoom.
            setDeg(degs1,1);
        }

    };
    var handleTouchyRotate2 = function (e, phase, $target, data,onlyOneTime) {


        if (phase === 'move') {
            degs2 += data.degreeDelta;// / zoom;
            $('#wheel2').css('webkitTransform','rotate3d(0,0,0,'+ degs2 +'deg)');
            setDeg(degs2,2);
        }

    };
    var handleTouchyRotate3 = function (e, phase, $target, data,onlyOneTime) {

        if (phase === 'move') {
            degs3 += data.degreeDelta;// / zoom;
            $('#wheelA').css('webkitTransform','rotate3d(0,0,0,'+ degs3 +'deg)');
            setDeg(degs3,3);
        }

    };
    var handleTouchyRotateAll = function (e, phase, $target, data,onlyOneTime) {

        if (phase === 'move') {
                handleTouchyRotate1(e, phase, $target, data,true);
                handleTouchyRotate2(e, phase, $target, data,true);
                handleTouchyRotate3(e, phase, $target, data,true);
        }

    };

     var handleTouchyDrag = function (event, $target, data) {
        if ( recto && data.direction == 'left' && data.velocity > 1) {
            $('#wrap').addClass('flip');
            $('#f1').hide();$('#f2').show();
            recto = false;
        }
        else if (!recto  && data.velocity > 1) {
            $('#wrap').removeClass('flip');
            $('#f2').hide();$('#f1').show();
            recto = true;
        }
    };

    var handleTouchyPinch = function (e, $target, data) {
            //alert('scale(');
            //alert('scale(' + data.scale + ',' + data.scale + ')');
            //$target.css({'webkitTransform':'scale(' + data.scale + ',' + data.scale + ')'});



            if (data && data.scale) {
                //alert('scale(' + data.scale + ',' + data.scale + ')');
                zoom = zoom * (data.scale + 50) / 51;
            }

            if(zoom <= 0.25) zoom = 0.25;
            else  if(zoom >= 2) zoom = 2;

            console.log('handleTouchyPinch '+zoom);

            var wrapEl  =   $("#wrap");


           // $("#wrap #front *").css({'-webkit-transform-origin': ' '+frameWidth /2+'px '+frameHeight/2+'px'});

            wrapEl.css({'-webkit-transform-origin-x':'0'});
            wrapEl.css({'-webkit-transform-origin-y':'0'});
            wrapEl.css({'-webkit-transform':'scale(' + zoom + ',' + zoom + ')'});
            console.log('handleTouchyPinch '+ wrapEl[0].offsetWidth);

            //$("#wrap").css({'top':'0'});
            //$("#wrap").css({'left':'0'});

            //wrapEl.offsetWidth = frameWidth * zoom;
            //$("#wrap").offsetWHeight = frameHeight * zoom;
            //parent.wheelFrame.src="index-wheel.html";
            //parent.wheelFrame.css({'webkitTransform':'scale(' + data.scale + ',' + data.scale + ')'});
            //$("#wheel1").css({'webkitTransform':'scale(' + zoom + ',' + zoom + ')'});
            //$("#wheel2").css({'webkitTransform':'scale(' + zoom + ',' + zoom + ')'});
            //$("#wheelA").css({'webkitTransform':'scale(' + zoom + ',' + zoom + ')'});

            //$("#frame").css('-webkit-transform','scale('+data.scale+',' + data.scale + ')');

            //console.log('handleTouchyPinch '+parent.wheelFrame.width());

            //$("#body").width(bodyWidth * zoom);
            //$("#body").height(bodyHeight * zoom);
            //console.log('handleTouchyPinch '+parent.wheelFrame.width());


    };

    var unbindAll = function() {
        $('#wheel1').unbind();
        $('#wheel2').unbind();
        $('#wheelA').unbind();
    };
    var bindAll = function() {
        unbindAll();
        $('#wheel1').bind('touchy-rotate', handleTouchyRotate1);
        $('#wheel2').bind('touchy-rotate', handleTouchyRotate2);
        $('#wheelA').bind('touchy-rotate', handleTouchyRotate3);

        //$("#mainFunction").bind('touchy-swipe', handleTouchyDrag);
        //$("#wrap .back").bind('touchy-swipe', handleTouchyDrag);
        $("#mainFunction").bind('touchy-pinch', handleTouchyPinch);
        $("#wrap .back").bind('touchy-pinch', handleTouchyPinch);
        $("#mainFunction").bind('touchy-rotate', handleTouchyRotateAll);
    };
*/


  }]);
