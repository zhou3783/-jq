var roleJqGridRowData;
var roledata;
var roledatabak;
//roledata = [ 
//           {id : "1",name : "111",effect : "test",address : "note"}, 
//           {id : "2",name : "222",effect : "test2",address : "note2"}, 
//           {id : "3",name : "333",effect : "test3",address : "note3"}, 
//           {id : "4",name : "444",effect : "test",address : "note"}, 
//           {id : "5",name : "555",effect : "test2",address : "note2"}, 
//           {id : "6",name : "666",effect : "test3",address : "note3"}, 
//           {id : "7",name : "777",effect : "test",address : "note"}, 
//           {id : "8",name : "888",effect : "test2",address : "note2"}, 
//           {id : "9",name : "999",effect : "test3",address : "note3"} 
//         ];
$(document).ready(function () {
	$.jgrid.defaults.styleUI = 'Bootstrap';
	// Examle data for jqGrid

	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/roles/",
		//			data: JSON.stringify(datajson),
		dataType: "json",
		async: false,
		//ContentType: "application/json;charset=UTF-8",
		//contentType: "application/json",
		//			<!-- //crossDomain:true, -->
		//			headers:{
		//				"Content-Type":"application/json;charset=UTF-8"
		//			},
		success: function success(data) {
			roledata = data;
			roledatabak = data;
		}
	});

	// Configuration for jqGrid Example 1

	$("#table_list_1").jqGrid({
		data: roledata,
		datatype: "local",
		height: 530,
		autowidth: true,
		shrinkToFit: true, //自适应宽度
		rowNum: 14, //每页显示行数
		rowList: [10, 20, 30],
		rownumbers: true,
		colNames: ['序号', '库名', '用途', '地址'],
		colModel: [{
			name: 'id',
			index: 'id',
			hidden: true
		}, {
			name: 'name',
			index: 'name',
			width: 100
		}, {
			name: 'stageCode',
			index: 'stageCode',
			width: 80,
			align: "left"
		}, {
			name: 'privilegeCode',
			index: 'privilegeCode',
			width: 50
		}],
		pager: "#pager_list_1",
		viewrecords: true, //显示所有记录数
		caption: "",
		hidegrid: false,
		onSelectRow: function onSelectRow(rowId, status) {
			roleJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		}
	});

	//			 $("#table_list_1").setSelection(1, true);

	// Add responsive to jqGrid
	$(window).bind('resize', function () {
		var width = $('.jqGrid_wrapper').width();
		$('#table_list_1').setGridWidth(width); //重新调整表格宽度
	});

	$("#update-btn").click(function () {
		$(".modal-title").html("修改信息");
		if (roleJqGridRowData == null || roleJqGridRowData == '') {
			layer.confirm('请指定修改的信息列！', {
				btn: ['是的'] //按钮
			});
			$(this).attr("data-target", "");
		} else {
			$(this).attr("data-target", "#myModal");
			//数据回显过程
			//console.log(roleJqGridRowData.name);
			$("#cname").val(roleJqGridRowData.name);
			//          		$("#").val(roleJqGridRowData.invdate);
			$("#privilegeCode").val(roleJqGridRowData.privilegeCode);
			$("#remark").val(roleJqGridRowData.remark);
		}
	});

	$("#delete-btn").click(function () {
		if (roleJqGridRowData == null || roleJqGridRowData == '') {
			layer.confirm('请指定删除的信息列！', {
				btn: ['是的'] //按钮
			});
			//$(this).attr("data-target","");
		} else {
			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				//						调用ajax删除接口 
				var roleid = roleJqGridRowData.id;
				$.ajax({
					type: "DELETE",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/roles/" + roleid,
					//			data: JSON.stringify(datajson),
					//					dataType: "json",
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
		$(".modal-title").html("新增信息");
		//显示弹窗
		$("#cname").val("");
		$("#privilegeCode").val("");
		$("#remark").val("");
		$(this).attr("data-target", "#myModal");
	});

	$("#rolebtnss").click(function () {
		if ($("#roletextss").val() == "") {
			$("#table_list_1").jqGrid('clearGridData');
			$("#table_list_1").jqGrid('setGridParam', {
				data: roledatabak
			}).trigger("reloadGrid");
		} else {
			var namelike = $("#roletextss").val();
			//ajax调接口，给roledata赋值
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/roles/?nameLike=" + namelike,
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
					console.log(result);
					roledata = result;
				}

			});
			$("#table_list_1").jqGrid('clearGridData');
			$("#table_list_1").jqGrid('setGridParam', {
				data: roledata
			}).trigger("reloadGrid");
		}
	});
});