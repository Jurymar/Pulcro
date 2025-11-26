# 📖 LÓGICA DE NEGOCIO - TE LAVO

## Sistema de Gestión de Lavandería en Tiempo Real

---

## 📑 Tabla de Contenidos

1. [Descripción General del Sistema](#-descripción-general-del-sistema)
2. [Modelo de Negocio](#-modelo-de-negocio)
3. [Tipos de Usuario y Roles](#-tipos-de-usuario-y-roles)
4. [Flujo de Negocio Completo](#-flujo-de-negocio-completo)
5. [Estructura de Datos](#-estructura-de-datos)
6. [Funcionalidades por Usuario](#-funcionalidades-por-usuario)
7. [Sistema de Precios y Pagos](#-sistema-de-precios-y-pagos)
8. [Sistema de Calificaciones](#-sistema-de-calificaciones-bidireccional)
9. [Sistema de Notificaciones](#-sistema-de-notificaciones)
10. [Sistema de Chat Interno](#-sistema-de-chat-interno)
11. [Horarios Fijos](#-sistema-de-horarios-fijos)
12. [Casos de Uso Principales](#-casos-de-uso-principales)

---

## 🎯 Descripción General del Sistema

**Te lavo** es una plataforma digital de dos caras (two-sided marketplace) que conecta **clientes** que necesitan servicios de lavandería con **lavanderos profesionales** que ofrecen estos servicios. La plataforma opera 100% en tiempo real sin necesidad de recargar la página.

### Propósito del Negocio

- **Para Clientes**: Proporcionar una forma fácil, rápida y confiable de solicitar servicios de lavandería a domicilio sin tener que buscar lavanderías físicamente.

- **Para Lavanderos**: Ofrecer una plataforma para encontrar clientes nuevos, gestionar pedidos y hacer crecer su negocio de lavandería.

### Propuesta de Valor

1. **Conveniencia**: El cliente no tiene que salir de casa
2. **Tiempo Real**: Todas las actualizaciones son instantáneas
3. **Transparencia**: Los clientes pueden ver el estado de sus pedidos en todo momento
4. **Seguridad**: Sistema de autenticación y reglas de acceso robustas
5. **Disponibilidad**: Los clientes pueden crear pedidos en cualquier momento dentro de un horario que sera estipulado mas adelante.

---

## 💼 Modelo de Negocio

### Tipo de Plataforma

**Marketplace de Servicios (Two-Sided Platform)**

- **Lado 1 (Demanda)**: Clientes que necesitan servicios de lavandería
- **Lado 2 (Oferta)**: Lavanderos que ofrecen servicios profesionales

### Modelo de Ingresos

**Distribución de Pagos por Servicio:**

- **25% para la plataforma** (comisión del marketplace)
- **75% para el lavandero** (pago por servicio prestado)

**Métodos de Pago:**

1. **Pago en la App**:

   - Integrado con plataforma de pagos
   - Distribución automática: 25% plataforma / 75% lavandero
   - Procesamiento seguro de transacciones

2. **Propinas**:
   - Solo se entregan en efectivo
   - Directamente al lavandero
   - No pasan por la plataforma

**Fuentes de Ingreso:**

1. **Comisión por Transacción**: 25% de cada pedido completado
2. **Cargos Adicionales**:
   - Recogida fallida (cliente no disponible)
   - Prendas especiales (ropa de hogar con recargo)
3. **Incentivos Dinámicos**: Sistema de bonificación para pedidos en horas pico o zonas de baja oferta
4. **Tienda Virtual** (futuro): Venta de productos exclusivos para lavanderos

### Servicios Ofrecidos

#### 1. **Lavado Normal** ($48,000 por kg)

- Lavado estándar con detergentes de calidad
- Agua fría o caliente según preferencia del cliente
- Tiempo de entrega: 24 horas (secado en máquina) o 24-48-72 horas (secado al aire libre)
- **Mínimo requerido**: 10 libras por orden

**Opciones Personalizables:**

- Tipo de detergente (premium con aroma, hipoalergénico, o proporcionado por el cliente)
- Temperatura del agua (fría/caliente)
- Sin cloro
- Sin suavizante
- Sin agua caliente
- Secado colgado (sin máquina)

#### 2. **Lavado Express** ($60,000 por kg)

- Servicio completo: lavado + planchado profesional
- Ropa lista para usar
- Tiempo de entrega: Mismo día o máximo 24 horas
- **Mínimo requerido**: 10 libras por orden
- **Requisito técnico**: Solo disponible para lavanderos con **secadora funcional**
- El lavandero debe verificar que las prendas sean aptas para secadora

**Nota Importante**: El servicio express **NO permite secado al aire libre** debido a los tiempos de entrega.

#### 3. **Lavado de Zapatos** ($80,000 por kg)

- Limpieza especializada de calzado
- Deportivo y casual
- Tiempo de entrega: 24-48-72 horas
- Secado al aire recomendado

#### 4. **Ropa de Hogar** ($72,000 por kg + recargo por pieza)

- **Prendas incluidas**: Cortinas, edredones, sábanas grandes, cubrelechos, toallas grandes, almohadas grandes
- Textiles voluminosos del hogar
- **Recargo adicional**: Varía por tipo de prenda (se define al crear orden)
- Tiempo de entrega: 24-48 horas (puede extenderse hasta 72 horas si requiere secado al aire)
- **Capacidad de lavadora**: El lavandero debe tener capacidad suficiente registrada

#### 5. **Planchado por Unidad** (cobro separado)

- El cliente puede solicitar planchado de prendas específicas
- Se cobra **por unidad** de prenda
- Lista de prendas seleccionables:
  - Camisas
  - Pantalones
  - Vestidos
  - Sábanas
  - Otros textiles
- El precio se ajusta en **tiempo real** según la cantidad de prendas seleccionadas

### Requisitos y Restricciones de Servicio

#### Indicaciones Médicas/Alergias

Al crear una orden, el cliente puede indicar:

- ❌ Alergia al cloro
- ❌ Alergia al detergente en polvo
- ❌ Alergia al jabón en barra
- ❌ Sensibilidad a fragancias
- ✅ Solo productos hipoalergénicos

#### Requisitos Especiales

- 🚫 No usar agua caliente
- 🚫 No usar cloro
- 🚫 No usar suavizante
- 🚫 No secar en máquina (solo colgar)
- 🚫 No planchar ciertas prendas
- ✅ Separar por colores (blancos/colores/oscuros)
- ✅ Usar perchas proporcionadas por el cliente

#### Limitaciones del Servicio

⚠️ **Importante**: La plataforma **NO se hace responsable de remover manchas**.

- Los lavanderos **NO tratarán manchas** específicas
- El servicio es de lavado general, no de limpieza especializada
- Si una prenda tiene manchas persistentes, se lavará normalmente sin tratamiento especial
- Para manchas difíciles, se recomienda llevar a tintorería especializada

### Capacidad y Mínimos

#### Capacidad de Lavadoras

- Los lavanderos deben **registrar la capacidad** de sus lavadoras en libras
- Esto determina qué órdenes pueden aceptar
- Ejemplo: Lavadora de 20 libras puede aceptar órdenes hasta 20 libras

#### Mínimos por Servicio

**Lavado Normal**: Mínimo 10 libras  
**Lavado Express**: Mínimo 10 libras

⚠️ **Nota**: Estos valores son configurables y pueden cambiar según políticas de la plataforma.

Si la orden es menor al mínimo, se cobra el precio del mínimo (10 libras × precio por kg).

### Tiempos de Entrega según Método de Secado

#### Secado en Máquina (Secadora)

- **Lavado Normal**: 24 horas
- **Lavado Express**: Mismo día (4-8 horas)
- **Zapatos**: 24 horas
- **Ropa de Hogar**: 24-48 horas

#### Secado al Aire Libre (Colgado)

⏰ **Tiempos Variables** según condiciones climáticas y tipo de prenda:

- **24 horas**: Condiciones óptimas, prendas ligeras
- **48 horas**: Condiciones normales, prendas medianas
- **72 horas**: Condiciones húmedas, prendas gruesas o voluminosas

⚠️ **Importante**:

- Esta información debe mostrarse **claramente al cliente** al crear la orden
- El lavandero debe **confirmar el tiempo estimado** antes de aceptar la solicitud
- El cliente puede elegir entre secado en máquina (más rápido) o secado al aire (más cuidadoso)

---

## 👥 Tipos de Usuario y Roles

### 1. Cliente (Usuario Final)

**Características:**

- Persona que necesita servicios de lavandería
- Crea y gestiona pedidos
- Realiza seguimiento en tiempo real
- Paga por los servicios recibidos
- Puede calificar al lavandero después de cada servicio
- Se comunica con el lavandero vía chat interno

**Requisitos de Registro:**

✅ **Verificación de Identidad Obligatoria**

Antes de poder usar la plataforma, el cliente debe:

1. Proporcionar documento de identidad (cédula/pasaporte)
2. Completar verificación facial (selfie)
3. Confirmar número de teléfono (código SMS)
4. Verificar dirección de email
5. Esperar aprobación del sistema (proceso automático o manual)

**Propósito de la Verificación:**

- Garantizar seguridad para los lavanderos
- Prevenir fraudes y suplantación de identidad
- Generar confianza en la plataforma
- Permitir seguimiento en caso de problemas

**Datos Almacenados:**

- Nombre completo
- Email (único, usado para login)
- Teléfono de contacto
- Dirección de recogida/entrega
- Fecha de registro
- Última actualización

**Capacidades:**

- ✅ Crear nuevos pedidos
- ✅ Ver pedidos activos en tiempo real
- ✅ Ver historial de pedidos
- ✅ Eliminar pedidos pendientes
- ✅ Actualizar perfil (dirección, teléfono)
- ❌ NO puede ver pedidos de otros clientes
- ❌ NO puede tomar pedidos

### 2. Lavandero (Proveedor de Servicio)

**Características:**

- Profesional que ofrece servicios de lavandería
- Toma pedidos disponibles
- Gestiona pedidos en progreso
- Completa pedidos
- Puede calificar al cliente después de cada servicio
- Se comunica con el cliente vía chat interno

**Requisitos de Registro:**

✅ **Verificación de Identidad Obligatoria**

Antes de poder ofrecer servicios, el lavandero debe:

1. Proporcionar documento de identidad (cédula/pasaporte)
2. Completar verificación facial (selfie)
3. Confirmar número de teléfono (código SMS)
4. Verificar dirección de email
5. **Registrar capacidad de lavadora(s)** en libras
6. **Indicar si tiene secadora** (requerido para servicio express)
7. Proporcionar dirección física del negocio
8. Completar capacitación obligatoria (videos)
9. Esperar aprobación manual del equipo de Te lavo

**Propósito de la Verificación:**

- Garantizar calidad del servicio
- Verificar que cuentan con equipo adecuado
- Prevenir fraudes
- Proteger a los clientes
- Mantener estándares de la plataforma

**Capacitación Obligatoria:**

Antes de ser aprobado, el lavandero debe ver videos de capacitación sobre:

📹 **Módulo 1: Manejo de Prendas**

- Separación correcta por tipo y color
- Cuidado de telas delicadas
- Verificación de bolsillos

📹 **Módulo 2: Doblado Profesional**

- Técnicas de doblado para diferentes prendas
- Camisas, pantalones, toallas
- Presentación profesional

📹 **Módulo 3: Retiro de Pelusas**

- Uso de rodillo quitapelusas
- Limpieza de filtros de secadora
- Atención a detalles

📹 **Módulo 4: Servicio al Cliente**

- Comunicación profesional
- Manejo de quejas
- Puntualidad y compromiso

📹 **Módulo 5: Uso de la App**

- Aceptar y gestionar pedidos
- Chat con clientes
- Sistema de calificaciones

**Certificación**: Al completar todos los módulos, el lavandero recibe una certificación digital y puede comenzar a aceptar pedidos.

**Datos Almacenados:**

- Nombre del negocio/persona
- Email (único, usado para login)
- Teléfono de contacto
- Dirección/ubicación del negocio
- Capacidad de lavadora (en libras)
- Tiene secadora (sí/no)
- Servicios ofrecidos
- Total de pedidos completados
- Total ganado histórico
- Calificación promedio (1-5 estrellas)
- Fecha de registro
- Última actualización

**Capacidades:**

- ✅ Ver todos los pedidos pendientes (disponibles)
- ✅ Tomar pedidos usando transacciones (evita conflictos)
- ✅ Ver sus pedidos en progreso
- ✅ Completar pedidos
- ✅ Ver historial de pedidos completados
- ✅ Ver estadísticas (pedidos completados, ganancias)
- ✅ Calificar a clientes (1-5 estrellas + comentario)
- ✅ Comunicarse con clientes vía chat interno
- ✅ Acceder a catálogo de productos disponibles
- ✅ Ver videos de capacitación
- ❌ NO puede crear pedidos
- ❌ NO puede eliminar pedidos de clientes
- ❌ NO puede modificar pedidos de otros lavanderos

**Información Técnica Registrada:**

**Campos adicionales en el perfil:**

- **Equipamiento**:

  - Capacidad de la lavadora (en libras)
  - Tiene secadora (sí/no) - requerido para servicio express
  - Servicios que ofrece

- **Capacitación**:

  - Capacitación completada (sí/no)
  - Fecha de completación de capacitación
  - ID de certificación digital

- **Estadísticas**:
  - Total de pedidos completados
  - Total ganado histórico
  - Calificación promedio (1-5 estrellas)
  - Número de calificaciones recibidas

---

## ⭐ Sistema de Calificaciones Bidireccional

### Propósito

Mantener la calidad del servicio permitiendo que tanto **clientes como lavanderos** se califiquen mutuamente después de cada servicio completado.

### Funcionamiento

#### Calificación de Lavandero (por Cliente)

**Cuándo**: Después de que el pedido sea marcado como "Completado" y entregado.

**Componentes de la Calificación:**

1. **Estrellas** (obligatorio): 1 a 5 estrellas

   - ⭐ 1 estrella: Muy insatisfecho
   - ⭐⭐ 2 estrellas: Insatisfecho
   - ⭐⭐⭐ 3 estrellas: Aceptable
   - ⭐⭐⭐⭐ 4 estrellas: Bueno
   - ⭐⭐⭐⭐⭐ 5 estrellas: Excelente

2. **Comentario** (opcional): Hasta 500 caracteres

   - Puede detallar aspectos positivos o negativos
   - Visible para otros usuarios

3. **Categorías Específicas** (opcional):
   - Calidad del lavado
   - Puntualidad
   - Presentación de la ropa
   - Comunicación
   - Profesionalismo

**Impacto:**

- La calificación se agrega al **perfil público** del lavandero
- Se calcula el **promedio general** de todas las calificaciones
- Lavanderos con calificación baja (< 3.5) pueden ser suspendidos temporalmente
- Lavanderos destacados (> 4.8) reciben badge especial

#### Calificación de Cliente (por Lavandero)

**Cuándo**: Después de completar y entregar el pedido.

**Componentes de la Calificación:**

1. **Estrellas** (obligatorio): 1 a 5 estrellas

2. **Comentario** (opcional): Hasta 500 caracteres

   - **Privado**: Solo visible para administradores
   - No se muestra públicamente para proteger al cliente

3. **Categorías Específicas** (opcional):
   - Puntualidad en recogida/entrega
   - Estado de la ropa entregada
   - Comunicación
   - Cumplimiento de requisitos

**Impacto:**

- La calificación se registra en el **perfil interno** del cliente
- No es visible públicamente
- Clientes con calificación baja (< 3.0) pueden recibir advertencias
- Clientes problemáticos recurrentes pueden ser suspendidos

### Visualización de Calificaciones

#### Para Lavanderos (Perfil Público)

```
┌──────────────────────────────────────────────┐
│  Lavandero: Juan Pérez                       │
├──────────────────────────────────────────────┤
│  ⭐⭐⭐⭐⭐ 4.8 (127 calificaciones)           │
│                                              │
│  Calidad del lavado:      ⭐⭐⭐⭐⭐ 4.9      │
│  Puntualidad:             ⭐⭐⭐⭐☆ 4.7      │
│  Presentación:            ⭐⭐⭐⭐⭐ 4.8      │
│  Comunicación:            ⭐⭐⭐⭐☆ 4.6      │
│                                              │
│  📊 Pedidos completados: 135                 │
│  🏆 Badge: Lavandero Elite                   │
└──────────────────────────────────────────────┘

Comentarios recientes:
─────────────────────────────────────────────
María G. - ⭐⭐⭐⭐⭐
"Excelente servicio, mi ropa quedó impecable
y muy bien doblada. Súper puntual."

Carlos R. - ⭐⭐⭐⭐☆
"Buen servicio, pero llegó 30 min tarde a la
entrega. Por lo demás todo perfecto."
```

#### Para Clientes (Perfil Interno)

```
┌──────────────────────────────────────────────┐
│  Cliente: Ana Martínez (Privado)             │
├──────────────────────────────────────────────┤
│  Calificación promedio: ⭐⭐⭐⭐☆ 4.2         │
│  (8 calificaciones de lavanderos)            │
│                                              │
│  Puntualidad:       ⭐⭐⭐⭐☆ 4.0            │
│  Comunicación:      ⭐⭐⭐⭐⭐ 4.5            │
│  Estado de ropa:    ⭐⭐⭐⭐☆ 4.0            │
│                                              │
│  📊 Pedidos realizados: 12                   │
│  ✅ Estado: Cliente confiable                │
└──────────────────────────────────────────────┘
```

### Reglas de Calificación

1. **Obligatoriedad**:

   - Ambas partes deben calificar antes de poder realizar/aceptar nuevos pedidos
   - Si no califican en 7 días, el sistema asigna 3 estrellas por defecto

2. **Edición**:

   - Las calificaciones NO pueden editarse después de enviadas
   - Solo pueden ser reportadas por contenido inapropiado

3. **Respuesta**:

   - Lavanderos pueden responder a comentarios de clientes (públicamente)
   - Clientes NO pueden responder a calificaciones de lavanderos (son privadas)

4. **Penalizaciones**:
   - Calificaciones fraudulentas o spam resultan en suspensión de cuenta
   - Lenguaje ofensivo resulta en eliminación de comentario y advertencia

### Badges y Reconocimientos

**Para Lavanderos:**

🏆 **Lavandero Elite**: Promedio ≥ 4.8 con mínimo 50 pedidos  
⭐ **Lavandero Destacado**: Promedio ≥ 4.5 con mínimo 20 pedidos  
🚀 **Nuevo Lavandero**: Menos de 10 pedidos completados  
💯 **100 Servicios**: Ha completado más de 100 pedidos  
⚡ **Express Pro**: Especializado en servicio express con calificación > 4.5

**Para Clientes:**

✅ **Cliente Verificado**: Ha completado verificación de identidad  
⭐ **Cliente Frecuente**: Más de 10 pedidos realizados  
👑 **Cliente VIP**: Más de 50 pedidos y calificación > 4.5

---

## 🔔 Sistema de Notificaciones

### Propósito

Mantener a usuarios informados en **tiempo real** sobre el estado de sus pedidos y eventos importantes mediante **notificaciones push**, **email** y **notificaciones in-app**.

### Tipos de Notificaciones

#### Notificaciones para Lavanderos

##### 1. Nueva Orden Disponible 🔔

**Trigger**: Se crea un nuevo pedido con status "pending"

**Contenido**:

```
🔔 ¡Nuevo pedido disponible!

Servicio: Lavado + Planchado
Peso: 8 kg
Precio: $480,000 COP (Ganas: $360,000)
Ubicación: Calle 45 #23-15, Medellín
Recogida: Hoy a las 3:00 PM

[Ver Detalles] [Aceptar Pedido]
```

**Canales**:

- ✅ Notificación Push (prioritaria)
- ✅ In-App (badge en icono)
- ❌ Email (no, es urgente)

**Configuración**:

- Sonido especial para diferenciar
- Vibración
- Prioridad ALTA

##### 2. Recordatorio de Recogida ⏰

**Trigger**: 30 minutos antes de la hora de recogida acordada

**Contenido**:

```
⏰ Recordatorio: Recogida en 30 minutos

Pedido #12345
Cliente: María González
Dirección: Calle 45 #23-15
Hora: 3:00 PM

[Ver Mapa] [Llamar Cliente] [Chat]
```

##### 3. Cliente Esperando 📍

**Trigger**: Cliente marca que está listo y esperando

**Contenido**:

```
📍 El cliente está listo

María González confirmó que la ropa
está lista para recoger.

[Iniciar Navegación]
```

#### Notificaciones para Clientes

##### 1. Pedido Aceptado ✅

**Trigger**: Lavandero acepta el pedido (status → "in-progress")

**Contenido**:

```
✅ ¡Tu pedido fue aceptado!

Lavandero: Juan Pérez ⭐ 4.8
Experiencia: 135 pedidos completados

Recogida programada: Hoy 3:00 PM
Entrega estimada: Mañana 3:00 PM

[Chat con Juan] [Ver Perfil]
```

**Canales**:

- ✅ Notificación Push
- ✅ In-App
- ✅ Email (confirmación)

##### 2. Lavandero en Camino 🚗

**Trigger**: Lavandero inicia desplazamiento hacia la dirección de recogida

**Contenido**:

```
🚗 Tu lavandero está en camino

Juan Pérez llegará en aproximadamente 15 minutos
a recoger tu ropa.

[Rastrear en Mapa] [Llamar] [Chat]
```

##### 3. Recogida Completada 📦

**Trigger**: Lavandero confirma que recogió la ropa

**Contenido**:

```
📦 Ropa recogida exitosamente

Tu lavandero confirmó la recogida.
Peso total: 8.5 kg
Precio final: $510,000 COP

Estado: En proceso de lavado 🧺
Entrega estimada: Mañana 3:00 PM
```

##### 4. En Proceso de Lavado 🧺

**Trigger**: Lavandero actualiza status manualmente

**Contenido**:

```
🧺 Tu ropa está en proceso

Actualmente: Secado
Progreso: 75%

Entrega estimada: Mañana 3:00 PM
```

##### 5. Listo para Entrega ✨

**Trigger**: Lavandero marca pedido como listo

**Contenido**:

```
✨ ¡Tu ropa está lista!

Tu pedido está limpio, doblado y listo
para entrega.

Entrega programada: Mañana 3:00 PM

[Confirmar Disponibilidad]
```

##### 6. Lavandero en Camino a Entregar 🚚

**Trigger**: Lavandero inicia desplazamiento para entrega

**Contenido**:

```
🚚 Entrega en camino

Juan Pérez llegará en aproximadamente 20 minutos
con tu ropa limpia.

[Rastrear] [Llamar] [Chat]
```

##### 7. Pedido Completado 🎉

**Trigger**: Lavandero marca pedido como "Completed"

**Contenido**:

```
🎉 ¡Pedido entregado!

Esperamos que estés satisfecho con el servicio.

Por favor califica tu experiencia:
⭐⭐⭐⭐⭐

[Calificar Ahora] [Ver Recibo]
```

##### 8. Recordatorio de Calificación 📝

**Trigger**: 24 horas después de completar sin calificar

**Contenido**:

```
📝 No olvides calificar tu servicio

Tu opinión es importante para nosotros
y ayuda a mejorar la plataforma.

Pedido #12345 - Juan Pérez

[Calificar Ahora]
```

#### Notificaciones de Sistema

##### Para Ambos Usuarios

1. **Problemas de Pago** 💳

```
⚠️ Problema con el pago

No pudimos procesar el pago de tu pedido.
Por favor actualiza tu método de pago.

[Actualizar Tarjeta]
```

2. **Cuenta Verificada** ✅

```
✅ ¡Verificación completada!

Tu cuenta ha sido verificada exitosamente.
Ya puedes usar la plataforma.

[Comenzar]
```

3. **Nuevo Mensaje** 💬

```
💬 Nuevo mensaje de Juan Pérez

"Ya estoy en camino, llego en 10 minutos"

[Responder]
```

4. **Suspensión de Cuenta** 🚫

```
🚫 Cuenta suspendida temporalmente

Tu cuenta ha sido suspendida por:
[Razón específica]

Duración: 7 días
Apelación: [Contactar Soporte]
```

### Configuración de Notificaciones

Los usuarios pueden configurar:

```
┌─────────────────────────────────────────┐
│  Configuración de Notificaciones        │
├─────────────────────────────────────────┤
│                                         │
│  Notificaciones Push                    │
│  ☑ Nuevos pedidos disponibles           │
│  ☑ Actualizaciones de estado            │
│  ☑ Mensajes de chat                     │
│  ☑ Recordatorios de recogida/entrega    │
│  ☐ Promociones y ofertas                │
│                                         │
│  Email                                  │
│  ☑ Confirmación de pedidos              │
│  ☑ Recibos y facturas                   │
│  ☐ Newsletter semanal                   │
│                                         │
│  Sonido                                 │
│  ☑ Activar sonido                       │
│  ☑ Vibración                            │
│                                         │
│  Horario (No Molestar)                  │
│  Desde: 10:00 PM                        │
│  Hasta: 7:00 AM                         │
│                                         │
│         [Guardar Cambios]               │
└─────────────────────────────────────────┘
```

### Tecnología de Notificaciones

**Push Notifications**: Firebase Cloud Messaging (FCM)

- Multiplataforma (Android, iOS, Web)
- Entrega garantizada
- Prioridad configurable

**Email**: SendGrid o similar

- Templates personalizados
- Tracking de apertura

**In-App**: Badges y alertas dentro de la aplicación

- Tiempo real vía Firebase
- Persistentes hasta ser leídas

---

## 🔄 Flujo de Negocio Completo

### Ciclo de Vida de un Pedido

```
┌─────────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA DEL PEDIDO                     │
└─────────────────────────────────────────────────────────────────┘

1. CREACIÓN (Cliente)
   ↓
   Cliente completa formulario:
   - Tipo de servicio
   - Peso estimado (kg)
   - Fecha y hora de recogida
   - Instrucciones especiales
   ↓
   Sistema calcula precio automáticamente
   ↓
   Cliente confirma y crea pedido
   ↓
   Estado: PENDING (Pendiente)
   ↓

2. VISUALIZACIÓN (Lavanderos)
   ↓
   Todos los lavanderos ven el pedido en "Pedidos Disponibles"
   ↓
   El pedido aparece en tiempo real sin recargar página
   ↓

3. ASIGNACIÓN (Primer lavandero en tomar)
   ↓
   Lavandero hace clic en "Aceptar Pedido"
   ↓
   Sistema muestra confirmación de horarios:
   ┌──────────────────────────────────────────┐
   │ Confirmar Aceptación                     │
   ├──────────────────────────────────────────┤
   │ Horario de RECOGIDA:                     │
   │ 📅 Hoy, 25 Nov 2025                      │
   │ ⏰ 3:00 PM                                │
   │                                          │
   │ Horario de ENTREGA:                      │
   │ 📅 Mañana, 26 Nov 2025                   │
   │ ⏰ 3:00 PM                                │
   │                                          │
   │ ⚠️ Estos horarios son FIJOS              │
   │ Debes cumplirlos puntualmente            │
   │                                          │
   │ [Cancelar] [Confirmar y Aceptar]         │
   └──────────────────────────────────────────┘
   ↓
   Lavandero confirma horarios
   ↓
   Sistema usa TRANSACCIÓN de Firestore:
   - Verifica que el pedido está disponible
   - Si otro lavandero ya lo tomó → Error
   - Si está disponible → Asigna al lavandero
   ↓
   Estado: IN-PROGRESS (En Progreso)
   lavanderoId: [ID del lavandero]
   startedAt: [timestamp]
   horarioRecogidaAceptado: true
   horarioEntregaAceptado: true
   ↓
   ⚡ Actualización en tiempo real:
   - Desaparece de "Disponibles" para otros lavanderos
   - Aparece en "En Progreso" del lavandero asignado
   - Cliente ve que tiene lavandero asignado
   - Ambos reciben notificación con horarios confirmados
   ↓

4. PROCESO (Lavandero)
   ↓
   **FASE 1: RECOGIDA** (Horario Fijo Acordado)
   ↓
   30 minutos antes del horario:
   - Sistema envía recordatorio al lavandero
   - Lavandero confirma que está en camino
   ↓
   En el horario acordado (ejemplo: 3:00 PM):
   - Lavandero llega a la dirección
   - Recoge la ropa del cliente
   - Verifica peso aproximado
   - Confirma recogida en la app
   ↓
   Si cliente NO está disponible:
   - Lavandero espera 10 minutos
   - Intenta contactar (llamada/chat)
   - Si no hay respuesta → Reporta "No disponible"
   - Sistema genera cargo adicional ($15,000)
   - Pedido se cancela
   ↓
   Si recogida exitosa:
   - Lavandero confirma en app: "Ropa Recogida"
   - Ingresa peso real (si difiere del estimado)
   - Sistema recalcula precio si es necesario
   - Cliente recibe notificación
   ↓
   **FASE 2: PROCESAMIENTO**
   ↓
   Lavandero:
   - Transporta ropa a su establecimiento
   - Separa por tipo/color
   - Verifica instrucciones especiales
   - Realiza lavado según especificaciones
   - Seca (máquina o aire libre según acordado)
   - Plancha (si fue solicitado)
   - Dobla y empaca profesionalmente
   - Retira pelusas
   ↓
   Durante el proceso puede actualizar:
   - "En lavado" 🧺
   - "En secado" 🌬️
   - "En planchado" 👔
   - "Listo para entrega" ✨
   ↓
   **FASE 3: ENTREGA** (Horario Fijo Acordado)
   ↓
   30 minutos antes del horario de entrega:
   - Sistema envía recordatorio a lavandero
   - Sistema envía recordatorio a cliente
   ↓
   En el horario acordado (ejemplo: Mañana 3:00 PM):
   - Lavandero se desplaza a dirección del cliente
   - Confirma "En camino" en la app
   - Cliente recibe notificación con tiempo estimado
   ↓
   Al llegar:
   - Lavandero entrega ropa limpia y doblada
   - Cliente verifica (opcional)
   - Lavandero hace clic en "Confirmar Entrega"
   ↓
   Si cliente NO está disponible:
   - Lavandero espera 10 minutos
   - Intenta contactar
   - Si no hay respuesta → Reporta "No disponible"
   - Sistema genera cargo adicional ($10,000)
   - Se programa nueva entrega
   ↓
   Si entrega exitosa:
   - Lavandero confirma: "Pedido Entregado"
   - Sistema marca pedido como Completado
   ↓
   Estado: COMPLETED (Completado)
   completedAt: [timestamp]
   entregadoEnHorario: true/false
   ↓
   ⚡ Actualización en tiempo real:
   - Desaparece de "En Progreso" del lavandero
   - Aparece en "Completados" del lavandero
   - Cliente ve pedido completado
   - Sistema solicita calificación a ambos
   ↓

5. FINALIZACIÓN
   ↓
   Sistema automáticamente (Cloud Functions):
   - Actualiza estadísticas del lavandero
   - Actualiza estadísticas generales
   - Envía notificación al cliente (si configurado)
   - Genera registro para reportes
   ↓
   Pedido archivado en historial
```

### Casos Especiales

#### Caso 1: Cliente Elimina Pedido Pendiente

```
Cliente elimina pedido (status: pending)
   ↓
deleteOrder() elimina documento de Firestore
   ↓
⚡ Listener en TIEMPO REAL detecta 'removed'
   ↓
Firebase envía snapshot sin el pedido
   ↓
UI del cliente se actualiza → pedido desaparece
   ↓
Lavanderos también ven actualización → pedido desaparece
```

#### Caso 2: Cliente Elimina Pedido Ya Tomado

```
Cliente elimina pedido (status: in-progress)
   ↓
deleteOrder() elimina documento de Firestore
   ↓
⚡ Listener del CLIENTE detecta 'removed'
   ↓
UI del cliente se actualiza → pedido desaparece
   ↓
⚡ Listener del LAVANDERO detecta 'removed'
   ↓
UI del lavandero se actualiza → pedido desaparece
   ↓
Sincronización perfecta en tiempo real
```

#### Caso 3: Dos Lavanderos Intentan Tomar el Mismo Pedido

```
Lavandero A hace clic → Transacción inicia
Lavandero B hace clic → Transacción inicia
   ↓
TRANSACCIÓN DE FIRESTORE (garantiza atomicidad)
   ↓
Lavandero A llega primero:
   ✅ Verifica: pedido disponible
   ✅ Asigna: lavanderoId = A
   ✅ Actualiza: status = in-progress
   ✅ Confirma transacción
   ↓
Lavandero B llega segundo:
   ❌ Verifica: pedido YA tiene lavanderoId
   ❌ Lanza error: "El pedido no está disponible"
   ❌ Rechaza transacción
   ↓
Lavandero A: Ve pedido en "En Progreso"
Lavandero B: Ve error y pedido desaparece de disponibles
```

---

## 📊 Estructura de Datos

### Colección: `pedidos`

**Propósito**: Almacena todos los pedidos del sistema

**Campos principales:**

#### Identificación

- ID único del pedido
- Fecha y hora de creación

#### Información del Cliente

- ID del cliente
- Nombre, email, teléfono
- Dirección de recogida/entrega con detalles (apto, piso, etc.)
- Ubicación GPS (opcional)

#### Asignación del Lavandero

- ID del lavandero (null si está disponible)
- Nombre del lavandero
- Calificación del lavandero al momento de tomar el pedido

#### Detalles del Servicio

- Tipo de servicio (Lavado Normal, Express, Zapatos, Ropa de Hogar)
- Peso estimado (kg/libras)
- Peso real confirmado al recoger
- Mínimo de libras requeridas (ej: 10 lbs)

#### Estado del Pedido

Estados posibles:

- **Pendiente**: Esperando ser tomado por un lavandero
- **En Progreso**: Lavandero asignado, en proceso
- **Lavando**: Ropa en lavadora
- **Secando**: Ropa en secado
- **Listo**: Terminado, esperando entrega
- **Completado**: Entregado y finalizado
- **Cancelado**: Pedido cancelado

#### Horarios Fijos

**Recogida**:

- Fecha y hora fija acordada
- Confirmación del lavandero
- Hora real de recogida
- Indicador de puntualidad

**Entrega**:

- Fecha y hora fija acordada
- Confirmación del lavandero
- Hora real de entrega
- Indicador de puntualidad

#### Preferencias de Lavado

**Alergias**: Lista de alergias (cloro, detergentes, fragancias, etc.)

**Preferencias**:

- Tipo de detergente (premium, hipoalergénico, el cliente proporciona)
- Temperatura del agua (fría, caliente, tibia)
- Uso de cloro (sí/no)
- Uso de suavizante (sí/no)
- Separar colores (sí/no)

**Método de Secado**:

- Secadora (24 horas)
- Aire libre (24-72 horas)
- Aire en perchas (24-72 horas)
- Tiempo estimado de entrega según método

#### Planchado

- Requiere planchado (sí/no)
- Planchado por unidad o todo junto
- Lista de prendas a planchar con cantidad y precio
  - Ejemplo: 5 camisas × $3.000 = $15.000
  - Ejemplo: 2 pantalones × $4.000 = $8.000
- Subtotal de planchado

#### Ropa de Hogar

- Incluye ropa de hogar (sí/no)
- Lista de prendas con recargo especial:
  - Edredones (King, Queen, Individual)
  - Cortinas grandes
  - Toallas de baño grandes
  - Sábanas especiales
- Subtotal de recargos por ropa de hogar

#### Precios y Pagos

- Precio total estimado inicial
- Precio total real (después de confirmar peso)
- Total de planchado
- Total de recargos por ropa de hogar
- Incentivo económico (si aplica)
- Cargos adicionales (recogidas fallidas, etc.)
- Estado de pago (pendiente, pagado, vencido)

#### Sistema de Incentivos

- Tiene incentivo (sí/no)
- Monto del incentivo (va 100% al lavandero)
- Razón: baja disponibilidad, horario complicado, urgente

#### Cargos Adicionales

Lista de cargos extras con:

- Tipo (recogida fallida, entrega fallida, peso extra)
- Monto
- Fecha del cargo
- Estado (pagado/pendiente)

**Regla**: Si el cliente tiene cargos pendientes, no puede crear nuevos pedidos.

#### Evidencias

**Al Recoger**:

- Fotos de la ropa recibida
- Peso confirmado
- Fecha y hora

**Al Entregar**:

- Fotos de la ropa entregada
- Fecha y hora

#### Instrucciones y Notas

- Descripción automática generada
- Instrucciones especiales del cliente
- Notas internas del lavandero

#### Calificaciones

**Calificación al Lavandero (por Cliente)**:

- Estrellas (1-5)
- Comentario público
- Categorías detalladas:
  - Calidad del lavado
  - Puntualidad
  - Presentación
  - Comunicación

**Calificación al Cliente (por Lavandero)**:

- Estrellas (1-5)
- Comentario privado (solo para administración)
- Categorías:
  - Puntualidad
  - Estado de la ropa
  - Comunicación

#### Chat

- Estado del chat (activo/archivado)
- Último mensaje (texto, remitente, fecha)
- Contador de mensajes no leídos (cliente y lavandero)

#### Seguro (futuro)

- Contrató seguro (sí/no)
- Valor total asegurado
- Lista de prendas aseguradas con su valor individual

#### Historial de Cambios

Registro completo de:

- Cambios de estado
- Fecha y hora de cada cambio
- Usuario que realizó el cambio

### Colección: `clientes`

**Propósito**: Información de perfil de los clientes

**Campos**:

- ID único del cliente
- Nombre completo
- Email
- Teléfono de contacto
- Dirección predeterminada
- Fecha de registro
- Última actualización de perfil

### Colección: `lavanderos`

**Propósito**: Información de perfil de los lavanderos

**Campos**:

- ID único del lavandero
- Nombre completo o del negocio
- Email
- Teléfono de contacto
- Dirección/ubicación del negocio
- Capacidad de la lavadora (en libras)
- Tiene secadora (sí/no)
- Servicios que ofrece
- Horarios disponibles

**Estadísticas**:

- Total de pedidos completados
- Total ganado histórico
- Calificación promedio (1-5 estrellas)
- Fecha de registro
- Última actualización de perfil

### Colección: `notifications`

**Propósito**: Notificaciones automáticas para usuarios

**Campos**:

- ID del usuario destinatario
- Tipo de notificación:
  - Cambio de estado del pedido
  - Lavandero asignado
  - Recordatorio de recogida/entrega
  - Solicitud de calificación
- Título de la notificación
- Mensaje
- ID del pedido relacionado
- Leída (sí/no)
- Fecha de creación

**Limpieza**: Las notificaciones leídas con más de 30 días se eliminan automáticamente.

### Colección: `stats`

**Propósito**: Estadísticas generales del sistema

**Campos**:

- Total de pedidos creados
- Total de pedidos completados
- Pedidos pendientes actuales
- Pedidos en progreso actuales
- Ingresos totales del sistema
- Número de lavanderos activos
- Número de clientes activos
- Última actualización

---

## 🔐 Funcionalidades por Usuario

### Dashboard del Cliente (cliente.html)

#### Pantalla Principal

**Secciones Visibles:**

1. **Pedidos Activos**

   - Muestra pedidos con status: `pending` o `in-progress`
   - Actualización en tiempo real
   - Botón "Eliminar" solo para pendientes

2. **Historial de Pedidos**

   - Todos los pedidos del cliente ordenados por fecha
   - Filtros: Todos | Pendientes | En Progreso | Completados
   - Actualización en tiempo real

3. **Perfil**
   - Actualizar dirección
   - Actualizar teléfono
   - Ver email (no editable)

#### Crear Nuevo Pedido

**Formulario:**

```
┌─────────────────────────────────────────┐
│         CREAR NUEVO PEDIDO              │
├─────────────────────────────────────────┤
│                                         │
│ Tipo de Servicio: [Dropdown]           │
│   - Lavado                              │
│   - Lavado y Planchado                  │
│   - Zapatos                             │
│   - Ropa de Hogar                       │
│                                         │
│ Peso (kg): [Input numérico]            │
│                                         │
│ Fecha de Recogida: [Date picker]       │
│                                         │
│ Hora de Recogida: [Time picker]        │
│                                         │
│ Instrucciones Especiales: [Textarea]   │
│                                         │
├─────────────────────────────────────────┤
│ RESUMEN:                                │
│ Precio por kg: $XX,XXX COP             │
│ Peso: X kg                              │
│ ─────────────────────────                │
│ TOTAL: $XXX,XXX COP                     │
├─────────────────────────────────────────┤
│         [Crear Pedido]                  │
└─────────────────────────────────────────┘
```

**Validaciones:**

- Tipo de servicio: requerido
- Peso: mínimo 0.1 kg, máximo 50 kg
- Fecha: debe ser al menos 2 horas en el futuro
- Hora: formato válido HH:MM
- Instrucciones: opcional, máximo 500 caracteres

**Proceso al Crear:**

1. Cliente completa formulario
2. Sistema calcula precio en tiempo real
3. Cliente hace clic en "Crear Pedido"
4. Sistema valida datos
5. Sistema crea el pedido con:
   - Información del cliente
   - Estado: "Pendiente"
   - Sin lavandero asignado
   - Detalles del servicio solicitado
6. Sistema actualiza automáticamente todas las interfaces
7. Lavanderos ven el nuevo pedido disponible inmediatamente

#### Eliminar Pedido

**Restricciones:**

- Solo pedidos con status: `pending`
- Solo el dueño del pedido puede eliminarlo

**Proceso:**

**Flujo:**

1. Cliente hace clic en "Eliminar"
2. Sistema muestra confirmación
3. Cliente confirma
4. Sistema elimina el pedido
5. La interfaz se actualiza automáticamente (el pedido desaparece)

### Dashboard del Lavandero (lavandero.html)

#### Pantalla Principal

**Secciones (Tabs):**

1. **Pedidos Disponibles**

   - Todos los pedidos con status: `pending` y `lavanderoId: null`
   - Actualización en tiempo real
   - Botón "Aceptar Pedido" (usa transacciones)

2. **En Progreso**

   - Pedidos donde `lavanderoId === currentUser.uid` y `status === 'in-progress'`
   - Botón "Marcar como Completado"

3. **Completados**
   - Pedidos donde `lavanderoId === currentUser.uid` y `status === 'completed'`
   - Solo lectura

#### Tomar Pedido (Transacción)

**Proceso Detallado:**

**Flujo:**

1. Lavandero hace clic en "Aceptar Pedido"
2. Sistema verifica que el pedido está disponible
3. Sistema asigna el pedido al lavandero usando transacciones seguras
4. Si otro lavandero ya lo tomó, muestra mensaje "Pedido ya fue tomado"
5. Si fue exitoso:
   - Pedido desaparece de "Disponibles"
   - Aparece en "En Progreso" del lavandero
   - Cliente ve que su pedido fue aceptado
   - Se envía notificación al cliente

**Ventajas de las Transacciones:**

- ✅ Evita condiciones de carrera (race conditions)
- ✅ Garantiza que solo UN lavandero tome el pedido
- ✅ Operación atómica (todo o nada)
- ✅ Consistencia de datos garantizada

#### Completar Pedido

**Proceso:**

**Flujo:**

1. Lavandero hace clic en "Marcar como Completado"
2. Sistema actualiza el estado del pedido a "Completado"
3. Actualización en tiempo real:
   - Pedido se mueve de "En Progreso" a "Completados"
   - Cliente ve que su pedido fue completado
4. Sistema automáticamente:
   - Actualiza estadísticas del lavandero
   - Actualiza estadísticas generales del sistema
   - Envía notificación al cliente
   - Solicita calificación mutua

---

## 💰 Sistema de Precios y Pagos

### Distribución de Pagos

**Por Cada Servicio Completado:**

```
┌──────────────────────────────────────────────────┐
│  EJEMPLO: Pedido de $100,000 COP                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  Precio Total:              $100,000 COP         │
│                                                  │
│  Comisión Plataforma (25%):  $25,000 COP        │
│  Pago al Lavandero (75%):    $75,000 COP        │
│                                                  │
│  ── Propinas (opcional, en efectivo) ──         │
│  Propina:                     $5,000 COP        │
│  → Entregada directamente al lavandero          │
│  → NO pasa por la plataforma                    │
└──────────────────────────────────────────────────┘
```

**Importante**:

- La plataforma procesa el pago total
- Retiene su 25% de comisión
- Transfiere el 75% al lavandero
- Las propinas NO pasan por la plataforma (solo efectivo)

### Métodos de Pago

#### Para Clientes

**Pagos Aceptados:**

- 💳 Tarjeta de Crédito (Visa, Mastercard, American Express)
- 💳 Tarjeta de Débito
- 📱 PSE (futuro)
- 📱 Nequi, Daviplata (futuro)

**Proceso de Pago:**

1. **Al Crear Orden**: Se autoriza el monto (no se cobra aún)
2. **Al Confirmar Peso**: Se ajusta el monto según peso real
3. **Al Completar Servicio**: Se realiza el cobro efectivo
4. **Distribución Automática**: 25% plataforma, 75% lavandero

#### Para Lavanderos

**Recepción de Pagos:**

- Transferencia bancaria semanal
- Mínimo acumulado: $50,000 COP
- Se envía todos los lunes
- Plazo: 2-3 días hábiles
- Comisión de transferencia: $0 (cubierta por la plataforma)

**Dashboard de Ganancias:**

```
┌──────────────────────────────────────────────────┐
│  GANANCIAS - Semana del 20-26 Nov 2025           │
├──────────────────────────────────────────────────┤
│                                                  │
│  Pedidos completados: 15                         │
│  Total facturado: $1,500,000 COP                 │
│  Tu ganancia (75%): $1,125,000 COP              │
│                                                  │
│  ── Propinas en efectivo ──                     │
│  Propinas recibidas: ~$75,000 COP               │
│  (Estimado, no procesado por app)               │
│                                                  │
│  ── Próxima Transferencia ──                    │
│  Fecha: Lunes 27 Nov 2025                       │
│  Monto: $1,125,000 COP                          │
│  Cuenta: **** **** **** 1234                    │
│                                                  │
│         [Ver Historial Detallado]               │
└──────────────────────────────────────────────────┘
```

### Cargos Adicionales y Penalizaciones

#### 1. Recogida Fallida (Cliente No Disponible)

**Situación**: El lavandero llega a recoger la ropa pero:

- El cliente no está presente
- La ropa no está lista/preparada
- El cliente no dejó la bolsa en el lugar acordado
- No hay acceso al edificio/casa

**Cargo**: $15,000 COP

**Proceso**:

1. Lavandero reporta "Cliente no disponible" en la app
2. Sistema requiere evidencia:
   - Foto del lugar (opcional)
   - Confirmación de hora de llegada (GPS)
   - Intentos de contacto (llamada/mensaje)
3. Sistema valida la información
4. Se genera cargo adicional en cuenta del cliente
5. **Bloqueo**: El cliente **NO puede crear nuevas órdenes** hasta pagar el cargo
6. Notificación al cliente: "Tienes un cargo pendiente de $15,000 COP"

**Pago del Cargo**:

```
┌──────────────────────────────────────────────────┐
│  ⚠️ CARGO PENDIENTE                             │
├──────────────────────────────────────────────────┤
│                                                  │
│  Concepto: Recogida fallida                     │
│  Pedido: #12345                                  │
│  Fecha: 25 Nov 2025, 3:00 PM                    │
│                                                  │
│  Motivo:                                         │
│  "Cliente no estaba en el domicilio             │
│  acordado. Esperé 10 minutos."                  │
│                                                  │
│  Monto a pagar: $15,000 COP                     │
│                                                  │
│  ⚠️ No podrás crear nuevas órdenes hasta        │
│  resolver este pago.                            │
│                                                  │
│  [Pagar Ahora] [Reportar Problema]              │
└──────────────────────────────────────────────────┘
```

**Distribución del Cargo**:

- 50% para el lavandero ($7,500) - compensación por tiempo perdido
- 50% para la plataforma ($7,500) - gestión administrativa

#### 2. Entrega Fallida (Cliente No Disponible)

**Situación**: El lavandero llega a entregar pero el cliente no está disponible.

**Cargo**: $10,000 COP (menor que recogida porque la ropa ya está procesada)

**Proceso**: Similar a recogida fallida

#### 3. Ropa de Hogar - Recargo por Pieza

**Situación**: Prendas voluminosas requieren ciclo exclusivo de lavado.

**Ejemplos de Recargos**:

- Edredón queen/king: +$12,000 COP
- Cortinas grandes: +$8,000 COP
- Cobertor grueso: +$10,000 COP
- Almohadas grandes: +$5,000 COP c/u

**Cálculo**:

```
Ejemplo:
Base: 5 kg de ropa normal × $72,000 = $360,000
+ 1 edredón king                   = $ 12,000
+ 2 almohadas                      = $ 10,000
─────────────────────────────────────────────
SUBTOTAL:                            $382,000
Tarifa de servicio:                  $  3,000
─────────────────────────────────────────────
TOTAL:                               $385,000
```

#### 4. Planchado por Unidad

**Situación**: Cliente solicita planchado de prendas específicas.

**Tarifas por Prenda**:

- Camisa/blusa: $3,000 COP
- Pantalón/jean: $4,000 COP
- Vestido corto: $5,000 COP
- Vestido largo: $8,000 COP
- Sábana individual: $4,000 COP
- Sábana doble/queen: $6,000 COP
- Sábana king: $8,000 COP
- Mantel: $5,000 COP

**Cálculo en Tiempo Real**:

El cliente selecciona en la app:

```
┌──────────────────────────────────────────────────┐
│  PLANCHADO POR UNIDAD                            │
├──────────────────────────────────────────────────┤
│                                                  │
│  ☑ 5 Camisas       ($3,000 c/u)  = $ 15,000    │
│  ☑ 2 Pantalones    ($4,000 c/u)  = $  8,000    │
│  ☑ 1 Vestido corto ($5,000 c/u)  = $  5,000    │
│  ☐ Sábanas                                       │
│                                                  │
│  ────────────────────────────────────────       │
│  SUBTOTAL PLANCHADO:                $28,000     │
│                                                  │
│  [Agregar Más] [Continuar]                      │
└──────────────────────────────────────────────────┘
```

### Sistema de Incentivos

#### ¿Cuándo se Activa?

Cuando **NO se encuentra un lavandero disponible** después de:

- 30 minutos sin aceptación
- O rechazo de 3+ lavanderos

**Objetivo**: Motivar a los lavanderos a aceptar pedidos en zonas o horarios de baja oferta.

#### Proceso

```
┌────────────────────────────────────────────────────┐
│  PASO 1: Pedido sin aceptar                        │
│  ────────────────────────────────────────────      │
│  El sistema detecta que el pedido lleva            │
│  30 minutos sin ser aceptado.                      │
└────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────┐
│  PASO 2: Oferta de Incentivo al Cliente            │
│  ────────────────────────────────────────────      │
│  💡 ¿Tu pedido es urgente?                         │
│                                                    │
│  Parece que hay poca disponibilidad en tu zona.   │
│  Puedes agregar un incentivo para aumentar        │
│  las posibilidades de que sea aceptado.           │
│                                                    │
│  Incentivo sugerido: $20,000 - $50,000 COP       │
│                                                    │
│  [Agregar $20,000] [Agregar $35,000]              │
│  [Agregar $50,000] [Personalizar]                 │
│  [No, seguir esperando]                           │
└────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────┐
│  PASO 3: Pedido Re-publicado con Incentivo         │
│  ────────────────────────────────────────────      │
│  🔔 Pedido con INCENTIVO disponible                │
│                                                    │
│  Servicio: Lavado + Planchado                     │
│  Peso: 8 kg                                       │
│  Precio base: $480,000 COP                        │
│  💰 INCENTIVO: +$35,000 COP                       │
│  ────────────────────────────────────────────     │
│  TOTAL GANANCIAS: $395,000 COP                    │
│  (75% de $480,000 + $35,000 completo)             │
│                                                    │
│  [Aceptar Pedido]                                 │
└────────────────────────────────────────────────────┘
```

**Distribución del Incentivo**:

- 100% para el lavandero
- La plataforma NO cobra comisión sobre el incentivo
- El incentivo es adicional a la ganancia normal (75%)

**Ejemplo de Ganancia con Incentivo**:

```
Precio del servicio:        $480,000
Ganancia normal (75%):      $360,000
+ Incentivo (100%):         $ 35,000
───────────────────────────────────
GANANCIA TOTAL:             $395,000
```

### Precios Base por Servicio

**Tabla de Precios Base:**

- **Lavado Normal**: $48,000 COP por kg
- **Lavado + Planchado**: $60,000 COP por kg
- **Zapatos**: $80,000 COP por kg
- **Ropa de Hogar**: $72,000 COP por kg
- **Servicio Express**: +$12,000 COP adicionales

### Cálculo de Precio Total

**Fórmula:**

```
Precio Total = Precio Base × Peso (kg)
```

**Ejemplo 1:**

```
Servicio: Lavado
Peso: 5 kg
Precio Base: $48,000 COP/kg
──────────────────────────────
Precio Total = $48,000 × 5 = $240,000 COP
```

**Ejemplo 2:**

```
Servicio: Lavado y Planchado
Peso: 3.5 kg
Precio Base: $60,000 COP/kg
──────────────────────────────
Precio Total = $60,000 × 3.5 = $210,000 COP
```

### Cálculo Automático

El sistema calcula automáticamente el precio total basándose en:

- Tipo de servicio seleccionado
- Peso estimado
- Servicios adicionales (planchado, ropa de hogar)
- Incentivos (si aplica)

El cálculo se realiza en tiempo real y se muestra al cliente antes de confirmar el pedido.

### Tarifas Adicionales (Mencionadas en FAQ)

Aunque no implementadas actualmente en el código, el sistema contempla:

1. **Tarifa de Confianza y Seguridad**: $3 por pedido
2. **Precios Dinámicos**: Para incentivar lavanderos en horas pico
3. **Tarifa por Recogida Perdida**: $10 si el cliente no está
4. **Tarifa por Insalubridad**: $20 si la ropa no cumple estándares
5. **Cargo Mínimo**: $30 por pedido

---

## ⚡ Actualizaciones en Tiempo Real

### Concepto

El sistema actualiza automáticamente la información en las pantallas de clientes y lavanderos **sin necesidad de recargar la página**. Todos los cambios son visibles instantáneamente.

### Funcionalidad para Clientes

**¿Qué se actualiza automáticamente?**

- Cuando un lavandero acepta el pedido
- Cuando el estado del pedido cambia (en progreso, lavando, secando, listo)
- Cuando el lavandero está en camino
- Cuando el servicio se completa
- Cuando llega un nuevo mensaje del lavandero
- Cuando hay cargos adicionales

**Beneficio**: El cliente siempre sabe el estado actual de su pedido sin tener que preguntar o actualizar la página.

### Funcionalidad para Lavanderos

**¿Qué se actualiza automáticamente?**

- Cuando aparece un nuevo pedido disponible
- Cuando otro lavandero toma un pedido (desaparece de la lista)
- Cuando un cliente cancela un pedido
- Cuando el cliente envía un mensaje
- Cuando el cliente califica el servicio

**Beneficio**: El lavandero ve inmediatamente las oportunidades de trabajo disponibles.

### Sincronización

**Regla de Negocio**: El sistema garantiza que cliente y lavandero siempre vean la misma información actualizada. Si un lavandero cambia el estado a "En camino", el cliente lo ve inmediatamente.

### Funcionamiento Offline

Si el usuario pierde conexión a internet:

- Puede seguir viendo la información cargada
- Puede seguir navegando en la aplicación
- Los cambios que haga se guardan localmente
- Cuando recupere la conexión, todo se sincroniza automáticamente

### Ventajas

1. **No requiere recargar la página**: La experiencia es fluida
2. **Información siempre actualizada**: No hay datos desactualizados
3. **Respuesta instantánea**: Cambios visibles en menos de 1 segundo
4. **Eficiente**: Solo se transmiten los cambios, no todo repetidamente
5. **Funciona offline**: La app sigue funcionando sin internet

---

## 🔒 Seguridad y Políticas de Acceso

### Principios de Seguridad

El sistema implementa controles de acceso estrictos para proteger la información de usuarios y garantizar que cada persona solo pueda ver y modificar lo que le corresponde.

### Políticas para Perfiles de Cliente

**¿Qué puede hacer un cliente con su perfil?**

- ✅ Ver su propia información
- ✅ Actualizar su dirección, teléfono, nombre
- ❌ NO puede ver información de otros clientes
- ❌ NO puede modificar información de otros clientes

**Requisito**: Debe estar autenticado en el sistema.

### Políticas para Perfiles de Lavandero

**¿Qué puede ver un usuario sobre lavanderos?**

- ✅ Cualquier usuario autenticado puede ver perfiles públicos de lavanderos
- ✅ Puede ver calificaciones y estadísticas de lavanderos
- ✅ Puede ver servicios ofrecidos

**¿Qué puede modificar un lavandero?**

- ✅ Puede actualizar SU PROPIO perfil
- ✅ Puede actualizar sus servicios ofrecidos
- ❌ NO puede modificar el perfil de otros lavanderos
- ❌ NO puede modificar sus propias calificaciones

### Políticas para Pedidos

#### Visualización de Pedidos

**Cliente**:

- ✅ Puede ver SOLO sus propios pedidos
- ❌ NO puede ver pedidos de otros clientes

**Lavandero**:

- ✅ Puede ver TODOS los pedidos pendientes (disponibles para tomar)
- ✅ Puede ver los pedidos que él mismo aceptó
- ❌ NO puede ver pedidos de otros lavanderos

#### Creación de Pedidos

- ✅ Cualquier usuario autenticado puede crear pedidos
- ❌ Usuario no autenticado NO puede crear pedidos

#### Modificación de Pedidos

**Cliente**:

- ✅ Puede modificar su pedido SI está en estado "pendiente"
- ✅ Puede cancelar su pedido en cualquier momento
- ❌ NO puede modificar pedidos que ya fueron aceptados por un lavandero

**Lavandero**:

- ✅ Puede tomar un pedido pendiente (asignárselo)
- ✅ Puede actualizar el estado de pedidos que ya aceptó
- ✅ Puede agregar notas internas al pedido
- ❌ NO puede modificar el precio sin justificación
- ❌ NO puede eliminar pedidos

#### Eliminación de Pedidos

- ✅ SOLO el cliente puede eliminar su propio pedido
- ❌ El lavandero NO puede eliminar pedidos

### Validaciones Automáticas

#### Al Crear un Pedido

El sistema valida automáticamente:

1. **Autenticación**: Usuario debe estar autenticado
2. **Tipo de servicio válido**: Debe ser uno de los servicios ofrecidos
3. **Peso**: Debe estar entre 0.1 kg y 50 kg
4. **Fecha de recogida**: Debe ser al menos 2 horas en el futuro
5. **Perfil completo**: Cliente debe tener dirección y teléfono registrados

Si alguna validación falla, el sistema rechaza la creación del pedido.

#### Al Tomar un Pedido

El sistema valida automáticamente:

1. **Lavandero existe**: El lavandero debe estar registrado
2. **Pedido disponible**: El pedido debe estar en estado "pendiente"
3. **Sin asignación previa**: El pedido NO debe tener otro lavandero asignado
4. **Capacidad**: El lavandero no debe tener más de 5 pedidos activos

### Regla de Integridad: Asignación de Pedidos

**Problema**: ¿Qué pasa si dos lavanderos intentan tomar el mismo pedido al mismo tiempo?

**Solución**: El sistema usa transacciones atómicas para garantizar que:

- Solo UN lavandero puede tomar el pedido
- El primero en confirmar se lo lleva
- El segundo recibe un mensaje de "Pedido ya fue tomado"

Esta regla evita conflictos y garantiza que nunca dos lavanderos trabajen en el mismo pedido.

---

## 🤖 Automatizaciones del Sistema

### Propósito

El sistema ejecuta automáticamente ciertos procesos sin intervención manual para garantizar la consistencia y eficiencia del servicio.

### Notificaciones Automáticas

#### Cambio de Estado de Pedido

**Cuándo**: Cada vez que el estado de un pedido cambia

**Qué hace**:

- Detecta el cambio de estado (pendiente → en progreso → completado)
- Envía notificación push al cliente
- Envía email al cliente
- Registra la notificación en el sistema

#### Asignación de Lavandero

**Cuándo**: Cuando un lavandero acepta un pedido

**Qué hace**:

- Notifica al cliente que su pedido fue aceptado
- Envía información del lavandero (nombre, calificación)
- Confirma horarios de recogida y entrega

#### Recordatorios

**Cuándo**: 30 minutos antes de recogida/entrega

**Qué hace**:

- Envía recordatorio al lavandero
- Envía recordatorio al cliente
- Solicita confirmación de disponibilidad

### Validaciones Automáticas

#### Al Crear Pedido

El sistema valida automáticamente:

- ✅ Usuario está autenticado
- ✅ Todos los campos requeridos están presentes
- ✅ Tipo de servicio es válido
- ✅ Peso está dentro del rango permitido (0.1 - 50 kg)
- ✅ Fecha de recogida es al menos 2 horas en el futuro
- ✅ Cliente tiene perfil completo (dirección y teléfono)

#### Al Tomar Pedido

El sistema valida automáticamente:

- ✅ Lavandero existe y está activo
- ✅ Pedido existe y está pendiente
- ✅ Pedido no tiene lavandero asignado
- ✅ Lavandero no tiene más de 5 pedidos activos

### Actualización de Estadísticas

#### Al Crear Pedido

El sistema actualiza automáticamente:

- Contador global de pedidos creados
- Estadísticas por tipo de servicio
- Historial del cliente

#### Al Completar Pedido

El sistema actualiza automáticamente:

- Contador global de pedidos completados
- Total de pedidos completados del lavandero
- Total de ganancias del lavandero
- Ingresos totales del sistema

### Cálculo Automático de Precios

**Cuándo**: Al seleccionar servicio y peso

**Qué hace**:

- Calcula precio base según tipo de servicio
- Multiplica por el peso
- Suma planchado por unidad (si aplica)
- Suma recargos por ropa de hogar (si aplica)
- Suma incentivo (si aplica)
- Muestra precio total en tiempo real

### Limpieza Automática de Datos

**Cuándo**: Diariamente a las 2:00 AM

**Qué hace**:

- Identifica notificaciones leídas con más de 30 días
- Elimina notificaciones antiguas
- Archiva pedidos completados con más de 90 días
- Mantiene la base de datos optimizada

### Gestión de Calificaciones

**Cuándo**: Después de completar un pedido

**Qué hace**:

- Solicita calificación a cliente y lavandero
- Si no califican en 7 días, asigna 3 estrellas por defecto
- Calcula calificación promedio actualizada
- Actualiza badges y reconocimientos si aplica
- Aplica penalizaciones si calificación es muy baja

---

## 💬 Sistema de Chat Interno

### Propósito

Permitir **comunicación en tiempo real** entre cliente y lavandero para:

- Coordinar detalles de recogida/entrega
- Aclarar dudas sobre el servicio
- Actualizar sobre cambios de horario
- Resolver problemas durante el proceso

### Características

#### Disponibilidad

El chat está disponible:

- ✅ **Desde que el lavandero acepta el pedido** hasta **7 días después de completado**
- ❌ NO está disponible para pedidos pendientes sin asignar (el lavandero aún no existe)
- ❌ Después de 7 días del pedido completado, el chat se archiva (solo lectura)

#### Funcionalidades

**Mensajes de Texto:**

- Máximo 500 caracteres por mensaje
- Emojis permitidos
- Sin imágenes en versión actual (futuro)

**Mensajes Rápidos (Quick Replies):**

Para Cliente:

```
"¿A qué hora llegarás?"
"¿Puedes confirmar la recogida?"
"Necesito cambiar la hora"
"¿Ya terminaste el lavado?"
"Gracias por el servicio"
```

Para Lavandero:

```
"Voy en camino, llego en 15 minutos"
"Ya recogí la ropa"
"Tu ropa está lista"
"¿Confirmamos horario de entrega?"
"Gracias por tu preferencia"
```

**Indicadores:**

- ✓ Enviado
- ✓✓ Entregado
- 👁️ Leído
- ⏰ Hora de envío
- 🟢 En línea / ⚪ Desconectado

**Notificaciones:**

- Push notification por cada mensaje nuevo
- Badge con número de mensajes no leídos
- Sonido distintivo

### Interfaz del Chat

```
┌─────────────────────────────────────────────┐
│  ← Chat con Juan Pérez  ⭐ 4.8       ⋮      │
│     🟢 En línea                              │
├─────────────────────────────────────────────┤
│                                             │
│  Pedido #12345 - Lavado + Planchado        │
│  Recogida: Hoy 3:00 PM | Entrega: Mañana   │
│  ───────────────────────────────────────    │
│                                             │
│  Juan Pérez                     10:15 AM    │
│  ┌──────────────────────────┐              │
│  │ Hola! Ya confirmé tu     │              │
│  │ pedido. Llegaré puntual  │              │
│  │ a las 3:00 PM 👍         │  ✓✓ 👁️     │
│  └──────────────────────────┘              │
│                                             │
│                                 Tú 10:17 AM │
│              ┌──────────────────────────┐  │
│              │ Perfecto, aquí estaré.  │  │
│              │ La bolsa estará en la   │  │
│              │ portería 🏢             │✓ │
│              └──────────────────────────┘  │
│                                             │
│  Juan Pérez                     10:20 AM    │
│  ┌──────────────────────────┐              │
│  │ Excelente! Nos vemos     │              │
│  │ en un rato 😊            │  ✓✓ 👁️     │
│  └──────────────────────────┘              │
│                                             │
├─────────────────────────────────────────────┤
│  [Mensaje rápido ▼]  [Escribe un mensaje...] │
└─────────────────────────────────────────────┘
     [📷] [📍] [☎️]    [Enviar]
```

### Reglas y Moderación

**Comportamiento Esperado:**

- ✅ Comunicación respetuosa y profesional
- ✅ Solo temas relacionados con el servicio
- ❌ Lenguaje ofensivo o discriminatorio
- ❌ Solicitar información personal fuera de la plataforma
- ❌ Spam o mensajes repetitivos
- ❌ Intentos de evadir la plataforma (pagar fuera, contratar directamente)

**Sistema de Reportes:**

Ambos usuarios pueden reportar mensajes inapropiados:

```
┌─────────────────────────────────────────────┐
│  ⚠️ Reportar Mensaje                        │
├─────────────────────────────────────────────┤
│                                             │
│  ¿Por qué reportas este mensaje?            │
│                                             │
│  ○ Lenguaje ofensivo                        │
│  ○ Acoso o amenazas                         │
│  ○ Spam                                     │
│  ○ Intento de evadir plataforma             │
│  ○ Información personal inapropiada         │
│  ○ Otro                                     │
│                                             │
│  Detalles adicionales (opcional):           │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Cancelar]           [Enviar Reporte]      │
└─────────────────────────────────────────────┘
```

**Consecuencias:**

- Primer reporte: Advertencia
- Segundo reporte: Suspensión temporal (3 días)
- Tercer reporte: Suspensión permanente

### Tecnología

- **Plataforma**: Firebase Realtime Database o Firestore
- **Actualización**: Tiempo real (sin recargar)
- **Almacenamiento**: Mensajes guardados por 30 días
- **Encriptación**: Mensajes encriptados en tránsito

---

## 🛍️ Catálogo de Productos para Lavanderos

### Propósito

Proporcionar a los lavanderos una **lista de productos recomendados y aprobados** que pueden utilizar en su trabajo. Facilita:

- Conocer qué productos son seguros y efectivos
- Comparar precios y marcas
- Acceder a descuentos exclusivos (futuro)
- Mantener estándares de calidad en la plataforma

### Categorías de Productos

#### 1. Detergentes

**Detergentes Premium con Aroma:**

```
┌──────────────────────────────────────────────┐
│  Tide Ultra Concentrado                      │
│  ⭐⭐⭐⭐⭐ 4.8 (324 lavanderos)              │
│                                              │
│  Presentación: 5.2 L (100 lavadas)          │
│  Precio: $89,900 COP                        │
│  Precio por lavada: $899                    │
│                                              │
│  ✓ Recomendado por Te lavo                   │
│  ✓ Rinde hasta 100 lavadas                  │
│  ✓ Fragancia duradera                       │
│  ✓ Efectivo en agua fría                    │
│                                              │
│  [Comprar] [Ver Más]                        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Ariel Doble Poder                           │
│  ⭐⭐⭐⭐☆ 4.6 (198 lavanderos)              │
│  Precio: $65,000 COP (4 L)                  │
│  [Ver Detalles]                             │
└──────────────────────────────────────────────┘
```

**Detergentes Hipoalergénicos:**

```
┌──────────────────────────────────────────────┐
│  All Free Clear (Sin Fragancia)              │
│  ⭐⭐⭐⭐⭐ 4.9 (156 lavanderos)              │
│                                              │
│  Ideal para: Pieles sensibles               │
│  Presentación: 3.8 L                        │
│  Precio: $78,000 COP                        │
│                                              │
│  ✓ Sin fragancias                           │
│  ✓ Sin colorantes                           │
│  ✓ Dermatológicamente probado               │
│  ✓ Recomendado para bebés                   │
│                                              │
│  [Comprar] [Ver Más]                        │
└──────────────────────────────────────────────┘
```

#### 2. Suavizantes (Opcional)

```
┌──────────────────────────────────────────────┐
│  Downy Ultra Concentrado                     │
│  ⭐⭐⭐⭐☆ 4.5 (289 lavanderos)              │
│                                              │
│  Presentación: 3 L (120 lavadas)            │
│  Precio: $52,000 COP                        │
│                                              │
│  ⚠️ Nota: Solo usar si el cliente lo       │
│     solicita expresamente.                  │
│                                              │
│  [Ver Detalles]                             │
└──────────────────────────────────────────────┘
```

#### 3. Productos Especializados

**Quitamanchas (Uso Limitado):**

```
⚠️ Recordatorio: Te lavo NO ofrece servicio de
   remoción de manchas. Estos productos son
   solo para manchas menores durante el proceso.
```

**Blanqueadores:**

```
┌──────────────────────────────────────────────┐
│  Clorox Regular                              │
│  Precio: $8,500 COP (1 L)                   │
│  ⚠️ Solo usar si el cliente lo autoriza    │
│  ⚠️ NUNCA usar en prendas de color         │
└──────────────────────────────────────────────┘
```

#### 4. Accesorios y Herramientas

**Esenciales:**

- Rodillo quitapelusas
- Perchas (diversas)
- Bolsas de lavandería (mallas)
- Clips para calcetines
- Separadores de ropa
- Canastas organizadoras

```
┌──────────────────────────────────────────────┐
│  Kit Profesional para Lavandero              │
│  ⭐⭐⭐⭐⭐ 4.9                                │
│                                              │
│  Incluye:                                    │
│  • 2 Rodillos quitapelusas                  │
│  • 10 Bolsas de malla (3 tamaños)          │
│  • 20 Clips para calcetines                 │
│  • 1 Separador de ropa con 3 secciones     │
│                                              │
│  Precio especial: $89,000 COP               │
│  (Ahorro de $25,000)                        │
│                                              │
│  [Agregar al Carrito]                       │
└──────────────────────────────────────────────┘
```

#### 5. Mantenimiento de Equipos

```
┌──────────────────────────────────────────────┐
│  Limpiador para Lavadora                     │
│  Affresh Limpieza Profunda                   │
│                                              │
│  Uso: 1 tableta por mes                     │
│  Presentación: 6 tabletas                    │
│  Precio: $32,000 COP                        │
│                                              │
│  ✓ Elimina residuos y malos olores         │
│  ✓ Compatible con todas las lavadoras       │
│                                              │
│  [Comprar]                                  │
└──────────────────────────────────────────────┘
```

### Beneficios para Lavanderos

1. **Descuentos Exclusivos** (futuro):

   - 10-20% descuento en productos seleccionados
   - Envío gratis en compras mayores a $100,000
   - Programa de puntos por compras

2. **Garantía de Calidad**:

   - Productos probados y aprobados
   - Recomendaciones de otros lavanderos
   - Calificaciones y reseñas

3. **Conveniencia**:
   - Compra desde la app
   - Entrega a domicilio
   - Reorden automático de productos frecuentes

### Tienda Virtual (Futuro)

**Próximamente:**

- Compra directa desde la app
- Pagos con ganancias acumuladas
- Descuentos por volumen
- Programa de fidelidad
- Productos exclusivos Te lavo

---

## 📚 Centro de Ayuda y Capacitación

### FAQ (Preguntas Frecuentes)

**Para Clientes:**

<details>
<summary>¿Cómo funciona el servicio?</summary>

1. Creas una orden con los detalles
2. Un lavandero acepta tu orden
3. Recoge tu ropa en el horario acordado
4. Procesa tu ropa (lavado/planchado)
5. Entrega tu ropa limpia y doblada
6. Calificas el servicio
</details>

<details>
<summary>¿Cuánto cuesta el servicio?</summary>

Los precios varían según el tipo de servicio:

- Lavado Normal: $48,000/kg (mínimo 10 lbs)
- Lavado Express: $60,000/kg (mínimo 10 lbs)
- Planchado: Por unidad (desde $3,000)
- Ropa de hogar: Precio base + recargo por pieza
</details>

<details>
<summary>¿Puedo especificar preferencias?</summary>

Sí, puedes indicar:

- Tipo de detergente
- Alergias
- Temperatura del agua
- Método de secado
- Prendas que requieren cuidado especial
</details>

<details>
<summary>¿Qué pasa si no me gusta el resultado?</summary>

Si no estás satisfecho:

1. Repórtalo en la app dentro de las 24 horas
2. Proporciona evidencia (fotos)
3. El equipo de Te lavo revisará el caso
4. Si procede, se ofrece relavado gratis o reembolso
</details>

<details>
<summary>¿Cómo funcionan los cargos adicionales?</summary>

Se aplican cargos en estos casos:

- Cliente no disponible en recogida: $15,000
- Cliente no disponible en entrega: $10,000
- Prendas de hogar voluminosas: Varía
- Planchado por unidad: Según prenda

Estos cargos deben pagarse antes de crear nuevas órdenes.

</details>

**Para Lavanderos:**

<details>
<summary>¿Cuánto gano por cada servicio?</summary>

Recibes el 75% del precio del servicio.

Ejemplo:

- Servicio de $100,000
- Tu ganancia: $75,000
- Comisión plataforma: $25,000

Las propinas en efectivo son 100% tuyas.

</details>

<details>
<summary>¿Cuándo recibo mis pagos?</summary>

- Transferencias semanales (cada lunes)
- Mínimo acumulado: $50,000
- Plazo: 2-3 días hábiles
- Sin costo de transferencia
</details>

<details>
<summary>¿Qué pasa si el cliente cancela?</summary>

Si el cliente cancela:

- Más de 2 horas antes: Sin penalización
- Menos de 2 horas antes: Cliente paga 50% del servicio, tú recibes 75% de ese monto
- Si ya recogiste la ropa: Cliente paga 100%, tú recibes el servicio completo
</details>

<details>
<summary>¿Puedo rechazar pedidos?</summary>

Sí, pero considera:

- Rechazo frecuente afecta tu calificación
- Pedidos con incentivos son prioritarios
- Si rechazas por problema legítimo (distancia, capacidad), no afecta
</details>

### Videos de Capacitación

**Biblioteca de Videos:**

📹 **Fundamentos** (20 minutos)

- Introducción a Te lavo
- Estándares de calidad
- Uso básico de la app

📹 **Manejo de Prendas** (35 minutos)

- Separación por tipo y color
- Cuidado de telas delicadas
- Verificación de bolsillos
- Tratamiento de prendas especiales

📹 **Doblado Profesional** (25 minutos)

- Camisas y blusas
- Pantalones y jeans
- Toallas y sábanas
- Ropa interior
- Prendas delicadas

📹 **Retiro de Pelusas y Detalles** (15 minutos)

- Uso de rodillo quitapelusas
- Limpieza de filtros
- Atención a los detalles
- Presentación final

📹 **Servicio al Cliente** (30 minutos)

- Comunicación profesional
- Uso del chat interno
- Manejo de quejas
- Puntualidad y compromiso

📹 **Casos Especiales** (40 minutos)

- Ropa de hogar voluminosa
- Servicio express
- Secado al aire libre
- Planchado profesional

**Certificación:**

Al completar todos los módulos:

- ✅ Certificado digital
- ✅ Badge "Lavandero Certificado"
- ✅ Habilitación para aceptar pedidos

---

## 🛡️ Seguro para Prendas de Valor (Futuro)

### Concepto

Protección adicional opcional para prendas de alto valor económico o sentimental.

### Cómo Funcionará

**Al Crear Orden:**

```
┌──────────────────────────────────────────────┐
│  ¿Tienes prendas de alto valor?              │
├──────────────────────────────────────────────┤
│                                              │
│  Protege tus prendas más valiosas con       │
│  nuestro Seguro Premium.                     │
│                                              │
│  Cobertura hasta: $5,000,000 COP            │
│  Costo: 5% del valor declarado              │
│                                              │
│  Ejemplo:                                    │
│  Prenda de $500,000 = Seguro $25,000        │
│                                              │
│  □ Agregar Seguro Premium                   │
│                                              │
│  [Conocer Más] [Continuar]                  │
└──────────────────────────────────────────────┘
```

**Prendas Asegurables:**

- Ropa de diseñador
- Vestidos de novia
- Trajes formales costosos
- Prendas de lujo (Gucci, Prada, etc.)
- Artículos vintage

**Proceso de Reclamación:**

1. Reportar daño/pérdida dentro de 24 horas
2. Proporcionar evidencia (fotos, recibos)
3. Evaluación por parte de Te lavo
4. Reembolso del valor declarado (si procede)

**Limitaciones:**

- Máximo $5,000,000 por prenda
- Requiere evidencia de valor (recibo, foto)
- No cubre desgaste normal

---

---

## 📋 Casos de Uso Principales

### Caso de Uso 1: Cliente Crea Pedido

**Actor Principal**: Cliente  
**Precondiciones**: Cliente autenticado, tiene perfil completo

**Flujo Principal:**

1. Cliente hace clic en "Nuevo Pedido"
2. Sistema muestra formulario con campos vacíos
3. Cliente selecciona tipo de servicio (dropdown)
4. Sistema muestra precio base por kg
5. Cliente ingresa peso en kg
6. Sistema calcula precio total en tiempo real
7. Cliente selecciona fecha de recogida (date picker)
8. Cliente selecciona hora de recogida (time picker)
9. Cliente ingresa instrucciones especiales (opcional)
10. Cliente hace clic en "Crear Pedido"
11. Sistema valida datos:
    - Tipo de servicio válido
    - Peso > 0.1 y < 50
    - Fecha al menos 2 horas en futuro
12. Sistema crea el pedido con todos los detalles
13. Sistema cierra modal
14. ⚡ Listener detecta nuevo pedido
15. Sistema actualiza UI automáticamente
16. Cliente ve pedido en "Pedidos Activos"
17. ⚡ Lavanderos ven pedido en "Disponibles"

**Flujos Alternativos:**

**3a. Datos inválidos:**

- Sistema muestra mensaje de error
- Cliente corrige datos
- Vuelve al paso 10

**3b. Error de red:**

- Sistema muestra mensaje "Error de conexión"
- Cambios se guardan localmente (offline)
- Al reconectar, se sincronizan automáticamente

### Caso de Uso 2: Lavandero Toma Pedido

**Actor Principal**: Lavandero  
**Precondiciones**: Lavandero autenticado, hay pedidos disponibles

**Flujo Principal:**

1. Lavandero ve lista de "Pedidos Disponibles"
2. Lavandero revisa detalles de un pedido:
   - Dirección de recogida
   - Tipo de servicio
   - Peso
   - Precio
   - Fecha y hora de recogida
3. Lavandero hace clic en "Aceptar Pedido"
4. Sistema inicia transacción de Firestore
5. Sistema lee estado actual del pedido
6. Sistema verifica:
   - status === 'pending'
   - lavanderoId === null
7. Si válido, sistema actualiza el pedido asignando el lavandero y cambiando el estado
8. Sistema confirma la transacción de forma segura
9. Sistema muestra mensaje: "¡Pedido tomado exitosamente!"
10. ⚡ Listener detecta cambio
11. Pedido desaparece de "Disponibles"
12. Pedido aparece en "En Progreso" del lavandero
13. ⚡ Cliente ve lavandero asignado
14. Cloud Function envía notificación al cliente

**Flujos Alternativos:**

**6a. Pedido ya tomado por otro lavandero:**

- Transacción falla
- Sistema muestra: "El pedido no está disponible"
- Pedido desaparece de la lista
- Lavandero vuelve a la lista

**6b. Lavandero tiene 5+ pedidos activos:**

- Sistema muestra: "Límite de pedidos alcanzado"
- Lavandero debe completar pedidos actuales

### Caso de Uso 3: Lavandero Completa Pedido

**Actor Principal**: Lavandero  
**Precondiciones**: Lavandero tiene pedido en progreso

**Flujo Principal:**

1. Lavandero realiza servicio (físicamente)
2. Lavandero va a su dashboard
3. Lavandero abre tab "En Progreso"
4. Lavandero ve lista de pedidos en progreso
5. Lavandero hace clic en "Marcar como Completado"
6. Sistema actualiza el pedido a estado "Completado"
7. Sistema muestra: "¡Pedido completado!"
8. ⚡ Listener detecta cambio
9. Pedido desaparece de "En Progreso"
10. Pedido aparece en "Completados"
11. ⚡ Cliente ve pedido completado
12. Cloud Function actualiza estadísticas:
    - totalCompleted del lavandero +1
    - totalEarned del lavandero + precio del pedido
    - Estadísticas generales
13. Cloud Function envía notificación al cliente

### Caso de Uso 4: Cliente Elimina Pedido Pendiente

**Actor Principal**: Cliente  
**Precondiciones**: Cliente tiene pedido con status 'pending'

**Flujo Principal:**

1. Cliente ve sus pedidos activos
2. Cliente identifica pedido a eliminar (debe ser pendiente)
3. Cliente hace clic en botón "Eliminar"
4. Sistema muestra confirmación: "¿Estás seguro?"
5. Cliente hace clic en "Confirmar"
6. Sistema llama: `firebaseService.deleteOrder(orderId)`
7. Firestore elimina documento del pedido
8. ⚡ Listener del cliente detecta evento 'removed'
9. Firebase envía snapshot actualizado (sin el pedido)
10. UI del cliente actualiza automáticamente
11. Pedido desaparece de "Pedidos Activos"
12. ⚡ Listeners de lavanderos detectan evento 'removed'
13. Pedido desaparece de "Disponibles" (si era visible)
14. Sistema muestra: "Pedido eliminado exitosamente"

**Flujos Alternativos:**

**3a. Pedido ya tiene lavandero asignado:**

- Botón "Eliminar" no está visible
- Cliente solo puede cancelar contactando soporte

**5a. Cliente cancela confirmación:**

- Modal se cierra
- No se elimina nada
- Vuelve al paso 1

### Caso de Uso 5: Dos Lavanderos Intentan Tomar el Mismo Pedido

**Actores**: Lavandero A, Lavandero B  
**Precondiciones**: Ambos ven el mismo pedido disponible

**Flujo Principal:**

1. Lavandero A hace clic en "Aceptar Pedido" (t=0ms)
2. Lavandero B hace clic en "Aceptar Pedido" (t=10ms)
3. Sistema inicia transacción A
4. Sistema inicia transacción B (en paralelo)
5. **Transacción A** (llega primero a Firestore):
   - Lee pedido: status='pending', lavanderoId=null
   - Validación: ✅ Pedido disponible
   - Actualiza: lavanderoId=A, status='in-progress'
   - Confirma transacción ✅
6. **Transacción B** (llega segundo):
   - Lee pedido: status='in-progress', lavanderoId=A
   - Validación: ❌ Pedido ya NO disponible
   - Lanza error: "El pedido no está disponible"
   - Rechaza transacción ❌
7. Lavandero A ve mensaje: "¡Pedido tomado exitosamente!"
8. Pedido aparece en "En Progreso" de A
9. Lavandero B ve mensaje: "El pedido no está disponible"
10. ⚡ Pedido desaparece de "Disponibles" de B
11. Ambos lavanderos están sincronizados

**Importancia de las Transacciones:**

- ✅ Garantiza atomicidad (todo o nada)
- ✅ Evita inconsistencias en datos
- ✅ Solo un lavandero puede tomar el pedido
- ✅ No hay "race conditions"

---

## 🎓 Resumen de Conceptos Clave

### 1. Two-Sided Marketplace

**Definición**: Plataforma que conecta dos grupos de usuarios con necesidades complementarias.

**En Te lavo:**

- Lado 1: Clientes (demanda de servicios)
- Lado 2: Lavanderos (oferta de servicios)

**Valor**: La plataforma facilita la transacción entre ambos lados.

### 2. Realtime Database (Tiempo Real)

**Definición**: Base de datos que envía actualizaciones instantáneas a clientes conectados.

**Tecnología**: Firebase Firestore con `onSnapshot()`

**Ventaja**: Sin polling, sin recargar, cambios instantáneos.

### 3. Transacciones Atómicas

**Definición**: Operación que se ejecuta completamente o no se ejecuta en absoluto.

**En Te lavo**: Tomar pedidos usa transacciones para evitar conflictos.

**Garantías:**

- Atomicidad: Todo o nada
- Consistencia: Datos siempre válidos
- Aislamiento: Transacciones no interfieren entre sí

### 4. Serverless Architecture

**Definición**: Backend que no requiere administrar servidores.

**En Te lavo**: Cloud Functions se ejecutan automáticamente.

**Ventajas:**

- ✅ Escala automáticamente
- ✅ Solo pagas por uso
- ✅ Sin mantenimiento de servidores

### 5. Service Layer Pattern

**Definición**: Patrón que centraliza lógica de negocio en una capa de servicios.

**En Te lavo**: `firebase-service.js` centraliza operaciones.

**Ventajas:**

- ✅ Código reutilizable
- ✅ Fácil mantenimiento
- ✅ Single source of truth

---

## 📊 Métricas y KPIs del Negocio

### Métricas Principales

1. **Pedidos Creados**

   - Total de pedidos en el sistema
   - Pedidos por día/semana/mes
   - Tasa de crecimiento

2. **Pedidos Completados**

   - Total histórico de pedidos completados
   - Tasa de completación: completados / creados
   - Tiempo promedio de completación

3. **Ingresos Totales**

   - Suma de precios de todos los pedidos completados
   - Ingresos por tipo de servicio
   - Ingresos promedio por pedido

4. **Usuarios Activos**

   - Clientes registrados
   - Lavanderos registrados
   - Tasa de retención

5. **Satisfacción**
   - Calificación promedio de lavanderos
   - Pedidos cancelados vs completados
   - Tiempo de respuesta (pedido → asignación)

### Estadísticas Disponibles

**Para el Sistema:**

- Pedidos pendientes actuales (sin asignar)
- Pedidos en progreso actuales
- Total de pedidos completados históricos
- Ingresos totales generados
- Número de clientes activos registrados
- Número de lavanderos activos registrados

**Para Lavanderos:**

- Pedidos completados por el lavandero
- Pedidos actualmente en progreso
- Total ganado histórico
- Calificación promedio (1-5 estrellas)
- Total de pedidos tomados en su historia

---

## 🚀 Ventajas Competitivas del Sistema

1. **Tiempo Real Absoluto**

   - Actualizaciones instantáneas sin recargar
   - Sincronización perfecta cliente-lavandero

2. **Escalabilidad Automática**

   - Firebase escala según demanda
   - Sin límite de usuarios concurrentes

3. **Seguridad Robusta**

   - Reglas de acceso granulares
   - Validaciones cliente y servidor
   - Autenticación integrada

4. **Funciona Offline**

   - Caché local de datos
   - Sincronización automática al reconectar

5. **Transacciones Seguras**

   - Evita conflictos al tomar pedidos
   - Garantiza consistencia de datos

6. **Automatización Completa**

   - Notificaciones automáticas
   - Actualización de estadísticas
   - Limpieza de datos antiguos

7. **Arquitectura Moderna**
   - Código modular y mantenible
   - Patrón de servicios centralizado
   - Cloud Functions para backend

---

## ⏰ Sistema de Horarios Fijos

### Concepto Fundamental

Una de las características más importantes de Te lavo es el sistema de **horarios fijos** tanto para recogida como para entrega. Esto garantiza:

- ✅ Puntualidad y profesionalismo
- ✅ Planificación para cliente y lavandero
- ✅ Compromiso firme de ambas partes
- ✅ Mejor experiencia de usuario

### Funcionamiento

#### Definición de Horarios

**Al Crear Pedido (Cliente):**

```
┌──────────────────────────────────────────────┐
│  PASO 3: Define Horarios                     │
├──────────────────────────────────────────────┤
│                                              │
│  📅 RECOGIDA                                 │
│  Fecha: [____] ← Seleccionar fecha          │
│  Hora:  [____] ← Seleccionar hora           │
│                                              │
│  Ventanas disponibles hoy:                   │
│  ○ 9:00 AM - 11:00 AM                       │
│  ○ 12:00 PM - 2:00 PM                       │
│  ● 3:00 PM - 5:00 PM  ✓ Seleccionado       │
│  ○ 6:00 PM - 8:00 PM                        │
│                                              │
│  ─────────────────────────────────────       │
│                                              │
│  📅 ENTREGA                                  │
│  Basado en tipo de servicio y secado:       │
│                                              │
│  Lavado Normal + Secadora: Mañana 3:00 PM   │
│  Lavado Normal + Aire libre: 26-28 Nov      │
│                                              │
│  Fecha: Mañana 26 Nov                       │
│  Hora:  3:00 PM                              │
│                                              │
│  ⚠️ IMPORTANTE:                             │
│  Estos horarios son FIJOS. Debes estar      │
│  disponible en ambos momentos.              │
│                                              │
│  [Atrás] [Confirmar y Crear Pedido]         │
└──────────────────────────────────────────────┘
```

**Restricciones de Horarios:**

1. **Recogida**: Mínimo 2 horas desde el momento de crear la orden
2. **Entrega**: Depende del tipo de servicio:
   - Lavado Normal + Secadora: 24 horas después
   - Lavado Express: Mismo día (4-8 horas)
   - Lavado Normal + Aire libre: 24-72 horas (variable)

#### Confirmación por Lavandero

Cuando el lavandero acepta el pedido, **DEBE confirmar** que puede cumplir con los horarios:

```
┌──────────────────────────────────────────────┐
│  ⚠️ IMPORTANTE: Confirma Horarios            │
├──────────────────────────────────────────────┤
│                                              │
│  Este pedido requiere horarios FIJOS:       │
│                                              │
│  🔸 RECOGIDA:                                │
│     Hoy, 25 Nov 2025 a las 3:00 PM         │
│     Dirección: Calle 45 #23-15              │
│                                              │
│  🔸 ENTREGA:                                 │
│     Mañana, 26 Nov 2025 a las 3:00 PM      │
│     Dirección: Calle 45 #23-15              │
│                                              │
│  ──────────────────────────────────────     │
│                                              │
│  ☑ Confirmo que puedo recoger puntualmente  │
│     en el horario indicado                  │
│                                              │
│  ☑ Confirmo que puedo entregar puntualmente │
│     en el horario indicado                  │
│                                              │
│  ⚠️ El incumplimiento de horarios afecta tu │
│  calificación y puede generar sanciones.    │
│                                              │
│  [Cancelar] [Confirmar y Aceptar Pedido]    │
└──────────────────────────────────────────────┘
```

### Recordatorios Automáticos

#### 30 Minutos Antes

**Para Recogida:**

```
🔔 RECORDATORIO: Recogida en 30 minutos

Pedido #12345
Cliente: María González
Dirección: Calle 45 #23-15, Apto 302
Hora: 3:00 PM (en 30 minutos)

¿Estás listo?
[Sí, voy en camino] [Necesito más tiempo]
[Ver en Mapa] [Llamar Cliente]
```

**Para Entrega:**

```
🔔 RECORDATORIO: Entrega en 30 minutos

Tu lavandero Juan Pérez llegará en 30 minutos
con tu ropa limpia.

Hora: 3:00 PM
Asegúrate de estar disponible

[Estoy Listo] [Cambiar Hora] [Chat]
```

#### 10 Minutos Antes

```
⏰ Tu lavandero está por llegar

Llegada estimada: 5-10 minutos
Estado: En camino 🚗

[Rastrear en Mapa] [Llamar]
```

### Puntualidad y Consecuencias

#### Medición de Puntualidad

**Ejemplo de Medición:**

- Horario acordado: 25/11/2025 a las 3:00 PM
- Horario real de llegada: 25/11/2025 a las 3:05 PM
- Diferencia: 5 minutos
- Resultado: **Puntual** (menos de 10 minutos)

**Tolerancia**:

- ± 10 minutos = **Puntual** ✅
- 10-30 minutos = **Retraso menor** ⚠️
- \> 30 minutos = **Retraso grave** ❌

#### Impacto en Calificaciones

La puntualidad afecta la calificación automáticamente:

```
Calificación Base: ⭐⭐⭐⭐⭐ 5.0

Ajustes por puntualidad:
- Puntual (±10 min):        Sin cambio
- Retraso menor (10-30):    -0.3 estrellas
- Retraso grave (>30):      -0.7 estrellas
- No se presentó:           -2.0 estrellas + penalización
```

#### Sanciones por Impuntualidad Reiterada

**Para Lavanderos:**

1. **Primera vez**: Advertencia
2. **Segunda vez** (30 días): Suspensión 24 horas
3. **Tercera vez** (30 días): Suspensión 7 días
4. **Cuarta vez** (30 días): Suspensión permanente

**Para Clientes:**

Si el cliente no está disponible:

- Cargo adicional: $15,000 (recogida) o $10,000 (entrega)
- No puede crear nuevas órdenes hasta pagar
- Después de 3 ocasiones: cuenta bajo revisión

### Cambios de Horario

#### Solicitud de Cambio

Cualquiera de las dos partes puede solicitar cambio:

```
┌──────────────────────────────────────────────┐
│  Solicitar Cambio de Horario                 │
├──────────────────────────────────────────────┤
│                                              │
│  Tipo: ○ Recogida  ● Entrega                │
│                                              │
│  Horario actual: Mañana 26 Nov, 3:00 PM     │
│                                              │
│  Nuevo horario propuesto:                    │
│  Fecha: [____]                               │
│  Hora:  [____]                               │
│                                              │
│  Motivo (opcional):                          │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ⚠️ La otra parte debe aceptar el cambio.  │
│                                              │
│  [Cancelar] [Enviar Solicitud]              │
└──────────────────────────────────────────────┘
```

**Restricciones:**

- Solo se puede cambiar con mínimo 2 horas de anticipación
- Máximo 2 cambios por pedido
- Requiere aceptación de la otra parte
- No se puede cambiar dentro de las últimas 2 horas

#### Aceptación de Cambio

La otra parte recibe notificación:

```
💬 Solicitud de Cambio de Horario

Juan Pérez solicita cambiar el horario de
entrega:

De:    Mañana 26 Nov, 3:00 PM
A:     Mañana 26 Nov, 5:00 PM

Motivo: "Tengo otro servicio que se extendió"

[Rechazar] [Aceptar]
```

### Dashboard de Cumplimiento

**Para Lavanderos:**

```
┌──────────────────────────────────────────────┐
│  📊 ESTADÍSTICAS DE PUNTUALIDAD              │
├──────────────────────────────────────────────┤
│                                              │
│  Últimos 30 días:                            │
│                                              │
│  Recogidas:                                  │
│  ⭐ Puntual: 28 (93%)                        │
│  ⚠️ Retraso menor: 2 (7%)                    │
│  ❌ Retraso grave: 0 (0%)                    │
│                                              │
│  Entregas:                                   │
│  ⭐ Puntual: 30 (100%)                       │
│  ⚠️ Retraso menor: 0 (0%)                    │
│  ❌ Retraso grave: 0 (0%)                    │
│                                              │
│  ────────────────────────────────────        │
│  PROMEDIO DE PUNTUALIDAD: 96%               │
│  🏆 Badge: Lavandero Puntual                │
└──────────────────────────────────────────────┘
```

---

## 📈 Oportunidades de Mejora Futura

### Corto Plazo (Ya Documentado - Pendiente Implementación)

1. ✅ **Sistema de Pagos Integrado**

   - Stripe o PayPal para pagos online
   - Distribución automática 25/75
   - Manejo de propinas en efectivo
   - Cargos adicionales automatizados

2. ✅ **Notificaciones Push**

   - Firebase Cloud Messaging (FCM)
   - Notificaciones para todos los estados
   - Recordatorios automáticos
   - Configuración personalizada

3. ✅ **Sistema de Calificaciones Bidireccional**

   - Clientes califican lavanderos (público)
   - Lavanderos califican clientes (privado)
   - Sistema de badges y reconocimientos
   - Categorías específicas de evaluación

4. ✅ **Chat en Tiempo Real**

   - Comunicación cliente-lavandero
   - Mensajes rápidos predefinidos
   - Sistema de reportes
   - Moderación automática

5. ✅ **Verificación de Identidad**

   - Documento + selfie
   - Verificación de teléfono
   - Aprobación manual para lavanderos
   - Mayor seguridad para ambas partes

6. ✅ **Sistema de Incentivos**

   - Bonificaciones dinámicas
   - Motivar aceptación en zonas/horarios difíciles
   - 100% del incentivo para el lavandero

7. ✅ **Capacitación para Lavanderos**
   - Videos instructivos obligatorios
   - Certificación digital
   - Mejores prácticas del sector
   - Estándares de calidad

### Mediano Plazo (6-12 meses)

8. **Geolocalización Avanzada**

   - Rastreo en tiempo real del lavandero
   - Tiempo estimado de llegada (ETA)
   - Optimización de rutas automática
   - Mapa interactivo para clientes

9. **Panel de Administración Completo**

   - Dashboard para administradores
   - Analytics y reportes avanzados
   - Gestión de usuarios
   - Resolución de disputas
   - Métricas de negocio en tiempo real

10. **Sistema de Cupones y Promociones**

    - Descuentos personalizados
    - Códigos de referido (cliente invita cliente)
    - Programa de fidelidad
    - Promociones por temporada

11. **Múltiples Métodos de Pago**

    - PSE (débito bancario)
    - Nequi, Daviplata (billeteras digitales)
    - Efecty, Baloto (puntos físicos)
    - Pagos en cuotas

12. **Tienda Virtual de Productos**

    - Compra directa desde la app
    - Productos exclusivos para lavanderos
    - Descuentos por volumen
    - Entrega a domicilio

13. **Sistema de Imágenes**

    - Cliente toma foto de la ropa antes de entregar
    - Lavandero toma foto al recoger
    - Evidencia de entrega con foto
    - Historial visual de cada pedido

14. **Histórico de Lavanderos Preferidos**
    - Cliente puede marcar lavanderos favoritos
    - Opción de solicitar a lavandero específico
    - Prioridad en notificaciones para favoritos

### Largo Plazo (12+ meses)

15. **App Móvil Nativa**

    - React Native o Flutter
    - Mejor rendimiento
    - Acceso a funciones nativas (GPS, cámara)
    - Notificaciones push más efectivas
    - Modo offline robusto

16. **Inteligencia Artificial y ML**

    - Predicción de demanda por zona/hora
    - Recomendación de precios dinámicos
    - Detección automática de fraudes
    - Chatbot para soporte 24/7
    - Optimización automática de rutas

17. **Seguro para Prendas de Valor**

    - Cobertura hasta $5,000,000
    - Proceso de reclamación simplificado
    - Evaluación automática de daños
    - Partnership con aseguradora

18. **Expansión Internacional**

    - Múltiples idiomas (inglés, portugués)
    - Múltiples monedas
    - Adaptación cultural por país
    - Cumplimiento regulatorio local

19. **Suscripciones para Clientes Frecuentes**

    - Plan mensual con descuento
    - Recogidas semanales programadas
    - Prioridad en asignación de lavanderos
    - Sin mínimo de libras

20. **Integración con Smart Home**

    - Alexa, Google Home
    - Crear pedidos por voz
    - Notificaciones en dispositivos inteligentes
    - Automatización de órdenes recurrentes

21. **Marketplace de Servicios Adicionales**

    - Costura y arreglos
    - Limpieza de tapicería
    - Servicio de planchado express a domicilio
    - Servicio de tintorería

22. **Programa de Carbono Neutral**

    - Compensación de emisiones de transporte
    - Uso de productos eco-amigables
    - Incentivos para secado al aire libre
    - Certificación verde para lavanderos

23. **B2B (Business to Business)**
    - Contratos con hoteles
    - Servicio a restaurantes (manteles, uniformes)
    - Gimnasios y spas
    - Hospitales y clínicas (ropa hospitalaria)

---

## 🎯 Conclusión

**Te lavo** es una plataforma completa y robusta de marketplace de servicios de lavandería que implementa las mejores prácticas de desarrollo moderno y reglas de negocio sólidas:

### Fortalezas Técnicas

✅ **Arquitectura Serverless**: Sin servidores que administrar  
✅ **Tiempo Real**: Actualizaciones instantáneas mediante Firebase  
✅ **Seguridad**: Reglas de acceso granulares y verificación de identidad  
✅ **Escalabilidad**: Firebase escala automáticamente según demanda  
✅ **Transacciones Atómicas**: Evita conflictos en operaciones críticas  
✅ **Automatización**: Cloud Functions para tareas del servidor  
✅ **Persistencia Offline**: Funciona sin conexión y sincroniza automáticamente

### Fortalezas de Negocio

✅ **Modelo de Ingresos Claro**: 25% plataforma / 75% lavandero  
✅ **Verificación de Identidad**: Seguridad para ambas partes  
✅ **Sistema de Calificaciones**: Bidireccional, mantiene calidad  
✅ **Horarios Fijos**: Compromiso y puntualidad garantizados  
✅ **Chat Interno**: Comunicación fluida cliente-lavandero  
✅ **Sistema de Incentivos**: Aumenta disponibilidad en zonas/horarios difíciles  
✅ **Capacitación Obligatoria**: Lavanderos certificados con estándares de calidad  
✅ **Catálogo de Productos**: Guía para usar productos apropiados  
✅ **Notificaciones Automáticas**: Mantiene a usuarios informados en tiempo real  
✅ **Cargos Adicionales**: Sistema justo de penalizaciones por incumplimientos

### Características Diferenciadores

🎯 **Personalización Extrema**:

- Opciones de alergias y requisitos especiales
- Planchado por unidad con cobro individual
- Método de secado seleccionable
- Instrucciones especiales detalladas

🎯 **Transparencia Total**:

- Horarios fijos acordados desde el inicio
- Seguimiento en tiempo real del estado
- Evidencias fotográficas del proceso (futuro)
- Sistema de calificaciones público para lavanderos

🎯 **Protección de Ambas Partes**:

- Verificación obligatoria de identidad
- Cargos por incumplimiento (cliente o lavandero)
- Sistema de reportes y moderación
- Resolución de disputas estructurada

🎯 **Flexibilidad de Servicio**:

- Lavado normal vs express
- Secado en máquina vs aire libre
- Ropa regular vs ropa de hogar
- Planchado opcional por prenda

### Escalabilidad

El sistema está diseñado para **escalar** de manera orgánica:

**Fase 1** (Actual): MVP con funcionalidades core  
**Fase 2** (6 meses): Implementación de todas las reglas documentadas  
**Fase 3** (12 meses): Expansión con IA, geolocalización avanzada  
**Fase 4** (18+ meses): Expansión internacional y B2B

Puede crecer desde:

- **10 pedidos/día** → **10,000 pedidos/día**
- **5 lavanderos** → **5,000 lavanderos**
- **1 ciudad** → **100 ciudades**

Sin cambios arquitectónicos significativos gracias a Firebase.

### Ventaja Competitiva

Te lavo se diferencia de competidores por:

1. **Horarios Fijos y Confirmados**: A diferencia de ventanas amplias de 4 horas
2. **Personalización Extrema**: Más opciones de personalización que competidores
3. **Verificación Estricta**: Seguridad superior para usuarios
4. **Capacitación Obligatoria**: Calidad garantizada del servicio
5. **Sistema de Incentivos**: Mejor disponibilidad en toda la ciudad
6. **Chat Interno**: Comunicación directa sin salir de la app
7. **Transparencia Total**: Cliente sabe exactamente qué esperar

### Impacto Social

**Para Lavanderos**:

- Genera ingresos adicionales o principales
- No requiere inversión inicial
- Flexibilidad de horarios
- Acceso a nuevos clientes
- Capacitación gratuita

**Para Clientes**:

- Ahorro de tiempo significativo
- Conveniencia absoluta
- Servicio profesional garantizado
- Precios competitivos y transparentes
- Seguimiento en tiempo real

**Para la Economía**:

- Formalización de trabajadores independientes
- Generación de empleo flexible
- Digitalización del sector
- Mayor eficiencia en uso de recursos

---

## 📋 Resumen de Implementación

### ✅ Funcionalidades Actuales (Implementadas)

- Registro y autenticación de usuarios
- Creación y gestión de pedidos
- Asignación mediante transacciones
- Actualizaciones en tiempo real
- Sistema básico de perfiles
- Reglas de seguridad de Firestore
- Cloud Functions básicas

### 📝 Funcionalidades Documentadas (Por Implementar)

- Verificación de identidad completa
- Sistema de calificaciones bidireccional
- Chat interno en tiempo real
- Sistema de notificaciones push avanzado
- Sistema de pagos con distribución 25/75
- Cargos adicionales automatizados
- Sistema de incentivos
- Capacitación con videos
- Catálogo de productos
- Horarios fijos con confirmación
- Planchado por unidad
- Opciones de alergias y preferencias
- Secado al aire con tiempos variables
- Sistema de evidencias fotográficas

### 🎯 Métricas de Éxito Esperadas

**Año 1:**

- 500+ lavanderos activos
- 5,000+ clientes registrados
- 10,000+ pedidos completados
- Calificación promedio: 4.5+ estrellas
- Tasa de retención: 60%+

**Año 2:**

- 2,000+ lavanderos activos
- 50,000+ clientes registrados
- 100,000+ pedidos completados
- Expansión a 10 ciudades
- Facturación: $1,000,000,000 COP+

---

## 📞 Información de Contacto

**Proyecto**: Te lavo - Sistema de Gestión de Lavandería  
**Tipo**: Marketplace de Servicios Two-Sided Platform  
**Tecnología**: Firebase (Firestore, Auth, Functions, Hosting)  
**Frontend**: HTML5, CSS3, JavaScript ES6+  
**Backend**: Node.js 18 (Cloud Functions)

---

**Fecha de Creación**: Noviembre 2025  
**Versión del Documento**: 2.0 (Actualizada con Reglas de Negocio Completas)  
**Autor**: Equipo Te lavo  
**Última Actualización**: Noviembre 25, 2025  
**Próxima Revisión**: Diciembre 2025

---

## 📄 Control de Versiones

### Versión 2.0 (25 Nov 2025)

- ✨ Agregada sección completa de Sistema de Calificaciones Bidireccional
- ✨ Agregado Sistema de Notificaciones detallado
- ✨ Agregado Sistema de Pagos con distribución 25/75
- ✨ Agregado Sistema de Cargos Adicionales y Penalizaciones
- ✨ Agregado Sistema de Incentivos Económicos
- ✨ Agregado Chat Interno en Tiempo Real
- ✨ Agregado Catálogo de Productos para Lavanderos
- ✨ Agregado Centro de Capacitación con Videos
- ✨ Agregada sección de Horarios Fijos
- ✨ Agregadas opciones de Alergias y Preferencias
- ✨ Agregado Planchado por Unidad
- ✨ Agregadas opciones de Secado (máquina vs aire libre)
- ✨ Agregada Verificación de Identidad obligatoria
- ✨ Actualizada estructura de datos completa
- ✨ Expandido flujo de negocio con todos los procesos
- ✨ Agregada sección de Seguro para Prendas (futuro)
- ✨ Actualizada lista de Mejoras Futuras

### Versión 1.0 (24 Nov 2025)

- 📝 Documentación inicial del sistema
- 📝 Estructura básica de datos
- 📝 Flujo de negocio core
- 📝 Arquitectura técnica
- 📝 Casos de uso principales

---

## ✅ Estado del Documento

**Completitud**: 95% (Listo para desarrollo)  
**Nivel de Detalle**: Alto  
**Validación Técnica**: Pendiente  
**Validación de Negocio**: Pendiente  
**Aprobación**: Pendiente

---

**🎉 Documento Completo - Listo para Implementación 🚀**
