/*
 * 根据字段分组
 */
function groupBy(list, column, map) {
	if(list.length > 0) {
		var templist = [];
		templist.push(list[0]);
		var temp = list[0][column];
		list.splice(0, 1);
		for(var j = 0; j < list.length; j++) {
			if(temp === list[j][column]) {
				templist.push(list[j]);
				list.splice(j, 1);
				j = -1;
			}
		}
		map[temp] = templist;
		groupBy(list, column, map);
	} else {
		return map;
	}
}

/*
 * 对象clone
 */
function clone(obj) {
	var o, i, j, k;
	if(typeof(obj) != "object" || obj === null) return obj;
	if(obj instanceof(Array)) {
		o = [];
		i = 0;
		j = obj.length;
		for(; i < j; i++) {
			if(typeof(obj[i]) == "object" && obj[i] != null) {
				o[i] = arguments.callee(obj[i]);
			} else {
				o[i] = obj[i];
			}
		}
	} else {
		o = {};
		for(i in obj) {
			if(typeof(obj[i]) == "object" && obj[i] != null) {
				o[i] = arguments.callee(obj[i]);
			} else {
				o[i] = obj[i];
			}
		}
	}
	return o;
}

/*
 * 条件查询路径拼接
 */
function likeQuery(url, array) {
	var count = 0;
	for(let arrayi of array) {
		if($("#" + arrayi + arrayi).val().trim() === "" || typeof($("#" + arrayi + arrayi).val()) === "undefined") {
			continue
		} else {
			if(count > 0) {
				url += "&" + arrayi + "=" + $("#" + arrayi + arrayi).val();
				count++;
			} else {
				url += arrayi + "=" + $("#" + arrayi + arrayi).val();
				count++;
			}
		}
	}
	return url
}

function objToform(obj) {
	for(var attr in obj) {
		if($("#" + attr).length > 0) {
			$("#" + attr).val(obj[attr]);
		}
	}
}

function objToSpan(obj, ele) {
	for(var attr in obj) {
		if($("#" + ele).find("#" + attr).length > 0) {
			$("#" + ele).find("#" + attr).val(obj[attr]);

		}
	}
}

var pageReload = function(elementId, url) {
	_ajax("g", url, null, function(result) {
		$("#" + elementId).jqGrid('clearGridData'); //清空表格
		$("#" + elementId).jqGrid('setGridParam', {
			datatype: 'local',
			data: result,
		}).trigger("reloadGrid");
	}, function() {});
}

var pageReload1 = function(elementId, url) {
	_ajax("g", url, null, function(data) {
		var mydata = data;
		var length = mydata.length;
		var listArray = [];
		for(var i = 0; i < length; i++) {
			listArray.push(mydata[i]['stationid']);
		}
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/byIdList",
			dataType: "json",
			data: JSON.stringify(listArray),
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function(data) {
				var lengthOne = data.length;
				for(var j = 0; j < lengthOne; j++) {
					if(mydata[j] !== null && data[j] !== null) {
						mydata[j]['stationName'] = data[j]['stationName'];
					}
				}
				//console.log("data"+JSON.stringify(data));
				//console.log("mydata"+JSON.stringify(mydata));

			},
			error: function(returndata) {
				console.log(returndata);

			}

		});

		$("#" + elementId).jqGrid('clearGridData'); //清空表格
		$("#" + elementId).jqGrid('setGridParam', {
			datatype: 'local',
			data: mydata,
		}).trigger("reloadGrid");
	}, function() {});
}

var deleteOne = function(durl, gurl, elementId, id) {
	_ajax("d", durl + id, null, function() {
		layer.msg('删除成功!', {
			icon: 1
		});
		pageReload(elementId, gurl);
	}, function() {
		layer.msg('删除失败!', {
			icon: 2
		});
	});
}

var deleteTwo = function(durl, id) {
	_ajax("d", durl + id, null, function() {
		layer.msg('删除成功!', {
			icon: 1
		});
		setTimeout(function() {
			location.reload();
		}, 1000);
	}, function() {
		layer.msg('删除失败!', {
			icon: 2
		});
	});
}

var updateOne = function(pturl, gurl, elementId, id, obj) {
	_ajax("pt", pturl + id, obj, function() {
		layer.msg('更新成功!', {
			icon: 1
		});
		$(".close").click();
		pageReload(elementId, gurl);
	}, function() {
		layer.msg('更新失败!', {
			icon: 2
		});
		$(".close").click();
	});
}

var addOne = function(purl, gurl, elementId, obj) {
	_ajax("p", purl, obj, function() {
		layer.msg('新增成功!', {
			icon: 1
		});
		$(".close").click();
		pageReload(elementId, gurl);
	}, function() {
		layer.msg('新增失败!', {
			icon: 2
		});
		$(".close").click();
	});
}

var _ajax = function(type, url, data, sf, ef) {
	if(type === "g" || type === "G") {
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + url,
			async: true,
			success: function(result) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(result);
				}
				sf(result);
			},
			error: function(status) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(status);
				}
				ef(status);
			}
		});
	} else if(type === "p" || type === "P") {
		$.ajax({
			type: "post",
			url: YZ.ajaxURLms + url,
			async: true,
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify(data),
			success: function(result) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(result);
				}
				sf(result);
			},
			error: function(status) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(status);
				}
				ef(status);
			}
		});
	} else if(type === "pt" || type === "PT") {
		$.ajax({
			type: "put",
			url: YZ.ajaxURLms + url,
			async: true,
			contentType: "application/json;charset=UTF-8",
			data: JSON.stringify(data),
			success: function(result) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(result);
				}
				sf(result);
			},
			error: function(status) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(status);
				}
				ef(status);
			}
		});
	} else if(type === "d" || type === "D") {
		$.ajax({
			type: "delete",
			url: YZ.ajaxURLms + url,
			async: true,
			contentType: "application/json;charset=UTF-8",
			dataType: 'text',
			success: function(result) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(result);
				}
				sf(result);
			},
			error: function(status) {
				if(YZ.consoleTag === "t" || YZ.consoleTag === "T") {
					console.log(status);
				}
				ef(status);
			}
		});
	} else {
		alert("p==>post,g==>get,pt==>put,d==>delete");
	}
}