package com.agricultura.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI pafOpenApi() {
        return new OpenAPI().info(new Info()
                .title("API PAF - Productos de Agricultura Familiar")
                .description("Registro de productores y sus productos, con filtros, reportes y estadísticas")
                .version("1.0.0"));
    }
}