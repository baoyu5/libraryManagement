/**
 * User: Roland
 */
var memberApi = new sysCommon.api('members', {
    'loadUri': 'api/accounts',
    'createUri': 'api/account_add',
    'deleteUri': 'api/account_delete',
    'recordIdName': 'userId'
});

$(document).ready(
    function () {
        var toolbarAll = [{
            text: '新建会员',
            //iconCls: 'icon-add',
            handler: function () {
                memberApi.create('新建会员');
            }
        }, {
            text: '修改会员资料',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    var row = $('#dg4members').datagrid('getSelected');
                    if (row['authenticationStatus'] == "未认证"){
                        return showMessage("账户未认证，不能修改资料！");
                    }
                    editMember();
                }
            }
        }, {
            text: '修改登录密码',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    memberApi.editAny('member_password', '修改登陆密码');
                }
            }
        }, {
            text: '修改支付密码',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    memberApi.editAny('member_pay_password', '修改支付密码');
                }
            }
        },{
            text: '修改验证手机',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    memberApi.editAny('member_phone_no', '修改验证手机');
                }
            }
        }, {
            text: '子账户查看',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    var row = memberApi.getSelectedRow();
                    if (row) {
                        console.log(row);
                        showMemberChildAccounts(row.userId);
                    }
                }
            }
        }, {
            text: '冻结申请',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    accountFrozen();
                }
            }
        },
            {
            text: '解冻申请',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    accountUnFrozen();
                }
            }
        }, {
            text: '删除会员',
            //iconCls: 'icon-remove',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    memberApi.delete('确定要删除该会员帐户吗?');
                }
            }
        }, {
            text: '开通市场会员',
            //iconCls: 'icon-remove',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    openMarketMember();
                }
            }
        }, {
            text: '风险等级设置',
            //iconCls: 'icon-remove',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    setRiskLevel();
                }
            }
        }];

        var urls = ['/api/account_add', '/api/account_company_edit', '/api/account_login_password_upload',
            '/api/account_payment_password_upload','/api/account_phone_no_edit', '/api/account_sub_accounts', '/api/account_frozen_request',
            '/api/account_unfrozen_request','/api/account_delete','/api/init_account_in_market','/api/set_risk_level'
        ];

        var toolbar = getToolbar(toolbarAll, urls);
        if (toolbar == null) {
            toolbar = [];
        } else {
            toolbar.push('-')
        }

        toolbar.push({
            text: '会员详情',
            //iconCls: 'icon-add',
            handler: function () {
                if ($('#membersDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    memberDetail();
                }
            }

        });

        $('#qMarketName').combobox({
            url: 'api/markets_name',
            valueField: 'id',
            textField: 'name',
            panelHeight: 110,
            loadFilter: function (data) {
                if (data.status === 0) {
                    return data.data;
                }
                return [];
            }
        });

        $('#dg4members').datagrid({
            title: '会员列表',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: memberApi.loadUri,
            loadFilter: function(data) {
                if (data && (data.status === 0)) {
                    $("#processInstanceId").val(data["processInstanceId"]);
                    data = authenticationStatusLoadFilter(data);
                    return data.data;
                } else {
                    return [];
                }
            },
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
            toolbar: toolbar,
            onDblClickRow: function (index, row) {
                memberDetail(index, row);
            },
            onLoadSuccess: function (data) {
                $('#dg4members').datagrid('selectRow',0);//默认不选中
                memberApi.onReloadSuccess();
                noRecord($(this),data,'loginName',8);
            },
            onLoadError: function (data) {
                errorHandler2(data);
            }
        });

        //设置分页控件
        paginationConfig($('#dg4members').datagrid('getPager'));

        $('#all-in-one-checkbox').click(function () {
            // 三证合一逻辑
            if ($(this).prop('checked')) {
                // 隐藏组织机构证 & 税务登记证
                $('#dlg4_member_detail_edit .all-in-one').hide();
            } else {
                // 显示组织机构证 & 税务登记证
                $('#dlg4_member_detail_edit .all-in-one').show();
            }
        });

        var banks = sysCommon.data.banks.get();
        var opts = '';
        $.each(banks, function(idx, bank) {
            opts += '<option value="' + bank.id + '">' + bank.name + '</option>';
        });

        $.each($('.banks-select'), function (idx, sel) {
            $(sel).html(opts);
        });
    }
);

/**
 * 会员认证状态显示优化
 * @param data
 */
function authenticationStatusLoadFilter(data) {
    for (var i = 0;i<data.data.rows.length;i++) {
        if (data.data.rows[i].authenticationStatus == 0) {
            data.data.rows[i].authenticationStatus = "未认证";
        }
        if (data.data.rows[i].authenticationStatus == 1) {
            data.data.rows[i].authenticationStatus = "审核中";
        }
        if (data.data.rows[i].authenticationStatus == 2) {
            data.data.rows[i].authenticationStatus = "已认证";
        }
        if (data.data.rows[i].authenticationStatus == 3) {
            data.data.rows[i].authenticationStatus = "已拒绝";
        }
        if (data.data.rows[i].accountStatus == 0) {
            data.data.rows[i].accountStatus = "正常";
        }
        if (data.data.rows[i].accountStatus == 1) {
            data.data.rows[i].accountStatus = "已冻结";
        }
    }
    return data;
}

var url;
function newMember() {
    $("#dlg4_new_member_tips").html('');
    $('#dlg4_new_member').dialog('open').dialog('center').dialog('setTitle', '新建会员');

    $('#fm4_new_member').form('clear');
    url = 'save_user.php';
}

var getChangeCallback = function (uri, id) {
    return function (newPic) {
        if (newPic) {
            saveAndShowPic.apply(this, [
                uri + '?' + memberApi.recordIdName + '=' + id
            ]);
        }
    }
};

function editMember() {
    var row = memberApi.editAny('member_detail_edit', '修改会员资料');
    $.each({
        'members-businessLicensePic': 'api/account_business_License_upload',
        'members-organizationCertificatePic': 'api/account_organization_certificate_upload',
        'members-taxRegistrationCertificatePic': 'api/account_tax_registration_certificate_upload',
        'members-legalRepresentativeIdPic': 'api/account_legal_representative_id_upload',
        'members-legalRepresentativeIdPic2': 'api/account_legal_representative_id_2_upload'
    }, function (id, url) {
        $('#' + id).filebox({
            'accept': 'image/*',
            'onChange': getChangeCallback(url, row['userId'])
        });
    });
    // 三证合一逻辑
    if (row.allInOne) {
        // 隐藏组织机构证 & 税务登记证
        $('#dlg4_member_detail_edit .all-in-one').hide();
        var boxes = document.getElementById('all-in-one-checkbox');
         boxes.checked=true;
    } else {
        // 显示组织机构证 & 税务登记证
        $('#dlg4_member_detail_edit .all-in-one').show();
    }
    sysCommon.loadRowToView(row, 'dlg4_member_detail_edit');
}

saveMemberDetail.fields = {
    "userId": true,
    "companyName": true,
    "address": true,
    "email":true,
    "businessScope": true,
    "businessLicenseCode": true,
    "legalRepresentative": true,
    "legalRepresentativeId": true,
    "legalRepresentativeIdExpiredAt": true,
    "contact": true,
    "contactPhoneNo": true,
    "allInOne": true,
    "bankId": true,
    "bankAccountName": true,
    "bankAccountNo": true
};
function saveMemberDetail() {
    memberApi.updateAny('member_detail_edit', 'api/account_company_edit', saveMemberDetail.fields);
}

// used by filebox which is with a corresponding image
function saveAndShowPic(url) {
    var $elem = $(this);
    var idStr = $elem.attr('id');
    var idParts = idStr.split('-');
    idParts.shift();
    // common key, we will use it to find related hidden input and img
    var key = idParts.join('-');

    // prepare ajax data
    var fileobj = $elem.next().find('.textbox-value').get(0);// @ref: http://www.jeasyui.com/forum/index.php?topic=5075.0
    if (fileobj && fileobj.files.length > 0) {
        var fd = new FormData();
        fd.append('file', fileobj.files[0]);
        $.ajax({
            url: url,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            success: function (response) {
                // console.log('yes! file did uploaded', arguments);
                // @to do: replace corresponding img's src & hidden's value
                if (response && response.data) {
                    var picUrl = sysConfig.picBaseUrl + response.data;
                    // set hidden input value
                    $('input[type=hidden][name=' + key + ']').val(response.data);
                    // set corresponding image's src
                    $('img[data-holder=' + key + ']').attr('src', picUrl);
                }
            },
            error: function (jqXHR, textStatus, errorMessage) {
                showMessage('图片上传失败!');
            }
        });
    }
}

function saveNewMember() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#loginName'),6,20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.登录名'+tip1;
        count++;
    }
    var tip2 = checkPassword($('#password'),$('#passwordConfirm'));
    if (!$.isEmptyObject(tip2)) {
        tips[count] = (count+1)+'.登录密码'+tip2;
        count++;
    }
    var tip3 = checkPassword($('#paymentPassword'),$('#paymentPasswordConfirm'));
    if (!$.isEmptyObject(tip3)) {
        tips[count] = (count+1)+'.支付密码'+tip3;
        count++;
    }
    var tip4 = checkPhone($('#phoneNo'));
    if (!$.isEmptyObject(tip4)) {
        tips[count] = (count+1)+'.手机号'+tip4;
        count++;
    }
    var tip5 = checkEmail($('#email'));
    if (!$.isEmptyObject(tip5)) {
        tips[count] = (count+1)+'.邮箱'+tip5;
        count++;
    }
    var safetyMessage = $('#safetyMessage').val().trim();
    if ($.isEmptyObject(safetyMessage)) {
        tips[count] = (count+1)+'.预留防伪信息不能为空';
        count++;
    }
    if (safetyMessage.length > 10) {
        tips[count] = (count+1)+'.预留防伪信息长度不能大于10。';
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_new_members_tips'),text);
        return;
    }
    memberApi.save();
}

function memberDetail(index, row) {
    // dlg4_member_detail
    var row = $('#dg4members').datagrid('getSelected');
    if (row) {
        console.log(row);
        var yyzz=document.getElementById("yyzz");
        if (row.allInOne) {
            $('#dlg4_member_detail .all-in-one').hide();
            $('#tianchong').show();
            yyzz.innerText="三证合一：";
        } else {
            $('#dlg4_member_detail .all-in-one').show();
            $('#tianchong').hide();
            yyzz.innerText="营业执照：";
        }
        // change bankId into bankName
        var bankName = '-';
        $.each(sysCommon.data.banks.get(), function(idx, bank){
            if(bank.id === row.bankId) {
                bankName = bank.name;
                return false;
            }
        });
        var rowCopy = $.extend({}, row, {'bankId':bankName});
        sysCommon.loadRowToView(rowCopy, 'dlg4_member_detail');
        $('#dlg4_member_detail').dialog('open').dialog('center').dialog('setTitle', '会员详情');
        $('#fm4_member_detail').form('load', row);
        //url = 'update_user.php?id='+row.id;
    }
    else {
        noSelectAlert();
    }
}

function saveMemberPassword() {
    var tips = [];
    var count = 0;
    var tip1 = checkPassword($('#password1'),$('#passwordConfirm1'));
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.登录密码'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_member_password_tips'),text);
        return;
    }
    memberApi.updateAny('member_password', 'api/account_login_password_upload', function (data) {
        var needed = {'userId': 1, 'password': 1, 'passwordConfirm': 1};
        var params = {};
        $.each(data, function (k, v) {
            if (needed[k]) {
                params[k] = v;
            }
        });
        return JSON.stringify(params);
    });
}

function saveMemberPayPassword() {
    var tips = [];
    var count = 0;
    var tip1 = checkPassword($('#paymentPassword1'),$('#paymentPasswordConfirm1'));
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.支付密码'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_member_pay_password_tips'),text);
        return;
    }
    memberApi.updateAny('member_pay_password', 'api/account_payment_password_upload', function (data) {
        console.log(data);
        var needed = {'userId': 1, 'password': 1, 'passwordConfirm': 1};
        var params = {};
        $.each(data, function (k, v) {
            if (needed[k]) {
                params[k] = v;
            }
        });
        return JSON.stringify(params);
    });
}

function saveAccountPhoneNo() {
    var tips = [];
    var count = 0;
    var tip1 = checkPhone($('#phoneNo1'));
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count+1)+'.手机号'+tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0;i<tips.length;i++) {
            text = text+tips[i]+"<br/>";
        }
        showError($('#dlg4_member_phone_no_tips'),text);
        return;
    }
    memberApi.updateAny('member_phone_no', 'api/account_phone_no_edit', function (data) {
        console.log(data);
        var needed = {'userId': 1, 'phoneNo': 1};
        var params = {};
        $.each(data, function (k, v) {
            if (needed[k]) {
                params[k] = v;
            }
        });
        return JSON.stringify(params);
    });
}

function accountFrozen() {
    var row = $('#dg4members').datagrid('getSelected');
    if (row) {
        if(row.authenticationStatus=='未认证'){
            showMessage('未认证无法申请冻结!');
        }else{
            $.messager.confirm('操作确认', '确定要对该账户发起冻结申请吗？', function (r) {
                if (r) {
                    $.ajax({
                        url: 'api/account_frozen_request',
                        type: "post",
                        data: JSON.stringify({
                            'userId': row['userId'],
                            'reason': 'test'
                        }),
                        contentType: "application/json",
                        success: function () {
                            $('#dg4members').datagrid('reload');
                            showMessage('操作成功!');
                        },
                        error: function (data) {
                            var error = JSON.parse(data.responseText);
                            showMessage(error["errorMessage"]);
                        }
                    });
                }
            });
        }
    }
    else {
        noSelectAlert();
    }
}
function accountUnFrozen() {
    var row = $('#dg4members').datagrid('getSelected');
    if (row) {
        $.messager.confirm('操作确认', '确定要对该账户发起解冻申请吗？', function (r) {
            if (r) {
                $.ajax({
                    url: 'api/account_unfrozen_request',
                    type: "post",
                    data: JSON.stringify({
                        'userId': row['userId'],
                        'reason': 'test'
                    }),
                    contentType: "application/json",
                    success: function () {
                        $('#dg4members').datagrid('reload');
                        showMessage('操作成功!');
                    },
                    error: function (data) {
                        var error = JSON.parse(data.responseText);
                        showMessage(error["errorMessage"]);
                    }
                });
            }
        });
    }
    else {
        noSelectAlert();
    }
}
function membersQuery() {
    //查询条件限制
    var code = $("#qAccountCode").val();
    var name = $("#qCompanyName").val();
    var reg = /^[\w\d_-]{0,}$/;
    var regName = /^[\w\d\u4e00-\u9fa5_-]{0,}$/;
    if (reg.test(code) && regName.test(name)){
        paginationConfig($('#dg4members').datagrid('getPager'));
        trimStr(["qAccountCode", "qCompanyName"]);
        memberApi.setQueryParams();
    }else{
        return showMessage('企业名称或会员编码含有非法字符！');
    }
}

/**
 * jqObjs
 * @param jqObjs 数组中的元素为 需要trim的input ID
 */
function trimStr(jqObjs) {
    $.each(jqObjs, function () {
        $("#" + this).textbox({'value': $.trim($("#" + this).val())});
    })
}

function membersReset() {
    $('#qAccountCode').textbox('clear');
    $('#qCompanyName').textbox('clear');
    $('#qAuthenticationStatus').combobox('select', -1);
    memberApi.unsetQueryParams();
    paginationConfig($('#dg4members').datagrid('getPager'));
}

function createTimeFormatter(val) {
    var formattedDate = new Date(val);
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}


showMemberChildAccounts.options = {
    title: '子账户列表',
    collapsible: false,//是否可折叠的
    fit: true,//自动大小
    url: '',
    loadFilter: function (data) {
        if (data && (data.status === 0)) {
            var rawData = data.data;
            var ret = [];
            $.each(rawData, function (idx, val) {
                ret.push({
                    'productName': val.product && val.product.productName,
                    'marketName': val.market && val.market.name,
                    'balance': val.balance
                });
            });
            return ret;
        } else {
            return [];
        }
    },
    remoteSort: false,
    idField: 'ID',
    singleSelect: true,//是否单选
    pagination: false,//分页控件
    rownumbers: true,//行号
    onLoadError: function (data) {
        errorHandler2(data);
    }
};
showMemberChildAccounts.inited = false;
function showMemberChildAccounts(userId) {
    var opts = $.extend({}, showMemberChildAccounts.options, {
        url: 'api/account_sub_accounts?userId=' + userId
    });
    $('#dg4sub_accounts').datagrid(opts);
    if (!showMemberChildAccounts.inited) {
        $('#dg4sub_accounts').datagrid('getPager').pagination(sysCommon.paginationConfig);
        showMemberChildAccounts.inited = true;
    }
    $('#dlg4sub_accounts').dialog('open').dialog('center').dialog('setTitle', '子账户查看');
}

function  openMarketMember() {
    $("#dlg4account_market_tips").html('');
    $('#fm4account_market').form('clear');
    var row = $('#dg4members').datagrid('getSelected');
    if (row) {
        $('#dlg4account_market').dialog('open').dialog('center').dialog('setTitle', '开通市场会员');
        $('#fm4account_market').form('load', row);

        if($("#memberMarketCode").val() != '') {
            $("#memberMarketCode").textbox({'readonly': true});
            $("#bindMarketBtn").linkbutton('disable');
        } else {
            $("#memberMarketCode").textbox({'readonly': false});
            $("#bindMarketBtn").linkbutton('enable');
        }
    }
    else {
        noSelectAlert();
    }
}

function saveLinkedMarket() {
    var marketCode = $("#memberMarketCode").val();
    var accountCode = $("#memberAccountCode").val();
    if (marketCode == null || marketCode.trim() == '') {
        showError($("#dlg4account_market_tips"), "市场编码不能为空。");
        return;
    }
    if(/^[\u4e00-\u9fa5]+$/.test(marketCode)){
        showError($("#dlg4account_market_tips"), "市场编码只能为字母和数字。");
        return;
    }
    if (!accountCode || accountCode.trim() == '') {
        showError($("#dlg4account_market_tips"), "会员编码不能为空。");
        return;
    }
    $.ajax({
        url: "api/init_account_in_market?marketCode=" + marketCode + "&accountCode=" + accountCode,
        type: "post",
        success: function (response) {
            $('#dlg4account_market').dialog('close');
            $('#dg4members').datagrid('reload');
        },
        error: function (data) {
            errorHandler(data, $("#dlg4account_market_tips"));
        }
    });
}

function  setRiskLevel() {
    $("#dlg4risk_level_tips").html('');
    $('#fm4risk_level').form('clear');
    var row = $('#dg4members').datagrid('getSelected');
    if (row) {
        $('#dlg4risk_level').dialog('open').dialog('center').dialog('setTitle', '风险等级设置');
        $('#fm4risk_level').form('load', row);
    }
    else {
        noSelectAlert();
    }
}

function saveRiskLevel() {
    var riskLevel = $('#riskLevel').combobox('getValue').trim();
    var accountCode = $('#accountCode1').val();
    $.ajax({
        url: "api/set_risk_level?accountCode=" + accountCode + "&riskLevel=" + riskLevel,
        type: "post",
        success: function (response) {
            $('#dlg4risk_level').dialog('close');
            $('#dg4members').datagrid('reload');
        },
        error: function (data) {
            errorHandler(data, $("#dlg4risk_level_tips"));
        }
    });
}

function riskFormatter(val) {
    if(val == 1){
        return "低等风险";
    }else if(val == 2){
        return "中等风险";
    }else if(val == 3){
        return "较高风险";
    }else if(val == 4){
        return "高等风险";
    }
}