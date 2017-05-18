package com.sj.library.management.common.exception;

public class BookInUsedException extends AppException {
    public BookInUsedException() {
        super("该书籍已借出");
    }

    public BookInUsedException(Throwable cause) {
        super("该书籍已借出", cause);
    }
}
