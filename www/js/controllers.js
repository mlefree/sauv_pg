

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

    $scope.diskIsFront = true;
    $scope.diskToggleFront = function(hmEvent){
      $scope.diskIsFront = !$scope.diskIsFront;
      console.log(hmEvent.type);
      $scope.diskRotateLog = hmEvent.type;//JSON.stringify(hmEvent.gesture);
    };

    $scope.diskRotateLog = 'na';
    $scope.diskRotate = function(diskId, hmEvent) {

      console.log('hm-rotate="handleGesture($event)"');
      console.log(hmEvent.type);
      $scope.diskRotateLog = hmEvent.type;//JSON.stringify(hmEvent.gesture);
      //$scope.type = evhmEventent.type;

    };

    $scope.diskPinch = function(hmEvent) {

      console.log('hm-pinch="handleGesture($event)"');
      console.log(hmEvent.type);
      $scope.diskRotateLog = hmEvent.type;//JSON.stringify(hmEvent.gesture);
      //$scope.type = evhmEventent.type;

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
