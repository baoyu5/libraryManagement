/**
 * User: Roland
 */
$(document).ready(
    function () {

        // var toolbarAll = [{
        //     text: '交易详情',
        //     //iconCls: 'icon-add',
        //     handler: function () {
        //         transactionDetail(0, $('#dg4transactions').datagrid('getSelected'));
        //     }
        // }];
        //
        // var urls = ['/api/transaction_detail'];

        //初始化交易市场选项
        $('#transaction_details_market').combobox({
            url: 'api/markets_name',
            valueField: 'id',
            textField: 'name',
            panelHeight: 110,
            loadFilter: function (data) {
                if (data.status === 0) {
                    return data.data;
                }
                return [];
            }
        });
        // 初始化交易类型
        // $('#transaction_details_type').combobox({
        //     data: sysCommon.makeOptions(sysConfig.orderType)
        // });
        // // 初始化交易状态
        // $('#transaction_details_type').combobox({
        //     data: sysCommon.makeOptions(sysConfig.orderStatus)
        // });
        //初始化列表
        $('#dg4transactions').datagrid({
            title: '交易列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/transactions',
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
            toolbar: [{
                text: '交易详情',
                //iconCls: 'icon-add',
                handler: function () {
                    transactionDetail(0, $('#dg4transactions').datagrid('getSelected'));
                }
            }],
            onLoadSuccess: function (data) {
                $('#dg4transactions').datagrid('selectRow');//默认不选中数据
                noRecord($(this),data,'transactionNo',6);
            },
            onDblClickRow: function (index, row) {
                transactionDetail(index, row);
            },
            onLoadError: function () {
                accessDenied();
            }
        });

        //设置分页控件
        paginationConfig($('#dg4transactions').datagrid('getPager'));
    }
);
// 双击显示交易明细详情
function transactionDetail(index, row) {
    if (row) {
        var viewId = 'dlg4_transaction_detail', viewTitle = '订单详情';
        /*if (viewId) {*/
            var promise = sysCommon.loadRowToView(function () {
                return loadTransactionDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
//}

        //$('#fm4batch_job').form('load',row);
        //url = 'update_user.php?id='+row.id;
    }
    else {
        noSelectAlert();
    }
}

function loadTransactionDetail(row) {
    var data = {};
    var promise = $.ajax({
        url: 'api/transaction_detail?Id=' + row['id'],
        // 为了兼容某些不合规则的接口
        dataType: 'json',
        type: "post",
        error: function (data) {
            var error = JSON.parse(data.responseText);
            showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
        }
    });
    return {
        'promise': promise.pipe(function (responseData) {
            var data = responseData.data;
            data.__raw = row;
            return data;
        })
    };
}


// 查询
function transactionDetailsQuery() {
    var params = {};
    var temp = $('#transaction_details_market').combobox('getValue').trim();
    if(temp != -1){
        params.marketId = temp;
    }
    params.transactionNo= $('#transaction_serial_orderNo').textbox('getValue').trim();
    params.orderNo= $('#transaction_details_orderNo').textbox('getValue').trim();
    params.type = $('#transaction_details_type').combobox('getValue').trim();
    params.status = $('#transaction_details_status').combobox('getValue').trim();
    params.startTime = $('#transaction_details_datefrom').datebox('getValue').trim();
    params.endTime = $('#transaction_details_dateto').datebox('getValue').trim();
    //检查非法字符
    var reg = /^[\w\d_-]{0,}$/;
    if(reg.test(params.transactionNo) && reg.test(params.orderNo)){
        $('#dg4transactions').datagrid({
            'url': 'api/transactions?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4transactions').datagrid('getPager'));
    }else{
        return showMessage('流水号或订单号含有非法字符！');
    }

}

// 重置查询条件
function transactionDetailsReset() {
    $('#transaction_details_market').combobox('clear');
    $('#transaction_details_type').combobox('select', 0);
    $('#transaction_details_status').combobox('select', 0);
    $('#transaction_details_datefrom').datebox('clear');
    $('#transaction_details_dateto').datebox('clear');
    $('#transaction_serial_orderNo').textbox('clear');
    $('#transaction_details_orderNo').textbox('clear');

    $('#dg4transactions').datagrid({
        'url': 'api/transactions',
        pageNumber: 1
    });
    paginationConfig($('#dg4transactions').datagrid('getPager'));
}

function format(time) {
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var day = time.getDate();
    if (month<10) {
        month = "0"+month;
    }
    if (day<10) {
        day = "0"+day;
    }
    return year+"-"+month+"-"+day;
}

// 下载报表
function downloadTransactionDetailsReportBy() {

    var params = getTransactionDetailParams();
    $.messager.confirm("操作确认","数据下载前1000条，确认下载吗？",function(r){
        if(r){
            $.ajax({
                url: 'api/download_transaction_detail_report_by',
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

function getTransactionDetailParams() {
    var params = {};

    var temp = $('#transaction_details_market').combobox('getValue').trim();
    if(temp != -1){
        params.marketId = temp;
    }
    params.transactionNo= $('#transaction_serial_orderNo').textbox('getValue').trim();
    params.orderNo= $('#transaction_details_orderNo').textbox('getValue').trim();
    params.type = $('#transaction_details_type').combobox('getValue').trim();
    params.status = $('#transaction_details_status').combobox('getValue').trim();
    params.startTime = $('#transaction_details_datefrom').datebox('getValue').trim();
    params.endTime = $('#transaction_details_dateto').datebox('getValue').trim();

    return params;
}
// function transactionStatisticsByDay() {
//     var endTime = new Date();
//     var startTime = new Date(endTime.getFullYear(),endTime.getMonth(),endTime.getDate()-1);
//     $.ajax({
//         url: "api/transaction_statistics_by_day?startTime="+format(startTime)+"&endTime="+format(endTime),
//         dataType: 'json',
//         type: "post",
//     });
// }
// function withdrawalJob() {
//     $.ajax({
//         url:"http://localhost:60004/open/api/withdrawal_job",
//         dataType: 'jsonp',
//         type:"post",
//         success:$('#dg4transactions').reload('api/transactions')
//     })
//
// }