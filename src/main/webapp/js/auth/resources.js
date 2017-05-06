var resourceApi = new sysCommon.api('resource', {
        'loadUri':'resource/resources',
        'createUri': 'resource/add',
        'deleteUri': 'resource/delete',
        'editUri': 'resource/edit',
        'recordIdName': 'id'
    }
);
$(document).ready(
    function () {
        var resourceToolbarAll = [{
            text: '添加资源',
            handler: function () {
                newResource();
            }
        }, {
            text: '修改资源',
            handler: function () {
                editResource();
            }
        }, {
            text: '删除资源',
            handler: function () {
                // deleteResource();
                resourceApi.delete('确认要删除该资源吗?');
            }
        }];

        var urls = ['/resource/add', '/resource/edit', '/resource/delete'];

        var toolbar = getToolbar(resourceToolbarAll, urls);

        $('#dg4resource').datagrid({
            title: '资源列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'resource/resources',
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
            toolbar: toolbar,
            onLoadError: function () {
                accessDenied();
            },
            onLoadSuccess: function(data){
                resourceApi.onReloadSuccess();
            }
        });

        //设置分页控件
        paginationConfig($('#dg4resource').datagrid('getPager'));

        $("#levelBox").combobox({
            onChange: function (newValue, oldValue) {
                loadMenu(newValue, "");
            }
        });
    }
);

function loadMenu(level, value) {
    $("#parentIdComboBox").combobox('clear');

    if (level == 1) {
        $("#parentIdComboBox").combobox('disable');
    } else {
        var row = $('#dg4resource').datagrid('getSelected');
        $("#parentIdComboBox").combobox({
            disabled: false,
            url: 'resource/menu_by_level?level=' + level,
            method: 'get',
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
    $("#dlg4resource_tips").html('');
    $('#dlg4resource').dialog('open').dialog('center').dialog('setTitle', '添加资源');

    $('#fm4resource').form('clear');
    $("#levelBox").combobox({value: ''});
    $("#parentIdComboBox").combobox({
        value: "",
        disabled: true
    });
    url = 'resource/add';
}

function editResource() {
    url = 'resource/edit';
    $("#dlg4resource_tips").html('');
    var row = $('#dg4resource').datagrid('getSelected');
    if (row) {
        $('#dlg4resource').dialog('open').dialog('center').dialog('setTitle', '修改资源');
        $('#fm4resource').form('load', row);
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
    var tip1 = checkName($('#resourceName'), 4, 20, ".资源名");
    if (!$.isEmptyObject(tip1)) {
        tips[count] = (count + 1) + tip1;
        count++;
    }
    if (tips.length != 0) {
        var text = '';
        for (var i = 0; i < tips.length; i++) {
            text = text + tips[i] + "<br/>";
        }
        showError($('#dlg4resource_tips'), text);
        return;
    }
    $.ajax({
        url: url,
        data: JSON.stringify(form2Json($("#fm4resource"))),
        contentType: "application/json",
        type: "post",
        success: function () {
            $('#dlg4resource').dialog('close');        // close the dialog
            $('#dg4resource').datagrid('reload');    // reload the user data
        },
        error: function (data) {
            errorHandler(data, $("#dlg4resource_tips"));
            // var error = JSON.parse(data.responseText)
            // showError($("#dlg4resource_tips"), error["errorMessage"]);
        }
    });
}

// function deleteResource() {
//     var row = $('#dg4resource').datagrid('getSelected');
//     if (row) {
//         $.messager.confirm('操作确认', '确定要删除该资源吗？', function (r) {
//             if (r) {
//                 $.ajax({
//                     url: "resource/delete?id=" + row['id'],
//                     type: "post",
//                     success: function () {
//                         $("#dg4resource").datagrid('deleteRow', $("#dg4resource").datagrid('getRowIndex', row));
//                     },
//                     error: function (data) {
//                         var error = JSON.parse(data.responseText)
//                         showMessage(error["errorMessage"]);
//                     }
//                 });
//
//             }
//         });
//     }
//     else {
//         noSelectAlert();
//     }
// }

function showTypeName(val, row) {
    if (val == 1) {
        return "一级菜单";
    } else if (val == 2) {
        return "二级菜单";
    } else if (val == 3) {
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
        $('#dg4resource').datagrid({
            'url': 'resource/resources?' + $.param(params),
            pageNumber: 1
        });
        paginationConfig($('#dg4resource').datagrid('getPager'));
    }
}

// 重置查询条件
function resourcesReset() {
    $('#resource_name').textbox('clear');
    $('#resource_details_type').combobox('select', -1);

    // $('#dg4resource').datagrid({
    //     'url': 'resource/resources_load',
    //     pageNumber: 1
    // });

    paginationConfig($('#dg4resource').datagrid('getPager'));
}