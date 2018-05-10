$(document).ready(function () {
    //$.jgrid.defaults.styleUI = 'Bootstrap';
    var initState = [{
        "id": "1",
        "lever": "0",
        "zjkName": "总库",
        "supId": "0",
        "comments": null,
        "serverAddr": null,
        "timestamp": null
    }, {
        "id": "2",
        "lever": "1",
        "zjkName": "对接市局直属机关库",
        "supId": "1",
        "comments": null,
        "serverAddr": "123",
        "timestamp": null
    }, {
        "id": "3",
        "lever": "1",
        "zjkName": "对接市政府",
        "supId": "1",
        "comments": null,
        "serverAddr": "124",
        "timestamp": null
    }, {
        "id": "4",
        "lever": "1",
        "zjkName": "对接分局库",
        "supId": "1",
        "comments": null,
        "serverAddr": "125",
        "timestamp": null
    }, {
        "id": "5",
        "lever": "1",
        "zjkName": "对接省厅库",
        "supId": "1",
        "comments": null,
        "serverAddr": "126",
        "timestamp": null
    }
];
    var zjksAll = {};
    var currentViews = [];

    // $.ajax({
    //     url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/zjks/all",
    //     type: "get",
    //     dataType: "json",
    //     async: false,
    //     contentType: 'application/json;charset=UTF-8',
    //     success: function success(data) {
    //         zjksAll.children = [];
    //         data.forEach(function (item) {
    //             if (item.id == 1) {
    //                 zjksAll.name = item.zjkName;
    //                 zjksAll.id = item.id;
    //             } else if (item.id == 4) {
    //                 zjksAll.children.push({
    //                     'name': item.zjkName,
    //                     'title': '<a class="btn btn-primary btn-handle btn-handle-add">添加</a>',
    //                     'id': item.id,
    //                     'class': 'green'
    //                 });
    //             } else {
    //                 zjksAll.children.push({'name': item.zjkName, 'id': item.id});
    //             }
    //         });
    //     }
    // });
    function init() {
        zjksAll.children = [];
        initState.forEach(function (item) {
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
    };
    init();

    var oc = $('#orgChart-wrap-1').orgchart({
        'data': zjksAll,
        'nodeContent': 'title'
    });
     

    var caseTypesAll = [{
        name: "案件类型1",
        id: "10001"
    }, {
        name: "案件类型2",
        id: "10002"
    }, {
        name: "案件类型3",
        id: "10003"
    }, {
        name: "案件类型4",
        id: "10004"
    }, {
        name: "案件类型5",
        id: "10005"
    }, {
        name: "案件类型6",
        id: "10006"
    }, {
        name: "案件类型7",
        id: "10007"
    }, {
        name: "案件类型8",
        id: "10008"
    }, {
        name: "案件类型9",
        id: "10009"
    }, {
        name: "案件类型10",
        id: "10010"
    }];
    var caseClassesAll = [{
        name: "案件类别1",
        id: "20001"
    }, {
        name: "案件类别2",
        id: "20002"
    }, {
        name: "案件类别3",
        id: "20003"
    }, {
        name: "案件类别4",
        id: "20004"
    }, {
        name: "案件类别5",
        id: "20005"
    }, {
        name: "案件类别6",
        id: "20006"
    }, {
        name: "案件类别7",
        id: "20007"
    }, {
        name: "案件类别8",
        id: "20008"
    }, {
        name: "案件类别9",
        id: "20009"
    }, {
        name: "案件类别10",
        id: "20010"
    }];
    var caseSmallClassesAll = [{
        name: "案件细类1",
        id: "30001"
    }, {
        name: "案件细类2",
        id: "30002"
    }, {
        name: "案件细类3",
        id: "30003"
    }, {
        name: "案件细类4",
        id: "30004"
    }, {
        name: "案件细类5",
        id: "30005"
    }, {
        name: "案件细类6",
        id: "30006"
    }, {
        name: "案件细类7",
        id: "30007"
    }, {
        name: "案件细类8",
        id: "30008"
    }, {
        name: "案件细类9",
        id: "30009"
    }, {
        name: "案件细类10",
        id: "30010"
    }];
    var unitsAll = [{
        name: "江岸分局库",
        id: "40001"
    }, {
        name: "江汉分局库",
        id: "40002"
    }, {
        name: "硚口分局库",
        id: "40003"
    }, {
        name: "武昌分局库",
        id: "40004"
    }, {
        name: "洪山分局库",
        id: "40005"
    }, {
        name: "青山分局库",
        id: "40006"
    }, {
        name: "汉阳分局库",
        id: "40007"
    }, {
        name: "新洲分局库",
        id: "40008"
    }, {
        name: "江夏分局库",
        id: "40009"
    }, {
        name: "蔡甸分局库",
        id: "40010"
    }, {
        name: "黄陂分局库",
        id: "40011"
    }];
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
        "zjkId": ""
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
        // console.log($self.attr('data-parent'));//默认值是1
        // console.log(id);//属性上绑定的4
        //不显示第三层
        return
        if ($self.attr('data-parent') == 1) {
            if ($self.parent().parent().siblings('.nodes').length > 0) return;
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/byZjkId/" + id,
                //url: "http://172.17.99.113:10054/views/byZjkId/4",
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    var childrenViews = [];
                    if (data && data.length > 0) {
                        currentViews = data;
                        data.forEach(function (item) {
                            var title;
                            if (item.kgkz > 0) {
                                title = '<a class="btn btn-warning btn-handle btn-handle-delete">删除</a><div class="switch" data-on-label="开" data-off-label="关"> <input type="checkbox" checked/></div>'
                            } else {
                                title = '<a class="btn btn-warning btn-handle btn-handle-delete">删除</a><div class="switch" data-on-label="开" data-off-label="关"> <input type="checkbox"/></div>'
                            }
                            childrenViews.push({
                                'id': item.id,
                                'name': item.viewName,
                                'title': title
                            });
                        });
                        oc.addChildren($self, childrenViews);
                        $('.switch')['bootstrapSwitch']();
                    }
                }
            });
        } else if (id != 1) {
            vueTemp1.type = 'edit';
            vueTemp1.editing = false;
            vueTemp1.editViewId = id;
            $.ajax({
                url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/" + id,
                type: "get",
                dataType: "json",
                async: false,
                contentType: 'application/json;charset=UTF-8',
                success: function success(data) {
                    var jsonArr_edit = data;

                    jsonArr_edit.caseTypes.forEach(function (item) {
                        caseTypesAll.forEach(function (i) {
                            if (item.caseTypeId == i.id) {
                                item.name = i.name;
                                i.selected = true;
                            }
                        });
                    });
                    jsonArr_edit.caseClasses.forEach(function (item) {
                        item.selected = true;
                        caseClassesAll.forEach(function (i) {
                            if (item.caseClassId == i.id) {
                                item.name = i.name;
                                i.selected = true;
                            }
                        });
                    });
                    jsonArr_edit.caseSmallClasses.forEach(function (item) {
                        item.selected = true;
                        caseSmallClassesAll.forEach(function (i) {
                            if (item.caseSmallClassId == i.id) {
                                item.name = i.name;
                                i.selected = true;
                            }
                        });
                    });
                    jsonArr_edit.units.forEach(function (item) {
                        item.selected = true;
                        unitsAll.forEach(function (i) {
                            if (item.unitId == i.id) {
                                item.name = i.name;
                                i.selected = true;
                            }
                        });
                    });

                    vueTemp1.editItems = jsonArr_edit;

                    // setTimeout(function () {
                    //     vueTemp1.initSelect();
                    // }, 100);
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
    }).on('click', '.btn-handle-delete', function (e) {
        e.stopPropagation();
        var id = $(this).parents('.node').attr('id');
        $.ajax({
            url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/" + id,
            type: "delete",
            dataType: "json",
            async: false,
            success: function success(data) {
                location.href = location.href;
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
//$('.multiple-select').eq(4).multipleSelect("refresh").trigger('click')
            refreshSelect() {
               var $currentSelect = $('.' + this.type + 'Wrap').find('select.multiple-select');
      //不知道为什么refresh需要等候几秒钟再触发，测试出来的。         
                setTimeout(function () {
                  $currentSelect.multipleSelect("refresh");
                  console.log('refresh')
                }, 100);
            },
            initSelect: function initSelect() {
                var $currentSelect = $('.' + this.type + 'Wrap').find('select.multiple-select');
                $currentSelect.multipleSelect({
                    width: "100%"
                })

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

                var $self = $(e.target);
                this.addItems.zjkId = this.addId;
                $.ajax({
                    url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/views/",
                    
                    type: "post",
                    dataType: "json",
                    async: false,
                    data: JSON.stringify(this.addItems),
                    contentType: 'application/json;charset=UTF-8',
                    success: function success(data) {
                        location.href = location.href;
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
                if (idName === "viewNameId") {
                    let i = 0;
                    let str = '';
                    // console.log($options);
                    $options.each(function () {

                        // items[type].push({});

                        if (i == 0) {
                            str = $(this).attr('value');
                        } else if (i < items[type].length) {
                            str = str + "," + $(this).attr('value');
                        }
                        items["viewName"] = str;
                        i++;

                    });

                    return;
                }

                $options.each(function () {
                    items[type].push({});
                    items[type][items[type].length - 1][idName] = $(this).attr('value');
                    items[type][items[type].length - 1]['name'] = $(this).text();
                });


                switch (idName) {

                    case "caseTypeId":
                       
                        
                        this.caseClassesAll = caseClassesAll;
                        // // items["caseClassesAll"] = [];
                        this.caseSmallClassesAll = caseSmallClassesAll;
                        this.refreshSelect();
                       
                        // this.chosenSelectChange();
                        
                        
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