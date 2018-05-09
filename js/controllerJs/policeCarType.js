//var jurisdictionJqGridRowData;
$(document).ready(function () {

	var selectRowplcCartp;
	$.jgrid.defaults.styleUI = 'Bootstrap';
	var jurisdictiondata;
	var updtoradd;
	//查询所有警车类型
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/",
		async: false,
		dataType: 'json',
		success: function success(result) {
			jurisdictiondata = result;
		},
		error: function error() {
			layer.confirm('请求超时', {
				btn: ['确定！']
			});
		}
	});

	$("#table_list_jclx").jqGrid({
		data: jurisdictiondata,
		datatype: "local",
		width: $('.jqGrid_wrapper').width(),
		height: $(window).height() - 190,
		shrinkToFit: true,
		autoScroll: false,
		rowNum: 14,
		rowList: [10, 20, 30],
		colNames: ['序号', '警车类型名称'],
		colModel: [{
			name: 'id',
			index: 'id',
			width: 50,
			sorttype: "int",
			hidden: true
		}, {
			name: 'type',
			index: 'type',
			width: 120
		}],
		pager: "#pager_list_jclx",
		viewrecords: true,
		caption: "",
		hidegrid: false,
		rownumbers: true,
		onSelectRow: function onSelectRow(rowId, status) {
			//			选中行后回显结果
			selectRowplcCartp = $("#table_list_jclx").jqGrid("getRowData", rowId);
			objToform(selectRowplcCartp);
			//			$("#type").val(selectRowplcCartp.type);
		}
	});

	$(window).on('resize', function () {
		$('#table_list_jclx').setGridWidth($('.jqGrid_wrapper').width());
		$('#table_list_jclx').setGridHeight($(window).height() - 190);
	});

	//搜索按钮点击事件
	$("#plsCarTpSch").click(function () {});

	//新增按钮点击事件
	$("#add-btn").click(function () {
		$("#plsCarTpSave").removeAttr("disabled");
		$("#cancel").removeAttr("disabled");
		$("#type").removeAttr("readonly");
		$("#type").val("");
		updtoradd = true;
	});

	//编辑按钮点击事件
	$("#update-btn").click(function () {
		if (selectRowplcCartp == null) {
			layer.confirm('请选择需要编辑的列！', {
				btn: ['是的']
			});
		} else {
			$("#type").val(selectRowplcCartp.type);
			$("#plsCarTpSave").removeAttr("disabled");
			$("#cancel").removeAttr("disabled");
			$("#type").removeAttr("readonly");
			updtoradd = false;
		}
	});

	//删除按钮点击事件
	$("#delete-btn").click(function () {
		if (selectRowplcCartp != null) {
			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				$.ajax({
					type: "delete",
					url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/" + selectRowplcCartp.id,
					async: false,
					dataType: 'text',
					//					data: JSON.stringify($('#commentForm').serializeJSON()),
					ContentType: "application/json;charset=UTF-8",
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(result) {
						layer.msg('删除成功!', {
							icon: 1
						});
						$.ajax({
							type: "get",
							url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/",
							async: false,
							dataType: 'json',
							success: function success(result) {
								jurisdictiondata = result;
							},
							error: function error() {
								layer.confirm('请求超时!', {
									btn: ['确定！']
								});
							}
						});
						$("#table_list_jclx").jqGrid('clearGridData');
						$("#table_list_jclx").jqGrid('setGridParam', {
							data: jurisdictiondata
						}).trigger("reloadGrid");
						$("#cancel").click();
						selectRowplcCartp = null;
						$("#type").val("");
					},
					error: function error() {
						layer.confirm('删除失败！', {
							btn: ['确定']
						});
						$("#cancel").click();
					}
				});
			});
		} else {
			layer.confirm('请选择要删除的列', {
				btn: ['是的'] //按钮
			});
		}
	});

	//保存按钮点击事件
	$("#plsCarTpSave").click(function () {
		//add
		//update
		if (updtoradd == true) {
			if ($("#type").val() != null && "" != $("#type").val().trim()) {
				$.ajax({
					type: "post",
					url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/",
					async: false,
					dataType: 'json',
					data: JSON.stringify($('#commentForm').serializeJSON()),
					ContentType: "application/json;charset=UTF-8",

					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(result) {
						layer.msg('添加成功', {
							icon: 1
						});
						$.ajax({
							type: "get",
							url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/",
							async: false,
							dataType: 'json',
							success: function success(result) {
								jurisdictiondata = result;
							},
							error: function error() {
								layer.confirm('请求超时!', {
									btn: ['确定！']
								});
							}
						});
						$("#table_list_jclx").jqGrid('clearGridData');
						$("#table_list_jclx").jqGrid('setGridParam', {
							data: jurisdictiondata
						}).trigger("reloadGrid");
						$("#cancel").click();
					},
					error: function error() {
						layer.confirm('添加失败！', {
							btn: ['确定']
						});
						$("#cancel").click();
					}
				});
			} else {
				layer.confirm('请输入信息！', {
					btn: ['确定']
				});
			}
		} else {
			if ($("#type").val() != null && "" != $("#type").val().trim()) {
				//				console.log(selectRowplcCartp.id);
				$.ajax({
					type: "put",
					url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/" + selectRowplcCartp.id,
					async: false,
					dataType: 'json',
					data: JSON.stringify($('#commentForm').serializeJSON()),
					ContentType: "application/json;charset=UTF-8",

					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(result) {
						layer.msg('更新成功！', {
							icon: 1
						});
						$.ajax({
							type: "get",
							url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/",
							async: false,
							dataType: 'json',
							success: function success(result) {
								jurisdictiondata = result;
							},
							error: function error() {
								layer.confirm('请求超时!', {
									btn: ['确定！']
								});
							}
						});
						$("#table_list_jclx").jqGrid('clearGridData');
						$("#table_list_jclx").jqGrid('setGridParam', {
							data: jurisdictiondata
						}).trigger("reloadGrid");
						selectRowplcCartp = null;
						$("#type").val("");
						$("#cancel").click();
					},
					error: function error() {
						layer.confirm('更新失败！', {
							btn: ['确定']
						});
						$("#cancel").click();
					}
				});
			} else {
				layer.confirm('请输入信息！', {
					btn: ['确定']
				});
			}
		}
	});

	//取消按钮点击事件
	$("#cancel").click(function () {
		if (selectRowplcCartp != null) {
			$("#type").val(selectRowplcCartp.type);
		} else {
			$("#type").val("");
		}
		$("#plsCarTpSave").attr("disabled", "disabled");
		$("#cancel").attr("disabled", "disabled");
		$("#type").attr("readonly", "readonly");
	});
});