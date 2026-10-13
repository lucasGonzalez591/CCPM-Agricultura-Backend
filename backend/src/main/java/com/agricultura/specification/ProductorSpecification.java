package com.agricultura.specification;
import com.agricultura.dto.filtro.ProductorFiltro;
import com.agricultura.model.Producto;
import com.agricultura.model.Productor;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ProductorSpecification {

    private ProductorSpecification() {}

    public static Specification<Productor> conFiltros(ProductorFiltro f) {
        return (root, query, cb) -> {
            List<Predicate> predicados = new ArrayList<>();

            FiltroHelper.filtrosProductor(predicados, cb, root,
                    f.apellido(), f.nombre(), f.dni(), f.sexo(), f.departamento(), f.municipio());

            if (f.tieneFiltrosDeProducto()) {
                Join<Productor, Producto> producto = root.join("productos");
                query.distinct(true);
                FiltroHelper.filtrosProducto(predicados, cb, producto,
                        f.producto(), f.lugarVenta(), f.precioMin(), f.precioMax());
            }

            return cb.and(predicados.toArray(new Predicate[0]));
        };
    }
}
