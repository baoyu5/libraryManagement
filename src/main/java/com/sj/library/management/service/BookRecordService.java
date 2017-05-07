package com.sj.library.management.service;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;

public interface BookRecordService {
    long addBookRecord(String userCode, String bookCode);
    void returnBook(long bookRecordId);
    PaginationResult getBookRecordsBy(
            String bookCode, String bookName, String userCode, String userName,
            String userRealName, long startTime, long endTime, PageRequest pr
    );
}
