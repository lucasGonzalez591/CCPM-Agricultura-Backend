package com.agricultura.service;


import com.agricultura.dto.filtro.ProductorFiltro;
import com.agricultura.dto.request.ProductorRequest;
import com.agricultura.dto.response.ProductorResponse;

import java.util.List;

public interface ProductorService {

    List<ProductorResponse> listar(ProductorFiltro filtro);
    ProductorResponse obtenerPorId(Long id);
    ProductorResponse crear(ProductorRequest request);
    ProductorResponse actualizar(Long id,ProductorRequest request);
    void eliminar(Long id);


}
