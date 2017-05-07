package com.sj.library.management.common.exception;

public class BookNotExistsException extends AppException {
    public BookNotExistsException() {
        super("该书籍不存在");
    }

    public BookNotExistsException(Throwable cause) {
        super("该书籍不存在", cause);
    }
}
