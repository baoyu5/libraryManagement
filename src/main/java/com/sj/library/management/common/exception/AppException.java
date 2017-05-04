package com.sj.library.management.common.exception;

public class AppException extends RuntimeException {

    private String errCode;

    public AppException(String message, String errCode) {
        super(message);
        this.errCode = errCode;
    }

    public AppException(String message, Throwable cause, String errCode) {
        super(message, cause);
        this.errCode = errCode;
    }

    public AppException(Throwable cause, String errCode) {
        super(cause);
        this.errCode = errCode;
    }

    public String getErrCode() {
        return errCode;
    }

    public void setErrCode(String errCode) {
        this.errCode = errCode;
    }
}
