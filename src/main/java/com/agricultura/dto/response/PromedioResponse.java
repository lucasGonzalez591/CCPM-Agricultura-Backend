package com.agricultura.dto.response;

import java.math.BigDecimal;

public record PromedioResponse(String etiqueta, BigDecimal promedio, long cantidad) {
}
