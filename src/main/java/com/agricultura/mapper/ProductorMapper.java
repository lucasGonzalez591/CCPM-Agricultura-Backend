package com.agricultura.mapper;

import com.agricultura.dto.request.ProductorRequest;
import com.agricultura.dto.response.ProductorResponse;
import com.agricultura.model.Productor;

public class ProductorMapper {
    public Productor toEntity(ProductorRequest request) {
        Productor productor = new Productor();
        updateEntity(productor, request);
        return productor;
    }

    public void updateEntity(Productor productor, ProductorRequest request) {
        productor.setApellido(request.apellido());
        productor.setNombre(request.nombre());
        productor.setDni(request.dni());
        productor.setSexo(request.sexo());
        productor.setTelefono(request.telefono());
        productor.setEmail(request.email());
        productor.setMaximoTitulo(request.maximoTitulo());
        productor.setFechaNacimiento(request.fechaNacimiento());
        productor.setDepartamento(request.departamento());
        productor.setMunicipio(request.municipio());
        productor.setDomicilio(request.domicilio());
    }

    public ProductorResponse toResponse(Productor p) {
        return new ProductorResponse(
                p.getId(), p.getApellido(), p.getNombre(), p.getDni(), p.getSexo(),
                p.getTelefono(), p.getEmail(), p.getMaximoTitulo(), p.getFechaNacimiento(),
                p.getDepartamento(), p.getMunicipio(), p.getDomicilio(),
                p.getProductos().size()
        );
    }
}
