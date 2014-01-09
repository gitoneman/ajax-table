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

	O.prototype = {
		init: function(o){
			var w = this;

			w.el = o.el;
			w.opt = $.extend({}, O.opt, o.opt);
			w.table = $(".J_Table");
			w.header = $(".J_header");
			w.wrap = $(".J_wrap");
			w.inner = $(".J_inner");
			w.pager = $(".J_pager");			

			w.initHead();
			w.initEvent();

			if(w.opt.pager){
				initPager();
			}

			getData();

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
		},
		buildList:function () {},
		buildOperation:function () {},
		cross:function () {},
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
					
			data = Data && Data[w.opt.mlist];
			buildList(s,self,data);
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
				clearInterval(w.timer);
			},function(){
				startRolling();
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

				pagerEvent(s,_self);
			});


			w.el.on("TABLE_INNERCOMPLETE",function(e,o){

				var _self = $(o);

				
				if(w.opt.operatable){
					var operation = _self.find(".J_value_operation");
					buildOperation(s,operation);				
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
		initPager:function () {},
		makeRolling:function () {},
		pagerEvent:function () {},
		refresh:function(){}
		setParam:function () {},		
		showNoData:function () {},		
		startRolling:function () {},						
	}


	$.fn.my_table = function(opt){
		var t = new O({
				el: $(this),
				opt: opt
			});		

		$(this).data('my_table', t);
	};



})();