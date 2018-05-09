var jurisdictionJqGridRowData;
$(document).ready(function () {

	$.jgrid.defaults.styleUI = 'Bootstrap';

	// Examle data for jqGrid
	var jurisdictiondata;
	var jurisdictiondatabak;

	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priActions/queryAll",
		dataType: "json",
		async: false,
		//ContentType: "application/json;charset=UTF-8",
		//contentType: "application/json",
		//			<!-- //crossDomain:true, -->
		//			headers:{
		//				"Content-Type":"application/json;charset=UTF-8"
		//			},
		success: function success(data) {
			//			console.log(data);
			jurisdictiondata = data;
			jurisdictiondatabak = data;
		}
	});

	// Configuration for jqGrid Example 1
	$("#table_list_1").jqGrid({
		data: jurisdictiondata,
		datatype: "local",
		height: 530,
		autowidth: true,
		shrinkToFit: true,
		rowNum: 14,
		rowList: [10, 20, 30],
		colNames: ['序号', '名称', '父菜单ID', '父菜单显示名称', '备注'],
		colModel: [{
			name: 'id',
			index: 'id',
			width: 50,
			sorttype: "int",
			hidden: true
		}, {
			name: 'name',
			index: 'name',
			width: 120
		}, {
			name: 'privilegeFunction.id',
			index: 'privilegeFunction.id',
			width: 100,
			hidden: true
		}, {
			name: 'privilegeFunction.displayname',
			index: 'privilegeFunction.displayname',
			width: 100
		}, {
			name: 'remark',
			index: 'remark',
			width: 180
		}],
		pager: "#pager_list_1",
		viewrecords: true,
		caption: "",
		hidegrid: false,
		rownumbers: true,
		onSelectRow: function onSelectRow(rowId, status) {
			jurisdictionJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		}
	});

	// Add responsive to jqGrid
	$(window).bind('resize', function () {
		var width = $('.jqGrid_wrapper').width();
		$('#table_list_1').setGridWidth(width);
	});

	/*   $("#add-btn").click(function(){
              	
            	$(".modal-title").html("新增警员信息");
            	
            })
           
            $("#update-btn").click(function(){
            	//显示弹窗
            	$(this).attr("data-target","#myModal");
            	$(".modal-title").html("修改警员信息")
            });
            
            $("#delete-btn").click(function(){
            	layer.confirm('是否确定要删除？', {
 				  btn: ['是的','取消'] //按钮
 				}, function(){
 				  layer.msg('删除成功', {icon: 1});
 				});
            })*/

	$("#update-btn").click(function () {
		$(".modal-title").html("修改权限因子信息");
		if (jurisdictionJqGridRowData == null || jurisdictionJqGridRowData == '') {
			layer.confirm('请指定修改的信息列！', {
				btn: ['是的'] //按钮
			});
			$(this).attr("data-target", "");
		} else {
			//数据回显过程
			//console.log(menuJqGridRowData.name);
			var cdselect = $("#xzfcd"); //获取list对象
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/",
				async: false,
				success: function success(result) {
					for (var i = 0; i < result.length; i++) {
						var o = new Option(result[i].displayname, result[i].id);
						cdselect.append(o);
					}
				}
			});
			if (jurisdictionJqGridRowData["privilegeFunction.id"] != null && jurisdictionJqGridRowData["privilegeFunction.id"] != "") {
				$("#xzfcd").find('option[value=' + jurisdictionJqGridRowData["privilegeFunction.id"] + ']').attr("selected", true);
			}
			$(".chosen-select").trigger("chosen:updated");
			$(".chosen-select").chosen();
			$("#cname").val(jurisdictionJqGridRowData.name);
			$("#remark").val(jurisdictionJqGridRowData.remark);
			$(this).attr("data-target", "#myModal");
		}
	});

	$("#delete-btn").click(function () {
		if (jurisdictionJqGridRowData == null || jurisdictionJqGridRowData == '') {
			layer.confirm('请指定删除的信息列！', {
				btn: ['是的'] //按钮
			});
			//$(this).attr("data-target","");
		} else {
			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				$.ajax({
					type: "DELETE",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priActions/deleteAction/" + jurisdictionJqGridRowData.id,
					//			data: JSON.stringify(datajson),
					dataType: "text",
					async: false,
					ContentType: "application/json;charset=UTF-8",
					contentType: "application/json",
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success() {
						layer.msg('删除成功', {
							icon: 1
						});
						setTimeout(function () {
							location.reload();
						}, 1000);
					},
					error: function error() {
						layer.confirm('删除失败！', {
							btn: ['是的'] //按钮
						});
					}
				});
			});
		}
	});

	$("#add-btn").click(function () {
		//显示弹窗
		$(".modal-title").html("新增权限因子信息");
		$("#cname").val("");
		$("#remark").val("");
		$(this).attr("data-target", "#myModal");
		var cdselect = $("#xzfcd"); //获取list对象
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/",
			async: false,
			success: function success(result) {
				for (var i = 0; i < result.length; i++) {
					var o = new Option(result[i].name, result[i].id);
					cdselect.append(o);
				}
			}
		});
		$(".chosen-select").chosen();
	});

	$("#qxbtnss").click(function () {
		if ($("#qxtextss").val() == "") {
			$("#table_list_1").jqGrid('clearGridData');
			$("#table_list_1").jqGrid('setGridParam', {
				data: jurisdictiondatabak
			}).trigger("reloadGrid");
		} else {
			var namelike = $("#qxtextss").val();
			//ajax调接口，给roledata赋值
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priActions/queryByName/" + namelike,
				//			data: JSON.stringify(datajson),
				dataType: "json",
				async: false,
				//ContentType: "application/json;charset=UTF-8",
				//contentType: "application/json",
				//			<!-- //crossDomain:true, -->
				//			headers:{
				//				"Content-Type":"application/json;charset=UTF-8"
				//			},
				success: function success(result) {
					//					console.log(result);
					jurisdictiondata = result;
				}

			});
			$("#table_list_1").jqGrid('clearGridData');
			$("#table_list_1").jqGrid('setGridParam', {
				data: jurisdictiondata
			}).trigger("reloadGrid");
		}
	});
	//点击父级展开树菜单
	//          　var myDiv = $(".parent-div");
	//		$("#menu-name").click(function (event) 
	//		{
	//		showDiv();//调用显示DIV方法
	//		
	//		$(document).one("click", function () 
	//		{//对document绑定一个影藏Div方法
	//		$(myDiv).hide();
	//		});
	//		 
	//		event.stopPropagation();//阻止事件向上冒泡
	//		});
	//		$(myDiv).click(function (event) 
	//		{
	//			event.stopPropagation();//阻止事件向上冒泡
	//		});
	//		
	//		function showDiv() 
	//		{
	//		$(myDiv).fadeIn();
	//		}
});