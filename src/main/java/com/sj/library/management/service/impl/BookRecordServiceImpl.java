package com.sj.library.management.service.impl;

import com.sj.library.management.common.constant.BookRecordStatus;
import com.sj.library.management.common.constant.BookStatus;
import com.sj.library.management.common.constant.UserType;
import com.sj.library.management.common.exception.*;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.dao.BookDao;
import com.sj.library.management.dao.BookRecordDao;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.Book;
import com.sj.library.management.entity.BookRecord;
import com.sj.library.management.entity.User;
import com.sj.library.management.service.BookRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.NoResultException;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class BookRecordServiceImpl implements BookRecordService {

    @Autowired
    private BookRecordDao bookRecordDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private BookDao bookDao;

    @Override
    public long addBookRecord(String userCode, String bookCode) {
        User user = null;
        try {
            user = userDao.loadUserBy(userCode, UserType.USER);
        } catch (NoResultException e) {
        }
        if (user == null) {
            throw new UserNotExistException();
        }

        Book book = null;
        try {
            book = bookDao.loadBookBy(bookCode);
        } catch (NoResultException e) {
        }
        if (book == null) {
            throw new BookNotExistsException();
        }
        if (book.getStatus() == BookStatus.LOAN) {
            throw new BookInLoanException();
        }

        BookRecord bookRecord = new BookRecord();

        bookRecord.setBookCode(book.getCode());
        bookRecord.setBookName(book.getName());
        bookRecord.setUserCode(user.getCode());
        bookRecord.setUserName(user.getLoginName());
        bookRecord.setUserRealName(user.getRealName());
        bookRecord.setStatus(BookRecordStatus.LOAN);

        bookRecordDao.persist(bookRecord);

        book.setStatus(BookStatus.LOAN);

        return bookRecord.getId();
    }

    @Override
    public void returnBook(long bookRecordId) {
        BookRecord bookRecord = loadBookRecord(bookRecordId);

        if (bookRecord.getStatus() == BookRecordStatus.RETURN) {
            throw new BookIsReturnException();
        }

        bookRecord.setStatus(BookRecordStatus.RETURN);
        bookRecord.setReturnTime(System.currentTimeMillis());

        Book book = bookDao.loadBookBy(bookRecord.getBookCode());
        book.setStatus(BookStatus.RETURN);
    }

    @Override
    public PaginationResult getBookRecordsBy(
            String bookCode, String bookName, String userCode, String userName,
            String userRealName, long startTime, long endTime, PageRequest pr) {
        Map<String, Object> params = new HashMap();

        if (StringUtils.hasText(bookCode)) {
            params.put("bookCode", bookCode);
        }
        if (StringUtils.hasText(bookName)) {
            params.put("bookName", bookName);
        }
        if (StringUtils.hasText(userCode)) {
            params.put("userCode", userCode);
        }
        if (StringUtils.hasText(userName)) {
            params.put("userName", userName);
        }
        if (StringUtils.hasText(userRealName)) {
            params.put("userRealName", userRealName);
        }
        if (startTime > 0) {
            params.put("startTime", startTime);
        }
        if (endTime > 0) {
            params.put("endTime", endTime);
        }
        PaginationResult result = new PaginationResult();

        result.setRows(bookRecordDao.getBookRecodesBy(params, pr));
        result.setTotal(bookRecordDao.getBookRecordsCount(params));

        return result;
    }

    private BookRecord loadBookRecord(long id) {
        BookRecord bookRecord = null;
        try {
            bookRecord = bookRecordDao.load(id);
        } catch (NoResultException e) {
        }

        if (bookRecord == null) {
            throw new BookRecordNotExistsException();
        }
        return bookRecord;
    }
}
