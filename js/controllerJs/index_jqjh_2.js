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

    $.ajax({
        url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/zjks/all",
        type: "get",
        dataType: "json",
        async: false,
        contentType: 'application/json;charset=UTF-8',
        success: function success(data) {
            zjksAll.children = [];
            data.forEach(function (item) {
                if (item.id == 1) {
                    zjksAll.name = item.zjkName;
                    zjksAll.id = item.id;
                } else if (item.id == 4) {
                    zjksAll.children.push({
                        'name': item.zjkName,
                        'title': '<a class="btn btn-primary btn-handle btn-handle-add">添加</a>',
                        'id': item.id,
                        'class': 'green'
                    });
                } else {
                    zjksAll.children.push({
                        'name': item.zjkName,
                        'id': item.id
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
    }).on('click', '.node.green', function () {
        var $self = $(this);
        var id = $self.attr('id');
        var nodesLength = $self.parents('.nodes').length;
        if ($self.parent().parent().siblings('.nodes').length > 0) return;
        if (nodesLength == 1) {
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/zjks/findUnitByZjkId/" + id,
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    var childrenViews = [];
                    var data = data;
                    if (data && data.length > 0) {
                        currentViews = data;
                        data.forEach(function (item) {
                            var title;
                            //< a class = "btn btn-warning btn-handle btn-handle-delete" > 删除 < /a>
                            if (item.kgkz > 0) {
                                title = '<a class="btn btn-primary btn-handle btn-handle-edit">编辑</a><div class="switch" data-on-label="开" data-off-label="关"> <input type="checkbox" checked/></div>'
                            } else {
                                title = '<a class="btn btn-primary btn-handle btn-handle-edit">编辑</a><div class="switch" data-on-label="开" data-off-label="关"> <input type="checkbox"/></div>'
                            }
                            childrenViews.push({
                                'id': item.unitId,
                                'name': item.unitName,
                                'title': title
                            });
                        });
                        oc.addChildren($self, childrenViews);
                        $('.switch')['bootstrapSwitch']();
                    }
                }
            });
        } else if (nodesLength == 2) {
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/getViewsByUnitId/" + id,
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
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
    }).on('click', '.btn-handle-add',function (e) {
        var $self = $(this);
        e.stopPropagation();
        vueTemp1.type = 'add';
        vueTemp1.addItems = jsonArr_add;
        vueTemp1.addId = $self.parent().parent().attr('id');
    }).on('click', '.btn-handle-edit', function (e) {
        var self = vueTemp1;
        vueTemp1.editing = false;
        var id = $(this).parents('.node').attr('id');
        vueTemp1.editViewId = id;
        $.ajax({
            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/byUnitId/" + id,
            type: "get",
            dataType: "json",
            async: false,
            contentType: 'application/json;charset=UTF-8',
            success: function success(data) {
                    console.log(data)
                    jsonArr_edit = data;
                    var caseSmallClassesString = '';
                    var caseClassesString = '';
                    var caseTypesString = '';
                    jsonArr_edit.caseSmallClasses.forEach(function (item, index) {
                        if (index === 0) {
                            caseSmallClassesString = item.caseSmallClassId;
                        } else {
                            caseSmallClassesString = caseSmallClassesString + "," + item.caseSmallClassId;
                        }
                    })
                    jsonArr_edit.caseClasses.forEach(function (item, index) {
                        if (index === 0) {
                            caseClassesString = item.caseClassId;
                        } else {
                            caseClassesString = caseClassesString + "," + item.caseClassId;
                        }
                    })
                    jsonArr_edit.caseTypes.forEach(function (item, index) {
                        if (index === 0) {
                            caseTypesString = item.caseTypeId;
                        } else {
                            caseTypesString = caseTypesString + "," + item.caseTypeId;
                        }
                    })

                    if (caseSmallClassesString) {
                        $.ajax({
                            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByIds/" + caseSmallClassesString,
                            type: "get",
                            async: false,
                            contentType: 'application/json;charset=UTF-8',
                            success: function (data) {
                                var parentId = data[0].parentId;
                                jsonArr_edit.caseSmallClasses = data;
                                $.ajax({
                                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByParentId/" + parentId,
                                    type: "get",
                                    dataType: "json",
                                    async: false,
                                    contentType: 'application/json;charset=UTF-8',
                                    success: function success(data) {
                                        self.caseSmallClassesAll = data;
                                        return
                                        //   console.log(data)
                                    }
                                })
                            }
                        })
                    } else if (caseClassesString) {
                        $.ajax({
                            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByIds/" + caseClassesString,
                            type: "get",
                            async: false,
                            contentType: 'application/json;charset=UTF-8',
                            success: function (data) {
                                console.log(data)

                                $.ajax({
                                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByLever/1",
                                    type: "get",
                                    dataType: "json",
                                    async: false,
                                    contentType: 'application/json;charset=UTF-8',
                                    success: function success(data) {
                                        caseTypesAll = data;
                                        return
                                    }
                                }); //init caseTypesAll
                                jsonArr_edit.caseClasses = data;
                                self.caseClassesAll = data;
                            }
                        })
                    } else if (caseTypesString) {
                        jsonArr_edit.caseTypes = [];
                        $.ajax({
                            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByIds/" + caseTypesString,
                            type: "get",
                            async: false,
                            contentType: 'application/json;charset=UTF-8',
                            success: function (data) {
                                console.log(data)
                                jsonArr_edit.caseTypes = data;
                            }
                        })
                    }
                vueTemp1.editItems = jsonArr_edit;
                var _unitId = vueTemp1.editItems.units[0].unitId;
                var _unitName = '';

                vueTemp1.unitsAll.forEach(function (item) {
                    if (item.unitId == _unitId) {
                        _unitName = item.unitName;
                    }
                })
                vueTemp1.editItems['_unitName'] = _unitName;
                // console.log(vueTemp1.editItems.units[0].unitId)
                jsonArr_edit.caseTypes.forEach(function (item) {
                    self.caseTypesAll.forEach(function (item1) {
                        if (item.id == item1.id) {
                            item1.selected = true;
                        }
                    });
                });
                jsonArr_edit.caseClasses.forEach(function (item) {
                    self.caseClassesAll.forEach(function (item1) {
                        if (item.id == item1.id) {
                            item1.selected = true;
                        }
                    });
                });
                jsonArr_edit.caseSmallClasses.forEach(function (item) {
                    self.caseSmallClassesAll.forEach(function (item1) {
                        if (item.id == item1.id) {
                            item1.selected = true;
                        }
                    });
                });


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
        success: function success(data) {
            location.href = location.href;

            console.log("delete")
        },
        error: function success(data) {
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


    var vueTemp1 = new Vue({
        el: '#vue-temp-1',
        data: function(){
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
                editing: false
            }
        },
        created: function () {
            this.addItems = jsonArr_add;
            this.editItems = jsonArr_edit;
            this.initcaseTypeAll();
            this.initUnitsAll();
            
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
            initUnitsAll: function () {
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
                })
            },
            initUnitsChosenSelect: function () {
                var _self = this;
                if(_self.type == ''){
                    _self.type = 'add'
                }
                var someItems = _self.type + 'Items' //add edit
                console.log(someItems)
                $(".chosen-select").multipleSelect({
                    width: "100%",
                    single: true,
                    onClick: function (view) {
                        if(view.checked){
                            _self[someItems].units = [];
                            _self[someItems].units.push({
                                "unitId": view.value,
                                "name": view.label
                            })
                        }
                        console.log(_self[someItems].units)
                    }
                });
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
                        if(view.checked){
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
            initcaseTypeSelect: function() {
                var _self = this;
                $(_self.$refs.caseTypesAll).multipleSelect({
                    width: "100%",
                    placeholder: "请选择案件类型",
                    onCheckAll: function () {
                        _self.caseTypesChecked = []
                        _self.caseTypesAll.forEach(function(item){
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
                        if (view.checked) {//勾选
                            if (_self.caseTypesChecked.length == 0) {
                                _self.caseTypesChecked.push(view);
                            } else {
                                _self.caseTypesChecked.forEach(function (item) {
                                    if (item.value != view.value) {
                                        _self.caseTypesChecked.push(view);
                                    }
                                })
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
                        console.log(_self.caseTypesChecked)
                    }
                });            
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
                                "value": item.id
                            })
                             //更改视图
                           item1['selected'] = true
                            //shuju
                            _self.editItems.caseTypes.push(item)
                        })
                       
                        _self.changeCaseClassesAll()
                        console.log(_self.caseTypesChecked)
                    },
                    onUncheckAll: function () {
                        _self.caseTypesChecked = []
                        //更改视图
                        _self.caseTypesAll.forEach(function (item1) {
                            item1['selected'] = false
                        })
                        //shuju
                        _self.editItems.caseTypes = [];
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
                            _self.caseTypesAll.forEach(function (item1) {
                                if (item1.id == view.value) {
                                    item1['selected'] = view.checked
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
                        _self.changeCaseClassesAll();
                        console.log(_self.caseTypesChecked)

                        //更改选取的状态
                        _self.caseTypesAll.forEach(function(item1){
                            _self.caseTypesChecked.forEach(function(item2){
                                if(item1.id == item2.value){
                                    item1['selected'] = item2.checked
                                }
                            })
                        })
                        //shuju
                        _self.editItems.caseTypes = [];
                        _self.caseTypesChecked.forEach(function (item) {
                            _self.editItems.caseTypes.push({
                                'caseTypeId': item.value,
                                'typeName': item.label
                            })
                        })
                        //qingkongxianshishuju
                        _self.editItems.caseClasses = []
                        _self.editItems.caseSmallClasses = []
                        console.log(_self.caseTypesAll)
                    }
                });
            },
            initcaseClassesSelect: function() {
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
                                "value": item.id
                            })
                            //更改视图
                            item['selected'] = true
                            //shuju
                            _self.editItems.caseClasses.push(item)
                        })
                        
                       
                        //
                        _self.changeCaseSmallClassesAll()
                        console.log(_self.caseClassesChecked)
                    },
                    onUncheckAll: function () {
                        _self.caseClassesChecked = []
                        //更改视图
                        _self.caseClassesAll.forEach(function (item1) {
                            item1['selected'] = false
                        })
                        //shuju
                        _self.editItems.caseClasses = [];
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
                            _self.caseClassesAll.forEach(function (item1) {
                                if (item1.id == view.value) {
                                    item1['selected'] = view.checked
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
                        _self.caseClassesChecked.forEach(function (item) {
                            _self.editItems.caseClasses.push({
                                'caseClassId': item.value,
                                'typeName': item.label
                            })
                        })
                        //qingkongxianshishuju
                        // _self.editItems.caseClasses = []
                        _self.editItems.caseSmallClasses = []
                        console.log(_self.caseClassesChecked)
                    }
                });
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
                                "value": item.id
                            })
                            //更改视图
                            item['selected'] = true
                            //shuju
                            _self.editItems.caseSmallClasses.push(item)                            
                        })
                        console.log(_self.caseSmallClassesChecked)
                    },
                    onUncheckAll: function () {
                        _self.caseSmallClassesChecked = []
                        //更改视图
                        _self.caseClassesAll.forEach(function (item1) {
                            item1['selected'] = false
                        })
                        //shuju
                        _self.editItems.caseSmallClasses = [];
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
                        _self.caseSmallClassesChecked.forEach(function(item){
                            _self.editItems.caseSmallClasses.push({
                                'caseSmallClassId': item.value,
                                'typeName': item.label
                            })
                        })
                    }
                });
            },
            refresh:function(){
                $(this.$refs.caseTypesAll).multipleSelect('refresh');
                $(this.$refs.editCaseTypesAll).multipleSelect('refresh');
                $(this.$refs.caseClassesAll).multipleSelect('refresh');
                $(this.$refs.editCaseClassesAll).multipleSelect('refresh');
                $(this.$refs.caseSmallClassesAll).multipleSelect('refresh');
                $(this.$refs.editCaseSmallClassesAll).multipleSelect('refresh');
                $(this.$refs.editViewName).multipleSelect('refresh');
            },
            initcaseTypeAll: function initcaseTypeAll() {
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
            changeCaseClassesAll: function () {
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
            changeCaseSmallClassesAll: function () {
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
            add_save: function (e){
                var self = this;
                var $self = $(e.target);
                this.caseTypesChecked.forEach(function(item){
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
                // this.addItems.zjkId = this.addId;
                //暂时只有一个库所以直接设置的
                this.addItems.zjkId = 4
                if (this.addItems.viewName == '') {
                    this.addItems.viewName = 'JJdb';
                }
                var _addItems = JSON.stringify(this.addItems);

                $.ajax({
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
                    type: 'post',
                    dataType: "json",
                    async: false,
                    data: _addItems,
                    contentType: 'application/json;charset=UTF-8',
                    success: function (data){
                        location.href = location.href;
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
            zuhetype: function zuhetype(_type) {
                var _typeId = '';
                if (_type == 'caseTypes') {
                    return _typeId = 'caseTypeId';
                } else if (_type == 'caseClasses') {
                    return _typeId = 'caseClassId';
                } else if (_type == 'caseSmallClasses') {
                    return _typeId = 'caseSmallClassId';
                }
            },
            delete_selectAdd: function(item, index, name) {
                item.splice(index,1)
                $('.'+name).val('')
            },
            delete_select1: function delete_select1( i, items, name) {
                $('.' + name).val('')
                var self = this;
                items.forEach(function (item, index) {
                    if (item.id === i.id) {
                        self.editItems[name].splice(index, 1);
                    }
                })

            },
            delete_select: function delete_select(e, TypeId, id) {
                console.log(id)
                console.log(TypeId)
                var $self = $(e.target);
                var $parent = $self.parents('.form-group');
                var type = $parent.attr('type');
                var idName = $parent.attr('itemIdName');
                var self = this;
                var items = self[self.type + 'Items'];
                // if (self.type == "edit" && !self.editing) return;
                var _typeId = self.zuhetype(type);
                var _typeAll = type + 'All';
                // console.log(self.editItems[type])
                console.log(items[type])

                for (var i = 0; i < self.editItems[type].length; i++) {
                    if (self.editItems[type][i].id == id || self.editItems[type][i].id == TypeId || self.editItems[type][i][_typeId] == id || self.editItems[type][i][_typeId] == TypeId) { //默认选中
                        self[_typeAll].forEach(function (item1) {
                            if (TypeId == item1.id || id == item1.id) {
                                console.log(id)
                                console.log(TypeId)
                                console.log(item1)
                                item1.selected = false;
                                self.editItems[type].splice(i, 1)

                            }
                        });
                    }
                }
                var _id = undefined
                if(id != undefined){
                    _id = id
                }else if( TypeId != undefined){
                    _id = TypeId
                }
                self[type + 'All'].forEach(function(item){
                    if(item.id == _id){
                        item['selected'] = false
                    }
                })
                self[type+ 'Checked'].forEach(function (item, index) {
                    if (item.value == _id) {
                        self[type + 'Checked'].splice(index, 1);
                    }
                })
            },
            edit_addOne: function(e) {
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
                var data = this.editItems;
                var _data = JSON.stringify(data)
                console.log(_data)
                this.editing = false;
                var id = $('.editWrap').attr('edit-view-id');
                delete data.id;
                $.ajax({
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
                    type: "put",
                    dataType: "json",
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=UTF-8',
                    async: false,
                    success: function success(data) {
                        alert('修改成功');
                    },
                    error: function () {
                        location.href = location.href;
                        alert("修改成功");
                    }
                });
            },
            tempEdit: function () {
                this.editing = true;
            },
        },
        updated: function () {
            this.refresh();
        }
    })
})    
    
        
          
