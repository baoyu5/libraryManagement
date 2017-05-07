package com.sj.library.management.dao.impl;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.dao.BookDao;
import com.sj.library.management.dao.impl.mapper.BookRowMapper;
import com.sj.library.management.entity.Book;
import com.sj.library.management.to.BookTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class BookDaoImpl extends GenericDaoImpl<Book, Long> implements BookDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    protected Class<Book> getDomainClass() {
        return Book.class;
    }

    @Override
    public List<BookTO> getBooksBy(Map<String, Object> params, PageRequest pr) {
        StringBuffer sql = new StringBuffer("select id, code, name, auth, position " +
                "from t_book where id_deleted = false ");
        List paramList = new ArrayList();

        if (params.get("code") != null) {
            sql.append("and code = ? ");
            paramList.add(params.get("code"));
        }
        if (params.get("name") != null) {
            sql.append("and name like ? ");
            paramList.add("%" + params.get("name") + "%");
        }
        if (params.get("auth") != null) {
            sql.append("and auth like ? ");
            paramList.add("%" + params.get("auth") + "%");
        }
        sql.append("order by create_time desc ");

        if (pr != null) {
            sql.append("limit ?, ? ");
            paramList.add((pr.getPageNumber() - 1) * pr.getPageRows());
            paramList.add(pr.getPageRows());
        }
        return jdbcTemplate.query(sql.toString(), paramList.toArray(), new BookRowMapper());
    }

    @Override
    public long getBooksCountBy(Map<String, Object> params) {
        StringBuffer sql = new StringBuffer("select count(1) " +
                "from t_book where id_deleted = false ");
        List paramList = new ArrayList();

        if (params.get("code") != null) {
            sql.append("and code = ? ");
            paramList.add(params.get("code"));
        }
        if (params.get("name") != null) {
            sql.append("and name like ? ");
            paramList.add("%" + params.get("name") + "%");
        }
        if (params.get("auth") != null) {
            sql.append("and auth like ? ");
            paramList.add("%" + params.get("auth") + "%");
        }
        return jdbcTemplate.queryForObject(sql.toString(), paramList.toArray(), Long.class);
    }

    @Override
    public Book loadBookBy(String code) {
        String ql = "from Book where deleted = false and code = ? ";
        return query(ql, code).getSingleResult();
    }
}
