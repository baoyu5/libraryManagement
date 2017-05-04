package com.sj.library.management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sj.library.management.to.ResponseTO;
import org.springframework.util.StringUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CaptchaFilter implements Filter {

    private static final String VERIFICATION_CODE_KEY = "j_verification_code";

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String vcPresented = request.getParameter(VERIFICATION_CODE_KEY);
        Object vsInSession = ((HttpServletRequest) request).getSession(true).getAttribute("paVerificationCode");

        if(vsInSession != null && StringUtils.hasText(vcPresented)
                && vsInSession.toString().equalsIgnoreCase(vcPresented)) {
            chain.doFilter(request, response);
            return;
        } else {
            ResponseTO e = new ResponseTO();
            e.setErrorMessage("验证码不正确。");
            e.setStatus(1);

            HttpServletResponse r = (HttpServletResponse)response;
            r.setStatus(400);
            r.setContentType("application/json; charset=UTF-8");
            r.getWriter().write(mapper.writeValueAsString(e));
            r.flushBuffer();
            return;
        }
    }

    @Override
    public void destroy() {

    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }
}
