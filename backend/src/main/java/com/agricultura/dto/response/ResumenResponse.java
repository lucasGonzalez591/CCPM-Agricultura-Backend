package com.agricultura.dto.response;

import java.math.BigDecimal;

public record ResumenResponse(
        long totalProductores,
        long totalProductos,
        BigDecimal promedioProductosPorProductor,
        BigDecimal precioPromedio,
        BigDecimal precioMinimo,
        BigDecimal precioMaximo
) {
}
