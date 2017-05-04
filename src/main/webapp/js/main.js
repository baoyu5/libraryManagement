//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
 function banBackSpace(e){
     //获取event对象
     var ev = e || window.event;
     //获取事件源
     var obj = ev.target || ev.srcElement;
     //获取事件源类型
     var t = obj.type || obj.getAttribute('type');

     //获取作为判断条件的事件类型
     var vReadOnly = obj.getAttribute('readonly');
     //处理null值情况
     vReadOnly = (vReadOnly == "") ? false : vReadOnly;

     //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
     //并且readonly属性为true或enabled属性为false的，则退格键失效
     var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")
                 && vReadOnly=="readonly")?true:false;

     //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
     var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                 ?true:false;

     //判断
     if(flag2){
         return false;
     }
     if(flag1){
         return false;
     }
 }

 window.onload=function(){
     //禁止后退键 作用于Firefox、Opera
     document.onkeypress = banBackSpace;
     //禁止后退键  作用于IE、Chrome
     document.onkeydown = banBackSpace;

    load();
}

function load() {
    var clickHandling = false;

    function loadPage(url, title) {
        // 页面已经加载则选中
        if ($('#tt').tabs('exists', title)) {
            $('#tt').tabs('select', title);
            clickHandling = false;
            return;
        }

        // 加载页面
        $.get(url, function (data) {
            $('#tt').tabs('add', {
                title: title,
                content: data,
                closable: true
            });
            clickHandling = false;
        });
    }

    // 左侧菜单
    $('#menuTree').tree({
        url: "resource/menu",
        method: "post",
        onClick: function (node) {
            if (!clickHandling) {
                if (node.attributes.level != 0 && node.attributes.url != "") {
                    clickHandling = true;
                    loadPage(node.attributes.url, node.text);
                }
            }
        },
        onBeforeLoad: function (node, param) {
            $("#treeLoading").html('<div class="alert alert-info info-loading">正在加载菜单</div>');
        },
        onLoadSuccess: function (node, data) {

            $("#treeOpt").show();
            $("#treeLoading").html('');

        },
        onLoadError: function () {
            $("#treeLoading").html('<div class="alert alert-error">菜单加载失败!</div>');
        }
    });

    // 加载资源、权限
    // $.ajax({
    //     url: "api/granted_authorities",
    //     type: "post",
    //     dataType: "json",
    //     success: function (response) {
    //         authorities = response["data"];
    //         console.log(authorities);
    //     },
    //     error: function (data) {
    //         errorHandler2(data);
    //     }
    // });


    // $("#tt").tabs({
    //     onClose: function (title, index) {
    //         var dialogs = [];
    //         if (title == "资源管理") {
    //             dialogs.push('dlg4resources');
    //             dialogs.push('dlg4roles_resources');
    //         }
    //         if (title == "操作员管理") {
    //             dialogs.push('dlg4admins_password');
    //             dialogs.push('dlg4admins_roles');
    //             dialogs.push('dlg4admins');
    //         }
    //         if (title == "角色管理") {
    //             dialogs.push('dlg4roles');
    //             dialogs.push('dlg4roles_resources');
    //         }
    //
    //         dialogDestroy(dialogs);
    //     }
    // });
}

// function dialogDestroy(dialogs) {
//     for (var i = 0; i < dialogs.length; i++) {
//         try {
//             $('#' + dialogs[i]).dialog('destroy')
//         } catch (e) {
//             console.error(e);
//         }
//     }
// }


function collapseAll() {
    $('#menuTree').tree('collapseAll');
}
function expandAll() {
    $('#menuTree').tree('expandAll');
}

function closeAllTabs() {
    $(".tabs li").each(function (index, obj) {
        //获取所有可关闭的选项卡
        var tab = $(".tabs-closable", this).text();
        if (tab != '我的首页') {
            $(".easyui-tabs").tabs('close', tab);
        }
    });
}

/**
 * 拥有的权限
 */
var authorities;
/**
 * 当前用户
 */
var loginUser;

//region --- 通用方法 ---
var sysCommon = {};

/**
 * 通用数据加载过滤方法
 * @param data
 * @returns {*}
 */
sysCommon.loadFilter = function (data) {
    if (data && (data.status === 0)) {
        return data.data;
    } else {
        return [];
    }
};

sysCommon.paginationConfig = {
    pageSize: 10,//每页显示的记录条数，默认为10
    beforePageText: '第',//页数文本框前显示的汉字
    afterPageText: '页    共 {pages} 页',
    displayMsg: '第 {from} - {to} 条, 共 {total} 条记录   ',
    layout: ['first', 'prev', 'links', 'next', 'last', 'sep', 'refresh']
};

sysCommon.api = function (idName, opts) {
    this.idName = idName;
    this.ops = null;
    this.selectedRowIndex = -1;
    $.extend(this, opts);
};

sysCommon.api.prototype = {
    idName: '',
    // 新增弹出窗口
    create: function (title) {
        this.ops = 'create';

        console.log('create: ', this.idName, title);
        $('#dlg4_new_' + this.idName + '_tips').html('');
        $('#dlg4_new_' + this.idName).dialog('open').dialog('center').dialog('setTitle', title);
        $('#fm4_new_' + this.idName).form('clear');
    },
    // 保存新增数据
    save: function () {
        $.ajax({
            url: this.createUri,
            data: JSON.stringify(form2Json($('#fm4_new_' + this.idName))),
            contentType: "application/json",
            type: "post",
            success: function () {
                console.log(this.idName, ' save success.');
                $('#dlg4_new_' + this.idName).dialog('close');
                $('#dg4' + this.idName).datagrid('reload');
            }.bind(this),
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_new_' + this.idName + '_tips'), error["errorMessage"]);
            }.bind(this)
        });
    },
    // 获取当前选中的行,否则弹窗提示
    getSelectedRow: function () {
        var row = $('#dg4' + this.idName).datagrid('getSelected');
        if (row) {
            return row;
        } else {
            noSelectAlert();
            return null;
        }
    },
    // 删除
    delete: function (confirmDesc, confirmTitle) {
        this.ops = 'delete';

        var row;
        if (row = this.getSelectedRow()) {
            var idName = this.recordIdName;
            confirmTitle = confirmTitle || '操作确认';
            confirmDesc = confirmDesc || '确认要删除吗?';
            $.messager.confirm(confirmTitle, confirmDesc, function (r) {
                if (r) {
                    $.ajax({
                        url: this.deleteUri + '?' + this.recordIdName + '=' + (row['id'] ? row['id'] : row[idName]),
                        type: "post",
                        success: function () {
                            $('#dg4' + this.idName).datagrid('deleteRow',
                                $('#dg4' + this.idName).datagrid('reload'));
                        }.bind(this),
                        error: function (data) {
                            var error = JSON.parse(data.responseText);
                            showMessage(error["errorMessage"]);
                        }.bind(this)
                    });

                }
            }.bind(this));
        }
    },
    // 修改弹出窗口
    edit: function (title) {
        this.ops = 'edit';

        $('#dlg4' + this.idName + '_tips').html('');
        var row = this.getSelectedRow();
        this.selectedRowIndex = $('#dg4' + this.idName).datagrid('getRowIndex', row);
        if (row) {
            console.log(row);
            $('#dlg4' + this.idName).dialog('open').dialog('center').dialog('setTitle', title);
            $('#fm4' + this.idName).form('load', row);
        }
    },
    // 任意edit弹窗
    editAny: function (id, title) {
        $('#fm4_' + id).form('clear');
        $('#dlg4_' + id + '_tips').html('');
        var row = $('#dg4' + id).datagrid('getSelected');
        if (row) {
            $('#dlg4_' + id).dialog('open').dialog('center').dialog('setTitle', title);
            console.log('editAny load row:', row);
            $('#fm4_' + id).form('load', row);
        } else {
            noSelectAlert();
        }
        return row;
    },
    // 保存修改
    update: function (cb) {
        $.ajax({
            url: this.editUri,
            // 为了兼容某些不合规则的接口
            data: $.isFunction(cb) ? cb(form2Json($('#fm4' + this.idName))) : JSON.stringify(form2Json($('#fm4' + this.idName))),
            contentType: "application/json",
            type: "post",
            success: function () {
                $('#dlg4' + this.idName).dialog('close');
                $('#dg4' + this.idName).datagrid('reload');
            }.bind(this),
            error: function (data) {
                errorHandler(data, $('#dlg4' + this.idName + '_tips'));
            }.bind(this)
        });
    },
    // 重新加载数据成功之后
    onReloadSuccess: function () {
        if (this.ops == 'create') {
            this.selectedRowIndex = 0;
        } else if (this.ops == 'edit') {
            //this.selectedRowIndex
        } else if (this.ops == 'delete') {
            this.selectedRowIndex = -1;
        }

        if (this.selectedRowIndex != -1) {
            $('#dg4' + this.idName).datagrid(
                'selectRow',
                this.selectedRowIndex
            );
        }
    },
    // 任意修改保存
    updateAny: function (id, uri, reducer) {
        var formData = form2Json($('#fm4_' + id));
        var payload = '';
        if ($.isFunction(reducer)) {
            var ret = reducer(formData);
            payload = $.isPlainObject(ret) ? JSON.stringify(ret) : ret;
        } else if ($.isPlainObject(reducer)) {
            var tmpObj = {};
            $.each(formData, function (key, val) {
                reducer[key] && (tmpObj[key] = val);
            });
            payload = JSON.stringify(tmpObj);
        } else {
            payload = JSON.stringify(formData);
        }
        $.ajax({
            url: uri,
            data: payload,
            contentType: "application/json",
            type: "post",
            success: function () {
                $('#dlg4_' + id).dialog('close');
                $('#dg4' + this.idName).datagrid('reload');
            }.bind(this),
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }.bind(this)
        });
    },
    getQueryForm: function () {
        return '#qfm4_' + this.idName;
    },
    setQueryParams: function () {
        this.query = $(this.getQueryForm()).serialize().trim();
        $('#dg4' + this.idName).datagrid({
            'url': (-1 == this.loadUri.search(/\?/)) ? (this.loadUri + '?' + this.query) : (this.loadUri + this.query),
            pageNumber: 1
        });
        paginationConfig($('#dg4' + this.idName).datagrid('getPager'));
        return this;
    },
    unsetQueryParams: function () {
        $(this.getQueryForm()).find('.easyui-textbox').textbox('reset');
        $(this.getQueryForm()).find('.easyui-datebox').datebox('reset');
        $(this.getQueryForm()).find('.easyui-combobox').combobox('select', 0);

        this.query = null;

        // $('#dg4' + this.idName).datagrid({
        //     'url': this.loadUri,
        //     pageNumber: 1
        // });

        paginationConfig($('#dg4' + this.idName).datagrid('getPager'));
        return this;
    }

};

/**
 * 从使用 . 连接的 key 获取多层嵌套 obj 中的属性值
 */
sysCommon.getDeepProp = function (key, obj, forceRaw) {
    forceRaw = forceRaw || false;
    if (forceRaw) {
        return obj[key];
    } else {
        var keyParts = key.split('.');
        var nextObj = obj;
        $.each(keyParts, function (index, k) {
            // if (key == "isLastPayment") {
            //     showMessage("1111");
            //     showMessage(nextObj[k]);
            // }
            nextObj = nextObj[k];
            return ($.isPlainObject(nextObj));
        });
        return nextObj;
    }
};

/**
 * 用于展示数据的弹出框
 */
sysCommon.loadRowToView = function (row, viewId) {
    // 将选中行的数据加载到弹出框
    var loadFunc = function (row) {
        console.log('loading row', row);
        var view = $('#' + viewId);
        view.find('[data-holder]').each(function () {
            var $elem = $(this);
            var key = $elem.attr('data-holder');
            var val = sysCommon.getDeepProp(key, row);

            if (val !== undefined && val !== null) {
                var formatter;
                var setVal = val;
                // check for value formatter
                if (formatter = $elem.attr('data-holder-formatter')) {
                    var func = sysCommon.formatters[formatter] || window[formatter];
                    if ($.isFunction(func)) {
                        setVal = func.call(this, val, row);
                    }
                }
                // if value is set for a property
                if (prop = $elem.attr('data-holder-prop')) {
                    if (prop == 'src' && $elem[0].tagName == 'IMG') {
                        setVal = sysConfig.picBaseUrl + setVal;
                    }
                    $elem.prop(prop, setVal);
                    return;
                }

                $elem.html(setVal);
            } else {
                var setEmpty = '';
                var defaultValue = $elem.attr('data-holder-default');
                if (defaultValue !== undefined && defaultValue !== null) {
                    setEmpty = defaultValue;
                }
                if (prop = $elem.attr('data-holder-prop')) {
                    $elem.prop(prop, setEmpty);
                } else {
                    $elem.html(setEmpty);
                }
            }
        });
    };

    // 异步加载数据
    if ($.isFunction(row)) {
        var ret = row.call(null);
        if (ret && ret['promise']) {
            ret.promise.then(function (rowData) {
                loadFunc(rowData);
            });
        } else {
            console.info(ret);
            return;
        }
        return ret.promise;
    } else {
        loadFunc(row);
    }
};

//region --- 通用配置 ---
var sysConfig = {};

sysConfig.picBaseUrl = '/uploaded/'; // 上传图片文件的通用访问地址

// 订单状态
// sysConfig.orderStatus = {
//     1: '已创建',
//     2: '已完成',
//     3: '已支付',
//     4: '支付失败',
//     5: '保证金释放',
//     6: '退款失败/入金失败/出金』',
//     7: '已退款',
//     8: '审核中',
//     9: '审核通过',
//     10: '审核不通过',
//     11: '待退款',
//     12: '已合并'
// };

// 订单类型
// sysConfig.orderType = {
//     1: '冻结买方交易保证金',
//     2: '冻结卖方交易保证金',
//     3: '市场手续费',
//     4: '通用余额支付货款',
//     5: '违约支付',
//     6: '入金',
//     601: '入金调账',
//     7: '出金',
//     8: '退款订单',
//     9: '竞价冻结',
//     10: '竞价释放',
//     11: '市场交易保证金支付货款',
//     12: '确认收货',
//     13: '违约赔偿',
//     14: '收益转通用余额',
//     15: '释放买家交易保证金',
//     16: '释放卖家交易保证金',
//     100: '冻结保证金',
//     101: '释放保证金',
//     102: '部分退款'
// };
//endregion

//region 数据格式化函数
sysCommon.formatters = {};

sysCommon.makeOptions = function (dict) {
    var ret = [];
    for (var i in dict) {
        ret.push({'text': dict[i], 'value': i});
    }
    return ret;
};

sysCommon.makeFormatter = function (dict, noneVal) {
    noneVal = noneVal || '未定义';
    return function (val) {
        return dict[val] || noneVal;
    };
};

// 订单状态
// sysCommon.formatters.orderStatusFormatter = sysCommon.makeFormatter(sysConfig.orderStatus);
// 订单类型
// sysCommon.formatters.orderTypeFormatter = sysCommon.makeFormatter(sysConfig.orderType);
// timestamp to date

sysCommon.formatters.timestampFormatter = function (ts) {
    var date = new Date(ts);
    var dateParts = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ];
    return vsprintf("%s-%s-%s %s:%s:%s", dateParts);
};

// float
sysCommon.formatters.integerToPercent = function (val) {
    var f = parseFloat(val / 100);
    return f.toFixed(2);
};

//endregion

// sysCommon.formatters.amountFormatter = function (val) {
//     var num = val * 0.01;//分到元
//     num += '';//转成字符串
//     reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//确定使用有哪个正则
//     num = num.replace(reg, '$1,');//千分位格式化
// };

sysCommon.data = {};

// sysCommon.data.banks = {
//     _loaded: false,
//     _data: [],
//     load: function () {
//         var _this = this;
//         $.post('/api/banks', function (ret) {
//             if (ret.status === 0 && ret.data.total > 0) {
//                 _this._data = ret.data.rows;
//             }
//         }, 'json');
//     },
//     get: function () {
//         return this._data;
//     }
// };
// sysCommon.data.banks.load();

//endregion

// function amountFormatter(amount) {
//     var num = amount * 0.01;//分到元
//     num = toDecimal2(num);
//     num += '';//转成字符串
//     reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//确定使用有哪个正则
//     num = num.replace(reg, '$1,');//千分位格式化
//     return num;
// }

// function toDecimal2(x) {
//     var f = parseFloat(x);
//     if (isNaN(f)) {
//         return false;
//     }
//     var f = Math.round(x * 100) / 100;
//     var s = f.toString();
//     var rs = s.indexOf('.');
//     if (rs < 0) {
//         rs = s.length;
//         s += '.';
//     }
//     while (s.length <= rs + 2) {
//         s += '0';
//     }
//     return s;
// }