package com.sj.library.management.common.exception;

public class RoleNotExistsException extends AppException {
    public RoleNotExistsException() {
        super("角色不存在！");
    }

    public RoleNotExistsException(Throwable cause) {
        super("角色不存在！", cause);
    }
}
