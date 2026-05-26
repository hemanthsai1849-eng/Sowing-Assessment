package com.ap.agri.cropmonitoring.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI cropMonitoringOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token to authorize requests.")
                        )
                )
                .info(new Info()
                        .title("Automated Crop Sowing & Fallow Land Intelligence API")
                        .description("Enterprise GIS + AI Backend System built for the Agriculture Department, Government of Andhra Pradesh. Supports cadastral boundary uploads, satellite NDVI observations, crop state classification, and e-Panta verification validations.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("AP Agriculture Department - GIS Backend Cell")
                                .email("gis-support@ap.gov.in")
                                .url("https://apagrisnet.ap.gov.in")
                        )
                        .license(new License()
                                .name("Government Proprietary License")
                                .url("https://ap.gov.in")
                        )
                );
    }
}
