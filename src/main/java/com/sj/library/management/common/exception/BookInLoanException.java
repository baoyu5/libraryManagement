package com.sj.library.management.common.exception;

public class BookInLoanException extends AppException {
    public BookInLoanException() {
        super("该书籍已被借出");
    }

    public BookInLoanException(Throwable cause) {
        super("该书籍已被借出", cause);
    }
}
