#!/bin/bash

echo "🧹 Limpiando código de debug del EMx Dashboard..."

# Función para procesar archivos
cleanup_file() {
    local file="$1"
    echo "  📄 Procesando: $file"
    
    # Crear backup
    cp "$file" "$file.backup"
    
    # Remover console.log específicos de debug (mantener console.error)
    sed -i '' '/console\.log.*DEBUG/d' "$file"
    sed -i '' '/console\.log.*Processing/d' "$file"
    sed -i '' '/console\.log.*found/d' "$file"
    sed -i '' '/console\.log.*BREAKDOWN/d' "$file"
    sed -i '' '/console\.log.*total.*completadas.*pendientes/d' "$file"
    sed -i '' '/console\.log.*No tasks found/d' "$file"
    sed -i '' '/console\.log.*movida a/d' "$file"
    
    echo "    ✅ Limpiado"
}

# Limpiar archivos del frontend
echo "🎯 Limpiando frontend..."
find frontend/src -name "*.tsx" -o -name "*.ts" | while read file; do
    if grep -q "console\.log" "$file"; then
        cleanup_file "$file"
    fi
done

echo ""
echo "✨ Limpieza completada!"
echo "📋 Resumen:"
echo "   - Se mantuvieron los console.error para manejo de errores"
echo "   - Se removieron todos los console.log de debug"
echo "   - Se crearon backups (.backup) de los archivos modificados"
echo ""
echo "🔍 Para verificar los cambios:"
echo "   git diff"
echo ""
echo "🗑️  Para eliminar los backups:"
echo "   find . -name '*.backup' -delete"
