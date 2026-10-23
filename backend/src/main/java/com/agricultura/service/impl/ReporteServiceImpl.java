package com.agricultura.service.impl;

import com.agricultura.dto.response.ConteoResponse;
import com.agricultura.dto.response.PromedioResponse;
import com.agricultura.dto.response.ResumenResponse;
import com.agricultura.repository.ProductoRepository;
import com.agricultura.repository.ProductorRepository;
import com.agricultura.repository.projection.ConteoProjection;
import com.agricultura.repository.projection.PreciosProjection;
import com.agricultura.service.ReporteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReporteServiceImpl implements ReporteService {

    private final ProductorRepository productorRepository;
    private final ProductoRepository productoRepository;

    public ReporteServiceImpl(ProductorRepository productorRepository,
                              ProductoRepository productoRepository) {
        this.productorRepository = productorRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public ResumenResponse resumen() {
        long productores = productorRepository.count();
        long productos = productoRepository.count();
        PreciosProjection precios = productoRepository.resumenPrecios();

        BigDecimal productosPorProductor = productores == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(productos)
                .divide(BigDecimal.valueOf(productores), 2, RoundingMode.HALF_UP);

        return new ResumenResponse(
                productores,
                productos,
                productosPorProductor,
                redondear(precios.getPromedio()),
                precios.getMinimo() != null ? precios.getMinimo() : BigDecimal.ZERO,
                precios.getMaximo() != null ? precios.getMaximo() : BigDecimal.ZERO
        );
    }

    @Override
    public List<ConteoResponse> productoresPorDepartamento() {
        return aConteo(productorRepository.contarPorDepartamento());
    }

    @Override
    public List<ConteoResponse> productoresPorMunicipio() {
        return aConteo(productorRepository.contarPorMunicipio());
    }

    @Override
    public List<ConteoResponse> productosPorProductor() {
        return aConteo(productorRepository.contarProductosPorProductor());
    }

    @Override
    public List<ConteoResponse> productosPorLugarVenta() {
        return aConteo(productoRepository.contarPorLugarVenta());
    }

    @Override
    public List<PromedioResponse> precioPromedioPorProducto() {
        return productoRepository.promedioPorProducto().stream()
                .map(p -> new PromedioResponse(p.getEtiqueta(), redondear(p.getPromedio()), p.getCantidad()))
                .toList();
    }

    private List<ConteoResponse> aConteo(List<ConteoProjection> filas) {
        return filas.stream()
                .map(f -> new ConteoResponse(f.getEtiqueta(), f.getCantidad()))
                .toList();
    }

    private BigDecimal redondear(Double valor) {
        return valor == null
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(valor).setScale(2, RoundingMode.HALF_UP);
    }
}