function jurisdictionbtnbc() {
	var addorupdate = $(".modal-title").html();
	if (addorupdate == "新增权限因子信息") {
		$.ajax({
			type: "POST",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priActions/insertPriAction",
			data: JSON.stringify($('#commentForm').serializeJSON()),
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
		$.ajax({
			type: "PUT",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/priActions/updatePriAction/" + jurisdictionJqGridRowData.id,
			data: JSON.stringify($('#commentForm').serializeJSON()),
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