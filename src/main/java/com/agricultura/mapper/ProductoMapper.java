package com.agricultura.mapper;

import com.agricultura.dto.request.ProductoRequest;
import com.agricultura.dto.response.ProductoListadoResponse;
import com.agricultura.dto.response.ProductoResponse;
import com.agricultura.model.Producto;
import com.agricultura.model.Productor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class ProductoMapper {
    public Producto toEntity(ProductoRequest request, Productor productor) {
        Producto producto = new Producto();
        updateEntity(producto, request, productor);
        return producto;
    }

    public void updateEntity(Producto producto, ProductoRequest request, Productor productor) {
        producto.setNombre(request.nombre());
        producto.setDescripcion(request.descripcion());
        producto.setPrecioUnitario(request.precioUnitario());
        producto.setLugarVenta(request.lugarVenta());
        producto.setProductor(productor);

        producto.getFotos().clear();
        if (request.fotos() != null) {
            producto.getFotos().addAll(request.fotos());
        }
    }

    public ProductoResponse toResponse(Producto p) {
        Productor prod = p.getProductor();
        return new ProductoResponse(
                p.getId(), p.getNombre(), p.getDescripcion(), p.getPrecioUnitario(),
                p.getLugarVenta(), prod.getId(),
                prod.getApellido() + ", " + prod.getNombre(),
                new ArrayList<>(p.getFotos())
        );
    }

    public ProductoListadoResponse toListadoResponse(Producto p) {
        Productor prod = p.getProductor();
        return new ProductoListadoResponse(
                p.getId(), p.getNombre(), p.getPrecioUnitario(), p.getLugarVenta(),
                prod.getId(), prod.getApellido() + ", " + prod.getNombre()
        );
    }
}
