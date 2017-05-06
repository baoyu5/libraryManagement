package com.sj.library.management.common.exception;

public class OldPasswordErrorException extends AppException {
    public OldPasswordErrorException() {
        super("原密码错误");
    }

    public OldPasswordErrorException(Throwable cause) {
        super("原密码错误", cause);
    }
}
