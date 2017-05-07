package com.sj.library.management.common.pagination;

import java.util.List;

public class PaginationResult {
    private long total;
    private List<? extends Object> rows;
    private Object footer;

    public List<? extends Object> getRows() {
        return rows;
    }

    public void setRows(List<? extends Object> rows) {
        this.rows = rows;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public void setFooter(Object footer)
    {
        this.footer = footer;
    }

    public Object getFooter()
    {
        return  this.footer;
    }
}
