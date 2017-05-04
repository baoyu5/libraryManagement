package com.sj.library.management.common.pagination;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * User: Rolandz
 * Date: 7/12/16
 * Time: 8:40 AM
 */
public class PageRequest {
    @JsonProperty("rows")
    private int pageRows;
    @JsonProperty("page")
    private int pageNumber;

    public static PageRequest newRequest(Integer rows, Integer page) {
        return new PageRequest(rows, page);
    }

    private PageRequest(Integer rows, Integer page) {
        setPageRows(rows == null ? 0 : rows);
        setPageNumber(page == null ? 0 : page);
    }

    public int getPageRows() {
        return pageRows;
    }

    public void setPageRows(int pageRows) {
        if (pageRows <= 0) {
            this.pageRows = Integer.MAX_VALUE;
        } else {
            this.pageRows = pageRows;
        }
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        if (pageNumber <= 0) {
            this.pageNumber = 1;
        } else {
            this.pageNumber = pageNumber;
        }
    }
}
