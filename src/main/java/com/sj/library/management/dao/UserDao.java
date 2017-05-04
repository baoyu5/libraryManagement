package com.sj.library.management.dao;

import com.sj.library.management.entity.User;

public interface UserDao extends GenericDao<User, Long> {
    User loadUserBy(String name);
    long getUserCountByRoleId(long roleId);
}
