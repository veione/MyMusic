/*播放器进度条*/
var progressbar =$(".progressbar");
var bar = progressbar.find('.bar');
var progress = progressbar.find('.progress');
var progressBtn = progressbar.find('.progress-btn');

var $progressbar={
	duration:0,
	init: function(){
		progress.css("width",'0');
		progressBtn.css('left','0');
	},
	render: function(){
			var time=$player.getCurrentTime();
			var speed=parseInt(bar.css('width'))/this.duration;
			var curtime=time;
			var blast=curtime*speed;
			var maxWidth=$(document).innerWidth();
			if(blast<0){
				blast = 0;
			}else if(blast>maxWidth){
				blast = maxWidth;
			}
			progress.stop().animate({'width':blast+'px'},100);
			progressBtn.stop().animate({'left':blast+'px'},100);
	}
};
