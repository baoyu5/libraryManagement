package com.sj.library.management.dao.impl;

import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl extends GenericDaoImpl<User, Long> implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public User loadUserBy(String name) {
        return null;
    }

    @Override
    public long getUserCountByRoleId(long roleId) {
        String ql = "select count(1) from t_user_role where role_id = ? ";
        return jdbcTemplate.queryForObject(ql, new Object[]{roleId}, Long.class);
    }

    @Override
    protected Class<User> getDomainClass() {
        return User.class;
    }

}
