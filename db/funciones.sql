-- Función transaccional para registrar venta atómica
-- Recibe un JSON con los datos de la venta

CREATE OR REPLACE FUNCTION registrar_venta_atomica(data_venta JSON)
RETURNS INTEGER AS $$
DECLARE
    v_venta_id INTEGER;
    v_producto JSON;
    v_detalle JSON;
    v_cantidad INTEGER;
    v_producto_id INTEGER;
    v_precio_unitario NUMERIC;
BEGIN
    -- Iniciar transacción
    BEGIN
        -- Insertar venta
        INSERT INTO ventas (cliente_id, cajero_id, total)
        VALUES (
            (data_venta->>'cliente_id')::INTEGER,
            (data_venta->>'cajero_id')::INTEGER,
            (data_venta->>'total')::NUMERIC
        ) RETURNING id INTO v_venta_id;

        -- Insertar detalles y movimientos de stock
        FOR v_detalle IN SELECT * FROM json_array_elements(data_venta->'detalles') LOOP
            v_producto_id := (v_detalle->>'producto_id')::INTEGER;
            v_cantidad := (v_detalle->>'cantidad')::INTEGER;
            v_precio_unitario := (v_detalle->>'precio_unitario')::NUMERIC;

            -- Insertar detalle de venta
            INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario)
            VALUES (v_venta_id, v_producto_id, v_cantidad, v_precio_unitario);

            -- Insertar movimiento de stock (SALIDA)
            INSERT INTO movimientos_stock (producto_id, tipo, cantidad, referencia)
            VALUES (v_producto_id, 'SALIDA', v_cantidad, CONCAT('Venta #', v_venta_id));

            -- Actualizar stock del producto
            UPDATE productos SET stock_actual = stock_actual - v_cantidad
            WHERE id = v_producto_id AND stock_actual >= v_cantidad;

            -- Validar que el stock no quede negativo
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Stock insuficiente para producto %', v_producto_id;
            END IF;
        END LOOP;

        RETURN v_venta_id;
    EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql;
