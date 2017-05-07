var membersApi = new sysCommon.api('member', {
        'loadUri':'member/members',
        'createUri': 'member/add',
        'deleteUri': 'member/delete',
        'editUri': 'member/edit',
        'recordIdName': 'id'
    }
);

$(document).ready(
    function() {
        var toolbarAll = [{
            text: '添加会员',
            handler: function () {
                membersApi.create('添加会员');
            }
        }, {
            text: '修改会员',
            handler: function () {
                membersApi.edit('修改会员');
            }
        }, {
            text: '重置会员密码',
            handler: function () {
                resetMemberPassword();
            }
        }, {
            text: '删除会员',
            handler: function () {
                membersApi.delete('确认要删除该会员吗?');
            }
        }];

        var urls = ['/member/add', '/member/edit', '/member/member_password_reset', '/member/delete'];

        $('#dg4member').datagrid({
            title: '会员列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'member/members',
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
                membersApi.onReloadSuccess();
            },
            toolbar: getToolbar(toolbarAll, urls)
        });

        //设置分页控件
        paginationConfig($('#dg4member').datagrid('getPager'));
    }
);

function saveNewMember(){
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#newMemberLoginName'), 4, 20, ".登录名");
    if (!$.isEmptyObject(tip1)) {
        tips[count++] = count + tip1;
    }
    var tip2 = checkRealName($('#newMemberRealName'), 2, 20, ".真实姓名");
    if (!$.isEmptyObject(tip2)) {
        tips[count++] = count + tip2;
    }
    var tip3 = checkPhone($('#newMemberPhone'));
    if (!$.isEmptyObject(tip3)) {
        tips[count++] = count + tip3;
    }
    var tip4 = checkEmail($('#newMemberEmail'));
    if (!$.isEmptyObject(tip4)) {
        tips[count++] = count + tip4;
    }

    if (tips.length != 0) {
        showTips(tips, $('#dlg4_new_member_tips'));
        return;
    }
    membersApi.save();
}

function saveMember(){
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#memberLoginName'), 4, 20, ".登录名");
    if (!$.isEmptyObject(tip1)) {
        tips[count++] = count + tip1;
    }
    var tip2 = checkRealName($('#memberRealName'), 2, 20, ".真实姓名");
    if (!$.isEmptyObject(tip2)) {
        tips[count++] = count + tip2;
    }
    var tip3 = checkPhone($('#memberPhone'));
    if (!$.isEmptyObject(tip3)) {
        tips[count++] = count + tip3;
    }
    var tip4 = checkEmail($('#memberEmail'));
    if (!$.isEmptyObject(tip4)) {
        tips[count++] = count + tip4;
    }
    if (tips.length != 0) {
        showTips(tips, $('#dlg4member_tips'));
        return;
    }
    membersApi.update();
}

function resetMemberPassword() {
    var row = $('#dg4member').datagrid('getSelected');
    if (row) {
        $.messager.confirm("操作确认", "确认要重置该会员登录密码吗？", function (r) {
            if (r) {
                saveMemberPassword();
            }
        })
    } else {
        noSelectAlert();
    }
}

function saveMemberPassword() {

    $.ajax({
        url: "member/member_password_reset",
        data:{'id':row['id']},
        type: "post",
        success: function () {
            showMessage("重置成功");
            // $('#dlg4member_password').dialog('close');
        },
        error: function (data) {
            errorHandler2(data);
        }
    });
}

function queryMembers(){
    membersApi.setQueryParams();
}

function resetQueryMembers() {
    membersApi.unsetQueryParams();
}