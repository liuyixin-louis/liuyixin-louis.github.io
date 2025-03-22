$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

var allPublications = null;


function publicationByTopicInner() {
    var a = $("#publication-by-topic")
    if (a.hasClass("activated")) {
        return ;
    }
    $("#main-pub-container .subtitle a").removeClass("activated");
    a.addClass("activated");

    $("#main-pub-card-container").html("");
    for (var topicId in allTopics) {
        var topic = allTopics[topicId].name;
        var topicTitle = allTopics[topicId].title;
        // var topicTitle = topic.split("-").map(function (a) { return a[0].toUpperCase() + a.substr(1).toLowerCase(); }).join(" ");
        $("#main-pub-card-container").append($("<h5 id='topic-" + topic + "'>" + topicTitle + "</h5>"));
        for (var pubId = 0; pubId < allPublications.length; pubId++) {
            var pub = $(allPublications[pubId]);
            if (pub.data("topic").indexOf(topic) != -1) {
                $("#main-pub-card-container").append(pub);
            }
        }
    }
}


function publicationByTopicSpecific(a) {
    publicationByTopicInner();
    publicationByTopicSpecificInner(a);

    var hash = a.hash;
    $(hash).prop('id', hash.substr(1) + '-noscroll');
    window.location.hash = hash;
    $(hash + '-noscroll').prop('id', hash.substr(1));

    if (!$(hash).isInViewport()) {
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 1000, function(){
        });
    }

    return false;
}

$(function() {
    getRealSize = function(bgImg) {
        var img = new Image();
        img.src = bgImg.attr("src");
        var width = img.width,
            height = img.height;
        return {
            width: width,
            height: height
        }
    };

    getRealWindowSize = function() {
        var winWidth = null,
            winHeight = null;
        if (window.innerWidth) winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth)) winWidth = document.body.clientWidth;
        if (window.innerHeight) winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight)) winHeight = document.body.clientHeight;
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth
        }
        return {
            width: winWidth,
            height: winHeight
        }
    };

    fullBg = function() {
        var bgImg = $("#background");
        var mainContainer = $("#main");
        var firstFire = null;

        if (bgImg.length == 0) {
            return ;
        }

        function resizeImg() {
            var realSize = getRealSize(bgImg);
            var imgWidth = realSize.width;
            var imgHeight = realSize.height;

            if (imgWidth == 0 || imgHeight == 0) {
                setTimeout(function() {
                    resizeImg();
                }, 200);
            }

            console.log(realSize);
            var realWinSize = getRealWindowSize();
            var winWidth = realWinSize.width;
            var winHeight = realWinSize.height;
            var widthRatio = winWidth / imgWidth;
            var heightRatio = winHeight / imgHeight;
            console.log(realWinSize);
            if (widthRatio > heightRatio) {
                bgImg.width(imgWidth * widthRatio + 'px').height(imgHeight * widthRatio + 'px').css({'top':
                    -(imgHeight * widthRatio - winHeight) / 10 * 5 + 'px', 'left': '0'})
            } else {
                bgImg.width(imgWidth * heightRatio + 'px').height(imgHeight * heightRatio + 'px').css({'left':
                    -(imgWidth * heightRatio - winWidth) / 10 * 3 + 'px', 'top': '0'})
            }
            // mainContainer.css({
            //     width: winWidth,
            //     height: winHeight
            // });
        }

        resizeImg();
        window.onresize = function() {
            if (firstFire === null) {
                firstFire = setTimeout(function() {
                    resizeImg();
                    firstFire = null
                }, 100)
            }
        }
    };

    targetColor = $("#main-content-container .name").css("color");
    animatedLink = function(speed) {
        $("#main-content-container .col-link li").hover(function() {
            $(this).find('.icon').animate({
                color: targetColor,
                borderColor: targetColor
            }, speed);
            $(this).find('.caption').animate({
                color: targetColor
            })
        }, function() {
            $(this).find('.icon').animate({
                borderColor: '#cccccc',
                color: '#cccccc'
            }, speed);
            $(this).find('.caption').animate({
                color: '#cccccc'
            })
        })
    };

    // fullBg();
    animatedLink(400);

    allPublications = $("#main-pub-card-container .pub-card");
    allTopicsLink = $("#main-pub-container .subtitle-aux a");
    allTopics = [];
    for (var topicId = 0; topicId < allTopicsLink.length; topicId++) {
        allTopics.push({name: $(allTopicsLink[topicId]).data("topic"), title: $(allTopicsLink[topicId]).html()});
    }

    $("#publication-by-selected").click();
    // $("#publication-by-date").click();
    $("#main-pub-card-container").removeClass("hide");
});


var allPublications = null;

function publicationBySelected() {
    var a = $("#publication-by-selected")
    if (a.hasClass("activated")) {
        return ;
    }

    $("#main-pub-container .subtitle a").removeClass("activated");
    $("#main-pub-container .subtitle-aux a").removeClass("activated");
    a.addClass("activated");

    $("#main-pub-card-container").html("");
    for (var pubId = 0; pubId < allPublications.length; pubId++) {
        var pub = $(allPublications[pubId]);
        if (pub.data("selected") == true) {
            $("#main-pub-card-container").append(pub);
        }
    }
}

function publicationByDate() {
    var a = $("#publication-by-date")
    if (a.hasClass("activated")) {
        return ;
    }

    $("#main-pub-container .subtitle a").removeClass("activated");
    $("#main-pub-container .subtitle-aux a").removeClass("activated");
    a.addClass("activated");

    $("#main-pub-card-container").html("");
    for (var pubId = 0; pubId < allPublications.length; pubId++) {
        if (pubId == 0 || $(allPublications[pubId-1]).data("year") != $(allPublications[pubId]).data("year")) {
            var year = $(allPublications[pubId]).data("year");
            $("#main-pub-card-container").append($("<h5 id='year-" + year.toString() + "'>" + year.toString() + "</h5>"));
        }
        $("#main-pub-card-container").append(allPublications[pubId]);
    }
}

function publicationByTopicInner() {
    var a = $("#publication-by-topic")
    if (a.hasClass("activated")) {
        return ;
    }
    $("#main-pub-container .subtitle a").removeClass("activated");
    a.addClass("activated");

    $("#main-pub-card-container").html("");
    for (var topicId in allTopics) {
        var topic = allTopics[topicId].name;
        var topicTitle = allTopics[topicId].title;
        // var topicTitle = topic.split("-").map(function (a) { return a[0].toUpperCase() + a.substr(1).toLowerCase(); }).join(" ");
        $("#main-pub-card-container").append($("<h5 id='topic-" + topic + "'>" + topicTitle + "</h5>"));
        for (var pubId = 0; pubId < allPublications.length; pubId++) {
            var pub = $(allPublications[pubId]);
            if (pub.data("topic").indexOf(topic) != -1) {
                $("#main-pub-card-container").append(pub);
            }
        }
    }
}

function publicationByTopicSpecificInner(a) {
    if ($(a).hasClass("activated")) {
        return false;
    }

    $("#main-pub-container .subtitle-aux a").removeClass("activated");
    $(a).addClass("activated");
}

function publicationByTopic() {
    publicationByTopicInner();
    publicationByTopicSpecificInner($("#main-pub-container .subtitle-aux a:first"));
    return true;
}

function publicationByTopicSpecific(a) {
    publicationByTopicInner();
    publicationByTopicSpecificInner(a);

    var hash = a.hash;
    $(hash).prop('id', hash.substr(1) + '-noscroll');
    window.location.hash = hash;
    $(hash + '-noscroll').prop('id', hash.substr(1));

    if (!$(hash).isInViewport()) {
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 1000, function(){
        });
    }

    return false;
}

$(function() {
    getRealSize = function(bgImg) {
        var img = new Image();
        img.src = bgImg.attr("src");
        var width = img.width,
            height = img.height;
        return {
            width: width,
            height: height
        }
    };

    getRealWindowSize = function() {
        var winWidth = null,
            winHeight = null;
        if (window.innerWidth) winWidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth)) winWidth = document.body.clientWidth;
        if (window.innerHeight) winHeight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight)) winHeight = document.body.clientHeight;
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            winHeight = document.documentElement.clientHeight;
            winWidth = document.documentElement.clientWidth
        }
        return {
            width: winWidth,
            height: winHeight
        }
    };

    fullBg = function() {
        var bgImg = $("#background");
        var mainContainer = $("#main");
        var firstFire = null;

        if (bgImg.length == 0) {
            return ;
        }

        function resizeImg() {
            var realSize = getRealSize(bgImg);
            var imgWidth = realSize.width;
            var imgHeight = realSize.height;

            if (imgWidth == 0 || imgHeight == 0) {
                setTimeout(function() {
                    resizeImg();
                }, 200);
            }

            console.log(realSize);
            var realWinSize = getRealWindowSize();
            var winWidth = realWinSize.width;
            var winHeight = realWinSize.height;
            var widthRatio = winWidth / imgWidth;
            var heightRatio = winHeight / imgHeight;
            console.log(realWinSize);
            if (widthRatio > heightRatio) {
                bgImg.width(imgWidth * widthRatio + 'px').height(imgHeight * widthRatio + 'px').css({'top':
                    -(imgHeight * widthRatio - winHeight) / 10 * 5 + 'px', 'left': '0'})
            } else {
                bgImg.width(imgWidth * heightRatio + 'px').height(imgHeight * heightRatio + 'px').css({'left':
                    -(imgWidth * heightRatio - winWidth) / 10 * 3 + 'px', 'top': '0'})
            }
            // mainContainer.css({
            //     width: winWidth,
            //     height: winHeight
            // });
        }

        resizeImg();
        window.onresize = function() {
            if (firstFire === null) {
                firstFire = setTimeout(function() {
                    resizeImg();
                    firstFire = null
                }, 100)
            }
        }
    };

    targetColor = $("#main-content-container .name").css("color");
    animatedLink = function(speed) {
        $("#main-content-container .col-link li").hover(function() {
            $(this).find('.icon').animate({
                color: targetColor,
                borderColor: targetColor
            }, speed);
            $(this).find('.caption').animate({
                color: targetColor
            })
        }, function() {
            $(this).find('.icon').animate({
                borderColor: '#cccccc',
                color: '#cccccc'
            }, speed);
            $(this).find('.caption').animate({
                color: '#cccccc'
            })
        })
    };

    // fullBg();
    animatedLink(400);

    allPublications = $("#main-pub-card-container .pub-card");
    allTopicsLink = $("#main-pub-container .subtitle-aux a");
    allTopics = [];
    for (var topicId = 0; topicId < allTopicsLink.length; topicId++) {
        allTopics.push({name: $(allTopicsLink[topicId]).data("topic"), title: $(allTopicsLink[topicId]).html()});
    }

    $("#publication-by-selected").click();
    // $("#publication-by-date").click();
    $("#main-pub-card-container").removeClass("hide");
});

document.addEventListener('DOMContentLoaded', (event) => {
    // Apply dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    document.body.style.backgroundColor = '#000000';
});