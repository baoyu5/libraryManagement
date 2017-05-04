$(document).ready(
    function () {

        $('#qSplitMarketName').combobox({
            url: 'api/markets_name',
            valueField: 'marketCode',
            textField: 'name',
            panelHeight: 110,
            loadFilter: function (data) {
                if (data.status === 0) {
                    return data.data;
                }
                return [];
            }
        });

        //初始化列表
        $('#dg4marketTransactionSplit').datagrid({
            title: '平台分润列表',
            collapsible: false,
            fit: true,
            method: "get",
            url: 'api/load_market_transaction_split',
            loadFilter: sysCommon.loadFilter,
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,
            pagination: true,
            rownumbers: true,
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            onLoadSuccess: function (data) {
                $('#dg4marketTransactionSplit').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'transactionNo',10);//无记录
            },
            onLoadError: function () {
                accessDenied();
            }
        });

        paginationConfig($('#dg4marketTransactionSplit').datagrid('getPager'));
    }
);

function getTransactionSplitParams() {
    var params = {};
    params.marketCode = $('#qSplitMarketName').combobox('getValue').trim();
    params.startTime = $('#qSplitTransactionDateFrom').datebox('getValue').trim();
    params.endTime = $('#qSplitTransactionDateTo').datebox('getValue').trim();
    params.transactionNo = $('#qMarketTransactionNo').textbox('getValue').trim();
    params.code = $('#qMarketCode').textbox('getValue').trim();
    params.transactionType = $('#qMarketTransactionType').combobox('getValue').trim();

    return params;
}

// 查询
function platformSplitQuery() {
    //增加条件验证
    var params = getTransactionSplitParams();
    var reg = /^[\w\d_-]{0,}$/;
    if(reg.test(params.code) && reg.test(params.transactionNo)){
        $('#dg4marketTransactionSplit').datagrid({
            'url': 'api/load_market_transaction_split?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4marketTransactionSplit').datagrid('getPager'));
    }else{
        return showMessage('平台流水号或市场编码含有非法字符！');
    }

}

// 重置查询条件
function platformSplitReset() {
    $('#qSplitMarketName').combobox('select', "");
    $('#qSplitTransactionDateFrom').datebox('clear');
    $('#qSplitTransactionDateTo').datebox('clear');

    $('#qMarketTransactionNo').textbox('clear');
    $('#qMarketCode').textbox('clear');
    $('#qMarketTransactionType').combobox('clear');


    $('#dg4marketTransactionSplit').datagrid({
        'url': 'api/load_market_transaction_split',
        pageNumber: 1
    });
    paginationConfig($('#dg4marketTransactionSplit').datagrid('getPager'));
}

// 下载报表
function downloadPlatformSplitReportBy() {
    var params = getTransactionSplitParams();
    $.messager.confirm("操作确认","数据下载前1000条，确认下载吗？",function(r){
        if(r){
            console.log(params);
            $.ajax({
                url: 'api/download_platform_split_report_by',
                contentType: "application/json",
                data: params,
                async: false,
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