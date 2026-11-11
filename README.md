# Unit III. Hobbies and abilities · M06 S3

Sitio web estático (sin instalación ni compilación) que guía a los alumnos paso a paso para preparar y contestar:

- **Actividad integradora 5 · About me** — *can / can't*, *like, dislike, hate, love*.
- **Actividad integradora 6 · Finding a roommate** — presente simple en tercera persona, preguntas con *does* y adverbios de
  tiempo y frecuencia.

Cada actividad incluye: objetivo, vocabulario con audio, explicación del tema, ejercicios de práctica con retroalimentación,
práctica de pronunciación con reconocimiento de voz, escritura guiada de cada respuesta con pistas, grabadora de audio con
cronómetro (mínimo 30 s), reflexión con contador de palabras y una página final para copiar o descargar todas las respuestas.

El avance del alumno se guarda solo en su navegador (`localStorage`); el sitio no envía datos a ningún servidor.

## Estructura

```
index.html          Página de inicio
actividad-5.html    Actividad 5 (carga assets/ai5.js)
actividad-6.html    Actividad 6 (carga assets/ai6.js)
assets/app.js       Motor: pasos, ejercicios, voz, grabadora, resumen
assets/app.css      Estilos (tema claro y oscuro)
assets/ai5.js       Contenido de la Actividad 5
assets/ai6.js       Contenido de la Actividad 6
```

Para cambiar textos, ejercicios o pistas edita `assets/ai5.js` o `assets/ai6.js`.

## Publicar en GitHub Pages

1. Crea un repositorio vacío en https://github.com/new (por ejemplo `my-skills-my-routine`, público, sin README).
2. En la terminal, dentro de esta carpeta:

   ```bash
   git remote add origin https://github.com/TU-USUARIO/my-skills-my-routine.git
   git push -u origin main
   ```

3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. En uno o dos minutos el sitio estará en `https://TU-USUARIO.github.io/my-skills-my-routine/`.

## Requisitos para los alumnos

- **Google Chrome** o **Microsoft Edge** (el reconocimiento de voz no funciona en Firefox).
- Permitir el uso del micrófono cuando el navegador lo pida.
- El micrófono solo funciona con `https://` (GitHub Pages lo cumple) o en `localhost`.

## Probar en la computadora

```bash
python3 -m http.server 8774
```

y abre http://localhost:8774
