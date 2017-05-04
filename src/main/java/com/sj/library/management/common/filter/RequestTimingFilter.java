package com.sj.library.management.common.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RequestTimingFilter extends OncePerRequestFilter {
    private static Logger LOG = LoggerFactory.getLogger(RequestTimingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long begin = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } catch (Throwable t) {
            LOG.error("Request({}) Error: {}", t.getMessage());
            throw t;
        } finally {
            LOG.info("Duration: {}ms for \"{}\"",
                    Long.valueOf(System.currentTimeMillis() - begin),
                    request.getRequestURI()
            );
        }
    }
}
