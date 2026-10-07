package com.agricultura.service.impl;

import com.agricultura.dto.request.ProductoRequest;
import com.agricultura.dto.response.ProductoListadoResponse;
import com.agricultura.dto.response.ProductoResponse;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.mapper.ProductoMapper;
import com.agricultura.model.Producto;
import com.agricultura.model.Productor;
import com.agricultura.repository.ProductoRepository;
import com.agricultura.repository.ProductorRepository;
import com.agricultura.service.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductoServiceImpl implements ProductoService {

    public static final int MAX_FOTOS = 3;

    private final ProductoRepository productoRepository;
    private final ProductorRepository productorRepository;
    private final ProductoMapper productoMapper;

    public ProductoServiceImpl(ProductoRepository productoRepository, ProductorRepository productorRepository, ProductoMapper productoMapper) {
        this.productoRepository = productoRepository;
        this.productorRepository = productorRepository;
        this.productoMapper = productoMapper;
    }

    @Override
    public List<ProductoListadoResponse> listar() {
        return productoRepository.findAll().stream()
                .map(productoMapper::toListadoResponse)
                .toList();
    }



    @Override
    public List<ProductoListadoResponse> listarPorProductor(Long productorId) {
        if (!productorRepository.existsById(productorId)) {
            throw new ResourceNotFoundException(
                    "No se encontró el productor con id " + productorId);
        }
        return productoRepository.findByProductorId(productorId).stream()
                .map(productoMapper::toListadoResponse)
                .toList();
    }


    @Override
    public ProductoResponse obtenerPorId(Long id) {
        return productoMapper.toResponse(buscarOFallar(id));
    }

    @Transactional
    @Override
    public ProductoResponse crear(ProductoRequest request) {
        validarFotos(request);
        Productor productor = buscarProductorOFallar(request.productorId());
        Producto producto = productoMapper.toEntity(request, productor);
        return productoMapper.toResponse(productoRepository.save(producto));
    }

    @Override
    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        validarFotos(request);
        Producto producto = buscarOFallar(id);
        Productor productor = buscarProductorOFallar(request.productorId());
        productoMapper.updateEntity(producto, request, productor);
        return productoMapper.toResponse(productoRepository.save(producto));
    }

    @Override
    public void eliminar(Long id) {
        productoRepository.delete(buscarOFallar(id));
    }

    private Producto buscarOFallar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró el producto con id " + id));
    }

    private Productor buscarProductorOFallar(Long productorId) {
        return productorRepository.findById(productorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró el productor con id " + productorId));
    }

    private void validarFotos(ProductoRequest request) {
        if (request.fotos() != null && request.fotos().size() > MAX_FOTOS) {
            throw new IllegalArgumentException(
                    "Un producto puede tener hasta " + MAX_FOTOS + " fotografías");
        }

    }
}
