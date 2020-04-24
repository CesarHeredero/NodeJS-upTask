import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');
if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: '¿Estas seguro de eliminar el proyecto?',
            text: "¡No podras revertir esta acción!",
            icon: 'ALERTA',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, deseo BORRAR'
        }).then((result) => {
            if (result.value) {
                // enviar petición a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    .then(function(respuesta) {
                        console.log(respuesta);
                        Swal.fire(
                            'BORRADO',
                            respuesta.data,
                            'EXITO'
                        );
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 2000);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se puedo eliminar el proyecto'
                        })
                    });
            }
        });
    });
}

export default btnEliminar;