package com.sj.library.management.service;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.entity.Resource;
import com.sj.library.management.to.ResourceTO;

import java.util.List;

public interface ResourceService {
    long addResource(ResourceTO to);

    PaginationResult getResources(Integer type, String resourceName, PageRequest pr);

    void updateResource(ResourceTO to);

    List<Resource> loadResourcesByUser(long userId);

    long deleteResource(long id);

    List<Resource> loadMenu();

    List<ResourceTO> getMenuByLevel(int level);
}
