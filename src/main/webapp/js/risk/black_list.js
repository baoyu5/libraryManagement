var blackListApi = new sysCommon.api('blackList', {
    'loadUri': 'api/black_lists',
    'createUri': 'api/black_list_add',
    'deleteUri': 'api/black_list_delete',
    'recordIdName': 'id'
});

$(document).ready(
    function () {
        var toolbarAll = [{
            text: '黑名单录入',
            handler: function () {
                showAddBlackList();
            }
        }, {
            text: '从黑名单移除',
            handler: function () {
                if ($('#listContainer .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    showRemoveBlackList();
                }
            }
        }];

        var urls = ['/api/black_list_add', '/api/black_list_delete'];

        $('#dg4blackList').datagrid({
            title: '黑名单列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: blackListApi.loadUri,
            method: 'get',
            loadFilter: function (result) {
                if (result && (result.status === 0)) {
                    if (result.data.rows) {
                        var data = result.data.rows;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].status == 2) {
                                data[i].statusStr = '录入审核中';
                            } else if (data[i].status == 3) {
                                data[i].statusStr = '移除审核中';
                            } else {
                                data[i].statusStr = '已录入';
                            }
                        }
                    }
                    return result.data;
                } else {
                    return [];
                }
            },
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            toolbar: getToolbar(toolbarAll, urls),
            onLoadSuccess: function (data) {
                $('#dg4blackList').datagrid('selectRow',0);//默认选中第一行数据
                blackListApi.onReloadSuccess();
                noRecord($(this),data,'id',6);
            },
            onLoadError: function (data) {
                errorHandler2(data);
            }
        });

        //设置分页控件
        paginationConfig($('#dg4blackList').datagrid('getPager'));
    }
);

function showAddBlackList() {
    $('#dlg4_new_black_list_tips').html('');
    $('#blackListAccountCode').textbox('clear');
    $('#blackListDescription').textbox('clear');
    $('#dlg4_new_blackList').dialog('open').dialog('center').dialog('setTitle', '黑名单录入');
}

function showRemoveBlackList() {
    var row = $('#dg4blackList').datagrid('getSelected');
    if (row) {
        if (row.status == 2) {
            showMessage("录入审核中的黑名单不能移除。");
            return;
        } else if (row.status == 3) {
            showMessage("该黑名单已经在移除审核中。");
            return;
        }
        $('#dlg4_remove_black_list_tips').html('');
        $('#blackListRemoveDescription').textbox('clear');
        $('#dlg4_remove_blackList').dialog('open').dialog('center').dialog('setTitle', '黑名单移除');
    } else {
        noSelectAlert();
    }
}

function removeBlackList() {
    var row = $('#dg4blackList').datagrid('getSelected');
    if (row) {
        var params = {};
        params.blackListId = row.id;
        if (!$('#blackListRemoveDescription').textbox('getValue').trim()) {
            showError($('#dlg4_remove_black_list_tips'), '必须说明移除原因。');
            return;
        }
        params.description = $('#blackListRemoveDescription').textbox('getValue').trim();

        $.ajax({
            url: blackListApi.deleteUri,
            data: params,
            type: "post",
            success: function (result) {
                showMessage("处理成功，请等待审核。");
                $('#dlg4_remove_black_list_tips').html('');
                $('#blackListRemoveDescription').textbox('clear');
                $('#dlg4_remove_blackList').dialog('close');
                $('#dg4blackList').datagrid('reload');
            },
            error: function (result) {
                errorHandler(result, $('#dlg4_remove_black_list_tips'));
            }
        });
    } else {
        noSelectAlert();
    }
}

function saveNewBlackList() {
    if (!$('#blackListAccountCode').textbox('getValue').trim()) {
        showError($('#dlg4_new_black_list_tips'), '用户编码不能为空。');
        return;
    }
    if (!$('#blackListDescription').textbox('getValue').trim()) {
        showError($('#dlg4_new_black_list_tips'), '必须说明录入原因。');
        return;
    }
    var params = {};
    params.accountCode = $('#blackListAccountCode').textbox('getValue').trim();
    params.description = $('#blackListDescription').textbox('getValue').trim();

    $.ajax({
        url: blackListApi.createUri,
        data: params,
        type: "post",
        success: function (result) {
            showMessage("处理成功，请等待审核。");
            $('#dlg4_new_black_list_tips').html('');
            $('#blackListAccountCode').textbox('clear');
            $('#blackListDescription').textbox('clear');
            $('#dlg4_new_blackList').dialog('close');
            $('#dg4blackList').datagrid('reload');
        },
        error: function (result) {
            errorHandler(result, $('#dlg4_new_black_list_tips'));
        }
    });
}

function blackListQuery() {
    var params = {};
    params.accountCode = $('#qBlackListAccountCode').textbox('getValue').trim();
    params.companyName= $('#qBlackListCompanyName').textbox('getValue').trim();
    params.startTime = $('#qBlackListFrom').datebox('getValue').trim();
    params.endTime = $('#qBlackListTo').datebox('getValue').trim();

    //增加查询条件的限制
    var codeReg = /^[\w\d_-]{0,}$/;
    var nameReg = /^[\u4e00-\u9fa5\w\d_-]{0,}$/;
    if(codeReg.test(params.accountCode) && nameReg.test(params.companyName)){
        $('#dg4blackList').datagrid({
            url: blackListApi.loadUri + '?' + $.param(params),
            method: 'get'
        });
        paginationConfig($('#dg4blackList').datagrid('getPager'));
    }else{
        return showMessage('查询条件只能包括字母、数字、汉字、下划线和连接符！');
    }

}

function blackListReset() {
    $('#qBlackListAccountCode').textbox('clear');
    $('#qBlackListCompanyName').textbox('clear');
    $('#qBlackListFrom').datebox('clear');
    $('#qBlackListTo').datebox('clear');

    $('#dg4blackList').datagrid({
        url: blackListApi.loadUri,
        method: 'get',
        pageNumber: 1
    });

    paginationConfig($('#dg4blackList').datagrid('getPager'));
}