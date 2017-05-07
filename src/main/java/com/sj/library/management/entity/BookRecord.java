package com.sj.library.management.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "t_book_record")
public class BookRecord extends BaseEntity {

    @Column(name = "book_code", nullable = false)
    private String bookCode;
    @Column(name = "book_name")
    private String bookName;
    @Column(name = "user_code", nullable = false)
    private String userCode;
    @Column(name = "user_name")
    private String userName;
    @Column(name = "user_real_name")
    private String userRealName;
    @Column(name = "return_time")
    private long returnTime;
    /**
     * 状态
     * 1:借出
     * 2:归还
     * @see com.sj.library.management.common.constant.BookRecordStatus
     */
    @Column(name = "status")
    private int status;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getBookCode() {
        return bookCode;
    }

    public void setBookCode(String bookCode) {
        this.bookCode = bookCode;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserRealName() {
        return userRealName;
    }

    public void setUserRealName(String userRealName) {
        this.userRealName = userRealName;
    }

    public long getReturnTime() {
        return returnTime;
    }

    public void setReturnTime(long returnTime) {
        this.returnTime = returnTime;
    }
}
