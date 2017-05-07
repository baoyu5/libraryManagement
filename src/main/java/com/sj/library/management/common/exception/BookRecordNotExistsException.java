package com.sj.library.management.common.exception;

public class BookRecordNotExistsException extends AppException {
    public BookRecordNotExistsException() {
        super("该借书记录不存在");
    }

    public BookRecordNotExistsException(Throwable cause) {
        super("该借书记录不存在", cause);
    }
}
