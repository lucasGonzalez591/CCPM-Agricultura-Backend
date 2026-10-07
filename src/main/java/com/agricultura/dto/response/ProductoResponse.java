package com.agricultura.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record ProductoResponse(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precioUnitario,
        String lugarVenta,
        Long productorId,
        String productorNombre,
        List<String> fotos
) {
}
