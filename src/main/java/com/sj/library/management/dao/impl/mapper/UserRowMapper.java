package com.sj.library.management.dao.impl.mapper;

import com.sj.library.management.common.constant.UserTypeFactory;
import com.sj.library.management.to.UserTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<UserTO> {

    @Override
    public UserTO mapRow(ResultSet resultSet, int i) throws SQLException {
        UserTO to = new UserTO();

        to.setId(resultSet.getLong("id"));
        to.setLoginName(resultSet.getString("login_name"));
        to.setRealName(resultSet.getString("real_name"));
        to.setPhoneNo(resultSet.getString("phone_no"));
        to.setEmail(resultSet.getString("email"));
        to.setType(resultSet.getInt("type"));
        to.setTypeDesc(UserTypeFactory.getType(resultSet.getInt("type")));
        to.setCode(resultSet.getString("code"));

        return to;
    }

}
