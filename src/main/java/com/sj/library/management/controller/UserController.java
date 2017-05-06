package com.sj.library.management.controller;

import com.sj.library.management.common.constant.AdminConstants;
import com.sj.library.management.common.exception.PasswordNotNullException;
import com.sj.library.management.entity.Resource;
import com.sj.library.management.security.UserDetailsImpl;
import com.sj.library.management.service.ResourceService;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.ResponseTO;
import com.sj.library.management.to.UserTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

    @Autowired
    private ResourceService resourceService;
    @Autowired
    private UserService userService;

    /**
     * 根据登录用户，加载所属普通资源
     */
    @RequestMapping(value = "/granted_authorities", method = RequestMethod.GET)
    @ResponseBody
    public ResponseTO getGrantedAuthorities(UsernamePasswordAuthenticationToken token) {
        List<String> authorities = new ArrayList<String>();
        for (GrantedAuthority ga : token.getAuthorities()) {
            authorities.add(ga.getAuthority());
        }
        return success(authorities);
    }

    /**
     * 加载右侧菜单，树形结构
     */
    @RequestMapping(value = "/menu", method = RequestMethod.GET)
    @ResponseBody
    public List<Resource> loadMenu(UsernamePasswordAuthenticationToken token) {
        List<Resource> resources = new ArrayList();

        UserDetailsImpl userDetails = (UserDetailsImpl) token.getPrincipal();
        if (AdminConstants.LOGIN_NAME.equals(userDetails.getUsername())) {
            /**
             * 超级管理员加载所有菜单
             */
            resources = resourceService.loadMenu();
        } else {
            /**
             * 普通操作员
             */
            List<Resource> tmp = resourceService.loadResourcesByUser(userDetails.getId());
            for (Resource p : tmp) {
                if (p.getLevel() == 1) {
                    List<Resource> tobeRemoved = new ArrayList();
                    for (Resource c : p.getChildren()) {
                        if (!tmp.contains(c)) {
                            tobeRemoved.add(c);
                        }
                    }
                    p.getChildren().removeAll(tobeRemoved);
                    resources.add(p);
                }
            }
        }

        for (Resource r : resources) {
            List<Resource> children = r.getChildren();
            if (children != null) {
                for (Resource cr : children) {
                    cr.setChildren(null);
                }
            }
        }

        return resources;
    }

    @RequestMapping(value = "/self_password_update", method = RequestMethod.POST)
    @ResponseBody
    public void userSelfPasswordUpdate(@RequestParam String oldPassword,
                                       @RequestParam String newPassword,
                                       UsernamePasswordAuthenticationToken token) {
        UserDetailsImpl userDetails = (UserDetailsImpl)token.getPrincipal();
        if (!StringUtils.hasText(oldPassword) || !StringUtils.hasText(newPassword)) {
            throw new PasswordNotNullException();
        }
        userService.userPasswordUpdate(userDetails.getId(), oldPassword, newPassword);
    }
}
