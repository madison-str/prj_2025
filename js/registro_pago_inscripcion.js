const fieldLabels = {
  bank: "Banco",
  amount: "Monto",
  referenceNumber: "Número de Referencia",
  phone: "Número de Celular",
  paymentDate: "Fecha de Pago",
  amountTransfer: "Monto",
  docType: "Tipo de Documento",
  docNumber: "Número de Documento",
  originAccount: "Cuenta Origen",
  destinationAccount: "Cuenta Destino",
  transferReference: "Número de Referencia/Operación",
  transferDate: "Fecha de la Operación",
  bankTransfer: "Banco",
  zelleEmail: "Correo Electrónico",
  zelleDate: "Fecha de Pago",
  amountZelle: "Monto",
  referenceZelle: "Número de Referencia",
};

var valid = true;
function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

function getInitials(firstName, lastName) {
  if (!firstName || !lastName) return "U";
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}

function updateUserInfo() {
  const firstName = sessionStorage.getItem("userFirstName") || "Nombre";
  const lastName = sessionStorage.getItem("userLastName") || "Apellido";
  const userRole = sessionStorage.getItem("userRole") || "Rol Predeterminado";
  const nameElem = document.getElementById("userName");
  const roleElem = document.getElementById("userRole");
  if (nameElem) nameElem.innerText = `${firstName} ${lastName}`;
  if (roleElem) roleElem.innerText = userRole;
}

function setUserIcon() {
  updateUserInfo();
  const firstName = sessionStorage.getItem("userFirstName");
  const lastName = sessionStorage.getItem("userLastName");
  const userIcon = document.getElementById("user-icon");
  if (userIcon) {
    userIcon.textContent = getInitials(firstName, lastName);
  }
}

function toggleUserMenu() {
  const menu = document.getElementById("user-menu");
  const userIcon = document.getElementById("user-icon");
  if (menu && userIcon) {
    const isVisible = menu.style.display === "block";
    menu.style.display = isVisible ? "none" : "block";
    userIcon.style.backgroundColor = isVisible ? "#F36621" : "#2e3192";
  }
}

document.addEventListener("click", (event) => {
  const menu = document.getElementById("user-menu");
  const userIcon = document.getElementById("user-icon");
  const userContainer = document.querySelector(".user-container");
  if (
    menu &&
    userIcon &&
    userContainer &&
    !userContainer.contains(event.target)
  ) {
    menu.style.display = "none";
    userIcon.style.backgroundColor = "#F36621";
  }
});
const submitButton = document.querySelector("button[type='submit']");

document.addEventListener("DOMContentLoaded", function () {
  attachRealTimeValidations();
  setUserIcon();
});

function mostrarSeccion(metodo) {
  document.getElementsByClassName("form-container")[0].style.display = "block";
  document.getElementsByClassName("registro")[0].style.display = "block";
  document.querySelector("footer").style.display = "flex";

  document.getElementById("pagoMovilSection").style.display = "none";
  document.getElementById("transferenciaSection").style.display = "none";
  document.getElementById("zelleSection").style.display = "none";

  if (metodo === "pagoMovil") {
    document.getElementById("pagoMovilSection").style.display = "block";
  } else if (metodo === "transferencia") {
    document.getElementById("transferenciaSection").style.display = "block";
  } else if (metodo === "zelle") {
    document.getElementById("zelleSection").style.display = "block";
  }
}

function limitarNumeroConDecimales(input) {
  let valor = input.value.replace(",", ".").replace(/[^0-9.]/g, "");
  let partes = valor.split(".");
  if (partes.length > 2) {
    partes = [partes[0], partes[1]];
  }
  if (partes.length === 2) {
    partes[0] = partes[0].slice(0, 10);
    partes[1] = partes[1].slice(0, 2);
    valor = partes[0] + "." + partes[1];
  } else {
    valor = partes[0].slice(0, 12);
  }
  input.value = valor;
}

function validateForm() {
  let valid = true;
  const metodo = document.querySelector("input[name='paymentMethod']:checked");
  if (!metodo) {
    Swal.fire({
      title: "Error",
      text: "Seleccione un método de pago.",
      icon: "error",
      confirmButtonText: "Entendido",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
    });
    return false;
  }

  const m = metodo.value;

  if (m === "pagoMovil") {
    const fieldsToValidate = {
      bank: "Banco",
      amount: "Monto",
      referenceNumber: "Numero de Referencia",
      phone: "Número de Celular",
      paymentDate: "Fecha de Pago",
    };

    Object.entries(fieldsToValidate).forEach(([id, label]) => {
      if (!validateField(id, label)) {
        valid = false;
      }
    });
    return valid;
  } else if (m === "transferencia") {
    const fieldsToValidate = {
      amountTransfer: "Monto",
      docType: "Tipo de Documento",
      docNumber: "Número de Documento",
      originAccount: "Cuenta Origen",
      destinationAccount: "Cuenta Destino",
      transferReference: "Número de Referecia/Operación",
      transferDate: "Fecha de la Operación",
      bankTransfer: "Banco",
    };

    Object.entries(fieldsToValidate).forEach(([id, label]) => {
      if (!validateField(id, label)) {
        valid = false;
      }

      console.log("Valor de validate 2::::" + validateField);
    });
    return valid;
  }
  if (m === "zelle") {
    const fieldsToValidate = {
      zelleEmail: "Correo Electrónico",
      zelleDate: "Fecha de pago",
      amountZelle: "Monto",
      referenceZelle: "Número de referencia",
    };

    Object.entries(fieldsToValidate).forEach(([id, label]) => {
      if (!validateField(id, label)) {
        valid = false;
      }

      console.log("Valor de validate:::: 3" + validateField);
    });
    return valid;
  }
}

function attachRealTimeValidations() {
  Object.keys(fieldLabels).forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", function () {
        validateField(id, fieldLabels[id]);
      });
    }
  });
}

function validateField(id) {
  const input = document.getElementById(id);

  if (!input) {
    console.error(`No se encontró el input con ID: ${id}`);
    return false;
  }

  const capitalizedId = id.charAt(0).toUpperCase() + id.slice(1);
  const errorSpan = document.getElementById(`error${capitalizedId}`);
  if (!errorSpan) {
    console.error(`No se encontró el span con ID: error${capitalizedId}`);
    return false;
  }

  const fieldName = fieldLabels[id] || id;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0412|0414|0416|0424|0426)-(?!0{7})\d{7}$/;

  if (input.type === "date") {
    const inputDate = new Date(input.value.trim());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!input.value) {
      errorSpan.textContent = `${fieldName} es obligatorio.`;
      errorSpan.style.color = "red";
      return false;
    } else if (inputDate > today) {
      errorSpan.textContent = `${fieldName} no puede ser mayor a la fecha actual.`;
      errorSpan.style.color = "red";
      return false;
    } else {
      errorSpan.textContent = "";
      return true;
    }
  }

  if (input.type === "email" || id === "zelleEmail") {
    if (input.value.length > 100) {
      input.value = input.value.slice(0, 100);
    }
    if (!input.value) {
      errorSpan.textContent = `${fieldName} es obligatorio.`;
      errorSpan.style.color = "red";
      return false;
    } else if (!emailRegex.test(input.value)) {
      errorSpan.textContent = `Ingrese un ${fieldName} válido.`;
      errorSpan.style.color = "red";
      return false;
    } else {
      errorSpan.textContent = "";
      return true;
    }
  }

  if (id === "phone") {
    let digits = input.value.replace(/\D/g, "");
    if (digits.length > 4) {
      digits = digits.slice(0, 4) + "-" + digits.slice(4);
    }
    input.value = digits.slice(0, 12);

    if (!input.value) {
      errorSpan.textContent = `${fieldName} es obligatorio.`;
      errorSpan.style.color = "red";
      return false;
    } else if (!phoneRegex.test(input.value)) {
      errorSpan.textContent = `Formato inválido. Debe ser 04xx-xxxxxxx.`;
      errorSpan.style.color = "red";
      return false;
    } else {
      errorSpan.textContent = "";
      return true;
    }
  }

  if (id === "docNumber") {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
    if (!input.value) {
      errorSpan.textContent = `${fieldName} es obligatorio`;
      errorSpan.style.color = "red";
      return false;
    } else if (/^0+$/.test(input.value)) {
      errorSpan.textContent = `${fieldName} no puede ser cero.`;
      errorSpan.style.color = "red";
      return false;
    } else if (input.value.length < 7) {
      errorSpan.textContent = `${fieldName} debe tener al menos 7 dígitos.`;
      errorSpan.style.color = "red";
      return false;
    } else {
      errorSpan.textContent = "";
      return true;
    }
  }

  if (id === "originAccount" || id === "destinationAccount") {
    input.value = input.value.replace(/\D/g, "").slice(0, 20);
    if (!input.value) {
      errorSpan.textContent = `${fieldName} es obligatorio.`;
      errorSpan.style.color = "red";
      return false;
    } else if (input.value.length < 20) {
      errorSpan.textContent = `${fieldName} debe tener exactamente 20 dígitos.`;
      errorSpan.style.color = "red";
      return false;
    } else if (/^0+$/.test(input.value)) {
      errorSpan.textContent = `${fieldName} no puede ser cero.`;
      errorSpan.style.color = "red";
      return false;
    } else {
      errorSpan.textContent = "";
      return true;
    }
  }

  if (
    id === "transferReference" ||
    id === "referenceNumber" ||
    id === "referenceZelle"
  ) {
    input.value = input.value.replace(/\D/g, "").slice(0, 30);
    if (!input.value) {
      errorSpan.textContent = `${fieldName} es obligatorio.`;
      errorSpan.style.color = "red";
      return false;
    } else if (/^0+$/.test(input.value)) {
      errorSpan.textContent = `${fieldName} no puede ser cero.`;
      errorSpan.style.color = "red";
      return false;
    } else {
      errorSpan.textContent = "";
      return true;
    }
  }

  if (id === "amount" || id === "amountTransfer" || id === "amountZelle") {
    const monto = parseFloat(input.value);
    if (!input.value) {
      errorSpan.textContent = `${fieldName} es obligatorio.`;
      errorSpan.style.color = "red";
      return false;
    } else if (isNaN(monto) || monto <= 0) {
      errorSpan.textContent = `${fieldName} debe ser mayor a cero.`;
      errorSpan.style.color = "red";
      return false;
    } else {
      errorSpan.textContent = "";
      return true;
    }
  }

  input.value = input.value.trim();
  if (!input.value) {
    errorSpan.textContent = `${fieldName} es obligatorio.`;
    errorSpan.style.color = "red";
    return false;
  } else {
    errorSpan.textContent = "";
    return true;
  }
}

function validateDocument() {
  const comprobanteInput = document.getElementById("comprobante");
  const comprobanteError = document.getElementById("comprobante-error");

  if (!comprobanteInput.files.length) {
    comprobanteError.textContent = "Debe subir un comprobante de pago.";
    return false;
  }

  const comprobante = comprobanteInput.files[0];
  const allowedTypes = ["application/pdf", "image/jpeg"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(comprobante.type)) {
    comprobanteError.textContent = "Solo se permiten archivos PDF o JPG.";
    return false;
  }

  if (comprobante.size > maxSize) {
    comprobanteError.textContent = "El archivo no puede superar los 10MB.";
    return false;
  }

  comprobanteError.textContent = "";
  return true;
}

/*document
  .getElementById("payment-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const isComprobanteValido = validateDocument();
    const isFormValido = validateForm();

    if (!isComprobanteValido) { 
      Swal.fire({
        title: "Error",
        text: "Debe subir un comprobante de pago válido (PDF o JPG, máximo 10MB).",
        icon: "error",
        confirmButtonText: "Entendido",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
      });
      return;
    }

    if (!isFormValido) {      
      Swal.fire({
        title: "Error",
        text: "Corrija los errores en el formulario.",
        icon: "error",
        confirmButtonText: "Entendido",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
      });
      return;
    }

    submitButton.disabled = true;

    const metodoSeleccionado = document.querySelector(
      "input[name='paymentMethod']:checked"
    ).value;
    let requestData = { paymentMedium: metodoSeleccionado };

    if (metodoSeleccionado === "pagoMovil") {
      requestData = {
        ...requestData,

        orgBank: document.getElementById("bank").value,
        paymentAmount: document.getElementById("amount").value,
        paymentReference: document.getElementById("referenceNumber").value,
        paymentDate: document.getElementById("paymentDate").value,
        celNumber: document.getElementById("phone").value,
      };
    } else if (metodoSeleccionado === "transferencia") {
      requestData = {
        ...requestData,

        orgBank: document.getElementById("bankTransfer").value,
        paymentAmount: document.getElementById("amountTransfer").value,
        orgAccount: document.getElementById("originAccount").value,
        destAccount: document.getElementById("destinationAccount").value,
        paymentReference: document.getElementById("transferReference").value,
        docType: document.getElementById("docType").value,
        docNumber: document.getElementById("docNumber").value,
        paymentDate: document.getElementById("transferDate").value,
      };
    } else if (metodoSeleccionado === "zelle") {
      requestData = {
        ...requestData,

        email: document.getElementById("zelleEmail").value,
        paymentAmount: document.getElementById("amountZelle").value,
        paymentReference: document.getElementById("referenceZelle").value,
        paymentDate: document.getElementById("zelleDate").value,
      };
    }

    try {
      const response = await fetch(
        "https://c986-44-201-249-73.ngrok-free.app/payments/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      if (response.status === 201) {
        let mes = sessionStorage.getItem("month") || "";
        let anio = sessionStorage.getItem("year") || "";

        await Swal.fire({
          title: "Registro exitoso",
          text: responseData.message || "El registro fue creado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          allowOutsideClick: false,
          allowEscapeKey: false,
          backdrop: true,
        });

        window.location.href = `calendario_inscripcion_eventos.html?mes=${mes}&anio=${anio}`;
      } else if (response.status === 409) {
        await Swal.fire({
          title: "Advertencia",
          text:
            responseData.message || "Conflicto: ya existe un registro similar.",
          icon: "warning",
          confirmButtonText: "Intentar nuevamente",
          allowOutsideClick: false,
          allowEscapeKey: false,
          backdrop: true,
        });
      } else {
        throw new Error(responseData.message || "Ocurrió un error inesperado.");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Intentar nuevamente",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
      });
    } finally {
      submitButton.disabled = false;
    }*/

  document.getElementById("payment-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const isComprobanteValido = validateDocument();
  const isFormValido = validateForm();

  if (!isComprobanteValido) {
    Swal.fire({
      title: "Error",
      text: "Debe subir un comprobante de pago válido (PDF o JPG, máximo 10MB).",
      icon: "error",
      confirmButtonText: "Entendido",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
    });
    return;
  }

  if (!isFormValido) {
    Swal.fire({
      title: "Error",
      text: "Corrija los errores en el formulario.",
      icon: "error",
      confirmButtonText: "Entendido",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
    });
    return;
  }

  submitButton.disabled = true;

  const metodoSeleccionado = document.querySelector("input[name='paymentMethod']:checked").value;
  let requestData = { paymentMedium: metodoSeleccionado };

  if (metodoSeleccionado === "pagoMovil") {
    requestData = {
      ...requestData,
      orgBank: document.getElementById("bank").value,
      paymentAmount: document.getElementById("amount").value,
      paymentReference: document.getElementById("referenceNumber").value,
      paymentDate: document.getElementById("paymentDate").value,
      celNumber: document.getElementById("phone").value,
    };
  } else if (metodoSeleccionado === "transferencia") {
    requestData = {
      ...requestData,
      orgBank: document.getElementById("bankTransfer").value,
      paymentAmount: document.getElementById("amountTransfer").value,
      orgAccount: document.getElementById("originAccount").value,
      destAccount: document.getElementById("destinationAccount").value,
      paymentReference: document.getElementById("transferReference").value,
      docType: document.getElementById("docType").value,
      docNumber: document.getElementById("docNumber").value,
      paymentDate: document.getElementById("transferDate").value,
    };
  } else if (metodoSeleccionado === "zelle") {
    requestData = {
      ...requestData,
      email: document.getElementById("zelleEmail").value,
      paymentAmount: document.getElementById("amountZelle").value,
      paymentReference: document.getElementById("referenceZelle").value,
      paymentDate: document.getElementById("zelleDate").value,
    };
  }

  // Obtenemos el archivo del comprobante
  const comprobante = document.getElementById("comprobante").files[0];

  // Armamos el FormData
  const formData = new FormData();
  formData.append("data", JSON.stringify(requestData)); // Datos como string
  formData.append("comprobante", comprobante); // Archivo

  try {
    const response = await fetch("https://c986-44-201-249-73.ngrok-free.app/payments/send", {
      method: "POST",
      body: formData, // Sin headers, el browser los arma automáticamente
    });

    const responseData = await response.json();

    if (response.status === 201) {
      let mes = sessionStorage.getItem("month") || "";
      let anio = sessionStorage.getItem("year") || "";

      await Swal.fire({
        title: "Registro exitoso",
        text: responseData.message || "El registro fue creado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
      });

      window.location.href = `calendario_inscripcion_eventos.html?mes=${mes}&anio=${anio}`;
    } else if (response.status === 409) {
      await Swal.fire({
        title: "Advertencia",
        text: responseData.message || "Conflicto: ya existe un registro similar.",
        icon: "warning",
        confirmButtonText: "Intentar nuevamente",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
      });
    } else {
      throw new Error(responseData.message || "Ocurrió un error inesperado.");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error",
      text: error.message || "No se pudo conectar con el servidor.",
      icon: "error",
      confirmButtonText: "Intentar nuevamente",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
    });
  } finally {
    submitButton.disabled = false;
  }


  });
