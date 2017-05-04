
$(document).ready(
    function () {
        $('#dg4transaction_log').datagrid({
            title: '交易日志列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/transaction_logs',
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
                $('#dg4transaction_log').datagrid('selectRow',0);//选中第一条数据
                //logApi.onReloadSuccess();
                noRecord($(this),data,'transactionTime',5);
            }
        });
        //设置分页控件
        paginationConfig($('#dg4transaction_log').datagrid('getPager'));
    }
);

function transactionLogResultFormatter(val) {
    if (val == 0) {
        return '失败';
    } else if (val == 1) {
        return '成功';
    }
}

// 查询
function transactionLogQuery() {
    var params = {};
    params.accountCode = $('#transaction_log_account_code').textbox('getValue').trim();
    params.transactionType = $('#transaction_log_type').combobox('getValue').trim();
    params.startTime = $('#transaction_log_datefrom').datebox('getValue').trim();
    params.endTime = $('#transaction_log_dateto').datebox('getValue').trim();
    //增加条件验证
    var reg = /^[\w\d_-]{0,}$/;
    if(reg.test(params.accountCode)){
        $('#dg4transaction_log').datagrid({
            'url': 'api/transaction_logs?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4transaction_log').datagrid('getPager'));
    }else{
        return showMessage('会员编码只能包括字母、数字、下划线和连接符！');
    }

}

// 重置查询条件
function transactionLogReset() {
    $('#transaction_log_account_code').textbox('clear');
    $('#transaction_log_type').combobox('select', 0);
    $('#transaction_log_datefrom').datebox('clear');
    $('#transaction_log_dateto').datebox('clear');
    $('#dg4transaction_log').datagrid({
        'url': 'api/transaction_logs',
        pageNumber: 1
    });
    paginationConfig($('#dg4transaction_log').datagrid('getPager'));
}