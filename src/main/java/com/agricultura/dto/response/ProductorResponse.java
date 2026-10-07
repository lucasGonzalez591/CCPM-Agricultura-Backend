package com.agricultura.dto.response;

import com.agricultura.model.Sexo;

import java.time.LocalDate;

public record ProductorResponse(
        Long id,
        String apellido,
        String nombre,
        String dni,
        Sexo sexo,
        String telefono,
        String email,
        String maximoTitulo,
        LocalDate fechaNacimiento,
        String departamento,
        String municipio,
        String domicilio,
        int cantidadProductos
) {
}
