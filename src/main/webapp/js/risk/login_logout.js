$(document).ready(
    function () {
        $('#dg4login_logout').datagrid({
            title: '登入登出列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/login_logouts',
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
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function (data) {
                $('#dg4login_logout').datagrid('selectRow');//默认不选中数据
                noRecord($(this),data,'username',6);
                logApi.onReloadSuccess();
            }
    });
        //设置分页控件
        paginationConfig($('#dg4login_logout').datagrid('getPager'));
    }
);

function loginLogoutStatusFormatter(val) {
    if (val == 1) {
        return '成功';
    } else if (val == 2) {
        return '失败';
    }
}

function loginLogoutTypeFormatter(val) {
    if (val == 1) {
        return '登入';
    } else if (val == 2) {
        return '登出';
    }
}

// 查询
function loginLogoutQuery() {
    var params = {};
    params.name = $('#name').textbox('getValue').trim();
    params.startTime = $('#loginLogout_details_datefrom').datebox('getValue').trim();
    params.endTime = $('#loginLogout_details_dateto').datebox('getValue').trim();
    params.remoteIp = $('#qRemoteIp').textbox('getValue').trim();
    params.type = $('#qType').combobox("getValue").trim();
    // 增加查询验证
    var reg = /^[\w\d_-]{0,}$/;
    var regName = /^[\w\d\u4e00-\u9fa5_-]{0,}$/;
    if(reg.test(params.remoteIp) && regName.test(params.name)){
        $('#dg4login_logout').datagrid({
            'url': 'api/login_logouts?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4login_logout').datagrid('getPager'));
    }else{
        return showMessage('用户名或IP地址格式错误！');
    }

}

// 重置查询条件
function loginLogoutReset() {
    $('#name').textbox('clear');
    $('#loginLogout_details_datefrom').datebox('clear');
    $('#loginLogout_details_dateto').datebox('clear');
    $('#qRemoteIp').textbox('clear');
    $('#qType').combobox('select', -1);
    $('#dg4login_logout').datagrid({
        'url': 'api/login_logouts',
        pageNumber: 1
    });
    paginationConfig($('#dg4login_logout').datagrid('getPager'));
}

function remotePortFormatter(val) {
    if (val == 0) {
        return '-';
    }
    return val;
}