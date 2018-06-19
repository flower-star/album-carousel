var rightSlide = $('.right-slide');
var area = $('.past-act .cont');

var albumData = [
    ["https://dummyimage.com/928x580/808F7C/fff", "https://dummyimage.com/928x580/66BAB7/fff"],
    ["https://dummyimage.com/928x580/211E55/fff", "https://dummyimage.com/928x580/f60/fff", "https://dummyimage.com/928x580/7B90D2/fff"],
    ["https://dummyimage.com/928x580/ff5566/fff", "https://dummyimage.com/928x580/00896C/fff"],
    ["https://dummyimage.com/928x580/C1328E/fff"],
    ["https://dummyimage.com/928x580/A8D8B9/fff", "https://dummyimage.com/928x580/f60/fff"],
    ["https://dummyimage.com/928x580/f60/fff", "https://dummyimage.com/928x580/f60/fff", "https://dummyimage.com/928x580/f60/fff"]
];

function initAlbum(area, albumData) {
    var $album = $('.album');
    var curAlbum = 0;
    var autoPlayTimer = null;
    var albumSum = albumData.length;
    var $albumList = $('.right-slide .bd ul');
    var $albumItems = null;
    var albumItemSum = 0;
    var $albumListPrev = $('.right-slide .prev');
    var $albumListNext = $('.right-slide .next');
    var albumListHeightNum = 0;
    var albumStep = 0;
    var $galleryArea = $('.left-slide');
    var $galleryContent = $galleryArea.find('.bd ul');
    var $dots = $galleryArea.find('.hd ul');
    var $picPrev = $galleryArea.find('.prev');
    var $picNext = $galleryArea.find('.next');
    var $galleryContent = $galleryArea.find('.bd ul');
    var picWidth = 0;


    //载入相册数据
    function loadAlbum() {
        //生成相册封面数据
        var coverHtml = '';
        for (var i = 0; i < albumSum; i++) {
            var index = i;
            coverHtml += '<li data-index=' + index + '><img src=' + albumData[index][0] + ' alt="" /></li>'
        }

        if (albumSum > 4) {
            coverHtml += coverHtml;
        }
        $albumList.html(coverHtml);
        //更新相册数据
        $albumItems = $albumList.find('li');
        albumItemSum = $albumItems.length;
        albumListHeightNum = parseInt($albumList.outerHeight());
        albumStep = parseInt($albumItems.outerHeight());

        // 默认播放第一个，加标识
        if (albumSum > 4) {
            $($albumItems[albumItemSum / 2]).addClass('cur-album');
        }
        $($albumItems[0]).addClass('cur-album');
    }

    //滚动相册列表
    function scrollAlbumList() {
        var curTop = 0;
        $albumListPrev.on('click', function (e) {
            e.stopPropagation();
            $albumList.finish();
            var target = 0;
            if (curTop === 0) {
                $albumList.css('top', -albumListHeightNum / 2 + 'px');
                curTop = parseInt($albumList.css('top'));
            }
            target = curTop + albumStep;
            $albumList.animate({
                top: target + 'px'
            }, 500, function () {
                curTop = parseInt($albumList.css('top'));
            })
        });

        $albumListNext.on('click', function (e) {
            e.stopPropagation();
            $albumList.finish();
            var target = 0;
            if (curTop === -albumListHeightNum / 2) {
                $albumList.css('top', 0);
                curTop = parseInt($albumList.css('top'));
            }
            target = curTop - albumStep;
            $albumList.animate({
                top: target + 'px'
            }, 500, function () {
                curTop = parseInt($albumList.css('top'));
            })
        })
    }

    //切换相册：手动/自动
    function switchAlbum(auto) {
        if (albumItemSum <= 4) {
            //手动切换
            $($albumItems[0]).addClass('cur-album');
            $albumItems.on('click', function () {
                curAlbum = $(this).data('index');
                for (var i = 0; i < albumItemSum; i++) {
                    $($albumItems[i]).removeClass('cur-album');
                };
                $(this).addClass('cur-album');
                //重载展示区
                gallery();
            });
            //自动切换
            if (auto) {
                for (var i = 0; i < albumItemSum; i++) {
                    $($albumItems[i]).removeClass('cur-album');
                };
                $($albumItems[curAlbum]).addClass('cur-album');
            }
        } else {
            //手动切换
            $albumItems.on('click', function () {
                curAlbum = $(this).data('index');
                for (var i = 0; i < albumItemSum; i++) {
                    $($albumItems[i]).removeClass('cur-album');
                };
                for (var i = 0; i < albumItemSum; i++) {
                    if ($($albumItems[i]).data('index') === curAlbum) {
                        $($albumItems[i]).addClass('cur-album');
                    }
                }
                //当前上移
                $albumList.css('top', -curAlbum * albumStep + 'px');
                //重载展示区
                gallery();
            });
            //自动切换
            if (auto) {
                var curTop = parseInt($albumList.css('top'));
                if (curTop === -albumListHeightNum / 2) {
                    $albumList.css('top', 0);
                    curTop = parseInt($albumList.css('top'));
                }
                var target = curTop - albumStep;
                $albumList.animate({
                    top: target + 'px'
                }, 500, function () {
                    curTop = parseInt($albumList.css('top'));
                })
                for (var i = 0; i < albumItemSum; i++) {
                    $($albumItems[i]).removeClass('cur-album');
                };
                for (var i = 0; i < albumItemSum; i++) {
                    if ($($albumItems[i]).data('index') === curAlbum) {
                        $($albumItems[i]).addClass('cur-album');
                    }
                }
                gallery();
            }
        }
    }

    //初始化展示区
    function gallery() {
        var picNum = albumData[curAlbum].length;
        var picsHtml = '';
        var dotsHtml = '';

        //还原位置
        $galleryContent.css('left', 0);

        for (var i = 0; i < picNum; i++) {
            picsHtml += '<li data-index=' + i + ' data-curAlbum=' + curAlbum + '><img src=' + albumData[curAlbum][i] + ' alt="" /></li>'
            dotsHtml += '<li></li>';
        }

        picsHtml += picsHtml;
        $galleryContent.html(picsHtml);
        $dots.html(dotsHtml);
        //切换图片
        switchPic($galleryArea);
        //指示条切换
        switchDot($dots, 0);
        // //自动播放
        autoPlay($galleryArea, $dots, 0);
    }

    //切换图片
    function switchPic($galleryArea) {
        var $pics = $galleryContent.find('li');
        var step = parseInt($(".left-slide .bd").width());
        var picSum = $pics.length;
        var galleryWidth = picSum * step;
        var curLeft = parseInt($galleryContent.css('left'));
        var curIdx = 0;
        $picPrev.unbind();
        $picNext.unbind();
        $picPrev.on('click', function () {
            $galleryContent.finish();
            if (curLeft === 0) {
                $galleryContent.css('left', -galleryWidth / 2 + 'px');
                curLeft = parseInt($galleryContent.css('left'));
            }

            var target = curLeft + step;
            $galleryContent.animate({
                left: target + 'px'
            }, 500, function () {
                curLeft = parseInt($galleryContent.css('left'));
                curIdx = (-curLeft / step) ? -curLeft / step : 0;
                switchDot($dots, curIdx);
            });
        });

        $picNext.on('click', function () {
            $galleryContent.finish();
            if (curLeft === -galleryWidth / 2) {
                $galleryContent.css('left', 0);
                curLeft = parseInt($galleryContent.css('left'));
            }
            var target = curLeft - step;

            $galleryContent.animate({
                left: target + 'px'
            }, 500, function () {
                curLeft = parseInt($galleryContent.css('left'));
                if (-curLeft / step && -curLeft / step !== picSum / 2) {
                    curIdx = -curLeft / step;
                } else if (-curLeft / step === picSum / 2) {
                    curIdx = 0;
                } else {
                    curIdx = 0;
                }
                switchDot($dots, curIdx);
            });
        });
    }

    //切换指示条
    function switchDot($dots, curIdx) {
        var $dotsItems = $dots.find('li');

        for (var i = 0; i < $dotsItems.length; i++) {
            $($dotsItems[i]).removeClass('on');
        }
        $($dotsItems[curIdx]).addClass('on');
    }

    //自动播放切换
    function toggleMove() {
        var picWidth = parseInt($galleryContent.width());
        $galleryArea.mouseover(function () {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
            }
        });

        $galleryArea.mouseout(function () {
            autoPlay($galleryArea, $dots, 0);
        });
    }

    //自动播放
    function autoPlay($galleryArea, $dots, curIdx) {
        var curIdx = 0;
        var picNum = $dots.find('li').length;
        var picWidth = parseInt($galleryContent.width());

        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
        }

        autoPlayTimer = setInterval(function () {
            //播放次数
            var playTimes = $dots.find('li').length - Math.abs(parseInt($galleryContent.css("left")) / picWidth) - 1;
            if (playTimes > 0) {
                playTimes--;
                scrollLeft($galleryContent);
                switchDot($dots, Math.abs(parseInt($galleryContent.css("left")) / picWidth) + 1);
            } else {
                //播放下一个相册，载入下一个相册的数据
                clearInterval(autoPlayTimer);
                curAlbum = curAlbum === albumSum - 1 ? 0 : curAlbum + 1;
                gallery();
                switchAlbum('auto');
            }
        }, 3000);
    }

    //左滑
    function scrollLeft($galleryContent) {
        var $pic = $galleryContent.find('li');
        var picWidth = parseInt($pic.width());
        var curLeft = parseInt($galleryContent.css('left'));
        var target = curLeft - picWidth;

        $galleryContent.animate({
            left: target + 'px'
        }, 500, function () {
            curLeft = parseInt($galleryContent.css('left'));
        })

    }

    //隐藏控制按钮
    function hideBtn() {
        var $leftSlide = $album.find('.left-slide');
        var $rightSlide = $album.find('.right-slide');

        $leftSlide.on('mouseover', function () {
            var picSum = $leftSlide.find('.hd ul li').length;
            if (picSum === 1) {
                $picPrev.addClass('hide');
                $picNext.addClass('hide');
            } else {
                $picPrev.removeClass('hide');
                $picNext.removeClass('hide');
            }
        })

        $leftSlide.on('mouseout', function () {
            $picPrev.addClass('hide');
            $picNext.addClass('hide');
        })

        $rightSlide.on('mouseover', function () {
            if (albumSum <= 4) {
                $albumListPrev.addClass('hide');
                $albumListNext.addClass('hide');
            } else {
                $albumListPrev.removeClass('hide');
                $albumListNext.removeClass('hide');
            }
        })

        $rightSlide.on('mouseout', function () {
            $albumListPrev.addClass('hide');
            $albumListNext.addClass('hide');
        })
    }

    function init() {
        if (albumSum > 4) {
            loadAlbum();
            scrollAlbumList();
            switchAlbum();
            gallery();
            toggleMove();
        } else {
            loadAlbum();
            switchAlbum();
            gallery();
            toggleMove();
        }
        hideBtn();
    }

    //初始化
    init();
}


initAlbum(area, albumData);