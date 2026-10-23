package com.agricultura.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String nombre,

        @Size(max = 1000)
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        @Digits(integer = 10, fraction = 2)
        BigDecimal precioUnitario,

        @NotBlank(message = "El lugar de venta es obligatorio")
        @Size(max = 150)
        String lugarVenta,

        @NotNull(message = "El productor es obligatorio")
        Long productorId,

        @Size(max = 3, message = "Un producto puede tener hasta 3 fotografías")
        List<@NotBlank String> fotos
) {
}
