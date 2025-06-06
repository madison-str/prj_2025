
document.addEventListener("DOMContentLoaded", function () {

  function updateUserEmail() {
    
    const userEmail = sessionStorage.getItem("userEmail") || "";
   
    const emailInput = document.getElementById("correo");

    if (emailInput) {
      emailInput.value = userEmail;
    }
  }

  updateUserEmail();


  function validarCampoVacio(inputEl, nombreCampo = "") {
    const valor = inputEl.value?.trim() || "";
    const errorId = inputEl.id + "error"; 

    if (valor === "") {
      updateErrorElement(errorId, inputEl, `${nombreCampo}`);
      return false;
    } else {
      updateErrorElement(errorId, inputEl, "");
      return true;
    }
  }

  
  function updateErrorElement(errorId, targetContainer, message) {    

    let errorEl = document.getElementById(errorId);
 
  const wrapper = targetContainer.closest(".form-group") || inputEl.parentNode;

  if (!wrapper) return;

  if (message === "") {
    if (errorEl) errorEl.remove();
    return;
  }
  
  if (errorEl) {
    errorEl.innerHTML = message;
    return;
  }

  errorEl = document.createElement("span");
  errorEl.id = errorId;
  errorEl.className = "error";
  errorEl.innerHTML = message;
  
  wrapper.insertAdjacentElement("afterend", errorEl);
  }

  const toggleIcons = document.querySelectorAll('.toggle-password');
  toggleIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      const targetInputId = this.getAttribute('data-target');
      const input = document.getElementById(targetInputId);

      if (input.type === "password") {
        input.type = "text";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      } else {
        input.type = "password";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      }
    });
  });

  
  const form = document.getElementById("loginCambioClave");
  const correoEl = document.getElementById("correo");
  const claveTemporalEl = document.getElementById("claveTemporal");
  const claveNuevaEl = document.getElementById("claveNueva");
  const submitButton = document.getElementById("btnCrear");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const claveNuevaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8}$/;

  correoEl.addEventListener("input", function () {
       
    const value = correoEl.value.trim();
    let mensaje = "";
    validarCampoVacio(correoEl, "El correo electrónico es requerido");

    if (value.length > 150) {
      mensaje = "El correo no puede tener más de 150 caracteres.";
    } else if (value && !emailRegex.test(value)) {
      mensaje = "Ingrese un correo electrónico válido.";
    }
    updateErrorElement("errorCorreo", correoEl, mensaje);

  });

 
  claveTemporalEl.addEventListener("input", function () {
    
    const container = claveTemporalEl.parentNode;
    const value = claveTemporalEl.value;
    let mensaje = "";

    validarCampoVacio(claveTemporalEl, "La contraseña temporal es requerida");

    if (value.length > 150) {
      mensaje = "La contraseña temporal no puede tener más de 150 caracteres.";
    }
    updateErrorElement("errorClaveTemporal", container, mensaje);    

  });

 
  claveNuevaEl.addEventListener("input", function () {
    const container = claveNuevaEl.parentNode;
    const value = claveNuevaEl.value;
    let mensaje = "";        

    if (value.length !== 8) {
      mensaje = "La nueva contraseña debe tener exactamente 8 caracteres.";
    } else if (!claveNuevaRegex.test(value)) {     
      mensaje = "La contraseña debe contener mayúsculas, minúsculas, números<br>y al menos un carácter especial."
    }
    updateErrorElement("errorClaveNueva", container, mensaje);
  });

  
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let hayErrores = false;
    const correo = correoEl.value.trim();
    const claveTemporal = claveTemporalEl.value;
    const claveNueva = claveNuevaEl.value;
    
    let mensajeCorreo = "";    
    validarCampoVacio(correoEl, "El correo electrónico es requerido");
    updateErrorElement("errorCorreo", correoEl, mensajeCorreo);
    
    let mensajeClaveTemporal = "";    
    validarCampoVacio(claveTemporalEl, "La contraseña temporal es requerida");
    updateErrorElement("errorClaveTemporal", claveTemporalEl, mensajeClaveTemporal);
    
    let mensajeClaveNueva = "";
   
    if (claveNueva === "") {
      mensajeClaveNueva = "La nueva contraseña es requerida.";
      hayErrores = true;
    } else if (claveNueva.length !== 8) {
      mensajeClaveNueva = "La nueva contraseña debe tener exactamente 8 caracteres.";
      hayErrores = true;
    } else if (!claveNuevaRegex.test(claveNueva)) {      
      mensajeClaveNueva = "La contraseña debe contener mayúsculas, minúsculas, números<br>y al menos un carácter especial."
      hayErrores = true;
    }
    updateErrorElement("errorClaveNueva", claveNuevaEl, mensajeClaveNueva);

    if (hayErrores) {
    
      Swal.fire({
        title: "Error",
        text: "Por favor, corrija los errores en el formulario.",
        icon: "error",
        confirmButtonText: "Entendido",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    submitButton.disabled = true;
    
    const data = {
      email: correo,
      oldPassword: claveTemporal,
      newPassword: claveNueva
    };

    try {

     /* const response = await fetch("https://c986-44-201-249-73.ngrok-free.app/change-password", {*/

     const response = await fetch("http://localhost:8080/change-password", {        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });


      const responseData = await response.json();

      if (responseData.code === "200") {
        await Swal.fire({
          title: "Cambio de contraseña exitoso",
          text: "Su contraseña ha sido actualizada.",
          icon: "success",
          confirmButtonText: "Aceptar"
        });
        window.location.href = "iniciar_sesion.html";
      } else if (responseData.code === "401") {
        await Swal.fire({
          title: "Error",
          text: "Contraseña temporal inválida. Favor verificar",
          icon: "error",
          confirmButtonText: "Intentar nuevamente"
        });

      } else {
        throw new Error(responseData.message);
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
      submitButton.disabled = false;
    }
  });
});
