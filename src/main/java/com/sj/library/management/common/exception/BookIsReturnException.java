package com.sj.library.management.common.exception;

public class BookIsReturnException extends AppException {
    public BookIsReturnException() {
        super("该书籍已归还");
    }

    public BookIsReturnException(Throwable cause) {
        super("该书籍已归还", cause);
    }
}
