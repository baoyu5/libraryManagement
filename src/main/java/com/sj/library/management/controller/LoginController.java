package com.sj.library.management.controller;

import com.sj.library.management.common.util.ImageUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;

@Controller
@RequestMapping(value = "/user")
public class LoginController extends BaseController {

    @RequestMapping(value = "/verification_code_generation", method = RequestMethod.GET)
    public void generateImage(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 生成验证码
        String code = ImageUtil.getVerificationCode(4);
        request.getSession(true).setAttribute("paVerificationCode", code);

        // 生成验证码图片
        BufferedImage bi = ImageUtil.generateImage(code, 100, 30);

        response.setContentType("image/jpg");
        ServletOutputStream out = response.getOutputStream();
        ImageOutputStream os = ImageIO.createImageOutputStream(out);
        ImageIO.write(bi, "jpg", os);
        out.flush();
    }

}
