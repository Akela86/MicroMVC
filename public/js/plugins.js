// Merge objects
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

// Popup
function popwindow(url, options){
    var defaults = {
        width: '200',
        height: '200',
        title: ''
    }

    options = merge_options(defaults, options);

    var left = (screen.width/2)-(options.width/2);
    var top = (screen.height/2)-(options.height/2);

    window.open(url, options.title, "location=0, menubar=0, scrollbars=1, titlebar=0, status=0, width="+options.width+", height="+options.height+", top="+top+", left="+left);
}

function popup(anchor, content){
    var html = '\
        <div class="popup">\
            '+content+'\
        </div>\
    ';

    $(anchor).html(html).css("display", "flex").fadeIn(200);
}

// Scomparsa popup
$(document).on('keydown', function (e) {
    if (e.keyCode === 27){// ESC
        $("#popcontainer").fadeOut(100).html("");
    }
});
$('#popcontainer').on('click', '.cancel', function(e){
    e.preventDefault();
    $("#popcontainer").fadeOut(100).html("");
});
