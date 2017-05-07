package com.sj.library.management.dao;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.entity.Book;
import com.sj.library.management.to.BookTO;

import java.util.List;
import java.util.Map;

public interface BookDao extends GenericDao<Book, Long> {
    List<BookTO> getBooksBy(Map<String, Object> params, PageRequest pr);
    long getBooksCountBy(Map<String, Object> params);
    Book loadBookBy(String code);
}
