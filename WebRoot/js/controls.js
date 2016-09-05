/**
 * 播放器控制模块
 */
//播放器相关容器
var currentTime=$('.time-current'); 
var totalTime=$('.time-total');
//播放器按钮
var playBtn=$('.btn-play');
var pauseBtn=$('.btn-pause');
var nextBtn=$('.btn-forward');
var prevBtn=$('.btn-backward');
var volumeProgress=$('.volumebar .progress');
var volumeBtn=$('.volumebar .btn');
	
var $controls={
	init: function(){
		currentTime.html('00:00');
		totalTime.html('00:00');
		var volume=$player.volume(0.6)*100;
		$('.item .circle').empty().remove();
		$('.details .cover img').attr('src','images/20160608111533.jpg');
		$('.desc .song').html('歌曲');
		$('.desc .singer').html('歌手');
		$('.list li').removeClass('hover');
		volumeProgress.css('height',volume+'%');
		volumeBtn.css('bottom',volume+'%');
	},
	renderTotalTime: function(time){
		totalTime.html(time);
	},
	renderCurrentTime: function(time){
		currentTime.html(time);
	},
	changeCover: function(music){
		$('.details .cover img').attr('src',music['cover']);
		$('.desc .song').html(music['name']);
		$('.desc .singer').html(music['singer']);
	},
	loop: function(){
		var flag = $('.controls a:eq(0)').hasClass('btn-loop');
		if(flag){
			$('.controls a:eq(0)').addClass('btn-loop-on').removeClass('btn-loop');
			$player.loop(true);
			layer.msg('单曲循环模式已经打开');
		}else{
			$('.controls a:eq(0)').addClass('btn-loop').removeClass('btn-loop-on');
			$player.loop(false);
		}
	},
	next: function(music){
		if(!music){
			//初始进度条控件
			$progressbar.init();
			$controls.init();
			return;
		} 
		$('.play-list li').removeClass('hover').find('span').show();
		$('.play-list li').find('.round').remove();
        $('.play-list li:eq('+music.index+')').addClass("hover").find('.rank').append($('#playing-song-template').html()).find('span:eq(0)').hide();
        $('.play-list li:eq('+music.index+')').find('.rank span').hide();
        
        $('.list li').removeClass('hover').find('span').show();
		$('.list li').find('.round').remove();
        $('.list li:eq('+music.index+')').addClass("hover").find('.rank').append($('#playing-song-template').html()).find('span:eq(0)').hide();
        $('.list li:eq('+music.index+')').find('.rank span').hide();
	},
	pause: function(){
		$('.controls a:eq(2)').find('i').removeClass('fa-pause').addClass('fa-play');
		var music = $player.music;
		$('.play-list li:eq('+music.index+')').addClass("hover").find('.rank').find('img').attr('src','images/playing.png');
		$('.list li:eq('+music.index+')').addClass("hover").find('.rank').find('img').attr('src','images/playing.png');
	},
	play: function(){
		$('.controls a:eq(2)').find('i').removeClass('fa-play').addClass('fa-pause');
		var music = $player.music;
		$('.play-list li:eq('+music.index+')').addClass("hover").find('.rank').find('img').attr('src','images/playing.gif');
		$('.list li:eq('+music.index+')').addClass("hover").find('.rank').find('img').attr('src','images/playing.gif');
	},
	playMusic: function(){
		var music = $player.music;
		if(music==undefined){
			var len=$player.playList.all().length;
			if(len==0){
				return;
			}else{
				music=$player.playList.next();
				$player.play(music['id']);
				//获取下一个平级节点,然后替换图片
				$controls.next(music);
			}
		}else{
			//播放歌曲
			$player.play(music['id']);
		}
	}
};

$('body').on('click','.btn-pause',function(){
	$controls.playMusic();
});
$('body').on('click','.btn-play',function(){
	$controls.playMusic();
});
$('body').on('click','.btn-loop',function(){
	$controls.loop();
});
$('body').on('click','.btn-loop-on',function(){
	$controls.loop();
});
$('.btn-favorite').click(function(){
	var handle = $(this);
	var flag = handle.attr('data-on');
	if(flag=='off'){
		handle.removeClass('btn-favorite').addClass('btn-favorite-on').attr({'data-on':'on'});
		layer.msg('爱我的人都会收藏我的 :)');
	}else{
		handle.removeClass('btn-favorite-on').addClass('btn-favorite').attr({'data-on':'off'});
		layer.msg('你不爱我了 /(ㄒoㄒ)/~~');
	}
});
$('.btn-add').click(function(){
	layer.msg('该功能还未开放,敬请期待! (☆▽☆)',function(){});
});
nextBtn.click(function(){
	var music=$player.playList.next();
	if(music==undefined){
		layer.msg('没有下一曲咯',function(){});
	}else{
		$player.play(music['id']);
		$controls.next(music);
	}
});
prevBtn.click(function(){
	var music=$player.playList.prev();
	if(music==undefined){
		layer.msg('没有上一曲咯',function(){});
	}else{
		$player.play(music['id']);
		$controls.next(music);
	}
});