$(document).ready(function () {
  //$.jgrid.defaults.styleUI = 'Bootstrap';

  var zjksAll = {};
  var currentViews = [];

  var jsonArr_add = {
    "alarmCalls": [],
    "caseAddrs": [],
    "caseContents": [],

    "caseClasses": [],
    "caseSmallClasses": [],
    "caseTypes": [],
    "units": [],

    "comments": "",
    "kgkz": "1",
    "viewName": "",
    "viewPassword": "",
    "viewUserName": "",
    "zjkId": "4"
  };
  var jsonArr_edit = {
    "alarmCalls": [],
    "caseAddrs": [],
    "caseContents": [],

    "caseClasses": [],
    "caseSmallClasses": [],
    "caseTypes": [],
    "units": [],

    "comments": "",
    "kgkz": "1",
    "viewName": "",
    "viewPassword": "",
    "viewUserName": "",
    "zjkId": "4"
  };

  function shuzuquchong (arr) {
    var _res = [];
    var _json = {};
    for (var i = 0; i < arr.length; i++) {
      if (!_json[arr[i]]) {
        _res.push(arr[i]);
        _json[arr[i]] = 1
      }
    }
    return _res;
  }
  function resolveTransform (arr) {
    arr.forEach(function (t) {
      t['selected'] = false
    })
  }
  function trueChecked (arr1, arr2) {
    arr1.forEach(function (item1) {
      arr2.forEach(function (item2) {
        if (item1.id == item2.value) {
          item1['selected'] = true
        }
      })
    })
  }
	/* * JSON数组去重 
	* @param: [array] json Array 
	* @param: [string] 唯一的key名，根据此键名进行去重 
	*/ 
	function uniqueArray(array, key){ 
	  var result = [array[0]];
	  for(var i = 1; i < array.length; i++){ 
	  var item = array[i];
	  var repeat = false; 
	  for (var j = 0; j < result.length; j++) { 
	    if (item[key] == result[j][key]) { 
	      repeat = true; break; 
	    } 
	  } if (!repeat) { 
	      result.push(item); 
	    } 
	 } 
	 return result; 
	}
  $.ajax({
    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/zjks/all",
    type: "get",
    dataType: "json",
    async: false,
    contentType: 'application/json;charset=UTF-8',
    success: function success (data) {
      zjksAll.children = [];
      data.forEach(function (item) {
        if (item.id == 1) {
          zjksAll.name = item.zjkName;
          zjksAll.id = item.id;
        } else if (item.id == 4) {   //通过item.id==4判断出分局，渲染节点
          zjksAll.children.push({
            'name': item.zjkName,
            'title': '<a class="btn btn-primary btn-handle btn-handle-add">添加</a>',
            'id': item.id,    //这个id就是点击的时候传过去去的id
            'class': 'green'
          });
        } else {
          zjksAll.children.push({
            'name': item.zjkName,
            'id': item.id,//增加添加按钮,需要看下item.id添加上去没有
            'title': '<a class="btn btn-primary btn-handle btn-handle-add">添加</a>',
          });
        }
      });
    }
  });
  var oc = $('#orgChart-wrap-1').orgchart({
    'data': zjksAll,
    'nodeContent': 'title'
  });
  $('.col-sm-9').on('mouseover', '.node', function () {
    var $self = $(this);
    $self.find('.btn-handle').show();
    $self.find('.switch ').css('display', 'inline-block');
  }).on('mouseout', '.node', function () {
    var $self = $(this);
    $self.find('.btn-handle').hide();
    $self.find('.switch ').hide();
  }).on('click', '.node.green', function () { //点击类有green的节点
    var $self = $(this);
    var id = $self.attr('id');  //这个id是创建节点的时候从后台数据获取的
    var nodesLength = $self.parents('.nodes').length;
    if ($self.parent().parent().siblings('.nodes').length > 0) return;
    if (nodesLength == 1) {//如果是第一层节点,起始是零层
      $.ajax({
        url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/zjks/findUnitByZjkId/" + id,  //同过不同的id渲染出对应创建的试图节点
        type: "get",
        dataType: "json",
        async: false,
        contentType: 'application/json;charset=UTF-8',
        success: function success (data) {
        	console.log(data)//这个就是创建好的视图数据
          var childrenViews = [];
          var data = data;
          if (data && data.length > 0) {
            currentViews = data;
            data.forEach(function (item) {
              var title;
              //< a class = "btn btn-warning btn-handle btn-handle-delete" > 删除 < /a>
              if (item.kgkz > 0) {  //不知道这是什么
                title = '<a class="btn btn-primary btn-handle btn-handle-edit">编辑</a><div class="switch" data-on-label="开" data-off-label="关"> <input type="checkbox" checked/></div>'
              } else {
                title = '<a class="btn btn-primary btn-handle btn-handle-edit">编辑</a><div class="switch" data-on-label="开" data-off-label="关"> <input type="checkbox"/></div>'
              }
              childrenViews.push({      //渲染视图节点，上面的id就是对应分局的id
                'id': item.unitId,
                'name': item.unitName,
                'title': title
              });
            });
            oc.addChildren($self, childrenViews);
             $('.switch')['bootstrapSwitch']()
					}
        }
      });
    } else if (nodesLength == 2) {//二级节点点击事件
      $.ajax({
        url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/getViewsByUnitId/" + id,  //这就是视图对应分局的id，通过这个id找到创建的视图
        type: "get",
        dataType: "json",
        async: false,
        contentType: 'application/json;charset=UTF-8',
        success: function success (data) {
          var childrenViews = [];
          var data = data;
          if (data && data.length > 0) {
            currentViews = data;
            data.forEach(function (item) {
              var title;
              title = '<a class="btn btn-warning btn-handle btn-handle-delete">删除</a>';
              childrenViews.push({
                'id': item.id,
                'name': item.viewName,
                'title': title
              });
            });
            oc.addChildren($self, childrenViews);
            //$('.switch')['bootstrapSwitch']();
          }
        }
      });
    }
  }).on('click', '.btn-handle-add', function (e) {  //点击增加的时候要重新请求unitsAll，不同父节点的选项是不同的
    var $self = $(this);
    e.stopPropagation();
    vueTemp1.type = 'add';
    vueTemp1.addItems = jsonArr_add;
    vueTemp1.addId = $self.parent().parent().attr('id');
      //通过点击刷新单位选框
    vueTemp1.changeUnitsAll(vueTemp1.addId)
  }).on('click', '.btn-handle-edit', function (e) {
  	//编辑的时候需要取得编辑时候的分局的名称
    var self = vueTemp1;
    vueTemp1.editing = false;
    var id = $(this).parents('.node').attr('id');
    vueTemp1.editViewId = id;

    var eventLever2 = self.eventLever2
    var eventLever3 = self.eventLever3
    //初始化为空
    self.caseSmallClassesChecked = []
    self.caseClassesChecked = []
    self.caseTypesChecked = []
    self.editItems['caseSmallClasses'] = []
    self.editItems['caseClasses'] = []
    self.editItems['caseTypes'] = []
      //解决切换不同单位编辑转换的勾选问题
    resolveTransform(self.caseTypesAll)
    resolveTransform(self.caseClassesAll)
    resolveTransform(self.caseSmallClassesAll)
    self.caseClassesAll = []
    self.caseSmallClassesAll = []
    self.caseTypesAll.forEach(function(i){
      i['caseTypeId'] = i.id
    })

    $.ajax({
      url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/byUnitId/" + id,
      type: "get",
      dataType: "json",
      async: false,
      contentType: 'application/json;charset=UTF-8',
      success: function success (data) {
        console.log(data)
        //通过循环对比来初始化下拉菜单
        if (data.caseSmallClasses.length != 0) {
          //需要做两步操作，第一步：去重之后前四位为二级菜单，前两位为一级菜单；
          //第二步：对比显示本菜单
          //第一步 shuzuquchong
          var yijicaidan = []
          var erjicaidan = []
          var erhucaidanxianshishuju = []

          data.caseSmallClasses.forEach(function (item1) {
            erjicaidan.push(item1.caseSmallClassId.substring(0, 4))
          })
          erjicaidan = shuzuquchong(erjicaidan)
          erjicaidan.forEach(function (item1) {
            yijicaidan.push(item1.substring(0, 2))
          })
          yijicaidan = shuzuquchong(yijicaidan)
          //初始化一级菜单勾选项
          self.caseTypesAll.forEach(function (item1) {
            yijicaidan.forEach(function (item2) {
              if (item1.id == item2) {
                item1['selected'] = true
                item1['caseTypeId'] = item1.id
                self.editItems.caseTypes.push(item1)
                self.caseTypesChecked.push({
                  "value": item1.id,
                  "label": item1.typeName,
                  "checked": true
                })
                return
              }
            })
          })
          //初始化二级菜单显示项
          var _classes = []
          yijicaidan.forEach(function (item1) {
            eventLever2.forEach(function (item2) {
              if (item1 == item2.parentId) {
                _classes.push(item2)
              }
            })
          })
          self.caseClassesAll = _classes
          //初始化二级菜单勾选项 不会出现重复的项
          self.caseClassesAll.forEach(function (item1) {
            item1['selected'] = false
            erjicaidan.forEach(function (item2) {
              if (item1.id == item2 + '00') {
                // item1['selected'] = true
                item1['caseClassId'] = item1.id
                self.editItems.caseClasses.push(item1)
                self.caseClassesChecked.push({
                  "value": item1.id,
                  "label": item1.typeName,
                  "checked": true
                })
                return
              }
            })
          })
          trueChecked(self.caseClassesAll, self.caseClassesChecked)
          //初始化三级菜单显示项
          var _SmallClasses = []
          erjicaidan.forEach(function (item1) {
            eventLever3.forEach(function (item2) {
              if (item2.parentId == item1 + '00') {
                _SmallClasses.push(item2)
              }
            })
          })
          self.caseSmallClassesAll = _SmallClasses
          //初始化三级菜单勾选项
          self.caseSmallClassesAll.forEach(function (item1) {
            item1['selected'] = false
            data.caseSmallClasses.forEach(function (item2) {
              if (item1.id == item2.caseSmallClassId) {
                item1['caseSmallClassId'] = item1.id
                self.editItems.caseSmallClasses.push(item1)
                self.caseSmallClassesChecked.push({
                  "value": item1.id,
                  "label": item1.typeName,
                  "checked": true
                })
                return
              }
            })
          })
          trueChecked(self.caseSmallClassesAll, self.caseSmallClassesChecked)
        }  
        //上面已经通过三级菜单的值取得对应的二级菜单和一级菜单
        //self.caseSmallClassesAll    self.editItems.caseSmallClasses  self.caseSmallClassesChecked
        //self.caseClassesAll    self.editItems.caseClasses  self.caseClassesChecked
        //self.caseTypesAll    self.editItems.caseTypes  self.caseTypesChecked
        //但是页面显示的时候通过三级菜单选到的二级菜单没有被勾选 
        
        if (data.caseClasses.length != 0) {
//        //需要做两步操作，第一步：显示本级菜单，caseClasses.caseClassId 前两位为一级菜单；
//        //第二步：对比勾选本菜单和一级菜单
//        //第一步 shuzuquchong
          var yijicaidan = []
          data.caseClasses.forEach(function (item1) {
            yijicaidan.push(item1.caseClassId.substring(0, 2))
          })
          yijicaidan = shuzuquchong(yijicaidan)
//        //初始化一级菜单勾选项
          self.caseTypesAll.forEach(function (item1) {
            yijicaidan.forEach(function (item2) {
              if (item1.id == item2) {
                item1['selected'] = true
                item1['caseTypeId'] = item1.id
                self.editItems.caseTypes.push(item1)
                self.caseTypesChecked.push({
                  "value": item1.id,
                  "label": item1.typeName,
                  "checked": true
                })
                return
              }
            })
          })
//        //初始化二级菜单,通过一级菜单来显示所有二级菜单的兄弟
//        //初始化二级菜单显示项
          var _classes = []
          yijicaidan.forEach(function (item1) {
            eventLever2.forEach(function (item2) {
              if (item1 == item2.parentId) {
                _classes.push(item2)
              }
            })
          })
          self.caseClassesAll = self.caseClassesAll.concat( _classes )
//        //二级菜单勾选
          self.caseClassesAll.forEach(function (item1) {
            item1['selected'] = false
            data.caseClasses.forEach(function (item2) {
              if (item1.id == item2.caseClassId) {
                item1['selected'] = true
                item1['caseClassId'] = id
                self.editItems.caseClasses.push(item1)
                self.caseClassesChecked.push({
                  "value": item1.id,
                  "label": item1.typeName,
                  "checked": true
                })
                return
              }
            })
          })
          trueChecked(self.caseClassesAll, self.caseClassesChecked)
            //初始化三级菜单显示项
          var _SmallClasses = []
          self.caseClassesChecked.forEach(function (item1) {
            eventLever3.forEach(function (item2) {
              if (item2.parentId == item1.value) {
                _SmallClasses.push(item2)
              }
            })
          })
          self.caseSmallClassesAll = _SmallClasses
        } 
        /*
         *通过一级菜单的数据勾选出对应的二级数据
         * */
        if (data.caseTypes.length != 0) {
          self.caseTypesAll.forEach(function (item1) {
            data.caseTypes.forEach(function (item2) {
              if (item1.id == item2.caseTypeId) {
                item1['selected'] = true
                item1['caseTypeId'] = item1.id
                self.editItems.caseTypes.push(item1)
                self.caseTypesChecked.push({
                  "value": item1.id,
                  "label": item1.typeName,
                  "checked": true
                })
                return
              }
            })
          })
          self.editItems.caseTypes = uniqueArray(self.editItems.caseTypes,'caseTypeId')
          //通过一级数据去找二级数据
          //二级菜单显示项
          self.editItems.caseTypes.forEach(function (item1) {
            eventLever2.forEach(function (item2) {
              if (item1.id == item2.parentId) {
                self.caseClassesAll.push(item2)
              }
            })
          })
          self.caseClassesAll = uniqueArray(self.caseClassesAll,'id')
        }
        //数组去重
        self.editItems.caseTypes = uniqueArray(self.editItems.caseTypes,'id')
        self.editItems.caseClasses = uniqueArray(self.editItems.caseClasses, 'id')
        self.editItems.caseSmallClasses = uniqueArray(self.editItems.caseSmallClasses, 'id')
        self.caseTypesChecked = uniqueArray(self.caseTypesChecked, 'value') //会让空的数组添加一项undefined，造成后面的错误，所以要删除掉
        self.caseClassesChecked = uniqueArray(self.caseClassesChecked, 'value')
        self.caseSmallClassesChecked = uniqueArray(self.caseSmallClassesChecked, 'value')
				self.delUndefined(self.editItems.caseTypes)
				self.delUndefined(self.editItems.caseClasses)
				self.delUndefined(self.editItems.caseSmallClasses)
				self.delUndefined(self.caseTypesChecked)
				self.delUndefined(self.caseClassesChecked)
				self.delUndefined(self.caseSmallClassesChecked)


        vueTemp1.editItems["alarmCalls"] = data.alarmCalls
        vueTemp1.editItems["caseAddrs"] = data.caseAddrs
        vueTemp1.editItems["caseContents"] = data.caseContents
        vueTemp1.editItems["units"] = data.units
        vueTemp1.editItems["comments"] = data.comments
        vueTemp1.editItems["kgkz"] = data.kgkz
        vueTemp1.editItems["viewName"] = data.viewName
        vueTemp1.editItems["viewPassword"] = data.viewPassword
        vueTemp1.editItems["viewUserName"] = data.viewUserName
        vueTemp1.editItems["zjkId"] = data.zjkId
        vueTemp1.editItems["id"] = data.id
        vueTemp1.editItems["ids"] = data.ids
        vueTemp1.editItems["timestamp"] = data.timestamp
  
        var _unitId = vueTemp1.editItems.units[0].unitId;
        var _unitName = '';
  	//编辑的时候需要取得编辑时候的分局的名称
    //通过点击刷新单位选框
    vueTemp1.changeUnitsAll(data.zjkId)
        vueTemp1.unitsAll.forEach(function (item) {
          if (item.unitId == _unitId) {
            _unitName = item.unitName;
          }
        })
        vueTemp1.editItems['_unitName'] = _unitName;
        vueTemp1.type = 'edit';
      }
    })
  }).on('click', '.btn-handle-delete', function (e) {
    // e.stopPropagation();
    var id = $(this).parents('.node').attr('id');
    $.ajax({
      url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/" + id,
      type: "delete",
      dataType: "json",
      async: false,
      success: function success (data) {
        location.href = location.href;

        console.log("delete")
      },
      error: function success (data) {
        location.href = location.href;

        console.log("delete")
      }
    });
  })

  $('#1').addClass('green');
  $('#2').addClass('grey');
  $('#3').addClass('grey');
  $('#5').addClass('grey');
  $('#4').addClass('green');
  $('#4').click();
  $('#4').parent().parent().siblings('.nodes').find('.node').addClass('green');
  //改进点击为点击节点添加class,去掉兄弟类的绿色
    function _click(id) {
        $('.node.green').removeClass('green')
        $('.node').addClass('grey')
        $(id).addClass('green').removeClass('grey')
        $(id).parent().parent().siblings('.nodes').find('.node').addClass('green').removeClass('grey');
    }
$('#2').click(function () {
    _click('#2')
})
$('#3').click(function () {
    _click('#3')
})
$('#4').click(function () {
    _click('#4')
})
$('#5').click(function () {
    _click('#5')
})
	//点击开关，更改后台kgkz的状态（开关控制）
	$('.switch').on('switch-change', function (event,state) {
		var _unitId = $(this).parent().parent().attr('id')
		$.ajax({
			url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/updateKgkz/"+_unitId,
			type: 'post',
			dataType: 'text',
			// async: false,
			// data: _unitId,
			contentType: 'application/json;charset=UTF-8',
			success: function (data) {
				// console.log(data)
			}
		})

	});

  
  var vueTemp1 = new Vue({
    el: '#vue-temp-1',
    data: function () {
      return {
        caseTypesAll: [],
        caseTypesChecked: [],
        caseClassesAll: [],
        caseClassesChecked: [],
        caseSmallClassesAll: [],
        caseSmallClassesChecked: [],
        unitsAll: [],
        unitsChecked: [],
        addItems: {},
        editItems: {},
        type: '',
        addId: '',
        editViewId: '',
        editing: false,
        eventLever2: [],
        eventLever3: [],
        clickCaseType: false,
        clickCaseClasses: false,
        clickCaseSmallClasses: false
      }
    },
    created: function () {
      this.addItems = jsonArr_add;
      this.editItems = jsonArr_edit;
      this.initcaseTypeAll();
      this.initUnitsAll();
      this.initLever()

    },
    mounted: function () {
      var _self = this;
      this.initUnitsChosenSelect();
      this.initViewName();
      this.initEditViewName()

      this.initcaseTypeSelect();
      this.initEditCaseTypeSelect();
      this.initcaseClassesSelect();
      this.initEditCaseClassesSelect();
      this.initcaseSmallClassesSelect();
      this.initEditCaseSmallClassesSelect();


    },
    methods: {
			delUndefined: function (arr) {
				arr.forEach(function(i, index) {
					if(i === undefined){
						arr.splice(index, 1)
					}
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
            console.log(_self.eventLever2)

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
            console.log(_self.eventLever3)
          }
        }); //init eventLever3
      },
      initUnitsAll: function () {
        this.changeUnitsAll(4)
      },
      changeUnitsAll: function (stationType) {
          var _self = this;
          var _stationType = stationType - 1
          $.ajax({
              url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/policeStationInfos/stationType/"+_stationType,
              type: "get",
              dataType: "json",
              async: false,
              contentType: 'application/json;charset=UTF-8',
              success: function success (data) {
                console.log(data)
                _self.unitsAll = data;
                _self.checkedFalse(_self.unitsAll)
              }
          })
      },
      initUnitsChosenSelect: function () {
        var _self = this;
        if (_self.type == '') {
          _self.type = 'add'
        }
        var someItems = _self.type + 'Items' //add edit
        $(".chosen-select").multipleSelect({
          width: "100%",
          single: true,
          onClick: function (view) {
            if (view.checked) {
              _self[someItems].units = [];
              _self[someItems].units.push({
                "unitId": view.value,
                "name": view.label
              })
            }
            _self.unitsAll
          }
        });
      },
      checkedFalse: function(arr) {
        arr.forEach(function(i) {
          i['selected'] = false
        })
      },
      somethingTrue: function(arr, id) {
        arr.forEach(function(i) {
          if(arr.unitId === id) {
            i.selected = true
          }
        })
      },
      initViewName: function () {
        var _self = this;
        $(_self.$refs.viewName).multipleSelect({
          width: "100%",
          onCheckAll: function () {
            _self.addItems.viewName = "JJdb,CJdb,FKdb"
            console.log(_self.addItems.viewName)
          },
          onUncheckAll: function () {
            _self.addItems.viewName = "JJdb"
            console.log(_self.addItems.viewName)
          },
          onClick: function (view) {
            if (view.checked) {
              if (_self.addItems.viewName == '') {
                _self.addItems.viewName = 'JJdb' + "," + view.value
              } else if (_self.addItems.viewName.indexOf(view.value) == -1) {
                _self.addItems.viewName = _self.addItems.viewName + ',' + view.value
              }

            } else {
              if (_self.addItems.viewName.indexOf(view.value) != -1) {
                _self.addItems.viewName = _self.addItems.viewName.replace("," + view.value, '')
              }
            }
            console.log(_self.addItems.viewName)
          }
        })
      },
      initEditViewName: function () {
        var _self = this;
        $(_self.$refs.editViewName).multipleSelect({
          width: "100%",
          onCheckAll: function () {
            _self.editItems.viewName = "JJdb,CJdb,FKdb"
          },
          onUncheckAll: function () {
            _self.editItems.viewName = ""
          },
          onClick: function (view) {
            if (view.checked) {
              if (_self.editItems.viewName == '') {
                _self.editItems.viewName = 'JJdb' + "," + view.value
              } else if (_self.editItems.viewName.indexOf(view.value) == -1) {
                _self.editItems.viewName = _self.editItems.viewName + ',' + view.value
              }

            } else {
              if (_self.editItems.viewName.indexOf(view.value) != -1) {
                _self.editItems.viewName = _self.editItems.viewName.replace("," + view.value, '')
              }
            }
          }
        })
      },
      initcaseTypeSelect: function () {
        var _self = this;
        $(_self.$refs.caseTypesAll).multipleSelect({
          width: "100%",
          placeholder: "请选择案件类型",
          onCheckAll: function () {
            _self.caseTypesChecked = []
            _self.caseTypesAll.forEach(function (item) {
              _self.caseTypesChecked.push({
                "value": item.id
              })
            })

            _self.changeCaseClassesAll()

            // console.log(_self.caseTypesChecked)
          },
          onUncheckAll: function () {
            _self.caseTypesChecked = []
            _self.changeCaseClassesAll()
            console.log(_self.caseTypesChecked)

          },
          onClick: function (view) {
            if (view.checked) {//勾选
              if (_self.caseTypesChecked.length == 0) {
                _self.caseTypesChecked.push(view);
              } else {
                _self.caseTypesChecked.push(view);
              }
            } else {//取消
              _self.caseTypesChecked.forEach(function (item, index) {
                if (item.value == view.value) {
                  _self.caseTypesChecked.splice(index, 1);
                }
              })
            }
            if (_self.caseTypesChecked.length == 0) {//一项没选
              _self.caseClassesAll = [];
              _self.caseSmallClassesAll = [];
            }
            _self.changeCaseClassesAll();
            _self.clickCaseType = true
            // console.log(_self.caseTypesChecked)
          }
        });
      },
      allFalseCheked: function (arrAll) {
        arrAll.forEach(function (item) {
          item['selected'] = false
        })
      },
      initEditCaseTypeSelect: function () {
        var _self = this;
        $(_self.$refs.editCaseTypesAll).multipleSelect({
          width: "100%",
          placeholder: "请选择案件类型",
          onCheckAll: function () {
            _self.caseTypesChecked = []
            _self.editItems.caseTypes = [];
            _self.caseTypesAll.forEach(function (item) {
              _self.caseTypesChecked.push({
                "value": item.id,
                "label": item.typeName,
                "checked": true
              })
              //更改视图
              item['selected'] = true
              //shuju
              _self.editItems.caseTypes.push(item)
            })

            _self.changeCaseClassesAll()
            // console.log(_self.caseTypesChecked)
          },
          onUncheckAll: function () {
            _self.caseTypesChecked = []
            _self.caseClassesChecked = []
            _self.caseSmallClassesChecked = []
            //更改视图
            _self.allFalseCheked(_self.caseTypesAll)
            _self.allFalseCheked(_self.caseClassesAll)
            _self.allFalseCheked(_self.caseSmallClassesAll)

            //shuju
            _self.editItems.caseTypes = [];
            _self.editItems.caseClasses = [];
            _self.editItems.caseSmallClasses = [];
            _self.changeCaseClassesAll()
            _self.changeCaseSmallClassesAll()
            // console.log(_self.caseTypesChecked)
          },
          onClick: function (view) {
            if (view.checked) { //勾选
              if (_self.caseTypesChecked.length == 0) {
                _self.caseTypesChecked.push(view);
              } else {
                //勾选逻辑
                _self.caseTypesChecked.push(view);
              }
            } else { //取消
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
                  // _self.caseClassesChecked = []
                  // _self.caseSmallClassesChecked = []
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
            // console.log(_self.caseTypesChecked)

            //更改选取的状态
            _self.caseTypesAll.forEach(function (item1) {
              _self.caseTypesChecked.forEach(function (item2) {
                if (item1.id == item2.value) {
                  item1['selected'] = item2.checked
                }
              })
            })
            //shuju
            _self.editItems.caseTypes = [];
            _self.editItems.caseClasses = []
            _self.editItems.caseSmallClasses = []
            _self.editCaseShow(_self.caseTypesChecked, _self.editItems.caseTypes)
            _self.editCaseShow(_self.caseClassesChecked, _self.editItems.caseClasses)
            _self.editCaseShow(_self.caseSmallClassesChecked, _self.editItems.caseSmallClasses)
						_self.clickCaseType = true
          }
        });
      },
      editCaseShow: function (checkedArr, editCase) {
        if (checkedArr.length > 0 && checkedArr[0] != undefined) {
          checkedArr.forEach(function (item) {
            editCase.push({
                'id': item.value,
                'typeName': item.label
            })
          })
        }
      },
      initcaseClassesSelect: function () {
        var _self = this;
        $(_self.$refs.caseClassesAll).multipleSelect({
          width: "100%",
          placeholder: "请选择案件类别",
          onCheckAll: function () {
            _self.caseClassesChecked = []
            _self.caseClassesAll.forEach(function (item) {
              _self.caseClassesChecked.push({
                "value": item.id
              })
            })
            _self.changeCaseSmallClassesAll()
            // console.log(_self.caseClassesChecked)
          },
          onUncheckAll: function () {
            _self.caseClassesChecked = []
            _self.changeCaseSmallClassesAll()
            // console.log(_self.caseClassesChecked)
          },
          onClick: function (view) {
            if (view.checked) {//checked
              if (_self.caseClassesChecked.length == 0) {
                _self.caseClassesChecked.push(view);
              } else {
                _self.caseClassesChecked.push(view);

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
            _self.clickCaseClasses = true
            // console.log(_self.caseClassesChecked)
          }
        });
      },
      initEditCaseClassesSelect: function () {
        var _self = this;
        $(_self.$refs.editCaseClassesAll).multipleSelect({
          width: "100%",
          placeholder: "请选择案件类别",
          onCheckAll: function () {
            _self.caseClassesChecked = []
            //shuju
            _self.editItems.caseClasses = [];
            _self.caseClassesAll.forEach(function (item) {
              _self.caseClassesChecked.push({
                "value": item.id,
                "label": item.typeName,
                "checked": true
              })
              //更改视图
              item['selected'] = true
              //shuju
              _self.editItems.caseClasses.push(item)

            })
            _self.changeCaseSmallClassesAll()
            // console.log(_self.caseClassesChecked)
          },
          onUncheckAll: function () {
            //取消选中状态的数组
            _self.caseClassesChecked = []
            _self.caseSmallClassesChecked = []
            //更改视图
            _self.allFalseCheked(_self.caseClassesAll)
            _self.allFalseCheked(_self.caseSmallClassesAll)

            //shuju
            _self.editItems.caseClasses = [];
            _self.editItems.caseSmallClasses = [];
            _self.changeCaseSmallClassesAll()
            // console.log(_self.caseClassesChecked)
          },
          onClick: function (view) {
            if (view.checked) {
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

              // console.log(_self.caseSmallClassesChecked)
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
            //
            _self.editItems.caseClasses = [];
            _self.editItems.caseSmallClasses = [];
            _self.editCaseShow(_self.caseClassesChecked, _self.editItems.caseClasses)
            _self.editCaseShow(_self.caseSmallClassesChecked, _self.editItems.caseSmallClasses)
            _self.clickCaseClasses = true
          }
        });
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
      initcaseSmallClassesSelect: function () {
        var _self = this;
        $(_self.$refs.caseSmallClassesAll).multipleSelect({
          width: "100%",
          placeholder: "请选择案件类别",
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
                _self.caseSmallClassesChecked.push(view);
              }
            } else {
              _self.caseSmallClassesChecked.forEach(function (item, index) {
                if (item.value == view.value) {
                  _self.caseSmallClassesChecked.splice(index, 1);
                }
              })
            }
            _self.clickCaseSmallClasses = true
          }
        });
      },
      initEditCaseSmallClassesSelect: function () {
        var _self = this;
        $(_self.$refs.editCaseSmallClassesAll).multipleSelect({
          width: "100%",
          placeholder: "请选择案件类别",
          onCheckAll: function () {
            _self.caseSmallClassesChecked = []
            //
            _self.editItems.caseSmallClasses = [];
            _self.caseSmallClassesAll.forEach(function (item) {
              _self.caseSmallClassesChecked.push({
                "value": item.id,
                "label": item.typeName,
                "checked": true
              })
              //更改视图
              item['selected'] = true
              //shuju
              _self.editItems.caseSmallClasses.push(item)
            })
            // console.log(_self.caseSmallClassesChecked)
          },
          onUncheckAll: function () {
            _self.caseSmallClassesChecked = []
            //更改视图
            _self.caseSmallClassesAll.forEach(function (item1) {
              item1['selected'] = false
            })
            //shuju
            _self.editItems.caseSmallClasses = [];
            // console.log(_self.caseSmallClassesChecked)
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
            //通过checked数组给editItems传值
            _self.editItems.caseSmallClasses = [];
            _self.caseSmallClassesChecked.forEach(function (item) {
              _self.editItems.caseSmallClasses.push({
                'id': item.value,
                'typeName': item.label
              })
            })
            _self.clickCaseSmallClasses = true
          }
        });
      },
      initcaseTypeAll: function initcaseTypeAll () {
        var _self = this;
        $.ajax({
          url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByLever/1",
          type: "get",
          dataType: "json",
          async: false,
          contentType: 'application/json;charset=UTF-8',
          success: function success (data) {
            _self.caseTypesAll = data;
          }
        }); //init caseTypesAll
      },
      changeCaseClassesAll: function () {
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
      changeCaseSmallClassesAll: function () {
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
      add_save: function (e) {
        var self = this;
        var $self = $(e.target);
        this.caseTypesChecked.forEach(function (item) {
          self.addItems.caseTypes.push({
            "caseTypeId": item.value,
            "typeName": item.label
          })
        })
        this.caseClassesChecked.forEach(function (item) {
          self.addItems.caseClasses.push({
            "caseClassId": item.value,
            "typeName": item.label
          })
        })
        this.caseSmallClassesChecked.forEach(function (item) {
          self.addItems.caseSmallClasses.push({
            "caseSmallClassId": item.value,
            "typeName": item.label
          })
        })
        this.addItems.zjkId = this.addId;
        this.addItems.stationType   = this.addId - 1;

        //暂时只有一个库所以直接设置的
//      this.addItems.zjkId = 4
        if (this.addItems.viewName == '') {
          this.addItems.viewName = 'JJdb';
        }
        if (this.addItems.units.length === 0) {
          alert('请确定单位')
					return
        }
        if (!/^[A-Za-z]/.test(this.addItems.viewUserName)){
        	alert('用户名第一位必须为字母')
					return
				}
				if(this.addItems.viewPassword.length < 6) {
        	alert('密码必须大于6位数')
					return
				}
        var _addItems = JSON.stringify(this.addItems);

        $.ajax({
          url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
          type: 'post',
          dataType: "json",
          async: false,
          data: _addItems,
          contentType: 'application/json;charset=UTF-8',
          success: function (data) {
            location.href = location.href;
          },
					error:  function (error){
          	console.log(error)
            alert('保存错误，请检查')
					}
        })

        console.log(JSON.stringify(this.addItems));
      },
      add_addOne: function (e) {
        var $self = $(e.target);
        var value = $self.siblings('input').val();
        var type = $self.parents('.form-group').attr('type');
        var itemName = $self.parents('.form-group').attr('itemName');
        if (!value) return;
        var item = this.addItems[type];
        item.push({});
        item[item.length - 1][itemName] = value;
      },
      delete_selectAdd: function (item, index, name) {
        item.splice(index, 1)
        $('.' + name).val('')
      },
      delete_select1: function delete_select1 (i, items, name) {
        $('.' + name).val('')
        var self = this;
        items.forEach(function (item, index) {
          if (item.id === i.id) {
            self.editItems[name].splice(index, 1);
          }
        })

      },
      deleteType: function (id, Type) {
        var _self = this;
        switch (Type) {
          case "caseType":
            _self.caseTypesAll.forEach(function (item1) {
              if (item1.id == id) {
                item1['selected'] = false
                //设置为false后，通过改变数据的函数下级菜单显示会改变，但是选中的项在下次其父类被选中的时候
                // 还是会保留选中的状态，更改下级菜单的勾选状态为false
                if (_self.caseClassesAll.length > 0 && _self.caseClassesAll[0] != undefined)  {
                    _self.falseChecked(item1.id, _self.caseClassesAll, _self.caseClassesChecked)
                }
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
              if (item.value == id) {
                _self.caseTypesChecked.splice(index, 1);
              }
            })
            _self.changeCaseClassesAll();
            _self.changeCaseSmallClassesAll();
            //shuju
            _self.editItems.caseTypes = [];
            _self.editItems.caseClasses = []
            _self.editItems.caseSmallClasses = []
            _self.editCaseShow(_self.caseTypesChecked, _self.editItems.caseTypes)
            _self.editCaseShow(_self.caseClassesChecked, _self.editItems.caseClasses)
            _self.editCaseShow(_self.caseSmallClassesChecked, _self.editItems.caseSmallClasses)
            break
          case "caseClasse":
            _self.caseClassesAll.forEach(function (item1) {
              if (item1.id == id) {
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
              if (item.value == id) {
                _self.caseClassesChecked.splice(index, 1);
              }
            })
            if (_self.caseClassesChecked.length == 0) {
              _self.caseSmallClassesAll = [];
            }
            //改变下级菜单数据
            _self.changeCaseSmallClassesAll()
            //
            _self.editItems.caseClasses = [];
            _self.editItems.caseSmallClasses = [];
            _self.editCaseShow(_self.caseClassesChecked, _self.editItems.caseClasses)
            _self.editCaseShow(_self.caseSmallClassesChecked, _self.editItems.caseSmallClasses)
            break
          case "caseSmallClasse":
            _self.caseSmallClassesAll.forEach(function (item1) {
              if (item1.id == id) {
                item1['selected'] = false;
              }
            })
            _self.caseSmallClassesChecked.forEach(function (item, index) {
              if (item.value == id) {
                _self.caseSmallClassesChecked.splice(index, 1);
              }
            })
            //通过checked数组给editItems传值
            _self.editItems.caseSmallClasses = [];
            _self.caseSmallClassesChecked.forEach(function (item) {
              _self.editItems.caseSmallClasses.push({
                'id': item.value,
                'typeName': item.label
              })
            })
            break
        }
      },
      edit_addOne: function (e) {
        var $self = $(e.target);
        var value = $self.siblings('input').val();
        var type = $self.parents('.form-group').attr('type');
        var itemName = $self.parents('.form-group').attr('itemName');
        if (!value) return;
        // if (!this.editing) return;
        var item = this.editItems[type];
        item.push({});
        item[item.length - 1][itemName] = value;
      },
      valueChange: function (e) {
        var $self = $(e.target);
        var $parent = $self.parents('.form-group');
        var type = $parent.attr('type');
        if (this.type == "add") {
          this.addItems[type] = $self.val();
        } else {
          this.editItems[type] = $self.val();
        }
      },
      tempSave: function (e) {
      	if (this.editItems.caseTypes.length > 0 && this.editItems.caseTypes[0] != undefined) {
      		this.editItems.caseTypes.forEach(function(item){
      			item['caseTypeId'] = item.id
      		})
      	}
      	if (this.editItems.caseClasses.length > 0 && this.editItems.caseClasses[0] != undefined) {
      		this.editItems.caseClasses.forEach(function(item){
      			item['caseClassId'] = item.id
      		})	
      	}
      	if (this.editItems.caseSmallClasses.length > 0 && this.editItems.caseSmallClasses[0] != undefined) {
      		this.editItems.caseSmallClasses.forEach(function(item){
      			item['caseSmallClassId'] = item.id
      		})
      	}
      	
      	this.editItems['stationType'] = this.editItems.zjkId - 1  //这个zjkId是从后台获取的
        var data = this.editItems;
        var _data = JSON.stringify(data)
        console.log(_data)
        this.editing = false;
        var id = $('.editWrap').attr('edit-view-id');
        delete data.id;
        $.ajax({
          url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
          type: "put",
          dataType: "text",
          data: JSON.stringify(data),
          contentType: 'application/json;charset=UTF-8',
          async: false,
          success: function (data) {
          	location.href = location.href;
            alert('修改成功');
          },
					error: function(XMLHttpRequest, textStatus, errorThrown) {
		         console.log(XMLHttpRequest.status);
		         console.log(XMLHttpRequest.readyState);
		         console.log(textStatus);
		         alert('修改失败')
		      },
        });
      },
      tempEdit: function () {
        this.editing = true;
      },
      refresh: function () {
        $(this.$refs.caseTypesAll).multipleSelect('refresh');
        $(this.$refs.editCaseTypesAll).multipleSelect('refresh');
        $(this.$refs.caseClassesAll).multipleSelect('refresh');
        $(this.$refs.editCaseClassesAll).multipleSelect('refresh');
        $(this.$refs.caseSmallClassesAll).multipleSelect('refresh');
        $(this.$refs.editCaseSmallClassesAll).multipleSelect('refresh');
        $(this.$refs.editViewName).multipleSelect('refresh');
      },
    },
    updated: function () {
    	if (!this.clickCaseClasses && !this.clickCaseType && !this.clickCaseSmallClasses) {
    		this.refresh()
    	}
    	if (this.clickCaseClasses) {
    		$(this.$refs.caseSmallClassesAll).multipleSelect('refresh');
        $(this.$refs.editCaseSmallClassesAll).multipleSelect('refresh');
        this.clickCaseType = false
    	} 
    	if (this.clickCaseType) {
    		$(this.$refs.caseClassesAll).multipleSelect('refresh');
        $(this.$refs.editCaseClassesAll).multipleSelect('refresh');
        $(this.$refs.caseSmallClassesAll).multipleSelect('refresh');
        $(this.$refs.editCaseSmallClassesAll).multipleSelect('refresh');
    	}
    	this.clickCaseType = false
    	this.clickCaseClasses = false
    	this.clickCaseSmallClasses = false
    	$(this.$refs.editViewName).multipleSelect('refresh');
//    this.refresh();
    },
		watch: {
			unitsAll: {
				handler: function(val, oldVal){
					this.$nextTick(function(){
						$(this.$refs.unitsAllSelecte).multipleSelect('refresh');
					})
				}
			}
		}
   })
})    