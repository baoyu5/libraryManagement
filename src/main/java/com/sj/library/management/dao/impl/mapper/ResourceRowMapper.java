package com.sj.library.management.dao.impl.mapper;

import com.sj.library.management.to.ResourceTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ResourceRowMapper implements RowMapper<ResourceTO> {
    @Override
    public ResourceTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        ResourceTO r = new ResourceTO();
        r.setLevel(rs.getInt("level"));
        r.setName(rs.getString("resource_name"));
        r.setUrl(rs.getString("url"));
        r.setDescription(rs.getString("description"));
        r.setId(rs.getLong("id"));
        try {
            r.setParentId(rs.getLong("parentId"));
            r.setParentName(rs.getString("parentName"));
        } catch (SQLException se) {
        }
        return r;
    }
}
