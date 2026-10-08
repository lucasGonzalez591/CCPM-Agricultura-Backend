package com.agricultura.service;

import com.agricultura.dto.filtro.ProductoFiltro;
import com.agricultura.dto.request.ProductoRequest;
import com.agricultura.dto.response.ProductoListadoResponse;
import com.agricultura.dto.response.ProductoResponse;

import java.util.List;

public interface ProductoService {

    List<ProductoListadoResponse> listar(ProductoFiltro filtro);
    List<ProductoListadoResponse> listarPorProductor(Long productorId);
    ProductoResponse obtenerPorId(Long id);
    ProductoResponse crear(ProductoRequest request);
    ProductoResponse actualizar(Long id,ProductoRequest request);
    void eliminar (Long id);




}
