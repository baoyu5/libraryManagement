package com.sj;

import com.sj.library.management.service.ResourceService;
import com.sj.library.management.to.ResourceTO;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/app-config.xml"})
public class ResourceTest {

    @Autowired
    private ResourceService resourceService;

    @Test
    public void test1() {
        ResourceTO to = new ResourceTO();

        to.setName("角色管理");
        to.setDescription("角色管理");
        to.setUrl("pages/auth/roles.jsp");
        to.setLevel(2);
        to.setParentId(11);

        resourceService.addResource(to);
    }

}
