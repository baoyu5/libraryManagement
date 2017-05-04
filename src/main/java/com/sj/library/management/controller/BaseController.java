package com.sj.library.management.controller;

import com.sj.library.management.common.exception.AppException;
import com.sj.library.management.to.ResponseTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.util.StringUtils;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.persistence.PersistenceException;
import java.util.List;

public class BaseController {
    protected static Logger LOG = LoggerFactory.getLogger(BaseController.class);

    @Autowired
    private CommonsMultipartResolver commonsMultipartResolver;

    @ExceptionHandler(AppException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseTO handleException(AppException ae) {
        LOG.info("errorLog{}",ae);
        ResponseTO to = new ResponseTO();
        to.setStatus(1);
        if (StringUtils.isEmpty(ae.getMessage())) {
            // get error message by ae.getErrorCode
        } else {
            to.setErrorMessage(ae.getMessage());
        }

        return to;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseTO handleException(HttpMessageNotReadableException t) {
        ResponseTO to = new ResponseTO();
        to.setStatus(1);
        LOG.info("errorLog{}",t);
        to.setErrorMessage("数据格式错误！");
        return to;
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseTO handleException(MaxUploadSizeExceededException t) {
        ResponseTO to = new ResponseTO();
        to.setStatus(1);

        to.setErrorMessage("请求中的文件总大小不能超过 " + commonsMultipartResolver.getFileUpload().getSizeMax() + " 字节");
        LOG.info("errorLog{}",t);
        return to;
    }

    @ExceptionHandler(Throwable.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseTO handleException(Throwable t) {
        LOG.info("errorLog{}",t);
        ResponseTO to = new ResponseTO();
        to.setStatus(1);
        to.setErrorMessage(t.getClass().getName());
        to.setErrorMessage(t.getMessage());
        return to;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseTO handleException(MethodArgumentNotValidException t) {
        LOG.info("errorLog{}",t);
        ResponseTO to = new ResponseTO();
        to.setStatus(1);

        List<ObjectError> errorList = t.getBindingResult().getAllErrors();
        StringBuilder sb = new StringBuilder();
        int count = 1;
        for (ObjectError oe: errorList) {
            sb.append(count).append(". ")
              .append(oe.getDefaultMessage()).append("<br />");
            count++;
        }

        to.setErrorMessage(sb.toString());
        return to;
    }

    @ExceptionHandler(PersistenceException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseTO handleException(PersistenceException t) {
        LOG.info("errorLog{}",t);
        ResponseTO to = new ResponseTO();
        to.setStatus(1);
        to.setErrorMessage(t.getMessage());
        return to;
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseTO handleException(DataIntegrityViolationException t) {
        ResponseTO to = new ResponseTO();
        to.setStatus(1);
        to.setErrorMessage("数据库完整性异常，通常由字段值重复导致");
        LOG.info("errorLog{}",t);
        return to;
    }

    protected ResponseTO success(Object o) {
        ResponseTO to = new ResponseTO();
        to.setStatus(0);
        to.setData(o);
        return to;
    }

    protected ResponseTO success() {
        ResponseTO to = new ResponseTO();
        to.setStatus(0);
        return to;
    }

    protected ResponseTO error(String message) {
        LOG.info("errorLog{}",message);
        ResponseTO to = new ResponseTO();
        to.setStatus(1);
        to.setErrorMessage(message);
        return to;
    }
}
