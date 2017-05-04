package com.sj.library.management.common.exception;

public class DateFormatException extends AppException {

    public DateFormatException() {
        super("日期格式错误");
    }

    public DateFormatException(Throwable cause) {
        super("日期格式错误", cause);
    }

}
