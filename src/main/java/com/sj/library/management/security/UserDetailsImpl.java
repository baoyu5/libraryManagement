package com.sj.library.management.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

public class UserDetailsImpl implements UserDetails {
    private long id;
    private String userName;
    private String realName;
    private Set<GrantedAuthority> grantedAuthoritySet;
    private String password;
    private String type;
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public Set<GrantedAuthority> getGrantedAuthoritySet() {
        return grantedAuthoritySet;
    }

    public void setGrantedAuthoritySet(Set<GrantedAuthority> grantedAuthoritySet) {
        this.grantedAuthoritySet = grantedAuthoritySet;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return grantedAuthoritySet;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    public void setUsername(String loginName) {
        this.userName = loginName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
