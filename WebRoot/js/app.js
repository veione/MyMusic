 $(document).ready(function(){
	 //初始化控件
	$controls.init(); 
	//初始化进度条
	$progressbar.init();
	//初始内容框高度
	var headerHeight = $('header').height();
	var footerHeight = $('footer').height();
	var bodyHeight = $('body').height();
	var contentHeight = bodyHeight-(headerHeight+footerHeight);
	var dotsHeight = $('.dots').height();
	var wrapperHeight = contentHeight-dotsHeight-80;
	$('.content').css({'height':contentHeight});
	$('.player-container').css({'height':contentHeight});
	$('.desc-wrapper').css({'height':wrapperHeight});
	$('.lrc-wrapper').css({'height':wrapperHeight});
    //音量按钮
    $('.btn-volume').on('click',function(e){
      var flag = $('.volumebar').is(':hidden');
      if(flag){
        closeWindow('.listbar');
        $('.volumebar').css({'left':(e.pageX-20),'top':(e.pageY-200)}).fadeIn();
      }else{
        $('.volumebar').fadeOut();
      }
    });
    var volumebar_drag = false;
    //改变音量按钮  btn bottom: 71%; progress height: 73%;
    $('.volumebar').delegate('.bar','click',function(e){       
        if(!volumebar_drag){
          var value = Math.abs(e.pageY-$(this).offset().top-100);
          if(value<0){
            value = 0;
          }else if(value>100){
            value = 100;
          }
          $(this).find('.progress').css('height',value+'%');
          $(this).parent().find('.btn').css('bottom',value+'px');
          $player.volume(value/100);
        }
    }).delegate('.btn','mousedown',function(e){
        volumebar_drag = true;
    }).delegate('.bar','mousemove',function(e){
      if(volumebar_drag){
        var value = Math.abs(e.pageY-$(this).offset().top-100);
        if(value<0){
          value = 0;
        }
        if(value>100){
          value = 100;
        }
        $('.volumebar .btn').stop().animate({'bottom':value},100);
        $('.volumebar .progress').stop().animate({'height':value},100);
        $player.volume(value/100);
      }
    });
    //歌曲进度条改变
    var progressbar_drag = false;
    var $progress=$('.progress');
    var $progressBtn=$('.progress-btn');
    var progressBtnWidth = $progressBtn.width();
    var progressbar_left = 0,progressbar_ox = 0;
    var max = $(document).innerWidth()-progressBtnWidth;
    $('.progressbar').delegate('.bar','click',function(e){
      if(!progressbar_drag){
        var value = Math.abs(e.pageX-$(this).offset().left);
        var maxWidth = parseInt($(this).css('width'));
        if(value < 0){
          value = 0;
        }
        if(value > max){
          value = max;
        }
        $progressBtn.css('left',value+'px');
        $progress.css('width',value+'px');
        var t_width = (maxWidth - parseInt($(this).find('.progress').width()));
		var speed = maxWidth / $player.getDuration();
		var curWidth = (max - t_width);
		var time = (curWidth / speed);
		var timer=null;
		clearTimeout(timer);
		timer=setTimeout(function(){
			$player.seekTo(time);
		}, 200);
      }
    }).delegate('.progress-btn','mousedown',function(e){
        progressbar_drag = true;
        progressbar_ox = (e.pageX)-progressbar_left;
    }).delegate('.bar','mousemove',function(e){
        if(progressbar_drag){
        	$player.dragprogressbar=true;	
          progressbar_left = e.pageX;
          if(progressbar_left<0){
            progressbar_left = 0;
          }
          if(progressbar_left>max){
            progressbar_left = max;
          }
          $progressBtn.stop().animate({'left':progressbar_left+'px'},100);
          $progress.stop().animate({'width':progressbar_left+'px'},100);
          
        var maxWidth = parseInt($(this).css('width'));
        var t_width = (maxWidth - parseInt($(this).find('.progress').width()));
  		var speed = maxWidth / $player.getDuration();
  		var curWidth = (max - t_width);
  		var time = (curWidth / speed);
  		var timer=null;
  		clearTimeout(timer);
  		timer=setTimeout(function(){
  			$player.seekTo(time);
  		}, 200);
        }
    });
    //播放列表按钮
    var initPlayPage = false;//是否第一次初始化播放列表界面
    $('.btn-list').on('click',function(e){
      var flag = $('.listbar').is(':hidden');
      var bottom = $('footer').height();
      if(flag){
        closeWindow('.volumebar');
        //加载数据
        var template = $("#song-list-template").html();
        var container = $('.listbar .list ul');
        var round = $('.listbar .item .rank .round');
        if(initPlayPage&&round!=undefined){
        	$('.listbar').css({'bottom':bottom+'px'}).fadeIn();
        }else{
        	initPlayPage = true;
        	container.empty();
            var data = $player.playList.all();
        	 $('.listbar .title span').html(data.length);
             $.each(data,function(i,item){
             	var str=template.format(item.id,item.index+1,item.name,item.singer);
             	container.append(str);
             });
             $('.listbar').css({'bottom':bottom+'px'}).fadeIn();
        }
      }else{
        $('.listbar').hide();
      }
    });
    //播放列表关闭按钮
    $('.listbar .btn-close').click(function(){
      $('.listbar').fadeOut();
    });
    //document mouseup event
    $(document).mouseup(function(){
      volumebar_drag = false;
      progressbar_drag = false;
      $player.dragprogressbar=false;
      //closeWindow('.volumebar','.listbar');
    });
    //播放界按钮
    var $btnMainPage = $('.btn-main-page');
    var $btnLrcPage = $('.btn-lrc-page');
    var $btnDot = $('.dots .btn');
    var parentWidth = $('.dots').width();
    var $mainPage = $('.desc-wrapper');
    var $lrcPage = $('.lrc-wrapper');
    $btnMainPage.click(function(){
       var nextLeft = parseInt($btnDot.css('left'));
       var value = parentWidth - nextLeft-$(this).width()+20;
       $btnDot.stop().animate({left:value+'px'},300);
       $mainPage.show();
       $lrcPage.hide();
    });
    $btnLrcPage.click(function(){
        var thisRight = parseInt($(this).css('right'));
        var value = parentWidth - thisRight-$(this).width()+20;
        $btnDot.stop().animate({left:value+'px'},300);
        $lrcPage.show();
        $mainPage.hide();
    });
    //返回按钮事件
    var $playList = $('.play-list');
    var $playContainer = $('.player-container');
    $('.btn-return').on('click',function(e){
      var flag=$playContainer.is(':hidden');
      if(flag){
        $playContainer.show();
        $playList.hide();
      }else{
        $playContainer.hide();
        $playList.show();
      }
    });
	// 歌曲列表
	$('.list').on("click","li",function(){
		 var musicId = $(this).find('.item').attr('data-id');
	     $player.play(musicId);
    });
	var playList = $('.play-list');
	playList.on("click","li",function(){
        var musicId = $(this).find('.item').attr('data-id');
        $player.play(musicId);
    });
	var loop=false;
	$('.btn-mode').click(function(){
		if(!loop){
			loop=true;
			layer.msg('循环模式已经打开');
		}else{
			layer.msg('循环模式已经关闭');
			loop=false;
		}
	});
  });
  function closeWindow(){
    for(var i in arguments){
       var flag = $(arguments[i]).is(':hidden');
      if(!flag){
          $(arguments[i]).fadeOut();
      }
    }
  }