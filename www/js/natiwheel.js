
var degs1 = 0;
var degs2 = 0;
var degs3 = 0;
var lock = false;

var recto = true;
var zoom = 1;

//var wheelFrame = $("#frame");
//var zoomIn = $("#zoomIn");
//var zoomOut = $("#zoomOut");

//var frameWidth = $("#wrap").width();
//var frameHeight = $("#wrap").height();

var bodyWidth = $("body").width();



var setStyle = function(style){

    
    //alert(style);
    if ( style == "en_acide") {
        $('#natistyle').attr({href : 'css/natiwheel_en_acidule.css'});
    }
    else if ( style == "fr_acide") {
        $('#natistyle').attr({href : 'css/natiwheel_fr_acidule.css'});
    }
    else if ( style == "fr_mixte") {
        $('#natistyle').attr({href : 'css/natiwheel_fr_mixte.css'});
    }
    else if ( style == "fr_pastel") {
        $('#natistyle').attr({href : 'css/natiwheel_fr_pastel.css'});
    }

    window.localStorage.setItem("style", style);
};

var getStyle = function(){

    var style =  'css/natiwheel.css';
    if (typeof window.localStorage["style"] != 'undefined')
        style = window.localStorage.getItem("style");
    
    setStyle(style);
};

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
        
        

/*
        if (data.scale > 1)
            zoom = Math.round(zoom *2);
        else
            zoom = Math.round(zoom /2);

        alert("zoom : "+zoom);

        $('#extViewportMeta').remove();
        $('head').append('<meta id="extViewportMeta" name="viewport" content="width=320, initial-scale='+zoom+'.0, user-scalable=no" />');
        */

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



$(document).ready(function(){


/*
    $("#zoomOut").click(function() {

        if(zoom <= 0.5) zoom = 0.25;
        else
            zoom = Math.round(zoom*100 / 2)/100;
        handleTouchyPinch();
     });

    $("#zoomIn").click(function() {
        if(zoom >= 1) zoom = 2;
        else
            zoom = Math.round(zoom*10 * 2)/10;
        handleTouchyPinch();
     });

    $('#p1').click(function() {

        degs1 = getDeg(1) + 10;
        degs2 = getDeg(2) + 10;
        degs3 = getDeg(3) + 10;
        setDeg(degs1, 1);
        setDeg(degs2, 2);
        setDeg(degs3, 3);
        handleTouchyReset();

    });
    $('#m1').click(function() {

        degs1 = getDeg(1) - 10;
        degs2 = getDeg(2) - 10;
        degs3 = getDeg(3) - 10;
        setDeg(degs1, 1);
        setDeg(degs2, 2);
        setDeg(degs3, 3);
        handleTouchyReset();

    });*/
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

    $('#natistyleSelector').change(function() {

        var style = $("#natistyleSelector").val();
        setStyle(style);
    });

    $('.navbar-brand').click(function(){
        var url = "http://www.sauvane.com";
        //navigator.app.loadUrl(url, { openExternal:true } );
        //window.location.href = url;
       // var ref = window.open(encodeURI(url), "_system");
        //window.open(url, "_system","location=yes");
    })


    //set style
    getStyle();

    // Lock
    $("#unlock").hide();
    $("#mainFunction").show();
    $("#lock").click(function(){
        $("#mainFunction").hide();
        $("#lock").hide();
        $("#unlock").show();
    });
    $("#unlock").click(function(){
        $("#mainFunction").show();
        $("#unlock").hide();
        $("#lock").show();
    });


    zoom = zoom * bodyWidth / 1280;
    degs1 = getDeg(1);
    degs2 = getDeg(2);
    degs3 = getDeg(3);
    handleTouchyPinch();
    handleTouchyReset();   


    // Bind events
    bindAll();

    //$('#myHelpTab a:last').tab('show');
                  
 

});
            
            
              
            

