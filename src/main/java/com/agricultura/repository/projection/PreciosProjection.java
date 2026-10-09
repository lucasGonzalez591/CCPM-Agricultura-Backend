package com.agricultura.repository.projection;

import java.math.BigDecimal;

public interface PreciosProjection {
    Double getPromedio();
    BigDecimal getMinimo();
    BigDecimal getMaximo();
}
