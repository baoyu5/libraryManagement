/**
 * User: Roland
 */
/**
 * User: Roland
 */
/**
 * User: Roland
*/

$(document).ready(
    function () {
        var toolbarAll = [{
            text: '新建市场',
            //iconCls: 'icon-add',
            handler: function () {
                newMarket();
            }
        }, {
            text: '编辑市场',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    editMarket();
                }
            }
        }, {
            text: '绑定账户',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    linkToAccount();
                }
            }
        }, {
            text: '解绑账户',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    unlinkToAccount();
                }
            }
        }, {
            text: '接口分配',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    linkToApi();
                }
            }
        }, {
            text: '关联产品',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    linkToProducts();
                }
            }
        }, {
            text: '删除市场',
            //iconCls: 'icon-remove',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    deleteMarket();
                }
            }
        }, {
            text: '交易分润规则',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    editSplitRules(1);
                }
            }
        }, {
            text: '出金分润规则',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    editSplitRules(2);
                }
            }
        }, {
            text: '开通实时出金',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    dredgeRealTimeWithDraw();
                }
            }
        }, {
            text: '关闭实时出金',
            handler: function () {
                if ($('#marketsDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    closeRealTimeWithDraw();
                }
            }
        }];

        var urls = ['/api/market_add', '/api/market_edit', '/api/market_link_to_account', '/api/market_unlink_to_account',
            '/api/market_open_api_update', '/api/market_products_update', '/api/market_delete', '/api/get_market_split_rules',
            '/api/get_market_withdrawal_split_rules', 
            '/api/market_withdraw_dredge','/api/market_withdraw_close'
        ];

        $('#dg4markets').datagrid({
            title: '市场列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/markets',
            remoteSort: false,
            loadFilter: function (data) {
                if (data.status === 0) {
                    return data.data;
                } else {
                    throw 'Markets data error.';
                }
            },
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            toolbar: getToolbar(toolbarAll, urls),
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function(data){
                $('#dg4markets').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'name',5);
            }
        });

        //设置分页控件
        paginationConfig($('#dg4markets').datagrid('getPager'));
    }
);

var url;

var marketCode;
var editIndex = undefined;

// 规则目标类型
var ruleTargetType;

function editSplitRules(type) {
    editIndex = undefined;
    ruleTargetType = type;

    $("#dlg4_market_split_rules_tips").html('');

    var row = $('#dg4markets').datagrid('getSelected');
    if (row) {
        marketCode = row.marketCode;

        var title;
        var url;
        if (ruleTargetType == 1) {
            title = '交易分润规则（'+ row.name + '）';
            url = 'api/get_market_split_rules?marketCode=' + marketCode + '&ruleTargetType=' + ruleTargetType;
        } else if (ruleTargetType == 2) {
            title = '出金分润规则（'+ row.name + '）';
            url = 'api/get_market_withdrawal_split_rules?marketCode=' + marketCode + '&ruleTargetType=' + ruleTargetType;
        }

        $('#dlg4_market_split_rules').dialog('open').dialog('center').dialog('setTitle', title);

        // 初始化分润规则
        $('#dg').datagrid({
            url: url,
            method: 'get',
            loadFilter: function (data) {
                if (data.status === 0) {
                    if (data.data) {
                        for (var i = 0; i < data.data.length; i++) {
                            // 增加规则类型名（显示用）
                            if (data.data[i].ruleType == 1) {
                                data.data[i].ruleName = '百分比';
                            } else {
                                data.data[i].ruleName = '固定值';
                            }
                        }
                        return data.data;
                    }
                    return [];
                } else {
                    var error = JSON.parse(data.responseText);
                    showErrorMessage($("#dlg4_market_split_rules_tips"), error["errorMessage"]);
                }
            },
            onLoadError: function () {
                accessDenied();
            }
        });
    } else {
        noSelectAlert();
    }
}

function showErrorMessage(target, text) {
    target.html('<div class="alert alert-danger" role="alert" style="margin-bottom: 0px">' + text + '</div>');
}

function endEditing() {
    if (editIndex == undefined) {
        return true
    }
    if ($('#dg').datagrid('validateRow', editIndex)) {
        $('#dg').datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}

function onClickCell(index, field) {
    if (editIndex != index) {
        if (endEditing()) {
            $('#dg').datagrid('selectRow', index)
                .datagrid('beginEdit', index);
            var ed = $('#dg').datagrid('getEditor', {index: index, field: field});
            if (ed) {
                ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
            }
            editIndex = index;
        } else {
            setTimeout(function () {
                $('#dg').datagrid('selectRow', editIndex);
            }, 0);
        }
    }
}

function onEndEdit(index, row) {
    var ed = $(this).datagrid('getEditor', {
        index: index,
        field: 'ruleType'
    });
    row.ruleName = $(ed.target).combobox('getText');
}

function append() {
    if (endEditing()) {
        $('#dg').datagrid('appendRow', {
            marketCode: marketCode
        });
        editIndex = $('#dg').datagrid('getRows').length-1;
        $('#dg').datagrid('selectRow', editIndex)
            .datagrid('beginEdit', editIndex);
    }
}

function remove() {
    if (editIndex == undefined) {
        return
    }
    $('#dg').datagrid('cancelEdit', editIndex)
        .datagrid('deleteRow', editIndex);
    editIndex = undefined;
}

var isClick = false;
function accept() {
    // 检验是否已经点击了保存
    if (isClick == true) {
        return;
    }
    isClick = true;

    if ($('#dg').datagrid('getRows').length < 1) {
        showErrorMessage($("#dlg4_market_split_rules_tips"), '不能保存空的规则。');
        isClick = false;
        return;
    }

    if (endEditing()) {
        // 清空错误提示信息
        $("#dlg4_market_split_rules_tips").html('');

        var url;
        if (ruleTargetType == 1) {
            url = 'api/save_market_split_rules?marketCode=' + marketCode + '&ruleTargetType=' + ruleTargetType;
        } else if (ruleTargetType == 2) {
            url = 'api/save_market_withdrawal_split_rules?marketCode=' + marketCode + '&ruleTargetType=' + ruleTargetType;
        }

        // 获取输入的规则
        var marketSplitRules = [];
        for (var i = 0; i < $('#dg').datagrid('getRows').length; i++) {
            var marketSplitRule = {};

            marketSplitRule.gradientFrom = $('#dg').datagrid('getRows')[i].gradientFrom * 100;
            marketSplitRule.gradientTo = $('#dg').datagrid('getRows')[i].gradientTo * 100;

            marketSplitRule.ruleType = $('#dg').datagrid('getRows')[i].ruleType;
            marketSplitRule.platformProportion = $('#dg').datagrid('getRows')[i].platformProportion.toString().replace(".","");

            marketSplitRule.minAmount = $('#dg').datagrid('getRows')[i].minAmount * 100;
            marketSplitRule.maxAmount = $('#dg').datagrid('getRows')[i].maxAmount * 100;

            marketSplitRules[i] = marketSplitRule;
        }

        // 检验规则有效性
        var errorMassage = checkRules(marketSplitRules);
        if (errorMassage) {
            showErrorMessage($("#dlg4_market_split_rules_tips"), errorMassage);
            isClick = false;
            return;
        }

        // 保存规则
        $.ajax({
            url: url,
            data: JSON.stringify(marketSplitRules),
            contentType: "application/json",
            type: "post",
            success: function (data) {
                isClick = false;
                if (data.data == true) {
                    showMessage("保存成功。");
                    $('#dg').datagrid('reload');
                }
            },
            error: function (data) {
                isClick = false;
                if (data.status == 403) {
                    showMessage("权限不足，保存失败！");
                    return;
                }
                var error = JSON.parse(data.responseText);
                showErrorMessage($("#dlg4_market_split_rules_tips"), error["errorMessage"]);
            }
        });

        $('#dg').datagrid('acceptChanges');
    }
}

function checkRules(rules) {

    if (rules[0].gradientFrom != 0) {
        return "第一条规则的起始值必须为0。";
    }
    if (rules[rules.length - 1].gradientTo) {
        return "最后一条规则不能有结束值。";
    }

    for (var i = 0; i < rules.length; i++) {
        if (i < rules.length - 1 && rules[i].gradientTo <= 0) {
            return "第" + (i + 1) + "条规则，必须有结束值";
        }
        if (i > 0 && rules[i].gradientFrom <= 0) {
            return "第" + (i + 1) + "条规则，必须有起始值";
        }
        if (i < rules.length - 1 && rules[i + 1].gradientFrom != rules[i].gradientTo) {
            return "第" + (i + 1) + "条规则结束值和第" + (i + 2) + "条规则起始值冲突。";
        }
        if (i < rules.length - 1 && rules[i].gradientFrom >= rules[i].gradientTo) {
            return "第" + (i + 1) + "条规则结束值和起始值冲突。";
        }
        if (rules[i].gradientFrom < 0 || rules[i].gradientTo < 0 || rules[i].platformProportion < 0
            || rules[i].minAmount < 0 || rules[i].maxAmount < 0) {
            return "各项数值都必须大于0。";
        }
        if (rules[i].ruleType == 1 && rules[i].platformProportion > 10000) {
            return "第" + (i + 1) + "条规则，平台占比不能大于100%。";
        }
        if (rules[i].ruleType == 1 && rules[i].maxAmount > 0 && rules[i].minAmount > rules[i].maxAmount) {
            return "第" + (i + 1) + "条规则，最小值必须小于最大值。";
        }
    }
    return;
}

function newMarket() {
    $("#dlg4markets_tips").html('');
    $('#dlg4markets').dialog('open').dialog('center').dialog('setTitle', '新建市场');

    $('#fm4markets').form('clear');
    url = 'api/market_add';
}

function editMarket() {
    $("#dlg4markets_tips").html('');
    var row = $('#dg4markets').datagrid('getSelected');
    if (row) {
        $('#dlg4markets').dialog('open').dialog('center').dialog('setTitle', '编辑市场');
        $('#fm4markets').form('load', row);
        url = 'api/market_edit';
    }
    else {
        noSelectAlert();
    }
}

function saveMarket() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#marketName'), 6, 20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count + 1) + '.市场名称' + tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0; i < tips.length; i++) {
            text = text + tips[i] + "<br/>";
        }
        showError($('#dlg4markets_tips'), text);
        return;
    }
    $.ajax({
        url: url,
        data: JSON.stringify(form2Json($("#fm4markets"))),
        contentType: "application/json",
        type: "post",
        success: function () {
            $('#dlg4markets').dialog('close');        // close the dialog
            $('#dg4markets').datagrid('reload');    // reload the user data
        },
        error: function (data) {
            var error = JSON.parse(data.responseText)
            showError($("#dlg4markets_tips"), error["errorMessage"]);
        }
    });
}

function deleteMarket() {
    var row = $('#dg4markets').datagrid('getSelected');
    if (row) {
        $.messager.confirm('操作确认', '确定要删除该市场吗？', function (r) {
            if (r) {
                $.ajax({
                    url: "api/market_delete?marketId=" + row['id'],
                    type: "post",
                    success: function () {
                        $("#dg4markets").datagrid('deleteRow', $("#dg4markets").datagrid('reload'));
                    },
                    error: function (data) {
                        var error = JSON.parse(data.responseText)
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

function linkToAccount() {
    $("#dlg4markets_account_tips").html('');
    $('#fm4markets_account').form('clear');
    var row = $('#dg4markets').datagrid('getSelected');
    if (row) {
        $("#dlg4markets_tips").html('');
        $('#dlg4markets_account').dialog('open').dialog('center').dialog('setTitle', '绑定账户');
        $('#fm4markets_account').form('load', row);

        if ($("#marketAccountCode").val() != '') {
            $("#marketAccountCode").textbox({'readonly': true});
            $("#bindAccountBtn").linkbutton('disable');
        } else {
            $("#marketAccountCode").textbox({'readonly': false});
            $("#bindAccountBtn").linkbutton('enable');
        }
    }
    else {
        noSelectAlert();
    }
}

function unlinkToAccount() {
    var row = $('#dg4markets').datagrid('getSelected');
    var accountCode = row.accountCode;
    if (accountCode == null || accountCode.trim() == '') {
        showMessage("请先绑定账户！");
        return;
    }

    if (row) {
        $.messager.confirm('操作确认', '确定解绑该账户编码吗？', function (r) {
            if (r) {
                $.ajax({
                    url: "api/market_unlink_to_account?marketId=" + row.id + "&accountCode=" + accountCode,
                    type: "post",
                    success: function () {
                        $('#dg4markets').datagrid('reload');
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

function saveLinkedAccount() {
    var accountCode = $("#marketAccountCode").val();
    if (accountCode == null || accountCode.trim() == '') {
        showError($("#dlg4markets_account_tips"), "账户编码不能为空。");
        return;
    }

    $.ajax({
        url: "api/market_link_to_account?marketId=" + $("#marketIdForAccountLink").val() + "&accountCode=" + accountCode.trim(),
        type: "post",
        success: function (response) {
            $('#dlg4markets_account').dialog('close');
            $('#dg4markets').datagrid('reload');
        },
        error: function (data) {
            errorHandler(data, $("#dlg4markets_account_tips"));
        }
    });
}

function linkToApi() {
    var row = $('#dg4markets').datagrid('getSelected');
    if (row) {
        $('#dg4markets_api').datagrid({
            title: '接口列表',
            collapsible: false,//是否可折叠的
            border: false,
            fit: true,//自动大小
            url: 'api/open_api_for_market',
            method: 'post',
            pageSize:50,
            pageList: [50, 100, 150, 200],
            remoteSort: false,
            idField: 'id',
            singleSelect: false,//是否单选
            loadFilter: function (data) {
                console.info(data.data);
                return data.data;
            },
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function (data) {
                $('#dg4markets_api').datagrid('clearChecked');
                $.ajax({
                    url: "api/market_open_api?marketId=" + row['id'],
                    type: "post",
                    success: function (response) {
                        console.info(response);
                        var api = response['data'];
                        if ($.isArray(api)) {
                            for (var i = 0; i < api.length; i++) {
                                var rowIndex = $('#dg4markets_api').datagrid('getRowIndex', api[i]['id']);
                                $('#dg4markets_api').datagrid('checkRow', rowIndex);
                            }
                        }

                    },
                    error: function (data) {
                        errorHandler(data, $("#dlg4markets_api_tips"));
                    }
                });
            }
        })
        $("#dlg4markets_api_tips").html('');
        $('#dlg4markets_api').dialog('open').dialog('center').dialog('setTitle', '接口分配');
    }
    else {
        noSelectAlert();
    }
}

function linkToProducts() {
    var row = $('#dg4markets').datagrid('getSelected');
    if (row) {
        $('#dg4markets_products').datagrid({
            title: '产品列表',
            collapsible: false,//是否可折叠的
            border: false,
            fit: true,//自动大小
            url: 'api/products?page=1&rows=9999999',
            method: 'post',
            remoteSort: false,
            idField: 'id',
            singleSelect: false,//是否单选
            loadFilter: function (data) {
                console.info(data.data);
                return data.data;
            },
            onLoadSuccess: function (data) {
                $('#dg4markets_products').datagrid('clearChecked');
                $.ajax({
                    url: "api/market_products?marketId=" + row['id'],
                    type: "post",
                    success: function (response) {
                        console.info(response);
                        var api = response['data'];
                        if ($.isArray(api)) {
                            for (var i = 0; i < api.length; i++) {
                                var rowIndex = $('#dg4markets_products').datagrid('getRowIndex', api[i]['id']);
                                $('#dg4markets_products').datagrid('checkRow', rowIndex);
                            }
                        }

                    },
                    error: function (data) {
                        errorHandler(data, $("#dlg4markets_products_tips"));
                    }
                });
            }
        })
        $("#dlg4markets_products_tips").html('');
        $('#dlg4markets_products').dialog('open').dialog('center').dialog('setTitle', '关联产品');
    }
    else {
        noSelectAlert();
    }
}

function showDivisionPercent(val, row) {
    return val ? val + '%' : val;
}

function showIsDredge(val, row) {
    if(val == 1){
        return '开通';
    }else if(val == 0){
        return '关闭';
    }
}

function saveMarketProducts() {
    var marketRow = $('#dg4markets').datagrid('getSelected');
    var row = $('#dg4markets_products').datagrid('getChecked');
    var productsIds = '';
    console.info(row);
    for (var i = 0; i < row.length; i++) {
        if (productsIds != '') {
            productsIds += ',';
        }
        if ($.isPlainObject(row[i])) {
            productsIds += row[i]['id'];
        }
    }

    $.ajax({
        url: "api/market_products_update?marketId=" + marketRow['id'] + "&productIds=" + productsIds,
        type: "post",
        success: function () {
            $('#dlg4markets_products').dialog('close');        // close the dialog
        },
        error: function (data) {
            var error = JSON.parse(data.responseText)
            showError($("#dlg4markets_products_tips"), error["errorMessage"]);
        }
    });
}

function saveMarketApi() {
    var marketRow = $('#dg4markets').datagrid('getSelected');
    var row = $('#dg4markets_api').datagrid('getChecked');
    var marketIds = '';
    console.info(row)
    for (var i = 0; i < row.length; i++) {
        if (marketIds != '') {
            marketIds += ',';
        }
        marketIds += row[i]['id'];
    }

    $.ajax({
        url: "api/market_open_api_update?marketId=" + marketRow['id'] + "&openApiIds=" + marketIds,
        type: "post",
        success: function () {
            $('#dlg4markets_api').dialog('close');        // close the dialog
        },
        error: function (data) {
            var error = JSON.parse(data.responseText)
            showError($("#dlg4markets_api_tips"), error["errorMessage"]);
        }
    });
}
//查询
function queryMarketNameAndMarketCode() {
    var params = {};
    params.name = $('#qName').textbox('getValue').trim();
    params.marketCode = $('#qMarketCode').textbox('getValue').trim();
    params.accountCode = $('#qAccountCode').textbox('getValue').trim();

    //限制查询输入字符
    var reg = /^[\w\d_-]{0,}$/;
    var reg2 = /^[\w\u4e00-\u9fa5\d_-]{0,}$/;
    if (reg2.test(params.name) && reg.test(params.marketCode) && reg.test(params.accountCode)){
        $('#dg4markets').datagrid({
            'url': 'api/markets?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4markets').datagrid('getPager'));
    }else{
        return showMessage('查询条件只能包括字母、数字、下划线和连接符！');
    }

}

//重置查询
function ResetQueryMarketNameAndMarketCode() {
    $('#qName').textbox('clear');
    $('#qMarketCode').textbox('clear');
    $('#qAccountCode').textbox('clear');
    $('#dg4markets').datagrid({
        'url': 'api/markets',
        pageNumber: 1
    });
    paginationConfig($('#dg4markets').datagrid('getPager'));
}

//关闭实时出金
function closeRealTimeWithDraw() {
    var row = $('#dg4markets').datagrid('getSelected');
        $.messager.confirm('关闭实时出金', '确认要关闭【实时出金】?', function (r) {
            if (r) {
                $.ajax({
                    url: 'api/market_withdraw_close?marketId=' + row['id'],
                    type: "post",
                    success: function (result) {
                        if(result.data){
                            $.messager.alert('提示信息', '【实时出金】已关闭，无需重复操作。');
                        }else{
                            $.messager.alert('提示信息', '【实时出金】已关闭。');
                        }
                        $('#dg4markets').datagrid('reload');
                    },
                    error: function (data) {
                        errorHandler2(data);
                    }
                });
            }
        });
}

//开通实时出金
function dredgeRealTimeWithDraw() {
    var row = $('#dg4markets').datagrid('getSelected');
    $.messager.confirm('开通确认', '确认要开通【实时出金】?', function (r) {
        if (r) {
            $.ajax({
                url: 'api/market_withdraw_dredge?marketId=' + row['id'],
                type: "post",
                success: function (result) {
                    console.log(result.data);
                    if(result.data){
                        $.messager.alert('提示信息', '【实时出金】已开通，无需重复操作。');
                    }else{
                        $.messager.alert('提示信息', '【实时出金】开通成功。');
                    }
                    $('#dg4markets').datagrid('reload');
                },
                error: function (data) {
                    errorHandler2(data);
                }
            });
        }
    });

}
