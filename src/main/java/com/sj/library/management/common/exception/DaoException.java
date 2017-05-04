package com.sj.library.management.common.exception;

import com.sj.library.management.common.constant.ErrorCode;

public class DaoException extends AppException {

    public DaoException(String message) {
        super(message, ErrorCode.ERROR_DAO);
    }

    public DaoException(String message, Throwable cause) {
        super(message, cause, ErrorCode.ERROR_DAO);
    }

    public DaoException(Throwable cause) {
        super(cause, ErrorCode.ERROR_DAO);
    }

}
