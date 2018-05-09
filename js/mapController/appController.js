var flag; //add与update标识
var appJqGridRowData; //点击行数据
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

function initGrid() {
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BSAPP-TASK-ms/VersionInfo/",
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			//console.log(data);
			mydata = data;
		}
	});

	//表格初始化

	$("#table_list_1").jqGrid({
		data: mydata,
		datatype: "local",

		autowidth: true,
		shrinkToFit: true,
		height: 530,
		colNames: ['id', '版本号', '版本名称', '更新说明', '更新时间', '下载url'],
		colModel: [{
			name: 'id',
			index: 'id',
			hidden: true
		}, {
			name: 'versionCode',
			index: 'versionCode'

		}, {
			name: 'versionName',
			index: 'versionName'

		}, {
			name: 'updateDescribe',
			index: 'updateDescribe'

		}, {
			name: 'updateTime',
			index: 'updateTime',
			formatter: "date",
			formatoptions: {
				srcformat: 'Y-m-d H:i:s',
				newformat: 'Y-m-d H:i:s'
			}

		}, {
			name: 'downloadFileId',
			index: 'downloadFileId',
			hidden: true

		}],
		viewrecords: true,
		rowNum: 10,
		pager: "#pager_list_1",
		onSelectRow: function onSelectRow(rowId, status) {
			appJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		}
	});
}

initGrid();
// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_1').setGridWidth(width);
});

$("#add-btn").click(function () {
	flag = "add";
	$("#versionCode").val('');
	$("#versionName").val('');
	$("#downloadFileId").val('');
	$("#updateDescribe").val('');

	$(".modal-title").html("新增版本信息");
});

$("#update-btn").click(function () {
	flag = "update";
	$(".modal-title").html("修改版本信息");
	if (appJqGridRowData == null || appJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");

		//回显
		$("#versionCode").val(appJqGridRowData.versionCode);
		$("#versionName").val(appJqGridRowData.versionName);
		$("#downloadFileId").val(appJqGridRowData.downloadFileId);
		$("#updateDescribe").val(appJqGridRowData.updateDescribe);
	}
});

$("#delete-btn").click(function () {
	if (appJqGridRowData == null || appJqGridRowData == '') {
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
				url: YZ.ajaxURLms + "api/jp-BSAPP-TASK-ms/VersionInfo/" + appJqGridRowData.id,

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
					//console.log(returndata);
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

	if (serachText == null || serachText == '') {
		initGrid();
		$("#table_list_1").jqGrid('clearGridData'); //清空表格
		$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
			datatype: 'local',
			data: mydata, //  newdata 是符合格式要求的需要重新加载的数据 
			page: 1
		}).trigger("reloadGrid");
	} else {
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BSAPP-TASK-ms/VersionInfo/fetchVersionInfoLike",
			data: {
				versionCode: serachText
			},
			dataType: "json",
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {

				$("#table_list_1").jqGrid('clearGridData'); //清空表格
				$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: data, //  newdata 是符合格式要求的需要重新加载的数据 
					page: 1
				}).trigger("reloadGrid");
			}
		});
	}
});

function doUpload() {
	var formData = new FormData($("#uploadForm")[0]);
	$.ajax({
		url: YZ.ajaxURLms + "zuul/api/jp-TIFS-FileCenter-ms/file",
		type: 'POST',
		data: formData,

		async: false,
		cache: false,
		contentType: false,
		processData: false,
		success: function success(data) {
			var purl = data.fileID;
			$("#downloadFileId").val(purl);
			layer.msg('上传成功', {
				icon: 1
			});
		},
		error: function error(returndata) {
			layer.msg('上传失败', {
				icon: 1
			});
		}
	});
}

$("#uploadBtn").click(function () {
	doUpload();
});

$("#upload-btn").click(function () {
	if (appJqGridRowData == null || appJqGridRowData == '') {
		layer.confirm('请指定的下载版本！', {
			btn: ['是的'] //按钮
		});
	} else {
		var downloadUrl = YZ.ajaxURLms + "api/jp-TIFS-FileCenter-ms/file?businessId=" + appJqGridRowData.downloadFileId;
		$("#upload-btn").attr("href", downloadUrl);
	}
});

//表单提交

function appAction() {

	if (flag == "add") {
		//console.log(JSON.stringify($('#commentForm').serializeJSON()));
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BSAPP-TASK-ms/VersionInfo/addVersionInfo",
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

		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BSAPP-TASK-ms/VersionInfo/addVersionInfo" + appJqGridRowData.id,
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

				layer.msg('修改失败', {
					icon: 1
				});
				$('#myModal').modal('show');
			}
		});
	}
}