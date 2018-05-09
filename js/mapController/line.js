var flag; //add与update标识
var xianJqGridRowData; //点击行数据   
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
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/MapLine/",
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
	shrinkToFit: true,
	rowNum: 10,
	colNames: ['分局', '案件类型', '案件类别', '案件细类', '报警电话', '案发地址', '警情内容'],
	colModel: [{
		name: 'resourceTypeCode',
		index: 'resourceTypeCode',
		width: 100

	}, {
		name: 'id',
		index: 'id'
	}, {
		name: 'linecode',
		index: 'linecode',
		width: 140
	}, {
		name: 'name',
		index: 'name',
		width: 220
	}, {
		name: 'objlevel',
		index: 'objlevel',
		width: 80

	}, {
		name: 'remark',
		index: 'remark',
		width: 200
	}, {
		name: 'stationName',
		index: 'stationName',
		width: 140

	}],

	viewrecords: true,
	caption: "",
	hidegrid: false,
	onSelectRow: function onSelectRow(rowId, status) {
		xianJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		//		console.log(cameraJqGridRowData);
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
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/MapLine/",
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

function initGrid() {
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/MapLine/",
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			//console.log(data);
			mydata = data;
			var length = mydata.length;
			var listArray = [];
			for (var i = 0; i < length; i++) {
				listArray.push(mydata[i]['stationid']);
			}
			//console.log("listArray"+JSON.stringify(listArray));
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
					var lengthOne = data.length;
					for (var j = 0; j < lengthOne; j++) {
						mydata[j]['stationName'] = data[j]['stationName'];
					}
					//console.log("data"+JSON.stringify(data));
					//console.log("mydata"+JSON.stringify(mydata));
				},
				error: function error(returndata) {
					console.log(returndata);
				}

			});
		}
	});

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
}
initGrid();
// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_1').setGridWidth(width);
});

function objToform(obj) {
	for (var attr in obj) {
		if ($("#" + attr).length > 0) {
			$("#" + attr).val(obj[attr]);
		}
	}
}

//搜索按钮点击事件
$("#plsCarTpSch").click(function () {
	if ($("#namename").val().trim() === "" && $("#stationidstationid").val().trim() === "") {
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/MapLine/",
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
						//console.log("listArray"+JSON.stringify(listArray));
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
								var lengthOne = data.length;
								for (var j = 0; j < lengthOne; j++) {
									mydata[j]['stationName'] = data[j]['stationName'];
								}
								//console.log("data"+JSON.stringify(data));
								//console.log("mydata"+JSON.stringify(mydata));
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
		var array = ["name", "linecode", "stationid"];
		var yzurl = likeQuery(YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/MapLine/?", array);
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
						//console.log("listArray"+JSON.stringify(listArray));
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
								var lengthOne = data.length;
								for (var j = 0; j < lengthOne; j++) {
									mydata[j]['stationName'] = data[j]['stationName'];
								}
								//console.log("data"+JSON.stringify(data));
								//console.log("mydata"+JSON.stringify(mydata));
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

function xianAction() {

	if (flag == "add") {
		//console.log(JSON.stringify($('#commentForm').serializeJSON()));
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/MapLine/postMapLine",
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
				console.log(returndata);

				layer.msg('新增失败', {
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	} else if (flag == "update") {

		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/MapLine/putMapLine/" + xianJqGridRowData.id,
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

				layer.msg('修改失败', {
					icon: 2
				});
				$('#myModal').modal('show');
			}
		});
	}
}