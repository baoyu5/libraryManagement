var bookRecordsApi = new sysCommon.api('bookRecord', {
        'loadUri':'book_record/book_records',
        'createUri': 'book_record/add',
        'recordIdName': 'id'
    }
);

$(document).ready(
    function() {
        var toolbarAll = [{
            text: '会员借书',
            handler: function () {
                bookRecordsApi.create('会员借书');
            }
        }, {
            text: '归还书籍',
            handler: function () {
                returnBook();
            }
        }];

        var urls = ['/book_record/add', '/book_record/return_book'];

        $('#dg4bookRecord').datagrid({
            title: '借书记录',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'book_record/book_records',
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
                bookRecordsApi.onReloadSuccess();
            },
            toolbar: getToolbar(toolbarAll, urls)
        });

        //设置分页控件
        paginationConfig($('#dg4bookRecord').datagrid('getPager'));
    }
);

function saveNewBookRecord(){
    var params = {};

    params.bookCode = $('#newRecordBookCode').val();
    params.userCode = $('#newRecordUserCode').val();
    $.ajax({
        url: "book_record/add?" + $.param(params),
        type: "post",
        success: function () {
            // 关闭窗口
            $('#dlg4_new_bookRecord').dialog('close');
            // 重新加载数据
            $('#dg4bookRecord').datagrid('reload');
        },
        error: function (data) {
            errorHandler(data, $('#dlg4_new_bookRecord_tips'));
        }
    });
}

function returnBook() {
    var row = $('#dg4bookRecord').datagrid('getSelected');
    if (row) {
        $.ajax({
            url: "book_record/return_book?bookRecordId=" + row['id'],
            type: "post",
            success: function () {
                showMessage("书籍归还成功");
                $('#dg4bookRecord').datagrid('reload');
                return;
            },
            error: function (data) {
                errorHandler2(data);
            }
        });
    } else {
        noSelectAlert();
    }
}

function queryBookRecords(){
    var params = {};

    params.bookCode = $('#qRecordBookCode').val();
    params.bookName = $('#qRecordBookName').val();
    params.userCode = $('#qRecordUserCode').val();
    params.userName = $('#qRecordUserLoginName').val();
    params.userRealName = $('#qRecordUserRealName').val();

    $('#dg4bookRecord').datagrid({
        'url': 'book_record/book_records?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4bookRecord').datagrid('getPager'));
}

function resetQueryBookRecords() {
    $('#qRecordBookCode').textbox('reset');
    $('#qRecordBookName').textbox('reset');
    $('#qRecordUserCode').textbox('reset');
    $('#qRecordUserLoginName').textbox('reset');
    $('#qRecordUserRealName').textbox('reset');
}