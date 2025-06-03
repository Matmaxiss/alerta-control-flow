
#!/bin/bash

echo "🐳 Construyendo la imagen Docker..."
docker-compose build

echo "🚀 Iniciando el contenedor..."
docker-compose up -d

echo "✅ Aplicación desplegada exitosamente!"
echo "🌐 Accede a tu aplicación en: http://localhost:3000"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Parar aplicación: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
