package com.ap.agri.cropmonitoring.modules.weather.entities;

import com.ap.agri.cropmonitoring.modules.parcel.entities.Village;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "weather_data", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"village_id", "record_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "village_id", nullable = false)
    private Village village;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "temp_min", nullable = false, precision = 4, scale = 1)
    private BigDecimal tempMin;

    @Column(name = "temp_max", nullable = false, precision = 4, scale = 1)
    private BigDecimal tempMax;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal precipitation; // in mm

    @Column(name = "soil_moisture", nullable = false, precision = 5, scale = 2)
    private BigDecimal soilMoisture; // in %
}
