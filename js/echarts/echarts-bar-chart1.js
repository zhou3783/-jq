var barCharts1 = echarts.init(document.getElementById('echarts-bar-chart1'));
var barChartOption1 = {
	title: {
		text: "",
		textStyle: {
			color: "#5d5d5f"
		}
	},
	toolbox: {
		feature: {
			saveAsImage: {}
		}
	},
	tooltip: {
		axisPointer: {
			type: 'none'
		}, //去除指示线
		trigger: "axis",
		backgroundColor: "rgba(255,255,255,0.8)",
		extraCssText: "box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);",
		textStyle: {
			color: "#6a717b"
		}
	},
	grid: {
		left: "7%",
		right: "7%",
		bottom: "3%",
		top: "10%",
		// 防止标签溢出 会显示坐标轴标签在内
		containLabel: true
	},
	yAxis: [{
		type: "category",
		data: ["国保部门", "内保部门", "网安部门", "防恐部门"],
		axisTick: {
			// 是否显示坐标轴刻度
			show: false
		},
		axisLabel: {
			// 坐标轴样式设置
			margin: 50,
			textStyle: {
				fontSize: 12,
				color: "#94999f"
			}
		},
		axisLine: {
			show: false
		},
		splitLine: {
			show: false
		}
	}],
	xAxis: [{
		type: "value",
		axisLabel: {
			show: false
		},
		axisLine: {
			show: false
		},
		splitLine: {
			show: false
		},
		axisTick: {
			show: false
		}
	}],
	series: [{
		type: "bar",
		barWidth: 18,
		data: [3000, 2820, 1502, 899],
		label: {
			normal: {
				show: true,
				position: "insideRight",
				textStyle: {
					color: "white" // color of value
				}
			}
		},
		itemStyle: {
			normal: {
				color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
					offset: 0,
					color: "#ffcd32" // 0% 处的颜色
				}, {
					offset: 1,
					color: "#fed862" // 100% 处的颜色
				}], false),
				barBorderRadius: [15, 15, 15, 15],
				shadowColor: "rgba(0,0,0,0.1)",
				shadowBlur: 3,
				shadowOffsetY: 3
			}
		}
	}]
};
barCharts1.setOption(barChartOption1);
_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPerson/count/ownerGroup/5", null, function (result) {
	var ydata = [],
	    xdata = [];
	for (var i = 0; i < result.length; i++) {
		ydata.push(result[i]["property"]);
		xdata.push(result[i]["count"]);
	}
	barChartOption1.yAxis[0].data = ydata, barChartOption1.series[0].data = xdata;
	barCharts1.setOption(barChartOption1);
	setInterval(function () {
		barCharts1.clear();
		barCharts1.setOption(barChartOption1);
	}, YZ.time * 60);
}, function () {});