package com.sj.library.management.common.exception;

public class RoleInUsedException extends AppException {
    public RoleInUsedException() {
        super("该角色在使用中");
    }

    public RoleInUsedException(Throwable cause) {
        super("该角色在使用中", cause);
    }
}
