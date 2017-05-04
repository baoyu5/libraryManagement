package com.sj.library.management.dao;

import com.sj.library.management.entity.Resource;
import com.sj.library.management.to.ResourceTO;

import java.util.List;

public interface ResourceDao extends GenericDao<Resource, Long> {
    List<Resource> loadFromLevel12();

    List<ResourceTO> getByLevel(int level);

    // List<ResourceTO> getRoleResources(Integer type, String resourceName, PageRequest pr);

    List<ResourceTO> getRoleResources(long roleId);

    // long getResourcesCount(Integer type, String resourceName);

    // Resource loadResourceByUrl(String url);

    Resource loadResourceName(String name);

    int getRoleCountByResourceId(Long resourceId);

    void removeResource(long resourceId);
}
