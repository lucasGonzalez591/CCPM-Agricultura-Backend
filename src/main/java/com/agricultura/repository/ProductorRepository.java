package com.agricultura.repository;

import com.agricultura.model.Productor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductorRepository extends JpaRepository<Productor,Long>, JpaSpecificationExecutor<Productor> {

    boolean existsByDni(String dni);

    boolean existsByDniAndIdNot(String dni, Long id);


}
