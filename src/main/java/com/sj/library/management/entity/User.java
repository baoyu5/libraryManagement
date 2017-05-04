package com.sj.library.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_user")
public class User extends BaseEntity {

    @Column(name = "login_name", unique = true, nullable = false, length = 12)
    private String loginName;

    @Column(name = "real_name")
    private String realName;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * 用户类型
     * @see com.sj.library.management.common.constant.UserType
     */
    @Column(name = "type")
    private int type;

    // 手机号
    @Column(name = "phone_no")
    private String phoneNo;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name="t_user_role",
            joinColumns = @JoinColumn(name="user_id", referencedColumnName="id"),
            inverseJoinColumns= @JoinColumn(name="role_id", referencedColumnName="id")
    )
    private List<Role> roles = new ArrayList<Role>();

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    @Override
    public String toString() {
        return "User{" +
                "loginName='" + loginName + '\'' +
                ", realName='" + realName + '\'' +
                ", password='" + password + '\'' +
                ", type=" + type +
                ", phoneNo='" + phoneNo + '\'' +
                ", roles=" + roles +
                '}';
    }
}
