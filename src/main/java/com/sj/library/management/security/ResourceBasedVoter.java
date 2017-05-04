package com.sj.library.management.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.FilterInvocation;

import java.util.Collection;
import java.util.Iterator;

public class ResourceBasedVoter implements AccessDecisionVoter<Object> {

    private static Logger LOG = LoggerFactory.getLogger(ResourceBasedVoter.class);

    @Value("${sys.admin}")
    public static String sysAdmin;

    public boolean supports(ConfigAttribute attribute) {
        return true;
    }

    public boolean supports(final Class<?> clazz) {
        return true;
    }

    @Override
    public int vote(final Authentication authentication, final Object object,
                    final Collection<ConfigAttribute> attributes) {
        /**
         * 没登录，拒绝
         */
        if (isAnonymous(authentication)) {
            return ACCESS_DENIED;
        }

        /**
         * 系统超级管理员，直接通过
         */
        if (isSysadmin(authentication)) {
            return ACCESS_GRANTED;
        }

        /**
         * 一般登录用户
         */
        Iterator<ConfigAttribute> it = attributes.iterator();
        ConfigAttribute attribute;
        while (it.hasNext()) {
            attribute = it.next();
            if (attribute.toString().equalsIgnoreCase("isAuthenticated")) {
                return ACCESS_GRANTED;
            }
        }

        Collection<? extends GrantedAuthority> grantedAuthorities = authentication.getAuthorities();
        String requestUrl = ((FilterInvocation)object).getRequest().getRequestURI();
        for (GrantedAuthority ga : grantedAuthorities) {
            if (requestUrl.equals(ga.getAuthority())) {
                return ACCESS_GRANTED;
            }
        }

        return ACCESS_DENIED;
    }

    private boolean isSysadmin(final Authentication authentication) {
        UserDetails userDetails = ((UserDetails)authentication.getPrincipal());
        return userDetails.getUsername().equals(sysAdmin);
    }

    private boolean isAnonymous(final Authentication authentication) {
        return authentication instanceof AnonymousAuthenticationToken;
    }
}
