
#!/bin/bash

echo "🐳 Construyendo la imagen Docker..."
docker-compose build

echo "🚀 Iniciando el contenedor..."
docker-compose up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 10

echo "✅ Aplicación desplegada exitosamente!"
echo ""
echo "🌐 URLs disponibles:"
echo "  - Aplicación: http://localhost:3000"
echo "  - API REST: http://localhost:8000/rest/v1/"
echo "  - Realtime: ws://localhost:8000/realtime/v1/"
echo "  - Base de datos: postgresql://postgres:your-super-secret-and-long-postgres-password@localhost:5432/postgres"
echo ""
echo "📊 Datos iniciales incluidos:"
echo "  - Usuario admin: admin / 12345678"
echo "  - 4 Prensas configuradas"
echo "  - 6 Botones de alerta configurados"
echo ""
echo "🔄 Tiempo real activado para:"
echo "  - Alertas (automático)"
echo "  - Prensas (automático)"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Ver logs específicos: docker-compose logs -f [servicio]"
echo "  - Parar aplicación: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
echo "  - Limpiar todo: docker-compose down -v"

