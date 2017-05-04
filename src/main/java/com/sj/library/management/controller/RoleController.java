package com.sj.library.management.controller;

import com.sj.library.management.common.pagination.PageRequest;
import com.sj.library.management.service.RoleService;
import com.sj.library.management.to.ResponseTO;
import com.sj.library.management.to.RoleTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(value = "/role")
public class RoleController extends BaseController {

    @Autowired
    private RoleService roleService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO addRole(@Valid @RequestBody RoleTO to) {
        roleService.addRole(to);
        return success();
    }

    @RequestMapping(value = "/roles")
    @ResponseBody
    public ResponseTO getRoles(@RequestParam int rows, @RequestParam int page) {
        return success(roleService.getRole(PageRequest.newRequest(rows, page)));
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO deleteRole(@RequestParam long id) {
        roleService.deleteRole(id);
        return success();
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO updateRole(@Valid @RequestBody RoleTO to) {
        roleService.updateRole(to);
        return success(null);
    }

    @RequestMapping(value = "/role_resources_add", method = RequestMethod.POST)
    @ResponseBody
    public ResponseTO updateResources4Role(@RequestParam long roleId, @RequestParam String resourceIds) {
        List<Long> ids = new ArrayList<Long>();
        if (StringUtils.hasText(resourceIds)) {
            String[] resourcesIdsStr = resourceIds.split(",");
            for (String s: resourcesIdsStr) {
                ids.add(Long.valueOf(s));
            }
        }

        roleService.updateRoleResources(roleId, ids);
        return success(null);
    }

    @RequestMapping(value = "/role_resources")
    @ResponseBody
    public ResponseTO getResources4Role(@RequestParam long roleId) {
        return success(roleService.getRoleResources(roleId));
    }
}
