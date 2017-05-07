package com.sj.library.management.dao.impl.mapper;

import com.sj.library.management.common.constant.BookStatusFactory;
import com.sj.library.management.to.BookTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BookRowMapper implements RowMapper<BookTO> {
    @Override
    public BookTO mapRow(ResultSet resultSet, int i) throws SQLException {
        BookTO to = new BookTO();

        to.setId(resultSet.getLong("id"));
        to.setCode(resultSet.getString("code"));
        to.setBookName(resultSet.getString("name"));
        to.setAuth(resultSet.getString("auth"));
        to.setPosition(resultSet.getString("position"));
        to.setStatus(resultSet.getInt("status"));
        to.setStatusDesc(BookStatusFactory.getStatus(resultSet.getInt("status")));

        return to;
    }
}
