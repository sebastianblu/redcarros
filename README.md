# REDCARROS · app_driver
`npm install && npm run dev` → web en `/` y administración en `/admin.html`.
## Usuarios demo (cámbialos antes de publicar)
dueno / Red#2026Owner (superadmin) · hermano / Red#2026Socio (admin) · operador / Red#2026Oper (operador)
## Datos: public/data (config, vehicles, pricing, users). Fotos: public/images/*.jpg
## Admin = simulación: cambios y solicitudes se guardan en localStorage del navegador (no hay servidor ni seguridad real). Para producción real se necesita backend.
## Publicar: `npm run build` y subir el contenido de dist/ a la raíz del dominio.

---
## Comandos del proyecto

### Primera vez
```
node -v                 # verifica que Node.js esté instalado (versión LTS)
npm install             # instala las dependencias
```

### Día a día
```
npm run dev             # ejecuta en local: http://localhost:5173  (admin: /admin.html)
npm run build           # genera la carpeta dist/ para publicar
npm run preview         # prueba la versión final (dist/) antes de subirla
```
Detener el servidor: `Ctrl + C`

### Publicar en el hosting (Namecheap / cualquier hosting estático)
1. `npm run build`
2. Subir el CONTENIDO de `dist/` a `public_html/` (raíz del dominio).
3. Probar: `tudominio.com/data/vehicles.json` debe mostrar los datos.

### Subir cambios a GitHub
```
git init                                  # solo la primera vez
git add .
git commit -m "describe el cambio"
git branch -M main                        # solo la primera vez
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git   # solo la primera vez
git push -u origin main                   # primera vez
git push                                  # siguientes veces
```
Archivo `.gitignore` recomendado: `node_modules` y `dist`.

### Si algo falla
```
rm -rf node_modules package-lock.json && npm install     # reinstalar (Windows: borrar la carpeta node_modules a mano)
npm run dev -- --port 3000                               # usar otro puerto
```
- "Error cargando datos": usa `npm run dev`, no abras index.html con doble clic.
- Ver versión vieja en el navegador: `Ctrl + F5`.

### Qué editar para cambios comunes
- Tarifas de autos y pasajeros: `public/data/vehicles.json`
- Recargos, descuentos, cupones, anticipo: `public/data/pricing.json`
- WhatsApp, correo, nombre: `public/data/config.json`
- Usuarios del admin: `public/data/users.json` (contraseñas en hash SHA-256)
- Fotos: `public/images/` (etios.jpg, yaris.jpg, cross.jpg)
Después de editar: `npm run build` y subir `dist/` otra vez.
