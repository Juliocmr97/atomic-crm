# InDrop CRM (fork de Atomic CRM)

Cambios respecto a [marmelab/atomic-crm](https://github.com/marmelab/atomic-crm):

## 1. Roles y permisos

| Rol | Clientes, ventas, tareas, notas | Configuración (embudos, etapas) | Usuarios |
|---|---|---|---|
| **Administrador** | Todos | Sí | Crear y editar |
| **Supervisor** | Todos | Sí | Solo ver (para asignar clientes) |
| **Asesor** | Solo los suyos | No | No |

- Los permisos se aplican **en la base de datos** (Row Level Security), no solo en la interfaz:
  un asesor no puede leer ni modificar clientes de otro aunque llame a la API directamente.
- Las notas y tareas se ven si el cliente (o la venta) es visible.
- Las empresas son un directorio compartido: todos las ven; solo el dueño, admin o supervisor las edita.
- La columna `sales.role` reemplaza al booleano `administrator` (se mantienen sincronizados por un trigger).
- Migración: `supabase/migrations/20261117000000_indrop_roles_and_peru_fields.sql`.
  Al aplicarla, los usuarios existentes quedan como `admin` (si eran administradores) o `asesor`.

## 2. Campos para Perú

- Cliente: tipo y número de documento (DNI, RUC, CE, pasaporte) con validación y sin duplicados,
  dirección, referencia y ubigeo (departamento → provincia → distrito, códigos INEI).
- Venta: método de pago (contra entrega, transferencia, Yape/Plin, tarjeta, efectivo). Las ventas
  contra entrega llevan una etiqueta en el tablero.
- Moneda por defecto: soles (PEN). Etapas por defecto: Nuevo lead → Interesado → Pedido confirmado →
  Enviado → Entregado y pagado / Perdido / Reprogramado (editables en Configuración).
- Datos de ubigeo: [CONCYTEC/ubigeo-peru](https://github.com/CONCYTEC/ubigeo-peru), licencia CC BY 4.0.

## 3. Español

La interfaz está en español por defecto (inglés y francés siguen disponibles en el menú de idioma).

## 4. API para el bot de WhatsApp

Edge function `supabase/functions/bot`. Autenticación con el encabezado `x-bot-key`.

```bash
# Configurar (una sola vez)
npx supabase secrets set BOT_API_KEY="$(openssl rand -hex 32)"
npx supabase secrets set BOT_DEFAULT_ASESOR_EMAIL=asesor@indrop.pe   # opcional
npx supabase functions deploy bot
```

Base: `https://<proyecto>.supabase.co/functions/v1/bot`

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/contacts?phone=987654321` | Busca al cliente por teléfono: datos, asesor a cargo y ventas abiertas |
| `POST` | `/contacts` | Crea o actualiza un cliente (busca por teléfono y luego por documento) |
| `POST` | `/deals` | Registra un pedido para un cliente |

`POST /contacts`

```json
{
  "phone": "+51 987 654 321",
  "first_name": "Rosa",
  "last_name": "Quispe",
  "email": "rosa@mail.pe",
  "document_type": "DNI",
  "document_number": "87654321",
  "address": "Av. Próceres 123",
  "address_reference": "Frente al parque",
  "ubigeo": "150132",
  "asesor_email": "ana@indrop.pe",
  "note": "Pidió precio del combo por WhatsApp"
}
```

Solo `phone` es obligatorio. Solo se sobrescriben los campos enviados. Si el cliente es nuevo y no se
indica `asesor_email`, se asigna a `BOT_DEFAULT_ASESOR_EMAIL` o, si no existe, al primer administrador.
Respuesta: `{ "contact_id": 7, "created": true }`.

`POST /deals`

```json
{
  "phone": "987654321",
  "name": "Combo x2",
  "amount": 129.9,
  "payment_method": "contra_entrega",
  "stage": "pedido-confirmado",
  "description": "Entrega el sábado"
}
```

Se puede usar `contact_id` en lugar de `phone`. El monto se guarda en soles, redondeado. Si no se
indica `stage`, se usa la primera etapa configurada. La venta queda asignada al asesor del cliente.
Respuesta: `{ "deal_id": 3, "stage": "opportunity" }`.

Errores: `401` sin clave o clave incorrecta, `404` cliente no encontrado, `422` datos inválidos
(con la lista de `errors`).

## Despliegue

```bash
npx supabase link --project-ref <tu-proyecto>
npx supabase db push            # aplica las migraciones nuevas
npx supabase functions deploy   # incluye users (roles) y bot
npm run build
```
