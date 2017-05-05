package com.sj.library.management.service;

import com.sj.library.management.to.RoleTO;
import com.sj.library.management.to.UserTO;

import java.util.List;

public interface UserService {
    long addUser(UserTO to);
    void deleteAdmin(long id);
    void editAdmin(UserTO to);
    void updateRoles(long adminId, List<Long> roleIds);
    void adminPasswordUpdate(long adminId, String password);
    List<RoleTO> getAdminRoles(long adminId);
    List<UserTO> getUsers(String loginName, String realName, int type, long startTime, long endTime, int page, int rows);
    // boolean isRoleInUse(long roleId);
}
