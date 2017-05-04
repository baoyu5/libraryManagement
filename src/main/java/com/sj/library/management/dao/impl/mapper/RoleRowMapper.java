package com.sj.library.management.dao.impl.mapper;

import com.sj.library.management.to.RoleTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RoleRowMapper implements RowMapper<RoleTO> {

    @Override
    public RoleTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        RoleTO to = new RoleTO();

        to.setName(rs.getString("role_name"));
        to.setDescription(rs.getString("description"));
        to.setId(rs.getLong("id"));

        return to;
    }

}
