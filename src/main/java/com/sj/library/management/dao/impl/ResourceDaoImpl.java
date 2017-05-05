package com.sj.library.management.dao.impl;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.dao.ResourceDao;
import com.sj.library.management.dao.impl.mapper.ResourceRowMapper;
import com.sj.library.management.entity.Resource;
import com.sj.library.management.to.ResourceTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ResourceDaoImpl extends GenericDaoImpl<Resource, Long> implements ResourceDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    protected Class getDomainClass() {
        return Resource.class;
    }

    /**
     * 只返回一级菜单，二级菜单（level 1， 2）
     * @return
     */
    public List<Resource> loadFromLevel12() {
        String sql = "from Resource where deleted = false and level = 1";
        return query(sql).getResultList();
    }

    /**
     * 只返回 level 级的 resource，不返回下级资源
     *
     * @param level
     * @return
     */
    @Override
    public List<ResourceTO> getByLevel(int level) {
        String sql = "select * from t_resource where is_deleted = false and level = ? ";
        return jdbcTemplate.query(sql, new Object[]{level}, new ResourceRowMapper());
    }

     @Override
     public List<ResourceTO> getRoleResources(Integer type, String resourceName, PageRequest pr) {
         StringBuilder sql = new StringBuilder("select r.*, r2.resource_name as parentName, r2.id as parentId from t_resource r left join t_resource_mapping rm on r.id = rm.child_id left join t_resource r2 on rm.parent_id = r2.id where r.is_deleted = false ");
         List params = new ArrayList();
         if (type != null && type > 0) {
             sql.append("and r.level = ? ");
             params.add(type);
         }

         if (resourceName != null && !resourceName.equals("")) {
             sql.append("and r.resource_name like ? ");
             params.add("%" + resourceName + "%");
         }

         sql.append("order by parent_id asc ");

         sql.append("limit ?, ?");

         params.add((pr.getPageNumber() - 1) * pr.getPageRows());
         params.add(pr.getPageRows());
         return jdbcTemplate.query(sql.toString(), params.toArray(), new ResourceRowMapper());
     }

     @Override
     public long getResourcesCount(Integer type, String resourceName) {
         StringBuilder sql = new StringBuilder();
         List params = new ArrayList();
         sql.append("select count(1) from t_resource where is_deleted = false ");

         if (type != null && type != -1) {
             sql.append("and  level = ? ");
             params.add(type);
         }

         if (resourceName != null && !resourceName.equals("")) {
             sql.append("and resource_name like ? ");
             params.add("%" + resourceName + "%");
         }

         return jdbcTemplate.queryForObject(sql.toString(), params.toArray(), Long.class);
     }

    @Override
    public List<ResourceTO> getRoleResources(long roleId) {
        String sql = "select r.* from t_role_resource rr, t_resource r where r.is_deleted = false and rr.role_id = ? and rr.resource_id = r.id";

        return jdbcTemplate.query(sql, new Object[]{roleId}, new ResourceRowMapper());
    }

    // /**
    //  * 针对流程类 资源，别无他用，url 也就是流程编码， description == 'process'
    //  * url : 1000, 2000, 3000, 4000
    //  *
    //  * @param url
    //  * @return
    //  */
    // @Override
    // public Resource loadResourceByUrl(String url) {
    //     String ql = "from Resource where deleted = false and url = ? and description = 'process'";
    //     return query(ql, url).getSingleResult();
    // }

    @Override
    public Resource loadResourceName(String name) {
        String ql = "from Resource where deleted = false and name = ?";
        try {
            return query(ql, name).getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public int getRoleCountByResourceId(Long resourceId) {
        String sql = "select count(*) from t_role_resource where resource_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{resourceId}, Integer.class);
    }

    @Override
    public void deleteResourceMapping(long resourceId) {
        String sql = "delete from t_resource_mapping where child_id = ? ";
        jdbcTemplate.update(sql, resourceId);
    }

}
