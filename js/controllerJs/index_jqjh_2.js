$(document).ready(function () {
    //$.jgrid.defaults.styleUI = 'Bootstrap';
    
    var zjksAll = {};
    var currentViews = [];

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
                    zjksAll.children.push({'name': item.zjkName, 'id': item.id});
                }
            });
        }
    });
    
 
    var unitsAll = [];
    $.ajax({
        url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/policeStationInfos/",
        type: "get",
        dataType: "json",
        async: false,
        contentType: 'application/json;charset=UTF-8',
        success: function success(data) {
            unitsAll = data;
        }
    }); //init caseTypesAll
 var caseTypesAll = [];
 $.ajax({
     url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByLever/1",
     type: "get",
     dataType: "json",
     async: false,
     contentType: 'application/json;charset=UTF-8',
     success: function success(data) {
         caseTypesAll = data;
     }
 }); //init caseTypesAll

    var oc = $('#orgChart-wrap-1').orgchart({
        'data': zjksAll,
        'nodeContent': 'title'
    });



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
        // console.log($self.attr('data-parent'));//默认值是1
        // console.log(id);//属性上绑定的4
        //不显示第三层
        // return
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
                    // var data = [{
                    //     "id": null,
                    //     "viewId": null,
                    //     "unitId": "420188000000",
                    //     "unitName": "轨道交通分局",
                    //     "timestamp": null
                    // }, {
                    //     "id": null,
                    //     "viewId": null,
                    //     "unitId": "420188000001",
                    //     "unitName": "硚口交通分局",
                    //     "timestamp": null
                    // }]
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
    }).on('click', '.btn-handle-add', function (e) {
        var $self = $(this);
        e.stopPropagation();
        vueTemp1.type = 'add';
        vueTemp1.addItems = jsonArr_add;
        vueTemp1.addId = $self.parent().parent().attr('id');
        setTimeout(function () {
            vueTemp1.initSelect();
        }, 10);
    }).on('click', '.btn-handle-edit', function (e) {
        vueTemp1.type = 'edit';
        vueTemp1.editing = false;
        var id = $(this).parents('.node').attr('id');
        console.log(id)
        vueTemp1.editViewId = id;
        $.ajax({
            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/byUnitId/" + id,
            type: "get",
            dataType: "json",
            async: false,
            contentType: 'application/json;charset=UTF-8',
            success: function success(data) {
                var jsonArr_edit = data;
                // console.log(data);s
                // jsonArr_edit.caseTypes.forEach(function (item) {
                //     caseTypesAll.forEach(function (i) {
                //         if (item.caseTypeId == i.id) {
                //             item.name = i.name;
                //             i.selected = true;
                //         }
                //     });
                // });
                // jsonArr_edit.caseClasses.forEach(function (item) {
                //     item.selected = true;
                //     caseClassesAll.forEach(function (i) {
                //         if (item.caseClassId == i.id) {
                //             item.name = i.name;
                //             i.selected = true;
                //         }
                //     });
                // });
                // jsonArr_edit.caseSmallClasses.forEach(function (item) {
                //     item.selected = true;
                //     caseSmallClassesAll.forEach(function (i) {
                //         if (item.caseSmallClassId == i.id) {
                //             item.name = i.name;
                //             i.selected = true;
                //         }
                //     });
                // });
                // jsonArr_edit.units.forEach(function (item) {
                //     item.selected = true;
                //     unitsAll.forEach(function (i) {
                //         if (item.unitId == i.unitId) {
                //             item.name = i.name;
                //             i.selected = true;
                //         }
                //     });
                // });
                vueTemp1.editItems = jsonArr_edit;
                var _unitId = vueTemp1.editItems.units[0].unitId;
                var _unitName = '';
                
                vueTemp1.unitsAll.forEach(function(item) {
                    if (item.unitId == _unitId){
                        _unitName = item.unitName;
                    } 
                })
                vueTemp1.editItems['_unitName'] = _unitName;
                // console.log(vueTemp1.editItems.units[0].unitId)
                
                
                setTimeout(function () {
                    vueTemp1.initSelect();
                    vueTemp1.refreshSelect();
                }, 10);
            }
        });
    }).on('click', '.btn-handle-delete', function (e) {
        // e.stopPropagation();
        var id = $(this).parents('.node').attr('id');
        $.ajax({
            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/" + id,
            type: "delete",
            dataType: "json",
            async: false,
            success: function success(data) {
                 setTimeout(() => {
                     location.href = location.href;
                 }, 10);
                 console.log("delete")
            }
        });
    }).on('change', 'input[data-name=selectItem]', function (e) {
        var $self = $(this);
        $self.parents('.ms-parent').siblings('select.multiple-select').trigger('click');
    }).on('change', 'input[data-name=selectAll]', function (e) {
        var $self = $(this);
        $self.parents('.ms-parent').siblings('select.multiple-select').trigger('click');
    }).on('change', '.chosen-select', function (e) {
        var $self = $(this);
        $self.trigger('click');
    }).on('change', '.switch input[type=checkbox]', function (e) {
        var $self = $(this);
        $.ajax({
            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/updateKgkz/" + $self.parents('.node').attr('id'),
            type: "post",
            dataType: "json",
            async: false,
            contentType: 'application/json;charset=UTF-8',
            success: function success(data) {
                alert('success! ');
            }
        });
    });

    $('#1').addClass('green');
    $('#2').addClass('grey');
    $('#3').addClass('grey');
    $('#5').addClass('grey');
    $('#4').addClass('green');
    $('#4').click();
    $('#4').parent().parent().siblings('.nodes').find('.node').addClass('green');

    var vueTemp1 = new Vue({
        el: '#vue-temp-1',
        data: {
            caseTypesAll: caseTypesAll,
            // caseClassesAll: caseClassesAll,
            // caseSmallClassesAll: caseSmallClassesAll,
            caseClassesAll: [],
            caseSmallClassesAll: [],
            unitsAll: unitsAll,

            addItems: {},
            editItems: {},
            type: '',
            addId: '',
            editViewId: '',
            editing: false
        },
        watch: {
            editItems: function editItems(val) {
                var self = this;
                /*setTimeout(function () {
                    self.initSelect();
                }, 100);*/
            },
            editing: function editing(val) {
                if (this.editing) $("select.multiple-select").multipleSelect("enable");
                else $("select.multiple-select").multipleSelect("disable");
            },
        },
        methods: {
            //selcet是这里初始化的,这里是改变的时候的关键
            refreshSelect() {
                var $currentSelect = $('.' + this.type + 'Wrap').find('select.multiple-select');
                var $currentUnitSelect = $('.' + this.type + 'Wrap').find('select.chosen-select').chosen();
                //不知道为什么refresh需要等候几秒钟再触发，测试出来的。         
                setTimeout(function () {
                    $currentSelect.multipleSelect("refresh");
                    console.log('refresh')
                }, 100);
            },
            initSelect: function initSelect() {
                var $currentSelect = $('.' + this.type + 'Wrap').find('select.multiple-select');

                if (this.type == 'add') {
                    $currentSelect.siblings('.ms-parent.multiple-select').find('.ms-choice').removeClass('disabled');
                } else {
                    $currentSelect.siblings('.ms-parent.multiple-select').find('.ms-choice').addClass('disabled');
                }

                if ($currentSelect.siblings('.multiple-select').length > 0) {
                    //点击的项被显示
                    $currentSelect.multipleSelect("refresh").trigger('click');
                } else {
                    $currentSelect.multipleSelect({
                        width: "100%"
                    }).trigger('click');
                }

                 var $currentUnitSelect = $('.' + this.type + 'Wrap').find('select.chosen-select').chosen();
                // var $currentUnitSelect = $('.' + this.type + 'Wrap').find('select.chosen-select')
            },
            delete_select: function delete_select(e) {
                var $self = $(e.target);
                var $parent = $self.parents('.form-group');
                var id = $self.parent().attr('pid');
                var type = $parent.attr('type');
                var idName = $parent.attr('itemIdName');
                var self = this;
                var items = self[self.type + 'Items'];
                if (self.type == "edit" && !self.editing) return;
                items[type].forEach(function (item, index) {
                    if (item[idName] == id) {
                        items[type].pop(index);
                    }
                });
            },
            add_save: function add_save(e) {
                var self = this;
                var $self = $(e.target);
                this.addItems.zjkId = this.addId;
                var _addItems = JSON.stringify(this.addItems);
                
                
                $.ajax({
                    // url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
                    type: "post",
                    dataType: "json",
                    async: false,
                    // data: JSON.stringify(self.addItems),
                    data: _addItems,
                    contentType: 'application/json;charset=UTF-8',
                    success: function success(data) {
                        setTimeout(() => {
                            location.href = location.href;
                        }, 10);
                        
                        console.log('add_save')
                    }
                });
                console.log(JSON.stringify(this.addItems)); //保存的数据是好的
            },
            add_addOne: function add_addOne(e) {
                var $self = $(e.target);
                var value = $self.siblings('input').val();
                var type = $self.parents('.form-group').attr('type');
                var itemName = $self.parents('.form-group').attr('itemName');
                if (!value) return;
                var item = this.addItems[type];
                item.push({});
                item[item.length - 1][itemName] = value;
            },
            edit_addOne: function edit_addOne(e) {
                var $self = $(e.target);
                var value = $self.siblings('input').val();
                var type = $self.parents('.form-group').attr('type');
                var itemName = $self.parents('.form-group').attr('itemName');
                if (!value) return;
                if (!this.editing) return;
                var item = this.editItems[type];
                item.push({});
                item[item.length - 1][itemName] = value;
            },
            valueChange: function valueChange(e) {
                var $self = $(e.target);
                var $parent = $self.parents('.form-group');
                var type = $parent.attr('type');
                if (this.type == "add") {
                    this.addItems[type] = $self.val();
                } else {
                    this.editItems[type] = $self.val();
                }
            },
            multipleSelectChange: function multipleSelectChange(e) {
                var self = this;
                var $self = $(e.target);
                var $parent = $self.parents('.form-group');
                var type = $parent.attr('type');
                var idName = $parent.attr('itemIdName');
                var $options = $self.find('option:selected');
                var items = self[self.type + 'Items'];
                items[type] = [];
                if ($options.length <= 0) {
                    items[type] = [];
                    return;
                }
                if (type === "viewName") {
                    var i = 0;
                    var str = '';
                    // console.log($options);
                    $options.each(function () {

                        // items[type].push({});

                        if (i == 0) {
                            str = $(this).attr('value');
                        } else if (i < items[type].length) {
                            str = str + "," + $(this).attr('value');
                        }
                        items[type] = str;
                        i++;

                    });

                    return;
                }

                $options.each(function () {
                    items[type].push({});
                    items[type][items[type].length - 1][idName] = $(this).attr('value');
                    items[type][items[type].length - 1]['name'] = $(this).text();
                });


                switch (type) {

                    case "caseTypes":
                        let dataArray = [];
                        $options.each(function () {
                            let id = $(this).attr('value');
                            $.ajax({
                               
                                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByParentId/" + id,
                                // url: "http://172.17.99.112:10014/api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByParentId/10",
                                type: "get",
                                dataType: "json",
                                async: false,
                                contentType: 'application/json;charset=UTF-8',
                                success: function success(data) {
                                  dataArray = dataArray.concat(data);
                                //   console.log(data)
                                }
                            })

                        });
                        self.caseClassesAll = dataArray;
                        //假数据
                        // self.caseClassesAll = caseClassesAll;
                        this.refreshSelect();
                        break;
                    case "caseClasses":
                        let dataArray2 = [];
                        $options.each(function () {
                            let id = $(this).attr('value');
                            $.ajax({
                                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/eventTypes/findByParentId/" + id,
                                type: "get",
                                dataType: "json",
                                async: false,
                                contentType: 'application/json;charset=UTF-8',
                                success: function success(data) {
                                  dataArray2 = dataArray2.concat(data);
                                //   console.log(data)
                                }
                            })

                        });
                        //假数据
                        // this.caseSmallClassesAll = caseSmallClassesAll;
                        //成功后的测试
                        self.caseSmallClassesAll = dataArray2;
                        this.refreshSelect();

                        break;
    

                }
            },
            chosenSelectChange: function chosenSelectChange(e) {
                var $self = $(e.target);
                var $parent = $self.parents('.form-group');
                var type = $parent.attr('type');
                var idName = $parent.attr('itemIdName');
                var $options = $self.find('option:selected');
                var self = this;
                var items = self[self.type + 'Items'];
                items[type] = [];
                if ($options.length <= 0) {
                    items[type] = [];
                    return;
                }
                $options.each(function () {
                    items[type].push({});
                    items[type][items[type].length - 1][idName] = $(this).attr('value');
                    items[type][items[type].length - 1]['name'] = $(this).text();
                });
            },

            tempSave: function tempSave(e) {
                var data = this.editItems;
                this.editing = false;
                var id = $('.editWrap').attr('edit-view-id');
                delete data.id;
                $.ajax({
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/" + id,
                    type: "put",
                    dataType: "json",
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=UTF-8',
                    async: false,
                    success: function success(data) {
                        alert('修改成功');
                    }
                });
            },
            tempEdit: function tempEdit(e) {
                this.editing = true;
            },
            onChange: function (e) {
                alert(1)
            }

        },
        mounted: function mounted() {}
    });



});