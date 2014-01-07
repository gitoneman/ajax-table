;(function($){
	var defaults,
		opts,
		methods;

	defaults = {
		"init":true,
		"refresh":false,
		"column":[
			{
				name:"name",
				value:"name",
			},
			{
				name:"age",
				value:"age",
			},
			{
				name:"sex",
				value:"sex",
			}
		],   			
		"rollable":false,
		"formats":{
			
		},
		"clickable":false,
		"clickHandle":function(){
			console.log("you did not define a clickHandle")
		},
		"height":"",
		"overflow":"auto",
		"limit":10
	}

	function initHead(s){
		var header = "",
			length = opts.column.length,
			arr = [],
			self = s.find(".header");

		for (var i = 0; i < length; i++) {
			var obj = opts.column[i];
			arr.push(obj.value);
			header += "<div class='tlt border' style='width:"+ 100/length +"%'>"+obj.name+"</div>";
		};

		s.data("json",arr);		
		self.append($(header));
	}	

	function getData(s){
		var data = {},
		opts = s.data("opts"),
		self = s.find(".inner");

		// TODO ajaxs
		data = Data.list;

		buildList(s,self,data);		
	}
	
	function makeRolling(s,self){

		var timer = null,
			top,
			length;
			
		self.css({"position":"absolute"});
		var lis = self.find("li").clone(true);
		self.append(lis);
		
		startRolling(s);
	}

	function initEvent(s){

		s.find(".J_wrap").hover(function(){
			clearInterval(s.timer);
		},function(){
			startRolling(s);
		});

		s.on("TABLE_ADDITEMSUCCESS",function(e,o){			
			
			$(o).on("click",function(){
				var _self = $(this);

				opts.clickHandle(_self);
			});

			$(o).css("cursor","pointer");	
		});
		
	}
	function startRolling(s) {
		var self = s.find(".inner");

		//滚动一
		if(s.opts.rollType == 1){
			s.timer = setInterval(function(){	
				self.css("top",self.position().top-1);
				if((self.position().top) <= -self.height()/2){				
						self.css({"top":0});	
					}
			},30);
		}
		
		//滚动二
		if(s.opts.rollType == 2){

			s.timer = setInterval(function(){			
												
				self.animate({"top":self.position().top-30},600,function(){
					if((self.position().top) == -self.height()/2){
					// getData1(dom,self);
						self.css({"top":0});	
					}
				});
						
			},1000);
		}
					
	}

	function cross(s){
		var spans = s.find("span"),
			reg = /^J_value_/,
			cls;

		//交叉选中
		spans.hover(function(){
			var _self = $(this),
				li = _self.parent("li"),
				arr,
				item;

			arr = _self.attr("class").split(" ");

			for (var i = 0; i < arr.length; i++) {

				if(reg.test(arr[i])){
					cls = arr[i];
				}
			};

			li.addClass("cross");
			s.find("span."+cls).addClass("cross");
		},function(){
			var _self = $(this),
				li = _self.parent("li");

			li.removeClass("cross");
			s.find("span."+cls).removeClass("cross");
		});
	}

	function buildList(s,self,data){

		var length = data.length,
			value = s.data("json"),
			opts = s.data("opts"),
			item = "",
			text = "";

		//构建每个条目
		for (var i = 0; i < length; i++) {
			var obj = data[i];

			for (var j = 0; j < value.length; j++) {
				var obj1 = value[j];

				text = obj[obj1];
				
				if(opts.formats[obj1]){					
					text = opts.formats[obj1](obj[obj1]);
				}
				item += "<span class='border J_value_"+obj1+"' style='width:"+ 100/value.length+"%'>"+text+"</span>"
			};

			//添加每个li类以及数据
			item = $("<li>"+ item + "</li>");
			item.data("json",obj);
			item.addClass("J_id_"+obj.id);

			
			// console.log(item)
			//可点击所做操作
			if(opts.clickable){
				s.trigger("TABLE_ADDITEMSUCCESS",item);
			}

			self.append(item);
			item = "";
		};

		if(opts.height){
			self.parent("div").css({"height":opts.height});
		}
		if(opts.overflow){
			self.parent("div").css({"overflow":opts.overflow});
		}

		if(opts.rollable){
			makeRolling(s,self,data);
			opts.rollable = false;
		}

		if(opts.cross){
			cross(s);
		}
	}

	methods = {
		init:function(options){
			
    		return this.each(function(){
    			var s = $(this);
    				   				
    			s.data("opts",options);
    			s.opts = options;    			    		   			

    			initHead(s);    			    			
    			initEvent(s);
    			getData(s);
    		})
		},
		refresh:function(options){
			
    		return this.each(function(){
    			var $this = $(this);


    		})
		}
	}
	$.fn.extend({ 
    	my_table:function(options){
    		var method = null;
			opts = $.extend({},defaults,options || {});

    		if(opts.refresh){
    			method = methods["refresh"];
    		}else if(opts.init){
				method = methods["init"];
    		}

    		return method.call(this,opts);
    	}    	
	});
})(jQuery)