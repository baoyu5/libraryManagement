package com.sj.library.management.service.impl;

import com.sj.library.management.common.constant.UserType;
import com.sj.library.management.common.exception.PasswordNotUpdateException;
import com.sj.library.management.common.exception.UserExistsException;
import com.sj.library.management.common.exception.UserNotExistException;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.dao.RoleDao;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.User;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.RoleTO;
import com.sj.library.management.to.UserTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.NoResultException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private RoleDao roleDao;

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
    public void deleteAdmin(long id) {
        User user = getAdmin(id);
        user.setDeleted(true);
        if (user.getRoles() != null) {
            user.getRoles().clear();
        }
    }

    @Override
    public void editAdmin(UserTO to) {
        User user = getAdmin(to.getId());

        user.setEmail(to.getEmail());
        user.setPhoneNo(to.getPhoneNo());
    }

    @Override
    public void adminPasswordUpdate(long adminId, String password) {
        User user = getAdmin(adminId);

        if (user.getPassword().equals(password)) {
            throw new PasswordNotUpdateException();
        }
        user.setPassword(password);
    }

    @Override
    public void updateRoles(long adminId, List<Long> roleIds) {
        User user = getAdmin(adminId);

        user.getRoles().clear();

        if (roleIds == null || roleIds.isEmpty()) {
            return;
        }

        for(Long roleId: roleIds) {
            user.getRoles().add(roleDao.load(roleId));
        }
    }

    @Override
    public List<RoleTO> getAdminRoles(long adminId) {
        return userDao.getAdminRoles(adminId);
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

    private User getAdmin(long id) {
        User user = null;
        try {
            user = userDao.load(id);
        } catch (NoResultException e) {
        }
        if (user == null || user.getType() != UserType.ADMIN) {
            throw new UserNotExistException();
        }
        return user;
    }

    private User getUser(long id) {
        User user = null;
        try {
            user = userDao.load(id);
        } catch (NoResultException e) {
        }
        if (user == null || user.getType() != UserType.USER) {
            throw new UserNotExistException();
        }
        return user;
    }
}
