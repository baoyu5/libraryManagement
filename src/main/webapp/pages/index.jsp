<%@ page import="org.springframework.security.core.context.SecurityContext" %>
<%@ page import="com.sj.library.management.security.UserDetailsImpl" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>图书馆管理系统</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/easyui/bootstrap/easyui.css">
    <link rel="stylesheet" href="css/sticky.footer.css">
    <link rel="stylesheet" type="text/css" href="css/easyui/icon.css">
    <!--<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">-->
    <link rel="stylesheet" type="text/css" href="css/easyui/color.css">
    <link rel="stylesheet" type="text/css" href="css/app.css">

    <script type="text/javascript" src="js/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="js/easyui/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="js/easyui/easyui-lang-zh_CN.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/utils.js"></script>
    <script type="text/javascript" src="js/sprintf.min.js"></script>

    <script type="text/javascript" src="js/index.js"></script>

    <%
        UserDetailsImpl details = (UserDetailsImpl)((SecurityContext) request.getSession(false).getAttribute("SPRING_SECURITY_CONTEXT")).getAuthentication().getPrincipal();
    %>

    <script>
        loginUser = "<%=details.getUsername()%>";
        <%--authorities = JSON.stringify(<%=details.getAuthorities()%>);--%>
        <%--console.log(authorities);--%>
    </script>
</head>
<body>
<div id="cc" class="easyui-layout" style="height:100%;">
    <div data-options="region:'north'" style="height:50px">
        <div class="navbar navbar-inverse navbar-fixed-top" >
            <div class="navbar-inner" style="height: 47px" >
                <div class="nav-collapse collapse" style="margin-top: 5px;">
                    <ul class="nav" >
                        <li class="active" style="font-size: 16px"><a  id="index" href="#">图书馆管理系统</a></li>
                    </ul>
                </div>
                <div style="float:right;">
                    <ul class="nav" style="margin-right:0px">
                        <li><a href="#"><%=details.getType()%>： <%=details.getUsername()%> ( <%=details.getRealName()%> )</a></li>
                        <li><a href="javascript:void(0)" onclick="editMyselfPassword()">修改密码</a></li>
                        <li><a href="logout">退出</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div data-options="region:'west',split:true" title="菜单区" style="width:250px;background-color: #fcfcfc; ">
        <div style="padding: 10px 20px 0px 20px;">
            <div style="margin-bottom: 0px;margin-top: -5px;display: none" id="treeOpt">全部
                <a href="#" onclick="expandAll()">打开</a>&nbsp;/&nbsp;
                <a href="#" onclick="collapseAll()">收缩</a>
            </div>
            <div id="treeLoading"></div>
            <ul  data-options="lines:true" id="menuTree" />
        </div>
    </div>
    <div data-options="region:'center',title:'操作区'">
        <div data-options="tools:'#tab-tools',fit:true,border:false,plain:false,region:'center'" class="easyui-tabs" id="tt">
            <div title="我的首页" style="padding:10px">

            </div>
        </div>
        <div id="tab-tools" style="padding: 4px 10px 5px 10px;">
            <a href="javascript:void(0)" onclick="closeAllTabs()">全部关闭</a>
        </div>
    </div>
    <div data-options="region:'south'" style="height:40px; background-color: #f2f2f2">
        <div style="padding-top: 10px; padding-left: 10px; text-align: center">@ 2016  ******</div>
    </div>
</div>
</body>
</html>

<div id="dlg4_myself_password" class="easyui-dialog" style="width:480px;height:260px;padding:5px 20px 0 20px;"
     closed="true"
     buttons="#dlg-buttons-myself-password" modal="true">
    <div id="dlg4_myself_password_tips">
    </div>
    <form id="fm4_myself_password" novalidate style="margin-bottom: 0px; margin-top: 10px">
        <table class="table" style="margin-bottom: 0px;">
            <tr>
                <td style="text-align: right">原密码：</td>
                <td><input name="oldPassword" type="password" id="oldPassword" class="easyui-textbox" required="true"></td>
            </tr>
            <tr>
                <td style="text-align: right">新密码：</td>
                <td><input name="password" type="password" id="newPassword" class="easyui-textbox" required="true">
                </td>
            </tr>
            <tr>
                <td style="text-align: right">确认新密码：</td>
                <td><input name="passwordConfirm" type="password" id="newPasswordConfirm" class="easyui-textbox" required="true" ></td>
            </tr>
        </table>
    </form>
</div>
<div id="dlg-buttons-myself-password">
    <a href="javascript:void(0)" class="easyui-linkbutton c6" onclick="saveMyselfPassword()" style="width:80px">提交</a>
    <a href="javascript:void(0)" class="easyui-linkbutton"
       onclick="javascript:$('#dlg4_myself_password').dialog('close')" style="width:80px">取消</a>
</div>