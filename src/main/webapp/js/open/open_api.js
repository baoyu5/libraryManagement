/**
 * User: Roland
 */
var openApi = new sysCommon.api('api', {
        'loadUri': 'api/open_api',
        'createUri': 'api/open_api_add',
        'deleteUri': 'api/open_api_delete',
        'editUri': 'api/open_api_edit',
        'recordIdName': 'openApiId'
    }
);
$(document).ready(
    function () {
        var toolbarAll = [{
            text: '新建接口',
            //iconCls: 'icon-add',
            handler: function () {
                openApi.create('新建接口');
            }
        }, {
            text: '修改接口',
            //iconCls: 'icon-add',
            handler: function () {
                if ($('#apicontener .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    editApi();
                }
            }
        }, {
            text: '启用接口',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#apicontener .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    activateApi();
                }
            }
        }, {
            text: '停用接口',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#apicontener .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    deactivateApi();
                }
            }
        }, {
            text: '删除接口',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#apicontener .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    openApi.delete('确认要删除该接口吗?');
                }
            }
        }, {
            text: "接口详情",
            handler: function () {
                if ($('#apicontener .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    apiDetail();
                }
            }
        }];

        var urls = ['/api/open_api_add', '/api/open_api_edit',
            '/api/open_api_activation', '/api/open_api_deactivation', '/api/open_api_delete','/api/open_api_detail'
        ];
        var toolbar = getToolbar(toolbarAll, urls);

        $('#dg4api').datagrid({
            title: '接口列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/open_api',
            loadFilter: sysCommon.loadFilter,
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            toolbar:toolbar,
            onLoadSuccess: function(data) {
                openApi.onReloadSuccess();
                $('#dg4api').datagrid('selectRow');//默认不选中
                noRecord($(this),data,'apiCode',4);
            },
            onDblClickRow: function (index, row) {
                //editApi(index, row);
                apiDetail();
            },onLoadError: function() {
                accessDenied();
            },
        });

        //设置分页控件
        paginationConfig($('#dg4api').datagrid('getPager'));
    }
);

function editApi() {
    url = 'api/open_api_edit';
    $("#dlg4api_tips").html('');
    var row = $('#dg4api').datagrid('getSelected');
    if (row) {
        $('#dlg4api').dialog('open').dialog('center').dialog('setTitle', '修改接口');
        if (row.status == 0) {
            row.status = '启用';
        }else {
           row.status = '停用';
        }
        $('#fm4api').form('load', row);
    }
    else {
        noSelectAlert();
    }
}

function saveApi() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#apiName'),6,20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.接口名称'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4api_tips'),text);
        return;
    }
    openApi.update();
}

function setQueryApi() {
    openApi.setQueryParams();
}

function resetQueryApi() {
    openApi.unsetQueryParams();
}

function saveNewApi() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#newApiName'),6,20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.接口名称'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_new_api_tips'),text);
        return;
    }
    openApi.save();
}

function activateApi() {
    var row;
    if (row = openApi.getSelectedRow()) {
        $.messager.confirm('激活确认', '确认要激活该接口?', function (r) {
            if (r) {
                $.ajax({
                    url: 'api/open_api_activation?openApiId=' + row['id'],
                    type: "post",
                    success: function (result) {
                        console.log(result.data);
                        if(result.data){
                            $.messager.alert('提示信息', '接口已启用，无需重复操作。');
                        }else{
                            $.messager.alert('提示信息', '接口激活成功。');
                        }
                        $('#dg4api').datagrid('reload');
                    },
                    error: function (data) {
                        errorHandler2(data);
                    }
                });
            }
        });
    }
}

function deactivateApi() {
    var row;
    if (row = openApi.getSelectedRow()) {
        $.messager.confirm('停用确认', '确认要停用该接口?', function (r) {
            if (r) {
                $.ajax({
                    url: 'api/open_api_deactivation?openApiId=' + row['id'],
                    type: "post",
                    success: function (result) {
                        if(result.data){
                            $.messager.alert('提示信息', '该接口已停用，无需重复操作。');
                        }else{
                            $.messager.alert('提示信息', '接口已停用。');
                        }
                        $('#dg4api').datagrid('reload');
                    },
                    error: function (data) {
                        errorHandler2(data);
                    }
                });
            }
        });
    }
}

function apiStatusFormatter(val, row) {
    return (val == 0 ? '启用' : '停用');
}

function apiDescFormatter(val, row) {
    var Desc;
    Desc = val;
    if(typeof (Desc) != "undefined" && Desc.length > 10){
        Desc = val.substr(0,9) + '...';

    }
    return Desc;
}

function apiDetail() {
    $("#dlg4_api_detail_tips").html('');
    var row = $('#dg4api').datagrid('getSelected');
    if (row) {
        sysCommon.loadRowToView(row, 'dlg4_api_detail');
        $('#dlg4_api_detail').dialog('open').dialog('center').dialog('setTitle', '接口详情');
        $('#fm4_api_detail').form('load', row);
    }
    else {
        noSelectAlert();
    }
}