
$(document).ready(
    function () {
        $('#dg4risk_event_process_log').datagrid({
            title: '风险事件处理日志列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/risk_event_process_logs',
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
            toolbar: [{
                text: '详情查看',
                handler: function () {
                    showRiskEventProcessDetail( $('#dg4risk_event_process_log').datagrid('getSelected'));
                }
            }],
            //frozenColumns:[[
            //    {field:'ck',checkbox:true}
            //]],
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function (data) {
                $('#dg4risk_event_process_log').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'processInstanceId',8);
            },
        });
        //设置分页控件
        paginationConfig($('#dg4risk_event_process_log').datagrid('getPager'));
    }
);

function showRiskEventProcessDetail(row) {
    if (row) {
        var viewId = 'dlg4risk_event_process_log_detail';
        var promise = sysCommon.loadRowToView(function () {
            return loadRiskEventProcessDetail(row);
        }, viewId);
    }
    promise.done(function () {
        $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', '风险事件处理日志');
    });
}

function loadRiskEventProcessDetail(row) {
    var data = {};
    var promise;
    promise = $.ajax({
        url: 'api/process_risk_event_history_request_detail?processInstanceId=' + row['processInstanceId'],
        contentType: 'application/json',
        type: 'post',
    });
    return {
        'promise': promise.pipe(function (responseData) {
            var data = responseData.data;
            $("#riskEventProcessLogInstanceId").val(row['processInstanceId']);
            data.__raw = row;
            return data;
        })
    };
}

// 查询
function queryRiskEventLogProcess() {
    var params = {};
    params.riskType = $('#risk_event_log_type').combobox('getValue').trim();
    params.startTime = $('#risk-event-log-datefrom').datebox('getValue').trim();
    params.endTime = $('#risk-event-log-dateto').datebox('getValue').trim();
    $('#dg4risk_event_process_log').datagrid({
        'url': 'api/risk_event_process_logs?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4risk_event_process_log').datagrid('getPager'));
}

// 重置查询条件
function resetRiskEventLogProcess() {
    $('#risk_event_log_type').combobox('select',0);
    $('#risk-event-log-datefrom').datebox('setValue', '');
    $('#risk-event-log-dateto').datebox('setValue', '');
    $('#dg4risk_event_process_log').datagrid({
        'url': 'api/risk_event_process_logs',
        pageNumber: 1
    });
    paginationConfig($('#dg4risk_event_process_log').datagrid('getPager'));
}