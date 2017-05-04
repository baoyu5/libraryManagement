package com.sj.library.management.common.exception;

public class UpdateException extends AppException {
    public UpdateException(String message, String errCode) {
        super(message, errCode);
    }

    public UpdateException(String message, Throwable cause, String errCode) {
        super(message, cause, errCode);
    }

    public UpdateException(Throwable cause, String errCode) {
        super(cause, errCode);
    }
}
