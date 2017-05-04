package com.sj.library.management.common.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

public class ImageUtil {

    private static Random random = new Random(System.currentTimeMillis());

    private static String alpha = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    // 验证码
    public static String getVerificationCode(int count) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++) {
            sb.append(alpha.charAt(random.nextInt(alpha.length())));
        }
        return sb.toString();
    }

    // 验证码图片
    public static BufferedImage generateImage(String vs, int width, int height) throws IOException {

        Color reverse = getRandomColor();
        Color color = getReverseColor(reverse);

        BufferedImage bi = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        Graphics2D g = bi.createGraphics();
        // 设置字体
        g.setFont(new Font(Font.SANS_SERIF, Font.ITALIC, height - 4));
        g.setColor(color);
        // 设置背景
        g.fillRect(0, 0, width, height);
        g.setColor(reverse);
        // 绘制验证码
        g.drawString(vs, 16, 20);

        // 绘制干扰线
        Random random = new Random();
        // 设置线条的颜色
        g.setColor(getRandomColor());
        for (int i = 0; i < 25; i++) {
            int x = random.nextInt(width - 1);
            int y = random.nextInt(height - 1);
            int xl = random.nextInt(6) + 1;
            int yl = random.nextInt(12) + 1;
            g.drawLine(x, y, x + xl + 40, y + yl + 20);
        }

        // 添加噪点
        float yawpRate = 0.08f;// 噪声率
        int area = (int) (yawpRate * width * height);
        for (int i = 0; i < area; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            int rgb = getRandomIntColor();
            bi.setRGB(x, y, rgb);
        }

        return bi;
    }

    private static Color getRandomColor() {
        return new Color(random.nextInt(100), random.nextInt(100), random.nextInt(100));
    }

    private static Color getReverseColor(Color c) {
        return new Color(255 - c.getRed(), 255 - c.getGreen(), 255 - c.getBlue());
    }

    private static int getRandomIntColor() {
        int[] rgb = getRandomRgb();
        int color = 0;
        for (int c : rgb) {
            color = color << 8;
            color = color | c;
        }
        return color;
    }

    private static int[] getRandomRgb() {
        int[] rgb = new int[3];
        for (int i = 0; i < 3; i++) {
            rgb[i] = random.nextInt(255);
        }
        return rgb;
    }
}
