package com.agricultura.dto.filtro;

import com.agricultura.model.Sexo;

import java.math.BigDecimal;

public record ProductorFiltro(
        String apellido,
        String nombre,
        String dni,
        Sexo sexo,
        String departamento,
        String municipio,
        String producto,
        String lugarVenta,
        BigDecimal precioMin,
        BigDecimal precioMax
) {
    public boolean tieneFiltrosDeProducto() {
        return producto != null || lugarVenta != null
                || precioMin != null || precioMax != null;
    }

    public void validar() {
        if (precioMin != null && precioMax != null && precioMin.compareTo(precioMax) > 0) {
            throw new IllegalArgumentException(
                    "El precio mínimo no puede ser mayor al precio máximo");
        }
    }
}