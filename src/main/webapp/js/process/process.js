/**
 * User: Roland
 */
var processTime;
$(document).ready(
    function () {
            $('#dg4process').datagrid({
            title: '流程列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/processes?status=' + '2',
            loadFilter: sysCommon.loadFilter,
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            toolbar: [{
                text: '审批',
                handler: function () {
                    if ($('#processDiv .datagrid-body .noRst').length) {  //排除无记录
                        noSelectAlert();
                    }else{
                        showProcessDetail($('#dg4process').datagrid('getSelected'));
                    }
                }
            }],
            onDblClickRow: function (index, row) {
            },
            onLoadSuccess: function (data) {
                $('#dg4process').datagrid('selectRow');//默认不选中数据
                noRecord($(this),data,'processInstanceId',7);
            }
        });

        //设置分页控件
        paginationConfig($('#dg4process').datagrid('getPager'));
        $.ajax({
            url: 'api/query_new_process_request',
            type: 'post',
            success: function (date) {
                processTime = date.data;
            }
        });
        $('textarea').focus(function(){
            $('.alert-danger').hide();
        })
    });

var url;

function showProcessDetail(row) {
    if (row) {
        if (row['processName'] == '账户冻结流程' || row['processName'] == '账户解冻流程') {
            var viewId = 'dlg4process';
            if (row['processName'] == '账户冻结流程') {
                viewTitle = '账户冻结';
            }
            else {
                viewTitle = '账户解冻';
            }
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
                hidePreView('fm4process');//没有一级审批人时隐藏行
            });
            showPreView('fm4process');//结束后恢复隐藏行
        }
        if (row['processName'] == '实名认证流程') {
            var viewId = 'dlg4_process_detail', viewTitle = '实名认证';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
                hidePreView('fm4_process_detail');//没有一级审批人时隐藏行
            });
           showPreView('fm4_process_detail');//结束后恢复隐藏行
        }
        if (row['processName'] == '出金审批流程') {
            var viewId = 'dlg4process-withdrawal', viewTitle = '出金审批';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
                hidePreView('fm4process-withdrawal');//没有一级审批人时隐藏行
            });
            showPreView('fm4process-withdrawal');//结束后恢复隐藏行
        }
        if (row['processName'] == '线下入金流程') {
            var viewId = 'dlg4process-offline-deposit', viewTitle = '线下入金';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
                hidePreView('fm4process-offline-deposit');//没有一级审批人时隐藏行
            });
            showPreView('fm4process-offline-deposit');//结束后恢复隐藏行
        }
        if (row['processName'] == '风险事件流程'){
            var viewId = 'dlg4process_risk_event', viewTitle = '风险事件';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
                hidePreView('fm4process_risk_event');//没有一级审批人时隐藏行
            });
            showPreView('fm4process_risk_event');//结束后恢复隐藏行
        }
        if (row['processName'] == '黑名单录入流程' || row['processName'] == '黑名单移除流程') {
            var viewId = 'dlg4process-black-list',viewTitle = '';
            if (row['processName'] == '黑名单录入流程') {
                viewTitle = '黑名单录入';
            } else {
                viewTitle = '黑名单移除';
            }
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
                hidePreView('fm4process-black-list');//没有一级审批人时隐藏行
            });
            showPreView('fm4process-black-list');//结束后恢复隐藏行
        }
        if (row['processName'] == "实时出金审批流程" ){
            var viewId = 'dlg4process-real-time-withdrawal', viewTitle = '实时出金审批';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
                hidePreView('fm4process-real-time-withdrawal');//没有一级审批人时隐藏行
            });
            showPreView('fm4process-real-time-withdrawal');//结束后恢复隐藏行
        }
    }
    else {
        noSelectAlert();
    }

}

function loadProcessDetail(row) {
    var data = {};
    var promise;
    if (row['processName'] == '账户冻结流程') {
        promise = $.ajax({
            url: 'api/process_account_frozen_request_detail?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceId").val(data["processInstanceId"]);

                if (data["userStatus"] == "0") {
                    data["userStatus"] = "正常";
                } else {
                    data["userStatus"] = "已冻结";
                }
                data.__raw = row;
                return data;
            })
        };

    } else if (row['processName'] == '账户解冻流程') {
        promise = $.ajax({
            url: 'api/process_account_unfrozen_request_detail?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceId").val(data["processInstanceId"]);

                if (data["userStatus"] == "0") {
                    $("#userStatus").val("正常");
                } else {
                    $("#userStatus").val("已冻结");
                }
                data.__raw = row;
                return data;
            })
        };
    }

    if (row['processName'] == '黑名单录入流程' || row['processName'] == '黑名单移除流程') {
        var url = '';
        if (row['processName'] == '黑名单录入流程') {
            url = 'api/process_black_list_add_request_detail';
        } else {
            url = 'api/process_black_list_remove_request_detail';
        }
        promise = $.ajax({
            url: url + '?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_black_list_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceIdBlackList").val(data["processInstanceId"]);
                data.__raw = row;
                return data;
            })
        };
    }

    if (row['processName'] == '实名认证流程') {
        promise = $.ajax({
            url: 'api/process_real_name_authentication_request_detail?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceRealIdNameAuth").val(row['processInstanceId']);
                var tPic = document.getElementById("tPic");
                var oPic1 = document.getElementById("oPic1");
                var oPic2 = document.getElementById("oPic2");
                var oPic3 = document.getElementById("oPic3");
                var yyzz = document.getElementById("yyzz");
                if (data["allInOne"] == false) {
                    tPic.style.display = "";
                    oPic1.style.display = "";
                    oPic2.style.display = "";
                    oPic3.style.display = "none";
                    yyzz.innerText = "营业执照：";
                } else {
                    tPic.style.display = "none";
                    oPic1.style.display = "none";
                    oPic2.style.display = "none";
                    oPic3.style.display = "";
                    yyzz.innerText = "三证合一：";
                }
                data.__raw = row;
                $("#bankAccountNo").val(data["bankAccountNo"]);
                $("#bankAccountName").val(data["bankAccountName"]);
                return data;
            })
        };
    }

    if (row['processName'] == '出金审批流程') {
        promise = $.ajax({
            url: 'api/process_withdrawal_request_detail?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceIdWithdrawal").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }

    if (row['processName'] == '实时出金审批流程') {
        promise = $.ajax({
            url: 'api/process_real_time_withdrawal_request_detail?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceIdRealTimeWithdrawal").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }

    if (row['processName'] == '线下入金流程') {
        promise = $.ajax({
            url: 'api/process_offline_deposit_request_detail?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceIdOfflineDeposit").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }

    if(row['processName'] == '风险事件流程'){
        promise = $.ajax({
            url: 'api/process_risk_event_request_detail?processInstanceId=' + row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }
        });
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceIdRiskEvent").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }
}

function saveBlackList() {
    var row = $('#dg4process').datagrid('getSelected');
    var memo = $("#blackListMemo").val();

    if (memo == null || memo.trim() == '') {
        showError($("#dlg4_black_list_tips"), "审批人意见不能为空。");
        $('#dlg4process-black-list').scrollTop(0);
        return;
    }

    if (row['processName'] == '黑名单录入流程') {
        $.ajax({
            url: 'api/process_black_list_add_request_check',
            data: JSON.stringify(form2Json($("#fm4process-black-list"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                document.getElementById("blackListMemo").value="";
                //document.getElementById("dlg4_black_list_tips").style.visibility="hidden";//隐藏
                // 提交完清空操作
                //$('#fm4process-black-list').form('clear');
                $('#dlg4process-black-list').dialog('close');
                $('#dg4process').datagrid('reload');
            }
        });
    } else if (row['processName'] == "黑名单移除流程") {
        $.ajax({
            url: 'api/process_black_list_remove_request_check',
            data: JSON.stringify(form2Json($("#fm4process-black-list"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                document.getElementById("blackListMemo").value="";
                //document.getElementById("dlg4_black_list_tips").style.visibility="hidden";//隐藏
                // 提交完清空操作
                //$('#fm4process-black-list').form('clear');
                $('#dlg4process-black-list').dialog('close');
                $('#dg4process').datagrid('reload');
            }
        });
    }
}

function save() {
    var row = $('#dg4process').datagrid('getSelected');
    var memo = $("#frozenOrUnfrozen").val();

    if (memo == null || memo.trim() == '') {
        showError($("#dlg4_frozenOrUnfrozen_tips"), "审批人意见不能为空。");
        $('#dlg4process').scrollTop(0);
        return;
    }

    if (row['processName'] == '账户冻结流程') {
        $.ajax({
            url: 'api/process_account_frozen_request_check',
            data: JSON.stringify(form2Json($("#fm4process"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                document.getElementById("frozenOrUnfrozen").value="";
                //document.getElementById("dlg4_frozenOrUnfrozen_tips").style.visibility="hidden";//隐藏
                // 提交完清空操作
                //$('#fm4process').form('clear');
                $('#dlg4process').dialog('close');
                $('.firstExamination').show(1000);//关闭后显示一级审批人
                $('#dg4process').datagrid('reload');
            }
        });
    }
    if (row['processName'] == "账户解冻流程") {
        $.ajax({
            url: 'api/process_account_unfrozen_request_check',
            data: JSON.stringify(form2Json($("#fm4process"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                document.getElementById("frozenOrUnfrozen").value="";
                //document.getElementById("dlg4_frozenOrUnfrozen_tips").style.visibility="hidden";//隐藏
                // 提交完清空操作
                //$('#fm4process').form('clear');
                $('#dlg4process').dialog('close');
                $('#dg4process').datagrid('reload');
            }
        });
    }
}
function saveRiskEvent() {
    var row = $('#dg4process').datagrid('getSelected');
    var memo = $("#riskEvent").val();

    if (memo == null || memo.trim() == '') {
        showError($("#dlg4_riskEvent_tips"), "审批人意见不能为空。");
        return;
    }

    if (row['processName'] == '风险事件流程') {
        $.ajax({
            url: 'api/process_risk_event_request_check',
            data: JSON.stringify(form2Json($("#fm4process_risk_event"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                document.getElementById("riskEvent").value="";
                //document.getElementById("dlg4_riskEvent_tips").style.visibility="hidden";//隐藏
                // 提交完清空操作
                //$('#dlg4process_risk_event').form('clear');
                // 关闭dialog
                $('#dlg4process_risk_event').dialog('close');
                $('#dg4process').datagrid('reload');
            }
        });
    }
}

function closeRiskEvent() {
    document.getElementById("riskEvent").value="";
    //document.getElementById("dlg4_riskEvent_tips").style.visibility="hidden";//隐藏
    $('#dlg4process_risk_event').dialog('close');
}
function closeFrozen() {
    document.getElementById("frozenOrUnfrozen").value="";
    //document.getElementById("dlg4_frozenOrUnfrozen_tips").style.visibility="hidden";//隐藏
    $('#dlg4process').dialog('close');
}
function saveAuth() {

    var row = $('#dg4process').datagrid('getSelected');
    var memo = $("#realNameAuth").val();

    if (memo == null || memo.trim() == '') {
        showError($("#dlg4_realNameAuth_tips"), "审批人意见不能为空。");
        $('#dlg4_process_detail').scrollTop(0);
        return;
    }

    if (row['processName'] == "实名认证流程") {
        $.ajax({
            url: 'api/process_real_name_authentication_request_check',
            data: JSON.stringify(form2Json($("#fm4_process_detail"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                $('#dlg4_process_detail').dialog('close');
                $('#dg4process').datagrid('reload');
            },
            error: function (result) {
                document.getElementById("realNameAuth").value="";
                //document.getElementById("dlg4_realNameAuth_tips").style.visibility="hidden";//隐藏
                var error = JSON.parse(result.responseText);
                showError($('#dlg4_process_confirm_tips'), error["errorMessage"]);
            }
        });
    }
}

function closeAuth() {
    document.getElementById("realNameAuth").value="";
    //document.getElementById("dlg4_realNameAuth_tips").style.visibility="hidden";//隐藏
    $('#dlg4_process_detail').dialog('close');
}

function saveWithdrawal() {
    var row = $('#dg4process').datagrid('getSelected');
    var memo = $("#memoIdWithdrawal").val();

    if (memo == null || memo.trim() == '') {
        showError($("#dlg4_withdrawal_tips"), "审批人意见不能为空。");
        $('#dlg4process-withdrawal').scrollTop(0);
        return;
    }

    if (row['processName'] == "出金审批流程") {
        $.ajax({
            url: 'api/process_withdrawal_request_check',
            data: JSON.stringify(form2Json($("#fm4process-withdrawal"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                document.getElementById("memoIdWithdrawal").value="";
                //document.getElementById("dlg4_withdrawal_tips").style.visibility="hidden";//隐藏
                $('#dlg4process-withdrawal').dialog('close');
                $('#dg4process').datagrid('reload');
            }
        });
    }
}

function closeWithdrawal() {
    document.getElementById("memoIdWithdrawal").value="";
    //document.getElementById("dlg4_withdrawal_tips").style.visibility="hidden";//隐藏
    $('#dlg4process-withdrawal').dialog('close');
}

//实时出金审批----------------------------------------------------------------------------------
function saveRealTimeWithdrawal() {
    var row = $('#dg4process').datagrid('getSelected');
    var memoRT = $("#memoIdRealTimeWithdrawal").val();

    if (memoRT == null || memoRT.trim() == '') {
        showError($("#dlg4_real_time_withdrawal_tips"), "审批人意见不能为空。");
        $('#dlg4process-real-time-withdrawal').scrollTop(0);
        return;
    }

    if (row['processName'] == "实时出金审批流程") {
        $.ajax({
            url: 'api/process_real_time_withdrawal_request_check',
            data: JSON.stringify(form2Json($("#fm4process-real-time-withdrawal"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                document.getElementById("memoIdRealTimeWithdrawal").value="";
                //document.getElementById("dlg4_withdrawal_tips").style.visibility="hidden";//隐藏
                $('#dlg4process-real-time-withdrawal').dialog('close');
                $('#dg4process').datagrid('reload');
            },
            error: function (result) {
                document.getElementById("memoIdRealTimeWithdrawal").value="";
                //document.getElementById("dlg4_realNameAuth_tips").style.visibility="hidden";//隐藏
                var error = JSON.parse(result.responseText);
                showError($('#dlg4_real_time_withdrawal_tips'), error["errorMessage"]);
            }
        });
    }
}

function closeRealTimeWithdrawal() {
    document.getElementById("memoIdRealTimeWithdrawal").value="";
    //document.getElementById("dlg4_withdrawal_tips").style.visibility="hidden";//隐藏
    $('#dlg4process-real-time-withdrawal').dialog('close');
}
//---------------------------------------------------------------------------------------------

function saveOfflineDeposit() {

    var row = $('#dg4process').datagrid('getSelected');
    var memo = $("#memoIdOfflineDeposit").val();
    //document.getElementById("dlg4_withdrawal_tips").style.visibility="hidden";//隐藏
    if (memo == null || memo.trim() == '') {
        document.getElementById("dlg4_offline_deposit_tips").style.visibility="visible";
        showError($("#dlg4_offline_deposit_tips"), "审批人意见不能为空。");
        $('#dlg4process-offline-deposit').scrollTop(0);
        return;
    }

    if (row['processName'] == "线下入金流程") {
        $.ajax({
            url: 'api/process_offline_deposit_request_check',
            data: JSON.stringify(form2Json($("#fm4process-offline-deposit"))),
            contentType: 'application/json',
            type: 'post',
            success: function () {
                $('#dg4transactions').datagrid('selectRow');//默认不选中数据
                document.getElementById("memoIdOfflineDeposit").value="";
                //document.getElementById("dlg4_offline_deposit_tips").style.visibility="hidden";//隐藏
                $('#dlg4process-offline-deposit').dialog('close');
                $('#dg4process').datagrid('reload');
            }
        });
    }
}

function closeOfflineDeposit() {
    document.getElementById("memoIdOfflineDeposit").value="";
    //document.getElementById("dlg4_offline_deposit_tips").style.visibility="hidden";//隐藏
    $('#dlg4process-offline-deposit').dialog('close');
}
var sh = setInterval("refer()", 10000); //启动1秒定时
function refer() {
    $.ajax({
        url: 'api/query_new_process_request',
        type: 'post',
        success: function (date) {
            if(parseInt(processTime) < parseInt(date.data)) {
                $.messager.show({
                    title: '流程提醒',
                    msg: '有新的流程进入审核，请刷新界面',
                    timeout: 5000,
                    showType: 'slide'
                });
            }
            processTime = date.data;
        }
    });
}

// 隐藏一级审批人方法
function hidePreView(formid) {
    var txt = $('#' + formid + ' .firstExamination td:eq(1) b').text();
    console.log(txt);
    if (txt == " " || txt == null) {
        $('#' + formid + ' .firstExamination').hide();
    }
}

//显示一级审批人方法
function showPreView(formid) {
    $('#' + formid + ' .firstExamination').show();
}

//关闭标签时，调用方法
$('#tt').tabs({
    onBeforeClose: function(title,index){
        clearInterval(sh);  //清除定时器
    }
});

