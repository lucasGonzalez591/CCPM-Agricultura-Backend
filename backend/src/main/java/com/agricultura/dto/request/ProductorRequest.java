package com.agricultura.dto.request;

import com.agricultura.model.Sexo;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ProductorRequest(
        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 80)
        String apellido,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 80)
        String nombre,

        @NotBlank(message = "El DNI es obligatorio")
        @Pattern(regexp = "\\d{7,8}", message = "El DNI debe tener 7 u 8 dígitos")
        String dni,

        @NotNull(message = "El sexo es obligatorio")
        Sexo sexo,

        @Pattern(regexp = "^[0-9+\\-\\s]{6,20}$", message = "Teléfono inválido")
        String telefono,

        @Email(message = "Email inválido")
        @Size(max = 120)
        String email,

        @Size(max = 100)
        String maximoTitulo,

        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser pasada")
        LocalDate fechaNacimiento,

        @NotBlank(message = "El departamento es obligatorio")
        @Size(max = 80)
        String departamento,

        @NotBlank(message = "El municipio es obligatorio")
        @Size(max = 80)
        String municipio,

        @NotBlank(message = "El domicilio es obligatorio")
        @Size(max = 150)
        String domicilio
) {
}
