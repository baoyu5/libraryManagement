var booksApi = new sysCommon.api('book', {
        'loadUri':'user/books',
        'createUri': 'book/add',
        'deleteUri': 'book/delete',
        'editUri': 'book/edit',
        'recordIdName': 'id'
    }
);

$(document).ready(
    function() {
        var toolbarAll = [{
            text: '添加书籍',
            handler: function () {
                booksApi.create('添加书籍');
            }
        }, {
            text: '修改书籍',
            handler: function () {
                booksApi.edit('修改书籍');
            }
        }, {
            text: '删除书籍',
            handler: function () {
                booksApi.delete('确认要删除该书籍吗?');
            }
        }];

        var urls = ['/book/add', '/book/edit', '/book/delete'];

        $('#dg4book').datagrid({
            title: '书籍列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'user/books',
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
                booksApi.onReloadSuccess();
            },
            toolbar: getToolbar(toolbarAll, urls)
        });

        //设置分页控件
        paginationConfig($('#dg4book').datagrid('getPager'));
    }
);

function saveNewBook(){
    booksApi.save();
}

function saveBook(){
    booksApi.update();
}

function queryBooks(){
    var params = {};

    var code = $('#qBookCode').val();
    var loginName = $('#qBookName').val();
    var realName = $('#qBookAuth').val();

    params.code = code;
    params.bookName = loginName;
    params.auth = realName;

    $('#dg4book').datagrid({
        'url': 'user/books?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4book').datagrid('getPager'));
    // booksApi.setQueryParams();
}

function resetQueryBooks() {
    $('#qBookCode').textbox('reset');
    $('#qBookName').textbox('reset');
    $('#qBookAuth').textbox('reset');
    // booksApi.unsetQueryParams();
}