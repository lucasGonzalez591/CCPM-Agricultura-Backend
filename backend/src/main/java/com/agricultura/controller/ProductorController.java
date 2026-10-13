package com.agricultura.controller;

import com.agricultura.dto.filtro.ProductorFiltro;
import com.agricultura.dto.request.ProductorRequest;
import com.agricultura.dto.response.ProductoListadoResponse;
import com.agricultura.dto.response.ProductorResponse;
import com.agricultura.service.ProductoService;
import com.agricultura.service.ProductorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/productores")
@Tag(name = "Productores", description = "CRUD y búsqueda de productores")
public class ProductorController {

    private final ProductorService productorService;
    private final ProductoService productoService;

    public ProductorController(ProductorService productorService, ProductoService productoService) {
        this.productorService = productorService;
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductorResponse> listar(@ParameterObject ProductorFiltro filtro) {
        return productorService.listar(filtro);
    }

    @GetMapping("/{id}")
    public ProductorResponse obtener(@PathVariable Long id){
        return productorService.obtenerPorId(id);
    }

    @GetMapping("/{id}/productos")
    public List<ProductoListadoResponse> productosDelProductor(@PathVariable Long id){
        return productoService.listarPorProductor(id);
    }

    @PostMapping
    public ResponseEntity<ProductorResponse> crear(@Valid @RequestBody ProductorRequest request) {
        ProductorResponse creado = productorService.crear(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creado.id()).toUri();
        return ResponseEntity.created(location).body(creado);
    }

    @PutMapping("/{id}")
    public ProductorResponse actualizar(@PathVariable Long id,
                                        @Valid @RequestBody ProductorRequest request) {
        return productorService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }




}
