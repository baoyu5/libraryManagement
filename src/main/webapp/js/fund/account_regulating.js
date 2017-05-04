/**
 * User: Roland
 */
$(document).ready(
    function() {
        var toolbarAll = [{
            text:'调账',
            //iconCls: 'icon-add',
            handler: function () {
                if ($('#rglDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    regulating();
                }
            },
        },{
            text:'忽略',
            handler:function (){
                if ($('#rglDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    ignore()
                }
            }
        },{
            text:'错账报表下载',
            handler:function () {
                downloadCIBRHDetailsReport();
            }
        }];

        var urls = ['/api/funds_adjust', '/api/ignore_funds_adjust', '/api/download_cibrh_details_report'];
        var toolbar = getToolbar(toolbarAll, urls);

        if (toolbar == null) {
            toolbar = [];
        } else {
            toolbar.push('-')
        };

        $('#bank_name').combobox({
            url: 'api/banks_name',
            valueField: 'bankCode',
            textField: 'name',
            panelHeight: 110,
            loadFilter: function (data) {
                if (data.status === 0) {
                    return data.data;
                }
                return [];
            }
        });

        $('#dg4regulation').datagrid({
            title: '错账列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/reconciliation_history',
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
                noRecord($(this),data,'id',12);
            },
        });

        //设置分页控件
        paginationConfig($('#dg4regulation').datagrid('getPager'));
    }
);

function ignore() {
    var row = $('#dg4regulation').datagrid('getSelected');
    if (row){
        $.messager.confirm('操作确认','该笔金额较大，您确定要忽略该笔交易吗？',function(r){
            if(r){
            $.ajax({
                url: 'api/ignore_funds_adjust?id=' + row['id'],
                dataType: 'json',
                type: "post",
                success:function (result) {
                    if(result.data == -1){
                        showMessage("忽略失败！")
                    }
                    if (result.data == 0) {
                        showMessage("忽略成功！");
                        $('#dg4regulation').datagrid('reload');
                        return;
                    }
                    if (result.data == 2){
                        showMessage("已经进行过调账，不能再忽略！");
                    }
                    if(result.data == 3){
                        showMessage("记录已经被忽略，不能再次忽略！");
                    }
                }
              });
            }
        });

    }
    else {
        noSelectAlert();
    }

}

function regulating(){
    var row = $('#dg4regulation').datagrid('getSelected');
    if (row){
        $.messager.confirm('操作确认','该笔金额较大，您确定要进行调账吗？',function(r){
           if(r) {
               $.ajax({
                   url: 'api/funds_adjust?id=' + row['id'],
                   dataType: 'json',
                   type: "post",
                   success: function (result) {
                       if (result.data == -1) {
                           showMessage("调账失败！")
                       }
                       if (result.data == 0) {
                           showMessage("调账成功！");
                           $('#dg4regulation').datagrid('reload');
                           return;
                       }
                       if(result.data == -2){
                           showMessage("数据错误！")
                       }
                       if (result.data == 2) {
                           showMessage("已经进行过调账，不能再次调账！");
                       }
                       if (result.data == 3) {
                           showMessage("记录已经被忽略，不能再调账！");
                       }
                   }
               });
           }
        });
    }
    else {
        noSelectAlert();
    }
}

function getParams() {
    var params = {};

    params.transactionNo= $('#transaction_no').textbox('getValue').trim();
    params.type = $('#transaction_type').combobox('getValue').trim();
    params.bankCode = $('#bank_name').combobox('getValue').trim();
    params.startTime = $('#qFrom').datebox('getValue').trim();
    params.endTime = $('#qTo').datebox('getValue').trim();

    return params;
}

function CIBRHDetailsQuery() {
    var params = getParams();
    var reg = /^[\w\d_-]{0,}$/;
    if(reg.test(params.transactionNo)){
        $('#dg4regulation').datagrid({
            'url': 'api/reconciliation_history?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4regulation').datagrid('getPager'));
    }else{
        return showMessage('订单号只能包括字母、数字、下划线和连接符！');
    }
}

// 重置查询条件
function CIBRHDetailsReset() {
    $('#transaction_no').textbox('clear');
    $('#transaction_type').combobox('select', 0);
    $('#bank_name').combobox('select', "");
    $('#qFrom').datebox('clear');
    $('#qTo').datebox('clear');

    $('#dg4regulation').datagrid({
        'url': 'api/reconciliation_history',
        pageNumber: 1
    });
    paginationConfig($('#dg4regulation').datagrid('getPager'));
}

// 下载报表
function downloadCIBRHDetailsReport() {
    $.messager.confirm("操作确认","数据下载前1000条，确认下载吗？",function(r){
        if(r){
            var params = getParams();
            $.ajax({
                url: 'api/download_cibrh_details_report',
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

