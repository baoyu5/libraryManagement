var ruleApi = new sysCommon.api('risk_rule', {
        'loadUri': 'api/rules',
        'createUri': 'api/rule_add',
        'deleteUri': 'api/rule_delete',
        'editUri': 'api/rule_edit'
    }
);

$(document).ready(
    function () {
        var toolbarAll = [
            {
                text: '添加规则',
                //iconCls: 'icon-edit',
                handler: function () {
                    addRule();
                }
            }, {
                text: '修改规则',
                //iconCls: 'icon-edit',
                handler: function () {
                    editRule();
                }
            }];

        var urls = ['/api/rule_add', '/api/rule_edit'];
        $('#dg4risk_rule').datagrid({
            title: '规则列表（即时生效）',
            //iconCls:'icon-edit',//图标
            //width: 700,
            //height: 'auto',
            //nowrap: false,
            //striped: true,
            //border: true,
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/rules',
            loadFilter: sysCommon.loadFilter,
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
            toolbar: getToolbar(toolbarAll, urls),
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function () {
                $('#dg4risk_rule').datagrid('selectRow',0);//选中第一条数据
                ruleApi.onReloadSuccess();
            }
        });
        //设置分页控件
        paginationConfig($('#dg4risk_rule').datagrid('getPager'));
    }
);

function addRule() {
    $("#dlg4_new_risk_rule_tips").html('');
    $('#dlg4_new_risk_rule').dialog('open').dialog('center').dialog('setTitle', '添加规则');

    $('#fm4_new_risk_rule').form('clear');
    $("#newAction").combobox({value: 1});
    $("#newType").combobox({value: 1});
    $("#newRiskLevel").combobox({value: 1});
    url = 'api/rule_add';
}

function saveRule() {
    var tips = [];
    var count = 0;

    var tip2 = checkName($('#newDescription'), 1, 200);
    if (!$.isEmptyObject(tip2)) {
        tips[count] = (count + 1) + '.规则说明' + tip2;
        count++;
    }

    var newParameterOne = $("#newParameterOne").textbox('getValue');
    if (newParameterOne != "") {
        var tip4 = checkParameter($('#newParameterOne'));
        if (tip4 != null && tip4 !="") {
            tips[count] = (count + 1) + '.参数一' + tip4;
            count++;
        }
    }

    var newParameterTwo = $("#newParameterTwo").textbox('getValue');
    if (newParameterTwo != "") {
        var tip5 = checkParameter($('#newParameterTwo'));
        if (tip5 != null && tip5 !="") {
            tips[count] = (count + 1) + '.参数二' + tip5;
            count++;
        }
    }

    if (tips.length != 0) {
        var text = '';
        for (var i = 0; i < tips.length; i++) {
            text = text + tips[i] + "<br/>";
        }
        showError($('#dlg4_new_risk_rule_tips'), text);
        return;
    }
    ruleApi.save();
    showMessage("操作成功，规则已即时生效！");
}

function editRule() {
    $('#dlg4risk_rule_tips').html('');
    var row = $('#dg4risk_rule').datagrid('getSelected');
    if (row) {
        $('#dlg4risk_rule').dialog('open').dialog('center').dialog('setTitle', '修改规则');
        $('#fm4risk_rule').form('load', row);
    }
}

function updateRule() {
    var tips = [];
    var count = 0;

    var tip2 = checkParameter($('#parameterOne'));
    if (!$.isEmptyObject(tip2)) {
        tips[count] = (count + 1) + '.参数一' + tip2;
        count++;
    }

    var tip3 = checkParameter($('#parameterTwo'));
    if (!$.isEmptyObject(tip3)) {
        tips[count] = (count + 1) + '.参数二' + tip3;
        count++;
    }

    if (tips.length != 0) {
        var text = '';
        for (var i = 0; i < tips.length; i++) {
            text = text + tips[i] + "<br/>";
        }
        showError($('#dlg4risk_rule_tips'), text);
        return;
    }
    ruleApi.update();
    showMessage("操作成功，规则已即时生效！");
}

function riskRuleStatusFormatter(val) {
    return val ? '是' : '否';
}

function actionFormatter(val) {
    if (val == 1) {
        return "报警";
    } else if (val == 2) {
        return "冻结";
    }
}

function typeFormatter(val) {
    if (val == 2) {
        return "日累计限额";
    } else if (val == 5) {
        return "月累计限额";
    } else if (val == 6) {
        return "年累计限额";
    } else if (val == 4) {
        return "单笔限额";
    } else if (val == 3) {
        return "支付失败限次";
    } else if (val == 1) {
        return "日累计限次";
    }
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

function checkParameter(target) {
    var name = target.val().trim();

    var reg = /^(0|\+?[1-9][0-9]*)$/;
    if (!name.match(reg)) {
        return "只能输入非负整数！";
    }

    return "";
}

// 查询
function queryRiskRule() {
    var params = {};
    params.type = $('#risk_rule_type').combobox('getValue').trim();
    params.riskLevel = $('#risk_rule_level').combobox('getValue').trim();
    $('#dg4risk_rule').datagrid({
        'url': 'api/rules?' + $.param(params),
        pageNumber: 1
    });
    paginationConfig($('#dg4risk_rule').datagrid('getPager'));
}

// 重置查询条件
function resetRiskRule() {
    $('#risk_rule_type').combobox('select',0);
    $('#risk_rule_level').combobox('select',0);
    $('#dg4risk_rule').datagrid({
        'url': 'api/rules',
        pageNumber: 1
    });
    paginationConfig($('#dg4risk_rule').datagrid('getPager'));
}