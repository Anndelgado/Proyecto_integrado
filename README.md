# Barranquilla Convive

Plataforma GovTech de la Alcaldía de Barranquilla para la gestión y
atención temprana de alertas de salud mental y convivencia escolar.

## Desarrollo local

```bash
npm install
npm run dev
```

Esto levanta Vite (`http://localhost:5173`) y `json-server`
(`http://localhost:3000`) en paralelo.

## Router

La app usa un router propio y muy ligero (`src/router.js`) basado en
la **History API** (`pushState`), por lo que las URLs son limpias, sin
`#` (ej. `/admin`, `/psicologo/casos/1256`).

Todas las rutas se registran en un solo lugar, `src/routes.js`, junto
con sus reglas de acceso:

```js
registerRoute("/admin", AdminDashboard, { roles: ["admin"] });
registerRoute("/login", LoginPage, { guestOnly: true });
registerRoute("/psicologo/casos/:id", CaseDetailView, { roles: ["psicologo"] });
```

## Despliegue en producción

Como el router usa URLs limpias, el **servidor debe redirigir**
cualquier ruta desconocida hacia `index.html` para que el router del
lado del cliente pueda tomar el control (por ejemplo, al recargar la
página en `/admin` o entrar directo por esa URL).

- **Netlify**: ya incluido en `public/_redirects`.
- **Vercel**: agrega un `vercel.json` con
  `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
- **Apache**: agrega un `.htaccess` con `FallbackResource /index.html`.
- **Nginx**: usa `try_files $uri $uri/ /index.html;` en el `location /`.

`vite dev` y `vite preview` ya hacen este fallback automáticamente, así
que en desarrollo no necesitas configurar nada.
