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
            inputValue: ''
        }
       
    },
    created: function () {
        this.initcaseTypeAll();
        
    },
    mounted: function () {
        this.initcaseTypeSelect();
        this.initcaseClassesSelect();
        this.initcaseSmallClassesSelect();
        $(".chosen-select").chosen({
            width: "180px"
        });
        var start = {
            format: 'YYYY-MM-DD hh:mm:ss',
            minDate: '2014-06-16 23:59:59', //设定最小日期为当前日期
            isinitVal: true,
            maxDate: $.nowDate({
                DD: 0
            }), //最大日期
            okfun: function (obj) {
                end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
                endDates();
            }
        };
        var end = {
            format: 'YYYY-MM-DD- hh:mm:ss',
            minDate: $.nowDate({
                DD: 0
            }), //设定最小日期为当前日期
            maxDate: '2099-06-16 23:59:59', //最大日期
            okfun: function (obj) {
                start.maxDate = obj.val; //将结束日的初始值设定为开始日的最大日期
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

        //或者是
        $.jeDate('#inpstart', start);
        $.jeDate('#inpend', end);
    },
    computed: {
       
    },
    methods: {
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
            console.log(this.inputValue)
        },
    },
    updated: function(){
        this.refreshCaseTypesAll();
        this.refreshcaseClassesAll();
        this.refreshcaseSmallClassesAll();
    }
});


});