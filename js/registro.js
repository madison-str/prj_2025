document.addEventListener("DOMContentLoaded", function () {

  /**/

  let grupo;
  let contenedor;
  showEnrollmentAlert();


  function showEnrollmentAlert() {
    Swal.fire({
      title: 'Reglas para el registro de cuentas',
      html: `
        <br>
        <div style="text-align: start">
        <p style= "font-size: 1.1vw">
          <strong>Registro de cuentas para niños, niñas y adolescentes menores de 18 años:</strong><br><br>
          • Ingrese la cédula de identidad del representante legal.<br>
          • Los datos personales como nombre, apellido y fecha de nacimiento deben corresponder al niño, niña o adolescente que se desea registrar.<br>
          • Puede proporcionar un correo electrónico del representante o uno propio del niño, niña o adolescente.
        </p>
        <p style="font-size: 1.1vw"><br><br>
          <strong>Registro de cuentas para personas adultas (18 años o más):</strong><br><br>
          • Ingrese exclusivamente su cédula de identidad.<br>
          • Complete sus datos personales, incluyendo nombre, apellido, fecha de nacimiento y dirección de correo electrónico.
        </p><br>
      </div>
      <hr style="width: 100%; height: 0.1vw; background-color: lightgray; border: none; margin-top: 1vw; margin-bottom: 1vw;">
     <input type="checkbox" id="agreeCheck" 
         style="
          margin-top: 0.5vw;         
           margin-right: 1vw;
           width: 1.2vw;
           height: 1.2vw;          
           border: 0.05vw solid #000;
           border-radius: 0.05vw;
           appearance: none;
           -webkit-appearance: none;
           outline: none;
           display: inline-block;
           position: relative;
           background-color: #fff;
         ">
  <span style="font-size: 0.9vw; position:relative; top:0; right:2%">
    He leído y acepto todas las reglas para el registro de cuentas.
  </span>
      </div>
      `,
      icon: 'info',
      width: '37vw',
      heightAuto: false,       
      allowOutsideClick: false, 
      allowEscapeKey: false,   
      focusConfirm: false,
      confirmButtonText: 'Continuar',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-button'
      },
      preConfirm: () => {
        const checkbox = document.getElementById('agreeCheck');
        if (!checkbox || !checkbox.checked) {
          Swal.showValidationMessage('Debe aceptar las reglas antes de continuar');
        }
      }
    });
  }
  
  function showSpinner() {
    document.getElementById('spinner').style.display = 'flex';
  }

  
  function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
  }


  const form = document.querySelector("form");
  const submitButton = form.querySelector("button[type='submit']");

  const tipoDocumentoEl = document.getElementById("tipoDocumento");
  const numeroDocumentoEl = document.getElementById("numeroDocumento");
  const nombreEl = document.getElementById("nombre");
  const apellidoEl = document.getElementById("apellido");
  const fechaNacimientoEl = document.getElementById("fechaNacimiento");
  const correo = document.getElementById("correo");


  const errorNombre = document.getElementById("errorNombre");
  const errorApellido = document.getElementById("errorApellido");
  const errorDocumento = document.getElementById("errorDocumento");
  const errorFecha = document.getElementById("errorFecha");
  const errorCorreo = document.getElementById("errorCorreo");


  const regexTexto = /^[A-Za-zÁÉÍÓÚáéíóúÑñ']*$/; 
  const regexDocumento = /^[0-9]*$/;               
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  

  function validarCampoVacio(input, errorSpan, nombreCampo) {
    if (input.value.trim() === "") {
      errorSpan.textContent = `El ${nombreCampo} es requerido.`;
      return false;
    }
    return true;
  }

  nombreEl.addEventListener("input", function () {
    if (!validarCampoVacio(nombreEl, errorNombre, "Nombre")) return;
    if (!regexTexto.test(nombreEl.value)) {
      errorNombre.textContent = "Solo se permiten letras, acentos y apóstrofes.";
    } else {
      errorNombre.textContent = "";
    }
  });

  apellidoEl.addEventListener("input", function () {
    if (!validarCampoVacio(apellidoEl, errorApellido, "Apellido")) return;
    if (!regexTexto.test(apellidoEl.value)) {
      errorApellido.textContent = "Solo se permiten letras, acentos y apóstrofes.";
    } else {
      errorApellido.textContent = "";
    }
  });

  numeroDocumentoEl.addEventListener("input", function () {
    if (!validarCampoVacio(numeroDocumentoEl, errorDocumento, "número de documento")) return;   

    const originalValue = numeroDocumentoEl.value;
    
   
    numeroDocumentoEl.value = numeroDocumentoEl.value.replace(/\D/g, "");

    const valueNumDoc = numeroDocumentoEl.value;

    if (!validarCampoVacio(numeroDocumentoEl, errorDocumento, "número de documento")) return;

    if (/^0+$/.test(valueNumDoc)) {
        errorDocumento.textContent = "El número de documento no puede estar en cero.";
    } else if (valueNumDoc.length < 7) {
        errorDocumento.textContent = "El número de documento debe tener al menos 7 dígitos.";
    } else {
        errorDocumento.textContent = "";
    }

    errorDocumento.style.color = "red";

  });

  
  function mostrarError(mensaje) {
    const nuevoSpan = document.createElement("span");
    nuevoSpan.className = "error";
    nuevoSpan.textContent = mensaje;
    
    nuevoSpan.style.position = "relative";
    nuevoSpan.style.top = "0";

    contenedor.insertBefore(nuevoSpan, grupo.nextSibling);
  }


  
  fechaNacimientoEl.addEventListener("input", function () {


    grupo = fechaNacimientoEl.closest(".input-group");
    contenedor = grupo.parentElement;

    
    const siguienteElemento = grupo.nextElementSibling;
    if (siguienteElemento && siguienteElemento.classList.contains("error")) {
      siguienteElemento.remove();
    }
   

    const fechaNacimiento = fechaNacimientoEl._flatpickr.selectedDates[0];

    if (!fechaNacimiento) {
      mostrarError("La fecha de nacimiento es requerida.");
      return;
    }

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    const fechaMinima = new Date(fechaActual);
    fechaMinima.setFullYear(fechaActual.getFullYear() - 1);

    if (fechaNacimiento > fechaMinima) {
      mostrarError("La fecha de nacimiento debe indicar una edad mayor a 1 año.");
      return;
    }

  });


  correo.addEventListener("input", function () {
    if (!validarCampoVacio(correo, errorCorreo, "correo electrónico")) return;

    const value = correo.value.trim();
    if (value.length > 150) {
      errorCorreo.textContent = "El correo no puede tener más de 150 caracteres.";
    } else if (!regexEmail.test(value)) {
      errorCorreo.textContent = "Ingrese un correo electrónico válido.";
    } else {
      errorCorreo.textContent = "";
    }
  });

  
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    showSpinner();


    
    if (nombreEl.value.trim() === "") {
      errorNombre.textContent = "El nombre es requerido.";
    }
    if (apellidoEl.value.trim() === "") {
      errorApellido.textContent = "El apellido es requerido.";
    }
    if (fechaNacimientoEl.value.trim() === "") {

      grupo = fechaNacimientoEl.closest(".input-group");
      contenedor = grupo.parentElement;

      
      const errorEl = grupo.nextElementSibling;
      if (errorEl && errorEl.classList.contains("error")) {
        errorEl.remove();
      }

      mostrarError("La fecha de nacimiento es requerida.");
    }
    if (numeroDocumentoEl.value.trim() === "") {
      errorDocumento.textContent = "El número de documento es requerido.";
    }
    if (correo.value.trim() === "") {
      errorCorreo.textContent = "El correo electrónico es requerido."
    }

  
    if (
      errorNombre.textContent ||
      errorApellido.textContent ||
      (errorFecha && errorFecha.textContent) || 
      errorDocumento.textContent ||
      errorCorreo.textContent
    ) {

      Swal.fire({
        title: "Error",
        text: "Por favor, corrija los errores en el formulario.",
        icon: "error",
        confirmButtonText: "Entendido",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      hideSpinner();
      return;

    }

    
    submitButton.disabled = true;

    
    const tipoDocumento = tipoDocumentoEl.value;
    const numeroDocumento = numeroDocumentoEl.value;
    const nombre = nombreEl.value.trim();
    const apellido = apellidoEl.value.trim();
    const fechaNacimiento = fechaNacimientoEl.value;
    const email = correo.value;

    let data = {
      documentType: tipoDocumento,
      documentNumber: numeroDocumento,
      firstName: nombre,
      lastName: apellido,
      birthDate: fechaNacimiento,
      email: email,
      locked: false,
      enabled: true,
      firstTime: true,
      numberRetries: 0,
      role: "ROLE_USER"
    };

    try {

      
      const response = await fetch("https://c986-44-201-249-73.ngrok-free.app/user/create", {       
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });


      const responseData = await response.json();

      if (responseData.code === "201") {
        sessionStorage.setItem("userEmail", email);
        await Swal.fire({
          title: "Registro exitoso",
          text: "Se ha enviado una contraseña temporal a su correo electrónico. Sino lo visualiza en su bandeja de entrada, revise su bandeja de spam",
          icon: "success",
          confirmButtonText: "Aceptar",
          allowOutsideClick: false,
          allowEscapeKey: false,

        });
        window.location.href = "iniciar_sesion.html";
      } else if (responseData.code === "409") {
        await Swal.fire({
          title: "Error",
          text: "El correo pertenece a otro usuario. Coloque uno válido",
          icon: "error",
          confirmButtonText: "Intentar nuevamente",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });

      } else {
        throw new Error(responseData.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Intentar nuevamente"
      });
    } finally {
      hideSpinner();      
      submitButton.disabled = false;
    }
  });
});
