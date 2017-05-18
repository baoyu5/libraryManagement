var adminsApi = new sysCommon.api('admin', {
        'loadUri':'admin/admins',
        'createUri': 'admin/add',
        'deleteUri': 'admin/delete',
        'editUri': 'admin/edit',
        'recordIdName': 'id'
    }
);

$(document).ready(
    function() {
        var toolbarAll = [{
            text: '添加管理员',
            handler: function () {
                adminsApi.create('添加管理员');
            }
        }, {
            text: '修改管理员',
            handler: function () {
                adminsApi.edit('修改管理员');
            }
        }, {
            text: '修改管理员角色',
            handler: function () {
                editRoles();
            }
        }, {
            text: '重置管理员密码',
            handler: function () {
                editPassword();
            }
        }, {
            text: '删除管理员',
            handler: function () {
                adminsApi.delete('确认要删除该管理员吗?');
            }
        }];

        var urls = ['/admin/add', '/admin/edit', '/admin/admin_roles_update', '/admin/admin_password_reset', '/admin/delete'];

        $('#dg4admin').datagrid({
            title: '管理员列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'admin/admins',
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
                adminsApi.onReloadSuccess();
            },
            toolbar: getToolbar(toolbarAll, urls)
        });

        //设置分页控件
        paginationConfig($('#dg4admin').datagrid('getPager'));
    }
);

function saveNewAdmin(){
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#newAdminLoginName'), 4, 20, ".登录名");
    if (!$.isEmptyObject(tip1)) {
        tips[count++] = count + tip1;
    }
    var tip2 = checkRealName($('#newAdminRealName'), 2, 20, ".真实姓名");
    if (!$.isEmptyObject(tip2)) {
        tips[count++] = count + tip2;
    }
    var tip3 = checkPhone($('#newAdminPhone'));
    if (!$.isEmptyObject(tip3)) {
        tips[count++] = count + tip3;
    }
    var tip4 = checkEmail($('#newAdminEmail'));
    if (!$.isEmptyObject(tip4)) {
        tips[count++] = count + tip4;
    }
    // var tip5 = checkPassword($('#newAdminPassword'));
    // if (!$.isEmptyObject(tip5)) {
    //     tips[count++] = count + tip5;
    // }
    // var tip6 = checkPasswordConfirm($('#newAdminPassword'), $('#newAdminPasswordConfirm'));
    // if (!$.isEmptyObject(tip6)) {
    //     tips[count++] = count + tip6;
    // }

    if (tips.length != 0) {
        showTips(tips, $('#dlg4_new_admin_tips'));
        return;
    }
    adminsApi.save();
}

function saveAdmin(){
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#adminLoginName'), 4, 20, ".登录名");
    if (!$.isEmptyObject(tip1)) {
        tips[count++] = count + tip1;
    }
    var tip2 = checkRealName($('#adminRealName'), 2, 20, ".真实姓名");
    if (!$.isEmptyObject(tip2)) {
        tips[count++] = count + tip2;
    }
    var tip3 = checkPhone($('#adminPhone'));
    if (!$.isEmptyObject(tip3)) {
        tips[count++] = count + tip3;
    }
    var tip4 = checkEmail($('#adminEmail'));
    if (!$.isEmptyObject(tip4)) {
        tips[count++] = count + tip4;
    }
    if (tips.length != 0) {
        showTips(tips, $('#dlg4admin_tips'));
        return;
    }
    adminsApi.update();
}

function editRoles() {
    $("#dlg4admin_roles_tips").html('');

    var row = $('#dg4admin').datagrid('getSelected');
    if (row) {
        $('#dlg4admin_roles').dialog('open').dialog('center').dialog('setTitle','修改管理员角色');
        $('#dg4admin_roles').datagrid({
            title: '角色列表',
            collapsible: false,//是否可折叠的
            border: false,
            fit: true,//自动大小
            url: 'role/roles',
            method: 'get',
            remoteSort: false,
            idField: 'id',
            singleSelect: false,//是否单选
            loadFilter: sysCommon.loadFilter,
            onLoadError: function() {
                accessDenied();
            },
            onLoadSuccess: function(data) {
                $('#dg4admin_roles').datagrid('clearChecked');

                $.ajax({
                    url: "admin/admin_roles?adminId="+ row['id'],
                    type: "get",
                    success: function (data) {
                        if (data && data['data']) {
                            var roles = data['data'];
                            for (var i = 0; i < roles.length; i++) {
                                var rowIndex = $('#dg4admin_roles').datagrid('getRowIndex', roles[i]['id']);
                                $('#dg4admin_roles').datagrid('checkRow', rowIndex);
                            }
                        }
                    },
                    error: function (data) {
                        errorHandler(data, $("#dlg4admin_roles_tips"));
                    }
                });
            }
        });
    } else {
        noSelectAlert();
    }
}


function editPassword() {
    var row = $('#dg4admin').datagrid('getSelected');
    if (row) {
        // $('#dlg4admin_password_tips').html('');
        // $('#fm4admin_password').form('clear');
        // $('#dlg4admin_password').dialog('open').dialog('center').dialog('setTitle','修改密码');
        $.messager.confirm("操作确认", "确认要重置该管理员登录密码吗？", function (r) {
            if (r) {
                saveAdminPassword();
            }
        })
    } else {
        noSelectAlert();
    }
}

function saveAdminPassword() {
    var row = $('#dg4admin').datagrid('getSelected');
    //
    // var tips = [];
    // var count = 0;
    // var tip1 = checkPassword($('#adminNewPassword'));
    // if (!$.isEmptyObject(tip1)) {
    //     tips[count++] = count + tip1 + '<br/>';
    // }
    // var tip2 = checkPasswordConfirm($('#adminNewPassword'), $("#adminNewPasswordConfirm"));
    // if (!$.isEmptyObject(tip2)) {
    //     tips[count++] = count + tip2 + '<br/>';
    // }
    //
    // if (tips.length != 0) {
    //     showTips(tips, $('#dlg4admin_password_tips'));
    //     return;
    // }
    //
    // var password = $('#adminNewPassword').val().trim();

    $.ajax({
        url: "admin/admin_password_reset",
        data:{'adminId':row['id']},
        type: "post",
        success: function () {
            showMessage("重置成功");
            // $('#dlg4admin_password').dialog('close');
        },
        error: function (data) {
            errorHandler2(data);
        }
    });
}

function saveRoles(){
    var admin = $('#dg4admin').datagrid('getSelected');
    var row = $('#dg4admin_roles').datagrid('getChecked');
    var roleIds = '';
    for (var i = 0; i < row.length; i++) {
        if (roleIds != '') {
            roleIds += ',';
        }
        roleIds += row[i]['id'];
    }

    $.ajax({
        url: "admin/admin_roles_update?adminId=" + admin['id'] + "&rolesIds=" + roleIds,
        type: "post",
        success: function () {
            $('#dlg4admin_roles').dialog('close');        // close the dialog
        },
        error: function (data) {
            var error = JSON.parse(data.responseText)
            showError($("#dlg4admin_roles_tips"), error["errorMessage"]);
        }
    });
}

function queryAdmins(){
    var params = {};

    var code = $('#qAdminCode').val();
    var loginName = $('#qAdminLoginName').val();
    var realName = $('#qAdminRealName').val();

    params.code = code;
    params.loginName = loginName;
    params.realName = realName;

    $('#dg4admin').datagrid({
        'url': 'admin/admins?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4admin').datagrid('getPager'));
    // adminsApi.setQueryParams();
}

function resetQueryAdmins() {
    $('#qAdminCode').textbox('reset');
    $('#qAdminLoginName').textbox('reset');
    $('#qAdminRealName').textbox('reset');
    // adminsApi.unsetQueryParams();
}