;(function(){
	var O = function(){ this.init.call(this, arguments); };

	// 默认设置
	O.opt = {
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
		"chooseLimit":true,
		"url":"",
		"param":{
			"limit":10,
		},
		"operatable":true,
		"operations":[
			{	
				"ico":"icon-edit",
				"tit":"编辑",
				"enable":false,
				"type":"edit",
				"url":"",
				"method":"",
				"param":"",					
			},
			{
				"ico":"icon-trash",
				"tit":"移除",
				"enable":true,
				"type":"delete",
				"url":"",
				"method":"",
				"param":"",						
			},
			{
				"ico":"icon-download-alt",
				"tit":"下载",
				"enable":true,
				"type":"download",
				"url":"",
				"method":"",
				"param":"",						
			},
			{
				"ico":"icon-check",
				"tit":"可用",
				"enable":true,
				"type":"choose",
				"url":"",
				"method":"",
				"param":"",						
			}
		]			
	}
	
	$.extend(O.prototype,{
		init: function(o){
			var w = this;

			var data = o[0];
			w.el = data.el;		
			w.opt = $.extend({}, O.opt, data.opt);
			console.log(w.el)
			w.header = w.el.find(".J_header");
			w.wrap = w.el.find(".J_wrap");
			w.inner = w.el.find(".J_inner");
			w.pager = w.el.find(".J_pager");			

			w.initHead();
			w.initEvent();
			w.getData();

			if(w.opt.pager){
				w.initPager();
			}
			
			if(w.opt.rollable){    				
				w.makeRolling();
				// opts.rollable = false;
			}

			if(w.opt.cross){
				w.cross();
			}
			
			if(w.opt.height){
				w.wrap.css({"height":w.opt.height});
			}

			if(w.opt.overflow){
				w.wrap.css({"overflow":w.opt.overflow});
			}	
		},
		buildList:function (data) {
			var w = this;

			var length = data && data.length,
				array = w.header.data("json"),
				opts = w.opt,
				item = "",
				text = "",
				wid = "";

			if(w.opt.pager){
				w.inner.empty();
			}

			// data = null;
			if(data == null || data == "" || data == {}){
				
				w.showNoData();
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
						w.el.trigger("TABLE_ADDITEMSUCCESS",item);
					}

					w.inner.append(item);
					item = "";
				};
			}

			w.el.trigger("TABLE_INNERCOMPLETE",w.inner);
		},
		buildOperation:function (o) {
			var w = this;

			var opts = w.opt;

			o.each(function(){
				var $this = $(this),
					wrap = $("<div class='m-operation'></div>"),			
					item = "";
					

				for (var i = 0; i < opts.operations.length; i++) {
					var obj = opts.operations[i]

					item = $("<a href='javascript://' title='" + obj.tit + "'><i class='"+ obj.ico +"'></i></a>");
					wrap.append(item);

					
					w.el.trigger("TABLE_ADDONEFUNC",[item,obj]);					
					
					
				};
				$this.append(wrap);
			
			});
		},
		cross:function () {
			var w = this;

			var spans = w.el.find("span"),
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
				w.el.find("span."+cls).addClass("cross");

			},function(){
				var _self = $(this),
					li = _self.parent("li");

				li.removeClass("cross");
				w.el.find("span."+cls).removeClass("cross");

			});
		},
		getData:function () {
			var w = this;

			var data = null,									
				url = w.opt.url,
				param = w.pager.data("param");

			param  = $.extend({},param,w.opt.param);

			w.pager.data("param",param);
			// param = encodeURIComponent(param);
			
			// TODO ajaxs		
			
			// $.ajax({
			// 	url:url,
			// 	data:param,
			// 	type:"get",
			// 	dataType:"json",
			// 	success:function(o){

			// 		data = o[w.opt.mlist];			
			// 		buildList(data);
					
			// 		// param.total = o.total;	
			// 		w.pager.total = o.total;

			// 		w.pager.data("total",o.total);

			// 		w.pager.find(".J_pages").text(Math.ceil(o.total/param.limit));
			// 		
			// 		w.pager.find(".J_number").val(Math.ceil(param.start/param.limit) + 1);
			// 	},
			// 	error:function(data){

			// 	}
			// });
			// 
					
			data = Data && Data[w.opt.mlist];
			w.buildList(data);
		},
		initHead:function(){
			var w = this,
				header = "",
				length = w.opt.column.length,
				arr = [];								

			for (var i = 0; i < length; i++) {
				var obj = w.opt.column[i];
				// arr.push(obj.value);
				arr.push({
					"value":obj.value,
					"width":obj.width
				});
				header += "<div class='tlt border' style='width:"+ obj.width +"'>"+obj.name+"</div>";
			};

			w.header.data("json",arr);
			w.header.append($(header));

		},
		initEvent:function () {
			var w = this;
			
			w.wrap.hover(function(){
				clearInterval(w.el.timer);
			},function(){
				w.startRolling();
			});


			w.el.on("TABLE_ADDITEMSUCCESS",function(e,o){			
				
				$(o).on("click",function(){
					var _self = $(this);

					w.opt.clickHandle(_self);
				});

				$(o).css("cursor","pointer");	
			});

			w.el.on("TABLE_ADDPAGERSUCCESS",function(e,o){

				var _self = $(o);

				w.pagerEvent(_self);
			});


			w.el.on("TABLE_INNERCOMPLETE",function(e,o){

				var _self = $(o);
				
				if(w.opt.operatable){
					var operation = _self.find(".J_value_operation");
					w.buildOperation(operation);				
				}

			});

			w.el.on("TABLE_ADDONEFUNC",function(e,o1,o2){
				
				var _self = $(o1);
					

				
				_self.on("click",function(){

					// confirm(o2.type);
					// 
					// 
					if(!o2.enable){
						return false;
					}

					var $this = $(this),
						parent = $this.parents("li");

					alert(parent.attr("dbId"));
					return false;

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
		},		
		initPager:function () {
			var w = this;		
						
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

			lf = $(lf.join(""));
			rgt = $(rgt.join(""));

			if(w.opt.chooseLimit){
				var str = [
						"<li class='f-fl'>",
							"<select class='J_select'>",
								"<option value='5'>",
									"5",
								"</option>",
								"<option value='10' selected>",
									"10",
								"</option>",
								"<option value='20'>",
									"20",
								"</option>",
								"<option value='50'>",
									"50",
								"</option>",
								"<option value='100'>",
									"100",
								"</option>",
							"</select>",
						"</li>"
					];

				rgt.append($(str.join("")));
			}

			w.pager.append(lf).append(rgt);

			w.el.trigger("TABLE_ADDPAGERSUCCESS",w.pager);
		},
		makeRolling:function () {
			var w = this;							
			
			w.inner.css({"position":"absolute"});
			var lis = w.inner.find("li").clone(true);
			w.inner.append(lis);
			
			w.startRolling();
		},
		pagerEvent:function (_self) {
			var w = this;

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

				w.getData();

			});

			_self.find(".J_select").bind("change",function(){

				var param = _self.data("param");

				param.limit = $(this).val();
				w.getData();
			});


			if(_self.data("param") == null || _self.data("param") == undefined){

				_self.data("param",{				
					"start":0,
					"pager.offset":0			
				});

			}
		},
		refresh:function(){},
		setParam:function () {},		
		showNoData:function () {
			var w = this;
			
			w.inner.append("<p class='tip'>暂无数据!</p>");
		},		
		startRolling:function () {
			var w = this;


			//滚动一
			if(w.opt.rollType == 1){
				w.el.timer = setInterval(function(){	
					w.inner.css("top",w.inner.position().top-1);
					if((w.inner.position().top) <= -w.inner.height()/2){				
							w.inner.css({"top":0});	
						}
				},30);
			}
			
			//滚动二
			if(w.opt.rollType == 2){

				w.el.timer = setInterval(function(){			
													
					w.inner.animate({"top":w.inner.position().top-30},600,function(){
						if((w.inner.position().top) == -w.inner.height()/2){
						// getData1(dom,w.inner);
							w.inner.css({"top":0});	
						}
					});
							
				},1000);
			}
					
		},						
	})

	

	$.fn.my_table = function(opt){

		return this.each(function(){

			var t = new O({
				el: $(this),
				opt: opt
			});
            console.log(t)
			$(this).data('my_table', t);

		});
		
	};



})();