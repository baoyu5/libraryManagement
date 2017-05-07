package com.sj.library.management.dao;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.entity.User;
import com.sj.library.management.to.RoleTO;
import com.sj.library.management.to.UserTO;

import java.util.List;
import java.util.Map;

public interface UserDao extends GenericDao<User, Long> {
    User loadUserBy(String name);
    List<UserTO> getUsers(Map<String, Object> params, PageRequest pr);
    long getUsersCount(Map<String, Object> params);
    long getUserCountByRoleId(long roleId);
    List<RoleTO> getAdminRoles(long adminId);
    User loadUserBy(String code, int type);
}
