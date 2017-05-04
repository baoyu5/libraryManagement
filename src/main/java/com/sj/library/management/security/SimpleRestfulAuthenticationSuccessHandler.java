package com.sj.library.management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sj.library.management.to.ResponseTO;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 登录成功
 */
@Component
public class SimpleRestfulAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpRequest,
                                        HttpServletResponse httpResponse,
                                        Authentication authentication) throws IOException, ServletException {
        httpResponse.addCookie(new Cookie("JSESSIONID", httpRequest.getSession().getId()));
        httpResponse.setStatus(HttpStatus.OK.value());

        ResponseTO r = new ResponseTO();
        r.setStatus(0);
        httpResponse.setContentType("application/json; charset=UTF-8");
        httpResponse.getWriter().write(mapper.writeValueAsString(r));
        httpResponse.flushBuffer();
    }
}
