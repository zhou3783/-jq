var flag; //add与update标识
var wifiJqGridRowData; //点击行数据   
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
		//			console.log(data);
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
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiCRUD/",
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
//表格初始	
$("#table_list_wifi").jqGrid({
	data: mydata,
	datatype: "local",
	height: 530,
	autoScroll: true,
	autowidth: true,
	shrinkToFit: false,
	rowNum: 10,
	colNames: ['账号', '地址', '大图', '安装时间', 'IP地址', '维护单位', '维护单位电话', '名称', '设备号', '杆号', '备注', '小图', '所属部门id', '所属部门', '纬度', '经度', '点位名称', '扩展属性表', '资源类型编码'],
	colModel: [{
		name: 'id',
		index: 'id',
		sorttype: "int",
		hidden: true
	}, {
		name: 'address',
		index: 'address',
		width: 220
	}, {
		name: 'bimage',
		index: 'bimage',
		width: 80
	}, {
		name: 'installTime',
		index: 'installTime',
		width: 100
	}, {
		name: 'ipAddress',
		index: 'ipAddress',
		width: 120

	}, {
		name: 'maintenanceUnit',
		index: 'maintenanceUnit',
		width: 100
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
		width: 180
	}, {
		name: 'poleNum',
		index: 'poleNum',
		width: 80
	}, {
		name: 'remark',
		index: 'remark',
		width: 200
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
		width: 140

	}, {
		name: 'latitude',
		index: 'latitude',
		width: 100
	}, {
		name: 'longitude',
		index: 'longitude',
		width: 100
	}, {
		name: 'pointName',
		index: 'pointName',
		width: 240
	}, {
		name: 'owner',
		index: 'owner',
		width: 120
	}, {
		name: 'resourceTypeCode',
		index: 'resourceTypeCode',
		width: 100
	}],

	viewrecords: true,
	caption: "",
	hidegrid: false,
	onSelectRow: function onSelectRow(rowId, status) {
		wifiJqGridRowData = $("#table_list_wifi").jqGrid("getRowData", rowId);
		//		console.log(wifiJqGridRowData);
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
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiCRUD/",
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
				//				mydata = data.data;
				totalRecords = data.elementsSum;
				//				console.log(data);
				mydata = data.data;
				var length = mydata.length;
				var listArray = [];
				for (var i = 0; i < length; i++) {
					listArray.push(mydata[i]['stationid']);
				}
				//				console.log("listArray" + JSON.stringify(listArray));
				$.ajax({
					type: "post",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/byIdList",
					dataType: "json",
					data: JSON.stringify(listArray),
					async: false,
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {
						//						console.log(data);
						var lengthOne = data.length;
						for (var j = 0; j < lengthOne; j++) {
							mydata[j]['stationName'] = data[j]['stationName'];
						}
						//console.log("data"+JSON.stringify(data));
						//						console.log("mydata" + JSON.stringify(mydata));
					},
					error: function error(returndata) {
						console.log(returndata);
					}
				});
			}
		});

		$("#table_list_wifi").jqGrid('clearGridData'); //清空表格
		$("#table_list_wifi").jqGrid('setGridParam', { // 重新加载数据
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
	$('#table_list_wifi').setGridWidth(width);
});

$("#add-btn").click(function () {
	flag = "add";
	$("#commentForm").find("input").val("");
	$("#resourceTypeCode").prop("disabled", false);
	$("#owner").val("T_RES_WIFI");
	$("#stationid option").eq(0).prop("selected", true);
	$(".chosen-select").trigger("chosen:updated");
	$(".modal-title").html("新增wifi信息");
});

$("#addDep-btn").click(function () {
	if (wifiJqGridRowData == null || wifiJqGridRowData == '') {
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
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiIMRelation/addTResWifiIMRelation/" + wifiJqGridRowData.id + "/" + importantPlaceJqGridRowData.id,

			dataType: "text",
			async: true,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				if (data == 500 || data == '500') {
					layer.msg(JSON.parse(returndata.responseText).errorMsg, {
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
	if (wifiJqGridRowData == null || wifiJqGridRowData == '') {
		layer.confirm('请指定删除关系的信息列！', {
			btn: ['是的'] //按钮
		});
	} else {
		layer.confirm('是否确定要删除？', {
			btn: ['是的', '取消'] //按钮
		}, function () {
			$.ajax({
				type: "delete",
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiIMRelation/deleteTResWifiIMRelation/" + wifiJqGridRowData.id,
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

function objToform(obj) {
	for (var attr in obj) {
		if ($("#" + attr).length > 0) {
			$("#" + attr).val(obj[attr]);
		}
	}
}

$("#update-btn").click(function () {
	flag = "update";
	$(".modal-title").html("修改wifi信息");
	if (wifiJqGridRowData == null || wifiJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");

		//回显
		objToform(wifiJqGridRowData);
		$("#stationId").find("option[value='" + wifiJqGridRowData.stationId + "']").prop("selected", true);
		$("#resourceTypeCode").prop("disabled", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

$("#delete-btn").click(function () {
	if (wifiJqGridRowData == null || wifiJqGridRowData == '') {
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
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiCRUD/deleteWifi/" + wifiJqGridRowData.id,
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
					//console.log(returndata);
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
	var excelModalDownloadUrl = YZ.ajaxURLms + 'api/jp-BIRM-Resource-ms/resource/wifiCRUD/upExcel/template';
	$(location).attr('href', excelModalDownloadUrl);
});

//导入
function doUploadExcel() {
	var formData = new FormData($("#uploadExcel")[0]);
	$.ajax({
		url: YZ.ajaxURLms + 'api/jp-BIRM-Resource-ms/resource/wifiCRUD/upExcel',
		type: 'POST',
		data: formData,
		async: true,
		cache: false,
		contentType: false,
		processData: false,
		success: function success(data) {
			//			console.log(data)
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
	if ($("#namename").val().trim() === "" && $("#numnum").val().trim() === "" && $("#stationidstationid").val().trim() === "" && $("#codecode").val().trim() === "") {
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiCRUD/",
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
						var length = mydata.length;
						var listArray = [];
						for (var i = 0; i < length; i++) {
							listArray.push(mydata[i]['stationid']);
						}
						//				console.log("listArray" + JSON.stringify(listArray));
						$.ajax({
							type: "post",
							url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/byIdList",
							dataType: "json",
							data: JSON.stringify(listArray),
							async: false,
							headers: {
								"Content-Type": "application/json;charset=UTF-8"
							},
							success: function success(data) {
								//						console.log(data);
								var lengthOne = data.length;
								for (var j = 0; j < lengthOne; j++) {
									mydata[j]['stationName'] = data[j]['stationName'];
								}
								//console.log("data"+JSON.stringify(data));
								//						console.log("mydata" + JSON.stringify(mydata));
							},
							error: function error(returndata) {
								console.log(returndata);
							}
						});
					}
				});
				$("#stationidstationid option").eq(0).prop("selected", true);
				$("#stationidstationid").trigger("chosen:updated");
				$("#table_list_wifi").jqGrid('clearGridData'); //清空表格
				$("#table_list_wifi").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	} else {
		var array = ["name", "code", "num", "stationid"];
		var yzurl = likeQuery(YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiCRUD/?", array);
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
						var length = mydata.length;
						var listArray = [];
						for (var i = 0; i < length; i++) {
							listArray.push(mydata[i]['stationid']);
						}
						//				console.log("listArray" + JSON.stringify(listArray));
						$.ajax({
							type: "post",
							url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/byIdList",
							dataType: "json",
							data: JSON.stringify(listArray),
							async: false,
							headers: {
								"Content-Type": "application/json;charset=UTF-8"
							},
							success: function success(data) {
								//						console.log(data);
								var lengthOne = data.length;
								for (var j = 0; j < lengthOne; j++) {
									mydata[j]['stationName'] = data[j]['stationName'];
								}
								//console.log("data"+JSON.stringify(data));
								//						console.log("mydata" + JSON.stringify(mydata));
							},
							error: function error(returndata) {
								console.log(returndata);
							}
						});
					}
				});
				$("#stationidstationid option").eq(0).prop("selected", true);
				$("#stationidstationid").trigger("chosen:updated");
				$("#table_list_wifi").jqGrid('clearGridData'); //清空表格
				$("#table_list_wifi").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	}
});

//表单提交

function wifiAction() {

	if (flag == "add") {
		//				debugger;
		var commentForm = $('#commentForm').serializeJSON();
		commentForm.installTime = commentForm.installTime + "T00:00:00.0000000+08:00";
		//		console.log(JSON.stringify(commentForm))
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiCRUD/addWifi",
			data: JSON.stringify(commentForm),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				//				console.log(JSON.stringify(commentForm));
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
		commentForm.id = wifiJqGridRowData.id;
		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/wifiCRUD/updateWifi/" + wifiJqGridRowData.id,
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
				layer.msg('修改失败', {
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	}
}