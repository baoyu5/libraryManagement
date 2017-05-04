package com.sj.library.management.common.exception;

public class ResourceNotExistsException extends AppException {
    public ResourceNotExistsException() {
        super("资源不存在！");
    }

    public ResourceNotExistsException(Throwable cause) {
        super("资源不存在！", cause);
    }
}
