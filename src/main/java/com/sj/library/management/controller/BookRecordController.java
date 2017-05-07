package com.sj.library.management.controller;

import com.sj.library.management.common.constant.DateConstants;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.util.DateUtil;
import com.sj.library.management.service.BookRecordService;
import com.sj.library.management.to.ResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/bookRecord")
public class BookRecordController extends BaseController {

    @Autowired
    private BookRecordService bookRecordService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public void addBookRecord(@RequestParam String bookCode, @RequestParam String userCode) {
        bookRecordService.addBookRecord(userCode, bookCode);
    }

    @RequestMapping(value = "/return_book", method = RequestMethod.POST)
    @ResponseBody
    public void returnBook(long bookRecordId) {
        bookRecordService.returnBook(bookRecordId);
    }

    @RequestMapping(value = "/book_records", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO getBookRecords(@RequestParam(required = false) String bookCode,
                                     @RequestParam(required = false) String bookName,
                                     @RequestParam(required = false) String userCode,
                                     @RequestParam(required = false) String userName,
                                     @RequestParam(required = false) String userRealName,
                                     @RequestParam(required = false) String startTime,
                                     @RequestParam(required = false) String endTime,
                                     @RequestParam int page,
                                     @RequestParam int rows) {
        long startLongTime = -1, endLongTime = -1;
        if (StringUtils.hasText(startTime)) {
            startLongTime = DateUtil.parseDateToLongStrict(startTime, DateConstants.YYYYMMDD_DASH);
        }
        if (StringUtils.hasText(endTime)) {
            endLongTime = DateUtil.parseDateToLongStrict(endTime, DateConstants.YYYYMMDD_DASH);
        }
        return success(
                bookRecordService.getBookRecordsBy(
                        bookCode, bookName, userCode, userName, userRealName,
                        startLongTime, endLongTime, PageRequest.newRequest(rows, page)
                )
        );
    }
}
