package com.sj.library.management.common.exception;

public class RoleNotExistsException extends AppException {
    public RoleNotExistsException(String errCode) {
        super("角色不存在！", errCode);
    }

    public RoleNotExistsException(Throwable cause, String errCode) {
        super("角色不存在！", cause, errCode);
    }
}
