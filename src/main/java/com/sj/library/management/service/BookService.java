package com.sj.library.management.service;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.to.BookTO;

public interface BookService {
    PaginationResult loadBookBy(String code, String name, String auth, PageRequest pr);
    long addBook(BookTO to);
    void deleteBook(long id);
    void editBook(BookTO to);
}
