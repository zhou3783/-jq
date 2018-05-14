$(document).ready(function () {
     

     /* $(".dataTables-example").dataTable();
      var oTable = $("#editable").dataTable();
      oTable.$("td").editable("../example_ajax.php", {
      "callback": function (sValue, y) {
      var aPos = oTable.fnGetPosition(this);
      oTable.fnUpdate(sValue, aPos[0], aPos[1])
      }, "submitdata": function (value, settings) {
      return {"row_id": this.parentNode.getAttribute("id"), "column": oTable.fnGetPosition(this)[2]}
      }, "width": "90%", "height": "100%"
      })*/

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
            endIndex:20,
            showList : [],
            allList: [{
                'afdz': '汉阳区永安堂1',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂2',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂3',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂4',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂5',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂1',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂2',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂3',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂4',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂5',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂1',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂2',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }, {
                'afdz': '汉阳区永安堂3',
                'jqzy': '报警人被打，要民警速到',
                'lsh': '2018000001',
                'fj': '分局',
                'lx': '类型',
                'lb': '类别',
                'xl': '细类',
                'ajdh': '1111',
                'neirong': '内容'
            }],
            numberList: []
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
        var start = {
            format: 'YYYY-MM-DD hh:mm:ss',
            minDate: '2014-06-16 23:59:59', //设定最小日期为当前日期
            isinitVal: true,
            maxDate: $.nowDate({
                DD: 0
            }), //最大日期
            okfun: function (obj) {
                end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
                // console.log(obj.elem); //得到当前输入框的ID
                // console.log(obj.val); //得到日期生成的值，如：2017-06-16
                _self.time.start = obj.val;
                endDates();
            },
        };
        var end = {
            format: 'YYYY-MM-DD- hh:mm:ss',
            minDate: $.nowDate({
                DD: 0
            }), //设定最小日期为当前日期
            maxDate: '2099-06-16 23:59:59', //最大日期
            okfun: function (obj) {
                start.maxDate = obj.val; //将结束日的初始值设定为开始日的最大日期
                // console.log(obj.elem); //得到当前输入框的ID
                // console.log(obj.val); //得到日期生成的值，如：2017-06-16
               _self.time.end = obj.val;
               console.log(_self.time)
            }
        };
        //这里是日期联动的关键
        function endDates() {
        //将结束日期的事件改成 false 即可
            end.trigger = false;
            $("#inpend").jeDate(end);
        }

        $('#inpstart').jeDate(start);
        $('#inpend').jeDate(end);

        this.initFenTiao();
    },
    computed: {
       
    },
    methods: {
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
                if (_self.nowIndex + 1 >  _self.endIndex) {
                    _self.nowIndex = 0;
                    _self.numberList = [];
                    _self.initFenTiao();
                }else{
                    var _end = _self.numberList[_self.numberList.length - 1].num;
                    if (_self.nowIndex + 1 > _self.xishuIndex) {
                        _self.numberList = [];
                        var _numberList = [];
                        for (var i = 0; i < _self.xishuIndex; i++){
                            _numberList.push({
                                'num': _end - _self.xishuIndex + 2 + i
                            });
                        }
                        _self.numberList = _numberList;
                        
                    }
                   _self.nowIndex = _self.nowIndex + 1;
                }
            }
            if (!isNaN(index)) {
                _self.nowIndex = index;
            }
            console.log(_self.nowIndex)
        },
        initUnitsAll: function(){
            var _self = this;
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/policeStationInfos/",
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    _self.unitsAll = data;
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
                placeholder: "请选择案件类型",
                onClick: function (view) {
                    if(_self.caseTypesChecked.length == 0){
                        _self.caseTypesChecked.push(view);
                    } else {
                        _self.caseTypesChecked.forEach(function(item){
                            if (item.value != view.value){
                                _self.caseTypesChecked.push(view);
                            }
                        })
                    }
                    _self.changeCaseClassesAll()
                }
            });
        },
        initcaseClassesSelect: function initcaseClassesSelect() {
            var _self = this;
            $(_self.$refs.caseClassesAll).multipleSelect({
                width: "100%",
                placeholder: "请选择案件类别",
                onClick: function (view) {
                    if (_self.caseClassesChecked.length == 0) {
                        _self.caseClassesChecked.push(view);
                    } else {
                        _self.caseClassesChecked.forEach(function (item) {
                            if (item.value != view.value) {
                                _self.caseClassesChecked.push(view);
                            }
                        })
                    }
                    _self.changeCaseSmallClassesAll()
                }
            });
        },
        initcaseSmallClassesSelect: function () {
            var _self = this;
            $(_self.$refs.caseSmallClassesAll).multipleSelect({
                width: "100%",
                placeholder: "请选择案件类别",
                onClick: function (view) {
                    if (_self.caseSmallClassesChecked.length == 0) {
                        _self.caseSmallClassesChecked.push(view);
                    } else {
                        _self.caseSmallClassesChecked.forEach(function (item) {
                            if (item.value != view.value) {
                                _self.caseSmallClassesChecked.push(view);
                            }
                        })
                    }
                    console.log(_self.caseSmallClassesChecked)
                }
            });
        },
        initchosenSelect: function () {
            $(".chosen-select").multipleSelect({
                width: "180px",
                single: true,
                onClick: function (view) {
                   console.log(view)
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
                // async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    _self.caseTypesAll = data;
                }
            }); //init caseTypesAll
        },
       changeCaseClassesAll: function(){
            var _self = this;
            var _session = [];
            _self.caseTypesChecked.forEach(function(item){
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
        changeCaseSmallClassesAll: function(){
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
        search: function search() {
            console.log('search')
        },
        drawLine: function() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                title: {
                    text: '警情展示图'
                },
                tooltip: {},
                xAxis: {
                    data: ['总警情', '屏蔽后警情']
                },
                yAxis: {
                     type: 'value'
                },
                series: [{
                    name: '警情数量',
                    type: 'bar',
                    data: [86, 50]
                }]
            })
            // 处理点击事件并且跳转到相应的百度搜索页面
            myChart.on('click', function (params) {
                window.open(
                    'https://www.baidu.com/s?wd=' + encodeURIComponent(params.name)
                )
            })
        },
        startTime: function(){
            console.log('startTime')
        },
        endTime: function () {}
    },
    updated: function(){
        this.refreshCaseTypesAll();
        this.refreshcaseClassesAll();
        this.refreshcaseSmallClassesAll();
    }
});


});