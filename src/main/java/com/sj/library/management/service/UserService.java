package com.sj.library.management.service;

import com.sj.library.management.to.UserTO;

public interface UserService {
    long addUser(UserTO to);
    boolean isRoleInUse(long roleId);
}
