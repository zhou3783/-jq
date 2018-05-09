var barCharts = echarts.init(document.getElementById('echarts-bar-chart'));

var now = new Date().getTime();
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

var my_option = {
	color: ['#3398DB'],
	tooltip: {
		trigger: 'axis',
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',
		data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		axisTick: {
			show: false
		},
		axisLabel: {
			color: '#94999f'
		},
		splitLine: {
			show: false
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
			show: false
		},
		axisLine: {
			lineStyle: {
				color: '#94999f'
			}
		}
	}],
	series: [{
		name: '数量',
		type: 'bar',
		barWidth: '40%',
		data: [10, 52, 200, 334, 390, 330, 220],
		label: {
			normal: {
				show: true,
				position: 'top'
			}
		}
	}]
};
var url = 'api/jp-BIRM-ControlObject-ms/BS/ImportPerson/count/veidoo';
_ajax("g", url, null, function (data) {
	console.log(data);
	var series_data = []; //数量
	var xAxis_data = []; //列明
	for (var i = 0; i < data.length; i++) {

		switch (data[i].name) {
			case "mobile":

				xAxis_data.push("手机");
				break;
			case "image":

				xAxis_data.push("照片");
				break;
			case "mac":

				xAxis_data.push("MAC地址");
				break;
			case "vechile":

				xAxis_data.push("车牌号");
				break;
			case "dna":

				xAxis_data.push("DNA");
				break;
			case "fingerprint":

				xAxis_data.push("指纹");
				break;
			default:
				break;
		}

		series_data.push(data[i].count);
		//xAxis_data.push(data[i].name);	
	}

	my_option.xAxis[0].data = xAxis_data;
	my_option.series[0].data = series_data;

	barCharts.setOption(my_option);
	setInterval(function () {
		barCharts.clear();
		barCharts.setOption(my_option);
	}, YZ.time * 60);
}, function () {});