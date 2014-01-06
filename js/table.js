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

	function initHead(dom,self){
		var header = "",
			length = opts.column.length,
			arr = [];

		for (var i = 0; i < length; i++) {
			var obj = opts.column[i];
			arr.push(obj.value);
			header += "<div class='tlt border' style='width:"+ 100/length +"%'>"+obj.name+"</div>";
		};

		dom.data("json",arr);		
		self.append($(header));
	}	

	function getData(dom,self){
		var data = {},
		opts = dom.data("opts");
		data = Data.list;
		buildList(dom,self,data);		
	}
	
	function makeRolling(dom,self){

		var timer = null,
			top,
			length;
			
		self.css({"position":"absolute"});
		var lis = self.find("li").clone(true);
		self.append(lis);

		// 滚动一
		
		// timer = setInterval(function(){			
												
		// 	self.animate({"top":self.position().top-30},600,function(){
		// 		if((self.position().top) == -self.height()/2){
		// 		// getData1(dom,self);
		// 			self.css({"top":0});	
		// 		}
		// 	});
						
		// },1000);
		// 
		
	
		//滚动二
		timer = setInterval(function(){	
			self.css("top",self.position().top-1);
			if((self.position().top) <= -self.height()/2){				
					self.css({"top":0});	
				}
		},30);
	}

	function initEvent(dom){

		
	}
	function buildList(dom,self,data){

		var length = data.length,
			value = dom.data("json"),
			opts = dom.data("opts"),
			item = "",
			text = "";

		for (var i = 0; i < length; i++) {
			var obj = data[i];

			for (var j = 0; j < value.length; j++) {
				var obj1 = value[j];

				text = obj[obj1];
				
				if(opts.formats[obj1]){					
					text = opts.formats[obj1](obj[obj1]);
				}
				item += "<span class='border' style='width:"+ 100/value.length+"%'>"+text+"</span>"
			};

			item = $("<li>"+ item + "</li>");

			if(opts.clickable){
				item.on("click",function(){
					opts.clickHandle();
				})
			}
			self.append(item);
			item = "";
		};

		if(opts.height && opts.overflow){
			self.parent("div").css({"height":opts.height,"overflow":opts.overflow});
		}

		if(opts.rollable){
			makeRolling(dom,self,data);
			opts.rollable = false;
		}
	}

	methods = {
		init:function(options){
			
    		return this.each(function(){
    			var $this = $(this),
    				$header = $this.find(".header"),
    				$inner = $this.find(".inner");
    				

    			$this.data("opts",options);
    			initHead($this,$header);
    			getData($this,$inner);    			
    			
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