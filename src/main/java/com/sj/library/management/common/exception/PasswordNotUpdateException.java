package com.sj.library.management.common.exception;

public class PasswordNotUpdateException extends AppException {
    public PasswordNotUpdateException() {
        super("新密码不能与原密码相同");
    }

    public PasswordNotUpdateException(String message, Throwable cause) {
        super("新密码不能与原密码相同", cause);
    }
}
