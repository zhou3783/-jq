$(document).ready(function () {
var json_search = {
    "jjdwdm":'',
    "startTime":'',
    "endTime":'',
    "jqjb": '',
    "bjxldm": '',
    "bjlxdm": '',
    "bjlbdm": '',
    "periodStartTime": '',
    "periodEndTime": ''
}

    var start = {
        format: 'YYYY-MM-DD',
        minDate: '2014-06-16 ', //设定最小日期为当前日期
        // isinitVal: true,
        isinitVal:true,
        initDate:[true],
        maxDate: $.nowDate({
            DD: 0
        }), //最大日期
        // trigger: "mousedown",  //可绑定一个或多个事件
        okfun: function (obj) {
            end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
            // console.log(obj.elem); //得到当前输入框的ID
            // console.log(obj.val); //得到日期生成的值，如：2017-06-16
            json_search.startTime = obj.val;
            endDates();
        },
        clearfun: function (elem, val) {
            json_search.startTime = '';
        },

    };
    var end = {
        isinitVal: true,
        // format: 'YYYY-MM-DD- hh:mm:ss',
        format: 'YYYY-MM-DD',
        minDate: $.nowDate({
            DD: 0
        }), //设定最小日期为当前日期
        maxDate: '2099-06-16 23:59:59', //最大日期
        // maxDate: '2099-06-16 00:00:00', //最大日期
        // trigger: "mousedown", //可绑定一个或多个事件
        okfun: function (obj) {
            start.maxDate = obj.val; //将结束日的初始值设定为开始日的最大日期
            // console.log(obj.elem); //得到当前输入框的ID
            // console.log(obj.val); //得到日期生成的值，如：2017-06-16
            json_search.endTime = obj.val;

        },
        clearfun: function (elem, val) {
            json_search.startTime = '';
        }
    };

    var inpStartHour = {

        format:"hh:mm:ss",
        // minDate:"2014-06-16 00:00:00",              //最小日期 或者 "1900-01-01" 或者 "10:30:25"
        // maxDate:"2099-06-16 23:59:59",
        // range:" ~ ",

        okfun: function(obj){
            json_search.periodStartTime = obj.val;
            // console.log(obj.elem);
            //console.log(obj.val) // eg:13:39:43 ~ 16:43:46
        },
        clearfun: function (elem, val) {
            json_search.periodStartTime = '';
        }
    }
    var inpEndHour = {

        format:"hh:mm:ss",
        // minDate:"2014-06-16 00:00:00",              //最小日期 或者 "1900-01-01" 或者 "10:30:25"
        // maxDate:"2099-06-16 23:59:59",
        // range:" ~ ",

        okfun: function(obj){
            json_search.periodEndTime = obj.val;
            // console.log(obj.elem);
            //console.log(obj.val) // eg:13:39:43 ~ 16:43:46
        },
        clearfun: function (elem, val) {
            json_search.periodEndTime = '';
        }
    }

    //这里是日期联动的关键
    function endDates() {
        //将结束日期的事件改成 false 即可
        end.trigger = false;
        $("#inpend").jeDate(end);
    }

   $( function (){
       $('#inpstart').jeDate(start);
       $('#inpend').jeDate(end);
       $('#inpStartHour').jeDate(inpStartHour);
       $('#inpEndHour').jeDate(inpEndHour)
   });



var allNum = undefined;
var vueTemp1 = new Vue({
    el: '#vue-temp-1',
    data: function (){
        return {
            caseTypesAll: [],
            caseTypesChecked: [],
            caseClassesAll: [],
            caseClassesChecked: [],
            caseSmallClassesAll: [],
            caseSmallClassesChecked: [],
            unitsAll: [],
            time:[],
            nowIndex:0,
            xishuIndex:6,
            endIndex:undefined,
            showList : [],
            allList: [],
            numberList: [],
            myChart: null,
            totalsJQNum : undefined,
            zhanshi: false,
            xianShiTiaoShu: 6,
            detailsTarget:false,
            detailsContent:{},
            inputValue: ''

        }
       
    },
    created: function () {
        this.initcaseTypeAll();
        this.initUnitsAll();
        
    },
    mounted: function () {
        var _self = this;
        this.initcaseTypeSelect();
        this.initcaseClassesSelect();
        this.initcaseSmallClassesSelect();
        //初始化单位视图
        this.initchosenSelect();
        this.drawLine()


        this.initFenTiao();
    },
    computed: {
       
    },
    methods: {
        popDetails:function(index){
            this.detailsTarget = true
            this.detailsContent = this.showList[index]
            console.log(this.showList[index])

        },
        hideDetails:function(){
            this.detailsTarget = false
            console.log('hide')
        },
        initFenTiao: function(){
            var _self = this;
            if (_self.endIndex > _self.xishuIndex) {
               for (var i = 0; i < _self.xishuIndex; i++) {
                   _self.numberList.push({
                       'num': i
                   })
               }
            }else {
                 for (var i = 0; i < _self.endIndex; i++) {
                     _self.numberList.push({
                         'num': i
                     })
                 }
            }
        },
        fenYe: function(index){
            var _self = this;
            if (index === 'Previous'){
              if(_self.nowIndex - 1 < 0){
                  _self.nowIndex = 0
              }else{
                var _start = _self.numberList[0].num;
                if (_start > 0) {
                    _self.numberList = [];
                    var _numberList = [];
                    for (var i = 0; i < _self.xishuIndex; i++) {
                        _numberList.push({
                            'num': _start - 1 + i
                        });
                    }
                    _self.numberList = _numberList;

                }
                _self.nowIndex = _self.nowIndex - 1;
              }
            }
            if (index === 'Next'){
                if (_self.nowIndex + 1 >=  _self.endIndex) {
                    _self.nowIndex = _self.endIndex-1;
                    return
                    // // _self.numberList = [];
                    // _self.initFenTiao();
                    
                }else{
                    var _end = _self.numberList[_self.numberList.length - 1].num;
                    if (_self.nowIndex + 1 >= _self.xishuIndex ) {
                        _self.numberList = [];
                        var _numberList = [];
                        for (var i = 0; i < _self.xishuIndex; i++){
                            _numberList.push({
                                'num': _end - _self.xishuIndex + 2 + i
                            });
                        }
                        _self.numberList = _numberList;
                        
                    }else if(_self.nowIndex + 1 >= _self.endIndex  ){
                        return
                    }
                   _self.nowIndex = _self.nowIndex + 1;
                }
            }
            if (!isNaN(index)) {
                _self.nowIndex = index;
            }
            //更改显示列表
            var _star = _self.nowIndex*_self.xishuIndex
            if (_self.nowIndex + 1 >  _self.endIndex) {
                _self.showList = _self.allList.slice(_star)
                return;
            }
            _self.showList = _self.allList.slice(_star, _self.xianShiTiaoShu + _star)
            console.log(_self.showList)

        },
        shuzuquchong: function(arr){
            var _res = [];
            var _json = {};
            for(var i = 0; i < arr.length; i++){
                if(!_json[arr[i]]){
                    _res.push(arr[i]);
                    _json[arr[i]] = 1
                }
            }
            return _res;
        },
        initUnitsAll: function(){
            var _self = this;
            var _unitsAll = [];
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/policeStationInfos/",
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    _unitsAll = data;
                }
            });
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    var _dataUnitId = '';
                    data.forEach(function(item,index){
                        if(index == 0){
                            _dataUnitId = item.units[0].unitId;
                        }
                        _dataUnitId = _dataUnitId+','+item.units[0].unitId;
                    })
                    var _arUnitId = _dataUnitId.split(",");
                    var _unitId = _self.shuzuquchong(_arUnitId);
                    _unitsAll.forEach(function(item){
                       _unitId.forEach(function(item1){
                           if(item1 == item.unitId){
                               _self.unitsAll.push(item)
                           }
                       })
                    })
                }
            });
        },
        selectedChange: function ( id) {
            console.log(id)
        },
        initcaseTypeSelect: function initcaseTypeSelect(){
            var _self = this;
            $(_self.$refs.caseTypesAll).multipleSelect({
                width: "100%",
                // single: true,
                placeholder: "请选择案件类型",
                animate: 'slide',
                onCheckAll: function () {
                    _self.caseTypesChecked = []
                    _self.caseTypesAll.forEach(function (item) {
                        _self.caseTypesChecked.push({
                            "value": item.id
                        })
                    })
                    _self.changeCaseClassesAll()
                    console.log(_self.caseTypesChecked)
                },
                onUncheckAll: function () {
                    _self.caseTypesChecked = []
                    _self.changeCaseClassesAll()
                    console.log(_self.caseTypesChecked)
                },
                onClick: function (view) {
                    if (view.checked) { //勾选
                        if (_self.caseTypesChecked.length == 0) {
                            _self.caseTypesChecked.push(view);
                        } else {
                            _self.caseTypesChecked.forEach(function (item) {
                                if (item.value != view.value) {
                                    _self.caseTypesChecked.push(view);
                                }
                            })
                        }
                    } else { //取消
                        _self.caseTypesChecked.forEach(function (item, index) {
                            if (item.value == view.value) {
                                _self.caseTypesChecked.splice(index, 1);
                            }
                        })
                    }
                    if (_self.caseTypesChecked.length == 0) { //一项没选
                        _self.caseClassesAll = [];
                        _self.caseSmallClassesAll = [];
                    }
                    _self.changeCaseClassesAll();
                    console.log(_self.caseTypesChecked)

                    //单选逻辑
                    // json_search.bjlbdm = view.value;
                    // json_search.bjlxdm = ''
                    // json_search.bjxldm = ''
                    // _self.caseClassesAll = [];
                    // _self.caseSmallClassesAll = [];
                
                    // _self.changeCaseClassesAll([view])
                    //    -----end
                }
            });
        },
        initcaseClassesSelect: function initcaseClassesSelect() {
            var _self = this;
            $(_self.$refs.caseClassesAll).multipleSelect({
                width: "100%",
                // single: true,
                placeholder: "请选择案件类别",
                animate: 'slide',
                // selectAll:false,
                onCheckAll: function () {
                    _self.caseClassesChecked = []
                    _self.caseClassesAll.forEach(function (item) {
                        _self.caseClassesChecked.push({
                            "value": item.id
                        })
                    })
                    _self.changeCaseSmallClassesAll()
                    console.log(_self.caseClassesChecked)
                },
                onUncheckAll: function () {
                    _self.caseClassesChecked = []
                    _self.changeCaseSmallClassesAll()
                    console.log(_self.caseClassesChecked)
                },
                onClick: function (view) {
                    if (view.checked) {
                        if (_self.caseClassesChecked.length == 0) {
                            _self.caseClassesChecked.push(view);
                        } else {
                            _self.caseClassesChecked.forEach(function (item) {
                                if (item.value != view.value) {
                                    _self.caseClassesChecked.push(view);
                                }
                            })
                        }
                    } else {
                        _self.caseClassesChecked.forEach(function (item, index) {
                            if (item.value == view.value) {
                                _self.caseClassesChecked.splice(index, 1);
                            }
                        })
                    }
                    if (_self.caseClassesChecked.length == 0) {
                        _self.caseSmallClassesAll = [];
                    }
                    _self.changeCaseSmallClassesAll()
                    console.log(_self.caseClassesChecked)
                }
            });
        },
        initcaseSmallClassesSelect: function () {
            var _self = this;
            $(_self.$refs.caseSmallClassesAll).multipleSelect({
                width: "100%",
                // single: true,
                placeholder: "请选择案件类别",
                animate: 'slide',
                // selectAll: false,
                onCheckAll: function () {
                    _self.caseSmallClassesChecked = []
                    _self.caseSmallClassesAll.forEach(function (item) {
                        _self.caseSmallClassesChecked.push({
                            "value": item.id
                        })
                    })
                    console.log(_self.caseSmallClassesChecked)
                },
                onUncheckAll: function () {
                    _self.caseSmallClassesChecked = []
                    console.log(_self.caseSmallClassesChecked)
                },
                onClick: function (view) {
                    if (view.checked) {
                        if (_self.caseSmallClassesChecked.length == 0) {
                            _self.caseSmallClassesChecked.push(view);
                        } else {
                            _self.caseSmallClassesChecked.forEach(function (item) {
                                if (item.value != view.value) {
                                    _self.caseSmallClassesChecked.push(view);
                                }
                            })
                        }
                    } else {
                        _self.caseSmallClassesChecked.forEach(function (item, index) {
                            if (item.value == view.value) {
                                _self.caseSmallClassesChecked.splice(index, 1);
                            }
                        })
                    }
                }
            });
        },
        initchosenSelect: function () {
            $(".chosen-select-view").multipleSelect({
                width: "180px",
                single: true,
                placeholder: "请选择单位",
                animate: 'slide',
                onClick: function (view) {
                   json_search.jjdwdm = view.value;
                }
            });

            $(".chosen-select-jb").multipleSelect({
                width: "180px",
                single: true,
                placeholder: "请选择按键级别",
                animate: 'slide',
                onClick: function (view) {
                    json_search.jqjb = view.value;
                }
            });
        },
        refreshCaseTypesAll: function (){
            $(this.$refs.caseTypesAll).multipleSelect('refresh')
        },
        refreshcaseClassesAll: function () {
            $(this.$refs.caseClassesAll).multipleSelect('refresh')
        },
        refreshcaseSmallClassesAll: function () {
            $(this.$refs.caseSmallClassesAll).multipleSelect('refresh')
        },
        initcaseTypeAll: function initcaseTypeAll(){
            var _self = this;
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByLever/1",
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    _self.caseTypesAll = data;
                }
            }); //init caseTypesAll
        },
        changeCaseClassesAll: function(){
            var _self = this;
            var _session = [];
            _self.caseTypesChecked.forEach(function (item) {
                var id = item.value;
                $.ajax({
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByParentId/" + id,
                    type: "get",
                    dataType: "json",
                    async: false,
                    contentType: 'application/json;charset=UTF-8',
                    success: function success(data) {
                        _session = _session.concat(data);
                    }
                })
            })
            //通过一级初始化二级的数据
            _self.caseClassesAll = _session;
       },
        changeCaseSmallClassesAll: function (){
            var _self = this;
            var _session = [];
            _self.caseClassesChecked.forEach(function (item) {
                var id = item.value;
                $.ajax({
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByParentId/" + id,
                    type: "get",
                    dataType: "json",
                    async: false,
                    contentType: 'application/json;charset=UTF-8',
                    success: function success(data) {
                        _session = _session.concat(data);
                    }
                })
            })
            //通过二级初始化三级的数据
            _self.caseSmallClassesAll = _session;
        },
        caseTypeName: function(){
            var _self = this
            _self.showList.forEach(function(item1) {
                _self.caseTypesAll.forEach(function(item2){
                    if(item1.bjlbdm == item2.id){
                        item1['caseTypeName'] = item2.typeName;
                    }
                })
            })
        },
        search: function () {
            var _self = this;
            var _yongzongshujuceshi = [];
            _self.allList = [];
            json_search.bjlxdm = JSON.stringify(_self.caseTypesChecked)
            json_search.bjlbdm = JSON.stringify(_self.caseClassesChecked)
            json_search.bjxldm = JSON.stringify(_self.caseSmallClassesChecked)
            json_search['searchBox'] = _self.inputValue;
            if(json_search.jjdwdm == ''){
                alert('请先选择单位');
                return
            }
            if (json_search.startTime == '' || json_search.endTime == '') {
            	json_search.startTime = $.nowDate().split(' ')[0]
            	json_search.endTime = $.nowDate().split(' ')[0]
//          	alert('请选择天数');
//          	return
            }
            if (json_search.periodStartTime == '') {
            	json_search.periodStartTime = '00:00:00'
            }
            if (json_search.periodEndTime == '') {
            	json_search.periodEndTime = '23:59:59'
            }
            if ($.timeStampDate(json_search.periodStartTime) > $.timeStampDate(json_search.periodEndTime)) {
            	var _date = json_search.periodStartTime
            	json_search.periodStartTime = json_search.periodEndTime
            	json_search.periodEndTime = _date
            }
            console.log(JSON.stringify(json_search))
            $.ajax({
                        url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/jjdb/all",
                        type: "post",
                        dataType: "text",
                        async: false,
                        data: JSON.stringify(json_search),
                        contentType: 'application/json;charset=UTF-8',
                        success: function success(data) {
                            _self.totalsJQNum = data;
                            _yongzongshujuceshi = data;
                            // console.log(data)
                        }
                    })
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/jjdb/fromView",
                type: "post",
                dataType: "json",
                async: false,
                data: JSON.stringify(json_search),
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    _self.allList = data;
                    // console.log(data)
                }
            })
            _self.zhanshi = true
                // _self.allList = _yongzongshujuceshi;
                //更改分局为name
                _self.allList.forEach(function(item1){
                    _self.unitsAll.forEach(function(item2){
                        if (item2.unitId === item1.jjdwdm){
                            item1['name'] = item2.unitName
                        }
                    })
                })
                //初始化列表
                _self.showList = _self.allList.slice(0,6)
                _self.caseTypeName()
                // console.log(_self.showList)
                //初始化分页条
                _number = parseInt(_self.allList.length/_self.xishuIndex)
                if (_self.allList.length % _self.xishuIndex > 0){
                    _number++;
                }
                _self.endIndex = _number
                _self.numberList = []
                if (_number <  _self.xishuIndex ){
                    for (var i = 0; i < _number; i++) {
                        _self.numberList.push({
                            num: i
                        })
                    }
                }else{
                    for (var i = 0; i < _self.xishuIndex; i++) {
                        _self.numberList.push({
                            num: i
                        })
                    }
                }//---end---

            // console.log(json_search)
              
            // 填入数据
            if(!_self.totalsJQNum){
                _self.totalsJQNum = 0
            }
            if(!_self.allList.length){
                var _le = 0
            }else {
                _le = _self.allList.length
            }
            _self.myChart.setOption({
                series: [{
                    // 根据名字对应到相应的系列

                    data: [_self.totalsJQNum, _le]
                }]
            });
        },
        drawLine: function() {
            var _self = this;
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('myChart'))
            _self.myChart = myChart;
            // 绘制图表
            myChart.setOption({
                title: {
                    text: '警情展示图'
                },
                tooltip: {},
                xAxis: {
                    data: ['总警情', '视图数据']
                },
                yAxis: {
                     type: 'value'
                },
                series: [{
                    name: '警情数量',
                    type: 'bar',
                    data: []
                }]
            })
            // 处理点击事件并且跳转到相应的百度搜索页面
            myChart.on('click', function (params) {
//              window.open(
//                  'https://www.baidu.com/s?wd=' + encodeURIComponent(params.name)
//              )
            })
        }
    },
    updated: function(){
        this.refreshCaseTypesAll();
        this.refreshcaseClassesAll();
        this.refreshcaseSmallClassesAll();
    }
});

});