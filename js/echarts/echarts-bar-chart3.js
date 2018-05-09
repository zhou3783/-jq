// var xData = function() {
//     var data = [];
//     for (var i = 1; i < 13; i++) {
//         data.push(i + "月份");
//     }
//     return data;
// }();

var barChartThree = echarts.init(document.getElementById('echarts-bar-chart3'));
var barChartThreeoption = {
	color: ['#ff907f', '#02bfb7', '#0081c2', '#00dbf7', '#008093', '#06d9b4', '#0183fd', '#e8b000'],
	tooltip: {
		trigger: 'axis',
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	legend: {
		orient: 'horizontal',
		x: 'right',
		icon: 'roundRect',
		textStyle: {
			color: '#94999f'
		},
		data: ['警情类别错误', '电话格式错误', '地址类别错误', '出现辖区争议', '警情级别错误', '漏警/未处理', '警情定位缺失', {
			name: '异常警情总数',
			icon: 'line'
			//      	textStyle:{color:'#e8b000'}    //修改图例字体颜色
		}]
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',
		data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
		axisTick: {
			show: false
		},
		axisLabel: {
			color: '#94999f'
		},
		splitLine: {
			show: false,
			lineStyle: {
				color: '#272c34'
			}
		},
		axisLine: {
			lineStyle: {
				color: '#94999f'
			}
		}
	}],
	yAxis: [{
		type: 'value',
		axisTick: {
			show: false
		},
		axisLabel: {
			color: '#94999f'
		},
		splitLine: {
			show: false,
			lineStyle: {
				color: '#272c34'
			}
		},
		axisLine: {
			lineStyle: {
				color: '#94999f'
			}
		}
	}],
	//  splitLine:{
	//  	show:true,
	//  	lineStyle :{
	//  		color:'2b2b33'
	//  	}
	//  },
	series: [{
		name: '警情类别错误',
		type: 'bar',
		data: [40, 40, 40, 40, 40, 40, 40]
	}, {
		name: '电话格式错误',
		type: 'bar',
		data: [51, 49, 51, 51, 51, 51, 51]
	}, {
		name: '地址类别错误',
		type: 'bar',
		data: [5, 8, 10, 19, 18, 11, 13]

	}, {
		name: '出现辖区争议',
		type: 'bar',
		data: [33, 33, 33, 33, 33, 33, 33]
	}, {
		name: '警情级别错误',
		type: 'bar',
		data: [11, 11, 11, 11, 11, 11, 11]
		//          markLine : {
		//              lineStyle: {
		//                  normal: {
		//                      type: 'dashed'
		//                  }
		//              },
		//              data : [
		//                  [{type : 'min'}, {type : 'max'}]
		//              ]
		//          }
	}, {
		name: '漏警/未处理',
		type: 'bar',
		data: [13, 6, 10, 18, 21, 10, 47]
	}, {
		name: '警情定位缺失',
		type: 'bar',
		data: [13, 6, 10, 18, 14, 22, 18]
	}]
	//barChartThree.setOption(barChartThreeoption)

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
_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportChangeLog/count/byTime?start=" + start + "&end=" + end, null, function (data) {
	var xAxisTimes = [],
	    seriesTypes = [],
	    legendData = [],
	    xAxisTimesParse = [];
	for (var m in data) {
		xAxisTimes.push(m);
		xAxisTimesParse.push(new Date(m).toLocaleDateString());
	}
	for (var i = 0; i < data[xAxisTimes[0]].length; i++) {
		var tempType = {};
		switch (data[xAxisTimes[0]][i]["itemName"]) {
			case "mobile":
				tempType.name = "手机";
				legendData.push("手机");
				break;
			case "importpersonimage_url":
				tempType.name = "照片";
				legendData.push("照片");
				break;
			case "importsocial_socialaccount":
				tempType.name = "MAC地址";
				legendData.push("MAC地址");
				break;
			case "importvechile_vechileno":
				tempType.name = "车牌号";
				legendData.push("车牌号");
				break;
			case "importdna_dna":
				tempType.name = "DNA";
				legendData.push("DNA");
				break;
			case "importfingerprint_zwbh":
				tempType.name = "指纹";
				legendData.push("指纹");
				break;
			default:
				break;
		}
		tempType.type = 'bar';
		tempType.data = [];
		for (var j = 0; j < xAxisTimes.length; j++) {
			tempType.data.push(data[xAxisTimes[j]][i]["amount"]);
		}
		seriesTypes.push(tempType);
	}
	barChartThreeoption.legend.data = legendData;
	barChartThreeoption.xAxis[0].data = xAxisTimesParse;
	barChartThreeoption.series = seriesTypes;
	barChartThree.setOption(barChartThreeoption);
	setInterval(function () {
		barChartThree.clear();
		barChartThree.setOption(barChartThreeoption);
	}, YZ.time * 60);
}, function () {});