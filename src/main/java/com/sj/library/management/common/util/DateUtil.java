package com.sj.library.management.common.util;

import com.sj.library.management.common.exception.DateFormatException;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;

public class DateUtil {

    public static long parseDateToLong(String date, String pattern) {
        long longTime = -1;
        if (StringUtils.hasText(date)) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat(pattern);
                longTime = sdf.parse(date).getTime();
            } catch (ParseException e) {
                throw new DateFormatException(e);
            }
        }
        return longTime;
    }

    public static long parseDateToLongStrict(String date, String pattern) {
        long longTime = -1;
        if (StringUtils.hasText(date)) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat(pattern);
                sdf.setLenient(false);
                longTime = sdf.parse(date).getTime();
            } catch (ParseException e) {
                throw new DateFormatException(e);
            }
        }
        return longTime;
    }
}
