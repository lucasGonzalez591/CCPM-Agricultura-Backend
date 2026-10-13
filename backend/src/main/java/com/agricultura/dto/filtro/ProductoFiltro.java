package com.agricultura.dto.filtro;

import com.agricultura.model.Sexo;

import java.math.BigDecimal;

public record ProductoFiltro(
        String nombre,
        String lugarVenta,
        BigDecimal precioMin,
        BigDecimal precioMax,
        String productorApellido,
        String productorNombre,
        String productorDni,
        Sexo sexo,
        String departamento,
        String municipio
) {
    public boolean tieneFiltrosDeProductor() {
        return productorApellido != null || productorNombre != null
                || productorDni != null || sexo != null
                || departamento != null || municipio != null;
    }

    public void validar() {
        if (precioMin != null && precioMax != null && precioMin.compareTo(precioMax) > 0) {
            throw new IllegalArgumentException(
                    "El precio mínimo no puede ser mayor al precio máximo");
        }
    }
}
