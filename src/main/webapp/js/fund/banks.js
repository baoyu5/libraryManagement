/**
 * User: Roland
 */

var bankApi = new sysCommon.api('banks', {
        'loadUri': 'api/banks',
        'createUri': 'api/bank_add',
        'deleteUri': 'api/bank_delete',
        'editUri': 'api/bank_edit',
        'recordIdName': 'bankId'
    }
);
$(document).ready(
    function () {
        var toolbarAll = [{
            text: '添加银行',
            //iconCls: 'icon-add',
            handler: function () {
                bankApi.create('添加银行');
            }
        }, {
            text: '修改银行',
            //iconCls: 'icon-edit',
            handler: function () {
                bankApi.edit('修改银行');
            }
        }, {
            text: '修改资金账户',
            //iconCls: 'icon-edit',
            handler: function () {
                editBankAccount();
            }
        }, {
            text: '头寸调拨',
            //iconCls: 'icon-remove',
            handler: function () {
                positionAllocation();
            }
        },{
            text: '修改头寸',
            //iconCls: 'icon-remove',
            handler: function () {
                positionEdit();
            }
        }, {
            text: '删除银行',
            //iconCls: 'icon-remove',
            handler: function () {
                bankApi.delete('确定要删除该银行吗?');
            }
        }];

        var urls = ['/api/bank_add', '/api/bank_edit', '/api/bank_account_edit', '/api/bank_position_suggest', '/api/bank_position_edit', '/api/bank_delete'];
        var toolbar = getToolbar(toolbarAll, urls);
        toolbar.push({
            text: '银行详情',
            handler: function () {
                bankDetail();
            }
        });
        $('#dg4banks').datagrid({
            title: '银行列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/banks',
            loadFilter: sysCommon.loadFilter,
            //sortName: 'code',
            //sortOrder: 'desc',
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            //frozenColumns:[[
            //    {field:'ck',checkbox:true}
            //]],
            toolbar: toolbar,
            onDblClickRow: function () {
                bankDetail();
            },
            onLoadError: function() {
                accessDenied();
            },
            onLoadSuccess: function(data) {
                $('#dg4banks').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'name',6);//无记录
                bankApi.onReloadSuccess();
            }
        });

        //设置分页控件
        paginationConfig($('#dg4banks').datagrid('getPager'));
    }
);

function saveBank() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#bankName'),4,30);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.银行名'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4banks_tips'),text);
        return;
    }
    bankApi.update(function(params){
        params['code'] = params['bankCode'];
        delete params['bankCode'];
        return JSON.stringify(params);
    });
}

function positionAllocation() {
    $("#dlg4banks_position_tips").html('');
    $('#dlg4banks_position').dialog('open').dialog('center').dialog('setTitle', '头寸调拨');
}

function savePositionAllocation() {
    $("#dlg4banks_position_tips").html('<div class="alert alert-danger" role="alert">模拟错误提示！</div>')
}

function editBankAccount() {
    $("#dlg4banks_account_tips").html('');
    var row = $('#dg4banks').datagrid('getSelected');
    if (row) {
        $('#dlg4banks_account').dialog('open').dialog('center').dialog('setTitle', '修改资金账户');
        $('#fm4banks_account').form('load', row);
    }
    else {
        noSelectAlert();
    }
}

function saveBankAccount() {
    $.ajax({
        url: 'api/bank_account_edit',
        data: JSON.stringify(form2Json($('#fm4banks_account'), ['name'])),
        contentType: "application/json",
        type: "post",
        success: function () {
            $('#dlg4banks_account').dialog('close');        // close the dialog
            $('#dg4banks').datagrid('reload');    // reload the user data
        },
        error: function (data) {
            errorHandler(data, $('#dlg4banks_account_tips'));
        }
    });
}

function positionEdit() {
    $("#dlg4banks_position_edit_tips").html('');
    var row = $('#dg4banks').datagrid('getSelected');
    if (row) {
        $('#dlg4banks_position_edit').dialog('open').dialog('center').dialog('setTitle', '修改头寸');
        $('#fm4banks_position_edit').form('load', row);
    }
    else {
        noSelectAlert();
    }
}

function savePosition() {
    var params = form2Json($('#fm4banks_position_edit'), ['name']);
    $.ajax({
        url: 'api/bank_position_edit',
        data: JSON.stringify(params),
        contentType: "application/json",
        type: "post",
        success: function () {
            $('#dlg4banks_position_edit').dialog('close');        // close the dialog
            $('#dg4banks').datagrid('reload');
        },
        error: function (data) {
            errorHandler(data, $('#dlg4banks_position_edit_tips'));
        }
    });
}

function saveNewBank() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#newBankName'),4,30);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.银行名'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_new_banks_tips'),text);
        return;
    }
    bankApi.save();
}

function bankDetail() {
    $("#dlg4banks_detail_tips").html('');
    var row = $('#dg4banks').datagrid('getSelected');
    if (row) {
        sysCommon.loadRowToView(row, 'dlg4banks_detail');
        $('#dlg4banks_detail').dialog('open').dialog('center').dialog('setTitle', '会员详情');
        $('#fm4banks_detail').form('load', row);
    }
    else {
        noSelectAlert();
    }
}
