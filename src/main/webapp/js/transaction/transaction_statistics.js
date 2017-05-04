/**
 * User: Roland
 */
$(document).ready(
    function () {
        $('#transaction_statistics_market').combobox({
            url: 'api/markets_name',
            valueField: 'id',
            textField: 'name',
            loadFilter: function (data) {
                if (data.status === 0) {
                    return data.data;
                }
                return [];
            }
        });

        // 获取选中的 market ID
        var getSelectedMarket = function () {
            return $('#transaction_statistics_market').combobox('getValue');
        };

        $('#dg4transaction_statistics').datagrid({
            title: '交易统计列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: false,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/order_statistics_by_day',
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
            showFooter: true,
            loadFilter: sysCommon.loadFilter,
            onLoadSuccess: function (data) {
                $('#dg4transaction_statistics').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'marketName',6);
            },
            onLoadError: function (data) {
                if (data.responseJSON && data.responseJSON.errorMessage) {
                    showMessage(data.responseJSON.errorMessage);
                    $('#dg4transaction_statistics').datagrid('loadData', {
                        'status': 0,
                        'data': {
                            'rows': [],
                            'footer': []
                        }
                    });
                }
            }
            //frozenColumns:[[
            //    {field:'ck',checkbox:true}
            //]],

        });

        //设置分页控件
        paginationConfig($('#dg4transaction_statistics').datagrid('getPager'));
    }
);

function queryTransactionStatistics() {
    var params = {};
    var temp = $('#transaction_statistics_market').combobox('getValue').trim();
    if(temp != -1){
        params.marketId = temp;
    }
    params.type = $('#transaction_stats_type').combobox('getValue').trim();
    params.startTime = $('#transaction-stats-datefrom').datebox('getValue').trim();
    params.endTime = $('#transaction-stats-dateto').datebox('getValue').trim();

    $('#dg4transaction_statistics').datagrid({
        'url': 'api/order_statistics_by_day?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4transaction_statistics').datagrid('getPager'));

}

function resetTransactionStatisticsQueryParams() {
    // clear data grid
    $('#dg4transaction_statistics').datagrid('loadData', {
        'status': 0,
        'data': {
            'rows': [],
            'footer': []
        }
    });
    $('#transaction_statistics_market').combobox('clear');
    $('#transaction-stats-datefrom').datebox('setValue', '');
    $('#transaction-stats-dateto').datebox('setValue', '');
    $('#transaction_stats_type').combobox('select'  );

    $('#dg4transaction_statistics').datagrid({
        'url': 'api/order_statistics_by_day',
        pageNumber: 1
    });
    paginationConfig($('#dg4transaction_statistics').datagrid('getPager'));
}

//下载报表
function transactionStatisticsReport() {
    $.messager.confirm("操作确认","数据下载前1000条，确认下载吗？",function(r){
        if(r){
            var params = {};
            var temp = $('#transaction_statistics_market').combobox('getValue').trim();
            if(temp != -1){
                params.marketId = temp;
            }
            params.type = $('#transaction_stats_type').combobox('getValue').trim();
            params.startTime = $('#transaction-stats-datefrom').datebox('getValue').trim();
            params.endTime = $('#transaction-stats-dateto').datebox('getValue').trim();

            $.ajax({
                url: 'api/download_transaction_statistics_report',
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
        }});
}