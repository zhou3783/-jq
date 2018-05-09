var lineChartWeek = echarts.init(document.getElementById('echarts-line-chart-week'));
var lineChartOption = {
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		top: '20%',
		bottom: '10%',
		left: '10%',
		right: '10%'
	},
	toolbox: {
		feature: {
			saveAsImage: {}
		}
	},
	smooth: true,
	legend: {
		data: [{
			name: '投资利益受损群体'
		}, {
			name: '涉邪教群体'
		}, {
			name: '严重精神障碍患者'
		}, {
			name: '维稳上访人员'
		}, {
			name: '扬言报复社会人员'
		}, {
			name: '暴恐危险份子'
		}, {
			name: '吸毒致幻人员'
		}],
		x: 'left',
		textStyle: {
			color: '#a4abb3',
			fontSize: '1rem'
		}
	},
	xAxis: {
		type: 'category',
		boundaryGap: true,
		data: ['12月4', '12月5', '12月6', '12月7', '12月8', '12月9', '12月10'],
		axisLabel: {
			textStyle: {
				color: '#a4abb3'
			}
		},
		axisLine: {
			show: false
		},
		axisTick: {
			show: false
		},
		splitLine: {
			show: false
		}
	},
	yAxis: {
		type: 'value',
		axisLabel: {
			textStyle: {
				color: '#a4abb3'
			}
		},
		axisLine: {
			show: false
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: '#a4abb3'
			}
		},
		axisTick: {
			show: false
		}
	},
	series: [{
		name: '投资利益受损群体',
		type: 'line',
		smooth: true,
		data: [3000, 3200, 6000, 6500, 2100, 10000, 5500],
		symbolSize: 5,
		markPoint: {
			symbolSize: 1
		}
		//    areaStyle: {
		// 		normal: {
		// 			color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		// 				offset: 0,
		// 				color: 'rgba(68, 208, 227, 0.3)'
		// 			}, {
		// 				offset: 0.8,
		// 				color: 'rgba(68, 68, 227, 0)'
		// 			}], false),
		// 			shadowColor: 'rgba(0, 0, 0, 0.1)',
		// 			shadowBlur: 10
		// 		}
		// 	}
	}, {
		name: '涉邪教群体',
		type: 'line',
		smooth: true,
		data: [8000, 9000, 7000, 8200, 7800, 7000, 7500],
		symbolSize: 5
	}, {
		name: '严重精神障碍患者',
		type: 'line',
		smooth: true,
		data: [6000, 7000, 3500, 6200, 5900, 7000, 7800],
		symbolSize: 5
	}, {
		name: '维稳上访人员',
		type: 'line',
		smooth: true,
		data: [6400, 5000, 4500, 6600, 4900, 8000, 8800],
		symbolSize: 5
	}, {
		name: '扬言报复社会人员',
		type: 'line',
		smooth: true,
		data: [2000, 8000, 9500, 6000, 2900, 7000, 7800],
		symbolSize: 5
	}, {
		name: '暴恐危险份子',
		type: 'line',
		smooth: true,
		data: [1000, 2000, 3700, 2200, 2900, 6000, 3900],
		symbolSize: 5
	}, {
		name: '吸毒致幻人员',
		type: 'line',
		smooth: true,
		data: [6700, 3100, 4500, 5200, 4200, 2500, 1100],
		symbolSize: 5
	}],
	color: ['#e8b000', '#d19a48', '#a57ba4', '#ff907f', '#02bfb7', '#0081c2', '#00dbf7']
	//lineChartWeek.setOption(lineChartOption);

	// var end = new Date(now - oneDayLong).toISOString();
};var now = new Date().getTime();
var oneDayLong = 24 * 60 * 60 * 1000;
var sevenDayAgo = now - 6 * oneDayLong;

var start = new Date(sevenDayAgo).toISOString();

function p(s) {
	return s < 10 ? '0' + s : s;
}
var myDate = new Date();
//获取当前年
var year = myDate.getFullYear();
//获取当前月
var month = myDate.getMonth() + 1;
//获取当前日
var date = myDate.getDate();
var h = myDate.getHours(); //获取当前小时数(0-23)
var m = myDate.getMinutes(); //获取当前分钟数(0-59)
var s = myDate.getSeconds();

var endtime = year + '-' + p(month) + "-" + p(date) + " " + p(h) + ':' + p(m) + ":" + p(s);
var end = new Date(endtime).toISOString();
_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportChangeLog/count/byType/ALL?start=" + start + "&end=" + end, null, function (data) {
	//更新
	var updateData = data["Update"];
	var addData = data["Add"];
	var removeData = data["Remove"];
	clickChange(updateData, lineChartOption, lineChartWeek);
	$("#tjAdd").click(function () {
		$(".span-type").removeClass("selected");
		$(this).addClass("selected");
		clickChange(addData, lineChartOption, lineChartWeek);
	});
	$("#tjUpdate").click(function () {
		$(".span-type").removeClass("selected");
		$(this).addClass("selected");
		clickChange(updateData, lineChartOption, lineChartWeek);
	});
	$("#tjDelete").click(function () {
		$(".span-type").removeClass("selected");
		$(this).addClass("selected");
		clickChange(removeData, lineChartOption, lineChartWeek);
	});
}, function () {});

function clickChange(updateData, lineChartOption, lineChartWeek) {
	var obj = {};
	var objType = {};
	var seriesData = [];
	var xAxisTimeData = [];
	var updateDataCopy = clone(updateData);
	var updateDataCopy1 = clone(updateData);
	var objTypes = [];
	var legendData = [];
	groupBy(updateDataCopy, "occurTime", obj);
	groupBy(updateDataCopy1, "typeName", objType);
	for (var t in obj) {
		xAxisTimeData.push(t);
	}
	for (var pro in objType) {
		objTypes.push(pro);
		legendData.push({
			name: pro
		});
	}
	for (var i = 0; i < objTypes.length; i++) {
		var tempObj = {};
		tempObj.name = objTypes[i];
		tempObj.type = 'line';
		tempObj.smooth = true;
		tempObj.symbolSize = 5;
		var datalist = [];
		for (var j = 0; j < objType[objTypes[i]].length; j++) {
			datalist.push(objType[objTypes[i]][j]["count"]);
		}
		tempObj.data = datalist;
		seriesData.push(tempObj);
	}
	lineChartOption.xAxis.data = xAxisTimeData;
	lineChartOption.series = seriesData;
	lineChartOption.legend.data = legendData;
	lineChartWeek.setOption(lineChartOption);
	setInterval(function () {
		lineChartWeek.clear();
		lineChartWeek.setOption(lineChartOption);
	}, YZ.time * 60);
}