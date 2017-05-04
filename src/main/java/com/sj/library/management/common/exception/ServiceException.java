package com.sj.library.management.common.exception;

import com.sj.library.management.common.constant.ErrorCode;

public class ServiceException extends AppException {

    public ServiceException(String message, String errCode) {
        super(message, ErrorCode.ERROR_SERVICE);
    }

    public ServiceException(String message, Throwable cause) {
        super(message, cause, ErrorCode.ERROR_SERVICE);
    }

    public ServiceException(Throwable cause) {
        super(cause, ErrorCode.ERROR_SERVICE);
    }

}
