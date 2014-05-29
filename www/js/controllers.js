

// Controllers



angular.module('myNatiApp.controllers', [])
  .controller('CtrlNavigation', ['$scope', function($scope) {
    'use strict';

    // Disk Lock
    $scope.navigBIsLocked = true;
    $scope.navigToggleLock = function(force){
      if (force) $scope.navigBIsLocked = force;
      else $scope.navigBIsLocked = !$scope.navigBIsLocked;
      //window.localStorage.setItem("navigIsLocked", $scope.navigBIsLocked);
    };
    $scope.navigIsLocked = function(){
      var b = ($scope.navigBIsLocked === true);
      //console.log('navigIsLocked :'+b);
      return b;
    };



    $scope.navigStyles =  [
                            {code:'en_acide',   css:'css/natiwheel_en_acidule.css',  title:'Acidule (EN)'},
                            {code:'fr_acide',   css:'css/natiwheel_fr_acidule.css',  title:'Acidule (FR)'}
                            //{code:'fr_mixte',   css:'css/natiwheel_fr_mixte.css',    title:'Mixte (FR)'},
                            //{code:'fr_pastel',   css:'css/natiwheel_fr_pastel.css',  title:'Pastel (FR)'}
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



            // $('#f1').click(function() {
            //     //alert('F1');
            //     var data = {direction:'left', velocity : 2};
            //     handleTouchyDrag(null,null, data);
            // });
            // $('#f2').click(function() {
            //     //alert('F2');
            //     var data = {direction:'right', velocity : 2};
            //     handleTouchyDrag(null,null, data);
            // });

            // $('#natistyleSelector').change(function() {
            //
            //     var style = $("#natistyleSelector").val();
            //     setStyle(style);
            // });




  }])
  .controller('CtrlHelp', ['$scope', function($scope) {
    'use strict';
    $scope.helpLang = window.localStorage.getItem('helpLang') || 'EN';
    $scope.setHelpLang = function(langCode){
      $scope.helpLang = langCode;
      window.localStorage.setItem('helpLang',$scope.helpLang);
    };


    $scope.$on('$destroy', function (event) {
        var langCode = ($scope.navigStyle && $scope.navigStyle.code) ? $scope.navigStyle.code : null;
        $scope.setNavigStyle(langCode);
    });


  }])
  .controller('CtrlDisk', ['$scope','$timeout', function($scope,$timeout) {
    'use strict';

    $scope.diskZoom = 0.5;
    $scope.diskDeg0 = window.localStorage.getItem('diskDeg0') || 0;
    $scope.diskDeg1 = window.localStorage.getItem('diskDeg1') || 0;
    $scope.diskDeg2 = window.localStorage.getItem('diskDeg2') || 0;
    $scope.diskDeg3 = window.localStorage.getItem('diskDeg3') || 0;

    // outside the scope
    //var _diskZoom = $scope.diskZoom;

    $scope.storeAnimations = function() {
      window.localStorage.setItem('diskDeg0',$scope.diskDeg0);
      window.localStorage.setItem('diskDeg1',$scope.diskDeg1);
      window.localStorage.setItem('diskDeg2',$scope.diskDeg2);
      window.localStorage.setItem('diskDeg3',$scope.diskDeg3);
    };

    $scope.diskIsFront = true;
    $scope.diskToggleFront = function(hmEvent){
      $scope.diskIsFront = !$scope.diskIsFront;
      $scope.navigToggleLock(true);
    };

    function _computeZoom(hmEvent, oldValue) {
      var value = 0;
      if (!oldValue) oldValue = 1;
      value = hmEvent.gesture.scale / 2;
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
        var degCalibre = null;

        var st = window.getComputedStyle(el, null);
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

      var deg = _computeElementDeg(hmEvent.srcElement);

      $timeout(function(){
        if (diskId === 0 && deg !== null) $scope.diskDeg0 = deg;
        if (diskId === 1 && deg !== null) $scope.diskDeg1 = deg;
        if (diskId === 2 && deg !== null) $scope.diskDeg2 = deg;
        if (diskId === 3 && deg !== null) $scope.diskDeg3 = deg;

        $scope.storeAnimations();
      },10);
    };

    $scope.diskPinch = function(hmEvent) {

      //console.log('hm-pinch="handleGesture($event)"');
      //console.log(hmEvent.type);
      //$scope.diskRotateLog = hmEvent.type;//JSON.stringify(hmEvent.gesture);
      //$scope.type = evhmEventent.type;
      $scope.diskZoom = _computeZoom(hmEvent,$scope.diskZoom);
      if ($scope.diskZoom >= 4) $scope.diskZoom = 4;
      if ($scope.diskZoom <= 0.2) $scope.diskZoom = 0.2;

      //var wrapEl  =   $("#wrap");


      // $("#wrap #front *").css({'-webkit-transform-origin': ' '+frameWidth /2+'px '+frameHeight/2+'px'});

      //wrapEl.css({'-webkit-transform-origin-x':'0'});
      //wrapEl.css({'-webkit-transform-origin-y':'0'});
      //wrapEl.css({'-webkit-transform':'scale(' + _diskZoom + ',' + _diskZoom + ')'});

    };

  }]);
