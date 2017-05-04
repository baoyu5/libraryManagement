package com.sj.library.management.service.impl;

import com.sj.library.management.common.exception.UserExistsException;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.User;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.UserTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public long addUser(UserTO to) {

        if (userDao.loadUserBy(to.getLoginName()) != null) {
            throw new UserExistsException();
        }

        User user = new User();

        user.setLoginName(to.getLoginName());
        user.setRealName(to.getRealName());
        user.setPhoneNo(to.getPhoneNo());
        user.setType(to.getType());
        user.setPassword(to.getPassword());
        user.setEmail(to.getEmail());

        userDao.persist(user);
        return user.getId();
    }

    @Override
    public void deleteUser(long id) {
        User user = userDao.load(id);
        user.setDeleted(true);
        if (user.getRoles() != null) {
            user.getRoles().clear();
        }
    }

    @Override
    public void editUser(UserTO to) {
        User user = userDao.load(to.getId());

        user.setEmail(to.getEmail());
        user.setPhoneNo(to.getPhoneNo());
    }

    @Override
    public List<UserTO> getUsers(String loginName, String realName, int type, long startTime, long endTime, int page, int rows) {
        Map<String, Object> params = new HashMap();
        if (StringUtils.hasText(loginName)) {
            params.put("loginName", loginName);
        }
        if (StringUtils.hasText(realName)) {
            params.put("realName", realName);
        }
        params.put("type", type);
        if (startTime > 0) {
            params.put("startTime", startTime);
        }
        if (endTime > 0) {
            params.put("endTime", endTime);
        }
        PageRequest pr = PageRequest.newRequest(rows, page);

        return userDao.getUsers(params, pr);
    }

// @Override
    // public boolean isRoleInUse(long roleId) {
    //     return false;
    // }
}
