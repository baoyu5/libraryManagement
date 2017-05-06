package com.sj.library.management.to;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

public class UserTO {

    private long id;

    @NotEmpty(message = "登录名不能为空")
    @Length(min = 4, max = 10, message = "登录名称长度4-10")
    private String loginName;

    @NotEmpty(message = "真实姓名不能为空")
    private String realName;

//    @NotEmpty(message = "密码不能为空")
//    @Length(min = 6, max = 12, message = "密码长度6-12")
    private String password;

    private String passwordConfirm;
    private String phoneNo;
    private String Email;
    private String code;

    private int type;
    private String typeDesc;

    public String getPasswordConfirm() {
        return passwordConfirm;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setPasswordConfirm(String passwordConfirm) {
        this.passwordConfirm = passwordConfirm;
    }

    public String getTypeDesc() {
        return typeDesc;
    }

    public void setTypeDesc(String typeDesc) {
        this.typeDesc = typeDesc;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        this.Email = email;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
