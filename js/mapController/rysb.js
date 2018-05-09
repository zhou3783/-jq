var flag; //add与update标识
var policeJqGridRowData; //点击行数据
//chosen-select 插件初始化
$(".chosen-select").chosen();
$.jgrid.defaults.styleUI = 'Bootstrap';

var optionEle = 'dt'; //对应设备value

var mydata;
var totalRecords;
//var serachText; // 模糊查询
var mydataSerach;
var totalRecordsSerach;
var flagSerach;
var totalPage;

var daPoliceRadio; //手台
var policeDanbing; //单兵
var policeJwt; //警务通
var policeCar; //警车
var policeUav; //无人机

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/byIdAndName",
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

$("#table_list_1").jqGrid({
	data: mydata,
	datatype: "local",
	height: 530,
	//autowidth: true,
	shrinkToFit: false,
	width: $('.jqGrid_wrapper').width(),
	rowNum: 10,

	rownumbers: true,
	colNames: ['序号', '相片路径', '警员代码', '警员姓名', '性别', '联系方式', '部门id', '部门', '经度', '纬度', '状态', '警员类型id', '警员类型', '职位id', '职位', '办公电话', '生日', '排序', '逻辑删除', '是否是测试员'],
	colModel: [{
		name: 'id',
		index: 'id',
		hidden: true

	}, {
		name: 'pictureUrl',
		index: 'pictureUrl',
		hidden: true

	}, {
		name: 'policeCode',
		index: 'policeCode',

		sorttype: "int"

	}, {
		name: 'name',
		index: 'name'

	}, {
		name: 'gender',
		index: 'gender',

		align: "left"

	}, {
		name: 'telephone',
		index: 'telephone',

		align: "left",
		sorttype: "float"
	}, {
		name: 'stationId',
		index: 'stationId',

		sorttype: "int",
		hidden: true

	}, {
		name: 'stationName',
		index: 'stationName',

		align: "left",
		sorttype: "float",
		hidden: true
	}, {
		name: 'longitude',
		index: 'longitude',
		sorttype: "float"

	}, {
		name: 'latitude',
		index: 'latitude',
		align: "left",
		sorttype: "float"

	}, {
		name: 'status',
		index: 'status',
		sorttype: "int"

	}, {
		name: 'policeTypeId',
		index: 'policeTypeId',
		sorttype: "int",
		hidden: true

	}, {
		name: 'policeTypeName',
		index: 'policeTypeName',

		sorttype: "int",
		hidden: true

	}, {
		name: 'policePosition',
		index: 'policePosition',

		sorttype: "int",
		hidden: true

	}, {
		name: 'policePositionName',
		index: 'policePositionName',

		sorttype: "int",
		hidden: true

	}, {
		name: 'officeTel',
		index: 'officeTel',

		sorttype: "int"

	}, {
		name: 'birthday',
		index: 'birthday',

		sortable: false,
		formatter: "date"
	}, {
		name: 'sort',
		index: 'sort',

		sorttype: "int",
		hidden: true

	}, {
		name: 'isDelete',
		index: 'isDelete',

		sorttype: "int",
		hidden: true

	}, {
		name: 'isTestPolice',
		index: 'isTestPolice',

		sorttype: "int",
		hidden: true
	}],
	pager: "#pager_list_1",
	viewrecords: true,
	caption: "",
	hidegrid: false,
	onSelectRow: function onSelectRow(rowId, status) {
		policeJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
		//  console.log(policeJqGridRowData);

		$("#policeGuid").val(policeJqGridRowData.id);
		$("#policeName").val(policeJqGridRowData.name);
		initMenu();
	}
});

function initMenu() {
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/dutyInfos/policeFacs/today/" + policeJqGridRowData.id,

		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			$("#dtReadID").attr("data-content", "空空如也");
			$('#dtReadID').popover('hide');
			$("#dtReadID").val('');

			$("#dbReadID").attr("data-content", "空空如也");
			$('#dbReadID').popover('hide');
			$("#dbReadID").val('');

			$("#jcReadID").attr("data-content", "空空如也");
			$('#jcReadID').popover('hide');
			$("#jcReadID").val('');

			$("#jwtReadID").attr("data-content", "空空如也");
			$('#jwtReadID').popover('hide');
			$("#jwtReadID").val('');

			$("#wrjReadId").attr("data-content", "空空如也");
			$('#wrjReadId').popover('hide');
			$("#wrjReadId").val('');

			//console.log(data);
			daPoliceRadio = data.daPoliceRadio; //手台
			policeDanbing = data.policeDanbing; //单兵
			policeJwt = data.policeJwt; //警务通
			policeCar = data.policeCar; //警车
			policeUav = data.policeUav; //无人机

			if (daPoliceRadio != null) {
				$("#dtReadID").val(daPoliceRadio.radioId);
				$("#dtReadID").attr("data-content", daPoliceRadio.radioId);
			}
			if (policeDanbing != null) {
				$("#dbReadID").val(policeDanbing.danbingId);
				$("#dbReadID").attr("data-content", policeDanbing.danbingId);
			}
			if (policeCar != null) {
				$("#jcReadID").val(policeCar.carId);
				$("#jcReadID").attr("data-content", policeCar.carId);
			}
			if (policeJwt != null) {
				$("#jwtReadID").val(policeJwt.jwtId);
				$("#jwtReadID").attr("data-content", policeJwt.jwtId);
			}
			if (policeUav != null) {
				$("#wrjReadId").val(policeUav.uavId);
				$("#wrjReadId").attr("data-content", policeUav.uavId);
			}
		}
	});
}

$.jqPaginator('#pagination1', {
	totalPages: totalPage,
	visiblePages: 10,
	currentPage: 1,
	onPageChange: function onPageChange(num, type) {

		var mydata;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/byIdAndName",
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
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/byIdAndName",
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
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/byIdAndName",
			data: {
				"pageIndex": 0,
				"pageSize": 10,
				"name": serachText
			},
			dataType: "json",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				//console.log(data);
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
							url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/byIdAndName",
							data: {
								"pageIndex": num - 1,
								"pageSize": 10,
								"name": serachText
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

								$("#table_list_1").jqGrid('clearGridData'); //清空表格
								$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
									datatype: 'local',
									data: data.data //  newdata 是符合格式要求的需要重新加载的数据 

								}).trigger("reloadGrid");
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

$("#dtReadID").popover({
	placement: 'left'
});
$("#dbReadID").popover({
	placement: 'left'
});
$("#jcReadID").popover({
	placement: 'left'
});
$("#jwtReadID").popover({
	placement: 'left'
});
$("#wrjReadId").popover({
	placement: 'left'
});

$("#selectOption").change(function () {
	optionEle = $("#selectOption").val();
});

$("#add-btn").click(function () {
	flag = "add";
	if (policeJqGridRowData == null || policeJqGridRowData == '') {
		layer.confirm('请选定警员列！', {
			btn: ['是的'] //按钮
		});
		$("#add-btn").attr("data-target", "");
	} else {
		$("#add-btn").attr("data-target", "#myModal");
		if (optionEle == 'dt') {
			if (daPoliceRadio == null) {
				$(".modal-title").html("新增电台信息");
				$("#add-btn").attr("data-target", "#myModal");

				$("#equipID").attr("name", "radioId");
				$("#equipID").val('');
			} else {
				layer.confirm('已备有电台！', {
					btn: ['是的'] //按钮
				});
				$("#add-btn").attr("data-target", "");
			}
		} else if (optionEle == 'db') {
			if (policeDanbing == null) {
				$(".modal-title").html("新增单兵信息");
				$("#add-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "danbingId");
				$("#equipID").val('');
			} else {
				layer.confirm('已备有单兵！', {
					btn: ['是的'] //按钮
				});
				$("#add-btn").attr("data-target", "");
			}
		} else if (optionEle == 'jc') {

			if (policeCar == null) {
				$(".modal-title").html("新增警车信息");
				$("#add-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "carId");
				$("#equipID").val('');
			} else {
				layer.confirm('已备有警车！', {
					btn: ['是的'] //按钮
				});
				$("#add-btn").attr("data-target", "");
			}
		} else if (optionEle == 'jwt') {
			if (policeJwt == null) {
				$(".modal-title").html("新增警务通信息");
				$("#add-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "jwtId");
				$("#equipID").val('');
			} else {
				layer.confirm('已备有警务通！', {
					btn: ['是的'] //按钮
				});
				$("#add-btn").attr("data-target", "");
			}
		} else {
			if (policeUav == null) {
				$(".modal-title").html("新增无人机信息");
				$("#add-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "uavId");
				$("#equipID").val('');
			} else {
				layer.confirm('已备有无人机！', {
					btn: ['是的'] //按钮
				});
				$("#add-btn").attr("data-target", "");
			}
		}
	}
});

$("#update-btn").click(function () {
	flag = "update";
	if (policeJqGridRowData == null || policeJqGridRowData == '') {
		layer.confirm('请选定警员列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		$("#update-btn").attr("data-target", "#myModal");
		if (optionEle == 'dt') {

			if (daPoliceRadio == null) {
				layer.confirm('未备有电台！', {
					btn: ['是的'] //按钮
				});
				$("#update-btn").attr("data-target", "");
			} else {
				$(".modal-title").html("修改电台信息");
				$("#update-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "radioId");
				$("#equipID").val(daPoliceRadio.radioId);
				/*if(daPoliceRadio.isDelete == 1 || daPoliceRadio.isDelete == '1') {
    	$("#isDelete0").attr("checked", "checked");
    } else {
    	$("#isDelete1").attr("checked", "checked");
    }*/
			}
		} else if (optionEle == 'db') {
			if (policeDanbing == null) {
				layer.confirm('未备有单兵！', {
					btn: ['是的'] //按钮
				});
				$("#update-btn").attr("data-target", "");
			} else {
				$(".modal-title").html("修改单兵信息");
				$("#update-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "danbingId");
				$("#equipID").val(policeDanbing.danbingId);
				/*if(policeDanbing.isDelete == 1 || policeDanbing.isDelete == '1') {
    	$("#isDelete0").attr("checked", "checked");
    } else {
    	$("#isDelete1").attr("checked", "checked");
    }*/
			}
		} else if (optionEle == 'jc') {

			if (policeCar == null) {
				layer.confirm('未备有警车！', {
					btn: ['是的'] //按钮
				});
				$("#update-btn").attr("data-target", "");
			} else {
				$(".modal-title").html("修改警车信息");
				$("#update-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "carId");
				$("#equipID").val(policeCar.carId);
				/*if(policeCar.isDelete == 1 || policeCar.isDelete == '1') {
    	$("#isDelete0").attr("checked", "checked");
    } else {
    	$("#isDelete1").attr("checked", "checked");
    }*/
			}
		} else if (optionEle == 'jwt') {
			if (policeJwt == null) {
				layer.confirm('未备有警务通！', {
					btn: ['是的'] //按钮
				});
				$("#update-btn").attr("data-target", "");
			} else {
				$(".modal-title").html("修改警务通信息");
				$("#update-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "jwtId");
				$("#equipID").val(policeJwt.jwtId);
				/*if(policeJwt.isDelete == 1 || policeJwt.isDelete == '1') {
    	$("#isDelete0").attr("checked", "checked");
    } else {
    	$("#isDelete1").attr("checked", "checked");
    }*/
			}
		} else {
			if (policeUav == null) {
				layer.confirm('未备有无人机！', {
					btn: ['是的'] //按钮
				});
				$("#update-btn").attr("data-target", "");
			} else {
				$(".modal-title").html("修改无人机信息");
				$("#update-btn").attr("data-target", "#myModal");
				$("#equipID").attr("name", "uavId");
				$("#equipID").val(policeUav.uavId);
				/*if(policeUav.isDelete == 1 || policeUav.isDelete == '1') {
    	$("#isDelete0").attr("checked", "checked");
    } else {
    	$("#isDelete1").attr("checked", "checked");
    }*/
			}
		}
	}
});

$("#delete-btn").click(function () {
	if (policeJqGridRowData == null || policeJqGridRowData == '') {
		layer.confirm('请选定警员列！', {
			btn: ['是的'] //按钮
		});
		$("#update-btn").attr("data-target", "");
	} else {
		if (optionEle == 'dt') {
			if (daPoliceRadio == null) {
				layer.confirm('未备有电台！', {
					btn: ['是的'] //按钮
				});
			} else {
				layer.confirm('是否确定要删除？', {
					btn: ['是的', '取消'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$.ajax({
						type: "put",
						url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/daPoliceRadios/updateIsDelete/" + daPoliceRadio.id,

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

								initMenu();
								/*setTimeout(function() {
        location.reload();
        }, 1000);*/
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
		} else if (optionEle == 'db') {
			if (policeDanbing == null) {
				layer.confirm('未备有单兵！', {
					btn: ['是的'] //按钮
				});
			} else {

				layer.confirm('是否确定要删除？', {
					btn: ['是的', '取消'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$.ajax({
						type: "put",
						url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeDanbings/updateIsDelete/" + policeDanbing.id,

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
								initMenu();
								/*setTimeout(function() {
        location.reload();
        }, 1000);*/
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
		} else if (optionEle == 'jc') {

			if (policeCar == null) {
				layer.confirm('未备有警车！', {
					btn: ['是的'] //按钮
				});
			} else {

				layer.confirm('是否确定要删除？', {
					btn: ['是的', '取消'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$.ajax({
						type: "put",
						url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeCars/updateIsDelete/" + policeCar.id,

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
								initMenu();
								/*setTimeout(function() {
        location.reload();
        }, 1000);*/
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
		} else if (optionEle == 'jwt') {
			if (policeJwt == null) {
				layer.confirm('未备有警务通！', {
					btn: ['是的'] //按钮
				});
			} else {

				layer.confirm('是否确定要删除？', {
					btn: ['是的', '取消'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$.ajax({
						type: "put",
						url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeJwts/updateIsDelete/" + policeJwt.id,

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
								initMenu();
								/*setTimeout(function() {
        location.reload();
        }, 1000);*/
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
		} else {
			if (policeUav == null) {
				layer.confirm('未备有无人机！', {
					btn: ['是的'] //按钮
				});
			} else {

				layer.confirm('是否确定要删除？', {
					btn: ['是的', '取消'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$.ajax({
						type: "put",
						url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeUavs/updateIsDelete/" + policeUav.id,

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
								initMenu();
								/*setTimeout(function() {
        location.reload();
        }, 1000);*/
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
		}
	}
});

function rysbAction() {
	$('#myModal').modal('hide');
	if (flag == 'add') {
		if (optionEle == 'dt') {
			//console.log(JSON.stringify($('#commentForm').serializeJSON()));

			$.ajax({
				type: "post",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/daPoliceRadios/",
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},

				error: function error(returndata) {
					layer.msg('新增失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else if (optionEle == 'db') {

			$.ajax({
				type: "post",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeDanbings/",
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},

				error: function error(returndata) {
					layer.msg('新增失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else if (optionEle == 'jc') {
			$.ajax({
				type: "post",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeCars/",
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},

				error: function error(returndata) {
					layer.msg('新增失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else if (optionEle == 'jwt') {
			$.ajax({
				type: "post",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeJwts/",
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},

				error: function error(returndata) {
					layer.msg('新增失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else {

			$.ajax({
				type: "post",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeUavs/",
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},
				error: function error(returndata) {
					layer.msg('新增失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		}
	} else if (flag == 'update') {

		if (optionEle == 'dt') {
			//console.log(JSON.stringify($('#commentForm').serializeJSON()));		
			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/daPoliceRadios/" + daPoliceRadio.id,
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},
				error: function error(returndata) {
					layer.msg('修改失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else if (optionEle == 'db') {

			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeDanbings/" + policeDanbing.id,
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},
				error: function error(returndata) {
					layer.msg('修改失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else if (optionEle == 'jc') {

			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeCars/" + policeCar.id,
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},
				error: function error(returndata) {
					layer.msg('修改失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else if (optionEle == 'jwt') {

			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeJwts/" + policeJwt.id,
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
					}
				},
				error: function error(returndata) {
					layer.msg('修改失败', {
						icon: 1
					});
					$('#myModal').modal('show');
				}
			});
		} else {

			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BSD-DutyInfo-ms/policeUavs/" + policeUav.id,
				data: JSON.stringify($('#commentForm').serializeJSON()),
				dataType: "json",
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
						initMenu();
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
}