$(document).ready(
    function () {
        //初始化交易市场选项
        $('#qBankName').combobox({
            url: 'api/banks_name',
            valueField: 'bankCode',
            textField: 'name',
            panelHeight: 110,
            loadFilter: function (data) {
                if (data.status === 0) {
                    return data.data;
                }
                return [];
            },
            onLoadSuccess: function () {
            }
        });
        //初始化列表
        $('#dg4bankTransactions').datagrid({
            title: '出入金列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/bank_transactions',
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
            onLoadSuccess: function (data) {
                $('#dg4bankTransactions').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'bankTransactionNo',11);
            },
            onLoadError: function () {
                accessDenied();
            }
        });

        //设置分页控件
        paginationConfig($('#dg4bankTransactions').datagrid('getPager'));
    }
);

function getParams() {
    var params = {};

    params.bankCode = $('#qBankName').combobox('getValue').trim();
    params.transactionType= $('#qTransactionType').combobox('getValue').trim();
    params.startTime = $('#qTransactionDateFrom').datebox('getValue').trim();
    params.endTime = $('#qTransactionDateTo').datebox('getValue').trim();

    return params;
}

// 查询
function bankTransactionQuery() {

    var params = getParams();
    $('#dg4bankTransactions').datagrid({
        'url': 'api/bank_transactions?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4bankTransactions').datagrid('getPager'));
}

// 重置查询条件
function bankTransactionReset() {
    $('#qBankName').combobox('select', "");
    $('#qTransactionType').combobox('select', 0);
    $('#qTransactionDateFrom').datebox('clear');
    $('#qTransactionDateTo').datebox('clear');

    $('#dg4bankTransactions').datagrid({
        'url': 'api/bank_transactions',
        pageNumber: 1
    });
    paginationConfig($('#dg4bankTransactions').datagrid('getPager'));
}

// 下载报表
function exportBankTransactionsReport() {
    $.messager.confirm("操作确认","数据下载前1000条，确认下载吗？",function(r){
        if(r){
            var params = getParams();
            $.ajax({
                url: 'api/download_bank_transactions_report',
                contentType: "application/json",
                data: params,
                type: "get",
                success: function (result) {
                    if (result["status"] == 0) {
                        window.location = "/CSV/" + result["data"];
                    } else {
                        showMessage("没有数据，报表生成失败！");
                    }
                },
                error: function (result) {
                    errorHandler2(result);
                }
            });
        }
    });
}