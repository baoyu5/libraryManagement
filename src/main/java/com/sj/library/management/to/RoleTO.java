package com.sj.library.management.to;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

public class RoleTO {

    private long id;
    @NotEmpty( message = "角色名称不能为空")
    @Length(max = 255, message = "角色名称长度0-255")
    private String name;
    @Length(max = 255, message = "描述长度0-255")
    private String description;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
