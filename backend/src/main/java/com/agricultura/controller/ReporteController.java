package com.agricultura.controller;

import com.agricultura.dto.response.ConteoResponse;
import com.agricultura.dto.response.PromedioResponse;
import com.agricultura.dto.response.ResumenResponse;
import com.agricultura.service.ReporteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@Tag(name = "Reportes", description = "Estadísticas e indicadores del sistema")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @Operation(summary = "Indicadores generales: totales, promedio de productos por productor y precios")
    @GetMapping("/resumen")
    public ResumenResponse resumen() {
        return reporteService.resumen();
    }

    @Operation(summary = "Cantidad de productores por departamento")
    @GetMapping("/productores-por-departamento")
    public List<ConteoResponse> productoresPorDepartamento() {
        return reporteService.productoresPorDepartamento();
    }

    @Operation(summary = "Cantidad de productores por municipio")
    @GetMapping("/productores-por-municipio")
    public List<ConteoResponse> productoresPorMunicipio() {
        return reporteService.productoresPorMunicipio();
    }

    @Operation(summary = "Cantidad de productos de cada productor")
    @GetMapping("/productos-por-productor")
    public List<ConteoResponse> productosPorProductor() {
        return reporteService.productosPorProductor();
    }

    @Operation(summary = "Distribución de productos por lugar de venta")
    @GetMapping("/productos-por-lugar-venta")
    public List<ConteoResponse> productosPorLugarVenta() {
        return reporteService.productosPorLugarVenta();
    }

    @Operation(summary = "Precio promedio por nombre de producto")
    @GetMapping("/precio-promedio-por-producto")
    public List<PromedioResponse> precioPromedioPorProducto() {
        return reporteService.precioPromedioPorProducto();
    }
}