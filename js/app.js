//creacion de un ifiie para que las variables solo sean utilizadas por este archivo
(function () {
  let DB;
  const lista = document.querySelector("#listado-clientes");

  window.addEventListener("DOMContentLoaded", () => {
    crearDB();

    if (window.indexedDB.open("crm", 1)) {
      //si se abre la base de datos
      obtenerClientes();
    }

    lista.addEventListener('click', eliminarRegistro);
  });

  function eliminarRegistro(e) {
    if(e.target.classList.contains('eliminar')) { //si estoy dando click en un elemento con la clase "eliminar"
        const idEliminar = Number(e.target.dataset.cliente); //transforma el id en un numero

        const confirmar = confirm('Desea eliminar este cliente'); //mensaje de confirmacion
        if(confirmar){
            const transaccion = DB.transaction('crm','readwrite');
            const objectStore = transaccion.objectStore('crm');

            objectStore.delete(idEliminar);

            transaccion.onerror = () => {
                console.log('ocurrio un error');
            }

            transaccion.oncomplete = () => {
                console.log('se ha eliminado correctamente');
                e.target.parentElement.parentElement.remove();
            }
        }
    }
  }

  //crea la base de datos
  function crearDB() {
    const crearDB = window.indexedDB.open("crm", 1);

    crearDB.onerror = function () {
      console.log("ocurrio un error");
    };

    crearDB.onsuccess = function () {
      DB = crearDB.result; //si se crea la base de datos se asigna a la variable DB
    };

    crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;

      const objectStore = db.createObjectStore("crm", {
        keyPath: "id",
        autoIncrement: true,
      });

      //crear otros campos
      objectStore.createIndex("nombre", "nombre", { unique: false });
      objectStore.createIndex("email", "email", { unique: true });
      objectStore.createIndex("telefono", "telefono", { unique: false });
      objectStore.createIndex("empresa", "empresa", { unique: false });
      objectStore.createIndex("id", "id", { unique: true });

      console.log("base de datos creada y lista");
    };
  }

  function obtenerClientes() {
    //abrir conexion
    const abrirConexion = window.indexedDB.open("crm", 1);

    abrirConexion.onerror = () => {
      console.log("hubo un error");
    };

    abrirConexion.onsuccess = () => {
      DB = abrirConexion.result; //esta variable contiene una instancia con todos los metodos que se necesitan

      const transaction = DB.transaction("crm");
      const objectStore = transaction.objectStore("crm");

      //listar
      objectStore.openCursor().onsuccess = (e) => {
        const cursor = e.target.result; //metodos y valores

        if (cursor) {
          //destructuring
          const { nombre, email, telefono, empresa, id } = cursor.value;

          lista.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>`;

          //para que continue con el siguiente valor
          cursor.continue(); //para que continue con el siguiente valor
        } else {
          console.log("no hay resultados");
        }
      };
    };
  }
})();
