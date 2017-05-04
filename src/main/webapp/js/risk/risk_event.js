/**
 * User: Roland
 */
$(document).ready(
    function() {
        var toolbarAll = [{
            text:'风险事件处理',
            //iconCls: 'icon-add',
            handler: function () {
                riskEventDealWith();
            },
        },{
            text:'风险事件下载',
            handler:function (){
                if ($('#eventContainer .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    riskEventReport()
                }
            }
        }];

        var urls = ['/api/risk_event_deal_with', '/api/download_risk_event_report'];
        var toolbar = getToolbar(toolbarAll, urls);

        if (toolbar == null) {
            toolbar = [];
        } else {
            toolbar.push('-')
        };

        $('#dg4riskEvent').datagrid({
            title: '风险事件列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/risk_event',
            loadFilter: sysCommon.loadFilter,
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            toolbar: toolbar,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            onLoadSuccess: function (data) {
                $('#dg4riskEvent').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'accountCode',9);
            },
            onDblClickRow: function (index, row) {
                //memberDetail(index, row);
            }

        });

        //设置分页控件
        paginationConfig($('#dg4riskEvent').datagrid('getPager'));
    }
);

function riskEventQuery() {
    var params = {};
    params.accountCode= $('#accountCode').textbox('getValue').trim();
    params.orderNo=$('#orderNo').textbox('getValue').trim();
    params.riskType = $('#riskType').combobox('getValue').trim();
    params.startTime = $('#riskFrom').datebox('getValue').trim();
    params.endTime = $('#riskTo').datebox('getValue').trim();

    //限制订单号内容li
    var reg = /^[\w\d_-]{0,}$/;
    if (reg.test(params.orderNo) && reg.test(params.accountCode)){
        $('#dg4riskEvent').datagrid({
            'url': 'api/risk_event?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4riskEvent').datagrid('getPager'));
    }else{
        return showMessage('会员编号和订单号只能包括字母、数字、下划线和连接符！');
    }
}

// 重置查询条件
function riskEventReset() {
    $('#accountCode').textbox('clear');
    $('#orderNo').textbox('clear');
    $('#riskType').combobox('select', 0);
    $('#riskFrom').datebox('clear');
    $('#riskTo').datebox('clear');
    $('#dg4riskEvent').datagrid({
        'url': 'api/risk_event',
        pageNumber: 1
    });
    paginationConfig($('#dg4riskEvent').datagrid('getPager'));
}

//报表下载
function riskEventReport() {
    $.messager.confirm("操作确认","数据下载前1000条，确认下载吗？",function(r){
        if(r){
            var params = {};
            params.accountCode= $('#accountCode').textbox('getValue').trim();
            params.orderNo=$('#orderNo').textbox('getValue').trim();
            params.riskType = $('#riskType').combobox('getValue').trim();
            params.startTime = $('#riskFrom').datebox('getValue').trim();
            params.endTime = $('#riskTo').datebox('getValue').trim();

            $.ajax({
                url: 'api/download_risk_event_report',
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
function riskEventDealWith() {
    var row = $('#dg4riskEvent').datagrid('getSelected');
    console.log(row.riskEventId);
    if (row==null){
       return showMessage("请选中一行数据！");
    }
    $.ajax({
        url: 'api/risk_event_deal_with?riskEventId='+row.riskEventId,
        contentType: "application/json",
        type: "post",
        success: function (result) {
          if (result.data == 1){
              showMessage("Action为报警无需流程处理！")
          }
          if(result.data == 2 ){
              showMessage("已经提交处理，等待审核！")
          }
          if(result.data == 3){
              showMessage("事件已经提交过处理！")
          }
            $('#dg4riskEvent').datagrid('reload');
        },
        error: function (result) {

        }
    })
}