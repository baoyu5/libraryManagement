package com.sj.library.management.controller;

import com.sj.library.management.to.ResponseTO;
import com.sj.library.management.to.UserTO;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseController {

    /**
     * 根据登录用户，加载所属普通资源
     */
    @RequestMapping(value = "/granted_authorities", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO getGrantedAuthorities(UsernamePasswordAuthenticationToken token) {
        List<String> authorities = new ArrayList<String>();
        for (GrantedAuthority ga : token.getAuthorities()) {
            authorities.add(ga.getAuthority());
        }
        return success(authorities);
    }

}
