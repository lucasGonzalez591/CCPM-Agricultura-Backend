package com.agricultura.specification;

import com.agricultura.model.*;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Predicate;

import java.math.BigDecimal;
import java.util.List;

final class FiltroHelper {

    private FiltroHelper() {}

    static boolean hasText(String s) {
        return s != null && !s.isBlank();
    }

    private static Predicate contiene(CriteriaBuilder cb, Expression<String> campo, String valor) {
        return cb.like(cb.lower(campo), "%" + valor.trim().toLowerCase() + "%");
    }

    static void filtrosProductor(List<Predicate> p, CriteriaBuilder cb, From<?, Productor> productor,
                                 String apellido, String nombre, String dni, Sexo sexo,
                                 String departamento, String municipio) {
        if (hasText(apellido)) p.add(contiene(cb, productor.get("apellido"), apellido));
        if (hasText(nombre)) p.add(contiene(cb, productor.get("nombre"), nombre));
        if (hasText(dni)) p.add(contiene(cb, productor.get("dni"), dni));
        if (sexo != null) p.add(cb.equal(productor.get("sexo"), sexo));
        if (hasText(departamento)) p.add(contiene(cb, productor.get("departamento"), departamento));
        if (hasText(municipio)) p.add(contiene(cb, productor.get("municipio"), municipio));
    }

    static void filtrosProducto(List<Predicate> p, CriteriaBuilder cb, From<?, Producto> producto,
                                String nombre, String lugarVenta,
                                BigDecimal precioMin, BigDecimal precioMax) {
        if (hasText(nombre)) p.add(contiene(cb, producto.get("nombre"), nombre));
        if (hasText(lugarVenta)) p.add(contiene(cb, producto.get("lugarVenta"), lugarVenta));
        if (precioMin != null) p.add(cb.greaterThanOrEqualTo(producto.get("precioUnitario"), precioMin));
        if (precioMax != null) p.add(cb.lessThanOrEqualTo(producto.get("precioUnitario"), precioMax));
    }
}