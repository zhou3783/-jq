var flag; //add与update标识
var lxglJqGridRowData; //点击行数据                                             
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
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag",
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

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag?pageSize=2000",
	dataType: "json",
	async: false,
	success: function success(result) {
		//			console.log(result);
		for (var i = 0; i < result["data"].length; i++) {
			var o = new Option(result["data"][i].code, result["data"][i].id);
			$("#pid").append(o);
		}
	},
	error: function error(textStatus) {
		layer.msg('加载超时', {
			icon: 3
		});
	}
});

//表格初始化
$("#table_list_1").jqGrid({
	data: mydata,
	datatype: "local",
	height: 530,
	autowidth: true,
	shrinkToFit: true,
	rowNum: 10,
	//	rownumbers: true,

	colNames: ['id', '资源类型编码', '资源类型', '父类型ID'],
	colModel: [{
		name: 'id',
		index: 'id',
		hidden: true
	}, {
		name: 'code',
		index: 'code',
		width: 80

	}, {
		name: 'deviceType',
		index: 'deviceType',
		width: 80

	}, {
		name: 'pid',
		index: 'pid',
		hidden: true,
		width: 60
	}],

	viewrecords: true,
	caption: "",
	hidegrid: false,

	onSelectRow: function onSelectRow(rowId, status) {
		lxglJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		//console.log(lxglJqGridRowData);
	}

});

// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_1').setGridWidth(width);
});

$.jqPaginator('#pagination1', {
	totalPages: totalPage,
	visiblePages: 10,
	currentPage: 1,
	onPageChange: function onPageChange(num, type) {

		var mydata;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag",
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
	$("#code").val("");
	$("#deviceType").val("");
	$("#pid").val("");
	$(".modal-title").html("新增类型管理");
});

$("#update-btn").click(function () {
	flag = "update";
	$(".modal-title").html("修改类型管理");
	if (lxglJqGridRowData == null || lxglJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");

		$("#code").val(lxglJqGridRowData.code);
		$("#deviceType").val(lxglJqGridRowData.deviceType);
		$("#pid").val(lxglJqGridRowData.pid);
		if (lxglJqGridRowData.isDelete == 1 || lxglJqGridRowData.isDelete == '1') {
			$("#isDelete0").attr("checked", "checked");
		} else {
			$("#isDelete1").attr("checked", "checked");
		}
		$("#pid").find("option[value='" + lxglJqGridRowData.pid + "']").prop("selected", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

$("#delete-btn").click(function () {
	if (lxglJqGridRowData == null || lxglJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
	} else {
		layer.confirm('是否确定要删除？', {
			btn: ['是的', '取消'] //按钮
		}, function () {
			layer.closeAll('dialog');
			//			console.log(lxglJqGridRowData.id);
			$.ajax({
				type: "delete",
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/deleteTResTag/" + lxglJqGridRowData.id,

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
					console.log(returndata);
					layer.msg('删除失败', {
						icon: 2
					});
				}

			});
		});
	}
});
//模板下载
$("#download-modalExcel").click(function () {
	var excelModalDownloadUrl = YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/upExcel/template";
	$(location).attr('href', excelModalDownloadUrl);
});

//导入
function doUploadExcel() {
	var formData = new FormData($("#uploadExcel")[0]);
	$.ajax({
		url: YZ.ajaxURLms + 'api/jp-BIRM-Resource-ms/resource/tResTag/upExcel',
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
//搜索按钮
$("#plsCarTpSch").click(function () {
	if ($("#searchText").val().trim() === "" && $("#searchText1").val().trim() === "") {
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag",
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
		if ($("#searchText1").val().trim() === "") {
			$.jqPaginator('#pagination1', {
				totalPages: totalPage,
				visiblePages: 10,
				currentPage: 1,
				onPageChange: function onPageChange(num, type) {

					var mydata;
					$.ajax({
						type: "get",
						url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag?code=" + $("#searchText").val(),
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
		} else if ($("#searchText").val().trim() === "") {
			$.jqPaginator('#pagination1', {
				totalPages: totalPage,
				visiblePages: 10,
				currentPage: 1,
				onPageChange: function onPageChange(num, type) {

					var mydata;
					$.ajax({
						type: "get",
						url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag?deviceType=" + $("#searchText1").val(),
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
			$.jqPaginator('#pagination1', {
				totalPages: totalPage,
				visiblePages: 10,
				currentPage: 1,
				onPageChange: function onPageChange(num, type) {

					var mydata;
					$.ajax({
						type: "get",
						url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/fetchTResTag?deviceType=" + $("#searchText1").val() + "&code=" + $("#searchText").val(),
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
		}
	}
});
//表单提交

function lxglAction() {

	if (flag == "add") {

		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/addTResTag",
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

				layer.msg('新增失败', {
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	} else if (flag == "update") {
		var obj = $('#commentForm').serializeJSON();
		obj.id = lxglJqGridRowData.id;
		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/tResTag/updateTResTag",
			data: JSON.stringify(obj),
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