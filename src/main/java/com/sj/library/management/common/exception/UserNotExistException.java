package com.sj.library.management.common.exception;

public class UserNotExistException extends AppException {

    public UserNotExistException() {
        super("用户不存在");
    }

    public UserNotExistException(Throwable cause) {
        super("用户不存在", cause);
    }
}
