/**
 * User: Roland
 */
var rolesApi = new sysCommon.api('roles', {
        'createUri': 'api/role_add',
        'deleteUri': 'api/role_delete',
        'editUri': 'api/role_edit',
        'recordIdName': 'id'
    }
);
$(document).ready(
    function() {
        var toolbarAll = [{
            text: '添加角色',
            //iconCls: 'icon-add',
            handler: function () {
                rolesApi.create('添加角色');
            }
        }, {
            text: '修改角色',
            //iconCls: 'icon-add',
            handler: function () {
                rolesApi.edit('修改角色');
            }
        }, {
            text: '修改资源',
            //iconCls: 'icon-edit',
            handler: function () {
                editResources();
            }
        }, {
            text: '删除角色',
            //iconCls: 'icon-add',
            handler: function () {
                rolesApi.delete('确认要删除该角色吗?');
            }
        }];

        var urls = ['/api/role_add', '/api/role_edit', '/api/role_resources_add', '/api/role_delete'];

        $('#dg4roles').datagrid({
            title: '角色列表',
            collapsible: false,//是否可折叠的
            fit: true,//自动大小
            url: 'api/roles',
            remoteSort: false,
            idField: 'ID',
            singleSelect: true,//是否单选
            pagination: true,//分页控件
            rownumbers: true,//行号
            cache: false,
            pageSize:50,
            pageList: [50, 100, 150, 200],
            loadFilter: sysCommon.loadFilter,
            toolbar: getToolbar(toolbarAll, urls),
            onLoadError: function() {
                accessDenied();
            },
            onLoadSuccess: function() {
                $('#dg4roles').datagrid('selectRow',0);//选中第一条数据
                noRecord($(this),data,'id',3);//无记录
                rolesApi.onReloadSuccess();
            }
        });

        //设置分页控件
        paginationConfig($('#dg4roles').datagrid('getPager'));
    }
);

function saveNewRole(){
    var tip = checkName($('#newRoleName'),6,20);
    if (!$.isEmptyObject(tip)) {
        showError($('#dlg4_new_roles_tips'),"1.角色名"+tip)
        return;
    }
    rolesApi.save();
}

function saveRole(){
    var tip = checkName($('#roleName'),6,20);
    if (!$.isEmptyObject(tip)) {
        showError($('#dlg4roles_tips'),"1.角色名"+tip)
        return;
    }
    rolesApi.update();
}

function editResources() {
    url = "api/role_resources_add";
    var row = $('#dg4roles').datagrid('getSelected');
    if (row) {
        $("#dlg4roles_resources_tips").html('');
        var row = $('#dg4roles').datagrid('getSelected');
        if (row){
            $('#dlg4roles_resources').dialog('open').dialog('center').dialog('setTitle','修改资源');

            $('#resourcesTree').tree({
                url: "api/resources",
                checkbox: true,
                onLoadSuccess: function(node, data) {
                    $.ajax({
                        url: "api/role_resources?roleId=" + row["id"],
                        type: "post",
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
                            try{
                                var error = JSON.parse(data.responseText)
                                showError($("#dlg4roles_resources_tips"), error["errorMessage"]);
                            } catch(e) {
                                if (data.status == 403) {
                                    accessDenied();
                                }
                            }
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
    var row = $('#dg4roles').datagrid('getSelected');
    var resourceIds = getChecked();
    $.ajax({
        url: url + "?roleId=" + row['id'] + "&resourceIds=" + resourceIds,
        type: "post",
        success: function () {
            $('#dlg4roles_resources').dialog('close');        // close the dialog
        },
        error: function (data) {
            var error = JSON.parse(data.responseText)
            showError($("#dlg4roles_resources_tips"), error["errorMessage"]);
        }
    });
}