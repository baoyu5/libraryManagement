package com.sj.library.management.common.exception;

public class ResourceExistsException extends AppException {
    public ResourceExistsException() {
        super("该资源已存在");
    }

    public ResourceExistsException(Throwable cause) {
        super("该资源已存在", cause);
    }
}
