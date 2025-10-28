package com.paradoks.agileproject.dto.response;

import java.util.List;

import lombok.Getter;
import org.springframework.data.domain.Page;

@Getter
public class APPaged<T> {

    private final List<T> content;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean last;

    public APPaged(List<T> content, int page, int size, long totalElements) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = (int) Math.ceil((double) totalElements / size);
        this.last = page >= totalPages - 1;
    }

    public static <T> APPaged<T> from(Page<T> page) {
        return new APPaged<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements()
        );
    }
}
