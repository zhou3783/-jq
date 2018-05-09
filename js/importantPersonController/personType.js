var flag; //add与update标识
var selectRowplcCar;
var selectRowplcCar1;
//chosen-select 插件初始化
$(".chosen-select").chosen();

//菜单选中高亮
//$("#table_list_jc").on("mousedown", "tbody tr", function() {
//	$(".selected").not(this).removeClass("selected");
//	$(this).addClass("selected");
//});

var mydata;
var totalRecords;
//var serachText; // 模糊查询
var mydataSerach;
var totalRecordsSerach;
var flagSerach;
var totalPage;

//var getMaxProperty = (data, prop) => {
//	var set = new Set();
//	for(let i = 0, len = data.length; i < len; i++) {
//		set.add(data[i][prop]);
//	}
//	let arrayHierarchy = [];
//	for(let a of set) {
//		arrayHierarchy.push(a);
//	}
//	let maxHierarchy = Math.max.apply(null, arrayHierarchy);
//	return maxHierarchy;
//}

//_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/root", null, (data) => {
//	for(var m = 0, len = data.length; m < len; m++) {
//			$("#treetable").append(`<tr data-tt-id="${data[m].id}" hierarchy="${data[m].hierarchy}" typekey="${data[m].typekey}" typename="${data[m].typename}" type="${data[m].type}">  <td>${data[m].typename}</td><td></td><td><button class="btn btn-sm typeBj" >编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button><button class="btn btn-primary btn-sm typeTj">添加子节点</button></td></tr>`);
//	}
//}, () => {});
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/root",
	async: false,
	success: function success(data) {
		$("#treetable").html("<tr><th>\u7C7B\u578B\u540D\u79F0</th><th>\u603B\u6570</th><th>\u64CD\u4F5C</th></tr>");
		for (var m = 0, len = data.length; m < len; m++) {
			$("#treetable").append("<tr data-tt-id=\"" + data[m].id + "\" hierarchy=\"" + data[m].hierarchy + "\" typekey=\"" + data[m].typekey + "\" typename=\"" + data[m].typename + "\" type=\"" + data[m].type + "\">  <td>" + data[m].typename + "</td><td></td><td><button class=\"btn btn-sm typeBj\" >\u7F16\u8F91</button><button class=\"btn btn-danger btn-sm typeSc\">\u5220\u9664</button><button class=\"btn btn-primary btn-sm typeTj\">\u6DFB\u52A0\u5B50\u8282\u70B9</button></td></tr>");
		}
	},
	error: function error(_error) {
		console.log(_error);
	}
});

_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/all/withCount", null, function (data1) {
	var data = data1;
	var maxHierarchy = 50;
	for (var i = 0; i < maxHierarchy; i++) {
		$('#treetable tbody tr').each(function (i) {
			var count = 0;
			for (var j = 0; j < data.length; j++) {
				if (data[j]["parentid"] === $(this).attr("data-tt-id")) {
					count++;
					$(this).after("<tr data-tt-id=\"" + data[j].id + "\" data-tt-parent-id=\"" + data[j].parentid + "\" hierarchy=\"" + data[j].hierarchy + "\" typekey=\"" + data[j].typekey + "\" typename=\"" + data[j].typename + "\" type=\"" + data[j].type + "\">  <td>" + data[j].typename + "</td><td>" + data[j].count + "</td><td><button class=\"btn btn-sm typeBj\" >\u7F16\u8F91</button><button class=\"btn btn-danger btn-sm typeSc\">\u5220\u9664</button><button class=\"btn btn-primary btn-sm typeTj\">\u6DFB\u52A0\u5B50\u8282\u70B9</button></td></tr>");
					data.splice(j, 1);
				}
			}
			//			if($(this).find("td").eq(1).html() === "" || $(this).find("td").eq(1).html() === null){
			//				$(this).find("td").eq(1).html(count);
			//			}
			/*var htmlNum = $(this).find("td").eq(1).html() === "" ? 0 : parseInt($(this).find("td").eq(1).html());
   var count = htmlNum + count;
   $(this).find("td").eq(1).html(count);*/
		});
	}
	$("#treetable").treetable({
		expandable: true,
		initialState: "collapsed",
		branchAttr: "expanded"
	});
}, function () {});

//_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/allLeaf", null, (data) => {
//	
//}, () => {});

//{
//	$("#treetable").treetable({
//		expandable: true, //展示 	
//		initialState: "expanded",
//		//默认打开所有节点
//		stringCollapse: '关闭',
//		stringExpand: '展开',
//		onNodeExpand: function() {
//			// 分支展开后的回调函数 		
//			var node = this;
//			//判断当前节点是否已经拥有子节点 		
//			var childSize = $("#treetable").find("[data-tt-parent-id='" + node.id + "']").length;
//			if(childSize > 0) {
//				return;
//			}
//			var data = "pageId=" + node.id;
//			// Render loader/spinner while loading 加载时渲染 	
//			$.ajax({
//				loading: false,
//				sync: false,
//				// Must be false, otherwise loadBranch happens after showChildren? 	
//				url: context + "/document/loadChild.json",
//				data: data,
//				success: function(result) {
//					if(0 == result.code) {
//						if(!com.isNull(result.body)) {
//							if(0 == eval(result.body['chilPages']).length) {
//								//不存在子节点 	
//								var $tr = $("#treetable").find("[data-tt-id='" + node.id + "']");
//								$tr.attr("data-tt-branch", "false");
//								// data-tt-branch 标记当前节点是否是分支节点，在树被初始化的时候生效 
//								$tr.find("span.indenter").html("");
//								// 移除展开图标 	
//								return;
//							}
//							var rows = this.getnereateHtml(result.body['chilPages']);
//							$("#treetable").treetable("loadBranch", node, rows);
//							// 插入子节点 	
//							$("#treetable").treetable("expandNode", node.id);
//							// 展开子节点
//						}
//					} else {
//						alert(result.tip);
//					}
//				}
//			});
//		}
//	});
//}
//var dgjd = (data, ele) => {
//	for(var i = 0; i < data.length; i++) {
//		$.ajax({
//			type: "get",
//			url: `${YZ.ajaxURLms}api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/leaf/${data[i].id}`,
//			dataType: "json",
//			async: false,
//			headers: {
//				"Content-Type": "application/json;charset=UTF-8"
//			},
//			success: function(data1) {
//				ele += `<tr data-tt-id="${data[i].id}" hierarchy="${data[i].hierarchy}" typekey="${data[i].typekey}" typename="${data[i].typename}" type="${data[i].type}">  <td>${data[i].typename}</td><td>${data1.length}</td><td><button class="btn btn-sm typeBj" >编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button><button class="btn btn-primary btn-sm typeTj">添加子节点</button></td></tr> `;
//				for(var j = 0; j < data1.length; j++) {
//					if(data1.length === 0) {} else {
//						ele += `<tr data-tt-id="${data1[j].id}" data-tt-parent-id="${data1[j].parentid}" hierarchy="${data1[j].hierarchy}" typekey="${data1[j].typekey}" typename="${data1[j].typename}" type="${data1[j].type}">  <td>${data1[j].typename}</td> <td></td><td><button class="btn btn-sm typeBj">编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button></tr> `;
//						dgjd(data1, ele);
//					}
//				}
//			}
//		});
//	}
//}

//if(impTypeTmp[i].parentid === null) {
//	impTypeTmp.splice(i, 1);
//var initTree = (impTypeList, ele) => {
//	var impTypeTmp = impTypeList;
//	for(var i = 0; i < impTypeTmp.length; i++) {
//		ele += `<tr data-tt-id="${impTypeTmp[i].id}" data-tt-parent-id="${impTypeTmp[i].parentid}" hierarchy="${impTypeTmp[i].hierarchy}" typekey="${impTypeTmp[i].typekey}" typename="${impTypeTmp[i].typename}" type="${impTypeTmp[i].type}">  <td>${impTypeTmp[i].typename}</td> <td></td><td><button class="btn btn-sm typeBj">编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button></tr> `;
//		for(var j = 0; j < impTypeTmp.length; j++) {
//			if(impTypeTmp[j].parentid === impTypeTmp[i].id) {
//				ele += `<tr data-tt-id="${impTypeTmp[j].id}" data-tt-parent-id="${impTypeTmp[j].parentid}" hierarchy="${impTypeTmp[j].hierarchy}" typekey="${impTypeTmp[j].typekey}" typename="${impTypeTmp[j].typename}" type="${impTypeTmp[j].type}">  <td>${impTypeTmp[j].typename}</td> <td></td><td><button class="btn btn-sm typeBj">编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button></tr> `;
//				impTypeList.splice(j, 1);
//			}
//		}
//	}
//	initTree(impTypeList, ele);
//}

//var initPage = () => {
//	$.ajax({
//		type: "get",
//		url: `${YZ.ajaxURLms}api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/root`,
//		dataType: "json",
//		async: false,
//		headers: {
//			"Content-Type": "application/json;charset=UTF-8"
//		},
//		success: function(data) {
//			var length = data.length;
//			var ele = `<thead><tr>
//          <th>类型名称</th>
//          <th>总数</th>
//          <th>操作</th>
//        </tr></thead><tbody>`;
//			//			_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/allLeaf", null, (result) => {
//			//				initTree(result,ele);
//			//			}, () => {});
//			for(var i = 0; i < length; i++) {
//				$.ajax({
//					type: "get",
//					url: `${YZ.ajaxURLms}api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/leaf/${data[i].id}`,
//					dataType: "json",
//					async: false,
//					headers: {
//						"Content-Type": "application/json;charset=UTF-8"
//					},
//					success: function(data1) {
//						ele += `<tr data-tt-id="${data[i].id}" hierarchy="${data[i].hierarchy}" typekey="${data[i].typekey}" typename="${data[i].typename}" type="${data[i].type}">  <td>${data[i].typename}</td><td>${data1.length}</td><td><button class="btn btn-sm typeBj" >编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button><button class="btn btn-primary btn-sm typeTj">添加子节点</button></td></tr> `;
//						for(var j = 0; j < data1.length; j++) {
//							if(data1.length === 0) {} else {
//								ele += `<tr data-tt-id="${data1[j].id}" data-tt-parent-id="${data1[j].parentid}" hierarchy="${data1[j].hierarchy}" typekey="${data1[j].typekey}" typename="${data1[j].typename}" type="${data1[j].type}">  <td>${data1[j].typename}</td> <td></td><td><button class="btn btn-sm typeBj">编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button></tr> `;
//							}
//						}
//					}
//				});
//			}
//			$("#table_list_jc").html(ele + `</tbody>`);
//			$("#table_list_jc").treetable({
//				expandable: true,
//				initialState: "collapsed"
//			});
//		}
//	});
//}

//var forPage = () => {
//	$.ajax({
//		type: "get",
//		url: `${YZ.ajaxURLms}api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/allLeaf`,
//		dataType: "json",
//		async: false,
//		headers: {
//			"Content-Type": "application/json;charset=UTF-8"
//		},
//		success: function(data) {
//			var set = new Set();
//			for(let i = 0, len = data.length; i < len; i++) {
//				set.add(data[i]["hierarchy"]);
//			}
//			let arrayHierarchy = [];
//			for(let a of set) {
//				arrayHierarchy.push(a);
//			}
//			let maxHierarchy = Math.max.apply(null, arrayHierarchy);
//			console.log(maxHierarchy);
//			var txt = ``;
//			for(var i = 2; i < maxHierarchy + 1; i++) {
//				var dataHierarchy = [];
//				for(var j = 0, len = data.length; j < len; j++) {
//					if(data[j]["hierarchy"] === i) {
//						dataHierarchy.push(data[j]);
//					}
//				}
//				for(var k = 0; k < dataHierarchy.length; k++) {
//					txt += `<tr data-tt-id="${dataHierarchy[k].id}"><td>${dataHierarchy[k].id}</td></tr>`;
//					for(var m = 0; m < data.length; m++) {
//						if(dataHierarchy[k]["id"] === data[m]["parentid"]) {
//							txt += `<tr data-tt-id="${data[m].id}" data-tt-parent-id ="${dataHierarchy[k].id}"><td>${data[m].id}</td></tr>`;
//						}
//					}
//				}
//			}
//			console.log(txt);
//			$("#table_list_jc").html(txt);
//			$("#table_list_jc").treetable({
//				expandable: true,
//				initialState: "collapsed",
//				branchAttr: "ttBranch"
//			});
//		}
//	});
//}
//forPage();

//var initPage = () => {
//	$.ajax({
//		type: "get",
//		url: `${YZ.ajaxURLms}api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/root`,
//		dataType: "json",
//		async: false,
//		headers: {
//			"Content-Type": "application/json;charset=UTF-8"
//		},
//		success: function(data) {
//			var length = data.length;
//			var ele = `<thead><tr>
//          <th>类型名称</th>
//          <th>总数</th>
//          <th>操作</th>
//        </tr></thead><tbody>`;
//			//			_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/allLeaf", null, (result) => {
//			//				initTree(result,ele);
//			//			}, () => {});
//			for(var i = 0; i < length; i++) {
//				$.ajax({
//					type: "get",
//					url: `${YZ.ajaxURLms}api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/leaf/${data[i].id}`,
//					dataType: "json",
//					async: false,
//					headers: {
//						"Content-Type": "application/json;charset=UTF-8"
//					},
//					success: function(data1) {
//						ele += `<tr data-tt-id="${data[i].id}" hierarchy="${data[i].hierarchy}" typekey="${data[i].typekey}" typename="${data[i].typename}" type="${data[i].type}" count="${data1.length}">  <td> ${data[i].typename}</td><td>${data1.length}</td><td><button class="btn btn-sm typeBj" >编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button><button class="btn btn-primary btn-sm typeTj">添加子节点</button></td></tr> `;
//						for(var j = 0; j < data1.length; j++) {
//							if(data1.length > 0) {
//								ele += `<tr data-tt-id="${data1[j].id}" data-tt-parent-id="${data1[j].parentid}" hierarchy="${data1[j].hierarchy}" typekey="${data1[j].typekey}" typename="${data1[j].typename}" type="${data1[j].type}">  <td>${data1[j].typename}</td> <td></td><td><button class="btn btn-sm typeBj">编辑</button><button class="btn btn-danger btn-sm typeSc">删除</button><button class="btn btn-primary btn-sm typeTj">添加子节点</button></td></tr>`;
//							}
//						}
//					}
//				});
//			}
//			$("#treetable").html(ele + `</tbody>`);
//			$("#treetable").treetable({
//				expandable: true,
//				initialState: "collapsed",
//				branchAttr: "expanded"
//			});
//		}
//	});
//}
//initPage();

//删除按钮点击事件
$(document).on('click', '.typeSc', function () {
	var selectDom = $(this);
	layer.confirm('是否确定要删除？', {
		btn: ['是的', '取消'] //按钮
	}, function () {
		var deleteId = selectDom.parent().parent().attr("data-tt-id");
		//		console.log(selectDom.parent().parent().attr("data-tt-id"));
		_ajax('d', 'api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/' + deleteId, null, function () {
			layer.msg('删除成功!', {
				icon: 1
			});
			setTimeout(function () {
				location.reload();
			}, 1000);
		}, function () {
			layer.msg('删除失败!', {
				icon: 2
			});
		});
	});
});

//添加子节点
var xzzjdParentId;
$(document).on('click', '.typeTj', function () {
	$("#myModalLabel").html("新增重点人类型子节点!");
	$("#commentForm").find("input").val("");
	$('#myModal').modal('show');
	xzzjdParentId = $(this).parent().parent().attr("data-tt-id");
});
//新增按钮点击事件
$("#add-btn").click(function () {
	$("#myModalLabel").html("新增重点人类型!");
	$("#commentForm").find("input").val("");
});

//修改按钮点击事件
var xgSelectId;
var xgSelectParentId;
$(document).on('click', '.typeBj', function () {
	//	$("#hierarchy").val($(this).parent().parent().attr("hierarchy"));
	//	$("#type").val($(this).parent().parent().attr("type"));
	xgSelectParentId = $(this).parent().parent().attr("data-tt-parent-id");
	//	console.log(xgSelectParentId===undefined)
	//	console.log(typeof(xgSelectParentId)==="undefined")
	xgSelectId = $(this).parent().parent().attr("data-tt-id");
	$("#hierarchy").find("option[value='" + $(this).parent().parent().attr("hierarchy") + "']").prop("selected", true);
	$("#type").find("option[value='" + $(this).parent().parent().attr("type") + "']").prop("selected", true);
	$(".chosen-select").trigger("chosen:updated");
	$("#typekey").val($(this).parent().parent().attr("typekey"));
	$("#typename").val($(this).parent().parent().attr("typename"));
	$("#myModalLabel").html("修改重点人类型!");
	$('#myModal').modal('show');
	//	if(selectRowplcCar != null) {
	//		$("#update-btn").attr("data-target", "#myModal");
	//		$("#myModalLabel").html("修改人流点位信息!");
	//		//输入框值回显
	//		objToform(selectRowplcCar);
	//		$("#stationId").find("option[value='" + selectRowplcCar.stationId + "']").prop("selected", true);
	//		$(".chosen-select").trigger("chosen:updated");
	//	} else {
	//		$("#update-btn").attr("data-target", "");
	//		layer.msg('请选择要修改的列!', {
	//			icon: 2
	//		});
	//	}
});

//保存按钮点击事件
$("#plsCarTpSave").click(function () {
	if ($("#typekey").val() != "" && $("#typename").val() != "") {
		if ($("#myModalLabel").html() == "新增重点人类型!") {
			var obj = $('#commentForm').serializeJSON();
			_ajax("p", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/", obj, function () {
				layer.msg('新增成功!', {
					icon: 1
				});
				$(".close").click();
				setTimeout(function () {
					location.reload();
				}, 1000);
			}, function () {
				layer.msg('新增失败!', {
					icon: 2
				});
				$(".close").click();
			});
		} else if ($("#myModalLabel").html() == '新增重点人类型子节点!') {
			var obj = $('#commentForm').serializeJSON();
			obj.parentid = xzzjdParentId;
			_ajax("p", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/", obj, function () {
				layer.msg('新增成功!', {
					icon: 1
				});
				$(".close").click();
				setTimeout(function () {
					location.reload();
				}, 1000);
			}, function () {
				layer.msg('新增失败!', {
					icon: 2
				});
				$(".close").click();
			});
		} else {
			var obj = $('#commentForm').serializeJSON();
			if (typeof xgSelectParentId === "undefined") {
				obj.parentid = null;
			} else {
				obj.parentid = xgSelectParentId;
			}
			_ajax("pt", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/" + xgSelectId, obj, function () {
				layer.msg('修改成功!', {
					icon: 1
				});
				$(".close").click();
				setTimeout(function () {
					location.reload();
				}, 1000);
			}, function () {
				layer.msg('修改失败!', {
					icon: 2
				});
				$(".close").click();
			});
		}
	} else {
		layer.msg('请填写必填字段!', {
			icon: 2
		});
	}
});

// 特殊字符验证
function TextValidate(obj) {
	console.log(obj.context.value);
	var flag = "0";
	var pattern = new RegExp("[~'!@#￥$%^&*()-+_=:]");
	if (obj.context.value != "" && obj.context.value != null) {
		if (pattern.test(obj.context.value)) {
			flag = "1";
		}
	}
	if (obj.context.value.trim().length === 0) flag = "1"; //不能输入空格符  
	if (obj.context.value == null || obj.context.value == "") flag = "0";
	if (flag == "1") {
		//$.dialog.tips("输入内容不能包含空格或任何这些特殊字符:\n , ` ~ ! @ # $ % ^ + & * \\ / ? | : . < > {} () [] \" ");  
		layer.msg('输入内容不能包含特殊字符 !', {
			icon: 2
		});
		$("#plsCarTpSave").attr("disabled", "disabled");
		obj.focus();
	} else {
		$("#plsCarTpSave").removeAttr("disabled");
	}
}
$("#typename").blur(function () {
	TextValidate($(this));
});
$("#typekey").blur(function () {
	TextValidate($(this));
});