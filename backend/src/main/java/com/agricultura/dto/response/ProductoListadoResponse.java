package com.agricultura.dto.response;

import java.math.BigDecimal;

public record ProductoListadoResponse(
        Long id,
        String nombre,
        BigDecimal precioUnitario,
        String lugarVenta,
        Long productorId,
        String productorNombre
) {
}
