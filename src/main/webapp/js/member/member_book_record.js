var memberBookRecordsApi = new sysCommon.api('memberBookRecord', {
        'loadUri':'user/book_records',
        'recordIdName': 'id'
    }
);

$(document).ready(
    function() {

        $('#dg4memberBookRecord').datagrid({
            title: '借书记录',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'user/book_records',
            method: 'get',
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:15,
            pageList: [15, 30, 50, 100],
            loadFilter: sysCommon.loadFilter,
            onLoadError: function() {
                accessDenied();
            },
            onLoadSuccess: function(data) {
                memberBookRecordsApi.onReloadSuccess();
            }
        });

        //设置分页控件
        paginationConfig($('#dg4memberBookRecord').datagrid('getPager'));
    }
);

function queryMemberBookRecords(){
    var params = {};

    params.bookCode = $('#qMemberRecordBookCode').val();
    params.bookName = $('#qMemberRecordBookName').val();

    $('#dg4memberBookRecord').datagrid({
        'url': 'user/book_records?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4memberBookRecord').datagrid('getPager'));
}

function resetQueryMemberBookRecords() {
    $('#qMemberRecordBookCode').textbox('reset');
    $('#qMemberRecordBookName').textbox('reset');
}