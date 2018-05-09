var flag; //add与update标识
var wrjJqGridRowData; //点击行数据
//chosen-select 插件初始化
$(".chosen-select").chosen();
$.jgrid.defaults.styleUI = 'Bootstrap';
//表格初始化
var mydata;
var totalRecords;
//var serachText; // 模糊查询
var mydataSerach;
var totalRecordsSerach;
var flagSerach;
var totalPage;

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/findByNum",
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

//console.log(totalRecords);

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

$("#table_list_1").jqGrid({
	data: mydata,
	datatype: "local",
	height: 530,
	autowidth: true,
	shrinkToFit: true,
	rowNum: 10,

	rowList: [10, 20, 30],
	colNames: ['id', '编号', '部门编号', '所属部门', '备注'],
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
		width: 100,
		hidden: true
	}, {
		name: 'stationName',
		index: 'stationName',
		width: 100
	}, {
		name: 'remark',
		index: 'remark',
		width: 80

	}],
	//pager: "#pager_list_1",
	viewrecords: true,
	caption: "",
	//hidegrid: false,


	onSelectRow: function onSelectRow(rowId, status) {
		wrjJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		//console.log(userJqGridRowData);
	}
});

// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_1').setGridWidth(width);
});

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
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/findByNum",
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
	$(".modal-title").html("新增无人机信息");
	$("#num").val("");
	$("#remark").val("");
});

$("#update-btn").click(function () {

	flag = "update";
	$(".modal-title").html("修改无人机信息");
	if (wrjJqGridRowData == null || wrjJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");
		$("#num").val(wrjJqGridRowData.num);
		$("#remark").val(wrjJqGridRowData.remark);
		$("#stationId").find("option[value='" + wrjJqGridRowData.stationId + "']").prop("selected", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

$("#delete-btn").click(function () {
	if (wrjJqGridRowData == null || wrjJqGridRowData == '') {
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
				url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/" + wrjJqGridRowData.id,

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

$("#serachBtn").click(function () {
	var serachText = $("#serachText").val();
	//console.log(serachText);

	if (serachText == null || serachText == '') {

		$('#pagination1').jqPaginator('destroy');
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/findByNum",
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
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/findByNum",
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
							url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/findByNum",
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

function wrjAction() {

	if (flag == "add") {

		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/",
			data: JSON.stringify($('#commentForm').serializeJSON()),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
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

				layer.msg(JSON.parse(returndata.responseText).errorMsg, {
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	} else if (flag == "update") {

		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/uav/" + wrjJqGridRowData.id,
			data: JSON.stringify($('#commentForm').serializeJSON()),
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

				layer.msg(JSON.parse(returndata.responseText).errorMsg, {
					icon: 1
				});
				$('#myModal').modal('show');
			}
		});
	}
}