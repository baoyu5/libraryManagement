package com.sj.library.management.controller;

import com.sj.library.management.common.constant.DateConstants;
import com.sj.library.management.common.constant.UserType;
import com.sj.library.management.common.util.DateUtil;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.ResponseTO;
import com.sj.library.management.to.UserTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(value = "/admin")
public class AdminController extends BaseController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public void addAdmin(@Valid @RequestBody UserTO to) {
        to.setType(UserType.ADMIN);
        userService.addUser(to);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public void deleteAdmin(long id) {
        userService.deleteUser(id, UserType.ADMIN);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public void editAdmin(@RequestBody UserTO to) {
        userService.editUser(to, UserType.ADMIN);
    }

    @RequestMapping(value = "/admins", method = RequestMethod.GET)
    @ResponseBody
    public ResponseTO getAdmins(@RequestParam(required = false) String code,
                                @RequestParam(required = false) String loginName,
                                @RequestParam(required = false) String realName,
                                @RequestParam(required = false) String startTime,
                                @RequestParam(required = false) String endTime,
                                @RequestParam int rows,
                                @RequestParam int page) {
        long startLongTime = -1, endLongTime = -1;
        if (StringUtils.hasText(startTime)) {
            startLongTime = DateUtil.parseDateToLongStrict(startTime, DateConstants.YYYYMMDD_DASH);
        }
        if (StringUtils.hasText(endTime)) {
            endLongTime = DateUtil.parseDateToLongStrict(endTime, DateConstants.YYYYMMDD_DASH);
        }
        return success(userService.getUsers(code, loginName, realName, UserType.ADMIN, startLongTime, endLongTime, page, rows));
    }

    @RequestMapping(value = "/admin_roles_update", method = RequestMethod.POST)
    @ResponseBody
    public void adminRolesUpdate(@RequestParam long adminId, @RequestParam String rolesIds) {
        List<Long> ids = new ArrayList<Long>();
        if (!StringUtils.isEmpty(rolesIds)) {
            String[] roleIdStrs = rolesIds.split(",");
            for (String s: roleIdStrs) {
                ids.add(Long.valueOf(s));
            }
        }
        userService.updateRoles(adminId, ids);
    }

    @RequestMapping(value = "/admin_password_reset", method = RequestMethod.POST)
    @ResponseBody
    public void adminPasswordUpdate(@RequestParam long adminId) {
        userService.userPasswordReset(adminId, UserType.ADMIN);
    }

    @RequestMapping(value = "/admin_roles", method = RequestMethod.GET)
    @ResponseBody
    public ResponseTO adminRoles(@RequestParam long adminId) {
        return success(userService.getAdminRoles(adminId));
    }
}
