package com.sj.library.management.dao.impl;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.dao.impl.mapper.RoleRowMapper;
import com.sj.library.management.dao.impl.mapper.UserRowMapper;
import com.sj.library.management.entity.User;
import com.sj.library.management.to.RoleTO;
import com.sj.library.management.to.UserTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.persistence.NoResultException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class UserDaoImpl extends GenericDaoImpl<User, Long> implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public User loadUserBy(String name) {
        String ql = "from User where loginName = ?1";
        try {
            return query(ql, name).getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public long getUserCountByRoleId(long roleId) {
        String ql = "select count(1) from t_user_role where role_id = ? ";
        return jdbcTemplate.queryForObject(ql, new Object[]{roleId}, Long.class);
    }

    @Override
    public List<UserTO> getUsers(Map<String, Object> params, PageRequest pr) {
        StringBuilder sql = new StringBuilder("select id, login_name, real_name, phone_no, " +
                "email, type, code " +
                "from t_user where is_deleted = false ");
        List paramList = new ArrayList();
        if (params.get("code") != null) {
            sql.append("and code = ? ");
            paramList.add(params.get("code"));
        }
        if (params.get("loginName") != null) {
            sql.append("and login_name like ? ");
            paramList.add("%" + params.get("loginName") + "%");
        }
        if (params.get("realName") != null) {
            sql.append("and real_name like ? ");
            paramList.add("%" + params.get("realName") + "%");
        }
        if (params.get("startTime") != null) {
            sql.append("and create_time >= ? ");
            paramList.add(params.get("startTime"));
        }
        if (params.get("endTime") != null) {
            sql.append("and create_time < ? ");
            paramList.add(params.get("endTime"));
        }
        sql.append("order by create_time desc ");
        if (pr != null) {
            sql.append("limit ?, ? ");
            paramList.add((pr.getPageNumber() - 1) * pr.getPageRows());
            paramList.add(pr.getPageRows());
        }
        return jdbcTemplate.query(sql.toString(), paramList.toArray(), new UserRowMapper());
    }

    @Override
    public long getUsersCount(Map<String, Object> params) {
        StringBuilder sql = new StringBuilder("select count(1) from t_user where is_deleted = false ");
        List paramList = new ArrayList();
        if (params.get("code") != null) {
            sql.append("and code = ? ");
            paramList.add(params.get("code"));
        }
        if (params.get("loginName") != null) {
            sql.append("and login_name like ? ");
            paramList.add("%" + params.get("loginName") + "%");
        }
        if (params.get("realName") != null) {
            sql.append("and real_name like ? ");
            paramList.add("%" + params.get("realName") + "%");
        }
        if (params.get("startTime") != null) {
            sql.append("and create_time >= ? ");
            paramList.add(params.get("startTime"));
        }
        if (params.get("endTime") != null) {
            sql.append("and create_time < ? ");
            paramList.add(params.get("endTime"));
        }
        return jdbcTemplate.queryForObject(sql.toString(), paramList.toArray(), Long.class);
    }

    @Override
    public List<RoleTO> getAdminRoles(long adminId) {
        String sql = "select r.id, r.role_name, r.description from t_role r, t_user_role tur where tur.user_id = ? and tur.role_id = r.id order by r.id asc";
        return jdbcTemplate.query(sql, new Object[]{adminId}, new RoleRowMapper());
    }

    @Override
    public User loadUserBy(String code, int type) {
        String ql = "from User where deleted = false and code = ?1 and type = ?2 ";
        return query(ql, code, type).getSingleResult();
    }

    @Override
    protected Class<User> getDomainClass() {
        return User.class;
    }

}
