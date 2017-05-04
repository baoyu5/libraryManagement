package com.sj.library.management.common.exception;

import com.sj.library.management.common.constant.ErrorCode;

public class ControllerException extends AppException {

    public ControllerException(String message) {
        super(message, ErrorCode.ERROR_CONTROLLER);
    }

    public ControllerException(String message, Throwable cause) {
        super(message, cause, ErrorCode.ERROR_CONTROLLER);
    }

    public ControllerException(Throwable cause) {
        super(cause, ErrorCode.ERROR_CONTROLLER);
    }

}
