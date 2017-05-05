package com.sj.library.management.common.exception;

public class PasswordNotNullException extends AppException {
    public PasswordNotNullException() {
        super("密码不能为空");
    }

    public PasswordNotNullException(Throwable cause) {
        super("密码不能为空", cause);
    }
}
