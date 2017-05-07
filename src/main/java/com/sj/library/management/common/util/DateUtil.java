package com.sj.library.management.common.util;

import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

    public static long parseDateToLong(String date, String pattern) {
        long longTime = -1;
        if (StringUtils.hasText(date)) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat(pattern);
                longTime = sdf.parse(date).getTime();
            } catch (ParseException e) {
                throw new RuntimeException("日期格式错误");
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
                throw new RuntimeException("日期格式错误");
            }
        }
        return longTime;
    }

    public static String parseLongToDateStr(Long time, String pattern) {
        if (time == null || time <= 0) {
            return "";
        }
        Date date = new Date(time);
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        return sdf.format(date);
    }
}
