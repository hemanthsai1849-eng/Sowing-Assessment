package com.ap.agri.cropmonitoring.modules.parcel.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcelDto {

    private Long id;

    @NotNull(message = "Village ID is required")
    private Long villageId;

    private String villageName;

    @NotBlank(message = "Survey number is required")
    private String surveyNumber;

    @NotBlank(message = "Farmer name is required")
    private String farmerName;

    @NotNull(message = "Area in hectares is required")
    @Positive(message = "Area must be greater than zero")
    private BigDecimal areaHa;

    @NotBlank(message = "GeoJSON geometry is required")
    private String geojsonGeometry; // Mapped dynamically to/from JTS Polygon

    private String currentStatus;

    private LocalDateTime lastUpdated;
}
