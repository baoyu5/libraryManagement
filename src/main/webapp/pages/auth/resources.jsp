<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script src="../../js/utils.js" type="text/javascript"/>
<script src="../../js/auth/resources.js" type="text/javascript"/>
<style>
    input[readonly] {
        cursor: pointer;
        background-color: #ffffff;
    }

    input[disabled] {
        cursor: not-allowed;
        background-color: #eee;
    }

</style>
<div class="easyui-layout" style="height:100%;">
    <div data-options="region:'north'" style="padding: 5px; height:120px;">
        <div class="easyui-panel" title="查询条件" style="height: 100%;">
            <form id="#qfm4_resource" style="margin-bottom: 5px;">
            <table class="table" style="margin-bottom: 0px; margin-top:5px;width: 600px;">
                <tr>
                    <td style="border-top: 0px;padding-top: 5px;padding-bottom: 5px;">
                        <span>资源名称：</span>
                        <input id="resource_name" name="resourceName" class="easyui-textbox"/>
                    </td>
                    <td style="border-top: 0px;padding-top: 5px;padding-bottom: 5px;">
                        <span>资源类型：</span>
                        <select id="resource_details_type" class="easyui-combobox" data-options="editable:false"
                                panelHeight="140px" style="width: 212px;">
                            <option value="-1">所有类型</option>
                            <option value="1">一级菜单</option>
                            <option value="2">二级菜单</option>
                            <option value="3">普通资源</option>
                        </select>
                    </td>
                <tr>
                    <td colspan="2" style="border-top: 0px;padding-top: 5px;padding-bottom: 5px;">
                        <a href="#" class="easyui-linkbutton" onclick="resourcesQuery()"
                           data-options="iconCls:'icon-search'" style="width:80px">查询</a>
                        <a href="#" class="easyui-linkbutton" onclick="resourcesReset()"
                           style="width:60px">重置</a>
                    </td>
                </tr>
            </table>
            </form>
        </div>
    </div>
    <div data-options="region:'center'" style="padding: 5px;" id="rscDiv">
        <table id="dg4resource">
            <thead>
            <tr>
                <%--<th field="id" width="10%">ID</th>--%>
                <th field="name" width="15%">名称</th>
                <th field="parentName" width="15%">所属</th>
                <th field="level" width="15%" formatter="showTypeName">类型</th>
                <th field="url" width="25%">URL</th>
                <th field="description" width="25%">描述</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
        <div id="dlg4resource" class="easyui-dialog" style="width:500px;height:350px;padding:10px 20px"
             closed="true" buttons="#dlg-buttons-resource" modal="true">
            <div id="dlg4resource_tips"></div>
            <form id="fm4resource" method="post" novalidate style="margin-bottom: 0px; margin-top: 10px">
                <table class="table" style="margin-bottom: 0px;">
                    <tr>
                        <td style="text-align: right">资源名称：</td>
                        <td><input name="name" class="easyui-textbox" required="true" id="resourceName"></td>
                    </tr>
                    <tr>
                        <td style="text-align: right">类型：</td>
                        <td>
                            <select name="level" style="width: 212px;" id="levelBox" data-options="editable:false">
                                <option value="1">一级菜单</option>
                                <option value="2">二级菜单</option>
                                <option value="3">普通资源</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right">所属：</td>
                        <td>
                            <input class="easyui-combobox" name="parentId" id="parentIdComboBox">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right">URL：</td>
                        <td><input name="url" class="easyui-textbox"></td>
                    </tr>
                    <tr>
                        <td style="text-align: right">描述：</td>
                        <td><input name="description" class="easyui-textbox"><input name="id" hidden><input
                                name="oldParentId" id="oldParentId" hidden></td>
                    </tr>
                </table>
            </form>
        </div>
        <div id="dlg-buttons-resource">
            <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveResource()" style="width:80px">提交</a>
            <a href="javascript:void(0)" class="easyui-linkbutton"
               onclick="javascript:$('#dlg4resource').dialog('close')" style="width:80px">取消</a>
        </div>
    </div>
</div>