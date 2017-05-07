package com.sj.library.management.dao;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.entity.BookRecord;
import com.sj.library.management.to.BookRecordTO;

import java.util.List;
import java.util.Map;

public interface BookRecordDao extends GenericDao<BookRecord, Long> {
    List<BookRecordTO> getBookRecodesBy(Map<String, Object> params, PageRequest pr);
    long getBookRecordsCount(Map<String, Object> params);
}
