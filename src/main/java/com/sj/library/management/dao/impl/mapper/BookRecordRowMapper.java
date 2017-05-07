package com.sj.library.management.dao.impl.mapper;

import com.sj.library.management.common.constant.BookRecordStatus;
import com.sj.library.management.common.constant.BookRecordStatusFactory;
import com.sj.library.management.common.constant.DateConstants;
import com.sj.library.management.common.util.DateUtil;
import com.sj.library.management.to.BookRecordTO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BookRecordRowMapper implements RowMapper<BookRecordTO> {
    @Override
    public BookRecordTO mapRow(ResultSet resultSet, int i) throws SQLException {
        BookRecordTO to = new BookRecordTO();

        to.setId(resultSet.getLong("id"));
        to.setBookCode(resultSet.getString("book_code"));
        to.setBookName(resultSet.getString("book_name"));
        to.setUserCode(resultSet.getString("user_code"));
        to.setUserName(resultSet.getString("user_name"));
        to.setUserRealName(resultSet.getString("user_real_name"));
        to.setCreateTime(
                DateUtil.parseLongToDateStr(
                        resultSet.getLong("create_time"), DateConstants.YYYYMMDD_DASH
                )
        );
        int status = resultSet.getInt("status");
        to.setStatus(status);
        if (status == BookRecordStatus.RETURN) {
            to.setReturnTime(
                    DateUtil.parseLongToDateStr(
                            resultSet.getLong("return_time"), DateConstants.YYYYMMDD_DASH
                    )
            );
        } else {
            to.setReturnTime("");
        }
        to.setStatusDesc(BookRecordStatusFactory.getStatus(status));

        return to;
    }
}
