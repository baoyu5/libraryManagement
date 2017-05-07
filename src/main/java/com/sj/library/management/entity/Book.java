package com.sj.library.management.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_book")
public class Book extends BaseEntity {

    @Column(name = "code", nullable = false)
    private String code;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "auth")
    private String auth;
    @Column(name = "position")
    private String position;
    /**
     * 书籍状态
     * 1：已借出
     * 2：未借出
     * @see com.sj.library.management.common.constant.BookStatus
     */
    @Column(name = "status")
    private int status;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }
}
