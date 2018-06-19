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
				yiji: [],
				stationType: '',
				unitsAll: [],
				time:[],
				myChart: null,
				totalsJQNum : undefined,
				list: [],
				zhanshi: false,
				pageSize: 6,
				pageNum: 0,
				detailsTarget:false,
				detailsContent:{},
				clickCaseType: false,
				clickCaseClasses: false,
				clickCaseSmallClasses: false,
        inputValue: '',
				eventLever2: [],
				eventLever3: [],
        unitsAllChecked: []
			}
       
    },
    created: function () {
        this.initcaseTypeAll();
        this.initUnitsAll();
			  this.initLever()
    },
    mounted: function () {
        var _self = this;
        this.initcaseTypeSelect();
        this.initcaseClassesSelect();
        this.initcaseSmallClassesSelect();
        //初始化单位视图
        this.initchosenSelect();
        //echars
        this.drawLine()
    },
    computed: {
       
    },
    methods: {
			allFalseCheked: function (arrAll) {
				arrAll.forEach(function (item) {
					item['selected'] = false
				})
			},
			initLever: function () {
				var _self = this;
				$.ajax({
					url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByLever/2",
					type: "get",
					dataType: "json",
					// async: false,
					contentType: 'application/json;charset=UTF-8',
					success: function success (data) {
						_self.eventLever2 = data;
						_self.allFalseCheked(_self.eventLever2)
						// console.log(_self.eventLever2)

					}
				}); //init eventLever2
				$.ajax({
					url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByLever/3",
					type: "get",
					dataType: "json",
					// async: false,
					contentType: 'application/json;charset=UTF-8',
					success: function success (data) {
						_self.eventLever3 = data;
						_self.allFalseCheked(_self.eventLever3)
						// console.log(_self.eventLever3)
					}
				}); //init eventLever3
			},
        popDetails:function(index){
            this.detailsTarget = true
            this.detailsContent = this.list[index]

        },
        hideDetails:function(){
            this.detailsTarget = false
            console.log('hide')
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
							url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/zjks/all",
							type: "get",
							dataType: "json",
							async: false,
							contentType: 'application/json;charset=UTF-8',
							success: function success (data) {
								var _session = []
								if(data.length > 0) {
									data.forEach(function(i) {
										if(i.lever === '1') {
											_session.push(i)
										}
									})
								}
								_self.yiji = _session
							}
					})
        },
			falseChecked: function (parentId, arr, checkedArr) {
				arr.forEach(function (item) {
					if (item.parentId == parentId) {
						item['selected'] = false
					}
					if (checkedArr.length > 0 && checkedArr[0] != undefined) { //勾选记录数组去除对应项
						checkedArr.forEach(function (item2, index) {
							if (item2.value.substring(0, 2) == parentId) {
								checkedArr.splice(index, 1)
							}
						})
					}
				})
			},
			initcaseTypeSelect: function () { //案件类型点击事件
				var _self = this;
				$(_self.$refs.caseTypesAll).multipleSelect({
					width: "100%",
					placeholder: "请选择案件类型",
					onCheckAll: function () {
						_self.caseTypesChecked = []
						_self.caseTypesAll.forEach(function (item) {
							_self.caseTypesChecked.push({
								"value": item.id,
								"label": item.typeName,
								"checked": true
							})
							item['selected'] = true
						})

						_self.changeCaseClassesAll()

					},
					onUncheckAll: function () {
						_self.caseTypesChecked = []
						_self.caseClassesChecked = []
						_self.caseSmallClassesChecked = []
						//更改视图
						_self.allFalseCheked(_self.caseTypesAll)
						_self.allFalseCheked(_self.caseClassesAll)
						_self.allFalseCheked(_self.caseSmallClassesAll)
						_self.changeCaseClassesAll()
						_self.changeCaseSmallClassesAll()
					},
					onClick: function (view) {
						if (view.checked) {//勾选
							if (_self.caseTypesChecked.length == 0) {
								_self.caseTypesChecked.push(view);
							} else {
								_self.caseTypesChecked.push(view);
							}
						} else {//取消
							_self.caseTypesAll.forEach(function (item1) {
								if (item1.id == view.value) {
									item1['selected'] = false
									//设置为false后，通过改变数据的函数下级菜单显示会改变，但是选中的项在下次其父类被选中的时候
									// 还是会保留选中的状态，更改下级菜单的勾选状态为false
									_self.falseChecked(item1.id, _self.caseClassesAll, _self.caseClassesChecked)
									_self.caseSmallClassesAll.forEach(function (item2) {
										if (item2.id.substring(0, 2) == item1.id) {
											item2['selected'] = false
										}
										_self.caseSmallClassesChecked.forEach(function (item3, index) {
											if (item3.value.substring(0, 2) == item1.id) {
												_self.caseSmallClassesChecked.splice(index, 1)
											}
										})
									})
								}
							 })
							//更改选取的列表
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
						//改变后面选项的显示数据
						_self.changeCaseClassesAll();
						_self.changeCaseSmallClassesAll();

						//更改选取的状态
						_self.caseTypesAll.forEach(function (item1) {
							_self.caseTypesChecked.forEach(function (item2) {
								if (item1.id == item2.value) {
									item1['selected'] = item2.checked
								}
							})
						})
						_self.clickCaseType = true
					}
				});
			},
			initcaseClassesSelect: function () { //案件类别
				var _self = this;
				$(_self.$refs.caseClassesAll).multipleSelect({
					width: "100%",
					placeholder: "请选择案件类别",
					onCheckAll: function () {
						_self.caseClassesChecked = []
						_self.caseClassesAll.forEach(function (item) {
							_self.caseClassesChecked.push({
								"value": item.id,
								"label": item.typeName,
								"checked": true
							})
							//更改视图
							item['selected'] = true
						})
						_self.changeCaseSmallClassesAll()
					},
					onUncheckAll: function () {
						_self.caseClassesChecked = []
						//更改视图
						_self.allFalseCheked(_self.caseClassesAll)
						_self.allFalseCheked(_self.caseSmallClassesAll)

						_self.changeCaseSmallClassesAll()
					},
					onClick: function (view) {
						if (view.checked) {//checked
							if (_self.caseClassesChecked.length == 0) {
								_self.caseClassesChecked.push(view);
							} else {
								_self.caseClassesChecked.push(view);
							}
						} else {
							_self.caseClassesAll.forEach(function (item1) {
								if (item1.id == view.value) {
									item1['selected'] = false
									//设置为false后，通过改变数据的函数下级菜单显示会改变，但是选中的项在下次其父类被选中的时候
									// 还是会保留选中的状态，更改下级菜单的勾选状态为false
									_self.caseSmallClassesAll.forEach(function (item2) {
										if (item2.parentId == item1.id) {
											item2['selected'] = false
										}
										_self.caseSmallClassesChecked.forEach(function (item3, index) {
											if ((item3.value.substring(0, 4) + "00") == item1.id) {
												_self.caseSmallClassesChecked.splice(index, 1)
											}
										})
									})
								}
							})

							_self.caseClassesChecked.forEach(function (item, index) {
								if (item.value == view.value) {
									_self.caseClassesChecked.splice(index, 1);
								}
							})
						}
						if (_self.caseClassesChecked.length == 0) {
							_self.caseSmallClassesAll = [];
						}
						//改变下级菜单数据
						_self.changeCaseSmallClassesAll()
						//更改选取的状态
						_self.caseClassesAll.forEach(function (item1) {
							_self.caseClassesChecked.forEach(function (item2) {
								if (item1.id == item2.value) {
									item1['selected'] = item2.checked
								}
							})
						})
						_self.clickCaseClasses = true
					}
				});
			},
			initcaseSmallClassesSelect: function () {//案件细类
				var _self = this;
				$(_self.$refs.caseSmallClassesAll).multipleSelect({
					width: "100%",
					placeholder: "请选择案件类别",
					onCheckAll: function () {
						_self.caseSmallClassesChecked = []
						_self.caseSmallClassesAll.forEach(function (item) {
							_self.caseSmallClassesChecked.push({
								"value": item.id,
								"label": item.typeName,
								"checked": true
							})
							//更改视图
							item['selected'] = true
						})
					},
					onUncheckAll: function () {
						_self.caseSmallClassesChecked = []
						//更改视图
						_self.caseSmallClassesAll.forEach(function (item1) {
							item1['selected'] = false
						})
					},
					onClick: function (view) {
						if (view.checked) {
							if (_self.caseSmallClassesChecked.length == 0) {
								_self.caseSmallClassesChecked.push(view);
							} else {
								_self.caseSmallClassesChecked.push(view);
							}
						} else {
							_self.caseSmallClassesAll.forEach(function (item1) {
								if (item1.id == view.value) {
									item1['selected'] = false;
								}
							})
							_self.caseSmallClassesChecked.forEach(function (item, index) {
								if (item.value == view.value) {
									_self.caseSmallClassesChecked.splice(index, 1);
								}
							})
						}
						//视图改变
						_self.caseSmallClassesAll.forEach(function (item1) {
							_self.caseSmallClassesChecked.forEach(function (item2) {
								if (item1.id == item2.value) {
									item1['selected'] = item2.checked
								}
							})
						})
						_self.clickCaseSmallClasses = true
					}
				});
			},
      initchosenSelect: function () {
        var self = this
        $(".chosen-select-yiji").multipleSelect({
          width: "180px",
          single: true,
          placeholder: "请选择单位",
          onClick: function (view) {
            if ( view.label === '__') {
              _self.unitsAll = []
            } else {
              self.changeErji(view.value)
            }
            self.stationType = view.value - 1
          }
        });
        $(".chosen-select-view").multipleSelect({//二级名称点击事件
          width: "180px",
          // single: true,
          placeholder: "请选择单位",
          onCheckAll: function () {
            self.unitsAllChecked = []
            self.unitsAll.forEach(function(item){
              self.unitsAllChecked.push({
                "value": item.id,
                "label": item.typeName,
                "checked": true
              })
              //更改视图
              item['selected'] = true
            })
          },
          onUncheckAll: function () {
            self.unitsAllChecked = []
            self.unitsAll.forEach(function(item1) {
              item1['selected'] = false
            })
          },
          onClick: function (view) {
            //确定点击
            if (view.checked) {
              self.unitsAllChecked.push(view)
            } else {
              self.unitsAll.forEach(function (item1) {
								if (item1.id == view.value) {
									item1['selected'] = false;
								}
							})
							self.unitsAllChecked.forEach(function (item, index) {
								if (item.value == view.value) {
									self.unitsAllChecked.splice(index, 1);
								}
							})
            }
            //视图改变
						self.unitsAll.forEach(function (item1) {
							self.unitsAllChecked.forEach(function (item2) {
								if (item1.id == item2.value) {
									item1['selected'] = item2.checked
								}
							})
						})
            //传给后台的结果
            json_search.jjdwdm = self.unitsAllChecked;
            console.log(self.unitsAllChecked) 
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
      changeErji: function (zjkId) {
        var _self = this
        $.ajax({
          url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/zjks/findUnitByZjkId/" + zjkId,
          type: "get",
          dataType: "json",
          async: false,
          contentType: 'application/json;charset=UTF-8',
          success: function success(data) {
            _self.unitsAll = data;
            _self.unitsAll.forEach(function(i, index) {
              if(index == 0){
                i['selectd'] = true
                json_search.jjdwdm = i.unitId
              }else {
                i['selected'] = false
              }
            })
          }
        });
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
              _self.allFalseCheked(_self.caseTypesAll)
          }
        }); //init caseTypesAll
      },
      changeCaseClassesAll: function(){
        var _self = this;
        var _session = [];

        _self.caseTypesChecked.forEach(function (item) {
          var id = item.value;//20
          _self.eventLever2.forEach(function (item2) {
            if (item2.parentId == id) {
              _session.push(item2)
            }
          })
        })
        //通过一级初始化二级的数据
        _self.caseClassesAll = _session;
      },
      changeCaseSmallClassesAll: function (){
        var _self = this;
        var _session = [];
        if (_self.caseClassesChecked.length != 0 && _self.caseClassesChecked[0] != undefined) {
          _self.caseClassesChecked.forEach(function (item) {
            var id = item.value;
            _self.eventLever3.forEach(function (item2) {
              if (item2.parentId == id) {
                _session.push(item2)
              }
            })
          })
          //通过二级初始化三级的数据
          _self.caseSmallClassesAll = _session;
        }
      },
      caseTypeName: function(){
        var _self = this
        _self.list.forEach(function(item1) {
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
          var bjlbdms = []
          _self.caseTypesChecked.forEach(function(item){
            bjlbdms.push(item.value)
            })
            var bjlxdms = []
            _self.caseClassesChecked.forEach(function(item){
                  bjlxdms.push(item.value)
              })
              var bjxldms = []
              _self.caseSmallClassesChecked.forEach(function(item){
                    bjxldms.push(item.value)
                })
          json_search['bjlbdms'] = bjlbdms
          json_search['bjlxdms'] = bjlxdms
          json_search['bjxldms'] = bjxldms
          json_search['searchBox'] = _self.inputValue;
          json_search['zjkId'] = parseInt(_self.stationType) + 1;
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
          json_search['stationType'] = _self.stationType
          console.log(JSON.stringify(json_search))
          $.ajax({
            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/jjdb/all/count", //查询总数
            type: "post",
            dataType: "text",
            async: false,
            data: JSON.stringify(json_search),
            contentType: 'application/json;charset=UTF-8',
            success: function success(data) {
                _self.totalsJQNum = data;
            }
          })
          var pageSearch = json_search
          pageSearch['pageSize'] = _self.pageSize
          pageSearch['pageNum'] = _self.pageNum
          $.ajax({
            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/jjdb/fromView/page",
            type: "post",
            dataType: "json",
            async: false,
            data: JSON.stringify(pageSearch),
            contentType: 'application/json;charset=UTF-8',
            success: function success(data) {
                _self.list = data.list;
              //中文显示caseTypeName
              _self.caseTypeName()
                var pages = data.pages
                //分页
              Page({
                num:pages,					//页码数
                startnum:1,				//指定页码
                elem:$('#page1'),		//指定的元素
                callback:function(n){	//回调函数
                  pageSearch['pageNum'] = n -1
                  $.ajax({
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/jjdb/fromView/page",
                    type: "post",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(pageSearch),
                    contentType: 'application/json;charset=UTF-8',
                    success: function success(data) {
                      _self.list = data.list;
                      //中文显示caseTypeName
                      _self.caseTypeName()
                    }
                  })
                }
              });

              //更改分局为name
              _self.list.forEach(function(item1){
                _self.unitsAll.forEach(function(item2){
                  if (item2.unitId === item1.jjdwdm){
                    item1['name'] = item2.unitName
                  }
                })
              })

              // echart填入数据
              if(!_self.totalsJQNum){
                _self.totalsJQNum = 0
              }
              if(!data.total){
                var _le = 0
              }else {
                _le = data.total
              }
              _self.myChart.setOption({
                series: [{
                  // 根据名字对应到相应的系列

                  data: [_self.totalsJQNum, _le]
                }]
              });
            }
          })
          _self.zhanshi = true


          // console.log(json_search)
            

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
			if (!this.clickCaseClasses && !this.clickCaseType && !this.clickCaseSmallClasses) {
				$(this.$refs.caseTypesAll).multipleSelect('refresh');
				$(this.$refs.caseClassesAll).multipleSelect('refresh');
				$(this.$refs.caseSmallClassesAll).multipleSelect('refresh');
			}
			if (this.clickCaseClasses) {
				$(this.$refs.caseSmallClassesAll).multipleSelect('refresh');
				this.clickCaseType = false
			}
			if (this.clickCaseType) {
				$(this.$refs.caseClassesAll).multipleSelect('refresh');
				$(this.$refs.caseSmallClassesAll).multipleSelect('refresh');
			}
      this.clickCaseType = false
      this.clickCaseClasses = false
      this.clickCaseSmallClasses = false
      $(this.$refs.selectView).multipleSelect('refresh')
    }
});//end vue

});//end ready