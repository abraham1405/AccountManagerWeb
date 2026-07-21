# 💻 AccountManagerWeb — Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**AccountManagerWeb** es la interfaz de usuario (Frontend) para la plataforma de gestión de cuentas y usuarios. Está construida sobre **React 19** con **TypeScript**, ofreciendo una experiencia de usuario rápida, reactiva y totalmente tipada.

La aplicación consume y se conecta con el servicio backend **[AccountManagerAPI](https://github.com/abraham1405/AccountManagerAPI)** desarrollado en **.NET**, gestionando la autenticación basada en tokens JWT, la administración del perfil y los flujos de recuperación de contraseñas.

---

## 🚀 Funcionalidades Principalmente Cubiertas

* 🔒 **Autenticación e Inicio de Sesión**: Formulario de login con almacenamiento seguro del token JWT retornado por la API.
* 📝 **Registro de Usuarios (`RegisterView`)**: Creación de cuentas de usuario con validación en tiempo real.
* 📧 **Restablecimiento y Recuperación de Clave**:
  * Formulario para solicitar correo de recuperación.
  * Vista de cambio de contraseña conectada a las rutas del backend (`AskForPasswordResetAsync` / `ChangePasswordAsync`).
* 👤 **Área Privada y Perfil (`ProfileView`)**: Panel protegido para ver y editar información del usuario, así como actualizar la contraseña.
* 🛡️ **Rutas Protegidas (`Protected Routes`)**: Bloqueo automático de vistas privadas para usuarios no autenticados o con tokens expirados.
* ⚡ **Manejo Centralizado de Peticiones**: Cliente de Axios configurado con interceptores para enviar el encabezado `Authorization: Bearer <token>` y gestionar la expiración de sesión (errores 401/403).

---

## 🔗 Integración con el Backend (.NET API)

Este proyecto **no almacena ni procesa la lógica de negocio directamente**, sino que actúa como el cliente web que interactúa con el repositorio backend:

👉 **Repositorio Backend:** [AccountManagerAPI](https://github.com/abraham1405/AccountManagerAPI)

### Endpoints Principales Consumidos:

| Módulo | Método | Endpoint Backend | Descripción en Frontend |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Autentica al usuario y guarda el token JWT. |
| **Auth** | `POST` | `/api/auth/register` | Envía los datos del formulario de registro. |
| **Auth** | `POST` | `/api/auth/forgot-password` | Inicia el flujo de recuperación de clave enviando un email. |
| **Auth** | `POST` | `/api/auth/reset-password` | Envía la nueva clave junto con el token de verificación. |
| **Usuario** | `GET` | `/api/user/profile` | Obtiene la información del perfil autenticado. |
| **Usuario** | `PUT` | `/api/user/profile` | Actualiza los datos del perfil o contraseña. |

---

## 🛠️ Tecnologías y Librerías

* **Core:** React 19, TypeScript, Vite
* **Enrutamiento:** React Router Dom (v6+)
* **Peticiones HTTP:** Axios (con interceptores)
* **Gestión de Formulario & Validaciones:** Formik / React Hook Form y Zod / Yup *(según la implementación)*
* **Estilos:** Tailwind CSS / CSS Modules

---

## 📁 Estructura del Proyecto

```text
AccountManagerWeb/
├── public/                 # Recursos estáticos
├── src/
│   ├── assets/             # Imágenes, íconos y estilos globales
│   ├── components/         # Componentes reutilizables (Botones, Inputs, Navbars, Modales)
│   ├── context/            # AuthContext / Estado global de la sesión
│   ├── hooks/              # Custom hooks (e.g., useAuth)
│   ├── routes/             # Configuración de React Router y ProtectedRoutes
│   ├── services/           # Configuración de Axios, Interceptores y llamadas API
│   │   ├── api.ts          # Instancia base de Axios con URL dinámica
│   │   ├── authService.ts  # Métodos de login, registro, reset password
│   │   └── userService.ts  # Métodos para obtener y editar el perfil
│   ├── views/              # Vistas/Páginas principales
│   │   ├── LoginView.tsx
│   │   ├── RegisterView.tsx
│   │   ├── ForgotPasswordView.tsx
│   │   ├── ResetPasswordView.tsx
│   │   └── ProfileView.tsx
│   ├── App.tsx             # Componente raíz y proveedores de contexto
│   └── main.tsx            # Punto de entrada de Vite
├── .env.example            # Plantilla de variables de entorno
├── package.json
└── tsconfig.json
