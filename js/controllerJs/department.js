$(document).ready(function () {

	var deptMsg;
	var setting = {
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: ""
			}
		},
		callback: {
			beforeClick: function beforeClick(treeId, treeNode) {
				$.ajax({
					type: "get",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/" + treeNode.id,
					//data: null,
					dataType: "json",
					//async: false,
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {
						//console.log(data);
						deptMsg = data;

						if (data.parentId != null) {
							$.ajax({
								type: "get",
								url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/" + data.parentId,
								//data: null,
								dataType: "json",
								//async: false,
								headers: {
									"Content-Type": "application/json;charset=UTF-8"
								},
								success: function success(json) {
									//console.log(data);
									parentStationName = json.stationName;
									$("#parentStationName").val(parentStationName);
								}
							});
						}

						$("#jlqk").popover({
							placement: 'left'
						});
						$("#address").popover({
							placement: 'left'
						});
						$("#glxq").popover({
							placement: 'left'
						});
						$("#rkqk").popover({
							placement: 'left'
						});
						$("#sqzrq").popover({
							placement: 'left'
						});
						$("#zdbw").popover({
							placement: 'left'
						});
						$("#zdjq").popover({
							placement: 'left'
						});

						$("#commentForm").find("input").val("");

						$("#stationName").val(data.stationName);
						$("#parentId").val(data.parentId);
						$("#address").val(data.address);
						$("#address").attr("data-content", data.address);
						$("#baseNum").val(data.baseNum);
						$("#carCount").val(data.carCount);
						$("#coverRange").val(data.coverRange);
						$("#glxq").val(data.glxq);
						$("#glxq").attr("data-content", data.glxq);
						if (data.ifUse == 1 || data.ifUse == '1') {
							$("#ifUse1").attr("checked", "checked");
							$("#ifUse1").prop("checked", true);
						} else {
							$("#ifUse0").attr("checked", "checked");
							$("#ifUse0").prop("checked", true);
						}
						//$("#ifUse").val(data.ifUse);
						$("#ipAddress").val(data.ipAddress);

						if (data.isZsjg == 1 || data.isZsjg == '1') {
							$("#isZsjg1").attr("checked", "checked");
							$("#isZsjg1").prop("checked", true);
						} else {
							$("#isZsjg0").attr("checked", "checked");
							$("#isZsjg0").prop("checked", true);
						}
						//$("#isZsjg").val(data.isZsjg);

						if (data.isCzs == 1 || data.isCzs == '1') {
							$("#isCzs1").attr("checked", "checked");
							$("#isCzs1").prop("checked", true);
						} else {
							$("#isCzs0").attr("checked", "checked");
							$("#isCzs0").prop("checked", true);
						}
						//$("#isCzs").val(data.isCzs);

						$("#jlqk").val(data.jlqk);
						$("#jlqk").attr("data-content", data.jlqk);
						$("#latitude").val(data.latitude);
						$("#longitude").val(data.longitude);
						$("#orgcode").val(data.orgcode);
						$("#pictureUrl").val(data.pictureUrl);
						$("#rkqk").val(data.rkqk);
						$("#rkqk").attr("data-content", data.rkqk);
						$("#sort").val(data.sort);
						$("#sqzrq").val(data.sqzrq);
						$("#sqzrq").attr("data-content", data.sqzrq);
						$("#stationNum").val(data.stationNum);
						$("#tel").val(data.tel);
						$("#unitNumber").val(data.unitNumber);
						$("#zdbw").val(data.zdbw);
						$("#zdbw").attr("data-content", data.zdbw);
						$("#zdjq").val(data.zdjq);
						$("#zdjq").attr("data-content", data.zdjq);

						$("#commentForm").find("input").attr('readonly', 'readonly');
						$("#deptMsgUpdate").attr("disabled", 'disabled');
						$("#deptMsgSave").attr("disabled", 'disabled');
						$("#cancel1").attr("disabled", 'disabled');
						$("#cancel").attr("disabled", 'disabled');
						$("#uploadBtn").attr("disabled", 'disabled');
						$("#isCzs1").attr("disabled", 'disabled');
						$("#isCzs0").attr("disabled", 'disabled');
						$("#isZsjg1").attr("disabled", 'disabled');
						$("#isZsjg0").attr("disabled", 'disabled');
						$("#ifUse1").attr("disabled", 'disabled');
						$("#ifUse0").attr("disabled", 'disabled');
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
		}
	});

	$.fn.zTree.init($("#tree-dep"), setting, allzNodes);

	var searchText;

	function initDeptHtml() {
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
				$.fn.zTree.init($("#tree-dep"), setting, allzNodes);
			}
		});

		$("#commentForm").find("input").val("");
		$("#commentForm").find("input").attr('readonly', 'readonly');
		$("#deptMsgSave").attr("disabled", 'disabled');
		$("#cancel").attr("disabled", 'disabled');
		$("#uploadBtn").attr("disabled", 'disabled');

		$("#glxq").attr("data-content", "空空如也");
		$("#jlqk").attr("data-content", "空空如也");
		$("#address").attr("data-content", "空空如也");
		$("#rkqk").attr("data-content", "空空如也");
		$("#sqzrq").attr("data-content", "空空如也");
		$("#zdbw").attr("data-content", "空空如也");
		$("#zdjq").attr("data-content", "空空如也");

		$('#glxq').popover('hide');
		$('#jlqk').popover('hide');
		$('#address').popover('hide');
		$('#rkqk').popover('hide');
		$('#sqzrq').popover('hide');
		$('#zdbw').popover('hide');
		$('#zdjq').popover('hide');
	}

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
					$.fn.zTree.init($("#tree-dep"), setting, zNodes);
				}
			});

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
					$.fn.zTree.init($("#tree-dep"), setting, allzNodes);
				}
			});
		}
	});
	$("#cancel").click(function () {
		initDeptHtml();
	});

	$("#cancel1").click(function () {
		var data = deptMsg;
		if (deptMsg.parentId != null) {
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/" + data.parentId,
				//data: null,
				dataType: "json",
				//async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(json) {
					//console.log(data);
					parentStationName = json.stationName;
					$("#parentStationName").val(parentStationName);
				}
			});
		}

		$("#jlqk").popover({
			placement: 'left'
		});
		$("#address").popover({
			placement: 'left'
		});
		$("#glxq").popover({
			placement: 'left'
		});
		$("#rkqk").popover({
			placement: 'left'
		});
		$("#sqzrq").popover({
			placement: 'left'
		});
		$("#zdbw").popover({
			placement: 'left'
		});
		$("#zdjq").popover({
			placement: 'left'
		});

		$("#stationName").val(data.stationName);
		$("#parentId").val(data.parentId);
		$("#address").val(data.address);
		$("#address").attr("data-content", data.address);
		$("#baseNum").val(data.baseNum);
		$("#carCount").val(data.carCount);
		$("#coverRange").val(data.coverRange);
		$("#glxq").val(data.glxq);
		$("#glxq").attr("data-content", data.glxq);
		if (data.ifUse == 1 || data.ifUse == '1') {
			$("#ifUse1").attr("checked", "checked");
		} else {
			$("#ifUse0").attr("checked", "checked");
		}
		//$("#ifUse").val(data.ifUse);
		$("#ipAddress").val(data.ipAddress);

		if (data.isZsjg == 1 || data.isZsjg == '1') {
			$("#isZsjg1").attr("checked", "checked");
		} else {
			$("#isZsjg0").attr("checked", "checked");
		}
		//$("#isZsjg").val(data.isZsjg);

		if (data.isCzs == 1 || data.isCzs == '1') {
			$("#isCzs1").attr("checked", "checked");
		} else {
			$("#isCzs0").attr("checked", "checked");
		}
		//$("#isCzs").val(data.isCzs);

		$("#jlqk").val(data.jlqk);
		$("#jlqk").attr("data-content", data.jlqk);
		$("#latitude").val(data.latitude);
		$("#longitude").val(data.longitude);
		$("#orgcode").val(data.orgcode);
		$("#pictureUrl").val(data.pictureUrl);
		$("#rkqk").val(data.rkqk);
		$("#rkqk").attr("data-content", data.rkqk);
		$("#sort").val(data.sort);
		$("#sqzrq").val(data.sqzrq);
		$("#sqzrq").attr("data-content", data.sqzrq);
		$("#stationNum").val(data.stationNum);
		$("#tel").val(data.tel);
		$("#unitNumber").val(data.unitNumber);
		$("#zdbw").val(data.zdbw);
		$("#zdbw").attr("data-content", data.zdbw);
		$("#zdjq").val(data.zdjq);
		$("#zdjq").attr("data-content", data.zdjq);

		$("#commentForm").find("input").attr('readonly', 'readonly');
		$("#deptMsgUpdate").attr("disabled", 'disabled');
		$("#deptMsgSave").attr("disabled", 'disabled');
		$("#cancel1").attr("disabled", 'disabled');
		$("#cancel").attr("disabled", 'disabled');
		$("#uploadBtn").attr("disabled", 'disabled');
		$("#isCzs1").attr("disabled", 'disabled');
		$("#isCzs0").attr("disabled", 'disabled');
		$("#isZsjg1").attr("disabled", 'disabled');
		$("#isZsjg0").attr("disabled", 'disabled');
		$("#ifUse1").attr("disabled", 'disabled');
		$("#ifUse0").attr("disabled", 'disabled');
	});

	$("#delete-btn").click(function () {
		if (deptMsg == null || deptMsg == '') {
			layer.confirm('请选择删除的部门！', {
				btn: ['是的'] //按钮
			});
		} else {
			//$(this).attr("data-target","");

			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				//delete
				$.ajax({
					type: "delete",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/" + deptMsg.id,

					dataType: "text",
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success(data) {

						if (data == 500 || data == '500') {
							layer.confirm('删除失败！', {
								btn: ['是的'] //按钮
							});
						} else {
							layer.msg('删除成功', {
								icon: 1
							});

							initDeptHtml();
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
	$('#date').datepicker();

	//点击父部门展开树菜单

	/**/

	$("#update-btn").click(function () {
		$("#addBtnDiv").hide();
		$("#updateBtnDiv").show();
		$("#commentForm").find("input").removeAttr("readonly");
		$("#deptMsgUpdate").removeAttr("disabled");

		$("#cancel1").removeAttr("disabled");
		$("#uploadBtn").removeAttr("disabled");
		$("#commentForm").find("input").removeAttr("disabled");
		$("#ipAddress").attr("placeholder", "必填格式：196.168.0.1");
		$("#tel").attr("placeholder", "必填格式:15812345678");
		$("#address").attr("placeholder", "必填项");
		$("#stationNum").attr("placeholder", "必填项(最大长度20)");
		$("#unitNumber").attr("placeholder", "必填项(最大长度6)");
		$("#orgcode").attr("placeholder", "必填项(最大长度15)");
		$("#parentStationName").attr("placeholder", "必填项");
		$("#stationName").attr("placeholder", "必填项");
		$("#carCount").attr("placeholder", "必填项(最大值为99)");

		$("#pictureUrl").attr("readonly", "readonly");

		if (deptMsg == null || deptMsg == '') {
			layer.confirm('请选择修改的部门！', {
				btn: ['是的'] //按钮
			});
			initDeptHtml();
		} else {
			var showDiv = function showDiv() {
				$(myDiv).fadeIn();
			};

			var doUpload = function doUpload() {
				var formData = new FormData($("#uploadForm")[0]);
				$.ajax({
					url: YZ.ajaxURLms + "api/jp-TIFS-FileCenter-ms/file",
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

			var setting = {
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					beforeClick: function beforeClick(treeId, treeNode) {
						$("#parentId").val(treeNode.id);
						$("#parentStationName").val(treeNode.name);
					}
				}
			};
			var zNodes;

			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/FatherStationInfoById/" + deptMsg.id,
				dataType: "json",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					if (data != null || data != '') {

						var Nodes = [];
						for (var i = 0; i < data.length; i++) {
							var node = {
								id: data[i].id,
								name: data[i].stationName
							};
							Nodes.push(node);
						}
						zNodes = Nodes;
					}
				}
			});

			$.fn.zTree.init($("#tree-parent"), setting, zNodes);

			var myDiv = $(".parent-div");

			$("#parentStationName").click(function (event) {
				if (!$(this).attr("readonly")) {
					showDiv(); //调用显示DIV方法
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

			$("#uploadBtn").click(function () {
				doUpload();
			});
		}
	});

	//修改
	$("#deptMsgUpdate").click(function () {

		var commentForm = $('#commentForm').serializeJSON();
		if (commentForm.unitNumber.length <= 6 && commentForm.orgcode.length <= 15 && commentForm.stationNum.length <= 20) {

			if (commentForm.ipAddress != null && commentForm.ipAddress != '' && commentForm.tel != null && commentForm.tel != '' && commentForm.address != null && commentForm.address != '' && commentForm.stationNum != null && commentForm.stationNum != '' && commentForm.parentStationName != null && commentForm.parentStationName != '' && commentForm.stationName != null && commentForm.stationName != '' && commentForm.orgcode != null && commentForm.orgcode != '' && commentForm.unitNumber != null && commentForm.unitNumber != '') {
				$.ajax({
					type: "put",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/" + deptMsg.id,
					data: JSON.stringify($('#commentForm').serializeJSON()),
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
							initDeptHtml();
						}
					},
					error: function error(returndata) {

						layer.confirm('请输入正确的ip和电话格式！', {
							btn: ['是的'] //按钮
						});
					}
				});
			} else {
				layer.confirm('信息请填写完整！', {
					btn: ['是的'] //按钮
				});
			}
		} else {
			layer.confirm('请在对应字段里输入合理的长度！', {
				btn: ['是的'] //按钮
			});
		}
	});

	$("#add-btn").click(function () {
		$("#addBtnDiv").show();
		$("#updateBtnDiv").hide();
		$("#commentForm").find("input").removeAttr("readonly");
		$("#commentForm").find("input").val("");
		$("#commentForm").find("input").removeAttr("disabled");
		$("#deptMsgSave").removeAttr("disabled");
		$("#uploadBtn").removeAttr("disabled");
		$("#cancel").removeAttr("disabled");
		$("#ipAddress").attr("placeholder", "必填格式：196.168.0.1");
		$("#tel").attr("placeholder", "必填格式:15812345678");
		$("#address").attr("placeholder", "必填项");
		$("#stationNum").attr("placeholder", "必填项(最大长度20)");
		$("#unitNumber").attr("placeholder", "必填项(最大长度6)");
		$("#orgcode").attr("placeholder", "必填项(最大长度15)");
		$("#parentStationName").attr("placeholder", "必填项");
		$("#stationName").attr("placeholder", "必填项");
		$("#carCount").attr("placeholder", "必填项(最大值为99)");

		$("#pictureUrl").attr("readonly", "readonly");

		var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeClick: function beforeClick(treeId, treeNode) {
					$("#parentId").val(treeNode.id);
					$("#parentStationName").val(treeNode.name);
				}
			}
		};
		var zNodes;

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

				zNodes = data;
			}
		});

		$.fn.zTree.init($("#tree-parent"), setting, zNodes);

		var myDiv = $(".parent-div");

		$("#parentStationName").click(function (event) {
			if (!$(this).attr("readonly")) {
				showDiv(); //调用显示DIV方法
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

		function showDiv() {
			$(myDiv).fadeIn();
		}

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
		}
		$("#uploadBtn").click(function () {
			doUpload();
		});
	});

	//add
	$("#deptMsgSave").click(function () {
		var commentForm = $('#commentForm').serializeJSON();

		if (commentForm.unitNumber.length <= 6 && commentForm.orgcode.length <= 15 && commentForm.stationNum.length <= 20 && commentForm.carCount < 99) {
			if (commentForm.ipAddress != null && commentForm.ipAddress != '' && commentForm.tel != null && commentForm.tel != '' && commentForm.address != null && commentForm.address != '' && commentForm.stationNum != null && commentForm.stationNum != '' && commentForm.parentStationName != null && commentForm.parentStationName != '' && commentForm.stationName != null && commentForm.stationName != '' && commentForm.orgcode != null && commentForm.orgcode != '' && commentForm.unitNumber != null && commentForm.unitNumber != '') {
				console.log(JSON.stringify($('#commentForm').serializeJSON()));
				$.ajax({
					type: "post",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/",
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
						} else {
							layer.msg('新增成功', {
								icon: 1
							});
							initDeptHtml();
						}
					},
					error: function error(returndata) {
						layer.confirm('请输入正确的ip和电话格式！', {
							btn: ['是的'] //按钮
						});
					}
				});
			} else {

				layer.confirm('信息请填写完整！', {
					btn: ['是的'] //按钮
				});
			}
		} else {
			layer.confirm('请在对应字段里输入合理的长度！', {
				btn: ['是的'] //按钮
			});
		}
	});
});