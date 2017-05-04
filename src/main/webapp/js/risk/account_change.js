
$(document).ready(
    function () {
        $('#dg4account_change').datagrid({
            title: '账户变动列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/account_changes',
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
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function (data) {
                $('#dg4account_change').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'loginName',6);
                logApi.onReloadSuccess();
            }
        });
        //设置分页控件
        paginationConfig($('#dg4account_change').datagrid('getPager'));
    }
);

function accountChangeResultFormatter(val) {
    if (val == "0") {
        return '失败';
    } else if (val == "1") {
        return '成功';
    }
}

function passwordFormatter(val) {
    if (val == 0) {
        return '登录密码';
    } else if (val == 1) {
        return '支付密码';
    }
}

// 查询
function accountChangeQuery() {
    var params = {};
    params.accountCode = $('#account_change_account_code').textbox('getValue').trim();
    params.startTime = $('#account_change_datefrom').datebox('getValue').trim();
    params.endTime = $('#account_change_dateto').datebox('getValue').trim();

    //增加验证
    var reg = /^[\w\d_-]{0,}$/;
    if(reg.test(params.accountCode)){
        $('#dg4account_change').datagrid({
            'url': 'api/account_changes?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4account_change').datagrid('getPager'));
    }else{
        return showMessage('会员编码只能包括字母、数字、下划线和连接符！');
    }

}

// 重置查询条件
function accountChangeReset() {
    $('#account_change_account_code').textbox('clear');
    $('#account_change_datefrom').datebox('clear');
    $('#account_change_dateto').datebox('clear');
    $('#dg4account_change').datagrid({
        'url': 'api/account_changes',
        pageNumber: 1
    });
    paginationConfig($('#dg4account_change').datagrid('getPager'));
}