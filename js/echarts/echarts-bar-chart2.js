var barChartsTwo = echarts.init(document.getElementById('echarts-bar-chart2'));
var barChartsTwoOption = {
	//     color:['#f37570','#80a9b0','#fdac94','#9bd4b9',
	//     // '#ff8a5b'
	// ],
	tooltip: {
		trigger: 'axis',
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	legend: {
		data: ['国保部门', '内保部门', '网安部门', '防恐部门']
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',
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
		},
		data: ['国保部门', '内保部门', '网安部门', '防恐部门']

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
	series: [{
		type: "bar",
		barWidth: 38,
		data: [2000, 3820, 3502, 2899],
		label: {
			normal: {
				show: true,
				position: "top"
				// textStyle: {
				// 	color: "94999f" // color of value
				// }
			}
		},
		itemStyle: {
			//通常情况下：
			normal: { //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
				color: function color(params) {
					var colorList = ['#f37570', '#80a9b0', '#fdac94', '#9bd4b9'];
					return colorList[params.dataIndex];
				}
			},
			//鼠标悬停时：
			emphasis: {
				shadowBlur: 10,
				shadowOffsetX: 0,
				shadowColor: 'rgba(0, 0, 0, 0.5)'
			}
		}
	}]
};
//barChartsTwo.setOption(barChartsTwoOption);
var now = new Date();
var end = now.toISOString();
now.setDate(1);
now.setHours(0);
now.setMinutes(0);
now.setSeconds(0);
now.setMilliseconds(0);
var start = new Date(now).toISOString();
var obj = {};
obj.start = start;
obj.end = end;
_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/count/reportunit/5?start=" + start + "&end=" + end, obj, function (result) {
	//	console.log(result);
	var ydata = [],
	    xdata = [];
	for (var i = 0; i < result.length; i++) {
		ydata.push(result[i]["property"]);
		xdata.push(result[i]["count"]);
	}
	barChartsTwoOption.xAxis[0].data = ydata, barChartsTwoOption.series[0].data = xdata, barChartsTwoOption.legend.data = ydata;
	barChartsTwo.setOption(barChartsTwoOption);
	setInterval(function () {
		barChartsTwo.clear();
		barChartsTwo.setOption(barChartsTwoOption);
	}, YZ.time * 60);
}, function () {});