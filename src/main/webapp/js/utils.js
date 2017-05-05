var MESSAGE_USER_LOGGING= '<div class="alert alert-info info-loading ">登录中</div>';
var MESSAGE_LOADING = '<div class="panel-loading alert alert-info">加载中</div>'

function noSelectAlert() {
    showMessage('你需要在表格中选中一行数据!');
}

function showMessage(message) {
    $.messager.alert('提示信息', message);
}

function form2Json(fm, except) {
    var param = {};
    if(!$.isArray(except)) except = [];
    $.each(fm.serializeArray(), function (i, field) {
        if(!$.inArray(field.name, except)) return;
        param[field.name] = field.value;
    });
    // 特殊处理 checkbox
    var chks = $(fm).find('input[type=checkbox]');
    $.each(chks, function(i, checkbox){
        var name = $(checkbox).attr('name');
        if(param[name]){
            param[name] = true;
        }else{
            param[name] = false;
        }
    });

    return param;
}

function showError(target, text) {
    target.html('<div class="alert alert-danger" role="alert">' + text + '</div>');
}

function paginationConfig(p) {
    p.pagination({
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '第 {from} - {to} 条, 共 {total} 条记录   ',
        layout : ['list','sep','manual','first','prev','links','next','last','refresh']
    });
}

function accessDenied() {
    showMessage("权限不足，加载失败！");
}

// function accessForbidden() {
//     // url 跳转 to do
// }

function errorHandler(data, target) {
    try {
        var error = JSON.parse(data.responseText);
        showError(target, error["errorMessage"]);
    } catch(e) {
        if (data.status == 403) {
            accessDenied();
        }
        else {
            showMessage(data);
        }
    }
}

function errorHandler2(data) {
    try {
        var error = JSON.parse(data.responseText);
        showMessage(error["errorMessage"]);
    } catch(e) {
        if (data.status == 403) {
            accessDenied();
        } else {
            showMessage(data)
        }
    }
}

// function splitDateWithDash(datenum){
//     console.log(datenum);
//     if(datenum && datenum.length == 8){
//         return [datenum.substr(0,4), datenum.substr(4, 2), datenum.substr(6, 2)].join('-');
//     }
//     return '';
// }

function getToolbar(all, urls) {
    var toolbar = [];

    for (var i = 0; i< urls.length; i++) {
        // 根据权限加载资源
        if(authorities.indexOf(urls[i]) != -1 || loginUser == "sysadmin") {
            if (toolbar.length != 0) {
                toolbar.push('-')
            }
            toolbar.push(all[i]);
        }
    }

    if (toolbar.length == 0) {
        toolbar = null;
    }

    return toolbar;
}

/**
 * 输入名称的校验
 */
function checkName(target, min, max, msg) {
    var name = target.val().trim();
    if ($.isEmptyObject(name)) {
        return msg + '不能为空';
    }
    var reg = /^([0-9a-zA-Z]|[\u4E00-\u9FA5])*$/;
    if (!name.match(reg)) {
        return msg + "只能输入中英文或数字";
    }
    // var newName = name.replace(/[\u4E00-\u9FA5]/g,"aa");
    if (name.length < min || name.length > max) {
        return msg + "不能少于"+min+"位，或大于"+max+"位";
    }
    return "";
}

function checkRealName(target, min, max, msg) {
    var realName = target.val().trim();
    if ($.isEmptyObject(realName)) {
        return msg + '不能为空';
    }
    var reg = /^([a-zA-Z]|[\u4E00-\u9FA5])*$/;
    if (!realName.match(reg)) {
        return msg + "只能输入中英文";
    }
    if (realName.length < min || realName.length > max) {
        return msg + "不能少于"+min+"位，或大于"+max+"位";
    }
    return "";
}

function checkPhone(target) {
    var phone = target.val().trim();
    if ($.isEmptyObject(phone)) {
        return ".手机号码不能为空";
    }
    var reg = /^\d{11}$/;
    if (!phone.match(reg)) {
        return ".手机号码不正确";
    }
    return "";
}

function checkEmail (target) {
    var email = target.val().trim();
    if ($.isEmptyObject(email)) {
        return '.邮箱不能为空';
    }
    var reg = /^.+@.+\..+$/;
    if (!email.match(reg)) {
        return '.邮箱不正确'
    }
    return "";
}

function checkPassword (target1) {
    var password1 = target1.val().trim();

    if ($.isEmptyObject(password1)) {
        return ".密码不能为空"
    }

    var reg = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}');
    var spa = /^\S+$/gi;

    if (!reg.test(password1) || !spa.test(password1)) {
        return ".密码不含空格，长度8-20位,且包含数字、字母、特殊字符";
    }
    return "";
}

function checkPasswordConfirm(target1,target2) {
    var password1 = target1.val().trim();
    var password2 = target2.val().trim();

    if (password1 != password2) {
        return '.两次密码不一致';
    }
    return '';
}

function showTips(tips, target) {
    var text = '';
    for (var i = 0;i < tips.length;i++) {
        text = text+tips[i]+"<br/>";
    }
    showError(target, text);
}