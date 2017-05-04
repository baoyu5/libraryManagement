package com.sj.library.management.service;

import com.sj.library.management.to.UserTO;

import java.util.List;

public interface UserService {
    long addUser(UserTO to);
    void deleteUser(long id);
    void editUser(UserTO to);
    List<UserTO> getUsers(String loginName, String realName, int type, long startTime, long endTime, int page, int rows);
    // boolean isRoleInUse(long roleId);
}
