#!/bin/bash
# Script de validación de endpoints SSO y POS

set -e

SSO_URL="http://localhost:3001"
POS_URL="http://localhost:3002"


# 1. Login como ADMIN (debe existir previamente en la base)
ADMIN_EMAIL="admin@demo.com"
ADMIN_PASS="admin123"
ADMIN_TOKEN=$(curl -s -X POST "$SSO_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"'$ADMIN_EMAIL'","password":"'$ADMIN_PASS'"}' | grep -o '"token":"[^"]*"' | cut -d '"' -f4)
echo "Token ADMIN: $ADMIN_TOKEN"

# 2. Crear usuario POS_OPERATOR (requiere que el rol y usuario ADMIN existan)
curl -s -X POST "$SSO_URL/usuarios" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"email":"pos@demo.com","password":"pos123","nombre":"Operador","role_id":2}'

# 3. Login como POS_OPERATOR
POS_TOKEN=$(curl -s -X POST "$SSO_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"pos@demo.com","password":"pos123"}' | grep -o '"token":"[^"]*"' | cut -d '"' -f4)
echo "Token POS_OPERATOR: $POS_TOKEN"

# 4. Buscar productos
curl -s -X GET "$POS_URL/productos/search?q=demo" -H "Authorization: Bearer $POS_TOKEN"

# 5. Consultar producto por ID
curl -s -X GET "$POS_URL/productos/1" -H "Authorization: Bearer $POS_TOKEN"

# 6. Registrar venta
curl -s -X POST "$POS_URL/ventas" -H "Content-Type: application/json" -H "Authorization: Bearer $POS_TOKEN" -d '{"cliente_id":1,"cajero_id":2,"total":100,"detalles":[{"producto_id":1,"cantidad":1,"precio_unitario":100}]}'
