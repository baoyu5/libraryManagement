<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.util.*"%>
<%@ page import="java.security.MessageDigest" %>
<%@ page import="java.security.NoSuchAlgorithmException" %>
<%@ page import="java.io.UnsupportedEncodingException" %>
<!DOCTYPE html>
<html>
<head>
</head>
<%!
    public static String generateParamStr(HashMap<String, String> params,String signKey) {
        // 取所有非空字段内容（除mac以外），塞入列表
        List<String> paramList = new ArrayList<String>();
        for (String key : params.keySet()) {
            if ("mac".equals(key)) {
                continue;
            }
            String val = params.get(key);

            paramList.add(key + "=" + val);

        }
        // 防护
        if (paramList.size() == 0) {
            return null;
        }
        // 对列表进行排序
        Collections.sort(paramList);
        // 以&符分割拼装成字符串
        StringBuilder sb = new StringBuilder();
        sb.append(paramList.get(0));
        for (int i = 1; i < paramList.size(); i++) {
            sb.append("&").append(paramList.get(i));
        }
        sb.append("&"+ signKey);
        return sb.toString();
    }

    /**
     * 将byte数组转换为16进制格式的字符串
     *
     * @param bytes
     * @return 16进制格式的字符串
     */
    public static String bytesToHexStr(byte[] bytes) {
        StringBuffer sb = new StringBuffer(bytes.length * 2);
        for (int i = 0; i < bytes.length; i++) {
            sb.append(hexChar[(bytes[i] & 0xf0) >>> 4]);
            sb.append(hexChar[bytes[i] & 0x0f]);
        }
        return sb.toString();
    }

    private static char[] hexChar = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

    /**
     * SHA摘要算法，输入内容将被UTF-8编码
     *
     * @param content
     * @return 内容摘要，40位16进制字符串
     */
    public static String encryptBySHA(String content) {
        if (content == null)
            return null;

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] output = md.digest(content.getBytes("UTF-8"));
            return bytesToHexStr(output);
        } catch (NoSuchAlgorithmException e) {

        } catch (UnsupportedEncodingException e) {

        }
        return null;
    }

    public static String generateMac(HashMap<String, String> params,String signKey) {
        String mac = generateParamStr(params,signKey);
        mac = encryptBySHA(mac);
        return mac;
    }
%>
<%!  String sign_key="DC5E77B8D9CE4C8CAC375F9C7A87E3FB";
    String mac;
    HashMap<String, String> params = new HashMap<String, String>();
    Date date = new Date();
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
    String timestamp = simpleDateFormat.format(date);
%>
<%
    params.put("timestamp", timestamp);
    params.put("appid", "Q0000735");
    params.put("ver", "01");
    params.put("order_desc", "11");

    params.put("service", "cib.epay.acquire.cashier.netPay");
    params.put("order_no", "753678958421457");
    params.put("order_amount", "5999.00");

    params.put("order_title", "11");
    params.put("cur", "CNY");
    params.put("sign_type", "SHA1");

    params.put("order_time", timestamp);
    mac = generateMac(params,sign_key);

    System.out.println("mac = " + mac);
    System.out.println("timestamp = " + timestamp);

%>

<form id="epayredirect" name="epayredirect"
      action="https://3gtest.cib.com.cn:37031/acquire/cashier.do" method="post">
    <input type="hidden" name="order_no" value="753678958421457"/>
    <input type="hidden" name="order_amount" value="5999.00"/>
    <input type="hidden" name="order_title" value="11"/>

    <input type="hidden" name="order_desc" value="11"/>
    <input type="hidden" name="appid" value="Q0000735"/>
    <input type="hidden" name="service" value="cib.epay.acquire.cashier.netPay"/>
    <input type="hidden" name="ver" value="01"/>

    <input type="hidden" name="sign_type" value="SHA1"/>
    <input type="hidden" name="cur" value="CNY"/>
    <input type="hidden" name="order_time" value="<%= timestamp%>"/>
    <input type="hidden" name="timestamp" value="<%= timestamp%>"/>
    <input type="hidden" name="mac" value="<%= mac %>"/>
</form>
<script>document.forms["epayredirect"].submit();</script>

<body>
</body>
</html>
