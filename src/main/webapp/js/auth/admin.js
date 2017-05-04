var adminsApi = new sysCommon.api('admin', {
        'createUri': 'admin/admin_add',
        'deleteUri': 'admin/admin_delete',
        'editUri': 'admin/admin_edit',
        'recordIdName': 'id'
    }
);

$(document).ready(
    function() {
        var toolbarAll = [{
            text: '添加操作员',
            handler: function () {
                adminsApi.create('添加操作员');
            }
        }, {
            text: '修改操作员',
            handler: function () {
                adminsApi.edit('修改操作员');
            }
        }, {
            text: '修改角色',
            handler: function () {
                editRoles();
            }
        }, {
            text: '修改密码',
            handler: function () {
                editPassword();
            }
        }, {
            text: '删除操作员',
            handler: function () {
                adminsApi.delete('确认要删除该操作员吗?');
            }
        }];

        var urls = ['/admin/admin_add', '/admin/admin_edit', '/admin/admin_roles_update', '/admin/password_update', '/admin/admin_delete'];

        $('#dg4admin').datagrid({
            title: '管理员列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'admin/admins',
            method: 'post',
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
        tips[count] = (count+1)+'.登录名'+tip1;
        count++;
    }
    var tip2 = checkRealName($('#newAdminRealName'), 2, 20);
    if (!$.isEmptyObject(tip2)) {
        tips[count] = (count+1)+'.姓名'+tip2;
        count++;
    }
    var tip3 = checkPhone($('#newAdminPhone'));
    if (!$.isEmptyObject(tip3)) {
        tips[count] = (count+1)+'.手机号'+tip3;
        count++;
    }
    var tip4 = checkEmail($('#newAdminEmail'));
    if (!$.isEmptyObject(tip4)) {
        tips[count] = (count+1)+'.邮箱'+tip4;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i < tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_new_admin_tips'), text);
        return;
    }
    adminsApi.save();
}

function saveAdmin(){
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#adminLoginName'), 4, 20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.登录名'+tip1;
        count++;
    }
    var tip2 = checkRealName($('#adminRealName'), 2, 20);
    if (!$.isEmptyObject(tip2)) {
        tips[count] = (count+1)+'.姓名'+tip2;
        count++;
    }
    var tip3 = checkPhone($('#adminPhone'));
    if (!$.isEmptyObject(tip3)) {
        tips[count] = (count+1)+'.手机号'+tip3;
        count++;
    }
    var tip4 = checkEmail($('#adminEmail'));
    if (!$.isEmptyObject(tip4)) {
        tips[count] = (count+1)+'.邮箱'+tip4;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4admins_tips'), text);
        return;
    }
    adminsApi.update();
}

function editRoles() {
    $("#dlg4admin_roles_tips").html('');

    var row = $('#dg4admin').datagrid('getSelected');
    if (row) {
        $('#dlg4admin_roles').dialog('open').dialog('center').dialog('setTitle','修改角色');
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
    var password = $('#adminNewPassword').val();
    var passwordConfirm = $("#adminNewPasswordConfirm").val();

    $.ajax({
        url: "admin/password_update",
        data:{'adminId':row['id'], 'password':$('#adminNewPassword').val(), 'passwordConfirm':$("#adminNewPasswordConfirm").val()},
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