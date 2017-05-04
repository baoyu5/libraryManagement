<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script src="../../js/utils.js" type="text/javascript"/>
<script src="../../js/auth/roles.js" type="text/javascript"/>

<div id="cdc" class="easyui-layout" style="height:100%;">
    <div data-options="region:'center'" style="padding: 5px;">
        <table id="dg4roles">
            <thead>
            <tr>
                <th field="id" width="10%">ID</th>
                <th field="name" width="15%">角色名</th>
                <th field="description" width="25%">描述</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<div id="dlg4_new_roles" class="easyui-dialog" style="width:500px;height:280px;padding:10px 20px"
     closed="true" buttons="#dlg-buttons-new-api" modal="true">
    <div id="dlg4_new_roles_tips">
        <!--<div class="alert alert-danger" role="alert"></div>-->
    </div>
    <form id="fm4_new_roles" method="post" novalidate style="margin-bottom: 0px; margin-top: 10px">
        <table class="table" style="margin-bottom: 0px;">
            <tr>
                <td style="text-align: right">角色名称：</td>
                <td><input name="name" class="easyui-textbox" required="true" id="newRoleName"></td>
            </tr>
            <tr>
                <td style="text-align: right">描述：</td>
                <td><input name="description" class="easyui-textbox"><input name="id" hidden></td>
            </tr>
        </table>
    </form>
</div>
<div id="dlg-buttons-new-api">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveNewRole()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg4_new_roles').dialog('close')" style="width:80px">取消</a>
</div>

<div id="dlg4roles_resources" class="easyui-dialog" style="width:400px;height:500px;padding:10px 20px"
     closed="true" buttons="#dlg-buttons-roles-resources" modal="true">
    <div id="dlg4roles_resources_tips">
        <!--<div class="alert alert-danger" role="alert"></div>-->

    </div>
    <form id="fm4admins_resources" method="post" novalidate style="margin-bottom: 0px;">
        <ul  data-options="lines:true" id="resourcesTree" />
    </form>
</div>
<div id="dlg-buttons-roles-resources">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveResources()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg4roles_resources').dialog('close')" style="width:80px">取消</a>
</div>

<div id="dlg4roles" class="easyui-dialog" style="width:500px;height:280px;padding:10px 20px"
     closed="true" buttons="#dlg-buttons-api" modal="true">
    <div id="dlg4roles_tips">
        <!--<div class="alert alert-danger" role="alert"></div>-->
    </div>
    <form id="fm4roles" method="post" novalidate style="margin-bottom: 0px; margin-top: 10px">
        <table class="table" style="margin-bottom: 0px;">
            <tr>
                <td style="text-align: right">角色名称：</td>
                <td><input name="name" class="easyui-textbox" required="true" id="roleName"></td>
            </tr>
            <tr>
                <td style="text-align: right">描述：</td>
                <td><input name="description" class="easyui-textbox"><input name="id" hidden></td>
            </tr>
        </table>
    </form>
</div>
<div id="dlg-buttons-api">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveRole()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg4roles').dialog('close')" style="width:80px">取消</a>
</div>