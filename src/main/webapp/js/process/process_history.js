/**
 * User: Roland
 */
$(document).ready(
    function() {
        $('#dg4process_history').datagrid({
            title: '流程列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/process',
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
                text: '详情查看',
                handler: function () {
                    showProcessHistoryDetail( $('#dg4process_history').datagrid('getSelected'));
                }
            }],
            onLoadSuccess: function (data) {
                $('#dg4process_history').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'processName',6);
            },
            onDblClickRow: function (index, row) {
            }
        });

        //设置分页控件
        paginationConfig($('#dg4process_history').datagrid('getPager'));
    }
);

var url;

function showProcessHistoryDetail(row){
    if (row){
        if(row['processName']=='账户冻结流程'||row['processName']=='账户解冻流程') {
            var viewId = 'dlg4process_frozen_history';

            if (row['processName']=='账户冻结流程') {
                viewTitle = '账户冻结';
            }
            else {
                viewTitle = '账户解冻';
            }
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessHistoryDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
        }
        if(row['processName']=='实名认证流程'){
            var viewId = 'dlg4_process_history_detail', viewTitle = '实名认证';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessHistoryDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
        }
        if(row['processName']=='出金审批流程'){
            var viewId = 'dlg4process_history_withdrawal', viewTitle = '出金审批';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessHistoryDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
        }
        if(row['processName']=='线下入金流程'){
            var viewId = 'dlg4process_history_offline_deposit', viewTitle = '线下入金';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessHistoryDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
        }
        if(row['processName']=='风险事件流程'){
            var viewId = 'dlg4process_history_risk_event', viewTitle = '风险事件';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessHistoryDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
        }
        if(row['processName']=='黑名单录入流程' || row['processName']=='黑名单移除流程'){
            var viewId = 'dlg4process-black-list-history', viewTitle = '';
            if (row['processName']=='黑名单录入流程') {
                viewTitle = '黑名单录入';
            } else if (row['processName']=='黑名单移除流程') {
                viewTitle = '黑名单移除';
            }
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessHistoryDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
        }
        if (row['processName']=='实时出金审批流程'){
            var viewId = 'dlg4process_real_time_withdrawal_history', viewTitle = '实时出金审批';
            var promise = sysCommon.loadRowToView(function () {
                return loadProcessHistoryDetail(row);
            }, viewId);
            promise.done(function () {
                $('#' + viewId).dialog('open').dialog('center').dialog('setTitle', viewTitle);
            });
        }
    }
}

function loadProcessHistoryDetail(row) {
    var data = {};
    var promise;
    if (row['processName']=='账户冻结流程'){
        promise = $.ajax({
            url: 'api/process_account_frozen_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }});
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceHistoryId").val(data["processInstanceId"]);
                //$("#processInstance").val(data["processInstanceId"]);

                if(data["userStatus"]=="0"){
                    data["userStatus"] = "正常";
                }else {
                    data["userStatus"] = "已冻结";
                }

                data.__raw = row;
                return data;
            })
        };

    }else if (row['processName']=='账户解冻流程'){
        promise = $.ajax({
            url: 'api/process_account_unfrozen_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }});
        return {
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceHistoryId").val(data["processInstanceId"]);

                if(data["userStatus"]=="0"){
                    data["userStatus"] = "正常";
                }else {
                    data["userStatus"] = "已冻结";
                }
                data.__raw = row;
                return data;
            })
        };
    }

    if(row['processName']=='实名认证流程'){
        promise　= $.ajax({
            url: 'api/process_real_name_authentication_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }});
        return{
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceAutyHistoryId").val(row['processInstanceId']);
                var tPic=document.getElementById("tPic");
                var oPic1=document.getElementById("oPic1");
                var oPic2=document.getElementById("oPic2");
                var oPic3=document.getElementById("oPic3");
                var yyzz=document.getElementById("yyzz");
                if(data["allInOne"]==false){
                    tPic.style.display="";
                    oPic1.style.display="";
                    oPic2.style.display="";
                    oPic3.style.display="none";
                    yyzz.innerText="营业执照：";
                }else {
                    tPic.style.display="none";
                    oPic1.style.display="none";
                    oPic2.style.display="none";
                    oPic3.style.display="";
                    yyzz.innerText="三证合一：";
                }
                data.__raw = row;
                return data;
            })
        };
    }

    if(row['processName']=='出金审批流程'){
        promise　= $.ajax({
            url: 'api/process_withdrawal_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }});
        return{
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#WithdrawalprocessInstanceHistoryId").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }

    if(row['processName']=='线下入金流程'){
        promise　= $.ajax({
            url: 'api/process_offline_deposit_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }});
        return{
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#OfflineDepositprocessInstanceHistoryId").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }
    if(row['processName']=='风险事件流程'){
        promise　= $.ajax({
            url: 'api/process_risk_event_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }});
        return{
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceHistoryIdRiskEvent").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }
    if(row['processName']=='黑名单录入流程'){
        promise　= $.ajax({
            url: 'api/process_black_list_add_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showMessage(error["errorMessage"]);
            }});
        return{
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceHistoryIdBlackList").val(row['processInstanceId']);
                if(data["result"] == true){
                    data["result"] = "通过";
                } else {
                    data["result"] = "不通过";
                }
                data.__raw = row;
                return data;
            })
        };
    }
    if(row['processName']=='黑名单移除流程'){
        promise　= $.ajax({
            url: 'api/process_black_list_remove_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showMessage(error["errorMessage"]);
            }});
        return{
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#processInstanceHistoryIdBlackList").val(row['processInstanceId']);
                if(data["result"] == true){
                    data["result"] = "通过";
                } else {
                    data["result"] = "不通过";
                }
                data.__raw = row;
                return data;
            })
        };
    }
    if (row['processName']=='实时出金审批流程'){
        promise　= $.ajax({
            url: 'api/process_real_time_withdrawal_history_request_detail?processInstanceId='+row['processInstanceId'],
            contentType: 'application/json',
            type: 'post',
            error: function (data) {
                var error = JSON.parse(data.responseText);
                showError($('#dlg4_' + id + '_tips'), error["errorMessage"]);
            }});
        return{
            'promise': promise.pipe(function (responseData) {
                var data = responseData.data;
                $("#RealTimeWithdrawalProcessInstanceHistoryId").val(row['processInstanceId']);
                data.__raw = row;
                return data;
            })
        };
    }
}

//查询
function queryProcessStatistics() {
    var params = {};
    var temp = $('#process_name').combobox('getValue').trim();
    if(temp){
        params.url = temp;
    }
    params.startTime = $('#process-stats-datefrom').datebox('getValue').trim();
    params.endTime = $('#process-stats-dateto').datebox('getValue').trim();
    $('#dg4process_history').datagrid({
        'url': 'api/process?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4process_history').datagrid('getPager'));
}

//重置条件
function resetProcessStatisticsQueryParams() {

    $('#process_name').combobox('select', '');
    $('#process-stats-datefrom').datebox('setValue', '');
    $('#process-stats-dateto').datebox('setValue', '');

    $('#dg4process_history').datagrid({
        'url': 'api/process',
        pageNumber: 1
    });
    paginationConfig($('#dg4process_history').datagrid('getPager'));
}
