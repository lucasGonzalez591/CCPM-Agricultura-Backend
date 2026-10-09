package com.agricultura.repository;

import com.agricultura.model.Producto;
import com.agricultura.repository.projection.ConteoProjection;
import com.agricultura.repository.projection.PreciosProjection;
import com.agricultura.repository.projection.PromedioProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto,Long> ,
        JpaSpecificationExecutor<Producto> {

        List<Producto> findByProductorId(Long productorId);

        @Query("""
        select p.lugarVenta as etiqueta, count(p) as cantidad
        from Producto p
        group by p.lugarVenta
        order by count(p) desc, p.lugarVenta
        """)
        List<ConteoProjection> contarPorLugarVenta();

        @Query("""
        select p.nombre as etiqueta, avg(p.precioUnitario) as promedio, count(p) as cantidad
        from Producto p
        group by p.nombre
        order by p.nombre
        """)
        List<PromedioProjection> promedioPorProducto();

        @Query("""
        select avg(p.precioUnitario) as promedio,
               min(p.precioUnitario) as minimo,
               max(p.precioUnitario) as maximo
        from Producto p
        """)
        PreciosProjection resumenPrecios();

}
