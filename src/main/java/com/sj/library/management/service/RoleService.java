package com.sj.library.management.service;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.common.pagination.PaginationResult;
import com.sj.library.management.to.ResourceTO;
import com.sj.library.management.to.RoleTO;

import java.util.List;

public interface RoleService {
    long addRole(RoleTO to);
    void deleteRole(long id);
    void updateRole(RoleTO to);
    void updateResources(long roleId, List<Long> resourceIds);
    List<ResourceTO> getResources(long roleId);
    PaginationResult getRole(PageRequest pr);
}
