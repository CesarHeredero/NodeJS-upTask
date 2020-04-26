import axios from "axios";
import Swal from "sweetalert2";

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // request  hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function(respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                    }
                    console.log(respuesta);
                });
        }
        if (e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;
            console.log(tareaHTML);
            console.log(idTarea);
            Swal.fire({
                title: '¿Estas seguro de eliminar la tarea?',
                text: "¡No podras revertir esta acción!",
                icon: 'ALERTA',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, deseo BORRAR'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    // enviar el delete por medio de axios
                    axios.delete(url, { params: { idTarea } })
                        .then(function(respuesta) {
                            if (respuesta.status === 200) {
                                // eliminar el nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //opcional una alerta
                                Swal.fire(
                                    'Tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )
                            }
                        });
                }
            })
        }
    });
}

export default tareas;