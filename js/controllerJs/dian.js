var flag; //add与update标识
var dianJqGridRowData; //点击行数据   
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
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/",
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
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/",
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
$("#table_list_1").jqGrid({
	data: mydata,
	datatype: "local",
	height: 530,
	autoScroll: true,
	autowidth: true,
	shrinkToFit: false,
	rowNum: 10,
	colNames: ['序号', '地址', 'id', '纬度', '经度', '名称', '扩展属性表', '点位名称', '点对象编码', '备注', '资源类型编码', '部门id', '所属部门'],
	colModel: [{
		name: 'yzid',
		index: 'yzid',
		hidden: true,
		key: true
	}, {
		name: 'address',
		index: 'address',
		width: 200

	}, {
		name: 'id',
		index: 'id',
		hidden: true
	}, {
		name: 'latitude',
		index: 'latitude',
		width: 120
	}, {
		name: 'longitude',
		index: 'longitude',
		width: 120
	}, {
		name: 'name',
		index: 'name',
		width: 200

	}, {
		name: 'owner',
		index: 'owner',
		width: 140
	}, {
		name: 'pointName',
		index: 'pointName',
		width: 200

	}, {
		name: 'pointcode',
		index: 'pointcode',
		width: 200

	}, {
		name: 'remark',
		index: 'remark',
		width: 100

	}, {
		name: 'resourceTypeCode',
		index: 'resourceTypeCode',
		width: 140
	}, {
		name: 'stationid',
		index: 'stationid',
		hidden: true

	}, {
		name: 'stationName',
		index: 'stationName',
		width: 140
	}],

	viewrecords: true,
	caption: "",
	hidegrid: false,
	onSelectRow: function onSelectRow(rowId, status) {
		dianJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		//				console.log(placeJqGridRowData);
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
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/",
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
				console.log(data);
				//				mydata = data.data;
				totalRecords = data.elementsSum;
				console.log(data);
				mydata = data.data;
				var length = mydata.length;
				var listArray = [];
				for (var i = 0; i < length; i++) {
					listArray.push(mydata[i]['stationid']);
				}
				console.log("listArray" + JSON.stringify(listArray));
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
							if (mydata[j] !== null && data[j] !== null) {
								mydata[j]['stationName'] = data[j]['stationName'];
							}
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

		$("#table_list_1").jqGrid('clearGridData'); //清空表格
		$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
			datatype: 'local',
			data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

		}).trigger("reloadGrid");
	}
});
// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_1').setGridWidth(width);
});

$("#add-btn").click(function () {
	flag = "add";
	$("#commentForm").find("input").val("");
	$("#resourceTypeCode").val('应急围堵点');
	$("#owner").val("T_RES_GENERIC_POINT");
	$("#stationid option").eq(0).prop("selected", true);
	$(".chosen-select").trigger("chosen:updated");
	$(".modal-title").html("新增点资源信息");
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
	$(".modal-title").html("修改点资源信息");
	if (dianJqGridRowData == null || dianJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");

		//回显
		objToform(dianJqGridRowData);
		$("#stationId").find("option[value='" + dianJqGridRowData.stationId + "']").prop("selected", true);
		$("#resourceTypeCode").prop("disabled", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

$("#delete-btn").click(function () {
	if (dianJqGridRowData == null || dianJqGridRowData == '') {
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
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/deleteGenericPoint/" + dianJqGridRowData.id,

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

//搜索按钮点击事件
$("#plsCarTpSch").click(function () {
	if ($("#namename").val().trim() === "" && $("#codecode").val().trim() === "" && $("#stationidstationid").val().trim() === "" && $("#pointcodepointcode").val().trim() === "") {
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/",
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
						console.log("listArray" + JSON.stringify(listArray));
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
									if (mydata[j] !== null && data[j] !== null) {
										mydata[j]['stationName'] = data[j]['stationName'];
									}
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
				$("#table_list_1").jqGrid('clearGridData'); //清空表格
				$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	} else {
		var array = ["name", "code", "stationid", "pointcode"];
		var yzurl = likeQuery(YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/?", array);
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
						console.log("listArray" + JSON.stringify(listArray));
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
									if (mydata[j] !== null && data[j] !== null) {
										mydata[j]['stationName'] = data[j]['stationName'];
									}
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
				$("#table_list_1").jqGrid('clearGridData'); //清空表格
				$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	}
});

//表单提交

function dianAction() {

	if (flag == "add") {
		//console.log(JSON.stringify($('#commentForm').serializeJSON()));
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/addGenericPoint",
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
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/genericPointCRUD/updateGenericPoint/" + dianJqGridRowData.id,
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