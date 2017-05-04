package com.sj.library.management.service.impl;

import com.sj.library.management.common.constant.ErrorCode;
import com.sj.library.management.common.exception.ResourceNotExistsException;
import com.sj.library.management.common.exception.UpdateException;
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
        Resource resource = null;
        try {
            resource = resourceDao.load(to.getId());
        } catch (NoResultException e) {
        }

        if (resource == null) {
            throw new ResourceNotExistsException(ErrorCode.ERROR_SERVICE);
        }

        resource.setName(to.getName());
        resource.setDescription(to.getDescription());
        resource.setUrl(to.getUrl());

        Resource newParent = resourceDao.load(to.getParentId());
        if (newParent == null && to.getLevel() != 0) {
            throw new UpdateException("新的父节点不存在！", ErrorCode.ERROR_SERVICE);
        }

        Resource oldParent = resourceDao.load(to.getOldParentId());
        if (oldParent == null && resource.getLevel() != 0) {
            throw new UpdateException("老的父节点不存在！", ErrorCode.ERROR_SERVICE);
        }

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
            throw new UpdateException("自己不能是自己的下级！", ErrorCode.ERROR_SERVICE);
        }

        Resource r = resourceDao.load(newParentId);
        if (resource.getChildren().contains(r)) {
            throw new UpdateException("自己不能是自己的下级的下级！", ErrorCode.ERROR_SERVICE);
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

        result.setRows(resourceDao.getResources(type, resourceName, pr));
        result.setTotal(resourceDao.getResourcesCount(type, resourceName));

        return result;
    }

    @Override
    public long addResource(ResourceTO to) {

        if (resourceDao.loadResourceName(to.getName()) != null) {
            throw new RuntimeException("资源名称重复");
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
        if (level == 0) {
            return new ArrayList<ResourceTO>();
        }

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
    public long deleteResource(long id) {
        Resource r = resourceDao.load(id);
        if (r.getChildren().size() != 0) {
            throw new RuntimeException("该资源含有子节点，不能删除");
        }
        if(resourceDao.getRoleResourceCountByresourceId(r.getId()) > 0) {
            throw new RuntimeException("该资源已被角色修改，无法删除！");
        }

        resourceDao.removeResource(id);
        //未该数据库级联删除所需要的代码
       /* }else{
            if(resourceDao.getResourceMappingCountByResourceId(r.getId()) > 0){
                resourceDao.removeResourceMappingByResourceId(r.getId());
            }
            resourceDao.remove(r);
        }*/
        return id;
    }
}
