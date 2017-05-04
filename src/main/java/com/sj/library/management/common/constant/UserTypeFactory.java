package com.sj.library.management.common.constant;

import java.util.HashMap;
import java.util.Map;

public class UserTypeFactory {

    private static Map<Integer, String> typeMap;

    /**
     * null if not exists
     * @return
     */
    public synchronized static String getType(int type) {
        if (typeMap == null) {
            init();
        }

        return typeMap.get(type);
    }

    private static void init() {
        typeMap = new HashMap();
        typeMap.put(UserType.USER, "会员");
        typeMap.put(UserType.ADMIN, "管理员");
    }
}
