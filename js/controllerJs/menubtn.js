function menubtnbc() {
	//	var formData = new FormData($("#menuimage")[0]);
	//	$.ajax({
	//		url: YZ.ajaxURLms+"zuul/api/jp-TIFS-FileCenter-ms/file",
	//		type: 'POST',
	//		data: formData,
	//		async: false,
	//		cache: false,
	//		contentType: false,
	//		processData: false,
	//		success: function(data) {
	//			var purl = YZ.ajaxURLms+"api/jp-TIFS-FileCenter-ms/file?businessId=" + data.fileID;
	//			//			$("#pictureUrl").val(purl);
	//			layer.confirm('图片上传成功！', {
	//				btn: ['是的'] //按钮
	//			});
	//		},
	//		error: function(returndata) {
	//			layer.confirm('图片上传失败！', {
	//				btn: ['是的'] //按钮
	//			});
	//		}
	//	});
	var menuObj = new Object();
	var parentmenuObj = new Object();
	var adddata;
	menuObj.name = $("#cdname").val();
	menuObj.displayname = $("#cddisplayname").val();
	menuObj.uri = $("#cduri").val();
	menuObj.target = $("#cdtarget").val();
	menuObj.parentPrivilegeFunction = parentmenuObj;
	parentmenuObj.id = $("#xzfcd").val();
	menuObj.sort = $("#cdsort").val();
	menuObj.remark = $("#cdremark").val();
	menuObj.image = $("#cdimage").val();
	adddata = JSON.stringify(menuObj);
	console.log(adddata);
	if (updataoradd == 'add') {
		//		console.log($('#commentForm').serializeJSON());
		//		console.log(JSON.stringify($('#commentForm').serializeJSON()));
		$.ajax({
			type: "POST",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/",
			data: adddata,
			//			data: JSON.stringify(datajson),
			dataType: "json",
			async: false,
			ContentType: "application/json;charset=UTF-8",
			contentType: "application/json",
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success() {
				$("#rolebtngb").click();
				layer.msg('添加成功', {
					icon: 1
				});
				setTimeout(function () {
					location.reload();
				}, 1000);
			}
		});
	} else {
		//		console.log(adddata);
		$.ajax({
			type: "PUT",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priFuncs/" + zTreeSelectid,
			data: adddata,
			//			data: JSON.stringify(datajson),
			dataType: "json",
			async: false,
			ContentType: "application/json;charset=UTF-8",
			contentType: "application/json",
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success() {
				$("#rolebtngb").click();
				layer.msg('更新成功', {
					icon: 1
				});
				setTimeout(function () {
					location.reload();
				}, 1000);
			}
		});
	}
}