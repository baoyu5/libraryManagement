package com.sj.library.management.common.exception;

public class UserExistsException extends AppException {
    public UserExistsException() {
        super("用户名已存在");
    }

    public UserExistsException(Throwable cause) {
        super("用户名已存在", cause);
    }
}
