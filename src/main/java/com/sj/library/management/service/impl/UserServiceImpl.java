package com.sj.library.management.service.impl;

import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.User;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.UserTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public long addUser(UserTO to) {
        User user = new User();

        user.setLoginName(to.getLoginName());
        user.setRealName(to.getRealName());
        user.setCardNo(to.getCardNo());
        user.setPhoneNo(to.getPhoneNo());
        user.setType(to.getType());
        user.setPassword(to.getPassword());
        user.setCode("");

        userDao.persist(user);
        return user.getId();
    }

    @Override
    public boolean isRoleInUse(long roleId) {
        return false;
    }
}
