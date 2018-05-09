$(document).ready(function () {

	$.jgrid.defaults.styleUI = 'Bootstrap';
	$('#date1').datetimepicker({

		format: "yyyy-mm-dd",
		autoclose: true
	});

	$(".chosen-select").chosen();

	//树结构节点nodes
	// var treeViewNodeData;
	var roles = [];
	var roleIds = [];
	var mydata;
	var deptname;

	var deptId;
	var deptno;
	var setting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: function beforeClick(treeId, treeNode) {
				deptname = treeNode.name;
				deptId = treeNode.id;
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/fetchPoliceInfoLike/" + treeNode.id,
					//data: null,
					dataType: "json",
					//async: false,
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
				//deptno=treeNode.id;
				//console.log(treeNode.id + "  " + treeNode.name);
			}
		}
	};

	var allzNodes;

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
				var ele = new Option(data[i].name, data[i].id);
				$("#stationId1").append(ele);
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
	var userJqGridRowData;
	// Configuration for jqGrid Example 1
	//9BECB65D-4E52-4039-993B-369DAA145EAF

	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/fetchPoliceInfoLike/9BECB65D-4E52-4039-993B-369DAA145EAF",
		//data: null,
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			mydata = data;
		}
	});

	$("#table_list_1").jqGrid({
		data: mydata,
		datatype: "local",
		height: 530,
		autowidth: true,
		shrinkToFit: true,
		rowNum: 14,
		//rownumbers: true,
		rowList: [10, 20, 30],
		colNames: ['序号', '用户名', '账号', '密码', '状态', '修改时间', '创建时间'],
		colModel: [{
			name: 'id',
			index: 'id',

			hidden: true
		}, {
			name: 'username',
			index: 'username',
			width: 90

		}, {
			name: 'loginName',
			index: 'loginName',
			width: 100
		}, {
			name: 'pwd',
			index: 'pwd',
			width: 80

		}, {
			name: 'state',
			index: 'state',
			width: 80

		}, {
			name: 'changeTime',
			index: 'changeTime',
			width: 80,
			align: "left",
			sorttype: "float",
			formatter: "date"
		}, {
			name: 'createTime',
			index: 'createTime',
			width: 80,
			sortable: false,
			formatter: "date"
		}],
		pager: "#pager_list_1",

		viewrecords: true,
		caption: "",
		hidegrid: false,
		onSelectRow: function onSelectRow(rowId, status) {
			userJqGridRowData = $("#table_list_1").jqGrid("getRowData", rowId);
			//console.log(userJqGridRowData);
		},
		onPaging: function onPaging(pageBtn) {
			var re_page = $('#table_list_1').getGridParam('page'); //获取返回的当前页          
			var re_total = $('#table_list_1').getGridParam('lastpage'); //获取总页数  

			//console.log("总页数："+re_total);

			if (pageBtn == "next") {
				// console.log("当前页："+(re_page+1));
			}
			if (pageBtn == "prev") {
				// console.log("当前页："+(re_page-1));
			}
			if (pageBtn == "first") {
				//  console.log("当前页："+"1");
			}
			if (pageBtn == "last") {
				// console.log("当前页："+re_total);  
			}
			if (pageBtn == "user") {
				var page = $(".ui-pg-input").val();
				//  console.log("当前页："+page);
			}
		}
	});
	$("#table_list_1").setSelection(1, true);

	// Add responsive to jqGrid
	$(window).bind('resize', function () {
		var width = $('.jqGrid_wrapper').width();
		$('#table_list_1').setGridWidth(width);
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

	$("#searchUser").click(function () {
		var searchUserText = $("#searchUserText").val();

		if (deptId == null || deptId == '') {
			deptId = '1';
		}

		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/fetchPoliceInfoLike/" + deptId,
			data: {
				userName: searchUserText
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
	});

	$("#update-btn").click(function () {

		if (userJqGridRowData == null || userJqGridRowData == '') {
			layer.confirm('请指定修改的信息列！', {
				btn: ['是的'] //按钮
			});
			$("#update-btn").attr("data-target", "");
		} else {
			$("#update-btn").attr("data-target", "#myModalUpdate");
			//数据回显过程

			$("#username").val(userJqGridRowData.username);
			$("#loginName").val(userJqGridRowData.loginName);

			$("#pwd").val(userJqGridRowData.pwd);

			if (userJqGridRowData.state == 1 || userJqGridRowData.state == '1') {
				$("#state").find("option[value='1']").attr("selected", "selected");
				$("#state").find("option[value='1']").prop("selected", true);
			} else {
				$("#state").find("option[value='0']").attr("selected", "selected");
				$("#state").find("option[value='0']").prop("selected", true);
			}
		}
	});

	$("#updateUserBtn").click(function () {
		$("#update-btn").attr("data-target", "");
		var commentFormUpdate = $('#commentFormUpdate').serializeJSON();

		if (commentFormUpdate.username != null && commentFormUpdate.username != '' && commentFormUpdate.loginName != null && commentFormUpdate.loginName != '' && commentFormUpdate.pwd != null && commentFormUpdate.pwd != '') {
			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/" + userJqGridRowData.id,
				data: JSON.stringify($('#commentFormUpdate').serializeJSON()),
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
						$.ajax({
							type: "get",
							url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/fetchPoliceInfoLike/" + deptId,

							dataType: "json",
							//async: false,
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
								userJqGridRowData = null;
							}

						});
					}
				},
				error: function error(returndata) {

					layer.msg('修改失败', {
						icon: 1
					});
					$('#myModalUpdate').modal('show');
				}

			});
		} else {
			layer.confirm('信息请填写完整？', {
				btn: ['是的'] //按钮
			}, function () {
				layer.closeAll('dialog');
				$('#myModalUpdate').modal('show');
			});
		}
	});

	$("#delete-btn").click(function () {
		if (userJqGridRowData == null || userJqGridRowData == '') {
			layer.confirm('请指定删除的信息列！', {
				btn: ['是的'] //按钮
			});
		} else {
			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				layer.closeAll('dialog');
				$.ajax({
					type: "delete",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/deletePoliceInfoAndUser/" + userJqGridRowData.id,
					dataType: "text",
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {
						if (data == 500 && data == '500') {

							layer.msg('删除失败', {
								icon: 1
							});
						} else {
							layer.msg('删除成功', {
								icon: 1
							});
							$.ajax({
								type: "get",
								url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/fetchPoliceInfoLike/" + deptId,
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

	$("#deleteRole").click(function () {
		if (userJqGridRowData == null || userJqGridRowData == '') {
			layer.confirm('请指定的信息列！', {
				btn: ['是的'] //按钮
			});
			$("#deleteRole").attr("data-target", "");
		} else {
			var zTreeOnCheck = function zTreeOnCheck(event, treeId, treeNode) {

				refreshLayers();
				clearCheckedOldNodes();
			};

			var setCheck = function setCheck() {
				var zTree = $.fn.zTree.getZTreeObj("treeDemoDeleteRole"),
				    py = $("#py").attr("checked") ? "p" : "",
				    sy = $("#sy").attr("checked") ? "s" : "",
				    pn = $("#pn").attr("checked") ? "p" : "",
				    sn = $("#sn").attr("checked") ? "s" : "",
				    type = {
					"Y": py + sy,
					"N": pn + sn
				};
				zTree.setting.check.chkboxType = type;
				showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
			};

			var showCode = function showCode(str) {
				if (!code) code = $("#code");
				code.empty();
				code.append("<li>" + str + "</li>");
			};

			var code;
			var changedNodes;
			$("#deleteRole").attr("data-target", "#myModalDeleteRole");

			;

			var layers;

			var rolesByUser = [];
			var roleDeleteIds = [];

			//查询用户下的所有角色
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/fetchByUserId/" + userJqGridRowData.id,

				dataType: "json",

				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {

					for (var i = 0; i < data.length; i++) {
						var role = {
							id: data[i].id,
							name: data[i].name,
							pId: 0
						};
						rolesByUser.push(role);
					}

					var settingRole = {
						check: {
							enable: true
						},
						callback: {
							onCheck: function onCheck(event, treeId, treeNode) {

								roleDeleteIds.push(treeNode.id);
								var zTree = $.fn.zTree.getZTreeObj("treeDemoDeleteRole");
								changedNodes = zTree.getChangeCheckedNodes();
							}
						},
						data: {
							simpleData: {
								enable: true
							}
						}
					};

					$.fn.zTree.init($("#treeDemoDeleteRole"), settingRole, rolesByUser);
					setCheck();
					$("#py").bind("change", setCheck);
					$("#sy").bind("change", setCheck);
					$("#pn").bind("change", setCheck);
					$("#sn").bind("change", setCheck);
				}
			});

			//delete角色授权

			$("#roleDeleteBtn").click(function () {

				$.ajax({
					type: "put",

					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/revokeUserRole/" + userJqGridRowData.id + "?" + "roleIds=" + roleDeleteIds,

					dataType: "json",

					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {
						if (data == 500 || data == '500') {
							layer.confirm('删除授权失败！', {
								btn: ['是的'] //按钮
							});
						} else {
							layer.msg('删除授权成功!', {
								icon: 1
							});
						}
					},
					error: function error(returndata) {

						layer.confirm('删除授权失败！', {
							btn: ['是的'] //按钮
						});
					}
				});
			});
		}
	});

	$("#js-sq").click(function () {
		if (userJqGridRowData == null || userJqGridRowData == '') {
			layer.confirm('请指定的信息列！', {
				btn: ['是的'] //按钮
			});
			$("#js-sq").attr("data-target", "");
		} else {
			$("#js-sq").attr("data-target", "#myModal1");
			var code;
			var changedNodes;
			var layers;
			roles = [];
			roleIds = [];
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/roles/",

				dataType: "json",

				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {

					for (var i = 0; i < data.length; i++) {
						var role = {
							id: data[i].id,
							name: data[i].name,
							pId: 0
						};
						roles.push(role);
					}

					var setting = {
						check: {
							enable: true
						},
						callback: {
							onCheck: function onCheck(event, treeId, treeNode) {

								roleIds.push(treeNode.id);
								//	console.log(treeNode.id)
								var zTree = $.fn.zTree.getZTreeObj("treeDemo");
								//	changedNodes = zTree.getChangeCheckedNodes();
							}
						},
						data: {
							simpleData: {
								enable: true
							}
						}
					};

					$.fn.zTree.init($("#treeDemo"), setting, roles);
				}
			});
		}
	});

	//角色授权

	$("#roleUpdateBtn").click(function () {
		$("#js-sq").attr("data-target", "");
		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/giveUserRole/" + userJqGridRowData.id + "?" + "roleIds=" + roleIds,

			dataType: "text",

			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {
				if (data == 500 || data == '500') {
					layer.confirm('授权失败！', {
						btn: ['是的'] //按钮
					});
				} else {
					layer.msg('授权成功!', {
						icon: 1
					});
				}
			},
			error: function error(returndata) {
				console.log(returndata);
				layer.confirm('授权失败！', {
					btn: ['是的'] //按钮
				});
			}
		});
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
			}
			$(".chosen-select").trigger("chosen:updated");
		}
	});

	//模板下载
	$("#download-modalExcel").click(function () {
		var excelModalDownloadUrl = YZ.ajaxURLms + 'api/jp-BIRM-UserProfile-ms/bs/batch/getTemplate/carInfo';
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
				//					debugger;
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
		$(this).attr("data-target", "#myModal");

		$(".chosen-select").trigger("chosen:updated");

		var jobs = [];
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
				}
				$(".chosen-select").trigger("chosen:updated");
			}
		});

		var types = [];
		//警员类型

		function doUpload() {
			var formData = new FormData($("#uploadForm1")[0]);
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
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/bigUserBigModelByloginName/" + $("#loginName1").val(),

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

			if (addcommentForm.username != null && addcommentForm.username != '' && addcommentForm.loginName != null && addcommentForm.loginName != '' && addcommentForm.pwd != null && addcommentForm.pwd != '' && addcommentForm.policeCode != null && addcommentForm.policeCode != '' && addcommentForm.name != null && addcommentForm.name != '' && addcommentForm.stationId != null && addcommentForm.stationId != '' && addcommentForm.policeTypeId != null && addcommentForm.policeTypeId != '' && addcommentForm.policePosition != null && addcommentForm.policePosition != '') {
				//if(addcommentForm.telephone.length==11){
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
							$.ajax({
								type: "get",
								url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/users/fetchPoliceInfoLike/" + $('#addcommentForm').serializeJSON().stationId,

								dataType: "json",
								//async: false,
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
					},

					error: function error(returndata) {

						layer.msg('新增失败', {
							icon: 1
						});
						$('#myModal').modal('show');
					}
				});
				/*	}else{
    	layer.confirm('请填写正确的电话号码？', {
    	btn: ['是的'] //按钮
    }, function() {
    	layer.closeAll('dialog');
    	$('#myModal').modal('show');
    	});
    
    
    }*/
			} else {
				layer.confirm('信息请填写完整？', {
					btn: ['是的'] //按钮
				}, function () {
					layer.closeAll('dialog');
					$('#myModal').modal('show');
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

	$(".chosen-select").chosen();

	//点击父级展开树菜单

	var myDiv = $(".parent-div");
	$("#unit").click(function (event) {
		showDiv(); //调用显示DIV方法

		$(document).one("click", function () {
			//对document绑定一个影藏Div方法
			$(myDiv).hide();
		});

		event.stopPropagation(); //阻止事件向上冒泡
	});
	$(myDiv).click(function (event) {
		event.stopPropagation(); //阻止事件向上冒泡
	});

	function showDiv() {
		$(myDiv).fadeIn();
	}
});