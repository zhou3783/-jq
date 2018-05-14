$(document).ready(function () {
var json_search = {
    "jjdwdm":'',
    "startTime":'',
    "endTime":'',
    "jqjb": '',
    "bjxldm": '',
    "bjlxdm": '',
    "bjlbdm": ''
}
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
            myChart: null
            
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
            // isinitVal: true,
            maxDate: $.nowDate({
                DD: 0
            }), //最大日期
            okfun: function (obj) {
                end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
                // console.log(obj.elem); //得到当前输入框的ID
                // console.log(obj.val); //得到日期生成的值，如：2017-06-16
                json_search.startTime = obj.val;
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
               json_search.endTime = obj.val;
               
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
                onClick: function (view) {
                    if(view.checked){//勾选
                        if (_self.caseTypesChecked.length == 0) {
                            _self.caseTypesChecked.push(view);
                        } else {
                            _self.caseTypesChecked.forEach(function (item) {
                                if (item.value != view.value) {
                                    _self.caseTypesChecked.push(view);
                                }
                            })
                        }
                    }else {//取消
                        _self.caseTypesChecked.forEach(function (item, index) {
                            if (item.value == view.value) {
                                _self.caseTypesChecked.splice(index, 1);
                            }
                        })
                    }
                    if (_self.caseTypesChecked.length==0){//一项没选
                        _self.caseClassesAll = [];
                        _self.caseSmallClassesAll = [];
                    }
                    _self.changeCaseClassesAll()
                    json_search.bjlbdm = _self.caseTypesChecked[0].value;
                }
            });
        },
        initcaseClassesSelect: function initcaseClassesSelect() {
            var _self = this;
            $(_self.$refs.caseClassesAll).multipleSelect({
                width: "100%",
                // single: true,
                placeholder: "请选择案件类别",
                onClick: function (view) {
                    if(view.checked){
                        if (_self.caseClassesChecked.length == 0) {
                            _self.caseClassesChecked.push(view);
                        } else {
                            _self.caseClassesChecked.forEach(function (item) {
                                if (item.value != view.value) {
                                    _self.caseClassesChecked.push(view);
                                }
                            })
                        }
                    }else{
                        _self.caseClassesChecked.forEach(function (item, index) {
                            if (item.value == view.value) {
                                _self.caseClassesChecked.splice(index, 1);
                            }
                        })
                    }
                    if (_self.caseClassesChecked.length == 0){
                        _self.caseSmallClassesAll = [];
                    }
                    
                    _self.changeCaseSmallClassesAll()
                    json_search.bjlxdm = _self.caseClassesChecked[0].value;
                }
            });
        },
        initcaseSmallClassesSelect: function () {
            var _self = this;
            $(_self.$refs.caseSmallClassesAll).multipleSelect({
                width: "100%",
                // single: true,
                placeholder: "请选择案件类别",
                onClick: function (view) {
                    if(view.checked){
                        if (_self.caseSmallClassesChecked.length == 0) {
                            _self.caseSmallClassesChecked.push(view);
                        } else {
                            _self.caseSmallClassesChecked.forEach(function (item) {
                                if (item.value != view.value) {
                                    _self.caseSmallClassesChecked.push(view);
                                }
                            })
                        }
                    }else{
                        _self.caseSmallClassesChecked.forEach(function (item, index) {
                            if (item.value == view.value) {
                                _self.caseSmallClassesChecked.splice(index, 1);
                            }
                        })
                    }

                    json_search.bjxldm = _self.caseSmallClassesChecked[0].value;
                }
            });
        },
        initchosenSelect: function () {
            $(".chosen-select-view").multipleSelect({
                width: "180px",
                single: true,
                onClick: function (view) {
                   json_search.jjdwdm = view.value;
                }
            });

            $(".chosen-select-jb").multipleSelect({
                width: "180px",
                single: true,
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
            var _self = this;
            _self.allList = [
                {
                        "xzqh": "420100",
                        "jjdbh": "20171116T01602404",
                        "gljjdbh": null,
                        "bjfsdm": "1",
                        "jjlxdm": "1",
                        "cllxdm": "1",
                        "jjdwdm": "420100250000",
                        "jjygh": "531",
                        "jjyxm": "吴文超",
                        "jjtbh": "T016",
                        "hrsj": "2017-11-16 10:01:13",
                        "bjsj": "2017-11-16 10:01:30",
                        "startTime": null,
                        "endTime": null,
                        "hzsj": null,
                        "hrsc": null,
                        "jjsc": 64,
                        "bJDH": "18627909828",
                        "yhxm": null,
                        "yhdz": null,
                        "bjrxm": "朱",
                        "bjrxb": "1",
                        "lxdh": "18627909828",
                        "afdd": "黄陂/政通检测站",
                        "bjnr": "昨天报过警，起纠纷。现报警人在现场，称对方私自开走我货车。",
                        "gxdwdm": "420116000000",
                        "bjlbdm": "20",
                        "bjlxdm": "209900",
                        "bjxldm": null,
                        "bjchpzl": null,
                        "bjcph": null,
                        "bkrs": null,
                        "ssrs": null,
                        "swrs": null,
                        "rsjzlxdm": null,
                        "qhbwdm": null,
                        "rsjzjgdm": null,
                        "qhlc": null,
                        "rswzbh": null,
                        "yfwxp": null,
                        "rsmj": null,
                        "jqjb": "2",
                        "zhdj": null,
                        "scbz": null,
                        "xzb": "114.365346",
                        "yzb": "30.914284",
                        "sjgxsj": "2017-11-16 10:02:40",
                        "jjdzt": "0",
                        "sfrgsc": "0",
                        "cjbs": "1",
                        "cfbj": "0",
                        "hjlsh": "2017111602187S001",
                        "tsgn": "1",
                        "bz": null,
                        "fadzlb": "99",
                        "fadzlx": null,
                        "nxhm": "393615",
                        "scscsj": "2017-11-16 10:02:40"
                    },
                    {
                        "xzqh": "420100",
                        "jjdbh": "20171116T00402415",
                        "gljjdbh": null,
                        "bjfsdm": "1",
                        "jjlxdm": "1",
                        "cllxdm": "1",
                        "jjdwdm": "420100250000",
                        "jjygh": "178",
                        "jjyxm": "崔颖",
                        "jjtbh": "T004",
                        "hrsj": "2017-11-16 10:02:31",
                        "bjsj": "2017-11-16 10:02:46",
                        "startTime": null,
                        "endTime": null,
                        "hzsj": null,
                        "hrsc": null,
                        "jjsc": 53,
                        "bJDH": "13597576241",
                        "yhxm": null,
                        "yhdz": null,
                        "bjrxm": "匿名",
                        "bjrxb": "1",
                        "lxdh": "13597576241",
                        "afdd": "青年路客运站",
                        "bjnr": "上厕所的时候车走了，行李都在车上，客运站不处理， 求助。",
                        "gxdwdm": "420103000000",
                        "bjlbdm": "50",
                        "bjlxdm": "500200",
                        "bjxldm": null,
                        "bjchpzl": null,
                        "bjcph": null,
                        "bkrs": null,
                        "ssrs": null,
                        "swrs": null,
                        "rsjzlxdm": null,
                        "qhbwdm": null,
                        "rsjzjgdm": null,
                        "qhlc": null,
                        "rswzbh": null,
                        "yfwxp": null,
                        "rsmj": null,
                        "jqjb": "3",
                        "zhdj": null,
                        "scbz": null,
                        "xzb": "114.271382",
                        "yzb": "30.592124",
                        "sjgxsj": "2017-11-16 10:05:09",
                        "jjdzt": "0",
                        "sfrgsc": "0",
                        "cjbs": "1",
                        "cfbj": "0",
                        "hjlsh": "2017111602207S001",
                        "tsgn": "1",
                        "bz": null,
                        "fadzlb": "22",
                        "fadzlx": "221",
                        "nxhm": "393603",
                        "scscsj": "2017-11-16 10:05:09"
                    },
                    {
                        "xzqh": "420100",
                        "jjdbh": "20171116T01902443",
                        "gljjdbh": null,
                        "bjfsdm": "1",
                        "jjlxdm": "1",
                        "cllxdm": "1",
                        "jjdwdm": "420100250000",
                        "jjygh": "144",
                        "jjyxm": "李丽娜",
                        "jjtbh": "T019",
                        "hrsj": "2017-11-16 10:04:20",
                        "bjsj": "2017-11-16 10:04:21",
                        "startTime": null,
                        "endTime": null,
                        "hzsj": null,
                        "hrsc": null,
                        "jjsc": 87,
                        "bJDH": "15927122152",
                        "yhxm": null,
                        "yhdz": null,
                        "bjrxm": "仇",
                        "bjrxb": "2",
                        "lxdh": "15927122152",
                        "afdd": "珞南所",
                        "bjnr": "早上手机被扒报过警，求助民警再联系。",
                        "gxdwdm": "420111000000",
                        "bjlbdm": "50",
                        "bjlxdm": "509900",
                        "bjxldm": null,
                        "bjchpzl": null,
                        "bjcph": null,
                        "bkrs": null,
                        "ssrs": null,
                        "swrs": null,
                        "rsjzlxdm": null,
                        "qhbwdm": null,
                        "rsjzjgdm": null,
                        "qhlc": null,
                        "rswzbh": null,
                        "yfwxp": null,
                        "rsmj": null,
                        "jqjb": "3",
                        "zhdj": null,
                        "scbz": null,
                        "xzb": "114.358876",
                        "yzb": "30.52009",
                        "sjgxsj": "2017-11-16 10:06:20",
                        "jjdzt": "0",
                        "sfrgsc": "0",
                        "cjbs": "1",
                        "cfbj": "0",
                        "hjlsh": "2017111602226S001",
                        "tsgn": "1",
                        "bz": null,
                        "fadzlb": "11",
                        "fadzlx": null,
                        "nxhm": "393618",
                        "scscsj": "2017-11-16 10:06:20"
                    },
                    {
                        "xzqh": "420100",
                        "jjdbh": "20171116T02402313",
                        "gljjdbh": null,
                        "bjfsdm": "1",
                        "jjlxdm": "1",
                        "cllxdm": "1",
                        "jjdwdm": "420100250000",
                        "jjygh": "549",
                        "jjyxm": "周玉佳",
                        "jjtbh": "T024",
                        "hrsj": "2017-11-16 09:51:57",
                        "bjsj": "2017-11-16 09:52:18",
                        "startTime": null,
                        "endTime": null,
                        "hzsj": null,
                        "hrsc": null,
                        "jjsc": 486,
                        "bJDH": "15878611873",
                        "yhxm": null,
                        "yhdz": null,
                        "bjrxm": "王",
                        "bjrxb": "1",
                        "lxdh": "15878611873",
                        "afdd": "欢乐大道杨家西湾公交站附近(武汉火车站往杨家西湾方向)洪山区利民办事处旁边路口进去100米小区内左边第一栋1403",
                        "bjnr": "自己怀疑儿子和儿子的女友和传销有关。自己和老伴去看他们时，他们带自己到处听课。现老伴不愿回来，自己叶联系不上他们了。",
                        "gxdwdm": "420111000000",
                        "bjlbdm": "50",
                        "bjlxdm": "509900",
                        "bjxldm": null,
                        "bjchpzl": null,
                        "bjcph": null,
                        "bkrs": null,
                        "ssrs": null,
                        "swrs": null,
                        "rsjzlxdm": null,
                        "qhbwdm": null,
                        "rsjzjgdm": null,
                        "qhlc": null,
                        "rswzbh": null,
                        "yfwxp": null,
                        "rsmj": null,
                        "jqjb": "3",
                        "zhdj": null,
                        "scbz": null,
                        "xzb": "0",
                        "yzb": "0",
                        "sjgxsj": "2017-11-16 10:08:26",
                        "jjdzt": "0",
                        "sfrgsc": "0",
                        "cjbs": "1",
                        "cfbj": "0",
                        "hjlsh": "2017111602123S001",
                        "tsgn": "1",
                        "bz": null,
                        "fadzlb": "12",
                        "fadzlx": "121",
                        "nxhm": "393623",
                        "scscsj": "2017-11-16 10:08:26"
                    },
                    {
                        "xzqh": "420100",
                        "jjdbh": "20171116T03102460",
                        "gljjdbh": null,
                        "bjfsdm": "1",
                        "jjlxdm": "1",
                        "cllxdm": "1",
                        "jjdwdm": "420100250000",
                        "jjygh": "437",
                        "jjyxm": "李梦蝶",
                        "jjtbh": "T031",
                        "hrsj": "2017-11-16 10:06:53",
                        "bjsj": "2017-11-16 10:06:54",
                        "startTime": null,
                        "endTime": null,
                        "hzsj": null,
                        "hrsc": null,
                        "jjsc": 57,
                        "bJDH": "13037115501",
                        "yhxm": null,
                        "yhdz": null,
                        "bjrxm": "徐",
                        "bjrxb": "1",
                        "lxdh": "13037115501",
                        "afdd": "雅安街 南湖医院旁边",
                        "bjnr": "8月交通事故后，对方一直不接我电话，行车证还在对方手中。",
                        "gxdwdm": "420100170000",
                        "bjlbdm": "50",
                        "bjlxdm": "509900",
                        "bjxldm": null,
                        "bjchpzl": null,
                        "bjcph": null,
                        "bkrs": null,
                        "ssrs": null,
                        "swrs": null,
                        "rsjzlxdm": null,
                        "qhbwdm": null,
                        "rsjzjgdm": null,
                        "qhlc": null,
                        "rswzbh": null,
                        "yfwxp": null,
                        "rsmj": null,
                        "jqjb": "3",
                        "zhdj": null,
                        "scbz": null,
                        "xzb": "114.325303",
                        "yzb": "30.521871",
                        "sjgxsj": "2017-11-16 10:09:00",
                        "jjdzt": "0",
                        "sfrgsc": "0",
                        "cjbs": "1",
                        "cfbj": "0",
                        "hjlsh": "2017111602245S001",
                        "tsgn": "1",
                        "bz": null,
                        "fadzlb": "16",
                        "fadzlx": null,
                        "nxhm": "393639",
                        "scscsj": "2017-11-16 10:09:00"
                    },
                    {
                        "xzqh": "420100",
                        "jjdbh": "20171116T01502483",
                        "gljjdbh": null,
                        "bjfsdm": "1",
                        "jjlxdm": "1",
                        "cllxdm": "1",
                        "jjdwdm": "420100250000",
                        "jjygh": "183",
                        "jjyxm": "曾诚",
                        "jjtbh": "T015",
                        "hrsj": "2017-11-16 10:07:38",
                        "bjsj": "2017-11-16 10:07:39",
                        "startTime": null,
                        "endTime": null,
                        "hzsj": null,
                        "hrsc": null,
                        "jjsc": 43,
                        "bJDH": "18627779220",
                        "yhxm": null,
                        "yhdz": null,
                        "bjrxm": "匿名",
                        "bjrxb": "1",
                        "lxdh": "18627779220",
                        "afdd": "古田二路武汉癫痫医院",
                        "bjnr": "医院被盗（损失待查）。",
                        "gxdwdm": "420104000000",
                        "bjlbdm": "20",
                        "bjlxdm": "201000",
                        "bjxldm": "201099",
                        "bjchpzl": null,
                        "bjcph": null,
                        "bkrs": null,
                        "ssrs": null,
                        "swrs": null,
                        "rsjzlxdm": null,
                        "qhbwdm": null,
                        "rsjzjgdm": null,
                        "qhlc": null,
                        "rswzbh": null,
                        "yfwxp": null,
                        "rsmj": null,
                        "jqjb": "2",
                        "zhdj": null,
                        "scbz": null,
                        "xzb": "114.20686",
                        "yzb": "30.610804",
                        "sjgxsj": "2017-11-16 10:10:13",
                        "jjdzt": "0",
                        "sfrgsc": "0",
                        "cjbs": "1",
                        "cfbj": "0",
                        "hjlsh": "2017111602252S001",
                        "tsgn": "1",
                        "bz": null,
                        "fadzlb": "10",
                        "fadzlx": "102",
                        "nxhm": "393614",
                        "scscsj": "2017-11-16 10:10:13"
                    },
                    {
                        "xzqh": "420100",
                        "jjdbh": "20171116T03102493",
                        "gljjdbh": null,
                        "bjfsdm": "1",
                        "jjlxdm": "1",
                        "cllxdm": "1",
                        "jjdwdm": "420100250000",
                        "jjygh": "437",
                        "jjyxm": "李梦蝶",
                        "jjtbh": "T031",
                        "hrsj": "2017-11-16 10:09:35",
                        "bjsj": "2017-11-16 10:09:36",
                        "startTime": null,
                        "endTime": null,
                        "hzsj": null,
                        "hrsc": null,
                        "jjsc": 85,
                        "bJDH": "13367267605",
                        "yhxm": null,
                        "yhdz": null,
                        "bjrxm": "江",
                        "bjrxb": "1",
                        "lxdh": "13367267605",
                        "afdd": "武胜路江山如画小区2期内",
                        "bjnr": "发现放包里价值4000多元的手机被偷，联系方式同上。",
                        "gxdwdm": "420104000000",
                        "bjlbdm": "10",
                        "bjlxdm": "100100",
                        "bjxldm": "100199",
                        "bjchpzl": null,
                        "bjcph": null,
                        "bkrs": null,
                        "ssrs": null,
                        "swrs": null,
                        "rsjzlxdm": null,
                        "qhbwdm": null,
                        "rsjzjgdm": null,
                        "qhlc": null,
                        "rswzbh": null,
                        "yfwxp": null,
                        "rsmj": null,
                        "jqjb": "2",
                        "zhdj": null,
                        "scbz": null,
                        "xzb": "0",
                        "yzb": "0",
                        "sjgxsj": "2017-11-16 10:11:40",
                        "jjdzt": "0",
                        "sfrgsc": "0",
                        "cjbs": "1",
                        "cfbj": "0",
                        "hjlsh": "2017111602263S001",
                        "tsgn": "1",
                        "bz": null,
                        "fadzlb": "12",
                        "fadzlx": "121",
                        "nxhm": "393639",
                        "scscsj": "2017-11-16 10:11:40"
                    }];


                _self.allList.forEach(function(item,index){
                    if(index < _self.xishuIndex){
                        _self.showList.push(item)
                    }
                })
                allNum = 10
                console.log(_self.allList.length)
            // 填入数据
            _self.myChart.setOption({
                series: [{
                    // 根据名字对应到相应的系列
                    name: '销量',
                    data: [_self.allList.length, 100]
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
                    data: ['总警情', '屏蔽后警情']
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
                window.open(
                    'https://www.baidu.com/s?wd=' + encodeURIComponent(params.name)
                )
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