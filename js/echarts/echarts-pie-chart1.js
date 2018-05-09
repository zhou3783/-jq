var pieCharts1 = echarts.init(document.getElementById('echarts-pie-chart1'));
var pieChartOption1 = {
	tooltip: {
		trigger: 'item',
		formatter: '{a} <br/>{b} : {c} ({d}%)'
	},
	toolbox: {
		feature: {
			saveAsImage: {}
		}
	},
	series: [{
		name: '重点人分布',
		type: 'pie',
		radius: '55%',
		center: ['50%', '50%'],
		data: [{
			value: 135,
			name: '一级重点人'
		}, {
			value: 208,
			name: '二级重点人'
		}, {
			value: 350,
			name: '三级重点人'
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
_ajax("g", "api/jp-BIRM-ControlObject-ms/BS/ImportPersonInfo/count/personLevel", null, function (result) {
	var ydata = [];
	for (var i = 0; i < result.length; i++) {
		var obj = {};
		obj.name = result[i]["property"];
		if (obj.name === null) {
			obj.name = '\u7A7A';
			continue;
		}
		obj.value = result[i]["count"];
		ydata.push(obj);
	}
	pieChartOption1.series[0].data = ydata;
	pieCharts1.setOption(pieChartOption1);
	setInterval(function () {
		pieCharts1.clear();
		pieCharts1.setOption(pieChartOption1);
	}, YZ.time * 60);
}, function () {});