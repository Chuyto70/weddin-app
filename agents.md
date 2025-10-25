# Contexto de la Aplicación para Agentes de IA

## Descripción General del Proyecto

El objetivo es desarrollar una aplicación web sencilla para una boda, que permita a los invitados subir fotos en vivo y en directo durante el evento. La aplicación está diseñada para ser simple y de fácil acceso para todos, sin necesidad de autenticación o cuentas de usuario.

## Características Principales

La aplicación tendrá dos funcionalidades clave:

1.  **Subir Fotos:**
    *   Habrá una sección o un botón claramente visible para "Subir Foto".
    *   Al hacer clic en este botón, se activará la cámara del dispositivo del usuario (móvil, tablet, etc.).
    *   El usuario podrá tomar una foto.
    *   Después de tomar la foto, la aplicación mostrará una vista previa y preguntará al usuario si desea "Aceptar" y subirla o "Cancelar".
    *   Si el usuario acepta, la foto se guardará en el sistema de archivos del servidor, dentro de una carpeta específica llamada `weddingPhotos`.

2.  **Galería de Fotos:**
    *   Existirá otra sección en la aplicación que funcionará como una galería.
    *   Esta galería mostrará todas las fotos que han sido subidas por los invitados y que se encuentran en la carpeta `weddingPhotos`.
    *   Las fotos se mostrarán en un formato de lista o cuadrícula para una fácil visualización.

## Detalles Técnicos y Arquitectura

*   **Autenticación:** No habrá sistema de usuarios. Cualquier persona con acceso a la URL de la aplicación podrá subir y ver fotos.
*   **Almacenamiento:** Las imágenes se almacenarán localmente en el servidor que aloja la aplicación, en el directorio `public/weddingPhotos/`.
*   **Stack (Potencial):** La aplicación se está construyendo con Next.js (React), lo que permite manejar tanto el frontend como el backend (API para subir archivos) en un solo proyecto.

## Objetivo a Corto Plazo

El objetivo principal es tener una versión funcional y sencilla para el día de la boda, centrada exclusivamente en las dos características mencionadas: subir y listar fotos.
