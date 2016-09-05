/**
 * 播放器工具模块
 */
var urls={
		load_song_list:'js/data.json'
};
String.prototype.format=function(){
	if(arguments.length==0) return this;
	for(var s=this, i=0; i<arguments.length; i++)
		s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
	return s;
};
var $util={
	formatSeconds : function(value){
		var time=parseInt(value);
		var minute=0;
		var hours=0;
		if(time>60){
			minute=parseInt(time/60);
			time=parseInt(time%60);
		if(minute>60){
			hours=parseInt(minute/60);
			minute=parseInt(minute%60);
		}
		}
		var result=$util.toDouble(parseInt(time));
		if(minute>0){
			result=$util.toDouble(parseInt(minute))+":"+result;
		}else{
			result=$util.toDouble(parseInt(minute))+":"+result;
		}
		if(hours>0){
			result=$util.toDouble(parseInt(hours))+":"+result;
		}
		return result;	
	},
	toDouble : function(value){
		return value<10?"0"+value:value;
	},
	getDataAndSettingPlayList: function(url){
		var playList = $('.play-list>ul');
		var list = $(".list>ul");
		var timer = setTimeout(function(){
			$.ajax({
				type:"GET",
		    	url:"js/data.json",
		    	dataType:"text",
		        cache:false,
		        success:function(data){
		        	list.empty();
		        	playList.empty();
		            var template = $("#song-list-template").html();
		            $.each($.parseJSON(data),function(index,obj){
		            	obj.index=index;//存储当前歌曲序列号
		            	$player.playList.add(obj);
		            	var str=template.format(obj.id,index+1,obj.name,obj.singer);
		            	playList.append(str);
		            });
		            $('.loading').hide();
		        },
		        error:function(){
		            playList.html('<li class="load-data-error">音乐列表获取失败！</li>');
		            $('.loading').hide();
		        }
		    });	
		}, 300);
	}
};
//加载数据并设置音乐列表
$util.getDataAndSettingPlayList(urls.load_song_list);