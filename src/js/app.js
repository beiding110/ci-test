// 如果更新appjs，请不要更新以下方法：
// ajaxResCheck
// ShowMsg
// ShowMsgBox
// ShowConfirm
// AjaxRequest

/**
 * app.js
 *存放常用方法及对象
 *
 * export
 * mainVue类
 *
 * Vue prototype 拓展
 * $get
 * $post
 *
 * window对象拓展
 * ajaxResCheck ajax结果匹配
 * ShowMsgBox 消息弹框
 * ShowMsg 消息通知
 *
 * Date对象拓展
 * pattern 日期格式化
 * Format 日期格式化
 *
 * string对象拓展
 * html 特殊字符转义及反转义
 *
 * owner对象
 * ajax 用法同jquery中的$.ajax
 * validatorObj.mobile 手机格式验证
 * validatorObj.arrayvalue 数组对象验证
 * Chain 责任链类
 * *link 责任链节点
 * *run 责任链运行
 * IsNullOrEmpty 验证非空
 * inAttr 验证是否存在于标签属性
 * enpty_obj 清空对象内容
 * IsNumber 验证是否数字
 * clone 对象深度复制
 * arrBuildTree 数组拼树
 * getSearch 获取window.location.search中某个key的值
 * toSearch 将对象序列化成location.search格式
 * getHash 获取window.location.hash中某个key的值
 * setHash 将设定的键值置入window.location.hash中
 * getLocal 获取localStorage里的数据
 * setLocal 将值存入localStorage
 * getSession 获取sessionStorage里的数据
 * setSession 将值存入sessionStorage
 * setRandomId 根据ref在dom结构上生成一个随机数id
 * sortorder 格式化排序顺序关键字
 * GetGuid 获取文件guid
 * getObjByValue 根据值匹配数组中的对象
 * timeToDate 切分日期为年月日
 * getRandom 生成参数长度的随机数字符串
 * floatToPercent 将小数转化为百分数
 * wxPay 调起微信支付
 * downloader 下载文件
 * imgToBase64 图片转base64编码
 * inheritPrototype 原型链继承
 */

import Vue from 'vue'
import { MessageBox, Toast } from 'mint-ui'

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.mainVue = factory(window));
}(this, (function (owner) {
	//工具组件bus
	window.$bus = new Vue({

	});

    Vue.prototype.$ajax = function(obj) {
        AjaxRequest.call(this, obj);
    };

	Vue.prototype.$get = function (a, b, c, d) {
		var url, data, callback, fztype;

		url = a;
		data = '';
		callback = callback || function () {};
		fztype = false;

		if (arguments.length == 2 && typeof (b) == 'function') {
			callback = b;
		} else if (arguments.length == 2 && typeof (b) != 'function') {
			data = b;
		} else if (arguments.length == 3) {
			if (typeof (arguments[arguments.length - 1]) == 'boolean') {
				data = b;
				fztype = c;
			} else {
				data = b;
				callback = c;
			}
		} else if (arguments.length == 4) {
			data = b;
			callback = c;
			fztype = d;
		}

		AjaxRequest.call(this, {
			url: url,
			data: data,
			type: 'get',
			callback: function (data, res) {
				callback.call(this, data, res)
			}.bind(this),
			fztype: fztype
		})
	}

	Vue.prototype.$post = function (a, b, c, d) {
		var url, data, callback, fztype;

		url = a;
		data = '';
		callback = callback || function () {};
		fztype = false;

		if (arguments.length == 2 && typeof (b) == 'function') {
			callback = b;
		} else if (arguments.length == 2 && typeof (b) != 'function') {
			data = b;
		} else if (arguments.length == 3) {
			if (typeof (arguments[arguments.length - 1]) == 'boolean') {
				data = b;
				fztype = c;
			} else {
				data = b;
				callback = c;
			}
		} else if (arguments.length == 4) {
			data = b;
			callback = c;
			fztype = d;
		}

		AjaxRequest.call(this, {
			url: url,
			data: data,
			type: 'post',
			callback: function (data, res) {
				callback.call(this, data, res)
			}.bind(this),
			fztype: fztype
		})
	}

	/**
	 * ajax方法，用法同jquery中的$.ajax
	 * @return {obj} 同$.ajax参数
	 */
	owner.ajax = function () {
		var ajaxData = {
			type: arguments[0].type || "GET",
			url: arguments[0].url || "",
			async: arguments[0].async || "true",
			data: arguments[0].data || null,
			dataType: arguments[0].dataType || "text",
			contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
			beforeSend: arguments[0].beforeSend || function () {},
			success: arguments[0].success || function () {},
			error: arguments[0].error || function () {}
		};
		ajaxData.beforeSend();
		var xhr = createxmlHttpRequest();
		xhr.responseType = ajaxData.dataType;
		xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
		xhr.setRequestHeader("Content-Type", ajaxData.contentType);
		xhr.send(convertData(ajaxData.data));
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					ajaxData.success(xhr.response);
				} else {
					ajaxData.error(xhr);
				}
			}
		}
	}

	function createxmlHttpRequest() {
		if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		}
	}

	function convertData(data) {
		if (typeof data === 'object') {
			var convertResult = "";
			for (var c in data) {
				convertResult += c + "=" + data[c] + "&";
			}
			convertResult = convertResult.substring(0, convertResult.length - 1);
			return convertResult;
		} else {
			return data;
		}
	}

	/***************************************
	 ***发送ajax请求
	 *** url 请求url//a
	 *** data 提交数据//b
	 *** type 请求类型//c
	 ****** callback 请求成功回调//c\d
	 *fztype 是否复杂回调
	 ***************************************/
	function AjaxRequest(settings) {
		try {
			this.loadingController = true;
		} catch (e) {}

		var c_data = clone(settings.data),
            that = this;

		c_data = !!settings.fztype ? JSON.stringify(c_data) : c_data;
		var contentType = !!settings.fztype ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded;charset=UTF-8';
		var callback = settings.callback || function () {}

		$.ajax({
			url: /\?/.test(settings.url) ? settings.url + '&random=' + owner.getTimeStrmp() : settings.url + '?random=' + owner.getTimeStrmp(),
			type: settings.type || 'get',
			data: c_data,
			contentType: contentType,
            headers: {
				pageuser: getSession('user') ? getSession('user').userid : '',
				usetool: 'wechat',
				pageurl: window.location.href.replace(window.location.search, '')
			},
			success: function (data) {

				var obj = (typeof (data) == 'string' && /{|}/.test(data)) ? JSON.parse(data) : data;

				//反编码
				function decode(target) {
					if (typeof target == 'object' && Array.isArray(target)) {
						target.forEach(function (item) {
							if (typeof item == 'string') item = decode(item);
							else decode(item);
						});
					} else if (typeof target == 'object' && !!target) {
						Object.keys(target).forEach(function (key) {
							if (typeof target[key] == 'string') target[key] = decode(target[key]);
							else decode(target[key]);
						});
					} else if (typeof target == 'string') {
						return target.html();
					}
				}
				decode(obj);


				ajaxResCheck.call(that, obj, settings, callback);
			},
			//AJAX请求结束后，
			complete: function (xhr, status) {
                try {
					that.loadingController = false;
				} catch (e) {}
				try {
					if (xhr.responseJSON.result == "login-index") {
						if (window.parent != window) {
							window.top.location.href = htmlUrl + "/login.html";
						} else {
							location.href = htmlUrl + "/login.html";
						}
					}
				} catch (e) {
					// TODO: handle exception
				};

                !!settings.complete && settings.complete();
			},
            error: function(XHR, textStatus, errorThrown){
                try {
					that.loadingController = false;
				} catch (e) {}
                var switchObj = {
                    '0': '请求发生错误，请检查网络及登录状态',
                    '401': '访问被拒绝',
                    '403': '禁止访问',
                    '404': '未找到',
                    '405': '方法不被允许',
                    '406': '客户端浏览器不接受所请求页面的MIME类型',
                    '407': '要求进行代理身份验证',
                    '412': '前提条件失败',
                    '413': '请求实体太大',
                    '414': '请求URI太长',
                    '415': '不支持的媒体类型',
                    '416': '所请求的范围无法满足',
                    '417': '执行失败',
                    '423': '锁定的错误',
                    '500': '服务器错误',
                    '502': 'Web服务器用作网关或代理服务器时收到了无效响应',
                    '503': '服务不可用',
                    '504': '请求超时，请检查网络'
                };
				ShowMsg.call(that, (XHR.status && switchObj[XHR.status]) ? (XHR.status + '：' + switchObj[XHR.status]) : '请求失败，请重试');
				console.error('ajax-error:'+settings.url);
                console.warn(XHR);

                !!settings.error && settings.error();
			}
		})
	}

	//创建mainVue
	function mainVue(option) {
		window.$vue = null;

		if (!!option) {
			this.init(option);
		}
	}

	mainVue.prototype = {
		data: {},
		methods: {},
		computed: {},
		watch: {},
		created: function () {},
		mounted: function () {},

		init: function (obj) {
			var object = !!obj ? obj : this;

			if (!!obj) {
				object.mounted = object.mounted || function () {};
				object.created = object.created || function () {};
			}

			new Vue({
				el: "#main_con",
				data: function () {
					return object.data
				},
				computed: object.computed,
				watch: object.watch,
				methods: object.methods,
				mounted: function () {
					// document.body.style.backgroundImage = 'none';
					window.$vue = this;
					object.mounted.call(this);
				},
				created: function () {
					window.$vue = this;
					formValidateTrans();

					this.loadingController = this.loadingController || false;
					this.dialogVisible = this.dialogVisible || false;
					this.searchKey = this.searchKey || '';
					this.tableData = this.tableData || [];

					object.created.call(this);
				}
			});
		},

		getdata: function (a, b, c, d) {
			if (arguments.length <= 3) {
				var a_url = a,
					a_data_obj = b,
					success_callback = c || function () {};
				(function (a1, b1, c1) {
					AjaxRequest(a1, b1, "get", function (data, res) {
						c1(data, res);
					})
				})(a_url, a_data_obj, success_callback)
			} else if (arguments.length == 4) {
				var a_url = a,
					a_data_obj = b,
					a_type = c,
					success_callback = d || function () {};
				(function (a1, b1, c1, d1) {
					AjaxRequest(a1, b1, c1, function (data, res) {
						d1(data, res);
					})
				})(a_url, a_data_obj, a_type, success_callback)
			};
		}
	};

	/**
	 * 验证属性是否存在，为true或''
	 * @param  {str}  target 待验证目标
	 * @return {Boolean}        返回值，存在未true，反之false
	 */
	function isExist(target) {
		if (target != null && target != undefined && target != 'false') {
			return true;
		} else {
			return false;
		}
	}

	//表单验证预处理
	function formValidateTrans() {

		var nodeList = document.querySelectorAll('el-form-item'),
			typeArr = ['string', 'number', 'boolean', 'method', 'regexp', 'integer', 'float', 'array', 'object', 'enum', 'date', 'url', 'hex', 'email'];
			typeMap = ['字符串', '数字', '布尔', 'method', '正则', 'integer', '浮点数', '数组', '对象', 'enum', '日期', 'url地址', '哈希', '电子邮件'];

		for (var i = 0; i < nodeList.length; i++) {
			var rules = [],
				mobileValStr = '';

			if (isExist(nodeList[i].getAttribute('required'))) {
				var trigger = ['blur']
				if (isExist(nodeList[i].getAttribute('change'))) {
					trigger.push("change");
				}
				rules.push.apply(rules, [{
					'required': 'true',
					'message': '请输入' + nodeList[i].getAttribute('label'),
					'trigger': trigger
				}]);

				mobileValStr += (dotBuilder(mobileValStr) + '{"validator": validatorObj.required,"trigger": ["blur", "change"]}');
				nodeList[i].removeAttribute('required');
				nodeList[i].removeAttribute('change');
			}

			if (isExist(nodeList[i].getAttribute('min'))) {
				rules.push({
					'min': parseInt(nodeList[i].getAttribute('min')),
					'message': '至少输入' + nodeList[i].getAttribute('min') + '个字符',
					'trigger': 'blur'
				})
				nodeList[i].removeAttribute('min');
			}

			if (isExist(nodeList[i].getAttribute('max'))) {
				rules.push({
					'max': parseInt(nodeList[i].getAttribute('max')),
					'message': '至多输入' + nodeList[i].getAttribute('max') + '个字符',
					'trigger': 'blur'
				})
				nodeList[i].removeAttribute('max');
			}

			if (isExist(nodeList[i].getAttribute('mobile'))) {
				mobileValStr += (dotBuilder(mobileValStr) + '{ "validator":validatorObj.mobile,"trigger": ["blur", "change"]}');
				nodeList[i].removeAttribute('mobile');
			}
			if (isExist(nodeList[i].getAttribute('arrayvalue'))) {
				mobileValStr += (dotBuilder(mobileValStr) + '{ "validator":validatorObj.arrayvalue,"trigger": ["blur", "change"]}');
				nodeList[i].removeAttribute('arrayvalue');
			}

			for (var j = 0; j < typeArr.length; j++) {
				if (nodeList[i].getAttribute(typeArr[j]) != null && nodeList[i].getAttribute(typeArr[j]) != undefined && nodeList[i].getAttribute(typeArr[j]) != 'false') {
					rules.push({
						'type': typeArr[j],
						'message': '请输入正确的' + typeMap[j] + '格式',
						'trigger': ['blur', 'change']
					})
				}
			}



			var oldRules = nodeList[i].getAttribute(':rules') || '[]',
				slicedRules = JSON.stringify(rules).slice(1, -1);

			function dotBuilder(str) {
				return !!str ? ',' : ''
			}

			var newRulesStr = '[' + slicedRules + dotBuilder(slicedRules) + mobileValStr + dotBuilder(mobileValStr) + oldRules.slice(1, -1) + ']';
			newRulesStr = newRulesStr.replace(/"/g, "'");
			nodeList[i].setAttribute(':rules', newRulesStr);

		}
	}

	/**
	 * ajax code查询
	 * @param  {Object}   obj      返回的对象
	 * @param  {Object}   settings 接口相关测试（非必须）
	 * @param  {Function} callback 回调函数
	 * @return {null}            [description]
	 */
     window.ajaxResCheck = function(obj, settings, callback){
 		var that = this;
 		var callback = callback;
 		if(arguments.length == 2){
 			callback = settings;
 		}

 		var switchObj = {
 			'v': function() {
 				!!callback && callback(obj.tdata, obj);
 			},
 			'pglist': function() {
 				!!callback && callback(obj);
 			},
 			'valerror': function() {
 				if (!IsNullOrEmpty(obj.msg)) {
 					ShowMsgBox.call(that, obj.msg, "success");
 				};
 			},
 			'login-index': function() {
 				ShowMsgBox.call(that, obj.msg, 'error', function(){
 					sessionStorage.clear();
 					window.top.location.href = (that.$store.state.htmlUrl+"/login.html");
 				});
 			},
 			'jump-url': function () {
 				ShowMsgBox.call(that, obj.msg, 'info', function () {
 					window.top.location.href = (that.$store.state.htmlUrl + obj.url);
 				});
 			},
 			'wechat': function() {
 				var url = obj.url;
 				if(obj.url) {
 					if(/http/.test(url)) {
 						window.location.href = obj.url;
 					} else {
                        if(!new RegExp(url).test(window.location.hash))
					       that.goto(url)
 					}
 				}
 			},
 			'error': function() {
 				if(/(40163)|(40029)/.test(obj.msg)) {
 					var href = window.location.href,
 						search = window.location.search;
 					window.location.replace(href.replace(search, ''));
 				} else {
 					ShowMsgBox.call(that, obj.msg, 'error', function(){
 						throw new Error(JSON.stringify(settings));
 					});
 				}
 			}
 			// 'login-openid': function() {
 			// 	that.$get(this.getStore('sysUrl') + '/getuser', function(data) {
 			// 		AjaxRequest.call(this, settings)
 			// 	})
 			// }
 		}

 		return !!switchObj[obj.code]
 			? switchObj[obj.code]()
 			: (/^(throw-)/.test(obj.code)
 				? (function(){
 					obj.code = obj.code.split('throw-')[1];
 					callback && callback(obj);
 				}())
 				: ShowMsgBox.call(this, obj.msg, 'error', function () {
 					throw new Error('unexpeted ajaxResCheck code\nsettings:'+JSON.stringify(settings) + '\nresponse:' + JSON.stringify(obj));
 				}));
 	}

	/**
	 * 对Date的扩展，将 Date 转化为指定格式的String
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	 * eg:
	 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
	 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
	 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
	 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	使用：(eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"))).pattern("yyyy-M-d h:m:s.S");
	 */
	window.Date.prototype.pattern = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
			"H+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		var week = {
			"0": "日",
			"1": "一",
			"2": "二",
			"3": "三",
			"4": "四",
			"5": "五",
			"6": "六"
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}

	/**
	 * 特殊字符转义及反转义
	 * @param  {Boolean} encode 类型true为转义false为反转义
	 * @return {string}        结果字符串
	 */
	String.prototype.html = function (encode) {
		var replace = ["&#39;", "'",
			"&quot;", '"',
			"&nbsp;", " ",
			"&gt;", ">",
			"&lt;", "<",
			"&amp;", "&",
			"&yen;", "¥",
			"&lsquo;", "‘",
			"&rsquo;", "’",
			"&hellip;", "…",
			"&ldquo;", "“",
			"&rdquo;", "”",
			"&mdash;", "—"
		];
		if (encode) {
			replace.reverse();
		}
		for (var i = 0, str = this; i < replace.length; i += 2) {
			str = str.replace(new RegExp(replace[i], 'g'), replace[i + 1]);
		}
		return str;
	};

	window.Date.prototype.Format = function (fmt) { //author: meizz
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"H+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

    /******************
	*** MessageBox 消息弹框
	*** msg 提示信息
	*** type 消息类型
	******************/
	window.ShowMsgBox = function(msg, type, callback) {
		callback = callback || function () { }
		if(/iPhone|Android/i.test(window.navigator.userAgent.toLowerCase())){
			MessageBox.alert(msg, '提示').then(function(a) {
				callback()
			});
		}else {
			this.$alert(msg, {
				type: type || "warning",
				callback: callback,
				dangerouslyUseHTMLString: true
			});
		}
	}

	/******************
	*** Notification 消息通知
	*** msg 提示信息
	*** type 消息类型
	******************/
	window.ShowMsg = function(msg, type) {
		if(/iPhone|Android/i.test(window.navigator.userAgent.toLowerCase())){
			Toast({
				message: msg,
				iconClass: !!type ? 'icon icon-' + type : ''
			});
		}else {
			this.$notify({
				message: msg,
				type: type || "warning"
			});
		}
		//$message({ showClose: true, message: msg, type: type || "warning", duration: 1500 });
	}

	/**
	 * confirm确认选择框
	 * @param  {string} msg  提示信息
	 * @param  {string} type 提示类型
	 * @param  {function} cb1  确认回调
	 * @param  {Function} cb2  取消回调
	 * @return {null}      无返回值
	 */
	window.ShowConfirm = function (msg, type, cb1, cb2) {
		cb1 = cb1 || function () {};
		cb2 = cb2 || function () {};

		if(/iPhone|Android/i.test(window.navigator.userAgent.toLowerCase())){
			MessageBox.confirm(msg, '提示').then(function(a) {
				cb1()
			});
		}else {
			this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: type || 'warning',
				showClose: false,
				callback: function (action, instance) {
					if (action == 'confirm') {
						cb1();
					} else {
						cb2();
					}
				}
			})
		}
	}

	//通用方法
	owner.validatorObj = {
		required: function(rules, value, callback) {
			if(typeof value === 'string') {
				if(!value.replace(/^\s+|\s+$/g,"")) {
					return callback(new Error('内容不能为空格'))
				}
			}
			callback();
		},
		mobile: function (rules, value, callback) {
			if (!/^[1][0-9]{10}$/.test(value)) {
				return callback(new Error('手机号格式错误'));
			}
			callback();
		},
		arrayvalue: function (rules, value, callback) {
			if (!value.join()) {
				return callback(new Error('请填写其它'));
			}
			callback();
		}
	}



	/**
	 * 责任链类
	 * @constructor
	 */
	owner.Chain = function () {
		this.chain_arr = [];
	}
	owner.Chain.prototype = {
		/**
		 * 链的内容
		 * @param  {function} fun 待执行函数，包含两个参数：通用参数及执行下一环节的函数
		 * @return {this}     返回自身，可链式调用
		 */
		link: function (fun) {
			var that = this;
			if (typeof (fun) == 'function') {
				this.chain_arr.push(fun);
			};
			return this;
		},
		/**
		 * 执行责任链
		 * @param  {Object} obj 责任链中的通用参数
		 * @return {null}     [description]
		 */
		run: function (obj) {
			var that = this,
				index = 0,
				obj = obj;

			var loop = function () {
				var this_node = that.chain_arr[index];
				index++;
				if (!!this_node) {
					return this_node(obj, loop)
				}
			};

			loop();
		}
	};

	//验证是否为空
	owner.IsNullOrEmpty = function (val) {
		if (val != undefined && val != null && val != "") {
			return false;
		}
		return true;
	}

	owner.inAttr = function (val) {
		if (val === true || val === 'true' || val === '') {
			return true;
		} else {
			return false;
		}
	}

	//清空对象内容
	owner.enpty_obj = function (obj) {
		Object.keys(obj).map(function (key) {
			obj[key] = null;
		})
		return obj;
	}

	//验证是否为数字
	owner.IsNumber = function (value) {
		if (isNaN(value)) {
			return 0;
		}
		return value;
	}

	//对象深拷贝
	owner.clone = function (obj) {
		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			var copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			var copy = [];
			for (var i = 0, len = obj.length; i < len; ++i) {
				copy[i] = clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			var copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}


	/*
	数组拼树
	targetArr目标数组
	parentKeyWord父级关键字
	selfKeyWord自身关键字
	*/
	owner.arrBuildTree = function (targetArr, parentKeyWord, selfKeyWord) {
		var arr_tree = [];

		targetArr.forEach(function (item) {
			item.children = [];
		})
		targetArr.forEach(function (item) {
			if (!(item[parentKeyWord] === 0 || item[parentKeyWord] === '0')) {
				var that = item;
				targetArr.forEach(function (item) {
					if (item[selfKeyWord] == that[parentKeyWord]) {
						item.children.push(that);
					}
				})
			} else {
				arr_tree.push(item);
			}
		});
		/*清除children为空的项*/
		targetArr.forEach(function (item) {
			if (item.children.length == 0) {
				delete item.children
			}
		})
		return arr_tree;
	}

	/**
	 * 树结构拆数组
	 * @param  {object|array} targetTree 树形结构对象或数组
	 * @param  {string} childKey   子项索引key
	 * @return {object}            返回的对象，array为拆分后的数组，depth为树的深度
	 */
	owner.treeBreakArr = function (targetTree, childKey) {
		var arr = [],
			deep = 0,
			childKey = childKey || 'children';

		function deepLoop(tree, level) {
			var depth = level + 1;
			deep = (deep > level) ? deep : level;
			tree.forEach(function (item) {
				arr.push(item);
				if (Array.isArray(item[childKey]) && item[childKey].length > 0) {
					deepLoop(item[childKey], depth);
				}
			})
		};

		if (typeof targetTree == 'object' && Array.isArray(targetTree)) {
			deepLoop(targetTree, 1);
		} else if (typeof targetTree == 'object' && !Array.isArray(targetTree)) {
			var a = [];
			a.push(targetTree);
			deepLoop(a, 1);
		};

		return {
			array: arr,
			depth: deep
		};
	}

	/********
	接收地址栏参数
	key:参数名称
	**********/
	owner.getSearch = function (key) {
		var hash = [];
		try {
			hash = window.location.search.split('?')[1].split("&");
		} catch (e) {}
		var hashObj = {};
		hash.forEach(function (item) {
			hashObj[item.split("=")[0]] = item.split("=")[1];
		});
		if (!!key)
			return /%u/.test(hashObj[key]) ? unescape(hashObj[key]) : hashObj[key];
		else
			return hashObj;
	}

	/**
	 * 将对象转化成search字符串
	 * @param  {Object} obj  对象或数组
	 * @param  {boolean} flag 是否携带'?'
	 * @return {string}      返回的格式化后字符串
	 */
	owner.toSearch = function (obj, flag) {
		var res = '?'
		if (typeof obj == 'object' && Array.isArray(obj)) {
			obj.forEach(function (item, index) {
				res += ('[' + index + ']=' + owner.toSearch(item, true) + '&');
			});
		} else if (typeof obj == 'object') {
			Object.keys(obj).forEach(function (key) {
				if (typeof obj[key] == 'object' && Array.isArray(obj[key])) {
					obj[key].forEach(function (item, index) {
						res += (key + '[' + index + ']=' + owner.toSearch(item, true) + '&')
					});
				} else if (typeof obj[key] == 'object' && obj[key] != null) {
					res += (owner.toSearch(obj[key], true) + '&');
				} else {
					var item = /[\u3220-\uFA29]/.test(obj[key]) ? escape(obj[key]) : obj[key];
					res += (key + '=' + (item || '') + '&');
				}

			});
		} else {
			return obj;
		}
		return !!flag ? res.slice(1, -1) : res.slice(0, -1);
	};

	/**
	 * 生成hash值并放置如window.location.href
	 * @param  {string}   key      键
	 * @param  {string}   value    值
	 * @param  {Function} callback 回调函数
	 * @return {null}            返回值
	 */
	owner.setHash = function (key, value, callback) {

		var hash = [];
		try {
			hash = window.location.hash.split('#')[1].split("&");
		} catch (e) {}
		var hashObj = {};
		$(hash).each(function () {
			hashObj[this.split("=")[0]] = this.split("=")[1];
		});

		if (typeof key === 'string') {
			callback = callback || function () {};

			hashObj[key] = value;

		} else if (typeof key === 'object') {
			callback = value || function () {};
			Object.keys(key).forEach(function (item) {
				hashObj[item] = key[item]
			})
		}

		var hashStr = '#';
		for (tkey in hashObj) {
			hashStr += (tkey + '=' + hashObj[tkey] + '&');
		};
		if (!!window.location.hash) {
			window.location.replace(window.location.href.replace(window.location.hash, hashStr.slice(0, -1)));
		} else {
			window.location.replace(window.location.href + hashStr.slice(0, -1))
		}

		callback();
	};

	/**
	 * 获取window.location.hash中特定值
	 * @param  {string} key 待获取的key
	 * @return {string}     获取到的值
	 */
	owner.getHash = function (key) {
		var hash = [];
		try {
			hash = window.location.hash.split('#')[1].split("&");
		} catch (e) {}
		var hashObj = {};
		hash.forEach(function (item) {
			hashObj[item.split("=")[0]] = item.split("=")[1];
		});
		if (!!key)
			return hashObj[key];
		else
			return hashObj;
	}

	/**
	 * 设置storage基方法
	 * @param  {string} type sessionStorage或localStorage
	 * @param  {string} key  要取的key
	 * @return {string|Object}      对应存储的数据
	 */
	function getStorage(type, key) {
		var res = !!key ?
			window[type][key] ?
			((/{|}|%7B|%7D|\[|\]|%5B|%5D/.test(window[type][key]) ?
				JSON.parse(unescape(window[type][key])) :
				unescape(window[type][key]))) : undefined :
			window[type];
		return res || false;
	}
	/**
	 * 获取storage基方法
	 * @param {string} type  sessionStorage或localStorage
	 * @param {string|object} key   要设置的key或整个对象
	 * @param {Object} value 已设置的结果
	 */
	function setStorage(type, key, value) {
		if (typeof key === 'string') {
			window[type][key] = (typeof value === 'object') ? escape(JSON.stringify(value)) : escape(value);
		} else if (typeof key === 'object') {
			Object.keys(key).forEach(function (item) {
				window[type][item] = (typeof value === 'object') ? escape(JSON.stringify(key[item])) : escape(key[item]);
			});
		};
		return window[type];
	}

	/**
	 * 获取localStorage里的数据
	 * @param  {string} key 待获取的key
	 * @return {string|Object} 取回的值
	 */
	owner.getLocal = function (key) {
		return getStorage('localStorage', key);
	}

	/**
	 * 将值存入localStorage
	 * @param  {string|Object} key   待存值的key或json对象
	 * @param  {string|object} value 待存值的value
	 * @return {object}       存入后localStorage对象
	 */
	owner.setLocal = function (key, value) {
		return setStorage('localStorage', key, value);
	}

	/**
	 * 获取sessionStorage里的数据
	 * @param  {string} key 待获取的key
	 * @return {string|Object} 取回的值
	 */
	owner.getSession = function (key) {
		return getStorage('sessionStorage', key);
	}

	/**
	 * 将值存入sessionStorage
	 * @param  {string|Object} key   待存值的key或json对象
	 * @param  {string|object} value 待存值的value
	 * @return {object}       存入后sessionStorage对象
	 */
	owner.setSession = function (key, value) {
		return setStorage('sessionStorage', key, value);
	}

	/**
	 * 在目标ref上生成一个随机id
	 * @param  {obj} ref vue的一个ref实例
	 * @return {string}     生成的随机id
	 */
	owner.setRandomId = function (ref) {
		var target = this.$refs[ref],
			random = (Math.random() * 100000 + '').slice(0, 5);

		var randomId = ref + '-' + random;
		target.setAttribute('id', randomId);

		return randomId;
	}

	/*格式化排序顺序关键字*/
	owner.sortorder = function (str) {
		try {
			if (str.indexOf('asc') > -1) {
				return 'asc'
			} else if (str.indexOf('desc') > -1) {
				return 'desc'
			}
		} catch (e) {
			return str
		}
	}

	//获取fileguid
	owner.GetGuid = function () {
		var guid = "";
		$.ajaxSetup({
			async: false
		});
		this.$get(sysUrl + "/sysfile/getguid", {}, function (data, res) {
			guid = data;
		})
		$.ajaxSetup({
			async: true
		});
		return guid;
	}

	owner.getObjByValue = function (obj) {
		var res = null;
		var arr = obj.arr,
			target = obj.target,
			key = obj.key || 'key',
			value = obj.value || 'value',
			mapkey = obj.mapkey || key,
			mapvalue = obj.mapvalue || value,
			add = obj.add || false

		var arrMap = {};

		if (typeof (obj.target) == 'string') {
			arr.forEach(function (item) {
				arrMap[escape(item[value])] = item;
			});

			res = {};
			if (add) {
				res = clone(arrMap[escape(target)]);
			};
			res[mapkey] = arrMap[escape(target)][key];
			res[mapvalue] = target;
		} else if ((typeof (obj.target) == 'object') && Array.isArray(obj.target)) {
			res = [];
			arr.forEach(function (item) {
				arrMap[escape(item[value])] = item;
			});

			target.forEach(function (item) {
				res.push(arrMap[escape(item)])
			})
		}

		return res;
	}

	/**
	 * 切分yyyy-MM-dd hh:mm:ss格式的字符串成yyyy-MM-dd格式
	 * @param  {string} time 时间格式字符串
	 * @return {string}      日期格式字符串
	 */
	owner.timeToDate = function (time) {
		if (/ /.test(time)) {
			return time.split(' ')[0];
		} else {
			return time
		}
	}

	/**
	 * 生成某长度随机数字符串
	 * @param  {Number} length 随机字符串长度
	 * @return {string}        随机数字符串
	 */
	owner.getRandom = function (length) {
		var random = Math.random() + '';
		return random.slice(2, length + 2);
	}

	/**
	 * 生成当前时间戳
	 * @return {string} 生成的时间戳
	 */
	owner.getTimeStrmp = function () {
		return (new Date()).getTime();
	}

	/**
	 * 小数转百分数字符串
	 * @param  {Number} num    小数
	 * @param  {number} length 生成百分比的小数点后位数
	 * @param  {boolean} range 是否将结果限制在0-100%
	 * @return {string}        百分比字符串
	 */
	owner.floatToPercent = function (num, length, range) {
		var calc = (Number(num) * 100);
		if (calc > 100 && !!range) calc = 100;
		return calc.toFixed(length) + '%';
	}

	owner.wxPay = function (obj, callback, errcallback) {
		//调起支付
		WeixinJSBridge.invoke('getBrandWCPayRequest', {
			"appId": obj.appId,
			"timeStamp": obj.timeStamp,
			"nonceStr": obj.nonceStr,
			"package": obj.package,
			"signType": "MD5",
			"paySign": obj.paySign
		}, function (res) {
			//支付成功
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				alert("支付成功");
				!!callback && callback();
			} else if (res.err_msg == "get_brand_wcpay_request:fail") {
				alert("支付失败，请重试");
				!!errcallback && errcallback();
			} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
				alert("用户取消支付");
				!!errcallback && errcallback();
			} else {
				alert(res.err_msg);
				!!errcallback && errcallback();
			};
		});
	}

	/**
	 * 下载功能
	 * @param  {string} path 附件服务器完整地址
	 * @return {Boolean}      结果
	 */
	owner.downloader = function (path) {
		var eleA = document.createElement('a');
		if ('download' in eleA) {
			eleA.setAttribute('download', path);
			eleA.setAttribute('href', path);

			eleA.innerHTML = 'downloading';

			document.body.appendChild(eleA);

			setTimeout(function () {
				eleA.click();
				document.body.removeChild(eleA);
			}, 1000 / 24);
			return true;
		};

		try {
			var elemIF = document.createElement("iframe");
			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
			elemIF.src = path;
			setTimeout(function () {
				document.body.removeChild(elemIF);
			}, 333);
			return true;
		} catch (e) {
			var form = document.createElement('form');
			form.setAttribute('method', 'get');
			form.setAttribute('action', path);
			document.body.appendChild(form);
			setTimeout(function () {
				form.submit();
				document.body.removeChild(form);
			}, 1000 / 24);
			return true;
		}

		if (!window.open(url)) { // popup blocked, offer direct download:
			if (confirm("请使用右键-另存为进行下载，完成后点击后退返回当前页面")) {
				location.href = url;
			}
		}
		return true;
	}

	/**
	 * 图片转base64编码
	 * @param  {string}   url          文件存储路径
	 * @param  {Function} callback     回调函数
	 * @param  {string}   outputFormat 图片编码类型
	 * @return {null}                返回值
	 */
	owner.imgToBase64 = function (url, callback, outputFormat) {
		var canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'),
			img = new Image;
		img.crossOrigin = 'Anonymous';
		img.onload = function () {
			canvas.height = img.height;
			canvas.width = img.width;
			ctx.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL(outputFormat || 'image/png');
			callback.call(this, dataURL);
			canvas = null;
		};
		img.src = url;
	}

	/**
	 * 原型链继承
	 * @param  {Function} subType   子类
	 * @param  {function} superType 父类
	 * @return {null}           返回值
	 */
	owner.inheritPrototype = function (subType, superType) {
		var protoType = Object.create(superType.prototype);
		// Object.crear = function(superType) {
		// 		var F = function() {};
		// 		F.prototype = superType;
		// 		return new F();
		// }
		protoType.constructor = subType;
		subType.prototype = protoType;
	}

	/**
	 * 导航栏hash值监听反馈类
	 * @param  {Object} obj 设置参数watch对象中应包含待监听的key
	 * @return {null}     返回值
	 */
	owner.Hasher = function (obj) {
		this.Init(obj);
	};
	owner.Hasher.prototype = {
		$data: {},
		$watch: {},
		Init: function (obj) {
			var that = this;
			//url变化监听器
			this.$watch = obj.watch;

			var objData = obj.data || {};
			this.$data = mixin(this.getHash(), objData, true);

			this.initListener(this.$data);

			if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode >= 8)) {
				// 浏览器支持onhashchange事件
				window.onhashchange = function (e) {
					var change = that.hashWatcher(e);

					that.initListener(change.add);
					that.updateData(change.update);

					var deled = {};
					change.del.forEach(function (item) {
						deled[item] = '';
					});
					that.updateData(deled);
				};
			} else {
				throw new Error('您的浏览器不支持hash监听事件');
			};

			obj.mounted && obj.mounted.call(this);
		},
		change: function(method, key, value) {
			var newHref = this.crearNewHref(key, value),
				switchObj = {
					push: function(newHref) {
						window.location.href = newHref;
					},
					replace: function(newHref) {
						window.location.replace(newHref)
					}
				}

			switchObj[method](newHref);

			if(value === this.$data[key]) {
				this.$watch[key] && this.$watch[key](value, this.$data[key]);
			};

			return newHref;
		},
		/**
		 * 可返回的在导航中加入参数，类比history对象pushState方法
		 * @param  {string/Object} key   键或对象
		 * @param  {string} value 值
		 * @return {string}       新的地址值
		 */
		push: function (key, value) {
			return this.change('push', key, value)
		},
		/**
		 * 不可返回的在导航中加入参数，类比history对象replaceState方法
		 * @param  {string/Object} key   键或对象
		 * @param  {string} value 值
		 * @return {string}       新的地址值
		 */
		replace: function (key, value) {
			return this.change('replace', key, value)
		},
		toHash: function (key, value, callback) {
			var hashObj = this.getHash();

			if (typeof key === 'string') {
				callback = callback || function () {};

				hashObj[key] = value;

			} else if (typeof key === 'object') {
				callback = value || function () {};
				Object.keys(key).forEach(function (item) {
					hashObj[item] = key[item]
				})
			}

			var hashStr = '#';
			for (tkey in hashObj) {
				if (tkey == '$path')
					hashStr += (hashObj[tkey] + '&');
				else
					hashStr += (tkey + '=' + hashObj[tkey] + '&');
			};
			return hashStr.slice(0, -1);
		},
		crearNewHref: function (key, value) {
			var hash = this.toHash(key, value),
				href = window.location.href;

			if (!!window.location.hash) {
				return (href.replace(window.location.hash, hash));
			} else {
				return (href + hash);
			}

			return newHref;
		},
		getHash: function () {
			var hash = [], hash_str = window.location.hash, handleType = 0;
			var hash_content = hash_str.split('#')[1], hash_search = '';

			if(/\?/.test(hash_str)) {
				handleType = 1;
				if(/^#[^\?=&!]+\?/g.test(hash_str)) {
					hash_search = hash_content;
				} else {
					var before = hash_content.split('?')[0];
					var after = hash_content.split('?')[1];
					hash = before.split('&');
					var last = hash.splice(-1, 1);

					hash_search = last + '?' + after;
				}
			} else {
				try {
					hash = hash_str.split('#')[1].split("&");
				} catch (e) {}
			}

			var hashObj = {};
			hash.forEach(function (item) {
				if (/=/.test(item))
					hashObj[item.split("=")[0]] = item.split("=")[1];
				else
					hashObj['$path'] = item;
			});

			if(handleType) {
				hashObj['$path'] = hash_search;
			}

			return hashObj;
		},
		hashWatcher: function (e) {
			var that = this;
			var newHash = this.getHash();
			var update = {},
				add = {},
				del = [];

			Object.keys(newHash).forEach(function (key) {
				if (that.$data[key] === undefined && newHash[key] !== undefined) {
					add[key] = newHash[key];
				} else if (that.$data[key] != newHash[key]) {
					update[key] = {
						old: that.$data[key],
						new: newHash[key]
					}
				}
			});

			Object.keys(this.$data).forEach(function (key) {
				if (that.$data[key] !== undefined && newHash[key] === undefined) {
					del.push(key);
				}
			});

			return {
				update: update,
				add: add,
				del: del
			}
		},
		initListener: function (obj) {
			var that = this;
			Object.keys(obj).forEach(function (key) {
				Object.defineProperty(that, key, {
					get: function () {
						return that.$data[key];
					},
					set: function (e) {
						var oldVal = that.$data[key];
						that.$data[key] = e;
						if (!!that.$watch[key])
							that.$watch[key](e, oldVal);
						// that.replace(key, e);
					}
				})
			});
		},
		updateData: function (obj) {
			var that = this;
			Object.keys(obj).forEach(function (key) {
				that[key] = obj[key].new;
			})
		}
	};

	/**
	 * 异步加载js
	 * @param  {string} src js文件路径
	 * @return {Boolean}     加载结果
	 */
	owner.loadScript = function (src) {
		if (!src) {
			throw new Error('请指定要加载的js文件路径');
			return false;
		};
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.async = true;
		s.src = src;
		var x = document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(s, x);
		return true;
	}

	/**
	 * 数字转中文金额
	 * @param  {number|string} n 数字金额
	 * @return {string}     转换后的中文金额
	 */
	owner.Arabia_to_Chinese = function (n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];
        var head = n < 0 ? '欠': '';
        n = Math.abs(n);

        var s = '';

        for (var i = 0; i < fraction.length; i++)
        {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);

        for (var i = 0; i < unit[0].length && n > 0; i++)
        {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++)
            {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
	}

	/**
	 * 遍历型对象混入，将obj混入target
	 * @param  {Object} obj    待混入的对象
	 * @param  {Object} target 混入目标对象
	 * @param  {Boolean} state  是否覆盖混入
	 * @return {object}        混入后的对象
	 */
	owner.mixin = function (obj, target, state) {
        obj = obj || {};
		Object.keys(obj).forEach(function (key) {
			if (state) {
				target[key] = obj[key];
			} else {
				if (!target[key])
					target[key] = obj[key];
			}
		});
		return target;
	}

	/**
	 * 遮罩层类
	 * @param       {Object} obj 设置
	 * @constructor
	 */
	owner.ShadeBox = function (obj) {
		this.init(obj);
	};
	owner.ShadeBox.prototype = {
		el: null,
		animate: 300,
		lock: false,
		/**
		 * 遮罩层构造函数，body末尾创造一个隐藏的全屏div
		 * @param  {Object} obj 相关设置：{
		 * style:遮罩层样式,
		 * animate: 动画效果持续时间默认300ms,
		 * lock: 显示遮罩时，是否锁定body禁止滚动,
		 * innerHTML: 遮罩层内dom字符串}
		 * @return {undefined}     无返回值
		 */
		init: function (obj) {
			var body = document.body,
				cover = document.createElement('div'),
				defStyle = {
					position: 'fixed',
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					zIndex: 5000,
					display: 'none',
					transition: 'all',
					opacity: 0,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '1.2em'
				}
			this.lock = obj.lock;

			if (!!obj.animate) {
				var ani = obj.animate;
				if (/s/.test(ani)) {
					ani = Number(ani.split('s')[0]) * 1000;
				};
				this.animate = Number(ani);
			}
			defStyle.transition = 'all ' + (this.animate / 1000) + 's';

			mixin(obj.style || {}, defStyle);
			Object.keys(defStyle).forEach(function (key) {
				cover.style[key] = defStyle[key];
			});

			cover.id = 'cover__div--' + getRandom(5);

			cover.innerHTML = obj.innerHTML || '';

			body.appendChild(cover);
			this.el = cover;
		},
		/**
		 * 显示遮罩层
		 * @return {undefined} 无返回值
		 */
		show: function () {
			document.body.style.overflow = this.lock ? 'hidden' : '';
			this.el.style.display = 'block';
			this.el.style.opacity = 1;
		},
		/**
		 * 隐藏遮罩层
		 * @return {undefined} 无返回值
		 */
		hide: function () {
			document.body.style.overflow = '';
			this.el.style.opacity = 0;
			setTimeout(function () {
				this.el.style.display = 'none';
			}.bind(this), this.animate);
		}
	};

	owner.win = (function() {
		function toSearch(obj, flag) {
			var res = '?'
			if (typeof obj == 'object' && Array.isArray(obj)) {
				obj.forEach(function (item, index) {
					res += ('[' + index + ']=' + owner.toSearch(item, true) + '&');
				});
			} else if (typeof obj == 'object') {
				Object.keys(obj).forEach(function (key) {
					if (typeof obj[key] == 'object' && Array.isArray(obj[key])) {
						obj[key].forEach(function (item, index) {
							res += (key + '[' + index + ']=' + owner.toSearch(item, true) + '&')
						});
					} else if (typeof obj[key] == 'object' && obj[key] != null) {
						res += (owner.toSearch(obj[key], true) + '&');
					} else {
						var item = /[\u3220-\uFA29]/.test(obj[key]) ? escape(obj[key]) : obj[key];
						res += (key + '=' + (item || '') + '&');
					}

				});
			} else {
				return obj;
			}
			return !!flag ? res.slice(1, -1) : res.slice(0, -1);
		}

		function argHandler() {
			callback = (typeof(arguments[arguments.length-1])==='function') ? arguments[arguments.length-1] : function() {};
			var url = '';
			if(typeof(arguments[0]) === 'string'){
				url = arguments[0];
			}else if(typeof(arguments[0]) === 'object') {
				var path = arguments[0].path,
					query = arguments[0].query;

				url = (typeof(query) === 'object') ? (path + toSearch(query)) : path;
			};
			var timeStamp = (new Date).getTime();
			url = /\?/.test(url) ? (url + '&ts=' + timeStamp) : (url + '?ts=' + timeStamp);
			callback(url);
		};

		function argArrBuilder(arg, callback) {
			var argArr = [];
			for(var i = 0; i < arg.length; i++){
				argArr.push(arg[i]);
			}
			argArr.push(callback);
			return argArr;
		};

		return {
			g: function() {
				argHandler.apply(this, argArrBuilder(arguments, function(url) {
                    window.location.href = url;
				}));
			},
			r: function() {
				argHandler.apply(this, argArrBuilder(arguments, function(url) {
                    window.location.replace(url);
				}));
			}
		}
	})()

	return mainVue;

	//var $vue = new mainVue();

	//$vue.data = {

	//};

	//$vue.methods = {

	//};

	//$vue.created = function () {

	//}

	//main_Vue.init();
})))