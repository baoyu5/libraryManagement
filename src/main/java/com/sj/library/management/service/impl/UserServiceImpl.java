package com.sj.library.management.service.impl;

import com.sj.library.management.common.constant.UserType;
import com.sj.library.management.common.exception.OldPasswordErrorException;
import com.sj.library.management.common.exception.UserExistsException;
import com.sj.library.management.common.exception.UserNotExistException;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.dao.RoleDao;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.Role;
import com.sj.library.management.entity.User;
import com.sj.library.management.service.UserService;
import com.sj.library.management.to.RoleTO;
import com.sj.library.management.to.UserTO;
import me.anyteam.commons.id.IDFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.NoResultException;
import java.util.ArrayList;
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
    @Autowired
    private IDFactory idFactory;

    @Value("${user.default.password}")
    private String userDefaultPassword;
    @Value("${user.role.id}")
    private long userRoleId;

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
        user.setPassword(userDefaultPassword);
        user.setEmail(to.getEmail());
        if (to.getType() == UserType.ADMIN) {
            user.setCode(idFactory.getNewID("A"));
        } else {
            user.setCode(idFactory.getNewID("U"));
        }

        List<Role> list = new ArrayList<>();
        list.add(roleDao.load(userRoleId));
        user.setRoles(list);

        userDao.persist(user);
        return user.getId();
    }

    @Override
    public void deleteUser(long id, int type) {
        User user = getUser(id, type);
        user.setDeleted(true);
        if (user.getRoles() != null) {
            user.getRoles().clear();
        }
    }



    @Override
    public void editUser(UserTO to, int type) {
        User user = getUser(to.getId(), type);

        user.setLoginName(to.getLoginName());
        user.setRealName(to.getRealName());
        user.setEmail(to.getEmail());
        user.setPhoneNo(to.getPhoneNo());
    }

    @Override
    public void userPasswordUpdate(long id, String oldPassword, String newPassword) {
        User user = getUser(id, null);

        if (user.getPassword().equals(oldPassword)) {
            user.setPassword(newPassword);
            return;
        }
        throw new OldPasswordErrorException();
    }

    @Override
    public void userPasswordReset(long adminId, int type) {
        User user = getUser(adminId, type);
        user.setPassword(userDefaultPassword);
    }

    @Override
    public void updateRoles(long adminId, List<Long> roleIds) {
        User user = getUser(adminId, UserType.ADMIN);

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
    public PaginationResult getUsers(String code, String loginName, String realName, int type, long startTime, long endTime, int page, int rows) {
        Map<String, Object> params = new HashMap();
        if (StringUtils.hasText(code)) {
            params.put("code", code);
        }
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

        PaginationResult result = new PaginationResult();

        result.setRows(userDao.getUsers(params, pr));
        result.setTotal(userDao.getUsersCount(params));

        return result;
    }

    private User getUser(long id, Integer type) {
        User user = null;
        try {
            user = userDao.load(id);
        } catch (NoResultException e) {
        }
        if (type != null && (user == null || user.getType() != type)) {
            throw new UserNotExistException();
        }
        return user;
    }
}
