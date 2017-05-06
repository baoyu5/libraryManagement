var indexApi = new sysCommon.api('', {});

function editMyselfPassword() {
    // 表单情空
    $('#fm4_myself_password').form('clear');
    // 提示信息清空
    $('#dlg4_myself_password_tips').html('');

    $('#dlg4_myself_password').dialog('open').dialog('center').dialog('setTitle', '修改登录密码');
}

function saveMyselfPassword() {
    var tips = checkParams();

    if (tips) {
        showError($('#dlg4_myself_password_tips'), tips);
        return;
    } else {
        var oldPassword = $('#oldPassword').val().trim();
        var newPassword = $('#newPassword').val().trim();
        var data = {'oldPassword': oldPassword, 'newPassword': newPassword};

        $.ajax({
            url: "user/self_password_update",
            type: "post",
            data: data,
            success: function (data) {
                showMessage('修改成功！');
                $('#dlg4_myself_password').dialog('close');
                return;
            },
            error: function (data) {
                errorHandler(data, $("#dlg4_myself_password_tips"));
            }
        });
    }

}
function checkParams() {
    var oldPassword = $("#oldPassword").val();
    var tips;
    var count = 1;

    if ($.isEmptyObject(oldPassword)) {
        tips += ((count++) + '.原密码不能为空<br/>');
    }

    var tips1 = checkPassword($('#newPassword'));
    if (!$.isEmptyObject(tips1)) {
        tips += ((count++) + tips1 + '<br/>');
    }

    var tips2 = checkPasswordConfirm($('#newPassword'), $('#newPasswordConfirm'))
    if (!$.isEmptyObject(tips1)) {
        tips += ((count++) + tips2 + '<br/>');
    }
    return tips;
}

$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
    if (jqXHR.status == 401) {
        $.messager.alert('超时登录', '登录超时，请重新登录!', 'info', function () {
            location.replace("/login.html")
        });
        return;
    }
});

$.ajaxSetup({
    url: "/api/*",
    global: true,
});
