package com.agricultura.service.impl;

import com.agricultura.dto.request.ProductorRequest;
import com.agricultura.dto.response.ProductorResponse;
import com.agricultura.exception.DuplicateResourceException;
import com.agricultura.exception.ResourceNotFoundException;
import com.agricultura.mapper.ProductorMapper;
import com.agricultura.model.Productor;
import com.agricultura.repository.ProductorRepository;
import com.agricultura.service.ProductorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductorServiceImpl implements ProductorService {

    private final ProductorRepository productorRepository;
    private final ProductorMapper productorMapper;

    public ProductorServiceImpl(ProductorRepository productorRepository,ProductorMapper productorMapper){
        this.productorRepository = productorRepository;
        this.productorMapper = productorMapper;
    }


    @Override
    public List<ProductorResponse> listar() {
        return productorRepository.findAll().stream()
                .map(productorMapper::toResponse)
                .toList();
    }

    @Override
    public ProductorResponse obtenerPorId(Long id) {
        return productorMapper.toResponse(buscarOFallar(id));
    }

    @Override
    @Transactional
    public ProductorResponse crear(ProductorRequest request) {
        if (productorRepository.existsByDni(request.dni())) {
            throw new DuplicateResourceException(
                    "Ya existe un productor con el DNI " + request.dni());
        }
        Productor productor = productorMapper.toEntity(request);
        return productorMapper.toResponse(productorRepository.save(productor));
    }

    @Override
    @Transactional
    public ProductorResponse actualizar(Long id, ProductorRequest request) {
        Productor productor = buscarOFallar(id);
        if (productorRepository.existsByDniAndIdNot(request.dni(), id)) {
            throw new DuplicateResourceException(
                    "Ya existe otro productor con el DNI " + request.dni());
        }
        productorMapper.updateEntity(productor, request);
        return productorMapper.toResponse(productorRepository.save(productor));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        productorRepository.delete(buscarOFallar(id));
    }

    private Productor buscarOFallar(Long id) {
        return productorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró el productor con id " + id));
    }
}
