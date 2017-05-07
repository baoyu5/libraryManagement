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
    public void addRole(@Valid @RequestBody RoleTO to) {
        roleService.addRole(to);
    }

    @RequestMapping(value = "/roles", method = RequestMethod.GET)
    @ResponseBody
    public ResponseTO getRoles(@RequestParam(required = false) Integer rows,
                               @RequestParam(required = false) Integer page) {
        if (rows != null && page != null) {
            return success(roleService.getRole(PageRequest.newRequest(rows, page)));
        } else {
            return success(roleService.getAllRoles());
        }
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public void deleteRole(@RequestParam long id) {
        roleService.deleteRole(id);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public void updateRole(@Valid @RequestBody RoleTO to) {
        roleService.updateRole(to);
    }

    @RequestMapping(value = "/role_resources_update", method = RequestMethod.POST)
    @ResponseBody
    public void updateResources4Role(@RequestParam long roleId, @RequestParam String resourceIds) {
        List<Long> ids = new ArrayList<Long>();
        if (StringUtils.hasText(resourceIds)) {
            String[] resourcesIdsStr = resourceIds.split(",");
            for (String s: resourcesIdsStr) {
                ids.add(Long.valueOf(s));
            }
        }
        roleService.updateRoleResources(roleId, ids);
    }

    @RequestMapping(value = "/role_resources", method = RequestMethod.GET)
    @ResponseBody
    public ResponseTO getResources4Role(@RequestParam long roleId) {
        return success(roleService.getRoleResources(roleId));
    }
}
