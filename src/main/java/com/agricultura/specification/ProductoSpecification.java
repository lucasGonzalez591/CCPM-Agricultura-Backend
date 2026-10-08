package com.agricultura.specification;

import com.agricultura.dto.filtro.ProductoFiltro;
import com.agricultura.model.Producto;
import com.agricultura.model.Productor;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ProductoSpecification {

    private ProductoSpecification() {}

    public static Specification<Producto> conFiltros(ProductoFiltro f) {
        return (root, query, cb) -> {
            List<Predicate> predicados = new ArrayList<>();

            FiltroHelper.filtrosProducto(predicados, cb, root,
                    f.nombre(), f.lugarVenta(), f.precioMin(), f.precioMax());

            if (f.tieneFiltrosDeProductor()) {
                Join<Producto, Productor> productor = root.join("productor");
                FiltroHelper.filtrosProductor(predicados, cb, productor,
                        f.productorApellido(), f.productorNombre(), f.productorDni(),
                        f.sexo(), f.departamento(), f.municipio());
            }

            return cb.and(predicados.toArray(new Predicate[0]));
        };
    }
}