/**
 * User: Roland
 */
$(document).ready(
    function () {

        $('#dg4fundsCollect').datagrid({
            title: '汇总列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/funds_collect',
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
                $('#dg4fundsCollect').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this), data, 'accountCode', 7);//无记录
            },
            onDblClickRow: function (index, row) {
                //memberDetail(index, row);
            }

        });

        //设置分页控件
        paginationConfig($('#dg4fundsCollect').datagrid('getPager'));
    }
);

function fundsCollectQuery() {
    var params = {};
    params.cName = $('#cName').textbox('getValue').toString();
    var reg = /^[\w\d\u4e00-\u9fa5_-]{0,}$/;
    if(reg.test(params.cName)){
        $('#dg4fundsCollect').datagrid({
            'url': 'api/funds_collect?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4fundsCollect').datagrid('getPager'));
    }else{
        return showMessage('查询条件只能包括字母、数字、汉字、下划线和连接符！');
    }

}

// 重置查询条件
function fundsCollectReset() {
    $('#cName').textbox('clear');
    $('#dg4fundsCollect').datagrid({
        'url': 'api/funds_collect',
        pageNumber: 1
    });
    paginationConfig($('#dg4fundsCollect').datagrid('getPager'));
}

//下载报表
function fundsCollectReport() {
    $.messager.confirm("操作确认", "数据下载前1000条，确认下载吗？", function (r) {
        if (r) {
            var params = {};
            params.companyName = $('#cName').textbox('getValue').trim();

            $.ajax({
                url: 'api/download_funds_collect_report',
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