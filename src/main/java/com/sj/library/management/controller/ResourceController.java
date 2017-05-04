package com.sj.library.management.controller;

import com.sj.library.management.common.constant.AdminConstants;
import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.entity.Resource;
import com.sj.library.management.security.UserDetailsImpl;
import com.sj.library.management.service.ResourceService;
import com.sj.library.management.to.ResourceTO;
import com.sj.library.management.to.ResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(value = "/resource")
public class ResourceController extends BaseController {

    @Autowired
    private ResourceService resourceService;

     @RequestMapping(value = "/get_resources")
     @ResponseBody
     public ResponseTO getResources(@RequestParam(required = false) Integer type,
                                     @RequestParam(required = false) String resourceName,
                                     @RequestParam int rows,
                                     @RequestParam int page) {
         return success(resourceService.getResources(type, resourceName, PageRequest.newRequest(rows, page)));
     }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO addResource(@Valid @RequestBody ResourceTO to) {
        resourceService.addResource(to);
        return success();
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO editResource(@Valid @RequestBody ResourceTO to) {
        resourceService.updateResource(to);
        return success(null);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO deleteResource(@RequestParam int id) {
        resourceService.deleteResource(id);
        return success();
    }

    /**
     * 加载右侧菜单，树形结构
     */
    @RequestMapping(value = "/menu", method = RequestMethod.POST)
    @ResponseBody
    public List<Resource> loadMenu(UsernamePasswordAuthenticationToken token) {
        List<Resource> resources = new ArrayList();

        UserDetailsImpl userDetails = (UserDetailsImpl) token.getPrincipal();
        if (AdminConstants.LOGIN_NAME.equals(userDetails.getUsername())) {
            /**
             * 超级管理员加载所有菜单
             */
            resources = resourceService.loadMenu();
        } else {
            /**
             * 普通操作员
             */
            List<Resource> tmp = resourceService.loadResourcesByUser(userDetails.getId());
            for (Resource p : tmp) {
                if (p.getLevel() == 1) {
                    List<Resource> tobeRemoved = new ArrayList();
                    for (Resource c : p.getChildren()) {
                        if (!tmp.contains(c)) {
                            tobeRemoved.add(c);
                        }
                    }
                    p.getChildren().removeAll(tobeRemoved);
                    resources.add(p);
                }
            }
        }

        for (Resource r : resources) {
            List<Resource> children = r.getChildren();
            if (children != null) {
                for (Resource cr : children) {
                    cr.setChildren(null);
                }
            }
        }

        return resources;
    }

    /**
     * 加载所有资源，树形结构
     */
    @RequestMapping(value = "/resources")
    @ResponseBody
    public List<Resource> loadAllResources() {
        return resourceService.loadMenu();
    }

     /**
      * 按照 level 加载资源，扁平结构
      */
     @RequestMapping(value = "/menu_by_level")
     @ResponseBody
     public List<ResourceTO> loadMenuByLevel(@RequestParam int level) {
         List<ResourceTO> resources = resourceService.getMenuByLevel(level);
         return resources;
     }
}
