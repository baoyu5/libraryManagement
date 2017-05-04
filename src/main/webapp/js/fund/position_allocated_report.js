
$(document).ready(
    function () {
        var toolbarAll = [{
            text: '下载',
            //iconCls: 'icon-add',
            handler: function () {
                downloadPositionAllocatedCsv();
            },
        }];

        var urls = ['/api/position_allocated_report_list'];
        var toolbar = getToolbar(toolbarAll, urls);

        if (toolbar == null) {
            toolbar = [];
        } else {
            toolbar.push('-')
        };

        $('#dg4downloadPositionAllocated').datagrid({
            title: '头寸调拨报表下载列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/position_allocated_report_list',
            loadFilter: sysCommon.loadFilter,
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            toolbar: toolbar,
            pageSize: 50,
            pageList: [50, 100, 200],
            onLoadSuccess: function (data) {
                $('#dg4process_history').datagrid('selectRow', 0);//选中第一条数据
                noRecord($(this), data, 'date', 2);//无记录
            }
        });

        //设置分页控件
        paginationConfig($('#dg4downloadPositionAllocated').datagrid('getPager'));
    }
);

function downloadPositionAllocatedCsv() {
    var row = $('#dg4downloadPositionAllocated').datagrid('getSelected');
    if (row) {
        $.ajax({
            url: 'api/download_position_allocated_csv?' + row['date'],
            contentType: "application/json",
            data: row['date'],
            type: "get",
            success: function (result) {
                if (row['fileName']) {
                    window.location = "./CSV/" + row['fileName'];
                } else {
                    showMessage("报表未生成，下载失败!");
                }
            },
            error: function (result) {
                errorHandler2(result);
            }
        });
    } else {
        noSelectAlert();
    }
}

function positionAllocatedQuery() {
    var params = {};
    var date = $('#time').datebox('getValue').trim();
    params.date = date;

    $('#dg4downloadPositionAllocated').datagrid({
        'url': 'api/position_allocated_report_list?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4downloadPositionAllocated').datagrid('getPager'));
}

// 重置查询条件
function positionAllocatedReset() {
    $('#time').datebox('clear');
    $('#dg4downloadPositionAllocated').datagrid({
        'url': 'api/position_allocated_report_list',
        pageNumber: 1
    });
    paginationConfig($('#dg4downloadPositionAllocated').datagrid('getPager'));
}

