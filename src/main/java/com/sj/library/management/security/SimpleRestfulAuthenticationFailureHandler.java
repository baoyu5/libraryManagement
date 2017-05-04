package com.sj.library.management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sj.library.management.to.ResponseTO;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 登录失败
 */
@Component
public class SimpleRestfulAuthenticationFailureHandler implements AuthenticationFailureHandler {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void onAuthenticationFailure(HttpServletRequest httpServletRequest,
                                        HttpServletResponse httpResponse,
                                        AuthenticationException e) throws IOException, ServletException {
        httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());

        ResponseTO r = new ResponseTO();
        r.setStatus(1);
        r.setErrorMessage("用户名或密码不正确。");
        httpResponse.setContentType("application/json; charset=UTF-8");
        httpResponse.getWriter().write(mapper.writeValueAsString(r));
        httpResponse.flushBuffer();
    }
}
