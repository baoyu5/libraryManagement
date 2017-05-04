package com.sj.library.management.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_role")
public class Role extends BaseEntity {

    @Column(name = "role_name", nullable = false)
    private String name;
    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(
        name="t_role_resource",
        joinColumns=
        @JoinColumn(name="role_id", referencedColumnName="id"),
        inverseJoinColumns=
        @JoinColumn(name="resource_id", referencedColumnName="id")
    )
    private List<Resource> resources = new ArrayList<Resource>();

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

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }
}
