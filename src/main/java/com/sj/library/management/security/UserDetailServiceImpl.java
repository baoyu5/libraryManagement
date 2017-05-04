package com.sj.library.management.security;

import com.sj.library.management.common.constant.UserType;
import com.sj.library.management.common.constant.UserTypeFactory;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.Resource;
import com.sj.library.management.entity.Role;
import com.sj.library.management.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.NoResultException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Repository
@Transactional
public class UserDetailServiceImpl implements UserDetailsService {
    private static Logger LOG = LoggerFactory.getLogger(UserDetailServiceImpl.class);

    @Autowired
    private UserDao userDao;

    @Value("${sys.admin}")
    private String sysAdmin;
    @Value("${sys.admin.password}")
    private String sysAdminPassword;

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (sysAdmin.equals(username)) {
            UserDetailsImpl details = new UserDetailsImpl();

            details.setPassword("111111");
            details.setRealName("baoyu");
            details.setUsername("baoyu");
            details.setId(0);
            details.setType(UserTypeFactory.getType(UserType.ADMIN));

            // Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
            // details.setGrantedAuthoritySet(authorities);

            return details;
        }

        User user;

        try {
            user = userDao.loadUserBy(username);
            LOG.info("User{} login.", user);
        } catch (NoResultException e) {
            throw new UsernameNotFoundException(e.getMessage());
        }

        UserDetailsImpl details = new UserDetailsImpl();
        details.setPassword(user.getPassword());
        details.setRealName(user.getRealName());
        details.setUsername(user.getLoginName());
        details.setId(user.getId());

        Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();

        for (Role r : user.getRoles()) {
            for (Resource resource : r.getResources()) {
                if (!StringUtils.isEmpty(resource.getUrl())) {
                    authorities.add(GrantedAuthorityFactory.newAuthority(resource.getUrl()));
                }
            }
        }

        details.setGrantedAuthoritySet(authorities);

        return details;
    }

    private static class GrantedAuthorityFactory {
        private static Map<String, GrantedAuthority> authorityMap = new HashMap();

        public static synchronized GrantedAuthority newAuthority(String url) {
            GrantedAuthority ga = authorityMap.get(url);
            if (ga == null) {
                ga = new SimpleGrantedAuthority(url);
                authorityMap.put(url, ga);
            }
            return ga;
        }
    }
}

