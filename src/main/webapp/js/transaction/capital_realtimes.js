/**
 * User: Roland
 */
$(document).ready(
    function () {
       $('#capital_realtimes_market').combobox({
            url: 'api/markets_name',
            valueField: 'id',
            textField: 'name',
            loadFilter: function (data) {
                if (data.status == 0) {
                    return data.data;
                }
                return [];
            }
        });

        // 获取选中的 market ID
        var getSelectedMarket = function () {
            return $('#capital_realtimes_market').combobox('getValue');
        };

        $('#dg4capitalRealTimes').datagrid({
            title: '实时出金列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/real_time_transactions_capital',
            loadFilter: sysCommon.loadFilter,
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            onLoadSuccess: function (data) {
                $('#dg4capitalRealTimes').datagrid('selectRow');//默认不选中数据
                noRecord($(this),data,'transactionNo',6);
            },
            onDblClickRow: function (index, row) {
                //memberDetail(index, row);
            }
        });

        //设置分页控件
        paginationConfig($('#dg4capitalRealTimes').datagrid('getPager'));
    }
);

function capitalRealTimesQuery(){
    var params = {};
    var temp = $('#capital_realtimes_market').combobox('getValue').trim();
    if(temp != -1){
        params.marketId = temp;
    }
    params.status = $('#capital_realtimes_status').combobox('getValue').trim();
    params.startTime = $('#capital_realtimes_datefrom').datebox('getValue').trim();
    params.endTime = $('#capital_realtimes_dateto').datebox('getValue').trim();
    $('#dg4capitalRealTimes').datagrid({
        'url': 'api/real_time_transactions_capital?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4capitalRealTimes').datagrid('getPager'));
}

function capitalRealTimesReset() {
    $('#capital_realtimes_market').combobox('clear');
    $('#capital_realtimes_status').combobox('select', 0);
    $('#capital_realtimes_datefrom').datebox('clear');
    $('#capital_realtimes_dateto').datebox('clear');

    $('#dg4capitalRealTimes').datagrid({
        'url': 'api/real_time_transactions_capital',
        pageNumber: 1
    });
    paginationConfig($('#dg4capitalRealTimes').datagrid('getPager'));
}

function capitalRealTimesReport() {
    var params = getCapitalRealTimesParams();

    $.messager.confirm("操作确认","数据下载前1000条，确认下载吗？",function (r) {
        if(r){
            $.ajax({
                url: 'api/download_capital_realtimes_report_by',
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

function getCapitalRealTimesParams() {
    var params = {};

    var temp = $('#capital_realtimes_market').combobox('getValue').trim();
    if(temp != -1){
        params.marketId = temp;
    }

    params.status = $('#capital_realtimes_status').combobox('getValue').trim();
    params.startTime = $('#capital_realtimes_datefrom').datebox('getValue').trim();
    params.endTime = $('#capital_realtimes_dateto').datebox('getValue').trim();

    return params;
}