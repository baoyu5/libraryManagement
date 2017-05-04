var adminsApi = new sysCommon.api('admin', {
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
            text: '修改管理员密码',
            handler: function () {
                editPassword();
            }
        }, {
            text: '删除管理员',
            handler: function () {
                adminsApi.delete('确认要删除该管理员吗?');
            }
        }];

        var urls = ['/admin/add', '/admin/edit', '/admin/admin_roles_update', '/admin/password_update', '/admin/delete'];

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
    var tip1 = checkName($('#newAdminLoginName'), 4, 20);
    if (!$.isEmptyObject(tip1)) {
        tips[count++] = count + tip1;
    }
    var tip2 = checkRealName($('#newAdminRealName'), 2, 20);
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
    var tip5 = checkPassword($('#newAdminPassword'));
    if (!$.isEmptyObject(tip5)) {
        tips[count++] = count + tip5;
    }
    var tip6 = checkPasswordConfirm($('#newAdminPassword'), $('#newAdminPasswordConfirm'));
    if (!$.isEmptyObject(tip6)) {
        tips[count++] = count + tip6;
    }

    if (tips.length != 0) {
        showTips(tips, $('#dlg4_new_admin_tips'));
        return;
    }
    adminsApi.save();
}

function saveAdmin(){
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#adminLoginName'), 4, 20);
    if (!$.isEmptyObject(tip1)) {
        tips[count++] = count + tip1;
    }
    var tip2 = checkRealName($('#adminRealName'), 2, 20);
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
        showTips(tips, $('#dlg4admins_tips'));
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
            url: 'admin/roles',
            method: 'post',
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
                    type: "post",
                    success: function (data) {
                        var roles = data['data'];
                        for (var i = 0; i < roles.length; i++) {
                            var rowIndex = $('#dg4admin_roles').datagrid('getRowIndex', roles[i]['id']);
                            $('#dg4admin_roles').datagrid('checkRow', rowIndex);
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
        $('#dlg4admin_password_tips').html('');
        $('#fm4admin_password').form('clear');
        $('#dlg4admin_password').dialog('open').dialog('center').dialog('setTitle','修改密码');
    } else {
        noSelectAlert();
    }
}

function savePassword() {
    var row = $('#dg4admin').datagrid('getSelected');

    // todo 密码判断
    var tips = [];
    var count = 0;

    var tip1 = checkPassword($('#adminNewPassword'));
    if (!$.isEmptyObject(tip1)) {
        tips[count++] = count + tip1 + '<br/>';
    }
    var tip2 = checkPasswordConfirm($('#adminNewPassword'), $("#adminNewPasswordConfirm"));
    if (!$.isEmptyObject(tip2)) {
        tips[count++] = count + tip2 + '<br/>';
    }

    if (tips.length != 0) {
        showTips(tips, $('#dlg4admin_password_tips'));
        return;
    }

    var password = $('#adminNewPassword').val().trim();
    var passwordConfirm = $("#adminNewPasswordConfirm").val().trim();

    $.ajax({
        url: "admin/password_update",
        data:{'adminId':row['id'], 'password':password, 'passwordConfirm':passwordConfirm},
        type: "post",
        success: function () {
            $('#dlg4admin_password').dialog('close');
        },
        error: function (data) {
            errorHandler(data, $("#dlg4admin_password_tips"));
        }
    });
}

function saveRoles(){
    var operatorRow = $('#dg4admin').datagrid('getSelected');
    var row = $('#dg4admin_roles').datagrid('getChecked');
    var roleIds = '';
    for (var i = 0; i < row.length; i++) {
        if (roleIds != '') {
            roleIds += ',';
        }
        roleIds += row[i]['id'];
    }

    $.ajax({
        url: "user/admin_roles_update?operatorId=" + operatorRow['id'] + "&rolesIds=" + roleIds,
        type: "post",
        success: function () {
            $('#dlg4admins_roles').dialog('close');        // close the dialog
        },
        error: function (data) {
            var error = JSON.parse(data.responseText)
            showError($("#dlg4admins_roles_tips"), error["errorMessage"]);
        }
    });
}

function queryAdmins(){
    adminsApi.setQueryParams();
}

function ResetQueryAdmins() {
    adminsApi.unsetQueryParams();
}