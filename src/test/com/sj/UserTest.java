package com.sj;

import com.sj.library.management.common.constant.UserType;
import com.sj.library.management.entity.User;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.UserTO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/app-config.xml"})
public class UserTest {

    @Autowired
    private UserService userService;

    private static Logger LOG = LoggerFactory.getLogger(UserTest.class);

    @Test
    public void test1() {
        UserTO to = new UserTO();
        to.setLoginName("baoyu99");
        to.setPassword("111111");
        to.setType(UserType.ADMIN);
        to.setRealName("by");
        to.setPhoneNo("15757575757");
        userService.addUser(to);
    }

    public void test2() {

    }
}
