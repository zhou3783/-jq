var flag; //add与update标识
var placeJqGridRowData; //点击行数据   
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
	url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/",
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
		index: 'bimage'

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
		index: 'placetype'

	}, {
		name: 'simage',
		index: 'simage'

	}, {
		name: 'stationid',
		index: 'stationid',
		hidden: true

	}, {
		name: 'stationName',
		index: 'stationName'

	}, {
		name: 'latitude',
		index: 'latitude'

	}, {
		name: 'longitude',
		index: 'longitude'

	}, {
		name: 'pointName',
		index: 'pointName',
		width: 200

	}, {
		name: 'owner',
		index: 'owner'

	}, {
		name: 'resourceTypeCode',
		index: 'resourceTypeCode'

	}],

	viewrecords: true,
	//	sortorder : "desc",
	caption: "",
	hidegrid: false,
	//	sortname : 'id',
	//	multiselect : true,
	onSelectRow: function onSelectRow(rowId, status) {
		placeJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		//		console.log(cameraJqGridRowData);
	}
});

//多选表格
//jQuery("#list9").jqGrid(
//    {
//      url : ctx+'/JSONData?nd=' + new Date().getTime(),
//      datatype : "json",
//      
//      rowNum : 10,
//      pager : '#pager9',
//      sortname : 'id',
//      recordpos : 'left',
//      viewrecords : true,
//      sortorder : "desc",
//      multiselect : true,
//      
//    });
//jQuery("#list9").jqGrid('navGrid', '#pager9', {
//  add : false,
//  del : false,
//  edit : false,
//  position : 'right'
//});
//jQuery("#m1").click(function() {
//  var s;
//  s = jQuery("#list9").jqGrid('getGridParam', 'selarrrow');
//  alert(s);
//});
//jQuery("#m1s").click(function() {
//  jQuery("#list9").jqGrid('setSelection', "13");
//});

//jQuery("#update-btn").click(function () {
//      var id = jQuery("#table_list_1").jqGrid('getGridParam', 'selrow');//JSONData中的id主键
//
//      console.log("id: " + id);
//      if (id) {
//          var ret = jQuery("#table_list_1").jqGrid('getRowData', id);
//          console.log("ret: " + ret);
//          console.log(ret);
//      } else {
//          console.log("Please select row");
//      }
//  });
//  jQuery("#a2").click(function () {
//      var id = jQuery('#list5').jqGrid('getGridParam', 'selrow');
//      var su = jQuery("#list5").jqGrid('delRowData', id);
//      if (su) {
//          console.log("Succes. Write custom code to delete row from server");
//      } else {
//          console.log("Allready deleted or not in list");
//      }
//  });
//  jQuery("#a3").click(function () {
//      var id = jQuery('#list5').jqGrid('getGridParam', 'selrow');
//      var su = jQuery("#list5").jqGrid('setRowData', id, {
//          amount: "333.00",
//          tax: "33.00",
//          total: "366.00",
//          note: "<img src='images/user1.gif'/>"
//      });
//      if (su) {
//          console.log("Succes. Write custom code to update row in server");
//      }else {
//          console.log("Can not update");
//      }
//  });
//  jQuery("#a4").click(function () {
//      var datarow = {
//          id: "99",
//          invdate: "2007-09-01",
//          name: "test3",
//          note: "note3",
//          amount: "400.00",
//          tax: "30.00",
//          total: "430.00"
//      };
//      var su = jQuery("#list5").jqGrid('addRowData', 99, datarow);
//      if (su) {
//          console.log("Succes. Write custom code to add data in server");
//      } else {
//          console.log("Can not update");
//      }
//  });


$.jqPaginator('#pagination1', {
	totalPages: totalPage,
	visiblePages: 10,
	currentPage: 1,
	onPageChange: function onPageChange(num, type) {

		var mydata;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/",
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

		$("#table_list_1").jqGrid('clearGridData'); //清空表格
		$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
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
	$('#table_list_1').setGridWidth(width);
});

$("#add-btn").click(function () {
	flag = "add";
	$("#commentForm").find("input").val("");
	$("#resourceTypeCode").prop("disabled", false);
	$("#owner").val("T_RES_PLACE_INFO");
	$("#stationid option").eq(0).prop("selected", true);
	$(".chosen-select").trigger("chosen:updated");
	$(".modal-title").html("新增场所信息");
});

$("#addDep-btn").click(function () {
	if (placeJqGridRowData == null || placeJqGridRowData == '') {
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
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/relation/addTResPlaceIMRelation/" + placeJqGridRowData.id + "/" + importantPlaceJqGridRowData.id,

			dataType: "text",
			async: true,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
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
	if (placeJqGridRowData == null || placeJqGridRowData == '') {
		layer.confirm('请指定删除关系的信息列！', {
			btn: ['是的'] //按钮
		});
	} else {
		layer.confirm('是否确定要删除？', {
			btn: ['是的', '取消'] //按钮
		}, function () {
			$.ajax({
				type: "delete",
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/relation/deleteTResPlaceIMRelation/" + placeJqGridRowData.id,
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
	$(".modal-title").html("修改场所信息");
	if (placeJqGridRowData == null || placeJqGridRowData == '') {
		layer.confirm('请指定修改的信息列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");

		//回显
		objToform(placeJqGridRowData);
		$("#stationId").find("option[value='" + placeJqGridRowData.stationId + "']").prop("selected", true);
		$("#resourceTypeCode").prop("disabled", true);
		$(".chosen-select").trigger("chosen:updated");
	}
});

$("#delete-btn").click(function () {
	if (placeJqGridRowData == null || placeJqGridRowData == '') {
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
				url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/deletePlaceInfo/" + placeJqGridRowData.id,

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
	var excelModalDownloadUrl = YZ.ajaxURLms + 'api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/upExcel/template';
	$(location).attr('href', excelModalDownloadUrl);
});

//导入
function doUploadExcel() {
	var formData = new FormData($("#uploadExcel")[0]);
	$.ajax({
		url: YZ.ajaxURLms + 'api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/upExcel',
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
	if ($("#namename").val().trim() === "" && $("#codecode").val().trim() === "" && $("#stationidstationid").val().trim() === "" && $("#resourceTypeCoderesourceTypeCode").val().trim() === "") {
		$.jqPaginator('#pagination1', {
			totalPages: totalPage,
			visiblePages: 10,
			currentPage: 1,
			onPageChange: function onPageChange(num, type) {

				var mydata;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/",
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
				$("#table_list_1").jqGrid('clearGridData'); //清空表格
				$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

				}).trigger("reloadGrid");
			}
		});
	} else {
		var array = ["name", "code", "stationid", "resourceTypeCode"];
		var yzurl = likeQuery(YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/?", array);
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
function placeAction() {

	if (flag == "add") {
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/addPlaceInfo",
			data: JSON.stringify($('#commentForm').serializeJSON()),
			dataType: "text",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				//				console.log(JSON.stringify($('#commentForm').serializeJSON()));
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
			url: YZ.ajaxURLms + "api/jp-BIRM-Resource-ms/resource/placeInfoCRUD/updatePlaceInfo/" + placeJqGridRowData.id,
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