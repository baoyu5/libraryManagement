package com.sj.library.management.dao;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.entity.Role;
import com.sj.library.management.to.RoleTO;

import java.util.List;

public interface RoleDao extends GenericDao<Role, Long> {
    List<RoleTO> getRoles(PageRequest pr);

    long getRolesCount();

    // List<Role> loadRolesForProcess();
}
