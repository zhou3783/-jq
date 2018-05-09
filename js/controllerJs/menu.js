var zNodes = [];
var zTreeSelectid;
var zTreeSelect;
var updataoradd;
var dataprifuc;
var photourl = null;
$(document).ready(function () {
	function zTreeOnClick(event, treeId, treeNode) {
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/?id=" + treeNode.id,
			async: false,
			success: function success(data) {
				//				console.log(data);
				//数据回显示
				//				console.log(treeNode);
				zTreeSelectid = treeNode.id;
				zTreeSelect = treeNode;
				$("#cdname").val(data[0].name);
				$("#cddisplayname").val(data[0].displayname);
				$("#cduri").val(data[0].uri);
				$("#cdtarget").val(data[0].target);
				$("#cdsort").val(data[0].sort);
				$("#cdremark").val(data[0].remark);
				$("#cdimage").val(data[0].image);
				if (data["0"].parentPrivilegeFunction != null) {
					dataprifuc = data["0"].parentPrivilegeFunction;
					$("#xzfcd").find('option[value=' + data["0"].parentPrivilegeFunction.id + ']').attr("selected", true);
				}
				$(".chosen-select").trigger("chosen:updated");
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
			onClick: zTreeOnClick
		}
	};

	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/",
		//			data: JSON.stringify(datajson),
		dataType: "json",
		async: false,
		//ContentType: "application/json;charset=UTF-8",
		//contentType: "application/json",
		//			<!-- //crossDomain:true, -->
		//			headers:{
		//				"Content-Type":"application/json;charset=UTF-8"
		//			},
		success: function success(data) {
			//			console.log(data);
			for (var i = 0; i < data.length; i++) {
				var o = new Object();
				o.id = data[i]["id"];
				o.name = data[i]["name"];
				if (data[i]["parentPrivilegeFunction"] == null) {
					o.pId = "";
				} else {
					o.pId = data[i]["parentPrivilegeFunction"]["id"];
				}
				zNodes.push(o);
			}
			//			console.log(zNodes);
			//			$.fn.zTree.init($("#tree-menu"), setting, zNodes);
			//			$.fn.zTree.init($("#tree-parent"), setting, zNodes);
			//			$("#xzfcd_chosen").addClass("chosen-disabled");
		}
	});
	//		var zNodes =[
	//			{ id:1, pId:0, name:"父节点1 - 展开", open:true},
	//			{ id:11, pId:1, name:"父节点11 - 折叠"},
	//			{ id:111, pId:11, name:"叶子节点111"},
	//			{ id:112, pId:11, name:"叶子节点112"},
	//			{ id:113, pId:11, name:"叶子节点113"},
	//			{ id:114, pId:11, name:"叶子节点114"},
	//			{ id:12, pId:1, name:"父节点12 - 折叠"},
	//			{ id:121, pId:12, name:"叶子节点121"},
	//			{ id:122, pId:12, name:"叶子节点122"},
	//			{ id:123, pId:12, name:"叶子节点123"},
	//			{ id:124, pId:12, name:"叶子节点124"},
	//			{ id:13, pId:1, name:"父节点13 - 没有子节点", isParent:true},
	//			{ id:2, pId:0, name:"父节点2 - 折叠"},
	//			{ id:21, pId:2, name:"父节点21 - 展开", open:true},
	//			{ id:211, pId:21, name:"叶子节点211"},
	//			{ id:212, pId:21, name:"叶子节点212"},
	//			{ id:213, pId:21, name:"叶子节点213"},
	//			{ id:214, pId:21, name:"叶子节点214"},
	//			{ id:22, pId:2, name:"父节点22 - 折叠"},
	//			{ id:221, pId:22, name:"叶子节点221"},
	//			{ id:222, pId:22, name:"叶子节点222"},
	//			{ id:223, pId:22, name:"叶子节点223"},
	//			{ id:224, pId:22, name:"叶子节点224"},
	//			{ id:23, pId:2, name:"父节点23 - 折叠"},
	//			{ id:231, pId:23, name:"叶子节点231"},
	//			{ id:232, pId:23, name:"叶子节点232"},
	//			{ id:233, pId:23, name:"叶子节点233"},
	//			{ id:234, pId:23, name:"叶子节点234"},
	//			{ id:3, pId:0, name:"父节点3 - 没有子节点", isParent:true}
	//		];

	$(document).ready(function () {

		$.fn.zTree.init($("#tree-menu"), setting, zNodes);
		//		$.fn.zTree.init($("#tree-parent"), setting, zNodes);
		$("#xzfcd_chosen").addClass("chosen-disabled");
		var cdselect = $("#xzfcd"); //获取list对象
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/",
			async: false,
			success: function success(result) {
				//				console.log(result);
				for (var i = 0; i < result.length; i++) {
					var o = new Option(result[i].name, result[i].id);
					cdselect.append(o);
				}
			}
		});
		$(".chosen-select").chosen();
		$("#xzfcd_chosen").addClass("chosen-disabled");
	});

	$("#update-btn").click(function () {
		if ($("#cdname").val() + $("#cddisplayname").val() + $("#cduri").val() + $("#cdtarget").val() + $("#cdsort").val() + $("#cdremark").val() != "") {
			updataoradd = 'updata';
			$("#file").removeAttr("disabled");
			$("#xzfcd").removeAttr("disabled");
			$("#xzfcd").trigger("chosen:updated");
			$("#btnbc").removeAttr("disabled");
			$("#btnqx").removeAttr("disabled");
			$("#commentForm").find("input").removeAttr("readonly");
			$("#commentForm").find("textarea").removeAttr("readonly");
			$("#xzfcd_chosen").removeClass("chosen-disabled");
			$("#btnupload").removeAttr("disabled");
			$("#cdimage").attr("disabled", "disabled");
			var cdselect = $("#xzfcd");
			//			console.log(zTreeSelect);
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/findAllParent/" + zTreeSelect.pId,
				async: false,
				success: function success(result) {
					cdselect.empty();
					//				console.log(result);
					for (var i = 0; i < result.length; i++) {
						var o = new Option(result[i].name, result[i].id);
						cdselect.append(o);
					}
					if (dataprifuc != null) {
						$("#xzfcd").find('option[value=' + dataprifuc.id + ']').attr("selected", true);
					}
					$(".chosen-select").trigger("chosen:updated");
				}

			});
			//		$(".chosen-select").trigger("chosen:updated");
			//			$("#xzfcd").find('option[value='+["privilegeFunction.id"]+']').attr("selected",true);
		} else {
			layer.confirm('请指定修改的信息列！', {
				btn: ['是的'] //按钮
			});
		}
	});

	var jcusersmenus = [];
	$("#jcqx-btn").click(function () {
		if (zTreeSelect != null) {
			//			var setting = {
			//				check: {
			//					enable: true
			//				},
			//				data: {
			//					simpleData: {
			//						enable: true
			//					}
			//				},
			//				callback: {
			//					onCheck: zTreeOnCheck2
			//				},
			//				view: {
			//					selectedMulti: true
			//				}
			//			};

			//			function removeByValue(arr, val) {
			//				for(var i = 0; i < arr.length; i++) {
			//					if(arr[i] == val) {
			//						arr.splice(i, 1);
			//						break;
			//					}
			//				}
			//			}
			//
			//			function zTreeOnCheck2(event, treeId, treeNode) {
			//				if(treeNode.checked == true) {
			//					jcusersmenus.push(treeNode.id);
			//				} else {
			//					removeByValue(jcusersmenus, treeNode.id);
			//				}
			//				console.log(jcusersmenus);
			//			}

			var zNodes2 = [];
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priActions/findByMenuId/" + zTreeSelect.id,
				async: false,
				success: function success(data) {

					if (data.length > 0) {
						var removeByValue = function removeByValue(arr, val) {
							for (var i = 0; i < arr.length; i++) {
								if (arr[i] == val) {
									arr.splice(i, 1);
									break;
								}
							}
						};

						//						var jcusersmenus = [];

						var zTreeOnCheck2 = function zTreeOnCheck2(event, treeId, treeNode) {
							if (treeNode.checked == true) {
								jcusersmenus.push(treeNode.id);
							} else {
								removeByValue(jcusersmenus, treeNode.id);
							}
							console.log(jcusersmenus);
						};

						//debugger;


						for (var i = 0; i < data.length; i++) {
							var o = new Object();
							o.id = data[i]["id"];
							o.name = data[i]["name"];
							if (data[i]["privilegeFunction"] == null) {
								o.pId = "";
							} else {
								o.pId = data[i]["privilegeFunction"]["id"];
							}

							zNodes2.push(o);
						}
						var setting = {
							check: {
								enable: true
							},
							data: {
								simpleData: {
									enable: true
								}
							},
							callback: {
								onCheck: zTreeOnCheck2
							},
							view: {
								selectedMulti: true
							}
						};

						$.fn.zTree.init($("#treeDemo"), setting, zNodes2);

						$("#jcqx-btn").attr('data-target', '#myModal2');
					} else {}
				},
				error: function error() {
					layer.confirm('该菜单下没有权限因子！', {
						btn: ['是的'] //按钮
					});
					$("#jcqx-btn").attr('data-target', '');
				}
			});
		} else {
			layer.confirm('请指定解除权限的信息列！', {
				btn: ['是的'] //按钮
			});
			$("#jcqx-btn").attr('data-target', '');
		}
	});

	$("#rolebtfinish1").click(function () {
		if (jcusersmenus.length > 0) {
			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/revokeFunctionAction?actionIds=" + jcusersmenus,
				async: false,
				dataType: 'text',
				success: function success(data) {
					layer.msg('解除成功！', {
						icon: 1
					});
					$(".close").click();
				},
				error: function error() {
					layer.confirm('解除失败！', {
						btn: ['是的'] //按钮
					});
					$(".close").click();
				}
			});
		} else {
			layer.confirm('没有选择权限因子，操作无效！', {
				btn: ['是的'] //按钮
			});
		}
	});

	$("#delete-btn").click(function () {
		if (zTreeSelectid == null || zTreeSelectid == "") {
			layer.confirm('请指定删除的信息列！', {
				btn: ['是的'] //按钮
			});
		} else {
			layer.confirm('是否确定要删除？', {
				btn: ['是的', '取消'] //按钮
			}, function () {
				$.ajax({
					type: "DELETE",
					url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/" + zTreeSelectid,
					//			data: JSON.stringify(datajson),
					dataType: "text",
					async: false,
					ContentType: "application/json;charset=UTF-8",
					contentType: "application/json",
					headers: {
						"Content-Type": "application/json;charset=UTF-8"
					},
					success: function success() {
						layer.msg('删除成功', {
							icon: 1
						});
						setTimeout(function () {
							location.reload();
						}, 1000);
					},
					error: function error() {
						layer.confirm('删除失败！', {
							btn: ['是的'] //按钮
						});
					}
				});
			});
		}
	});
	$("#btnupload").click(function () {
		doUpload();
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
				photourl = YZ.ajaxURLms + "api/jp-TIFS-FileCenter-ms/file?businessId=" + data.fileID;
				//					$("#pictureUrl").val(purl );
				$("#cdimage").val(photourl);
				layer.confirm('上传成功！', {
					btn: ['是的'] //按钮
				});
			},
			error: function error(returndata) {
				layer.confirm('上传失败！', {
					btn: ['是的'] //按钮
				});
			}
		});
	}

	$("#add-btn").click(function () {
		updataoradd = 'add';
		$("#xzfcd").removeAttr("disabled");
		$("#xzfcd").trigger("chosen:updated");
		$("#btnbc").removeAttr("disabled");
		$("#btnqx").removeAttr("disabled");
		$("#file").removeAttr("disabled");
		$("#commentForm").find("input").removeAttr("readonly");
		$("#commentForm").find("textarea").removeAttr("readonly");
		$("#commentForm").find("input").val("");
		$("#commentForm").find("textarea").val("");
		$("#xzfcd_chosen").removeClass("chosen-disabled");
		$("#btnupload").removeAttr("disabled");
		$("#cdimage").attr("disabled", "disabled");
		var cdselect = $("#xzfcd"); //获取list对象
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/",
			async: false,
			success: function success(result) {
				//				console.log(result);
				for (var i = 0; i < result.length; i++) {
					var o = new Option(result[i].name, result[i].id);
					cdselect.append(o);
				}
			}
		});
		$(".chosen-select").trigger("chosen:updated");
		//		$(".chosen-select").chosen();
	});
	$('#date').datepicker();

	$("#btnqx").click(function () {
		if (updataoradd == 'add') {
			$("#file").attr('disabled', 'disabled');
			$("#btnbc").attr('disabled', 'disabled');
			$("#btnqx").attr('disabled', 'disabled');
			$("#commentForm").find("input").attr("readonly", "readonly");
			$("#commentForm").find("textarea").attr("readonly", "readonly");
			$("#commentForm").find("input").val("");
			$("#commentForm").find("textarea").val("");
			$("#xzfcd_chosen").addClass("chosen-disabled");
		} else {
			$("#file").attr('disabled', 'disabled');
			$("#btnbc").attr('disabled', 'disabled');
			$("#btnqx").attr('disabled', 'disabled');
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/?id=" + zTreeSelectid,
				async: false,
				success: function success(data) {
					//数据回显示
					//					var zTreeSelectid = treeNode.id;
					//					console.log(zTreeSelectid);
					$("#cdname").val(data[0].name);
					$("#cddisplayname").val(data[0].displayname);
					$("#cduri").val(data[0].uri);
					$("#cdtarget").val(data[0].target);
					$("#cdsort").val(data[0].sort);
					$("#cdremark").val(data[0].remark);
					$("#commentForm").find("input").attr("readonly", "readonly");
					$("#commentForm").find("textarea").attr("readonly", "readonly");
					$("#xzfcd_chosen").addClass("chosen-disabled");
				}
			});
		}
	});

	//点击父级展开树菜单

	var myDiv = $(".parent-div");
	$("#parent-menu").click(function (event) {
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
});