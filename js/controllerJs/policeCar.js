//var jurisdictionJqGridRowData;
$(document).ready(function () {
	var selectRowplcCar;
	//时间控件绑定
	$('.date').datetimepicker({
		minView: "month",
		format: "yyyy-mm-dd",
		autoclose: true
	});

	//获取部门信息
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/getOrgaInfo",
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(result) {
			for (var i = 0; i < result.length; i++) {
				var o = new Option(result[i].name, result[i].id);
				$("#stationid").append(o);
			}
		}
	});
	$(".chosen-select").chosen();

	//获取警车类型,绑定到下拉框
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policefacility/cartype/",
		dataType: "json",
		async: false,
		success: function success(result) {
			for (var i = 0; i < result.length; i++) {
				var o = new Option(result[i].type, result[i].id);
				var o1 = new Option(result[i].type, result[i].id);
				$("#plsCarTp").append(o);
				$("#carTypeid").append(o1);
			}
		},
		error: function error(textStatus) {
			layer.msg('加载超时', {
				icon: 3
			});
		}
	});

	$.jgrid.defaults.styleUI = 'Bootstrap';

	$(window).on('resize', function () {
		$('#table_list_jc').setGridWidth($('.jqGrid_wrapper').width());
		$('#table_list_jc').setGridHeight($(window).height() - 190);
	});

	//搜索按钮点击事件
	$("#plsCarTpSch").click(function () {
		if ($("#searchText").val().trim() == "") {
			location.reload();
		} else {
			var totalRecords = 0;
			//			console.log($("#plsCarTp option:selected").val());
			//			console.log($("#searchText").val());
			var urlpath = "";
			if ($("#plsCarTp option:selected").val() === "无") {
				urlpath = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo?carcodeLike=" + $("#searchText").val();
			} else {
				urlpath = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo?cartype=" + $("#plsCarTp option:selected").val() + "&carcodeLike=" + $("#searchText").val();
			}
			//			console.log(urlpath);
			$.ajax({
				type: "get",
				url: urlpath,
				dataType: "json",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					//					console.log(data);
					var mydata1 = data.data;
					totalRecords = data.elementsSum;
					$("#table_list_jc").jqGrid('clearGridData'); //清空表格
					$("#table_list_jc").jqGrid('setGridParam', {
						datatype: 'local',
						data: mydata1,
						page: 1
					}).trigger("reloadGrid");
				}
			});
			if (totalRecords > 0) {
				$.jqPaginator('#pagination0', {
					totalPages: Math.ceil(totalRecords / 10),
					visiblePages: 10,
					currentPage: 1,
					onPageChange: function onPageChange(num, type) {
						var mydata;
						num = num - 1;
						var urlpath1 = "";
						if ($("#plsCarTp option:selected").val() === "无") {
							urlpath1 = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo?carcodeLike=" + $("#searchText").val() + "&pageIndex=" + num;
						} else {
							urlpath1 = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo?cartype=" + $("#plsCarTp option:selected").val() + "&pageIndex=" + num + "&carcodeLike=" + $("#searchText").val();
						}
						//						console.log(urlpath1);
						$.ajax({
							type: "get",
							url: urlpath1,
							dataType: "json",
							async: false,
							headers: {
								"Content-Type": "application/json;charset=UTF-8"
							},
							success: function success(data) {
								mydata1 = data.data;
								//								console.log(mydata1);
								totalRecords = data.elementsSum;
								$("#table_list_jc").jqGrid('clearGridData'); //清空表格
								$("#table_list_jc").jqGrid('setGridParam', { // 重新加载数据
									datatype: 'local',
									data: mydata1, //  newdata 是符合格式要求的需要重新加载的数据 
									page: 1
								}).trigger("reloadGrid");
							}
						});
					}
				});
			} else {
				$('#pagination0').jqPaginator('destroy');
			}
		}
	});

	//新增按钮点击事件
	$("#add-btn").click(function () {
		$("#myModalLabel").html("新增警车信息!");
		//输入框值全置为空
		$("#commentForm input").val("");
	});

	//编辑按钮点击事件
	$("#update-btn").click(function () {
		if (selectRowplcCar != null) {
			//			console.log(selectRowplcCar);
			$("#update-btn").attr("data-target", "#myModal");
			$("#myModalLabel").html("修改警车信息!");
			//输入框值回显
			objToform(selectRowplcCar);
			$("#carTypeid").val(selectRowplcCar["cartype.id"]);
			//			$("#stationid").find('option[value=' + selectRowplcCar.stationid + ']').attr("selected", true);
			//			$(".chosen-select").trigger("chosen:updated");
		} else {
			$("#update-btn").attr("data-target", "");
			layer.confirm('请指定要编辑的列！', {
				btn: ['是的'] //按钮
			});
		}
	});

	//删除按钮点击事件
	$("#delete-btn").click(function () {
		if (selectRowplcCar != null) {
			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				$.ajax({
					type: "delete",
					url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/" + selectRowplcCar.id,
					dataType: "text",
					async: false,
					success: function success(result) {
						layer.msg('删除成功!', {
							icon: 1
						});
						setTimeout(function () {
							location.reload();
						}, 1000);
					},
					error: function error(textStatus) {
						layer.msg('删除失败!', {
							icon: 2
						});
					}
				});
			});
		} else {
			layer.msg('请选择要删除的列!', {
				icon: 2
			});
		}
	});

	//保存按钮点击事件
	$("#plsCarTpSave").click(function () {
		//判断$("#myModalLabel").html("新增警车信息!")的值
		if ($("#myModalLabel").html() == "新增警车信息!") {
			if ($("#carcode").val().trim() == "") {} else {
				var carType = new Object();
				carType.id = $("#carTypeid option:selected").val();
				carType.type = $("#carTypeid option:selected").text();
				var obj = $('#commentForm').serializeJSON();
				obj.carType = carType;
				obj.stationid = $("#stationid option:selected").val();
				obj.insurancestartdate = obj.insurancestartdate + "T00:00:00.0000000+08:00";
				obj.insuranceenddate = obj.insuranceenddate + "T00:00:00.0000000+08:00";
				obj.whlastdate = obj.whlastdate + "T00:00:00.0000000+08:00";
				obj.whenddate = obj.whenddate + "T00:00:00.0000000+08:00";
				obj.createtime = obj.createtime + "T00:00:00.0000000+08:00";
				var addData = JSON.stringify(obj);
				//							console.log(addData);

				//				var commentForm = $('#commentForm').serializeJSON();
				//		        commentForm.installTime = commentForm.installTime + "T00:00:00.0000000+08:00";
				$.ajax({
					type: "post",
					url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/",
					dataType: "json",
					data: addData,
					ContentType: "application/json;charset=UTF-8",
					contentType: "application/json",
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					async: false,
					success: function success(result) {
						layer.msg('新增成功!', {
							icon: 1
						});
						$(".close").click();
					},
					error: function error(returnResult) {
						console.log(returnResult);
						layer.msg(JSON.parse(returnResult.responseText).errorMsg, {
							icon: 2
						});
						//						$(".close").click();
					}
				});
			}
		} else {
			var carType = new Object();
			carType.id = $("#carTypeid option:selected").val();
			carType.type = $("#carTypeid option:selected").text();
			var obj = $('#commentForm').serializeJSON();
			obj.carType = carType;
			obj.stationid = $("#stationid option:selected").val();
			obj.insurancestartdate = obj.insurancestartdate + "T00:00:00.0000000+08:00";
			obj.insuranceenddate = obj.insuranceenddate + "T00:00:00.0000000+08:00";
			obj.whlastdate = obj.whlastdate + "T00:00:00.0000000+08:00";
			obj.whenddate = obj.whenddate + "T00:00:00.0000000+08:00";
			obj.createtime = obj.createtime + "T00:00:00.0000000+08:00";
			var addData = JSON.stringify(obj);
			//						console.log(addData);
			//						console.log(selectRowplcCar.id);
			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/" + selectRowplcCar.id,
				dataType: "text",
				data: addData,
				ContentType: "application/json;charset=UTF-8",
				contentType: "application/json",
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				async: false,
				success: function success(result) {
					layer.msg('更新成功!', {
						icon: 1
					});
					$(".close").click();
					setTimeout(function () {
						location.reload();
					}, 1000);
				},
				error: function error() {
					layer.msg('更新失败!', {
						icon: 2
					});
					//					$(".close").click();
				}
			});
		}
	});

	//取消按钮点击事件
	$("#cancel").click(function () {});

	$("#plsCarTp").on("change", function () {
		var totalRecords = 0;
		var urlpath = "";
		if ($("#plsCarTp option:selected").val() === "无") {
			urlpath = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo";
		} else {
			urlpath = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo?cartype=" + $("#plsCarTp option:selected").val();
		}
		$.ajax({
			type: "get",
			url: urlpath,
			dataType: "json",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				//								console.log(data);
				var mydata = data.data;
				totalRecords = data.elementsSum;
				$("#table_list_jc").jqGrid('clearGridData'); //清空表格
				$("#table_list_jc").jqGrid('setGridParam', { // 重新加载数据
					datatype: 'local',
					data: mydata //  newdata 是符合格式要求的需要重新加载的数据 
					//					page: 1
				}).trigger("reloadGrid");
			}
		});
		if (totalRecords > 0) {
			$.jqPaginator('#pagination0', {
				totalPages: Math.ceil(totalRecords / 10),
				visiblePages: 10,
				currentPage: 1,
				onPageChange: function onPageChange(num, type) {
					var mydata;
					num = num - 1;
					$.ajax({
						type: "get",
						url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo?cartype=" + $("#plsCarTp option:selected").val() + "&pageIndex=" + num + "&pageSize=10",
						dataType: "json",
						async: false,
						headers: {
							"Content-Type": "application/json;charset=UTF-8"
						},
						success: function success(data) {
							mydata = data.data;
							totalRecords = data.elementsSum;
						}
					});

					$("#table_list_jc").jqGrid('clearGridData'); //清空表格
					$("#table_list_jc").jqGrid('setGridParam', { // 重新加载数据
						datatype: 'local',
						data: mydata //  newdata 是符合格式要求的需要重新加载的数据 
						//						page: 1
					}).trigger("reloadGrid");
				}
			});
		} else {
			$("#pagination0").jqPaginator('destroy');
		}
	});

	//页面加载,获取总记录数
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo",
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			//			console.log(data);	
			mydata = data.data;
			totalRecords = data.elementsSum;
		}
	});
	//	console.log(mydata);
	//页面加载所有警车
	$("#table_list_jc").jqGrid({
		data: mydata,
		datatype: "local",
		width: $('.jqGrid_wrapper').width(),
		height: $(window).height() - 190,
		shrinkToFit: false,
		autoScroll: true,
		//		rowNum: 14,
		//		rowList: [10, 20, 30],
		colNames: ['序号', '车牌号', '车辆名称', '车辆类型', '车辆类型名称', '车辆颜色', '车辆符号', '车辆所属名称', '车辆所属密码', '车辆所属地址', '驾驶员姓名', '驾驶员编号', '车辆引擎', '车辆底盘', '车辆通信号', '车辆样式', '组编号', '通用属性', '保险类型', '保险价格', 'WH类型', '保险开始时间', '保险结束时间', 'WHLastDate', 'WHEndDate', '车辆价格编号', '电话', '第一联系人', '第一联系人移动电话', '第一联系人电话', '第二联系人', '第二联系人移动电话', '第二联系人电话', '报警电话', '创建时间', '备注', '经度', '纬度', '是否在线', '部门ID', '部门名称'],
		colModel: [{
			name: 'id',
			index: 'id',
			sorttype: "int",
			hidden: true
		}, {
			name: 'carcode',
			index: 'carcode'
		}, {
			name: 'carName',
			index: 'carName'
		}, {
			name: 'cartype.id',
			index: 'cartype.id',
			hidden: true
		}, {
			name: 'cartype.type',
			index: 'cartype.type'

		}, {
			name: 'carcolor',
			index: 'carcolor'

		}, {
			name: 'carsymbol',
			index: 'carsymbol'

		}, {
			name: 'carowner',
			index: 'carowner'

		}, {
			name: 'carownerpsw',
			index: 'carownerpsw'

		}, {
			name: 'carowneraddress',
			index: 'carowneraddress'

		}, {
			name: 'drivername',
			index: 'drivername'

		}, {
			name: 'driverlicense',
			index: 'driverlicense'

		}, {
			name: 'carengine',
			index: 'carengine'

		}, {
			name: 'carbatholith',
			index: 'carbatholith'

		}, {
			name: 'carcmmucode',
			index: 'carcmmucode'

		}, {
			name: 'carstyle',
			index: 'carstyle'

		}, {
			name: 'teamid',
			index: 'teamid'

		}, {
			name: 'commattribute',
			index: 'commattribute'

		}, {
			name: 'insurancetype',
			index: 'insurancetype'

		}, {
			name: 'insuranceprice',
			index: 'insuranceprice'

		}, {
			name: 'whtype',
			index: 'whtype'

		}, {
			name: 'insurancestartdate',
			index: 'insurancestartdate'

		}, {
			name: 'insuranceenddate',
			index: 'insuranceenddate'

		}, {
			name: 'whlastdate',
			index: 'whlastdate'

		}, {
			name: 'whenddate',
			index: 'whenddate'

		}, {
			name: 'carpriceid',
			index: 'carpriceid'

		}, {
			name: 'telphone',
			index: 'telphone'

		}, {
			name: 'firstlinkman',
			index: 'firstlinkman'

		}, {
			name: 'firstmob',
			index: 'firstmob'
		}, {
			name: 'firstphone',
			index: 'firstphone'

		}, {
			name: 'secondlinkman',
			index: 'secondlinkman'

		}, {
			name: 'secondmob',
			index: 'secondmob'

		}, {
			name: 'secondphone',
			index: 'secondphone'

		}, {
			name: 'openalarm',
			index: 'openalarm'

		}, {
			name: 'createtime',
			index: 'createtime'

		}, {
			name: 'remark',
			index: 'remark'

		}, {
			name: 'longitude',
			index: 'longitude'

		}, {
			name: 'latitude',
			index: 'latitude'

		}, {
			name: 'isonline',
			index: 'isonline'

		}, {
			name: 'stationid',
			index: 'stationid'
		}, {
			name: 'stationName',
			index: 'stationName'
		}],
		viewrecords: true,
		caption: "",
		hidegrid: false,
		rownumbers: true,
		onSelectRow: function onSelectRow(rowId, status) {
			selectRowplcCar = $("#table_list_jc").jqGrid("getRowData", rowId);
			//			objToform(selectRowplcCar);
		}
	});
});
//分页
//	if(totalRecords > 0) {
//		$.jqPaginator('#pagination0', {
//			totalPages: Math.ceil(totalRecords / 10),
//			visiblePages: 10,
//			currentPage: 1,
//			onPageChange: function(num, type) {
//				num = num - 1;
//				var mydata;
//				$.ajax({
//					type: "get",
//					url: YZ.ajaxURLms+"api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo",
//					dataType: "json",
//					async: false,
//					headers: {
//						"Content-Type": "application/json;charset=UTF-8"
//					},
//					success: function(data) {
//						mydata = data.data;
//						totalRecords = data.elementsSum;
//					}
//				});
//
//				$("#table_list_jc").jqGrid('clearGridData'); //清空表格
//				$("#table_list_jc").jqGrid('setGridParam', { // 重新加载数据
//					datatype: 'local',
//					data: mydata, //  newdata 是符合格式要求的需要重新加载的数据 
//					page: 1
//				}).trigger("reloadGrid");
//			}
//		});
//	}

$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_jc').setGridWidth(width);
});
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo",
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

$.jqPaginator('#pagination0', {
	totalPages: totalPage,
	visiblePages: 10,
	currentPage: 1,
	onPageChange: function onPageChange(num, type) {

		var mydata;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/carInfos/getCarInfo",
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

		$("#table_list_jc").jqGrid('clearGridData'); //清空表格
		$("#table_list_jc").jqGrid('setGridParam', { // 重新加载数据
			datatype: 'local',
			data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

		}).trigger("reloadGrid");
	}
});

//模板下载
$("#download-modalExcel").click(function () {
	var excelModalDownloadUrl = YZ.ajaxURLms + "api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/BSBatch/getTemplate/carInfo";
	$(location).attr('href', excelModalDownloadUrl);
});

//导入
function doUploadExcel() {
	var formData = new FormData($("#uploadExcel")[0]);

	$.ajax({
		url: YZ.ajaxURLms + 'api/jp-BIRM-PoliceFacility-ms/api/birm/policeFacility/BSBatch/carInfo',
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