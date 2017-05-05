package com.sj.library.management.service.impl;

import com.sj.library.management.common.exception.*;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.dao.ResourceDao;
import com.sj.library.management.dao.UserDao;
import com.sj.library.management.entity.Resource;
import com.sj.library.management.entity.Role;
import com.sj.library.management.entity.User;
import com.sj.library.management.service.ResourceService;
import com.sj.library.management.to.ResourceTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.NoResultException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ResourceServiceImpl implements ResourceService {
    @Autowired
    private ResourceDao resourceDao;
    @Autowired
    private UserDao userDao;

    @Override
    public void updateResource(ResourceTO to) {
        Resource resource = loadResource(to.getId());

        resource.setName(to.getName());
        resource.setDescription(to.getDescription());
        resource.setUrl(to.getUrl());

        Resource newParent = loadResource(to.getParentId());

        Resource oldParent = loadResource(to.getOldParentId());

        cycleCheck(resource, to.getParentId());

        if (oldParent != null) {
            oldParent.getChildren().remove(resource);
        }

        if (newParent != null) {
            newParent.getChildren().add(resource);
        }

        if (to.getLevel() != resource.getLevel()) {
            changeLevel(resource, to.getLevel());
        }
    }

    private void cycleCheck(Resource resource, long newParentId) {
        if (resource.getId() == newParentId) {
            throw new AppException("自己不能是自己的下级");
        }

        Resource r = resourceDao.load(newParentId);
        if (resource.getChildren().contains(r)) {
            throw new AppException("自己不能是自己的下级的下级");
        }
    }

    private void changeLevel(Resource r, int level) {
        r.setLevel(level);
        List<Resource> list = r.getChildren();
        if (list != null) {
            for (Resource resource : list) {
                changeLevel(resource, level + 1);
            }
        }
    }

     @Override
     public PaginationResult getResources(Integer type, String resourceName, PageRequest pr) {

         PaginationResult result = new PaginationResult();

         result.setRows(resourceDao.getRoleResources(type, resourceName, pr));
         result.setTotal(resourceDao.getResourcesCount(type, resourceName));

         return result;
     }

    @Override
    public long addResource(ResourceTO to) {

        if (resourceDao.loadResourceName(to.getName()) != null) {
            throw new ResourceExistsException();
        }

        Resource resource = new Resource();
        resource.setDescription(to.getDescription());
        resource.setName(to.getName());
        resource.setUrl(to.getUrl());


        if (to.getParentId() != -1 || to.getParentId() != 0) {
            Resource parent = resourceDao.load(to.getParentId());
            if (parent != null) {
                parent.getChildren().add(resource);
                resource.setLevel(parent.getLevel() + 1);
            }
        } else {
            resource.setLevel(1);
        }

        resourceDao.persist(resource);
        return resource.getId();
    }

    @Override
    public List<ResourceTO> getMenuByLevel(int level) {
        return resourceDao.getByLevel(level - 1);
    }

    @Override
    public List<Resource> loadMenu() {
        List<Resource> resources = resourceDao.loadFromLevel12();
        return resources;
    }

    /**
     * 加载会员所属所有资源
     */
    @Override
    public List<Resource> loadResourcesByUser(long userId) {
        User user = userDao.load(userId);

        List<Resource> resources = new ArrayList();
        for (Role role : user.getRoles()) {
            for (Resource r : role.getResources()) {
                // 不同角色下可能有重复资源，去除重复资源
                if (!resources.contains(r)) {
                    resources.add(r);
                }
            }
        }

        return resources;
    }

    @Override
    public void deleteResource(long id) {
        Resource r = resourceDao.load(id);
        if ((r.getChildren() != null && r.getChildren().size() != 0)
                || resourceDao.getRoleCountByResourceId(r.getId()) > 0) {
            throw new ResourceInUsedException();
        }
        r.setDeleted(true);

        // resourceDao.deleteResourceMapping(id);
    }

    private Resource loadResource(long id) {
        Resource resource = null;
        try {
            resource = resourceDao.load(id);
        } catch (NoResultException e) {
        }
        if (resource == null) {
            throw new ResourceNotExistsException();
        }
        return resource;
    }
}
