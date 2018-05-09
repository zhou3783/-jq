var flag; //add与update标识
var selectRowplcCar;
var selectRowplcCar1;
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
var serachObj = {};
var onlydata;
var userId = window.sessionStorage.userId; //userId by login

$.jgrid.defaults.styleUI = 'Bootstrap';

//人员组织架构
$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-UserProfile-ms/policestations/getOrgaInfo",

	dataType: "json",
	async: true,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		//			console.log(data);
		for (var i = 0; i < data.length; i++) {
			var ele = "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
			$("#stationid").append(ele);
			$("#householdid").append(ele);
			$("#reportunit").append(ele);
		}
		$(".chosen-select").trigger("chosen:updated");
	}
});

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/count/ownerGroup/1500000000",

	dataType: "json",
	async: true,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		//			console.log(data);
		for (var i = 0; i < data.length; i++) {
			var ele = "<option value='" + data[i].property + "'>" + data[i].property + "</option>";
			$("#serachPersonGroup").append(ele);
		}
		$(".chosen-select").trigger("chosen:updated");
	}
});

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/info/page",
	data: {
		"pageIndex": 0,
		"pageSize": 15
	},
	dataType: "json",
	async: false,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		mydata = data.data;
		onlydata = mydata;
		totalRecords = data.elementsSum; //总记录数
		totalPage = countTotalPage(totalRecords, 15); //总页数
		$("#totalPage").text(totalPage);
		$("#totalRecord").text(totalRecords);
	}
});

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/root",

	dataType: "json",
	async: true,

	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(result) {

		for (var i = 0; i < result.length; i++) {
			//new Option(result[i].type, result[i].id);
			var optionEle1 = "<option value='" + result[i].id + "' data-pid='" + result[i].parentid + "'>" + result[i].typename + "</option>";
			//$("#typename").append(optionEle1);
			$("#serachPersonType").append(optionEle1);
		}
		$(".chosen-select").trigger("chosen:updated");
	}
});

$.ajax({
	type: "get",
	url: YZ.ajaxURLms + 'api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/root',
	dataType: "json",
	async: true,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	success: function success(data) {
		var length = data.length;
		var rootdata = data;
		var ele = '';
		for (var i = 0; i < length; i++) {
			$.ajax({
				type: "get",
				url: YZ.ajaxURLms + 'api/jp-BIRM-ControlObject-ms/BS/ImportPersonType/leaf/' + rootdata[i].id,
				dataType: "json",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data1) {
					var len = data1.length;
					if (len === 0) {
						ele += ' <li><a href="javascript:;" data-index="1" data-id="' + rootdata[i].id + '">' + rootdata[i].typename + '</a></li>';
					} else {
						ele += '<li class="dropdown-submenu"> <a href="javascript:;" data-id="' + rootdata[i].id + '" >' + rootdata[i].typename + '</a> <ul class="dropdown-menu"> ';
						for (var j = 0; j < len; j++) {
							ele += ' <li><a  href="javascript:;" data-id="' + data1[j].id + '" >' + data1[j].typename + '</a></li>';
						}
						ele += '</ul></li>';
					}
				}
			});
		}
		//	console.log(ele)
		$(".dropdown1 ul").html(ele);
	}
});

function countTotalPage(totalRecords, pageSize) {
	var pages;
	if (totalRecords <= pageSize) {
		pages = 1;
	} else {
		if (totalRecords % pageSize == 0) {
			pages = totalRecords / pageSize;
		} else {
			pages = parseInt(totalRecords / pageSize) + 1;
		}
	}
	return pages;
}

//表格初始	
$("#table_list_jc").jqGrid({
	data: mydata,
	datatype: "local",
	height: '100%',
	autoScroll: true,
	autowidth: true,
	shrinkToFit: false,
	rownumbers: true,
	rowNum: 15,
	colNames: ['序号', '姓名', '性别', '身份证号', '是否为武汉户籍', '户籍地', '人员类型大类', '人员类型小类', '所属群体', '人员等级', '现住址', '手机号', 'MAC', '车牌号', '管辖分局', '管辖派出所', '人员数据来源', '创建时间', '更新时间' /*,'imageurl'*/],
	colModel: [{
		name: 'id',
		index: 'id',
		sorttype: "int",
		hidden: true
	}, {
		name: 'name',
		index: 'name'

	}, {
		name: 'sex',
		index: 'sex',
		width: '50'
	}, {
		name: 'idCardNo',
		index: 'idCardNo'
	}, {
		name: 'importPersonInfoForBS',
		index: 'importPersonInfoForBS',
		width: '110',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			var sex = void 0;
			if (value != null) {
				if (value.isWuhanIdcard == 0) {
					sex = '否';
				} else if (value.isWuhanIdcard == 1) {
					sex = '是';
				} else {
					sex = '';
				}
				html = "<span>" + sex + "</span>";
			}
			return html;
		}
	}, {
		name: 'birthPlace',
		index: 'birthPlace'
	}, {
		name: 'importPersonTypeAndRootTypes',
		index: 'importPersonTypeAndRootTypes',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			for (var i = 0; i < value.length; i++) {
				if (value[i].root != null && value[i].root != '') {
					if (value[i].root.hierarchy == 1) {
						html += "<span class=\"span-one\">" + value[i].root.typename + "</span>&nbsp;&nbsp;";
					} else if (value[i].root.hierarchy == 2) {
						html += "<span class=\"span-two\">" + value[i].root.typename + "</span>&nbsp;&nbsp;";
					} else {
						html += "<span class=\"span-three\">" + value[i].root.typename + "</span>&nbsp;&nbsp;";
					}
				}
			}
			return html;
		}
	}, {
		name: 'importPersonTypeAndRootTypes',
		index: 'importPersonTypeAndRootTypes',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			for (var i = 0; i < value.length; i++) {
				if (value[i].type != null && value[i].type != '') {
					if (value[i].type.hierarchy == 1) {
						html += "<span class=\"span-one\">" + value[i].type.typename + "</span>&nbsp;&nbsp;";
					} else if (value[i].type.hierarchy == 2) {
						html += "<span class=\"span-two\">" + value[i].type.typename + "</span>&nbsp;&nbsp;";
					} else {
						html += "<span class=\"span-three\">" + value[i].type.typename + "</span>&nbsp;&nbsp;";
					}
				}
			}
			return html;
		}

	}, {
		name: 'ownerGroup',
		index: 'ownerGroup'

	}, {
		name: 'importPersonInfoForBS',
		index: 'importPersonInfoForBS',
		width: '75',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			if (value != null) {
				if (value.personLevel != null && value.personLevel != '') {
					html += "<span>" + value.personLevel + "</span>";
				}
			}
			return html;
		}

	}, {
		name: 'importPersonInfoForBS',
		index: 'importPersonInfoForBS',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			if (value != null) {
				if (value.currentAddress != null) {
					html += "<span>" + value.currentAddress + "</span>&nbsp;&nbsp;";
				}
			}
			return html;
		}

	}, {
		name: 'mobile',
		index: 'mobile'
		/*			formatter: function (value, grid, rows, state) { 
  				let html = '';
  				for(let i=0;i<value.length;i++){
  				if(value[i].type === 'mobile'){
  				html += "<span  style=\"color:#f60; margin-right:10px\">"+value[i].socialAccount+"</span>";
  				}
  				
  				}
  				return html;
  			}*/

	}, {
		name: 'importSocials',
		index: 'importSocials',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			for (var i = 0; i < value.length; i++) {
				if (value[i].type === 'mac') {
					html += "<span class=\"span-mac\">" + value[i].socialAccount + "</span>&nbsp;&nbsp;";
				}
			}
			return html;
		}

	}, {
		name: 'importVechiles',
		index: 'importVechiles',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			for (var i = 0; i < value.length; i++) {
				if (value[i].vechileNo != null) {
					html += "<span class=\"span-vechileno\">" + value[i].vechileNo + "</span>&nbsp;&nbsp;";
				}
			}
			return html;
		}

	}, {
		name: 'stationName',
		index: 'stationName'

	}, {
		name: 'householdName',
		index: 'householdName'

	}, {
		name: 'reportunitName',
		index: 'reportunitName'

	}, {
		name: 'importPersonInfoForBS',
		index: 'importPersonInfoForBS',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			if (value != null) {
				if (value.createTime != null && value.createTime != '') {
					html += value.createTime.substring(0, 10);
					html += ' ' + value.createTime.substring(11, 19);
				}
			}
			return html;
		}

	}, {
		name: 'importPersonInfoForBS',
		index: 'importPersonInfoForBS',
		formatter: function formatter(value, grid, rows, state) {
			var html = '';
			if (value != null) {
				if (value.updateTime != null && value.updateTime != '') {
					html += value.updateTime.substring(0, 10);
					html += ' ' + value.updateTime.substring(11, 19);
				}
			}
			return html;
		}

	}],

	viewrecords: true,
	caption: "",
	hidegrid: false,
	onSelectRow: function onSelectRow(rowId, status) {
		selectRowplcCar = $("#table_list_jc").jqGrid("getRowData", rowId);
	}

});

$.jqPaginator('#pagination1', {
	totalPages: totalPage,
	visiblePages: 15,
	currentPage: 1,
	onPageChange: function onPageChange(num, type) {
		var pageObj = {
			"pageIndex": num - 1,
			"pageSize": 15
		};
		Object.assign(serachObj, pageObj);
		// console.log(serachObj)
		$.ajax({
			type: "get",
			url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/info/page",
			data: serachObj,
			dataType: "json",
			async: false,
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			success: function success(data) {

				mydata = data.data;
				onlydata = mydata;
				totalRecords = data.elementsSum;
				totalPage = countTotalPage(totalRecords, 15); //总页数
				$("#totalPage").text(totalPage);
				$("#totalRecord").text(totalRecords);
			}
		});

		$("#table_list_jc").jqGrid('clearGridData'); //清空表格
		$("#table_list_jc").jqGrid('setGridParam', { // 重新加载数据
			datatype: 'local',
			data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

		}).trigger("reloadGrid");
	}
});

// Add responsive to jqGrid
$(window).bind('resize', function () {
	var width = $('.jqGrid_wrapper').width();
	$('#table_list_jc').setGridWidth(width);
});

$("#export-btn").click(function () {
	var excelDownloadUrl = YZ.ajaxURLms + "api/jp-BSRM-ControlObject-ms/importPersons/downloadExcel?1=1";

	var searchName = $("#searchName").val().trim();
	var searchIdcard = $("#searchIdcard").val().trim();
	var searchPhone = $("#searchPhone").val().trim();
	var serachPersonType = $("#serachPersonType").val().trim();
	var serachPersonGroup = $("#serachPersonGroup").val().trim();
	var serachPersonLevel = $("#serachPersonLevel").val().trim();
	if (searchName != null && searchName != '') {
		//	serachObj.nameLike = searchName;
		excelDownloadUrl += '&nameLike=' + searchName;
	}
	if (searchIdcard != null && searchIdcard != '') {
		//	serachObj.idCardNoLike = searchIdcard
		excelDownloadUrl += '&idCardNoLike=' + searchIdcard;
	}
	if (searchPhone != null && searchPhone != '') {
		//	serachObj.mobileLike = searchPhone
		excelDownloadUrl += '&mobileLike=' + searchPhone;
	}
	if (serachPersonType != null && serachPersonType != '') {
		//	serachObj.typeId = serachPersonType
		excelDownloadUrl += '&typeId=' + serachPersonType;
	}
	if (serachPersonGroup != null && serachPersonGroup != '') {
		//	serachObj.ownerGroup = serachPersonGroup
		excelDownloadUrl += '&ownerGroup=' + serachPersonGroup;
	}
	if (serachPersonLevel != null && serachPersonLevel != '') {
		//	serachObj.personLevel = serachPersonLevel;
		excelDownloadUrl += '&personLevel=' + serachPersonLevel;
	}
	//console.log(excelDownloadUrl)

	// $(this).attr("href",excelDownloadUrl);
	$(location).attr('href', excelDownloadUrl);
});

$("#download-modalExcel").click(function () {
	var excelModalDownloadUrl = YZ.ajaxURLms + 'api/jp-BSRM-ControlObject-ms/importPersons/upExcel/template';
	$(location).attr('href', excelModalDownloadUrl);
});

function doUpload() {
	var formData = new FormData($("#uploadForm")[0]);
	if ($("#previewImg").val() == "") {
		layer.msg('请选择头像', {
			icon: 2
		});
	} else {

		$.ajax({
			url: YZ.ajaxURLms + 'api/jp-TIFS-FileCenter-ms/file',
			type: 'POST',
			data: formData,

			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function success(data) {
				var purl = data.fileID;
				$("#downloadFileId").val(purl);
				//	console.log($("#downloadFileId").val())
				layer.msg('上传成功', {
					icon: 1
				});
			},
			error: function error(returndata) {
				console.log(returndata);
				layer.msg('上传失败', {
					icon: 2
				});
			}
		});
	}
}

function doUploadExcel() {
	var userid = window.sessionStorage.userId;
	var formData = new FormData($("#uploadExcel")[0]);
	formData.append("userId", userid);
	$.ajax({
		url: YZ.ajaxURLms + 'api/jp-BSRM-ControlObject-ms/importPersons/upExcel',
		type: 'POST',
		data: formData,
		async: true,
		cache: false,
		contentType: false,
		processData: false,
		success: function success(data) {
			console.log(data);
			layer.msg('导入成功', {
				icon: 1
			});
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

$(".upload-image").click(function () {
	doUpload();
});

$("#uploadExcelBtn").click(function () {
	doUploadExcel();
});

//搜索按钮点击事件
$("#plsCarTpSch").click(function () {
	//idCardNoLike mobileLike nameLike ownerGroup typeId
	var searchName = $("#searchName").val().trim();
	var searchIdcard = $("#searchIdcard").val().trim();
	var searchPhone = $("#searchPhone").val().trim();
	var serachPersonType = $("#serachPersonType").val().trim();
	var serachPersonGroup = $("#serachPersonGroup").val().trim();
	var serachPersonLevel = $("#serachPersonLevel").val().trim();
	serachObj = {};
	if (searchName != null && searchName != '') {
		serachObj.nameLike = searchName;
	}
	if (searchIdcard != null && searchIdcard != '') {
		serachObj.idCardNoLike = searchIdcard;
	}
	if (searchPhone != null && searchPhone != '') {
		serachObj.mobileLike = searchPhone;
	}
	if (serachPersonType != null && serachPersonType != '') {
		serachObj.rootTypeId = serachPersonType;
	}
	if (serachPersonGroup != null && serachPersonGroup != '') {
		serachObj.ownerGroup = serachPersonGroup;
	}
	if (serachPersonLevel != null && serachPersonLevel != '') {
		serachObj.personLevel = serachPersonLevel;
	}

	var pageObj = {
		"pageIndex": 0,
		"pageSize": 15
	};
	Object.assign(serachObj, pageObj);
	console.log(JSON.stringify(serachObj));
	var mydata = void 0;
	$.ajax({
		type: "get",
		url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/info/page",
		data: serachObj,
		dataType: "json",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			//	console.log(data);
			mydata = data.data;
			onlydata = mydata;
			totalRecords = data.elementsSum;
			totalPage = countTotalPage(totalRecords, 15); //总页数
			$("#totalPage").text(totalPage);
			$("#totalRecord").text(totalRecords);
			//  console.log(totalPage + '---' + totalRecords)
			$('#pagination1').jqPaginator('option', {
				currentPage: 1,
				totalPages: totalPage,
				visiblePages: 10
			});
		}
	});

	$("#table_list_jc").jqGrid('clearGridData'); //清空表格
	$("#table_list_jc").jqGrid('setGridParam', { // 重新加载数据
		datatype: 'local',
		data: mydata //  newdata 是符合格式要求的需要重新加载的数据 

	}).trigger("reloadGrid");
});

function initFrom() {
	$("#typename option").eq(0).prop("selected", true);
	$("#stationid option").eq(0).prop("selected", true);
	$("#householdid option").eq(0).prop("selected", true);
	$("#reportunit option").eq(0).prop("selected", true);
	$(".chosen-select").trigger("chosen:updated");

	$("#tag-this--simple-tags span").remove();
	$("#tag-this--mac-tags span").remove();
	$("#tag-this--card-tags span").remove();

	$("#imghead").attr("src", "img/default.png");
	$("#commentForm").find("input").val("");
	$("#box span").remove();
}
//新增按钮点击事件
$("#add-btn").click(function () {
	flag = "add";
	$("#myModalLabel").html("新增重点人信息");
	initFrom();
});
var flagPosition;
$("#look-btn").click(function () {
	if (selectRowplcCar != null) {
		$("#importPersonTypes span").remove();
		$("#lookMobile span").remove();
		$("#lookMac span").remove();
		$("#lookCard span").remove();
		$("#imgheadlook").attr("src", "img/default.png");
		$("#dataRetrieval").find("input").val("");

		$("#look-btn").attr("data-target", "#myModal1");
		for (var i = 0; i < onlydata.length; i++) {
			if (onlydata[i].id === selectRowplcCar.id) {
				flagPosition = i;
			}
		}
		var data = onlydata[flagPosition];

		objToSpan(data, 'dataRetrieval');
		if (data.sex != null && data.sex != '') {
			$("#sex1").val(data.sex);
		}

		if (data.importPersonImages.length > 0) {
			$("#imgheadlook").attr("src", YZ.ajaxURLms + 'api/jp-TIFS-FileCenter-ms/file?businessId=' + data.importPersonImages[0].url);
		}
		if (data.importPersonTypeAndRootTypes.length > 0) {
			var span = '';
			for (var _i = 0; _i < data.importPersonTypeAndRootTypes.length; _i++) {
				if (data.importPersonTypeAndRootTypes[_i].type != null && data.importPersonTypeAndRootTypes[_i].type != '') {
					span += '<span>' + data.importPersonTypeAndRootTypes[_i].type.typename + '</span>';
				}
			}
			$("#importPersonTypes").append(span);
		}

		if (data.importSocials.length > 0) {
			var spanmac = '';
			var spanmobile = '';
			var macnum = 0;
			var mobile = 0;
			for (var _i2 = 0; _i2 < data.importSocials.length; _i2++) {
				if (data.importSocials[_i2].type === 'mac') {
					macnum++;
					spanmac += '<span>' + data.importSocials[_i2].socialAccount + '</span>';
				}
				if (data.importSocials[_i2].type === 'mobile') {
					mobile++;
					spanmobile += '<span>' + data.importSocials[_i2].socialAccount + '</span>';
				}
			}
			if (mobile == 0) {
				$("#lookMobile").append('<span>' + data.mobile + '</span>');
			} else {
				$("#lookMobile").append(spanmobile);
			}
			$("#lookMac").append(spanmac);
		} else {
			$("#lookMobile").append('<span>' + data.mobile + '</span>');
		}

		if (data.importVechiles.length > 0) {
			var _span = '';
			for (var _i3 = 0; _i3 < data.importVechiles.length; _i3++) {
				_span += '<span>' + data.importVechiles[_i3].vechileNo + '</span>';
			}
			$("#lookCard").append(_span);
		}

		if (data.importPersonInfoForBS != null) {
			$("#formerName1").val(data.importPersonInfoForBS.formerName);
			if (data.importPersonInfoForBS.isWuhanIdcard == 1 && data.importPersonInfoForBS.isWuhanIdcard == '1') {
				$("#isWuhanIdcard1").val('是');
			} else if (data.importPersonInfoForBS.isWuhanIdcard == 0 && data.importPersonInfoForBS.isWuhanIdcard == '0') {
				$("#isWuhanIdcard1").val('否');
			}
			$("#currentAddress1").val(data.importPersonInfoForBS.currentAddress);
			$("#personLevel1").val(data.importPersonInfoForBS.personLevel);

			if (data.importPersonInfoForBS.createTime != null && data.importPersonInfoForBS.createTime != '') {
				var html = '';
				html += data.importPersonInfoForBS.createTime.substring(0, 10);
				html += ' ' + data.importPersonInfoForBS.createTime.substring(11, 19);

				$("#lookcreateTime").val(html);
			} else {
				$("#lookcreateTime").val();
			}
			if (data.importPersonInfoForBS.updateTime != null && data.importPersonInfoForBS.updateTime != '') {
				var _html = '';
				_html += data.importPersonInfoForBS.updateTime.substring(0, 10);
				_html += ' ' + data.importPersonInfoForBS.updateTime.substring(11, 19);

				$("#lookupdateTime").val(_html);
			}
		}
	} else {
		$("#look-btn").attr("data-target", "");
		layer.msg('请选择要查看的列!', {
			icon: 2
		});
	}
});

//修改按钮点击事件
$("#update-btn").click(function () {
	flag = "update";
	if (selectRowplcCar != null) {
		$("#update-btn").attr("data-target", "#myModal");
		$("#myModalLabel").html("修改重点人信息");

		initFrom();

		for (var _i4 = 0; _i4 < onlydata.length; _i4++) {
			if (onlydata[_i4].id === selectRowplcCar.id) {
				flagPosition = _i4;
			}
		}
		var data = onlydata[flagPosition];
		//输入框值回显
		objToform(data);
		$("#reportTime").val(data.reportTime);
		$("#typename").find("option[text='" + data.stationName + "']").prop("selected", true);
		$("#stationid").find("option[text='" + data.stationName + "']").prop("selected", true);
		$("#householdid").find("option[text='" + data.householdName + "']").prop("selected", true);
		$("#reportunit").find("option[text='" + data.reportunitName + "']").prop("selected", true);
		$(".chosen-select").trigger("chosen:updated");

		if (data.importPersonImages.length > 0) {
			$("#imghead").attr("src", YZ.ajaxURLms + 'api/jp-TIFS-FileCenter-ms/file?businessId=' + data.importPersonImages[0].url);
		}
		if (data.sex != null && data.sex != '') {
			$("#sex").find("option[text='" + data.sex + "']").prop("selected", true);
		}

		if (data.importPersonInfoForBS != null) {
			if (data.importPersonInfoForBS.isWuhanIdcard != null && data.importPersonInfoForBS.isWuhanIdcard != '') {
				//	console.log(data.importPersonInfoForBS.isWuhanIdcard);
				$("#isWuhanIdcard").find("option[value='" + data.importPersonInfoForBS.isWuhanIdcard + "']").prop("selected", true);
			}
			if (data.importPersonInfoForBS.currentAddress != null) {
				$("#currentAddress").val(data.importPersonInfoForBS.currentAddress);
			}
			if (data.importPersonInfoForBS.personLevel != null && data.importPersonInfoForBS.personLevel != '') {
				$("#personLevel").find("option[value='" + data.importPersonInfoForBS.personLevel + "']").prop("selected", true);
			}
		}

		var simpletagData = [];
		var mactagData = [];
		var cardtagData = [];
		simpletagData.push(data.mobile);
		if (data.importSocials.length > 0) {
			for (var _i5 = 0; _i5 < data.importSocials.length; _i5++) {
				if (data.importSocials[_i5].type === 'mac') {
					mactagData.push(data.importSocials[_i5].socialAccount);
				}
				if (data.importSocials[_i5].type === 'mobile') {
					if (data.importSocials[_i5].socialAccount != data.mobile) {
						simpletagData.push(data.importSocials[_i5].socialAccount);
					}
				}
			}
		}

		if (data.importVechiles.length > 0) {
			for (var _i6 = 0; _i6 < data.importVechiles.length; _i6++) {
				cardtagData.push(data.importVechiles[_i6].vechileNo);
			}
		}

		for (var i = 0; i < simpletagData.length; i++) {
			$('#simple-tags').addTag(simpletagData[i]);
		}

		for (var i = 0; i < mactagData.length; i++) {
			$('#mac-tags').addTag(mactagData[i]);
		}

		for (var i = 0; i < cardtagData.length; i++) {
			$('#card-tags').addTag(cardtagData[i]);
		}

		if (data.importPersonTypeAndRootTypes.length > 0) {
			for (var _i7 = 0; _i7 < data.importPersonTypeAndRootTypes.length; _i7++) {
				var html = '<span data-id="' + data.importPersonTypeAndRootTypes[_i7].type.id + '">' + data.importPersonTypeAndRootTypes[_i7].type.typename + '<span class="glyphicon glyphicon-remove"></span></span>';
				$("#box").append(html);
			}
		}
	} else {
		$("#update-btn").attr("data-target", "");
		layer.msg('请选择要修改的列!', {
			icon: 2
		});
	}
});

//删除按钮点击事件
$("#delete-btn").click(function () {
	if (selectRowplcCar != null) {
		layer.confirm('是否确定要删除？', {
			btn: ['是的', '取消'] //按钮
		}, function () {
			deleteTwo("api/jp-BIRM-ControlObject-ms/BS/ImportPerson/", selectRowplcCar.id + "?userId=" + userId);
			selectRowplcCar = null;
		});
	} else {
		layer.msg('请选择要删除的信息列!', {
			icon: 2
		});
	}
});

function submitFormData() {

	var commentForm = $('#commentForm').serializeJSON();
	var phoneArray = $("#tag-this--simple-tags span").find("span");
	var macArray = $("#tag-this--mac-tags span").find("span");
	var cardArray = $("#tag-this--card-tags span").find("span");
	//console.log(phoneArray[0].innerHTML)
	// commentForm.importMACS = [];
	var typeArray = $("#box").children("span");
	//console.log(typeArray)
	if (phoneArray.length > 0) {
		commentForm.importSocials = [];

		commentForm.mobile = phoneArray[0].innerHTML;
	}
	commentForm.reportTime = $("#reportTime").val();
	if (cardArray.length > 0) {
		commentForm.importVechiles = [];
	}

	for (var i = 0; i < phoneArray.length; i++) {
		var importSocial = {
			socialAccount: phoneArray[i].innerHTML,
			type: 'mobile'
		};

		commentForm.importSocials.push(importSocial);
	}

	for (var _i8 = 0; _i8 < macArray.length; _i8++) {

		var importMAC = {
			socialAccount: macArray[_i8].innerHTML,
			type: 'mac'
			//console.log(macArray[i].innerHTML)
		};commentForm.importSocials.push(importMAC);
	}

	for (var _i9 = 0; _i9 < cardArray.length; _i9++) {
		var importVechile = {
			vechileNo: cardArray[_i9].innerHTML
		};
		commentForm.importVechiles.push(importVechile);
	}

	if (typeArray.length > 0) {
		commentForm.importPersonTypes = [];
		for (var _i10 = 0; _i10 < typeArray.length; _i10++) {
			var eletype = {
				id: typeArray[_i10].attributes[0].nodeValue
			};
			commentForm.importPersonTypes.push(eletype);
		}
	}

	var commentFormInfo = {
		importPerson: commentForm,
		importPersonInfo: {
			currentAddress: commentForm.currentAddress,
			formerName: commentForm.formerName,
			isWuhanIdcard: commentForm.isWuhanIdcard,
			personLevel: commentForm.personLevel
		}
	};
	return commentFormInfo;
}

//表单提交

function importantPersonAction() {
	var phoneArray = $("#tag-this--simple-tags span").find("span");
	var macArray = $("#tag-this--mac-tags span").find("span");
	var cardArray = $("#tag-this--card-tags span").find("span");
	//var myreg= /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$/;
	var reg_name = /[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}/;

	var num = 0; //记录手机号是否正确
	var num1 = 0; //记录mac地址是否正确

	for (var i = 0; i < phoneArray.length; i++) {
		var phone = phoneArray[i].innerHTML;
		if (phone.length != 11) {
			num++;
		}
	}

	for (var _i11 = 0; _i11 < macArray.length; _i11++) {
		var mac = macArray[_i11].innerHTML;
		if (!reg_name.test(mac)) {
			num1++;
		}
	}

	if (num > 0) {
		layer.msg('请输入正确的手机号', {
			icon: 2
		});
	} else if (num1 > 0) {
		layer.msg('请输入正确的mac地址', {
			icon: 2
		});
	} else if ($("#name").val().trim() == "" || $("#idCardNo").val().trim() == "" || $("#simple-tags").next().find(".tag span").text() == "") {
		layer.msg('请填写必填项', {
			icon: 2
		});
	} else {

		if (flag == "add") {
			//  console.log(JSON.stringify(commentFormInfo));
			var commentFormInfo = submitFormData();
			if ($("#downloadFileId").val() != null && $("#downloadFileId").val() != '') {
				commentFormInfo.importPerson.importPersonImages = [{
					url: $("#downloadFileId").val(),
					isDefault: 0
				}];
			}

			$.ajax({
				type: "post",
				url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/info?userId=" + userId,
				data: JSON.stringify(commentFormInfo),
				dataType: "text",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					if (data == 500 || data == '500') {
						layer.msg('新增失败', {
							icon: 2
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
						icon: 2
					});
					$('#myModal').modal('show');
				}
			});
		} else if (flag == "update") {
			var _commentFormInfo = submitFormData();

			for (var _i12 = 0; _i12 < onlydata.length; _i12++) {
				if (onlydata[_i12].id === selectRowplcCar.id) {
					flagPosition = _i12;
				}
			}
			var data = onlydata[flagPosition];
			if (data.importPersonInfoForBS.createTime != null && data.importPersonInfoForBS.createTime != '') {
				_commentFormInfo.importPersonInfo.createTime = data.importPersonInfoForBS.createTime;
			}
			_commentFormInfo.reportTime = _commentFormInfo.reportTime;

			if ($("#downloadFileId").val() != null && $("#downloadFileId").val() != '') {
				_commentFormInfo.importPerson.importPersonImages = [{
					url: $("#downloadFileId").val(),
					isDefault: 0
				}];
			} else {

				if (data.importPersonImages.length > 0) {
					if (data.importPersonImages[0].url != null && data.importPersonImages[0].url != '') {
						_commentFormInfo.importPerson.importPersonImages = [{
							url: data.importPersonImages[0].url,
							isDefault: 0
						}];
					}
				}
			}

			/*    let formData = {
       	importPersonAddForBS:commentFormInfo
       }*/

			// console.log(selectRowplcCar.id+"?userId="+userId)
			// console.log(JSON.stringify(commentFormInfo))

			$.ajax({
				type: "put",
				url: YZ.ajaxURLms + "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/info/" + selectRowplcCar.id + "?userId=" + userId,
				data: JSON.stringify(_commentFormInfo),
				dataType: "text",
				async: false,
				headers: {
					"Content-Type": "application/json;charset=UTF-8"
				},
				success: function success(data) {
					if (data == 500 || data == '500') {
						layer.msg('修改失败', {
							icon: 2
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
					console.log(returndata);
					layer.msg('修改失败', {
						icon: 2
					});
					$('#myModal').modal('show');
				}
			});
		}
	}
}

$(function () {
	var box = document.getElementById("box");
	$('.dropdown1').on("click", " li a", function () {
		title = $(this).text();
		var id = $(this).data("id");
		// id = $(this).attr("data-index");  
		$("#select-title").text("+新增分类");
		var span = '<span data-id="' + id + '">' + title;
		span = span + "<span class='glyphicon glyphicon-remove'></span></span>";
		$("#box").append(span);
		//	    $("#category_id").val(id);  
	});
	$(".box").on("click", ".glyphicon", function (e) {

		$(e.target).parent().remove();
	});
});

function previewImage(file) {
	var MAXWIDTH = 70;
	var MAXHEIGHT = 70;
	var div = document.getElementById('preview');
	if (file.files && file.files[0]) {
		div.innerHTML = '<img id=imghead onclick=$("#previewImg").click()>';
		var img = document.getElementById('imghead');
		img.onload = function () {
			var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
			img.width = rect.width;
			img.height = rect.height;
			//                 img.style.marginLeft = rect.left+'px';
			//          img.style.marginTop = rect.top+'px';
		};
		var reader = new FileReader();
		reader.onload = function (evt) {
			img.src = evt.target.result;
		};
		reader.readAsDataURL(file.files[0]);
	} else //兼容IE
		{
			var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
			file.select();
			var src = document.selection.createRange().text;
			div.innerHTML = '<img id=imghead>';
			var img = document.getElementById('imghead');
			img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
			var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
			status = 'rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height;
			div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
		}
}
function clacImgZoomParam(maxWidth, maxHeight, width, height) {
	var param = { top: 0, left: 0, width: width, height: height };
	if (width > maxWidth || height > maxHeight) {
		rateWidth = width / maxWidth;
		rateHeight = height / maxHeight;

		if (rateWidth > rateHeight) {
			param.width = maxWidth;
			param.height = Math.round(height / rateWidth);
		} else {
			param.width = Math.round(width / rateHeight);
			param.height = maxHeight;
		}
	}
	param.left = Math.round((maxWidth - param.width) / 2);
	param.top = Math.round((maxHeight - param.height) / 2);
	return param;
}
$(".clearImg").click(function () {
	$("#previewImg").val("");
});