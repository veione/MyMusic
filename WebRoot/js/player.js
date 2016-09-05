/**
 * 播放器核心模块
 */
 var $player=$("#media"), player = $player.get(0);

/**
 * 播放器列表,常用方法 
 */
$player.playList = new function() {
	var list = [];
	this.currentIndex = -1;//当前歌曲列表索引
	this.currentPlayIndex = -1;//当前歌曲正在播放索引
	this.add = function(music) {
		var flag=false;
		if (music instanceof Array){
			list = list.concat(music);
			flag=true;
		}else{
			// [{1},{2},{3}]
			//var obj = $player.playList.all()[music.index];
			var existFlag=0;
			for(var item of $player.playList.all()){
			    if(item.id==music.id){
			    	existFlag=1;
			    	break;
			    }
			}
			if(existFlag==0){
				list.push(music);
				flag=true;
			}
			/*if(!obj){
				list.push(music);
				flag=true;
			}*/
		}
		return flag;
	};
	this.next = function() {
		var next = list[this.currentPlayIndex + 1];
		if (!next)
			return null;
		this.currentIndex++;
		return next;
	};
	this.prev = function() {
		var prev = list[this.currentPlayIndex - 1];
		if (!prev)
			return null;
		this.currentIndex--;
		return prev;
	};
	this.all = function() {
		return list;
	};
};
/**
 * 是否处于暂停状态
 */
$player.paused=function(){
	return player.paused;
};
$player.playing = function(src){
	player.src = src;
	player.play();
};
/**
 * 播放
 */
$player.play = function(musicId) {
	if(!musicId){
		$progressbar.init();
		$controls.init();
		//layer.msg('歌曲列表已经播放完毕');
		$.lrc.stop();
		$.lrc.clear();//进行歌词清理工作
		return;
	}
	var index = -1;
	var music = null;
	for(var item of $player.playList.all()){
	    if(item.id==musicId){
	    	index = item.index;
	    	music = item;
	    	break;
	    }
	}
	if (index < 0)
		return;
	$player.music = music;
	if (index == this.playList.currentPlayIndex) {
		player.paused?player.play():player.pause();
	} else {
		$controls.play();
		//初始化进度条
		$progressbar.init();
		$player.pause();
		$controls.next(music);
		var timer = null;
		clearTimeout(timer);
		this.playList.currentPlayIndex=music['index'];
		this.playList.currentPlayIndex = index;
		timer = setTimeout(function(){
			$.lrc.loadLrc(music['lrc']);
			$controls.changeCover(music);
			player.src = music['url'];
			player.play();
		},1000);
		return music;
	}
};
/**
 * 播放停止
 */
$player.stop=function(){
	//初始进度条控件
	$progressbar.init();
	$controls.init();
};
/**
 * 暂停
 */
$player.pause = function() {
	player.pause();
};
/**
 * 定位播放
 */
$player.seekTo = function(time) {
	player.currentTime = time;
};
/**
 * 继续播放
 */
$player.continuePlay = function(){
	player.play();
};
/**
 * 获取播放时长
 */
$player.getDuration = function() {
	return player.duration;
};
/**
 * 获取播放当前时间
 */
$player.getCurrentTime=function(){
	return player.currentTime;
}
$player.getBuffered=function(){
	return player.buffered;
};
$player.loop = function(flag){
	player.loop=flag;
};
/**
 * 获取播放器音量 >0设置值 小于0获取值
 */
$player.volume=function(val){
	if(val>0&&val<=1){
		player.volume=val;
	}
	return player.volume;
};
//是否拖动进度条
$player.dragprogressbar=false;
/**
 * 播放时更新事件
 */
var time = 0;
$player.bind('timeupdate',function(){
	var curtime=$util.formatSeconds($player.getCurrentTime());
	$controls.renderCurrentTime(curtime);//渲染当前时间
	if(!$player.dragprogressbar){
		$progressbar.render();//渲染进度条
	}
	//点击开始方法调用lrc.start歌词方法 返回时间time
	time = $player.getCurrentTime();
	$.lrc.start(function(){
		return time;
	});
});

/**
 * 播放暂停事件
 */
$player.bind('pause',function(){
	$controls.pause();
});
/**
 * 播放开始事件
 */
$player.bind('play',function(){
	$controls.play();
});
$player.bind('playing',function(){
	$controls.renderTotalTime($util.formatSeconds($player.getDuration()));
	$progressbar.duration = $player.getDuration();
});

$player.bind('ended',function(){
	$progressbar.init();
	$controls.init();
	//判断当前的状态,单曲循环、顺序播放、随机播放 TODO	现阶段默认使用顺序播放
	var music=$player.playList.next();
	if(music){
		$player.play(music['id']);
		//获取下一个平级节点,然后替换图片
		$controls.next(music);
	}else{
		$player.playList.currentPlayIndex=0;
		$controls.init();
		layer.msg('歌曲播放完毕',function(){});
	}
});