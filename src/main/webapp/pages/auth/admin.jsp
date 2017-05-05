<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script src="../../js/auth/admin.js" type="text/javascript"/>

<div class="easyui-layout" style="height:100%;">
    <div data-options="region:'north'" style="padding: 5px; height:120px;">
        <div class="easyui-panel" title="查询条件" style="height: 100%;">
            <form id="#qfm4_admin" style="margin-bottom: 5px;">
            <table class="table" style="margin-bottom: 0px; margin-top:5px;width: 600px;">
                <tr>
                    <td style="border-top: 0px;padding-top: 5px;padding-bottom: 5px;">
                        <span>登录名：</span>
                        <input id="qAdminLoginName" name="loginName" class="easyui-textbox"/>
                    </td>
                    <td style="border-top: 0px;padding-top: 5px;padding-bottom: 5px;">
                        <span>姓名：</span>
                        <input id="qAdminRealName" name="realName" class="easyui-textbox"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="border-top: 0px;padding-top: 5px;padding-bottom: 5px;">
                        <a href="#" class="easyui-linkbutton" onclick="queryAdmins()"
                           data-options="iconCls:'icon-search'" style="width:80px">查询</a>
                        <a href="#" class="easyui-linkbutton" onclick="ResetQueryAdmins()"
                           style="width:60px">重置</a>
                    </td>
                </tr>
            </table>
            </form>
        </div>
    </div>
    <div data-options="region:'center'" style="padding: 5px;" id="optDiv">
        <table id="dg4admin" title="操作员列表" >
            <thead>
            <tr>
                <th field="id" width="10%" hidden="true">ID</th>
                <%--<th field="code" width="10%">编码</th>--%>
                <th field="loginName" width="15%">登录名</th>
                <th field="realName" width="10%">姓名</th>
                <th field="phoneNo" width="15%">手机号</th>
                <th field="email" width="20%">Email</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<div id="dlg4admin" class="easyui-dialog" style="width:500px;height:360px;padding:10px 20px"
     closed="true" buttons="#dlg-buttons-admin" modal="true">
    <div id="dlg4admin_tips">
        <!--<div class="alert alert-danger" role="alert"></div>-->
    </div>
    <form id="fm4admin" method="post" novalidate style="margin-bottom: 0px;; margin-top: 10px">
        <table class="table" style="margin-bottom: 0px;">
            <tr>
                <td style="text-align: right">登录名：</td>
                <td><input name="loginName" class="easyui-textbox" required="true" id="adminLoginName"></td>
            </tr>
            <tr>
                <td style="text-align: right">姓名：</td>
                <td><input name="realName" class="easyui-textbox" required="true" id="adminRealName"></td>
            </tr>
            <tr>
                <td style="text-align: right">手机号：</td>
                <td><input name="phoneNo" class="easyui-textbox" id="adminPhone"></td>
            </tr>
            <tr>
                <td style="text-align: right">Email：</td>
                <td><input name="email" class="easyui-textbox" id="adminEmail"></td>
            </tr>
        </table>
    </form>
</div>
<div id="dlg-buttons-admin">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveAdmin()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg4admin').dialog('close')" style="width:80px">取消</a>
</div>

<div id="dlg4_new_admin" class="easyui-dialog" style="width:500px;height:360px;padding:10px 20px"
     closed="true" buttons="#dlg-buttons-new-admin" modal="true">
    <div id="dlg4_new_admin_tips">
        <!--<div class="alert alert-danger" role="alert"></div>-->
    </div>
    <form id="fm4_new_admin" method="post" novalidate style="margin-bottom: 0px;; margin-top: 10px">
        <table class="table" style="margin-bottom: 0px;">
            <tr>
                <td style="text-align: right">登录名：</td>
                <td><input name="loginName" class="easyui-textbox" required="true" id="newAdminLoginName"></td>
            </tr>
            <tr>
                <td style="text-align: right">姓名：</td>
                <td><input name="realName" class="easyui-textbox" required="true" id="newAdminRealName"></td>
            </tr>
            <tr>
                <td style="text-align: right">手机号：</td>
                <td><input name="phoneNo" class="easyui-textbox" id="newAdminPhone"></td>
            </tr>
            <tr>
                <td style="text-align: right">Email：</td>
                <td><input name="email" class="easyui-textbox" id="newAdminEmail"></td>
            </tr>
            <tr>
                <td style="text-align: right">密码：</td>
                <td><input name="password" class="easyui-textbox" type="password" id="newAdminPassword"></td>
            </tr>
            <tr>
                <td style="text-align: right">确认密码：</td>
                <td><input name="passwordConfirm" class="easyui-textbox" type="password" id="newAdminPasswordConfirm"></td>
            </tr>
        </table>
    </form>
</div>
<div id="dlg-buttons-new-admin">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveNewAdmin()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg4_new_admin').dialog('close')" style="width:80px">取消</a>
</div>

<div id="dlg4admin_roles" class="easyui-dialog" style="width:400px;height:500px;padding:3px 3px"
     closed="true" buttons="#dlg-buttons-admin-roles" modal="true">
    <div class="easyui-layout" style="height:100%;">
        <div data-options="region:'center'" >
            <div id="dlg4admin_roles_tips"></div>
            <table id="dg4admin_roles" >
                <thead>
                <tr>
                    <th field="ck" width="20%" checkbox="true"></th>
                    <th field="name" width="80%">角色名称</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>
<div id="dlg-buttons-admin-roles">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveRoles()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg4admin_roles').dialog('close')" style="width:80px">取消</a>
</div>

<div id="dlg4admin_password" class="easyui-dialog" style="width:480px;height:240px;padding:10px 20px"
     closed="true" buttons="#dlg-buttons-admin-password" modal="true">
    <div id="dlg4admin_password_tips">
        <!--<div class="alert alert-danger" role="alert"></div>-->
    </div>
    <form id="fm4admin_password" method="post" novalidate style="margin-bottom: 0px;; margin-top: 10px">
        <table class="table" style="margin-bottom: 0px;">
            <tr>
                <td style="text-align: right">新密码：</td>
                <td><input type="password" name="password" id="adminNewPassword" class="easyui-textbox" required="true"></td>
            </tr>
            <tr>
                <td style="text-align: right">确认新密码：</td>
                <td><input type="password" name="passwordConfirm" id="adminNewPasswordConfirm" class="easyui-textbox"><input name="id" hidden></td>
            </tr>
        </table>
    </form>
</div>
<div id="dlg-buttons-admin-password">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="savePassword()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton" onclick="javascript:$('#dlg4admin_password').dialog('close')" style="width:80px">取消</a>
</div>