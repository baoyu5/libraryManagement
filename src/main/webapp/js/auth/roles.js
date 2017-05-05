var roleApi = new sysCommon.api('role', {
        'loadUri':'role/roles',
        'createUri': 'role/add',
        'deleteUri': 'role/delete',
        'editUri': 'role/edit',
        'recordIdName': 'id'
    }
);
$(document).ready(
    function() {
        var toolbarAll = [{
            text: '添加角色',
            handler: function () {
                roleApi.create('添加角色');
            }
        }, {
            text: '修改角色',
            handler: function () {
                roleApi.edit('修改角色');
            }
        }, {
            text: '修改资源',
            handler: function () {
                editResources();
            }
        }, {
            text: '删除角色',
            handler: function () {
                roleApi.delete('确认要删除该角色吗?');
            }
        }];

        var urls = ['/role/add', '/role/edit', '/role/role_resources_update', '/role/delete'];

        $('#dg4role').datagrid({
            title: '角色列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'role/roles',
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
            toolbar: getToolbar(toolbarAll, urls),
            onLoadError: function() {
                accessDenied();
            },
            onLoadSuccess: function() {
                roleApi.onReloadSuccess();
            }
        });

        //设置分页控件
        paginationConfig($('#dg4role').datagrid('getPager'));
    }
);

function saveNewRole(){
    var tip = checkName($('#newRoleName'), 6, 20, "1.角色名");
    if (!$.isEmptyObject(tip)) {
        showError($('#dlg4_new_role_tips'), tip)
        return;
    }
    roleApi.save();
}

function saveRole(){
    var tip = checkName($('#roleName'), 6, 20, "1.角色名");
    if (!$.isEmptyObject(tip)) {
        showError($('#dlg4role_tips'), tip)
        return;
    }
    roleApi.update();
}

function editResources() {
    url = "role/role_resources_update";
    var row = $('#dg4role').datagrid('getSelected');
    if (row) {
        $("#dlg4role_resources_tips").html('');
        var row = $('#dg4role').datagrid('getSelected');
        if (row){
            $('#dlg4role_resources').dialog('open').dialog('center').dialog('setTitle','修改资源');

            $('#resourcesTree').tree({
                url: "resource/load_all_resources",
                method: 'get',
                checkbox: true,
                onLoadSuccess: function(node, data) {
                    $.ajax({
                        url: "role/role_resources?roleId=" + row["id"],
                        type: "get",
                        success: function (response) {
                            var data = response["data"];
                            if (data != undefined) {
                                for(var i = 0; i < data.length; i++) {
                                    var node = $('#resourcesTree').tree('find', data[i].id);
                                    console.info($('#resourcesTree').tree('isLeaf', node.target))
                                    if( $('#resourcesTree').tree('isLeaf', node.target)) {
                                        $('#resourcesTree').tree('check', node.target);
                                    }
                                }
                            }
                        },
                        error: function (data) {
                            errorHandler(data, $("#dlg4role_resources_tips"));
                            // try{
                            //     var error = JSON.parse(data.responseText)
                            //     showError($("#dlg4role_resources_tips"), error["errorMessage"]);
                            // } catch(e) {
                            //     if (data.status == 403) {
                            //         accessDenied();
                            //     }
                            // }
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

function getChecked(){
    var nodes = $('#resourcesTree').tree('getChecked',['checked','indeterminate']);
    var s = '';
    for(var i=0; i<nodes.length; i++){
        if (s != '') {
            s += ',';
        }
        s += nodes[i].id;
    }
    return s;
}

function saveResources() {
    var row = $('#dg4role').datagrid('getSelected');
    var resourceIds = getChecked();
    $.ajax({
        url: url + "?roleId=" + row['id'] + "&resourceIds=" + resourceIds,
        type: "post",
        success: function () {
            $('#dlg4role_resources').dialog('close');        // close the dialog
        },
        error: function (data) {
            errorHandler(data, $("#dlg4role_resources_tips"));
            // var error = JSON.parse(data.responseText)
            // showError($("#dlg4role_resources_tips"), error["errorMessage"]);
        }
    });
}