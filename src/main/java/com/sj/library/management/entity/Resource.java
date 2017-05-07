package com.sj.library.management.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 资源/权限
 */
@Entity
@Table(name = "t_resource")
public class Resource extends BaseEntity {

    @JsonProperty("text")
    @Column(name = "resource_name", nullable = false)
    private String name;

    @Column(name = "url", unique = true)
    private String url;

    @Column(name = "description")
    private String description;

    /**
     * 1：一级菜单
     * 2：二级菜单
     * 3：普通资源
     */
    @Column(name = "level")
    private int level;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name="t_resource_mapping",
            joinColumns = @JoinColumn(name="parent_id", referencedColumnName="id"),
            inverseJoinColumns= @JoinColumn(name="child_id", referencedColumnName="id")
    )
    private List<Resource> children = new ArrayList<Resource>();

    public List<Resource> getChildren() {
        return children;
    }

    public void setChildren(List<Resource> children) {
        this.children = children;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    @Transient
    public Map<String, String> getAttributes() {
        Map<String, String> attrMap = new HashMap<String, String>();
        attrMap.put("url", getUrl());
        attrMap.put("level", getLevel() + "");

        return attrMap;
    }
}
