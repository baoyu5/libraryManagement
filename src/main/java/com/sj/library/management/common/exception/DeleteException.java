package com.sj.library.management.common.exception;

public class DeleteException extends AppException {

    public DeleteException(String message, String errCode) {
        super(message, errCode);
    }

    public DeleteException(String message, Throwable cause, String errCode) {
        super(message, cause, errCode);
    }

    public DeleteException(Throwable cause, String errCode) {
        super(cause, errCode);
    }

}
