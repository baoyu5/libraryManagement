package com.sj.library.management.service;

import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.to.RoleTO;
import com.sj.library.management.to.UserTO;

import java.util.List;

public interface UserService {
    long addUser(UserTO to);
    void deleteUser(long id, int type);
    void editUser(UserTO to, int type);
    void updateRoles(long adminId, List<Long> roleIds);
    void userPasswordUpdate(long id, String oldPassword, String newPassword);
    void userPasswordReset(long id, int type);
    List<RoleTO> getAdminRoles(long adminId);
    PaginationResult getUsers(String code, String loginName, String realName, int type, long startTime, long endTime, int page, int rows);
}
