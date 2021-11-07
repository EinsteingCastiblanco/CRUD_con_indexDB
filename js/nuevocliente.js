(function () {
  let DB;

  const formulario = document.querySelector("#formulario");

  window.addEventListener("DOMContentLoaded", () => {
    conectar();

    formulario.addEventListener("submit", validarCliente);
  });

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

  function validarCliente(e) {
    e.preventDefault();

    //leer inputs
    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    //validacion picha
    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
      imprimirAlerta("Todos los campos son vacios", "error");
      return;
    }

    //crear un objeto de la informacion
    const cliente = {
      nombre, //no se ocupa valor porque son los mismos
      email,
      telefono,
      empresa,
      id: Date.now(),
    };

    crearNuevoCliente(cliente);
  }

  function crearNuevoCliente(cliente) {
    const transaction = DB.transaction(['crm'], 'readwrite');
    const objectStore = transaction.objectStore('crm');

    //agregamos el valor del objeto a la BD
    objectStore.add(cliente);

    transaction.onerror = () => {
        imprimirAlerta('ocurrio un error en la transaccion', 'error');
    };

    transaction.oncomplete = () => {
        imprimirAlerta('El cliente se agrego corretamente');

        setTimeout(() =>{
            //despues de 3 segundos envia a la otra pagina
            window.location.href = 'index.html';    
        }, 3000);
    };
  }

})();
