package com.sj.library.management.to;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

public class BookTO {
    private long id;

    private String code;
    @NotEmpty( message = "书籍名称不能为空")
    @Length(max = 255, message = "书籍名称长度0-255")
    private String bookName;
    @NotEmpty( message = "书籍作者不能为空")
    @Length(max = 255, message = "作者名称长度0-255")
    private String auth;
    @Length(max = 255, message = "位置信息长度0-255")
    private String position;
    private int status;
    private String statusDesc;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getStatusDesc() {
        return statusDesc;
    }

    public void setStatusDesc(String statusDesc) {
        this.statusDesc = statusDesc;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
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
