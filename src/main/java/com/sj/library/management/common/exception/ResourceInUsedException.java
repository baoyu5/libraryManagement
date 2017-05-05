package com.sj.library.management.common.exception;

public class ResourceInUsedException extends AppException {
    public ResourceInUsedException() {
        super("该资源已被使用");
    }

    public ResourceInUsedException(Throwable cause) {
        super("该资源已被使用", cause);
    }
}
