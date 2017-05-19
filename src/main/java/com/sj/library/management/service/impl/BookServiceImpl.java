package com.sj.library.management.service.impl;

import com.sj.library.management.common.constant.BookStatus;
import com.sj.library.management.common.exception.BookInLoanException;
import com.sj.library.management.common.exception.BookNotExistsException;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.dao.BookDao;
import com.sj.library.management.entity.Book;
import com.sj.library.management.service.BookService;
import com.sj.library.management.to.BookTO;
import me.anyteam.commons.id.IDFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.NoResultException;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class BookServiceImpl implements BookService {

    @Autowired
    private BookDao bookDao;
    @Autowired
    private IDFactory idFactory;

    @Override
    public PaginationResult loadBookBy(String code, String name, String auth, PageRequest pr) {
        PaginationResult result = new PaginationResult();
        Map<String, Object> params = new HashMap();

        if (StringUtils.hasText(code)) {
           params.put("code", code);
        }
        if (StringUtils.hasText(name)) {
            params.put("name", name);
        }
        if (StringUtils.hasText(auth)) {
            params.put("auth", auth);
        }

        result.setRows(bookDao.getBooksBy(params, pr));
        result.setTotal(bookDao.getBooksCountBy(params));
        return result;
    }

    @Override
    public long addBook(BookTO to) {
        Book book = new Book();

        book.setCode(idFactory.getNewID("B"));
        book.setName(to.getBookName());
        book.setAuth(to.getAuth());
        book.setPosition(to.getPosition());
        book.setStatus(BookStatus.RETURN);

        bookDao.persist(book);
        return book.getId();
    }

    @Override
    public void editBook(BookTO to) {
        Book book = loadBook(to.getId());

        book.setPosition(to.getPosition());
        book.setAuth(to.getAuth());
    }

    @Override
    public void deleteBook(long id) {
        Book book = loadBook(id);

        if (book.getStatus() == BookStatus.LOAN) {
            throw new BookInLoanException();
        }

        book.setDeleted(true);
    }

    private Book loadBook(long id) {
        Book book = null;
        try {
            book = bookDao.load(id);
        } catch (NoResultException e) {
        }

        if (book == null) {
            throw new BookNotExistsException();
        }
        return book;
    }
}
