package com.sj.library.management.to;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

public class ResourceTO {
    private long id;

    @NotEmpty(message = "资源名称不能为空")
    @Length(max = 255, message = "资源名称长度0-255")
    private String name;
    @Length(max = 255, message = "描述长度0-255")
    private String description;
    @Length(max = 255, message = "URL长度0-255")
    private String url;
    private int level;
    private long parentId ;
    private long oldParentId;
    private String parentName;

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public long getParentId() {
        return parentId;
    }

    public void setParentId(long parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public long getOldParentId() {
        return oldParentId;
    }

    public void setOldParentId(long oldParentId) {
        this.oldParentId = oldParentId;
    }
}
