package com.sj.library.management.dao;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.entity.Resource;
import com.sj.library.management.to.ResourceTO;

import java.util.List;

public interface ResourceDao extends GenericDao<Resource, Long> {
    List<Resource> loadFromLevel12();

    List<ResourceTO> getByLevel(int level);

    List<ResourceTO> getResources(Integer type, String resourceName, PageRequest pr);

    List<ResourceTO> getResources(long roleId);

    long getResourcesCount(Integer type, String resourceName);

    Resource loadResourceByUrl(String url);

    Resource loadResourceName(String name);

    int getRoleResourceCountByresourceId(Long resourceId);

    void removeResource(long resourceId);
}
