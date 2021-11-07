(function () {
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');


    const formulario = document.querySelector('#formulario');


  window.addEventListener("DOMContentLoaded", () => {
    conectar();

    formulario.addEventListener('submit', actualizarCliente);
    //Verificar el id de la url
    const parametroURL = new URLSearchParams(window.location.search);
    idCliente = parametroURL.get("id");

    if (idCliente) {
        setTimeout(() =>{
            obtenerCliente(idCliente);
        },500);
      
    }

  });

  function actualizarCliente(e){
        e.preventDefault();

        if (nombreInput.value === '' || 
            emailInput.value === '' || 
            telefonoInput.value === '' || 
            empresaInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        //actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            imprimirAlerta('Cliente actualizado');

            setTimeout(()=> {
                window.location.href = 'index.html';
            },3000)
        };

        transaction.onerror = () => {
            imprimirAlerta('No se pudo actualizar el cliente', 'error');
        };
  }

    function obtenerCliente(id) {
        const transaccion = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaccion.objectStore('crm'); //interactuar con una base de datos

        objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result; //metodos y valores

            if (cursor) {
                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue(); //para que continue con el siguiente valor
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }


    function conectar() {
        const abrirConexion = window.indexedDB.open("crm", 1);

        abrirConexion.onerror = () => {
        console.log("hubo un error");
        };

        abrirConexion.onsuccess = () => {
        DB = abrirConexion.result; //esta variable contiene una instancia con todos los metodos que se necesitan
        console.log("es correcto");
        };
    }
  
})();
