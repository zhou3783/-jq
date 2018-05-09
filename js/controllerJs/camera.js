var flag; //add与update标识
var cameraJqGridRowData; //点击行数据   
var importantPlaceJqGridRowData;
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
//时间控件绑定
$('#date1').datetimepicker({
	minView: "month",
	format: "yyyy-mm-dd",
	autoclose: true
});

//人员组织架构
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/getOrgaInfo",

	dataType: "json",
	async: false,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		//		console.log(data);
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
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/camera/fetchTAllCamera",
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
		for (var i = 0; i < data.data.length; i++) {
			data.data[i].yzid = data.data[i].id + data.data[i].code;
		}
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
$("#table_list_camera").jqGrid({
	data: mydata,
	datatype: "local",
	height: 530,
	autoScroll: true,
	autowidth: true,
	shrinkToFit: false,
	rowNum: 10,
	//	rownumbers: true,

	colNames: ['序号', '序号', '账号', '地址', '大图', '摄像头类型', '安装时间', 'IP地址', '状态', '维护单位', '维护单位电话', '名称', '设备号', '密码', '杆号', '备注', '小图', '所属部门', '所属部门名称', '纬度', '经度', '点位名称', '扩展属性表', '资源类型编码', '资源类型', '父ID'],
	colModel: [{
		name: 'yzid',
		index: 'yzid',
		hidden: true,
		key: true
	}, {
		name: 'id',
		index: 'id',
		sorttype: "int",
		hidden: true
	}, {
		name: 'accout',
		index: 'accout',
		width: 80
	}, {
		name: 'address',
		index: 'address',
		width: 250
	}, {
		name: 'bimage',
		index: 'bimage',
		width: 80
	}, {
		name: 'category',
		index: 'category',
		width: 80

	}, {
		name: 'installTime',
		index: 'installTime',
		width: 76
	}, {
		name: 'ipAddress',
		index: 'ipAddress',
		width: 100

	}, {
		name: 'isonline',
		index: 'isonline',
		width: 60
	}, {
		name: 'maintenanceUnit',
		index: 'maintenanceUnit',
		width: 80
	}, {
		name: 'maintenanceUnitTel',
		index: 'maintenanceUnitTel',
		width: 120
	}, {
		name: 'name',
		index: 'name',
		width: 220
	}, {
		name: 'num',
		index: 'num',
		width: 160
	}, {
		name: 'password',
		index: 'password',
		width: 80
	}, {
		name: 'poleNum',
		index: 'poleNum',
		width: 80
	}, {
		name: 'remark',
		index: 'remark',
		width: 220
	}, {
		name: 'simage',
		index: 'simage',
		width: 80
	}, {
		name: 'stationid',
		index: 'stationid',
		width: 80,
		hidden: true
	}, {
		name: 'stationName',
		index: 'stationName',
		width: 120
	}, {
		name: 'latitude',
		index: 'latitude',
		width: 120
	}, {
		name: 'longitude',
		index: 'longitude',
		width: 120
	}, {
		name: 'pointName',
		index: 'pointName',
		width: 200
	}, {
		name: 'owner',
		index: 'owner',
		width: 150
	}, {
		name: 'code',
		index: 'code',
		width: 150
	}, {
		name: 'deviceType',
		index: 'deviceType',
		width: 80,
		hidden: true
	}, {
		name: 'pid',
		index: 'pid',
		width: 80,
		hidden: true
	}],

	viewrecords: true,
	caption: "",
	hidegrid: false,

	onSelectRow: function onSelectRow(rowId, status) {
		cameraJqGridRowData = $("#table_list_camera").jqGrid("getRowData", rowId);
		//				console.log(cameraJqGridRowData);
		//      cameraJqGridRowData = cameraJqGridRowData.code
	}

});

$.jqPaginator('#pagination1', {
	totalPages: totalPage,
	visiblePages: 10,
	currentPage: 1,
	onPageChange: function onPageChange(num, type) {

		var mydata;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/camera/fetchTAllCamera",
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

				for (var i = 0; i < data.data.length; i++) {
					data.data[i].yzid = data.data[i].id + data.data[i].code;
				}
				mydata = data.data;
				totalRecords = data.elementsSum;
			}
		});

		$("#table_list_camera").jqGrid('clearGridData'); //清空表格
		$("#table_list_camera").jqGrid('setGridParam', { // 重新加载数据
			datatype: 'local',
			data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

		}).trigger("reloadGrid");
	}
});

function initGrid() {
	var jqGriddata;
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/queryAllIM",
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			jqGriddata = data;
		},
		error: function error(returndata) {
			console.log(returndata);
		}

	});

	$("#table_list_2").jqGrid({
		data: jqGriddata,
		datatype: "local",
		//autoScroll: true,
		autowidth: true,
		shrinkToFit: true,
		height: 350,
		colNames: ['id', '地址', '大图', '编码', '描述', '资源名称', '场所类别', '小图', '部门id', '部门名称', '纬度', '经度', '点位名称', '扩展属性表', '资源类型编码'],
		colModel: [{
			name: 'id',
			index: 'id',
			hidden: true
		}, {
			name: 'address',
			index: 'address',
			width: 200

		}, {
			name: 'bimage',
			index: 'bimage',
			hidden: true

		}, {
			name: 'code',
			index: 'code'

		}, {
			name: 'description',
			index: 'description',
			width: 200

		}, {
			name: 'name',
			index: 'name',
			width: 200

		}, {
			name: 'placetype',
			index: 'placetype',
			hidden: true

		}, {
			name: 'simage',
			index: 'simage',
			hidden: true

		}, {
			name: 'stationid',
			index: 'stationid',
			hidden: true

		}, {
			name: 'stationName',
			index: 'stationName',
			hidden: true

		}, {
			name: 'latitude',
			index: 'latitude',
			hidden: true

		}, {
			name: 'longitude',
			index: 'longitude',
			hidden: true

		}, {
			name: 'pointName',
			index: 'pointName',
			width: 200

		}, {
			name: 'owner',
			index: 'owner',
			hidden: true

		}, {
			name: 'resourceTypeCode',
			index: 'resourceTypeCode',
			hidden: true

		}],
		viewrecords: true,
		rowNum: 10,
		pager: "#pager_list_2",
		onSelectRow: function onSelectRow(rowId, status) {
			importantPlaceJqGridRowData = $("#table_list_2").jqGrid("getRowData", rowId);
		}
	});
}
initGrid();
// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_camera').setGridWidth(width);
});

$("#add-btn").click(function () {
	flag = "add";
	$("#commentForm").find("input").val("");
	$("#resourceTypeCode").prop("disabled", false);
	$("#maintenanceUnit").val("湖北金鹏");
	$("#maintenanceUnitTel").val("18745612347");
	$("#owner").val("T_RES_CAMERA");
	$("#stationid option").eq(0).prop("selected", true);
	$("#code option").eq(0).prop("selected", true);
	$(".chosen-select").trigger("chosen:updated");
	$(".modal-title").html("新增摄像头管理");
});

function objToform(obj) {
	for (var attr in obj) {
		if ($("#" + attr).length > 0) {
			$("#" + attr).val(obj[attr]);
		}
	}
}

$("#addDep-btn").click(function () {
	if (cameraJqGridRowData == null || cameraJqGridRowData == '') {
		layer.confirm('请指定添加关系的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#addDep-btn").attr("data-target", "");
	} else {
		$("#addDep-btn").attr("data-target", "#myModal1");
	}
});

$("#saveImportantPlace").click(function () {
	if (importantPlaceJqGridRowData == null || importantPlaceJqGridRowData == '') {
		layer.confirm('请指定添加关系的信息列！', {
			btn: ['是的'] //按钮
		});
	} else {

		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/relation/addCameraTResPlaceIMRelation/" + cameraJqGridRowData.id + "/" + importantPlaceJqGridRowData.id,

			dataType: "text",
			async: true,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				console.log(data);
				if (data == 500 || data == '500') {
					layer.msg(JSON.parse(data.responseText).errorMsg, {
						icon: 2
					});
					$('#myModal1').modal('show');
				} else {
					layer.msg('添加关系成功', {
						icon: 1
					});

					$('#myModal1').modal('hide');
					setTimeout(function () {
						location.reload();
					}, 1000);
				}
			},

			error: function error(returndata) {
				console.log(returndata);

				layer.msg(JSON.parse(returndata.responseText).errorMsg, {
					icon: 2
				});
				$('#myModal1').modal('show');
			}
		});
	}
});

$("#deleteDep-btn").click(function () {
	if (cameraJqGridRowData == null || cameraJqGridRowData == '') {
		layer.confirm('请指定删除关系的信息列！', {
			btn: ['是的'] //按钮
		});
	} else {
		layer.confirm('是否确定要删除？', {
			btn: ['是的', '取消'] //按钮
		}, function () {
			$.ajax({
				type: "delete",
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/relation/deleteTResPlaceIMRelation/" + cameraJqGridRowData.id,
				dataType: "text",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					//console.log(data);
					if (data == 500 || data == '500') {
						layer.msg(JSON.parse(data.responseText).errorMsg, {
							icon: 2
						});
					} else {
						layer.msg('删除关系成功', {
							icon: 1
						});
						setTimeout(function () {
							location.reload();
						}, 1000);
					}
				},
				error: function error(returndata) {
					console.log(returndata);
					layer.msg(JSON.parse(returndata.responseText).errorMsg, {
						icon: 2
					});
				}
			});
		});
	}
});

$("#update-btn").click(function () {
	flag = "update";
	$(".modal-title").html("修改摄像头管理");
	if (cameraJqGridRowData == null || cameraJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");

		//回显
		objToform(cameraJqGridRowData);
		$("#stationId").find("option[value='" + cameraJqGridRowData.stationId + "']").prop("selected", true);
		$("#resourceTypeCode").prop("disabled", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

//删除事件
$("#delete-btn").click(function () {
	if (cameraJqGridRowData == null || cameraJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
	} else {
		layer.confirm('是否确定要删除？', {
			btn: ['是的', '取消'] //按钮
		}, function () {
			layer.closeAll('dialog');
			console.log(cameraJqGridRowData.id);
			$.ajax({
				type: "delete",
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/camera/" + cameraJqGridRowData.id,

				dataType: "text",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {

					//console.log(data);
					if (data == 500 || data == '500') {
						layer.msg(JSON.parse(data.responseText).errorMsg, {
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
					console.log(returndata);
					layer.msg(JSON.parse(returndata.responseText).errorMsg, {
						icon: 2
					});
				}

			});
		});
	}
});

//模板下载
$("#download-modalExcel").click(function () {
	var excelModalDownloadUrl = YZ.ajaxURLms + 'api/jp-BIRM-Resource-ms/camera/upExcel/template';
	$(location).attr('href', excelModalDownloadUrl);
});

//导入
function doUploadExcel() {
	var formData = new FormData($("#uploadExcel")[0]);

	$.ajax({
		url: YZ.ajaxURLms + 'api/jp-BIRM-Resource-ms/camera/upExcel',
		type: 'POST',
		data: formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		success: function success(data) {
			//					console.log(data);
			if (data == 500 || data == '500') {
				layer.msg(JSON.parse(data.responseText).errorMsg, {
					icon: 2
				});
			} else {
				layer.msg('导入成功', {
					icon: 1
				});
				setTimeout(function () {
					location.reload();
				}, 1000);
			}
		},
		error: function error(returndata) {
			console.log(returndata);
			layer.msg(JSON.parse(returndata.responseText).errorMsg, {
				icon: 2
			});
		}
	});
	$('#myModal2').modal('hide');
}

$("#uploadExcelBtn").click(function () {
	doUploadExcel();
});
//搜索按钮点击事件
$("#plsCarTpSch").click(function () {
	if ($("#namename").val().trim() === "" && $("#codecode").val().trim() === "" && $("#stationidstationid").val().trim() === "" && $("#numnum").val().trim() === "") {
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/camera/fetchTAllCamera",
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
				$("#table_list_camera").jqGrid('clearGridData'); //清空表格
				$("#table_list_camera").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	} else {
		var array = ["name", "code", "num", "stationid"];
		var yzurl = likeQuery(YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/camera/fetchTAllCamera?", array);
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
				$("#table_list_camera").jqGrid('clearGridData'); //清空表格
				$("#table_list_camera").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	}
});

//表单提交

function cameraAction() {

	if (flag == "add") {

		var commentForm = $('#commentForm').serializeJSON();
		commentForm.installTime = commentForm.installTime + "T00:00:00.0000000+08:00";
		//		console.log(JSON.stringify(commentForm));
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/camera/addCameraInfo",
			data: JSON.stringify(commentForm),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				//								console.log(JSON.stringify($('#commentForm').serializeJSON()));
				if (data == 500 || data == '500') {
					layer.msg('新增失败', {
						icon: 2
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
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	} else if (flag == "update") {
		var commentForm = $('#commentForm').serializeJSON();
		commentForm.installTime = commentForm.installTime + "T00:00:00.0000000+08:00";
		commentForm.id = cameraJqGridRowData.id;

		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/camera/updateCameraInfo/",
			data: JSON.stringify(commentForm),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				console.log(data);
				if (data == 500 || data == '500') {
					layer.msg('修改失败', {
						icon: 2
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
				//				console.log(returndata)
				layer.msg('修改失败', {

					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	}
}