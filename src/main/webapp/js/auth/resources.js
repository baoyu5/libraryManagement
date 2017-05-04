/**
 * User: Roland
 */
$(document).ready(
    function () {
        var resourceToolbarAll = [{
            text: '添加资源',
            //iconCls: 'icon-add',
            handler: function () {
                newResource();
            }
        }, {
            text: '修改资源',
            //iconCls: 'icon-add',
            handler: function () {
                if ($('#rscDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    editResource();
                }
            }
        }, {
            text: '删除资源',
            //iconCls: 'icon-edit',
            handler: function () {
                if ($('#rscDiv .datagrid-body .noRst').length) {  //排除无记录
                    noSelectAlert();
                }else{
                    deleteResource();
                }
            }
        }];

        var urls = ['/api/resource_add', '/api/resource_edit', '/api/resource_delete'];

        var toolbar = getToolbar(resourceToolbarAll, urls);

        $('#dg4resources').datagrid({
            title: '资源列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/resources_load',
            method: 'post',
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            loadFilter: function (data) {
                console.info(data);
                if (data.status === 0) {
                    return data.data;
                } else {
                    throw 'Markets data error.';
                }
            },
            toolbar: toolbar,
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function(data){
                $('#dg4resources').datagrid('selectRow');//默认不选中数据
                noRecord($(this),data,'name',5);
            }
        });

        //设置分页控件
        paginationConfig($('#dg4resources').datagrid('getPager'));

        $("#levelBox").combobox({
            onChange: function (newValue, oldValue) {
                loadMenu(newValue, "");
            }
        });
    }
);

function loadMenu(level, value) {
    $("#parentIdComboBox").combobox('clear');

    if (level == 0) {
        $("#parentIdComboBox").combobox('disable');
    } else {
        var row = $('#dg4resources').datagrid('getSelected');
        $("#parentIdComboBox").combobox({
            disabled: false,
            url: 'api/menu_by_level?level=' + level,
            method: 'post',
            valueField: 'id',
            textField: 'name',
            value: value,
            editable: false,
            onLoadSuccess: function () {
                if (value == '') {
                    $("#parentIdComboBox").combobox('select', $("#parentIdComboBox").combobox('getData')[0].id);
                }
            }
        })
    }

}

var url;
function newResource() {
    $("#dlg4resources_tips").html('');
    $('#dlg4resources').dialog('open').dialog('center').dialog('setTitle', '添加资源');

    $('#fm4resources').form('clear');
    $("#levelBox").combobox({value: 0});
    $("#parentIdComboBox").combobox({
        value: "",
        disabled: true
    })
    url = 'api/resource_add';
}

function editResource() {
    url = 'api/resource_edit';
    $("#dlg4resources_tips").html('');
    var row = $('#dg4resources').datagrid('getSelected');
    if (row) {
        $('#dlg4resources').dialog('open').dialog('center').dialog('setTitle', '修改资源');
        $('#fm4resources').form('load', row);
        $("#oldParentId").val(row["parentId"]);

        loadMenu(row["level"], row["parentId"]);
    }
    else {
        noSelectAlert();
    }
}

function saveResource() {
    var tips = [];
    var count = 0;
    var tip1 = checkName($('#resourceName'), 4, 20);
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count + 1) + '.资源名' + tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0; i < tips.length; i++) {
            text = text + tips[i] + "<br/>";
        }
        showError($('#dlg4resources_tips'), text);
        return;
    }
    $.ajax({
        url: url,
        data: JSON.stringify(form2Json($("#fm4resources"))),
        contentType: "application/json",
        type: "post",
        success: function () {
            $('#dlg4resources').dialog('close');        // close the dialog
            $('#dg4resources').datagrid('reload');    // reload the user data
        },
        error: function (data) {
            var error = JSON.parse(data.responseText)
            showError($("#dlg4resources_tips"), error["errorMessage"]);
        }
    });
}

function deleteResource() {
    var row = $('#dg4resources').datagrid('getSelected');
    if (row) {
        $.messager.confirm('操作确认', '确定要删除该资源吗？', function (r) {
            if (r) {
                $.ajax({
                    url: "api/resource_delete?id=" + row['id'],
                    type: "post",
                    success: function () {
                        $("#dg4resources").datagrid('deleteRow', $("#dg4resources").datagrid('getRowIndex', row));
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

function showTypeName(val, row) {
    if (val == 0) {
        return "一级菜单";
    } else if (val == 1) {
        return "二级菜单";
    } else if (val == 2) {
        return "普通资源";
    } else {
        return "unknown";
    }
}

// 查询
function resourcesQuery() {
    var params = {};
    params.resourceName = $('#resource_name').textbox('getValue').trim();
    params.type = $('#resource_details_type').combobox('getValue').trim();

    //资源查询限制特殊字符的输入li
    var reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{0,}$/;
    var sourse = $('#resource_name').val();
    if (!reg.test(sourse)){
        return showMessage('不能包含特殊字符（下划线、连接符除外）！');
    }else{
        $('#dg4resources').datagrid({
            'url': 'api/resources_load?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4resources').datagrid('getPager'));
    }
}

// 重置查询条件
function resourcesReset() {
    $('#resource_name').textbox('clear');
    $('#resource_details_type').combobox('select', -1);

    $('#dg4resources').datagrid({
        'url': 'api/resources_load',
        pageNumber: 1
    });
    paginationConfig($('#dg4resources').datagrid('getPager'));
}