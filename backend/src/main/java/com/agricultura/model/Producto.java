package com.agricultura.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @Column(name = "precio_unitario", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "lugar_venta", nullable = false, length = 150)
    private String lugarVenta;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "productor_id", nullable = false)
    private Productor productor;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "producto_fotos", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "foto_base64", columnDefinition = "LONGTEXT")
    private List<String> fotos = new ArrayList<>();
}
