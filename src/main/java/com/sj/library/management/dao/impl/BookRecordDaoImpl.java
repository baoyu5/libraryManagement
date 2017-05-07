package com.sj.library.management.dao.impl;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.dao.BookRecordDao;
import com.sj.library.management.dao.impl.mapper.BookRecordRowMapper;
import com.sj.library.management.entity.BookRecord;
import com.sj.library.management.to.BookRecordTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class BookRecordDaoImpl extends GenericDaoImpl<BookRecord, Long> implements BookRecordDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    protected Class<BookRecord> getDomainClass() {
        return BookRecord.class;
    }

    @Override
    public List<BookRecordTO> getBookRecodesBy(Map<String, Object> params, PageRequest pr) {
        StringBuffer sql = new StringBuffer("select * from t_book_record where id_deleted = false ");
        List paramList = new ArrayList();

        if (params.get("bookCode") != null) {
            sql.append("and book_code = ? ");
            paramList.add(params.get("bookCode"));
        }
        if (params.get("bookName") != null) {
            sql.append("and book_name like ? ");
            paramList.add("%" + params.get("bookName") + "%");
        }
        if (params.get("userCode") != null) {
            sql.append("and user_code = ? ");
            paramList.add(params.get("userCode"));
        }
        if (params.get("userName") != null) {
            sql.append("and user_name like ? ");
            paramList.add("%" + params.get("userName") + "%");
        }
        if (params.get("UserRealName") != null) {
            sql.append("and user_real_name like ? ");
            paramList.add("%" + params.get("userRealName") + "");
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

        return jdbcTemplate.query(sql.toString(), paramList.toArray(), new BookRecordRowMapper());
    }

    @Override
    public long getBookRecordsCount(Map<String, Object> params) {
        StringBuffer sql = new StringBuffer("select count(1) from t_book_record where id_deleted = false ");
        List paramList = new ArrayList();

        if (params.get("bookCode") != null) {
            sql.append("and book_code = ? ");
            paramList.add(params.get("bookCode"));
        }
        if (params.get("bookName") != null) {
            sql.append("and book_name like ? ");
            paramList.add("%" + params.get("bookName") + "%");
        }
        if (params.get("userCode") != null) {
            sql.append("and user_code = ? ");
            paramList.add(params.get("userCode"));
        }
        if (params.get("userName") != null) {
            sql.append("and user_name like ? ");
            paramList.add("%" + params.get("userName") + "%");
        }
        if (params.get("UserRealName") != null) {
            sql.append("and user_real_name like ? ");
            paramList.add("%" + params.get("userRealName") + "");
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
}
