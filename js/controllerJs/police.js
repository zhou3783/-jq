$(document).ready(function () {

	$.jgrid.defaults.styleUI = 'Bootstrap';
	var policeJqGridRowData;

	var mydata;
	var param1 = {
		stationId: "9BECB65D-4E52-4039-993B-369DAA145EAF"
	};
	$.ajax({
		type: "post",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchPoliceInfoDetail",
		data: JSON.stringify(param1),
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			mydata = data;
		}
	});

	// Configuration for jqGrid Example 1
	function initJqGrid() {
		$("#table_list_1").jqGrid({
			data: mydata,
			datatype: "local",
			height: 530,
			shrinkToFit: false,
			width: $('.jqGrid_wrapper').width(),
			rowNum: 15,
			rowList: [10, 20, 30],
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
				width: 100,
				sorttype: "int"

			}, {
				name: 'name',
				index: 'name',
				width: 80
			}, {
				name: 'gender',
				index: 'gender',
				width: 50,
				align: "left"

			}, {
				name: 'telephone',
				index: 'telephone',
				width: 100,
				align: "left",
				sorttype: "float"
			}, {
				name: 'stationId',
				index: 'stationId',
				width: 40,
				sorttype: "int",
				hidden: true

			}, {
				name: 'stationName',
				index: 'stationName',
				width: 110,
				align: "left",
				sorttype: "float"
			}, {
				name: 'policeLongitude',
				index: 'policeLongitude',
				width: 60,
				sorttype: "float"

			}, {
				name: 'policeLatitude',
				index: 'policeLatitude',
				width: 60,
				align: "left",
				sorttype: "float"

			}, {
				name: 'status',
				index: 'status',
				width: 50,
				sorttype: "int"

			}, {
				name: 'policeTypeId',
				index: 'policeTypeId',

				sorttype: "int",
				hidden: true

			}, {
				name: 'policeTypeName',
				index: 'policeTypeName',
				width: 85,
				sorttype: "int"

			}, {
				name: 'policePosition',
				index: 'policePosition',
				width: 40,
				sorttype: "int",
				hidden: true

			}, {
				name: 'policePositionName',
				index: 'policePositionName',
				width: 100,
				sorttype: "int"

			}, {
				name: 'officeTel',
				index: 'officeTel',
				width: 70,
				sorttype: "int"

			}, {
				name: 'birthday',
				index: 'birthday',
				width: 90,
				sortable: false,
				formatter: "date"
			}, {
				name: 'sort',
				index: 'sort',
				width: 60,
				sorttype: "int",
				hidden: true

			}, {
				name: 'isDelete',
				index: 'isDelete',
				width: 70,
				sorttype: "int",
				hidden: true

			}, {
				name: 'isTestPolice',
				index: 'isTestPolice',
				width: 70,
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
			}
		});
	}
	//			 $("#table_list_1").setSelection(1, true);

	initJqGrid();
	var deptname;
	var deptno;
	var deptId;
	var setting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: function beforeClick(treeId, treeNode) {
				//console.log(treeNode.id);
				deptname = treeNode.name;
				deptId = treeNode.id;

				$("#stationName").val(deptname);
				deptId = treeNode.id;
				var param2 = {
					stationId: treeNode.id
				};
				$.ajax({
					type: "post",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchPoliceInfoDetail",
					data: JSON.stringify(param2),
					dataType: "json",

					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(json) {
						//mydata=data;

						$("#table_list_1").jqGrid('clearGridData'); //清空表格
						$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
							datatype: 'local',
							data: json, //  newdata 是符合格式要求的需要重新加载的数据 
							page: 1
						}).trigger("reloadGrid");
					}
				});
			}
		}
	};

	var allzNodes;
	$(".chosen-select").chosen();
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
			allzNodes = data;
			for (var i = 0; i < data.length; i++) {
				var ele = "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
				$("#stationId1").append(ele);
				/*	$("#stationId").append(ele);*/
			}
		}
	});

	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchAllPoliceType",

		dataType: "json",
		async: false,

		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(result) {

			for (var i = 0; i < result.length; i++) {
				//new Option(result[i].type, result[i].id);
				var optionEle1 = "<option value='" + result[i].id + "'>" + result[i].type + "</option>";
				$("#policeTypeId1").append(optionEle1);
				/*$("#policeTypeId").append(optionEle1);*/
			}
		}
	});

	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchAllPolicePosition",

		dataType: "json",

		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(result) {

			for (var i = 0; i < result.length; i++) {
				var optionEle = "<option value='" + result[i].id + "'>" + result[i].position + "</option>";
				$("#policePosition1").append(optionEle);
				/*$("#policePosition").append(optionEle);*/
			}
		}
	});

	//console.log(YZ.ajaxURLms+"api/jp-BIRM-UserProfile-ms/policestations/"+treeNode.id);
	/*$.ajax({
 	type: "get",
 	url: YZ.ajaxURLms+"api/jp-BIRM-UserProfile-ms/policestations/" + treeNode.id,
 	//data: null,
 	dataType: "json",
 	//async: false,
 	headers: {
 		"Content-Type": "application/json;charset=UTF-8"
 	},
 	success: function(data) {
 		console.log(data);
 	}
 });*/

	$.fn.zTree.init($("#tree-dep"), setting, allzNodes);

	var searchText;
	$("#deptSearch").click(function () {
		searchText = $("#searchText").val();
		if (searchText != null && searchText != '') {
			var zNodes;
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/getStationInfoByStationNameLike/" + searchText,
				//data: null,
				dataType: "json",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					var nodes = [];
					for (var i = 0; i < data.length; i++) {
						var node = {
							id: data[i].id,
							name: data[i].stationName,
							pId: data[i].parentId
						};
						nodes.push(node);
					}
					zNodes = nodes;
				}
			});

			$.fn.zTree.init($("#tree-dep"), setting, zNodes);
			searchText = '';
		} else {

			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/getOrgaInfo",
				//data: null,
				dataType: "json",
				//async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					//console.log(data);
					allzNodes = data;
				}
			});
			$.fn.zTree.init($("#tree-dep"), setting, allzNodes);
		}
	});

	//时间控件

	$('#date').datetimepicker({
		minView: "month",
		format: "yyyy-mm-dd",
		autoclose: true
	});

	$('#date1').datetimepicker({
		minView: "month",
		format: "yyyy-mm-dd",
		autoclose: true
	});

	/*var setting = {
 	data: {
 		simpleData: {
 			enable: true
 		}
 	}
 };*/

	/*	$(document).ready(function() {
 		$.fn.zTree.init($("#tree-jy"), setting, zNodes);
 
 	});*/

	// Add responsive to jqGrid
	$(window).bind('resize', function () {
		var width = $('.jqGrid_wrapper').width();
		$('#table_list_1').setGridWidth(width);
	});

	function init3Tree() {

		var myDiv = $(".parent-div-dept");
		$(".stationName").click(function (event) {

			if (!$(this).attr("readonly")) {
				$(myDiv).fadeIn(); //调用显示DIV方法
				$(document).one("click", function () {
					//对document绑定一个影藏Div方法
					$(myDiv).hide();
				});

				event.stopPropagation(); //阻止事件向上冒泡
			}
		});
		$(myDiv).click(function (event) {
			event.stopPropagation(); //阻止事件向上冒泡
		});

		var myDiv2 = $(".parent-div-type");
		$(".policeTypeName").click(function (event) {
			$(myDiv2).fadeIn(); //调用显示DIV方法

			$(document).one("click", function () {
				//对document绑定一个影藏Div方法
				$(myDiv2).hide();
			});

			event.stopPropagation(); //阻止事件向上冒泡
		});
		$(myDiv2).click(function (event) {
			event.stopPropagation(); //阻止事件向上冒泡
		});

		var myDiv1 = $(".parent-div-job");
		$(".policePositionName").click(function (event) {
			$(myDiv1).fadeIn(); //调用显示DIV方法

			$(document).one("click", function () {
				//对document绑定一个影藏Div方法
				$(myDiv1).hide();
			});

			event.stopPropagation(); //阻止事件向上冒泡
		});
		$(myDiv1).click(function (event) {
			event.stopPropagation(); //阻止事件向上冒泡
		});
	}
	init3Tree();
	$("#update-btn").click(function () {

		if (policeJqGridRowData == null || policeJqGridRowData == '') {
			layer.confirm('请指定修改的信息列！', {
				btn: ['是的'] //按钮
			});
			$("#update-btn").attr("data-target", "");
		} else {
			var doUpload = function doUpload() {
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
						var purl = YZ.ajaxURLms + "api/jp-TIFS-FileCenter-ms/file?businessId=" + data.fileID;
						$("#pictureUrl").val(purl);
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
			};

			$("#update-btn").attr("data-target", "#myModal");

			//数据回显过程
			$("#pictureUrl").attr("readonly", "readonly");

			$("#name").val(policeJqGridRowData.name);
			$("#policeCode").val(policeJqGridRowData.policeCode);
			/* console.log(policeJqGridRowData.gender);*/
			if (policeJqGridRowData.gender.match('男')) {
				$("#gender").find("option[value='女']").removeAttr("selected");
				$("#gender").find("option[value='男']").attr("selected", "selected");
				$("#gender").find("option[value='男']").prop("selected", true);
			}
			if (policeJqGridRowData.gender.match('女')) {
				$("#gender").find("option[value='男']").removeAttr("selected");
				$("#gender").find("option[value='女']").attr("selected", "selected");
				$("#gender").find("option[value='女']").prop("selected", true);
			}

			$("#stationId").val(policeJqGridRowData.stationId);
			$("#pictureUrl").val(policeJqGridRowData.pictureUrl);
			$("#telephone").val(policeJqGridRowData.telephone);
			$("#longitude").val(policeJqGridRowData.policeLongitude);
			$("#latitude").val(policeJqGridRowData.policeLatitude);
			$("#status").val(policeJqGridRowData.status);
			if (policeJqGridRowData.status == 1 || policeJqGridRowData.status == '1') {
				$("#status").find("option[value='1']").attr("selected", "selected");
				$("#status").find("option[value='1']").prop("selected", true);
			} else {
				$("#status").find("option[value='0']").attr("selected", "selected");
				$("#status").find("option[value='0']").prop("selected", true);
			}

			$("#policeTypeId").val(policeJqGridRowData.policeTypeId);
			$("#policeTypeName").val(policeJqGridRowData.policeTypeName);
			$("#type").val(policeJqGridRowData.type);

			$("#policePosition").find("option[value='" + policeJqGridRowData.policePosition + "']").attr("selected", "selected");

			$("#policePosition").val(policeJqGridRowData.policePosition);
			$("#policePositionName").val(policeJqGridRowData.policePositionName);
			$("#officeTel").val(policeJqGridRowData.officeTel);
			$("#datetimepicker").val(policeJqGridRowData.birthday);
			$("#sort").val(policeJqGridRowData.sort);
			if (policeJqGridRowData.isDelete == 1 || policeJqGridRowData.isDelete == '1') {
				$("#isDelete1").attr("checked", "checked");
			} else {
				$("#isDelete0").attr("checked", "checked");
			}
			if (policeJqGridRowData.isTestPolice == 1 || policeJqGridRowData.isTestPolice == '1') {
				$("#isTestPolice1").attr("checked", "checked");
			} else {
				$("#isTestPolice0").attr("checked", "checked");
			}
			$(".chosen-select").trigger("chosen:updated");
			var setting1 = {
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					beforeClick: function beforeClick(treeId, treeNode) {

						deptname = treeNode.name;
						$("#stationName").val(deptname);
						$("#stationId").val(treeNode.stationId);
					}
				}
			};

			$.fn.zTree.init($("#tree-parent-dept"), setting1, allzNodes);

			var jobs = [];
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchAllPolicePosition",

				dataType: "json",

				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {

					for (var i = 0; i < data.length; i++) {
						var job = {
							id: data[i].id,
							name: data[i].position
						};
						jobs.push(job);
					}

					var settingjob = {
						data: {
							simpleData: {
								enable: true
							}
						},
						callback: {
							beforeClick: function beforeClick(treeId, treeNode) {
								deptname = treeNode.name;

								$("#policePosition").val(treeNode.id);
								$("#policePositionName").val(treeNode.name);
							}
						}
					};

					$.fn.zTree.init($("#tree-parent-job"), settingjob, jobs);
				}
			});

			var types = [];
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchAllPoliceType",

				dataType: "json",

				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {

					for (var i = 0; i < data.length; i++) {
						var type = {
							id: data[i].id,
							name: data[i].type
						};
						types.push(type);
					}

					var settingtype = {
						data: {
							simpleData: {
								enable: true
							}
						},
						callback: {
							beforeClick: function beforeClick(treeId, treeNode) {
								deptname = treeNode.name;

								$("#policeTypeId").val(treeNode.id);
								$("#policeTypeName").val(treeNode.name);
							}
						}
					};

					$.fn.zTree.init($("#tree-parent-type"), settingtype, types);
				}
			});

			$("#uploadBtn").click(function () {
				doUpload();
			});
		}
	});

	$("#updatePoliceBtn").click(function () {
		$("#update-btn").attr("data-target", "");

		var commentForm = $('#commentForm').serializeJSON();

		if (!commentForm.birthday.match("T00:00:00.0000000+08:00")) {
			commentForm.birthday = commentForm.birthday + "T00:00:00.0000000+08:00";
		}
		if (commentForm.birthday != ' T00:00:00.0000000+08:00') {
			if (commentForm.policeCode != null && commentForm.policeCode != '' && commentForm.name != null && commentForm.name != '' && commentForm.stationId != null && commentForm.stationId != '' && commentForm.telephone != null && commentForm.telephone != '' && commentForm.policeTypeId != null && commentForm.policeTypeId != '' && commentForm.policePosition != null && commentForm.policePosition != '') {

				$.ajax({
					type: "put",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/" + policeJqGridRowData.id,
					data: JSON.stringify(commentForm),
					async: false,
					dataType: "json",
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {

						if (data == 500 || data == '500') {
							layer.msg('修改失败', {
								icon: 1
							});
						} else {
							layer.msg('修改成功', {
								icon: 1
							});

							var param5 = {
								stationId: deptId
							};
							$.ajax({
								type: "post",
								url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchPoliceInfoDetail",
								data: JSON.stringify(param5),
								dataType: "json",

								headers: {
									"Content-Type": "application/json;charset=UTF-8"
								},
								success: function success(json) {
									//mydata=data;

									$("#table_list_1").jqGrid('clearGridData'); //清空表格
									$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
										datatype: 'local',
										data: json, //  newdata 是符合格式要求的需要重新加载的数据 
										page: 1
									}).trigger("reloadGrid");
								}

							});
						}
					},
					error: function error(returndata) {

						layer.confirm('请输入正确的联系电话和生日日期？', {
							btn: ['是的'] //按钮
						}, function () {
							layer.closeAll('dialog');
							$('#myModal').modal('show');
						});
					}
				});
			} else {

				layer.confirm('信息请填写完整？', {
					btn: ['是的'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$('#myModal').modal('show');
				});
			}
		} else {

			layer.confirm('请选择生日日期？', {
				btn: ['是的'] //按钮
			}, function () {
				layer.closeAll('dialog');
				$('#myModal').modal('show');
			});
		}
	});

	//用户模糊查询
	$("#searchUser").click(function () {
		var searchUserText = $("#searchUserText").val();

		if (deptId == null && deptId == '') {
			deptId = '9BECB65D-4E52-4039-993B-369DAA145EAF';
		}

		var param3 = {
			"stationId": deptId,
			"name": searchUserText
		};
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchPoliceInfoDetail/",
			data: JSON.stringify(param3),
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
	});
	$("#delete-btn").click(function () {
		if (policeJqGridRowData == null || policeJqGridRowData == '') {
			layer.confirm('请指定删除的信息列！', {
				btn: ['是的'] //按钮
			});
			//$(this).attr("data-target","");
		} else {
			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				layer.closeAll('dialog');
				$.ajax({
					type: "delete",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/deletePoliceAndUser/" + policeJqGridRowData.id,

					dataType: "text",

					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {
						if (data == 500 || data == '500') {

							layer.msg('删除失败', {
								icon: 1
							});
						} else {
							layer.msg('删除成功', {
								icon: 1
							});

							var param4 = {
								stationId: deptId
							};
							$.ajax({
								type: "post",
								url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchPoliceInfoDetail",
								data: JSON.stringify(param4),
								dataType: "json",

								headers: {
									"Content-Type": "application/json;charset=UTF-8"
								},
								success: function success(json) {
									//mydata=data;

									$("#table_list_1").jqGrid('clearGridData'); //清空表格
									$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
										datatype: 'local',
										data: json, //  newdata 是符合格式要求的需要重新加载的数据 
										page: 1
									}).trigger("reloadGrid");
								}
							});
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
		var excelModalDownloadUrl = YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/bs/batch/getTemplate/carInfo";
		$(location).attr('href', excelModalDownloadUrl);
	});

	//导入
	function doUploadExcel() {
		var formData = new FormData($("#uploadExcel")[0]);

		$.ajax({
			url: YZ.ajaxURLms + 'api/jp-BIRM-UserProfile-ms/bs/batch/policeInfoAndUser',
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function success(data) {
				//					console.log(data);
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
				layer.msg('导入失败', {
					icon: 2
				});
			}
		});
		$('#myModal2').modal('hide');
	}

	$("#uploadExcelBtn").click(function () {
		doUploadExcel();
	});
	$("#add-btn").click(function () {
		//显示弹窗	
		$("#addcommentForm").find("input").val("");

		$(".chosen-select").trigger("chosen:updated");

		var jobs = [];

		var types = [];

		function doUpload() {
			var formData = new FormData($("#uploadForm1")[0]);
			$.ajax({
				url: YZ.ajaxURLms + "zuul/api/jp-TIFS-FileCenter-ms/file",
				type: 'POST',
				data: formData,

				cache: false,
				contentType: false,
				processData: false,
				success: function success(data) {
					var purl = YZ.ajaxURLms + "api/jp-TIFS-FileCenter-ms/file?businessId=" + data.fileID;
					$("#pictureUrl1").val(purl);

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
		$("#uploadBtn1").click(function () {
			doUpload();
		});
	});

	$("#savePoliceBtn").click(function () {
		var flagLoginName;
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/bigUserBigModelByloginName/" + $("#loginName").val(),

			dataType: "json",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				flagLoginName = 'no';
				//	console.log(data);
				/*	if(data == 500 || data == '500') {
    		layer.msg('新增失败', {
    			icon: 1
    		});
    	} else {
    		layer.msg('新增成功', {
    			icon: 1
    		});
    
    	}*/
			},

			error: function error(returndata) {

				if (returndata.responseJSON.errCode == '404') {
					flagLoginName = 'ok';
					console.log('flagLoginName:' + flagLoginName);
				}
			}
		});

		var addcommentForm = $('#addcommentForm').serializeJSON();

		if (flagLoginName == 'ok') {
			if (addcommentForm.username != null && addcommentForm.username != '' && addcommentForm.loginName != null && addcommentForm.loginName != '' && addcommentForm.pwd != null && addcommentForm.pwd != '' && addcommentForm.policeCode != null && addcommentForm.policeCode != '' && addcommentForm.name != null && addcommentForm.name != '' && addcommentForm.stationId != null && addcommentForm.stationId != '' && addcommentForm.telephone != null && addcommentForm.telephone != '' && addcommentForm.policeTypeId != null && addcommentForm.policeTypeId != '' && addcommentForm.policePosition != null && addcommentForm.policePosition != '') {

				$.ajax({
					type: "post",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/insertPoliceInfoAndUser",
					data: JSON.stringify($('#addcommentForm').serializeJSON()),
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
						} else {
							layer.msg('新增成功', {
								icon: 1
							});

							var param7 = {
								stationId: $('#addcommentForm').serializeJSON().stationId
							};
							$.ajax({
								type: "post",
								url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/polices/fetchPoliceInfoDetail",
								data: JSON.stringify(param7),
								dataType: "json",

								headers: {
									"Content-Type": "application/json;charset=UTF-8"
								},
								success: function success(json) {

									$("#table_list_1").jqGrid('clearGridData'); //清空表格
									$("#table_list_1").jqGrid('setGridParam', { // 重新加载数据
										datatype: 'local',
										data: json, //  newdata 是符合格式要求的需要重新加载的数据 
										page: 1
									}).trigger("reloadGrid");
								}
							});
						}
					},
					error: function error(returndata) {

						layer.msg('新增失败', {
							icon: 1
						});
						$('#myModalInsert').modal('show');
					}
				});
			} else {

				layer.confirm('信息请填写完整？', {
					btn: ['是的'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$('#myModalInsert').modal('show');
				});
			}
		} else {
			layer.confirm('账号已经存在', {
				btn: ['是的'] //按钮
			}, function () {
				layer.closeAll('dialog');
				$('#myModal').modal('show');
			});
		}
	});
});