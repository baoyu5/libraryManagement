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
@RequestMapping(value = "/member")
public class MemberController extends BaseController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public void addAdmin(@Valid @RequestBody UserTO to) {
        to.setType(UserType.USER);
        userService.addUser(to);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public void deleteAdmin(long id) {
        userService.deleteUser(id, UserType.USER);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public void editAdmin(@RequestBody UserTO to) {
        userService.editUser(to, UserType.USER);
    }

    @RequestMapping(value = "/members", method = RequestMethod.GET)
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
        return success(userService.getUsers(code, loginName, realName, UserType.USER, startLongTime, endLongTime, page, rows));
    }

    @RequestMapping(value = "/member_password_reset", method = RequestMethod.POST)
    @ResponseBody
    public void memberPasswordReset(@RequestParam long id) {
        userService.userPasswordReset(id, UserType.USER);
    }

}
