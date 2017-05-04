package com.sj.library.management.dao.impl;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.dao.RoleDao;
import com.sj.library.management.dao.impl.mapper.RoleRowMapper;
import com.sj.library.management.entity.Role;
import com.sj.library.management.to.RoleTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoleDaoImpl extends GenericDaoImpl<Role, Long> implements RoleDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    protected Class<Role> getDomainClass() {
        return Role.class;
    }

    // 分页查询角色
    @Override
    public List<RoleTO> getRoles(PageRequest pr) {
        String sql = "select * from t_role where is_deleted = false limit ?, ?";
        return jdbcTemplate.query(
                sql,
                new Object[]{(pr.getPageNumber() - 1) * pr.getPageRows(), pr.getPageRows()},
                new RoleRowMapper()
        );
    }

    // 角色总数
    @Override
    public long getRolesCount() {
        String sql = "select count(1) from t_role";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public List<Role> loadRoles() {
        String ql = "from Role where deleted = false ";
        return query(ql).getResultList();
    }

// /**
    //  * 流程角色
    //  * P10001, P10002, ...
    //  * @return
    //  */
    // @Override
    // public List<Role> loadRolesForProcess() {
    //     String ql = "from Role where description like 'P_____'";
    //     return query(ql).getResultList();
    // }

}
