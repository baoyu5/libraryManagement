package com.sj.library.management.common.exception;

public class ResourceNotExistsException extends AppException {
    public ResourceNotExistsException(String errCode) {
        super("资源不存在！", errCode);
    }

    public ResourceNotExistsException(Throwable cause, String errCode) {
        super("资源不存在！", cause, errCode);
    }
}
