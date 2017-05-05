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

     @RequestMapping(value = "/resources", method = RequestMethod.GET)
     @ResponseBody
     public ResponseTO getResources(@RequestParam(required = false) Integer type,
                                     @RequestParam(required = false) String resourceName,
                                     @RequestParam int rows,
                                     @RequestParam int page) {
         return success(resourceService.getResources(type, resourceName, PageRequest.newRequest(rows, page)));
     }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public void addResource(@Valid @RequestBody ResourceTO to) {
        resourceService.addResource(to);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public void editResource(@Valid @RequestBody ResourceTO to) {
        resourceService.updateResource(to);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public void deleteResource(@RequestParam int id) {
        resourceService.deleteResource(id);
    }

    /**
     * 加载所有资源，树形结构
     */
    @RequestMapping(value = "/load_all_resources", method = RequestMethod.GET)
    @ResponseBody
    public List<Resource> loadAllResources() {
        return resourceService.loadMenu();
    }

     /**
      * 按照 level 加载资源，扁平结构
      */
     @RequestMapping(value = "/menu_by_level", method = RequestMethod.GET)
     @ResponseBody
     public List<ResourceTO> loadMenuByLevel(@RequestParam int level) {
         List<ResourceTO> resources = resourceService.getMenuByLevel(level);
         return resources;
     }
}
