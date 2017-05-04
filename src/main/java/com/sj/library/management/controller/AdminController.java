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

@Controller
@RequestMapping(value = "/admin")
public class AdminController extends BaseController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/admin_add", method = RequestMethod.POST)
    public void addAdmin(@Valid @RequestBody UserTO to) {
        to.setType(UserType.ADMIN);
        userService.addUser(to);
    }

    @RequestMapping(value = "/admin_delete", method = RequestMethod.POST)
    public void deleteAdmin(long id) {
        userService.deleteUser(id);
    }

    @RequestMapping(value = "/admin_edit", method = RequestMethod.POST)
    public void editAdmin(UserTO to) {
        userService.editUser(to);
    }

    @RequestMapping(value = "/admins", method = RequestMethod.GET)
    @ResponseBody
    public ResponseTO getAdmins(@RequestParam String loginName,
                                @RequestParam String realName,
                                @RequestParam String startTime,
                                @RequestParam String endTime,
                                @RequestParam int rows,
                                @RequestParam int page) {
        long startLongTime = -1, endLongTime = -1;
        if (StringUtils.hasText(startTime)) {
            startLongTime = DateUtil.parseDateToLongStrict(startTime, DateConstants.YYYYMMDD_DASH);
        }
        if (StringUtils.hasText(endTime)) {
            endLongTime = DateUtil.parseDateToLongStrict(endTime, DateConstants.YYYYMMDD_DASH);
        }
        return success(userService.getUsers(loginName, realName, UserType.ADMIN, startLongTime, endLongTime, page, rows));
    }
}
