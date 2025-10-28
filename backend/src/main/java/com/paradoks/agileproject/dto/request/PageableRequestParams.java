package com.paradoks.agileproject.dto.request;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;

@Getter
@Setter
@ParameterObject
public class PageableRequestParams {
    @Parameter(description = "Page number (0-based)", example = "0")
    @PositiveOrZero(message = "Page must be 0 or greater")
    private int page = 0;

    @Parameter(description = "Page size", example = "10")
    @Min(value = 1, message = "Size must be at least 1")
    @Max(value = 50, message = "Size cannot be greater than 50!")
    private int size = 30;

    @Parameter(description = "Sort by field", example = "id")
    private String sortBy = "id";

    public Pageable toPageable() {
        return Pageable.ofSize(size).withPage(page);
    }
}