var flag; //add与update标识
var mianJqGridRowData; //点击行数据                                             
//chosen-select 插件初始化
$(".chosen-select").chosen();
$.jgrid.defaults.styleUI = 'Bootstrap';

var mydata;
var totalRecords;
//var serachText; // 模糊查询
var mydataSerach;
var totalRecordsSerach;
var flagSerach;
var totalPage;

$.jgrid.defaults.styleUI = 'Bootstrap';
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/getOrgaInfo",

	dataType: "json",
	async: false,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		for (var i = 0; i < data.length; i++) {
			var ele = "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
			$("#stationid").append(ele);
			$("#stationidstationid").append(ele);
		}
		$(".chosen-select").trigger("chosen:updated");
	}
});
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag?pageSize=2000",
	dataType: "json",
	async: false,
	success: function success(result) {
		//			console.log(result);
		for (var i = 0; i < result["data"].length; i++) {
			var o = new Option(result["data"][i].code);
			$("#code").append(o);
		}
	},
	error: function error(textStatus) {
		layer.msg('加载超时', {
			icon: 3
		});
	}
});
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/mappolygonCrud/fetchMappolygonPointTagLike",
	data: {
		"pageIndex": 0,
		"pageSize": 10
	},
	dataType: "json",
	async: false,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		mydata = data.data;
		totalRecords = data.elementsSum;
		totalPage = countTotalPage(totalRecords);
	}
});

function countTotalPage(totalRecords) {
	var pages;
	if (totalRecords <= 10) {
		pages = 1;
	} else {
		if (totalRecords % 10 == 0) {
			pages = totalRecords / 10;
		} else {
			pages = parseInt(totalRecords / 10) + 1;
		}
	}
	return pages;
}

//表格初始化
$("#table_list_mian").jqGrid({
	data: mydata,
	datatype: "local",
	height: 530,
	autoScroll: true,
	autowidth: true,
	shrinkToFit: true,
	rowNum: 10,
	//	rownumbers: true,

	colNames: ['面名称', '资源类型编码', '资源类型id', 'id', '等级', '面对象编码', '备注', '资源id', '所属部门', '所属部门id'],
	colModel: [{
		name: 'name',
		index: 'name',
		width: 150
	}, {
		name: 'code',
		index: 'code',
		width: 150
	}, {
		name: 'deviceTypeId',
		index: 'deviceTypeId',
		width: 80,
		hidden: true
	}, {
		name: 'id',
		index: 'id',
		sorttype: "int",
		hidden: true
	}, {
		name: 'objlevel',
		index: 'objlevel',
		width: 50
	}, {
		name: 'polygoncode',
		index: 'polygoncode',
		width: 200
	}, {
		name: 'remark',
		index: 'remark',
		width: 200

	}, {
		name: 'resourceId',
		index: 'resourceId',
		width: 100,
		hidden: true
	}, {
		name: 'stationName',
		index: 'stationName',
		width: 120
	}, {
		name: 'stationid',
		index: 'stationid',
		width: 80,
		hidden: true
	}],

	viewrecords: true,
	caption: "",
	hidegrid: false,

	onSelectRow: function onSelectRow(rowId, status) {
		mianJqGridRowData = $("#table_list_mian").jqGrid("getRowData", rowId);
		//		console.log(mianJqGridRowData);
	}

});

// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_mian').setGridWidth(width);
});

$.jqPaginator('#pagination1', {
	totalPages: totalPage,
	visiblePages: 10,
	currentPage: 1,
	onPageChange: function onPageChange(num, type) {

		var mydata;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/mappolygonCrud/fetchMappolygonPointTagLike",
			data: {
				"pageIndex": num - 1,
				"pageSize": 10

			},
			dataType: "json",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				//	console.log(data);
				mydata = data.data;
				totalRecords = data.elementsSum;
			}
		});

		$("#table_list_mian").jqGrid('clearGridData'); //清空表格
		$("#table_list_mian").jqGrid('setGridParam', { // 重新加载数据
			datatype: 'local',
			data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

		}).trigger("reloadGrid");
	}
});

$("#add-btn").click(function () {
	flag = "add";
	$("#commentForm").find("input").val("");
	$("#stationid option").eq(0).prop("selected", true);
	$(".chosen-select").trigger("chosen:updated");
	$(".modal-title").html("新增面资源信息");
});

function objToform(obj) {
	for (var attr in obj) {
		if ($("#" + attr).length > 0) {
			$("#" + attr).val(obj[attr]);
		}
	}
}

$("#update-btn").click(function () {
	flag = "update";
	$(".modal-title").html("修改面资源信息");
	if (mianJqGridRowData == null || mianJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");

		//回显
		objToform(mianJqGridRowData);
		$("#stationId").find("option[value='" + mianJqGridRowData.stationId + "']").prop("selected", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

$("#delete-btn").click(function () {
	if (mianJqGridRowData == null || mianJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
	} else {
		layer.confirm('是否确定要删除？', {
			btn: ['是的', '取消'] //按钮
		}, function () {
			layer.closeAll('dialog');
			$.ajax({
				type: "delete",
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/mappolygonCrud/deleteMappolygonPointTag/" + mianJqGridRowData.id,

				dataType: "text",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					//console.log(data);
					if (data == 500 || data == '500') {
						layer.msg('删除失败', {
							icon: 2
						});
					} else {
						layer.msg('删除成功', {
							icon: 1
						});
						setTimeout(function () {
							location.reload();
						}, 1000);
					}
				},
				error: function error(returndata) {
					//console.log(returndata);
					layer.msg('删除失败', {
						icon: 2
					});
				}

			});
		});
	}
});

//搜索按钮点击事件
$("#plsCarTpSch").click(function () {
	if ($("#namename").val().trim() === "" && $("#polygoncodepolygoncode").val().trim() === "" && $("#stationidstationid").val().trim() === "") {
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/mappolygonCrud/fetchMappolygonPointTagLike",
					data: {
						"pageIndex": num - 1,
						"pageSize": 10

					},
					dataType: "json",
					async: false,
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {
						//	console.log(data);
						mydata = data.data;
						totalRecords = data.elementsSum;
					}
				});
				$("#stationidstationid option").eq(0).prop("selected", true);
				$("#stationidstationid").trigger("chosen:updated");
				$("#table_list_mian").jqGrid('clearGridData'); //清空表格
				$("#table_list_mian").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	} else {
		var array = ["name", "polygoncode", "stationid"];
		var yzurl = likeQuery(YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/mappolygonCrud/fetchMappolygonPointTagLike?", array);
		//		console.log(url);
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: yzurl,
					data: {
						"pageIndex": num - 1,
						"pageSize": 10

					},
					dataType: "json",
					async: false,
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {
						//	console.log(data);
						mydata = data.data;
						totalRecords = data.elementsSum;
					}
				});
				$("#stationidstationid option").eq(0).prop("selected", true);
				$("#stationidstationid").trigger("chosen:updated");
				$("#table_list_mian").jqGrid('clearGridData'); //清空表格
				$("#table_list_mian").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	}
});

//表单提交

function mianAction() {
	if (flag == "add") {
		console.log(JSON.stringify($('#commentForm').serializeJSON()));
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/mappolygonCrud/addMappolygonPointTag",
			data: JSON.stringify($('#commentForm').serializeJSON()),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				if (data == 500 || data == '500') {
					layer.msg('新增失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				} else {
					layer.msg('新增成功', {
						icon: 1
					});

					$('#myModal').modal('hide');
					setTimeout(function () {
						location.reload();
					}, 1000);
				}
			},

			error: function error(returndata) {
				console.log(returndata);

				layer.msg('新增失败', {
					icon: 1
				});
				$('#myModal').modal('show');
			}
		});
	} else if (flag == "update") {
		var commentForm = $('#commentForm').serializeJSON();
		commentForm.id = mianJqGridRowData.id;
		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/mappolygonCrud/updateMappolygonPointTag",
			data: JSON.stringify(commentForm),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				if (data == 500 || data == '500') {
					layer.msg('修改失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				} else {
					layer.msg('修改成功', {
						icon: 1
					});
					$('#myModal').modal('hide');
					setTimeout(function () {
						location.reload();
					}, 1000);
				}
			},

			error: function error(returndata) {

				layer.msg('修改失败', {
					icon: 1
				});
				$('#myModal').modal('show');
			}
		});
	}
}