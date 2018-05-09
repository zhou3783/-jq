var _$$jqGrid;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var flag; //add与update标识
var jwtJqGridRowData; //点击行数据
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

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/jwt/findByNum",
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
		//console.log(data);
		mydata = data.data;
		totalRecords = data.elementsSum;
		totalPage = countTotalPage(totalRecords);
	}
});

//表格初始化


$("#table_list_1").jqGrid((_$$jqGrid = {
	data: mydata,
	datatype: "local",
	styleUI: 'Bootstrap',
	autowidth: true,
	shrinkToFit: true,
	height: 530,
	colNames: ['id', '设备编号(电话)', '部门编号', '所属部门', '在线状态(1在线，2离线)', '工作状态(1正常，2损坏)'],
	colModel: [{
		name: 'id',
		index: 'id',
		hidden: true
	}, {
		name: 'num',
		index: 'num',
		width: 90

	}, {
		name: 'stationId',
		index: 'stationId',
		width: 90,
		hidden: true

	}, {
		name: 'stationName',
		index: 'stationName',
		width: 90

	}, {
		name: 'status',
		index: 'status',
		width: 80

	}, {
		name: 'isWork',
		index: 'isWork',
		width: 90

	}],
	viewrecords: true,
	caption: ""
}, _defineProperty(_$$jqGrid, "autowidth", true), _defineProperty(_$$jqGrid, "rowNum", 10), _defineProperty(_$$jqGrid, "onSelectRow", function onSelectRow(rowId, status) {
	jwtJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
	//console.log(userJqGridRowData);
}), _$$jqGrid));

// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_1').setGridWidth(width);
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

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/getOrgaInfo",
	//data: null,
	dataType: "json",
	async: false,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		//console.log(data);

		for (var i = 0; i < data.length; i++) {
			var ele = new Option(data[i].name, data[i].id);
			$("#stationId").append(ele);
		}
		$(".chosen-select").trigger("chosen:updated");
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
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/jwt/findByNum",
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

		$("#table_list_1").jqGrid('clearGridData'); //清空表格
		$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
			datatype: 'local',
			data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

		}).trigger("reloadGrid");
	}
});

$("#add-btn").click(function () {
	flag = "add";
	$("#num").val("");

	$(".modal-title").html("新增警务通信息");
});

$("#update-btn").click(function () {
	flag = "update";
	$(".modal-title").html("修改警务通信息");
	if (jwtJqGridRowData == null || jwtJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");
		$("#num").val(jwtJqGridRowData.num);

		$("#status").find("option[value='" + jwtJqGridRowData.status + "']").prop("selected", true);
		$("#isWork").find("option[value='" + jwtJqGridRowData.isWork + "']").prop("selected", true);

		$("#stationId").find("option[value='" + jwtJqGridRowData.stationId + "']").prop("selected", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

$("#delete-btn").click(function () {
	if (jwtJqGridRowData == null || jwtJqGridRowData == '') {
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
				url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/jwt/" + jwtJqGridRowData.id,

				dataType: "text",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					//console.log(data);
					if (data == 500 || data == '500') {
						layer.msg('删除失败', {
							icon: 1
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
					layer.msg('删除失败', {
						icon: 1
					});
				}

			});
		});
	}
});

//模板下载
$("#download-modalExcel").click(function () {
	var excelModalDownloadUrl = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/BSBatch/getTemplate/jwt";
	$(location).attr('href', excelModalDownloadUrl);
});

//导入
function doUploadExcel() {
	var formData = new FormData($("#uploadExcel")[0]);

	$.ajax({
		url: YZ.ajaxURLms + 'api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/BSBatch/jwt',
		type: 'POST',
		data: formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		success: function success(data) {
			console.log(data);
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

$("#serachBtn").click(function () {
	var serachText = $("#serachText").val();

	if (serachText == null || serachText == '') {

		$('#pagination1').jqPaginator('destroy');
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/jwt/findByNum",
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

				$("#table_list_1").jqGrid('clearGridData'); //清空表格
				$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	} else {
		var mydata;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/jwt/findByNum",
			data: {
				"pageIndex": 0,
				"pageSize": 10,
				"num": serachText
			},
			dataType: "json",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				//	console.log(data);
				mydataSerach = data.data;
				totalRecordsSerach = data.elementsSum;
				totalPageSerach = countTotalPage(totalRecordsSerach);

				$('#pagination1').jqPaginator('destroy');
				$.jqPaginator('#pagination1', {
					totalPages: totalPageSerach,
					visiblePages: 10,
					currentPage: 1,
					onPageChange: function onPageChange(num, type) {
						var mydata;
						$.ajax({
							type: "get",
							url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/jwt/findByNum",
							data: {
								"pageIndex": num - 1,
								"pageSize": 10,
								"num": serachText
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

						$("#table_list_1").jqGrid('clearGridData'); //清空表格
						$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
							datatype: 'local',
							data: mydataSerach //  newdata 是符合格式要求的需要重新加载的数据 

						}).trigger("reloadGrid");
					}
				});
			}
		});
	}
});

//表单提交

function jwtAction() {

	if (flag == "add") {
		//		console.log(JSON.stringify($('#commentForm').serializeJSON()));
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/jwt/",
			data: JSON.stringify($('#commentForm').serializeJSON()),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				console.log(data);
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
				//              console.log(returndata)
				layer.msg(JSON.parse(returndata.responseText).errorMsg, {
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	} else if (flag == "update") {

		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms//api/birm/policefacility/jwt/" + jwtJqGridRowData.id,
			data: JSON.stringify($('#commentForm').serializeJSON()),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
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

				layer.msg(JSON.parse(returndata.responseText).errorMsg, {
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	}
}