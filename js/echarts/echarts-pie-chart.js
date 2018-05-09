var pieCharts = echarts.init(document.getElementById('echarts-pie-chart'));
pieChartOption = {
	tooltip: {
		trigger: 'item',
		formatter: "{a} <br/>{b} : {c} ({d}%)"
	},
	toolbox: {
		feature: {
			saveAsImage: {}
		}
	},
	legend: {
		orient: 'vertical',
		left: 'left',
		data: [],
		textStyle: {
			color: [],
			fontStyle: 'normal',
			fontFamily: '微软雅黑',
			fontSize: 12
		},
		formatter: function formatter(name) {
			var oa = pieChartOption.series[0].data;
			var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value;
			for (var i = 0; i < pieChartOption.series[0].data.length; i++) {
				if (name == oa[i].name) {
					return name + '     ' + oa[i].value + '     ';
				}
			}
		}
	},
	series: [{
		name: '访问来源',
		type: 'pie',
		radius: '55%',
		center: ['50%', '60%'],
		data: [{
			value: 335,
			name: '直接访问'
		}, {
			value: 310,
			name: '邮件营销'
		}, {
			value: 234,
			name: '联盟广告'
		}, {
			value: 135,
			name: '视频广告'
		}, {
			value: 1548,
			name: '搜索引擎'
		}],
		itemStyle: {
			emphasis: {
				shadowBlur: 10,
				shadowOffsetX: 0,
				shadowColor: 'rgba(0, 0, 0, 0.5)'
			}
		}
	}]
};

//var pieChartOption = {
//	tooltip: {
//		trigger: 'item',
//		formatter: '{a} <br/>{b} : {c} ({d}%)'
//	},
//	legend: {
//		orient: 'vertical',
//		x: 'right',
//		data:["涉恐人员", "肇事肇祸精神病人", "在逃人员", "重大刑事犯罪前科人员", "555555555"],
//		formatter:function(name){
//			// var oa = pieChartOption.series[0].data;
//			// var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value;
//			// for(var i = 0; i < option.series[0].data.length; i++){
//			// 	if(name==oa[i].name){
//			// 		return name + '     ' + oa[i].value + '     ' + (oa[i].value/num * 100).toFixed(2) + '%';
//			// 	}
//			// }
//		}
//	},
//	series: [{
//		name: '访问来源',
//		type: 'pie',
//		radius: '55%',
//		center: ['50%', '50%'],
//		data: [{
//				value: 100,
//				name: '涉恐人员'
//			},
//			{
//				value: 200,
//				name: '肇事肇祸精神病人'
//			},
//			{
//				value: 40,
//				name: '在逃人员'
//			},
//			{
//				value: 60,
//				name: '重大刑事犯罪前科人员'
//			},
//			{
//				value: 70,
//				name: '555555555'
//			}
//		],
//		itemStyle: {
//			emphasis: {
//				shadowBlur: 10,
//				shadowOffsetX: 0,
//				shadowColor: 'rgba(0, 0, 0, 0.5)'
//			}
//		}
//	}]
//}

var total = function total() {

	_ajax("g", "api/jp-BIRM-ControlObject-ms/importperson/statistics/ALL", null, function (result) {
		var listData = [];
		for (var i = 0; i < result.length; i++) {
			var obj = {};
			obj.name = result[i]["importPersontypeName"];
			obj.value = result[i]["importPersonCount"];
			listData.push(obj);
		}
		pieChartOption.series[0].data = listData;
		var legendData = [];
		for (var j = 0; j < listData.length; j++) {
			var legendobj = {};
			legendobj = listData[j].name;
			legendData.push(legendobj);
		}
		pieChartOption.legend.data = legendData;
		pieCharts.setOption(pieChartOption);

		var innerHtml = '';
		for (var z = 0; z < result.length; z++) {
			var importPersontypeName = result[z]["importPersontypeName"],
			    iconUrl = '',
			    importPersonCount = result[z]["importPersonCount"];
			switch (result[z]["importPersontypeId"]) {
				case "0bf20ec2-e84a-4982-8740-b91714c83750":
					iconUrl = "tzlysshz.png";
					break;
				case "6010689905780536E0539BC8490A1317":
					iconUrl = "sxjqt.png";
					break;
				case "6010689905760536E0539BC8490A1317":
					iconUrl = "yzjszahz.png";
					break;
				case "60111FD728AF6C1FE0539BC8490AF23B":
					iconUrl = "wwsfry.png";
					break;
				case "6010689905790536E0539BC8490A1317":
					iconUrl = "yybfsh.png";
					break;
				case "6010689905740536E0539BC8490A1317":
					iconUrl = "bkwxfz.png";
					break;
				case "60111FD728B26C1FE0539BC8490AF23B":
					iconUrl = "xdzhry.png";
					break;
				default:
					iconUrl = "tzlysshz.png";
					break;
			}
			innerHtml += '<div class="row-div-w">\n\t\t\t\t\t<div class="widget style1 navy-bg">\n\t\t\t\t\t\t<div class="row vertical-align">\n\t\t\t\t\t\t\t<div class="col-xs-12 dimension">' + importPersontypeName + '</div>\n\t\t\t\t\t\t\t<div class="col-xs-3">\n\t\t\t\t\t\t\t\t<img src="./img/' + iconUrl + '" />\n\t\t\t\t\t\t\t\t<!-- <i class="fa fa-user fa-3x"></i> -->\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="col-xs-9 text-right">\n\t\t\t\t\t\t\t\t<span>\u603B\u6570</span><span class="wd-span">' + importPersonCount + '</span>\n\t\t\t\t\t\t\t\t<!-- <h2 class="font-bold">217</h2> -->\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>';
		}
		//$(".row-div").html(innerHtml);
	}, function () {});
};
total();
setInterval(function () {
	pieCharts.clear();
	total();
}, YZ.time * 60);
console.log(YZ.time * 60);