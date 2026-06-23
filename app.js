class Tarea {
    /**
     * @param {number} id - Identificador de tipo único
     * @param {string} titulo - Nombre de la tarea
     * @param {boolean} completada - Estado (Habilitado false por defecto)
     */
    constructor(id, titulo, completada = false) {
        this.id = id;
        this.titulo = titulo;
        this.completada = completada;
    }
    toggleEstado() {
        this.completada = !this.completada;
    }
}   // Método encapsulado para cambiar de estado

class GestorTareas {
    constructor() {
        this.tareas = [];
    }

    agregarTarea(titulo) {
        const nuevoId = Date.now();
        const nuevaTarea = new Tarea(nuevoId, titulo, false);

        this.tareas.push(nuevaTarea);

        console.log(`[Gestor] Tarea agregada: "${titulo}"`);

        return nuevaTarea;
    }

    listarTareas() {
        console.log("=== LISTADO ACTUAL DE TAREAS EN CONSOLA ===");

        if (this.tareas.length === 0) {
            console.log("No hay tareas registradas.");
            return;
        }

        this.tareas.forEach((tarea, index) => {
            const check =
                tarea.completada
                    ? "[X] Completada"
                    : "[ ] Pendiente";

            console.log(
                `${index + 1}. ID: ${tarea.id} | ${check} | Título: ${tarea.titulo}`
            );
        });

        console.log("==========================================");
    }

    buscarPorTitulo(titulo) {
        return this.tareas.find(
            tarea =>
                tarea.titulo.trim().toLowerCase() ===
                titulo.trim().toLowerCase()
        );
    }

    listarCompletadas() {
        return this.tareas.filter(
            tarea => tarea.completada === true
        );
    }
}

/* SIMULACIÓN ASÍNCRONA */

function cargarTareas() {
    return new Promise(resolve => {

        setTimeout(() => {

            const datosMock = [
                {
                    id: 101,
                    titulo: "Comprender el concepto de Promesas",
                    completada: true
                },
                {
                    id: 102,
                    titulo: "Aprender POO y Clases en JavaScript",
                    completada: false
                },
                {
                    id: 103,
                    titulo: "Dominar métodos de Arrays avanzados",
                    completada: false
                }
            ];

            resolve(datosMock);

        }, 2000);

    });
}

/* INSTANCIA PRINCIPAL */

const miGestor = new GestorTareas();

/* CAPTURA DE ELEMENTOS HTML */

const loadingMsg = document.getElementById("cargando-mensaje");
const successMsg = document.getElementById("mensaje-ok");

const formSection = document.getElementById("seccion-formulario");
const actionsSection = document.getElementById("seccion-acciones");
const listSection = document.getElementById("seccion-lista");

const taskListUI = document.getElementById("lista-tareas");
const todoForm = document.getElementById("todo-form");
const taskTitleInput = document.getElementById("titulo-tarea");
const listTitleUI = document.getElementById("lista-titulo");

/* INICIO DEL PROGRAMA */

async function iniciarPrograma() {

    try {

        console.log(
            "[Flujo] Iniciando aplicación asíncrona..."
        );

        const tareasFicticias =
            await cargarTareas();

        console.log(
            "Tareas cargadas correctamente"
        );

        tareasFicticias.forEach(item => {

            miGestor.tareas.push(
                new Tarea(
                    item.id,
                    item.titulo,
                    item.completada
                )
            );

        });

        loadingMsg.classList.add("oculta");

        successMsg.classList.remove("oculta");

        formSection.classList.remove("oculta");
        actionsSection.classList.remove("oculta");
        listSection.classList.remove("oculta");

        renderizarListaUI(miGestor.tareas);

        miGestor.listarTareas();

    } catch (error) {

        console.error(
            "Error crítico al inicializar el flujo:",
            error
        );

    }
}

/* RENDERIZACIÓN */

function renderizarListaUI(lista) {

    taskListUI.innerHTML = "";

    if (lista.length === 0) {

        taskListUI.innerHTML = `
            <li class="tarea-meta"
                style="text-align:center;padding:15px;">
                No hay tareas disponibles.
            </li>
        `;

        return;
    }

    lista.forEach(tarea => {

        const li = document.createElement("li");

        li.className =
            `tarea-item ${
                tarea.completada
                    ? "completada"
                    : ""
            }`;

        li.innerHTML = `
            <div>
                <span class="tarea-texto">
                    ${tarea.titulo}
                </span>

                <div class="tarea-meta">
                    ID: ${tarea.id}
                </div>
            </div>

            <button
                class="boton ${
                    tarea.completada
                        ? "boton-secundario"
                        : "boton-exitoso"
                }"
                onclick="cambiarEstadoTarea(${tarea.id})">

                ${
                    tarea.completada
                        ? "Desmarcar"
                        : "Completar"
                }

            </button>
        `;

        taskListUI.appendChild(li);

    });
}

/* CAMBIO DE ESTADO */

window.cambiarEstadoTarea = function(id) {

    const tarea =
        miGestor.tareas.find(
            tarea => tarea.id === id
        );

    if (tarea) {

        tarea.toggleEstado();

        listTitleUI.textContent =
            "Listado de Tareas Activas";

        renderizarListaUI(
            miGestor.tareas
        );
    }
};

/* FORMULARIO */

todoForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const titulo =
            taskTitleInput.value.trim();

        if (!titulo) return;

        miGestor.agregarTarea(titulo);

        taskTitleInput.value = "";

        listTitleUI.textContent =
            "Listado de Tareas Activas";

        renderizarListaUI(
            miGestor.tareas
        );
    }
);

/* BOTÓN MOSTRAR TODAS */

document
    .getElementById(
        "btn-lista-completa"
    )
    .addEventListener(
        "click",
        () => {

            miGestor.listarTareas();

            listTitleUI.textContent =
                "Listado de Tareas Activas";

            renderizarListaUI(
                miGestor.tareas
            );
        }
    );

/* BOTÓN FILTRAR COMPLETADAS */

document
    .getElementById(
        "btn-filtro-completado"
    )
    .addEventListener(
        "click",
        () => {

            const completadas =
                miGestor.listarCompletadas();

            listTitleUI.textContent =
                "Filtrado: Solo Tareas Completadas";

            renderizarListaUI(
                completadas
            );
        }
    );

/* BOTÓN BUSCAR */

document
    .getElementById(
        "btn-busqueda"
    )
    .addEventListener(
        "click",
        () => {

            const inputBuscar =
                document.getElementById(
                    "buscar-titulo"
                );

            const encontrado =
                miGestor.buscarPorTitulo(
                    inputBuscar.value
                );

            if (encontrado) {

                listTitleUI.textContent =
                    `Resultado: "${inputBuscar.value}"`;

                renderizarListaUI(
                    [encontrado]
                );

            } else {

                alert(
                    "No se encontró ninguna coincidencia exacta."
                );
            }

            inputBuscar.value = "";
        }
    );

/* BOTÓN MAPEO */

document
    .getElementById(
        "btn-mapeo-titulos"
    )
    .addEventListener(
        "click",
        () => {

            const titulosPlanos =
                miGestor.tareas.map(
                    tarea => tarea.titulo
                );

            console.log(
                "=== ARRAY MAPEADO CON .MAP (SOLO TÍTULOS) ===",
                titulosPlanos
            );

            alert(
                "Array extraído en consola con éxito:\n" +
                JSON.stringify(
                    titulosPlanos
                )
            );
        }
    );

/* BOTÓN TODAS LAS PROMESAS */

document
    .getElementById(
        "btn-todas-promesas"
    )
    .addEventListener(
        "click",
        async () => {

            console.log(
                "[Promise.all] Lanzando múltiples sub-procesos simulados..."
            );

            const p1 =
                new Promise(res =>
                    setTimeout(
                        () => res("Usuarios cargados"),
                        1000
                    )
                );

            const p2 =
                new Promise(res =>
                    setTimeout(
                        () => res("Configuración cargada"),
                        500
                    )
                );

            const resultados =
                await Promise.all(
                    [p1, p2]
                );

            console.log(
                "Resultados de Todas las promesas simultáneos:",
                resultados
            );

            alert(
                "¡Procesos paralelos ejecutados grupalmente en consola!"
            );
        }
    );

iniciarPrograma();