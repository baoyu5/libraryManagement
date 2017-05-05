package com.sj.library.management.service.impl;

import com.sj.library.management.common.exception.RoleInUsedException;
import com.sj.library.management.common.exception.RoleNotExistsException;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.dao.ResourceDao;
import com.sj.library.management.dao.RoleDao;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.Role;
import com.sj.library.management.service.RoleService;
import com.sj.library.management.to.ResourceTO;
import com.sj.library.management.to.RoleTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.NoResultException;
import java.util.List;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleDao roleDao;
    @Autowired
    private ResourceDao resourceDao;
    @Autowired
    private UserDao userDao;

    @Override
    public long addRole(RoleTO to) {
        Role role = new Role();

        role.setDescription(to.getDescription());
        role.setName(to.getName());
        roleDao.persist(role);

        return role.getId();
    }

    @Override
    public void deleteRole(long id) {

        if (userDao.getUserCountByRoleId(id) != 0) {
            throw new RoleInUsedException();
        }

        Role role = getRole(id);

        role.setDeleted(true);
        // 将该角色的资源删除
        if (role.getResources() != null) {
            role.getResources().clear();
        }
    }

    @Override
    public void updateRoleResources(long roleId, List<Long> resourceIds) {
        Role r = getRole(roleId);
        r.getResources().clear();
        for(long resourceId: resourceIds) {
            r.getResources().add(resourceDao.load(resourceId));
        }
    }

    @Override
    public PaginationResult getRole(PageRequest pr) {
        PaginationResult result = new PaginationResult();

        result.setRows(roleDao.getRoles(pr));
        result.setTotal(roleDao.getRolesCount());

        return result;
    }

    @Override
    public void updateRole(RoleTO to) {
        Role role = getRole(to.getId());
        role.setDescription(to.getDescription());
        role.setName(to.getName());
    }

    @Override
    public List<ResourceTO> getRoleResources(long roleId) {
        List<ResourceTO> resourceTOs = resourceDao.getRoleResources(roleId);
        return resourceTOs;
    }

    private Role getRole(long id) {
        Role role = null;
        try {
            role = roleDao.load(id);
        } catch (NoResultException e) {
        }
        if (role == null) {
            throw new RoleNotExistsException();
        }
        return role;
    }
}
