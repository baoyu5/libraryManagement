package com.sj.library.management.common.constant;

import java.util.HashMap;
import java.util.Map;

public class BookRecordStatusFactory {

    private static Map<Integer, String> statusMap;

    /**
     * null if not exists
     * @return
     */
    public synchronized static String getStatus(int status) {
        if (statusMap == null) {
            init();
        }

        return statusMap.get(status);
    }

    private static void init() {
        statusMap = new HashMap();
        statusMap.put(BookRecordStatus.LOAN, "借出");
        statusMap.put(BookRecordStatus.RETURN, "已归还");
    }
}
