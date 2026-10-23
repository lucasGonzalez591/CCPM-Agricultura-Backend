package com.agricultura.service;

import com.agricultura.dto.response.ConteoResponse;
import com.agricultura.dto.response.PromedioResponse;
import com.agricultura.dto.response.ResumenResponse;

import java.util.List;

public interface ReporteService {
    ResumenResponse resumen();

    List<ConteoResponse> productoresPorDepartamento();

    List<ConteoResponse> productoresPorMunicipio();

    List<ConteoResponse> productosPorProductor();

    List<ConteoResponse> productosPorLugarVenta();

    List<PromedioResponse> precioPromedioPorProducto();
}
