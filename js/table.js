;(function($){
	var defaults,
		methods;

	// 默认设置
	defaults = {
		"init":true,
		"refresh":false,
		"column":[
			{
				name:"id",
				value:"id",
				width:"20%"
			},
			{
				name:"name",
				value:"name",
				width:"20%"
			},
			{
				name:"age",
				value:"age",
				width:"20%"
			},
			{
				name:"sex",
				value:"sex",
				width:"20%"
			},
			{
				name:"操作",
				value:"operation",
				width:"20%"
			}
		],   			
		"rollable":false,
		"formats":{
			
		},
		"clickable":false,
		"clickHandle":function(){
			console.log("you did not define a clickHandle")
		},
		"height":"300px",
		"overflow":"hidden",
		"rollable":true,                                                                     
		"rollType":1,  //1,2可选
		"cross":false,   //交叉选中
		"pager":true,
		"url":"",
		"param":{
			"limit":10,
		},
	}

	// 初始化表格头部
	
	function initHead(s){
		var header = "",
			opts = s.opts,
			length = opts.column.length,
			arr = [],
			self = s.find(".header");

		for (var i = 0; i < length; i++) {
			var obj = opts.column[i];
			// arr.push(obj.value);
			arr.push({
				"value":obj.value,
				"width":obj.width
			});
			header += "<div class='tlt border' style='width:"+ obj.width +"'>"+obj.name+"</div>";
		};

		s.data("json",arr);
		self.append($(header));
	}

	// 初始化翻页模块
	function initPager(s){
		var pager = s.find(".J_pager");
						
		var lf = [
			"<ul class='f-fl lf'>",
			"<li class='f-fl'>",
			"pager",
			"</li>",
			"</ul>"
		];

		var rgt = [
			"<ul class='f-fr rgt'>",
				"<li class='f-fr'>",
					"<div class='m-select'>",
						"<button class='J_first' data-action='first'>",
							"<i class='icon-double-angle-left'>",
							"</i>",
						"</button>",
						"<button class='J_pre' data-action='pre'>",
							"<i class='icon-angle-left'>",
							"</i>",
						"</button>",
						"<button class='J_next' data-action='next'>",
							"<i class='icon-angle-right'>",
							"</i>",
						"</button>",
						"<button class='J_last' data-action='last'>",
							"<i class='icon-double-angle-right'>",
							"</i>",
						"</button>",
					"</div>",
				"</li>",
				"<li class='f-fr'>",
					"<div class='m-input'>",
						"<input type='text' class='numb J_number'>",
						"/",
						"<span class='J_pages'>",
							"",
						"</span>",
						"页",
					"</div>",
				"</li>",
			"</ul>"
		];

		lf = lf.join("");
		rgt = rgt.join("");
		pager.append($(lf)).append($(rgt));

		s.trigger("TABLE_ADDPAGERSUCCESS",pager);
	}	

	function setParam(){
		
	}

	// 获取数据
	function getData(s){
		var data = null,
		opts = s.data("opts"),
		self = s.find(".J_inner"),
		pager = s.find(".J_pager"),
		url = opts.url,
		param = pager.data("param");

		param  = $.extend({},param,opts.param);

		pager.data("param",param);
		// param = encodeURIComponent(param);
		
		// TODO ajaxs		
		
		// $.ajax({
		// 	url:url,
		// 	data:param,
		// 	type:"get",
		// 	dataType:"json",
		// 	success:function(o){

		// 		data = o[opts.mlist];			
		// 		buildList(s,self,data);
				
		// 		// param.total = o.total;	
		// 		pager.total = o.total;

		// 		pager.data("total",o.total);

		// 		pager.find(".J_pages").text(Math.ceil(o.total/param.limit));
		// 		
		// 		pager.find(".J_number").val(Math.ceil(param.start/param.limit) + 1);
		// 	},
		// 	error:function(data){

		// 	}
		// });
		// 
				
		data = Data && Data[opts.mlist];
		buildList(s,self,data);
				
	}

	//暂无数据显示
	function showNoData(s){
		var self = s.find(".J_inner");

		self.append("<p class='tip'>暂无数据!</p>");
	}
	
	// 滚动
	function makeRolling(s){

		var timer = null,
			self = s.find(".J_inner"),
			top,
			length;
			
		self.css({"position":"absolute"});
		var lis = self.find("li").clone(true);
		self.append(lis);
		
		startRolling(s);
	}

	// 初始化事件
	function initEvent(s){
		var opts = s.opts;

		s.find(".J_wrap").hover(function(){
			clearInterval(s.timer);
		},function(){
			startRolling(s);
		});

		s.on("TABLE_ADDITEMSUCCESS",function(e,o){			
			
			$(o).on("click",function(){
				var _self = $(this);

				s.opts.clickHandle(_self);
			});

			$(o).css("cursor","pointer");	
		});

		s.on("TABLE_ADDPAGERSUCCESS",function(e,o){

			var _self = $(o);

			pagerEvent(s,_self);
		});


		s.on("TABLE_INNERCOMPLETE",function(e,o){

			var _self = $(o);

				

			if(opts.operatable){
				var operation = _self.find(".J_value_operation");
				buildOperation(s,operation);				
			}

		});

		s.on("TABLE_ADDONEFUNC",function(e,o1,o2){
			
			var _self = $(o1),
				parent = _self.parents("li");;

			

			_self.on("click",function(){

				confirm(o2.type);

				//点击功能事件
				
				// $.ajax({
				// 	url:o2.url + parent.attr("dbId"),
				// 	method:o2.method,
				// 	data:o2.param,
				// 	dataType:"json",
				// 	success:function(data){
				// 		console.log(data);
				// 	}
				// });
				
			});
		});
		
	}

	//创建功能区
	function buildOperation(s,o){
		var opts = s.opts;

		o.each(function(){
			var $this = $(this),
				wrap = $("<div class='m-operation'></div>"),			
				item = "";
				

			for (var i = 0; i < opts.operations.length; i++) {
				var obj = opts.operations[i]

				item = $("<a href='javascript://' title='" + obj.tit + "'><i class='"+ obj.ico +"'></i></a>");
				wrap.append(item);

				if(obj.enable){
					s.trigger("TABLE_ADDONEFUNC",[item,obj]);					
				}
				
			};
			$this.append(wrap);
		
		});
	}

	//翻页模块事件
	function pagerEvent(s,_self){

		// var first = _self.find(".J_first"),
		// 	last = _self.find(".J_last"),
		// 	pre = _self.find(".J_pre"),
		// 	next = _self.find(".J_next");

		_self.find("button").click(function(){
			var $this = $(this),
				action = $(this).data("action"),
				param = _self.data("param"),
				pages = _self.find(".J_pages").text();

			switch(action){
				case "first":param.start = 0;break;
				case "pre":param.start = param.start - param.limit > 0 ? param.start - param.limit:0;break;
				case "next":param.start = param.start + param.limit < _self.data("total") ? param.start + param.limit:param.start;break;
				case "last":param.start = param.limit*(pages == 0 ? 0:pages - 1);break;
			}

			getData(s);

		});

		if(_self.data("param") == null || _self.data("param") == undefined){

			_self.data("param",{				
				"start":0,
				"pager.offset":0			
			});

		}
		

	}

	// 开始滚动
	function startRolling(s) {
		var self = s.find(".J_inner");

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

	// 交叉选中
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

	// 构建列表
	function buildList(s,self,data){

		var length = data && data.length,
			array = s.data("json"),
			opts = s.data("opts"),
			item = "",
			text = "",
			wid = "";

		if(opts.pager){
			self.empty();
		}

		// data = null;
		if(data == null || data == "" || data == {}){
			console.log(data)
			showNoData(s);
		}else{
			//构建每个条目
			for (var i = 0; i < length; i++) {
				var obj = data[i];

				for (var j = 0; j < array.length; j++) {
					var obj1 = array[j];

					text = obj[obj1.value];

					//格式化表格数据
					if(opts.formats[obj1.value]){					
						text = opts.formats[obj1.value](obj[obj1.value]);
					}

					if(text == undefined){
						text = "";
					}

					//设置每个column宽度
					if(obj1.width){
						wid = obj1.width;
					}else{
						wid = 100/array.length;
					}					

					item += "<span class='border J_value_"+obj1.value+"' style='width:"+ wid +"'>"+text+"</span>"
				};

				//添加每个li类以及数据
				item = $("<li>"+ item + "</li>");
				item.data("json",obj);
				item.attr("dbId",obj.id);
				item.addClass("J_id_"+obj.id);

				
				// console.log(item)
				//可点击所做操作
				if(opts.clickable){
					s.trigger("TABLE_ADDITEMSUCCESS",item);
				}

				self.append(item);
				item = "";
			};
		}

		s.trigger("TABLE_INNERCOMPLETE",self);
								
	}

	// 方法集
	methods = {
		init:function(options){
			
    		return this.each(function(){
    			var s = $(this);
    				   				
    			s.data("opts",options);
    			s.opts = options;    			    		   			

    			initHead(s);    			    			
    			initEvent(s);

    			if(s.opts.pager){
    				initPager(s);
    			}

    			getData(s);

    			if(s.opts.rollable){    				
					makeRolling(s);
					// opts.rollable = false;
				}

				if(s.opts.cross){
					cross(s);
				}
   			

    			if(s.opts.height){
					s.find(".J_wrap").css({"height":s.opts.height});
				}

				if(s.opts.overflow){
					s.find(".J_wrap").css({"overflow":s.opts.overflow});
				}	
    		})
		},
		refresh:function(options){
			
    		return this.each(function(){
    			var $this = $(this);


    		})
		}
	}

	// 插件入口
	$.fn.extend({ 
    	my_table:function(options){
    		var method = null;
			var opts = $.extend({},defaults,options || {});

    		if(opts.refresh){
    			method = methods["refresh"];
    		}else if(opts.init){
				method = methods["init"];
    		}

    		return method.call(this,opts);
    	}    	
	});
})(jQuery)