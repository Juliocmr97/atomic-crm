import type { CrmMessages } from "./englishCrmMessages";

export const spanishCrmMessages: CrmMessages = {
  resources: {
    companies: {
      name: "Empresa |||| Empresas",
      forcedCaseName: "Empresa",
      fields: {
        name: "Nombre de la empresa",
        website: "Sitio web",
        linkedin_url: "URL de LinkedIn",
        phone_number: "Teléfono",
        created_at: "Creada el",
        nb_contacts: "Número de contactos",
        revenue: "Facturación",
        sector: "Rubro",
        size: "Tamaño",
        tax_identifier: "RUC",
        address: "Dirección",
        city: "Ciudad",
        zipcode: "Código postal",
        state_abbr: "Departamento",
        country: "País",
        description: "Descripción",
        context_links: "Enlaces de contexto",
        sales_id: "Asesor a cargo",
      },
      empty: {
        description: "Parece que tu lista de empresas está vacía.",
        title: "No se encontraron empresas",
      },
      import: {
        title: "Importar empresas",
      },
      field_categories: {
        contact: "Datos de contacto",
        additional_info: "Información adicional",
        address: "Dirección",
        context: "Contexto",
      },
      action: {
        create: "Crear empresa",
        edit: "Editar empresa",
        new: "Nueva empresa",
        show: "Ver empresa",
      },
      added_on: "Agregada el %{date}",
      followed_by: "A cargo de %{name}",
      followed_by_you: "A tu cargo",
      no_contacts: "Sin contactos",
      nb_contacts: "%{smart_count} contacto |||| %{smart_count} contactos",
      nb_deals: "%{smart_count} venta |||| %{smart_count} ventas",
      sizes: {
        one_employee: "1 trabajador",
        two_to_nine_employees: "2-9 trabajadores",
        ten_to_forty_nine_employees: "10-49 trabajadores",
        fifty_to_two_hundred_forty_nine_employees: "50-249 trabajadores",
        two_hundred_fifty_or_more_employees: "250 o más trabajadores",
      },
      autocomplete: {
        create_error: "Ocurrió un error al crear la empresa",
        create_item: "Crear %{item}",
        create_label: "Escribe para crear una nueva empresa",
      },
    },
    contacts: {
      name: "Cliente |||| Clientes",
      forcedCaseName: "Cliente",
      document_types: {
        PASAPORTE: "Pasaporte",
      },
      ubigeo: {
        select: "Primero elige una provincia",
        departamento: "Departamento",
        provincia: "Provincia",
        distrito: "Distrito",
      },
      validation: {
        document_required: "Ingresa el número de documento",
        document_type_required: "Elige el tipo de documento",
        document_invalid_DNI: "El DNI tiene exactamente 8 dígitos",
        document_invalid_RUC:
          "El RUC tiene 11 dígitos y empieza con 10, 15, 17 o 20",
        document_invalid_CE: "El CE tiene de 8 a 12 letras o dígitos",
        document_invalid_PASAPORTE:
          "El pasaporte tiene de 6 a 12 letras o dígitos",
      },
      field_categories: {
        document_address: "Documento y dirección",
        background_info: "Información adicional",
        identity: "Identidad",
        misc: "Otros",
        personal_info: "Datos de contacto",
        position: "Cargo",
      },
      fields: {
        document_type: "Tipo de documento",
        document_number: "N.º de documento",
        address: "Dirección",
        address_reference: "Referencia",
        ubigeo: "Departamento / Provincia / Distrito",
        first_name: "Nombres",
        last_name: "Apellidos",
        last_seen: "Última actividad",
        title: "Cargo",
        company_id: "Empresa",
        email_jsonb: "Correos",
        email: "Correo",
        phone_jsonb: "Teléfonos",
        phone_number: "Teléfono / WhatsApp",
        linkedin_url: "URL de LinkedIn",
        background: "Información adicional (cómo llegó, preferencias, etc.)",
        has_newsletter: "Recibe novedades",
        sales_id: "Asesor a cargo",
      },
      action: {
        add: "Agregar cliente",
        add_first: "Agrega tu primer cliente",
        create: "Crear cliente",
        edit: "Editar cliente",
        export_vcard: "Exportar a vCard",
        new: "Nuevo cliente",
        show: "Ver cliente",
      },
      autocomplete: {
        create_item: "Crear %{item}",
        create_label: "Escribe para crear un nuevo cliente",
      },
      background: {
        last_activity_on: "Última actividad el %{date}",
        added_on: "Agregado el %{date}",
        followed_by: "A cargo de %{name}",
        followed_by_you: "A tu cargo",
        status_none: "Ninguno",
      },
      position_at: "%{title} en",
      position_at_company: "%{title} en %{company}",
      empty: {
        description: "Parece que tu lista de clientes está vacía.",
        title: "No se encontraron clientes",
      },
      import: {
        title: "Importar clientes",
      },
      inputs: {
        genders: {
          male: "Él",
          female: "Ella",
          nonbinary: "Elle",
        },
        personal_info_types: {
          work: "Trabajo",
          home: "Personal",
          other: "Otro",
        },
      },
      list: {
        error_loading: "Error al cargar los clientes",
      },
      show: {
        error_loading: "Error al cargar el cliente",
      },
      bulk_tag: {
        action: "Etiquetar",
        back: "Volver a etiquetas",
        create_description:
          "Crea una nueva etiqueta y aplícala a los clientes seleccionados.",
        description:
          "Elige una etiqueta existente o crea una nueva para los clientes seleccionados.",
        empty:
          "Todavía no hay etiquetas. Crea una para etiquetar a los clientes seleccionados.",
        error: "No se pudo agregar la etiqueta a los clientes",
        removed:
          "Etiqueta quitada de %{smart_count} cliente |||| Etiqueta quitada de %{smart_count} clientes",
        success:
          "Etiqueta agregada a %{smart_count} cliente |||| Etiqueta agregada a %{smart_count} clientes",
        title: "Agregar etiqueta a clientes",
      },
      merge: {
        action: "Fusionar con otro cliente",
        confirm: "Fusionar clientes",
        current_contact: "Cliente actual (se eliminará)",
        description: "Fusiona este cliente con otro.",
        error: "No se pudieron fusionar los clientes",
        merging: "Fusionando...",
        no_additional_data: "No hay datos adicionales para fusionar",
        select_target: "Elige el cliente con el que se fusionará",
        success: "Clientes fusionados correctamente",
        target_contact: "Cliente destino (se conservará)",
        title: "Fusionar cliente",
        warning_description:
          "Todos los datos pasarán al segundo cliente. Esta acción no se puede deshacer.",
        warning_title: "Atención: acción irreversible",
        what_will_be_merged: "Qué se fusionará:",
      },
      filters: {
        before_last_month: "Antes del mes pasado",
        before_this_month: "Antes de este mes",
        before_this_week: "Antes de esta semana",
        managed_by_me: "A mi cargo",
        search: "Buscar nombre, empresa...",
        this_week: "Esta semana",
        today: "Hoy",
        tags: "Etiquetas",
        tasks: "Tareas",
      },
      hot: {
        empty_change_status:
          'Cambia el estado de un cliente agregándole una nota y haciendo clic en "mostrar opciones".',
        empty_hint: 'Aquí aparecerán los clientes con estado "caliente".',
        title: "Clientes calientes",
      },
    },
    deals: {
      name: "Venta |||| Ventas",
      payment_methods: {
        contra_entrega: "Contra entrega",
        transferencia: "Transferencia",
        yape_plin: "Yape / Plin",
        tarjeta: "Tarjeta",
        efectivo: "Efectivo",
      },
      fields: {
        payment_method: "Método de pago",
        name: "Nombre",
        description: "Descripción",
        company_id: "Empresa",
        contact_ids: "Clientes",
        categories: "Categorías",
        amount: "Monto",
        expected_closing_date: "Fecha estimada de cierre",
        stage: "Etapa",
      },
      action: {
        back_to_deal: "Volver a la venta",
        create: "Crear venta",
        new: "Nueva venta",
      },
      field_categories: {
        misc: "Otros",
      },
      filters: {
        only_mine: "Solo mis ventas",
      },
      archived: {
        action: "Archivar",
        error: "Error: la venta no se archivó",
        list_title: "Ventas archivadas",
        success: "Venta archivada",
        title: "Venta archivada",
        view: "Ver ventas archivadas",
      },
      inputs: {
        linked_to: "Vinculada a",
      },
      unarchived: {
        action: "Devolver al tablero",
        error: "Error: la venta no se desarchivó",
        success: "Venta desarchivada",
      },
      updated: "Venta actualizada",
      empty: {
        before_create: "antes de crear una venta.",
        description: "Parece que tu lista de ventas está vacía.",
        title: "No se encontraron ventas",
      },
      import: {
        title: "Importar ventas",
      },
      invalid_date: "Fecha no válida",
      no_closing_date: "Sin fecha de cierre",
    },
    notes: {
      name: "Nota |||| Notas",
      forcedCaseName: "Nota",
      fields: {
        status: "Estado",
        date: "Fecha",
        attachments: "Adjuntos",
        contact_id: "Cliente",
        deal_id: "Venta",
      },
      action: {
        add: "Agregar nota",
        add_first: "Agrega tu primera nota",
        delete: "Eliminar nota",
        edit: "Editar nota",
        update: "Actualizar nota",
        add_this: "Agregar esta nota",
      },
      sheet: {
        create: "Crear nota",
        create_for: "Crear nota para %{name}",
        edit: "Editar nota",
        edit_for: "Editar nota de %{name}",
      },
      deleted: "Nota eliminada",
      empty: "Todavía no hay notas",
      author_added: "%{name} agregó una nota",
      you_added: "Agregaste una nota",
      me: "Yo",
      list: {
        error_loading: "Error al cargar las notas",
      },
      note_for_contact: "Nota para %{name}",
      stepper: {
        hint: "Entra a la ficha de un cliente y agrega una nota",
      },
      added: "Nota agregada",
      inputs: {
        add_note: "Agregar una nota",
        options_hint: "(adjuntar archivos o cambiar detalles)",
        show_options: "Mostrar opciones",
      },
      actions: {
        attach_document: "Adjuntar documento",
      },
      validation: {
        note_or_attachment_required: "Escribe una nota o adjunta un archivo",
      },
    },
    sales: {
      name: "Usuario |||| Usuarios",
      fields: {
        first_name: "Nombres",
        last_name: "Apellidos",
        email: "Correo",
        secondary_email: "Correo secundario",
        secondary_emails: "Correos secundarios",
        administrator: "Administrador",
        role: "Rol",
        disabled: "Desactivado",
      },
      roles: {
        admin: "Administrador",
        supervisor: "Supervisor",
        asesor: "Asesor de ventas",
      },
      create: {
        error: "Ocurrió un error al crear el usuario.",
        success:
          "Usuario creado. Pronto recibirá un correo para definir su contraseña.",
        title: "Crear un nuevo usuario",
      },
      edit: {
        error: "Ocurrió un error. Inténtalo de nuevo.",
        record_not_found: "Registro no encontrado",
        success: "Usuario actualizado",
        title: "Editar a %{name}",
      },
      action: {
        new: "Nuevo usuario",
      },
    },
    tasks: {
      name: "Tarea |||| Tareas",
      forcedCaseName: "Tarea",
      fields: {
        text: "Descripción",
        due_date: "Fecha límite",
        type: "Tipo",
        contact_id: "Cliente",
        due_short: "vence",
      },
      action: {
        add: "Agregar tarea",
        create: "Crear tarea",
        edit: "Editar tarea",
      },
      actions: {
        postpone_next_week: "Posponer a la próxima semana",
        postpone_tomorrow: "Posponer a mañana",
        title: "acciones de la tarea",
      },
      added: "Tarea agregada",
      deleted: "Tarea eliminada",
      dialog: {
        create: "Crear tarea",
        create_for: "Crear tarea para %{name}",
      },
      sheet: {
        edit: "Editar tarea",
        edit_for: "Editar tarea de %{name}",
      },
      empty: "Todavía no hay tareas",
      empty_list_hint: "Aquí aparecerán las tareas de tus clientes.",
      filters: {
        later: "Más adelante",
        overdue: "Vencidas",
        this_week: "Esta semana",
        today: "Hoy",
        tomorrow: "Mañana",
        with_pending: "Con tareas pendientes",
      },
      regarding_contact: "(Cliente: %{name})",
      updated: "Tarea actualizada",
    },
    tags: {
      name: "Etiqueta |||| Etiquetas",
      action: {
        add: "Agregar etiqueta",
        create: "Crear etiqueta",
      },
      dialog: {
        color: "Color",
        create_title: "Crear una nueva etiqueta",
        edit_title: "Editar etiqueta",
        name_label: "Nombre de la etiqueta",
        name_placeholder: "Escribe el nombre",
      },
      empty: "Todavía no hay etiquetas.",
    },
  },
  crm: {
    action: {
      reset_password: "Restablecer contraseña",
    },
    auth: {
      first_name: "Nombres",
      last_name: "Apellidos",
      confirm_password: "Confirmar contraseña",
      confirmation_required:
        "Abre el enlace que te enviamos por correo para confirmar tu cuenta.",
      recovery_email_sent:
        "Si tienes una cuenta, recibirás en breve un correo para recuperar tu contraseña.",
      sign_in_failed: "No se pudo iniciar sesión.",
      sign_in_google_workspace: "Iniciar sesión con Google Workspace",
      signup: {
        create_account: "Crear cuenta",
        create_first_user:
          "Crea la primera cuenta de usuario para terminar la configuración.",
        creating: "Creando...",
        initial_user_created: "Usuario inicial creado",
      },
      welcome_title: "Bienvenido a InDrop CRM",
    },
    common: {
      account_manager: "Asesor a cargo",
      activity: "Actividad",
      added: "agregó",
      details: "Detalles",
      last_activity_with_date: "última actividad %{date}",
      load_more: "Cargar más",
      misc: "Otros",
      past: "Vencida",
      read_more: "Leer más",
      retry: "Reintentar",
      show_less: "Mostrar menos",
      copied: "¡Copiado!",
      copy: "Copiar",
      loading: "Cargando...",
      me: "Yo",
      task_count: "%{smart_count} tarea |||| %{smart_count} tareas",
    },
    changelog: {
      title: "Novedades",
    },
    activity: {
      added_company: "%{name} agregó la empresa",
      you_added_company: "Agregaste la empresa",
      added_contact: "%{name} agregó a",
      you_added_contact: "Agregaste a",
      added_note: "%{name} agregó una nota sobre",
      you_added_note: "Agregaste una nota sobre",
      added_note_about_deal: "%{name} agregó una nota sobre la venta",
      you_added_note_about_deal: "Agregaste una nota sobre la venta",
      added_deal: "%{name} agregó la venta",
      you_added_deal: "Agregaste la venta",
      at_company: "en",
      to: "a",
      load_more: "Cargar más actividad",
    },
    dashboard: {
      deals_chart: "Ingresos próximos por ventas",
      deals_pipeline: "Embudo de ventas",
      latest_activity: "Actividad reciente",
      latest_activity_error: "Error al cargar la actividad reciente",
      latest_notes: "Mis últimas notas",
      latest_notes_added_ago: "agregada %{timeAgo}",
      stepper: {
        install: "Instalar el CRM",
        progress: "%{step}/3 listos",
        whats_next: "¿Qué sigue?",
      },
      upcoming_tasks: "Próximas tareas",
    },
    data_import: {
      button: "Importar CSV",
      complete:
        "Importación terminada. Se importaron %{importCount} registros, con %{errorCount} errores",
      csv_file: "Archivo CSV",
      error:
        "No se pudo importar este archivo. Verifica que sea un CSV válido.",
      in_progress: "Importando…",
      progress:
        "Importados %{importCount} / %{rowCount} registros, con %{errorCount} errores.",
      remaining_time: "Tiempo restante estimado:",
      resource: "Recurso",
      sample_download: "Descargar CSV de ejemplo",
      sample_hint:
        "Aquí tienes un CSV de ejemplo que puedes usar como plantilla",
      start: "Iniciar importación",
      stop: "Detener importación",
      stopped:
        "Importación detenida. Se importaron %{importCount} registros, con %{errorCount} errores",
      title: "Importar datos",
    },
    header: {
      import_data: "Importar desde JSON",
    },
    search: {
      title: "Buscar",
      placeholder: "Buscar clientes, empresas, ventas, tareas y notas...",
      hint: "Escribe al menos %{min} caracteres para buscar",
      recent_contacts: "Vistos recientemente",
      empty: "No se encontraron resultados",
      error: "La búsqueda no está disponible ahora. Inténtalo de nuevo.",
      untitled_result: "(sin título)",
      show_more: "Mostrar más",
      groups: {
        contacts: "Clientes",
        companies: "Empresas",
        deals: "Ventas",
        tasks: "Tareas",
        contact_notes: "Notas de clientes",
        deal_notes: "Notas de ventas",
      },
    },
    image_editor: {
      change: "Cambiar",
      drop_hint: "Arrastra un archivo para subirlo o haz clic para elegirlo.",
      editable_content: "Contenido editable",
      title: "Subir y recortar imagen",
      update_image: "Actualizar imagen",
    },
    import: {
      action: {
        download_error_report: "Descargar el reporte de errores",
        import: "Importar",
        import_another: "Importar otro archivo",
      },
      error: {
        unable: "No se pudo importar este archivo.",
      },
      idle: {
        description_1:
          "Puedes importar usuarios, empresas, clientes, notas y tareas.",
        description_2:
          "Los datos deben estar en un archivo JSON como el siguiente ejemplo:",
      },
      status: {
        all_success: "Todos los registros se importaron correctamente.",
        complete: "Importación terminada.",
        failed: "Fallidos",
        imported: "Importados",
        in_progress: "Importando, no salgas de esta página.",
        some_failed: "Algunos registros no se importaron.",
        table_caption: "Estado de la importación",
      },
      title: "Importar desde JSON",
    },
    settings: {
      about: "Acerca de",
      companies: {
        sectors: "Rubros",
      },
      dark_mode_logo: "Logo para modo oscuro",
      deals: {
        categories: "Categorías",
        currency: "Moneda",
        pipeline_help: "Elige qué etapas cuentan como ventas del embudo.",
        pipeline_statuses: "Etapas del embudo",
        stages: "Etapas",
      },
      light_mode_logo: "Logo para modo claro",
      notes: {
        statuses: "Estados",
      },
      reset_defaults: "Restablecer valores por defecto",
      save_error: "No se pudo guardar la configuración",
      saved: "Configuración guardada",
      saving: "Guardando...",
      tasks: {
        types: "Tipos",
      },
      preferences: "Preferencias",
      title: "Configuración",
      app_title: "Nombre de la app",
      sections: {
        branding: "Marca",
      },
      validation: {
        duplicate: "%{display_name} duplicadas: %{items}",
        in_use:
          "No se pueden quitar %{display_name} que todavía usan algunas ventas: %{items}",
        validating: "Validando…",
        entities: {
          categories: "categorías",
          stages: "etapas",
        },
      },
    },
    theme: {
      dark: "Oscuro",
      label: "Tema",
      light: "Claro",
      system: "Sistema",
    },
    language: "Idioma",
    navigation: {
      label: "Navegación del CRM",
    },
    profile: {
      add_secondary_email: "Agregar un correo",
      email_taken: "%{email} ya lo usa otro usuario",
      no_secondary_emails: "Ninguno",
      secondary_email_invalid: "%{email} no es un correo válido",
      secondary_email_is_primary: "%{email} ya es tu correo principal",
      secondary_email_taken: "%{email} ya lo usa otro usuario",
      too_many_secondary_emails:
        "No puedes agregar más de 10 correos secundarios",
      secondary_emails_help:
        "Otros correos desde los que envías mensajes. Deja uno vacío para quitarlo.",
      inbound: {
        description:
          "Puedes enviar correos a la dirección de entrada de tu servidor, por ejemplo agregándola en el campo %{field}. El CRM procesará los correos y agregará notas a los clientes correspondientes.",
        title: "Correo entrante",
      },
      mcp: {
        title: "Servidor MCP",
        description:
          "Usa esta URL para conectar tu asistente de IA a los datos del CRM mediante el Model Context Protocol (MCP).",
      },
      password: {
        change: "Cambiar contraseña",
      },
      password_reset_sent:
        "Te enviamos un correo para restablecer tu contraseña",
      record_not_found: "Registro no encontrado",
      title: "Perfil",
      updated: "Tu perfil se actualizó",
      update_error: "Ocurrió un error. Inténtalo de nuevo",
    },
    validation: {
      invalid_url: "Debe ser una URL válida",
      invalid_linkedin_url: "La URL debe ser de linkedin.com",
    },
  },
};
