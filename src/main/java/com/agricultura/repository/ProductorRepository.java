package com.agricultura.repository;

import com.agricultura.model.Productor;
import com.agricultura.repository.projection.ConteoProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductorRepository extends JpaRepository<Productor,Long>, JpaSpecificationExecutor<Productor> {

    boolean existsByDni(String dni);

    boolean existsByDniAndIdNot(String dni, Long id);


    @Query("""
        select p.departamento as etiqueta, count(p) as cantidad
        from Productor p
        group by p.departamento
        order by count(p) desc, p.departamento
        """)
    List<ConteoProjection> contarPorDepartamento();

    @Query("""
        select concat(p.municipio, ' - ', p.departamento) as etiqueta, count(p) as cantidad
        from Productor p
        group by p.municipio, p.departamento
        order by count(p) desc, p.municipio
        """)
    List<ConteoProjection> contarPorMunicipio();

    @Query("""
        select concat(pr.apellido, ', ', pr.nombre) as etiqueta, count(p) as cantidad
        from Productor pr
        left join pr.productos p
        group by pr.id, pr.apellido, pr.nombre
        order by count(p) desc, pr.apellido
        """)
    List<ConteoProjection> contarProductosPorProductor();


}
