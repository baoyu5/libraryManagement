package com.sj;

import com.sj.library.management.service.RoleService;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.RoleTO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/app-config.xml"})
public class RoleTest {

    @Autowired
    private RoleService roleService;

    private static Logger LOG = LoggerFactory.getLogger(RoleTest.class);

    @Test
    public void test1() {
        RoleTO to = new RoleTO();

        to.setName("权限管理员");
        to.setDescription("");

        roleService.addRole(to);
    }

    public void test2() {
    }
}
