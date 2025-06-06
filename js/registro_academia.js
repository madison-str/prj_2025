let birthD;
birthD = new Date();

const form = document.querySelector("form");
const submitButton = form.querySelector("button[type='submit']");

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

function calcularEdad(birthDate) {
  let partes = birthDate.split("/");
  let birth = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  let today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

function transformDate(birthDate) {
  let partes = birthDate.split("/");
  let birth_ = new Date(`${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`);

  let year = birth_.getFullYear();
  let month = (birth_.getMonth() + 1).toString().padStart(2, "0");
  let day = birth_.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function validateField(id, fieldName) {
  const field = document.getElementById(id);
  const errorField = document.getElementById(
    "error" + id.charAt(0).toUpperCase() + id.slice(1)
  );
  const value = field.value.trim();

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ' ]+$/;
  const phoneRegex = /^0(?!000)\d{3}-(?!0{7})\d{7}$/;

  if (
    ["firstName", "secondName", "firstSurename", "secondSurename"].includes(id)
  ) {
    if (!value) {
      errorField.textContent = `${fieldName} es obligatorio`;
      return false;
    }
    if (!nameRegex.test(value)) {
      errorField.textContent = `${fieldName} solo puede contener letras, acentos y apóstrofes`;
      return false;
    }
  } else if (["representorName", "representorSurename"].includes(id)) {
    if (value && !nameRegex.test(value)) {
      errorField.textContent = `${fieldName} solo puede contener letras, acentos y apóstrofes`;
      return false;
    }
  } else if (!value) {
    errorField.textContent = `${fieldName} es obligatorio`;
    return false;
  } else if (id === "phone") {
    let digits = field.value.replace(/\D/g, "");

    if (digits.length > 4) {
      digits = digits.slice(0, 4) + "-" + digits.slice(4);
    }

    field.value = digits.slice(0, 12);

    const value = field.value.trim();

    if (!value) {
      errorField.textContent = `${fieldName} es obligatorio`;
      return false;
    }

    if (!phoneRegex.test(value)) {
      errorField.textContent = `${fieldName} debe tener el formato 04xx-xxxxxxx, y no puede tener solo ceros.`;
      return false;
    } else {
      errorField.textContent = "";
      return true;
    }
  } else if (id === "incomingDate") {
    if (!value) {
      errorField.textContent = `${fieldName} es obligatorio`;
      return false;
    }

    const fechaIngresoDate = new Date(value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const birthDateValue = document.getElementById("birthDate").value;
    const fechaNacimiento = new Date(birthDateValue);

    if (fechaIngresoDate > fechaActual) {
      errorField.textContent =
        "Fecha de Ingreso no puede ser mayor a la fecha actual.";
      return false;
    }

    if (birthDateValue && fechaIngresoDate <= fechaNacimiento) {
      errorField.textContent =
        "Fecha de Ingreso no puede ser menor o igual a la fecha de nacimiento.";
      return false;
    }

    errorField.textContent = "";
    return true;
  }

  errorField.textContent = "";
  return true;
}

function attachRealTimeValidations() {
  const fieldLabels = {
    documentType: "Tipo de Documento",
    documentNumber: "Número de Documento",
    firstName: "Primer Nombre",
    secondName: "Segundo Nombre",
    firstSurename: "Primer Apellido",
    secondSurename: "Segundo Apellido",
    representorName: "Nombre Representante",
    representorSurename: "Apellido Representante",
    age: "Edad",
    gender: "Género",
    birthDate: "Fecha de Nacimiento",
    incomingDate: "Fecha de Ingreso",
    email: "Correo Electrónico",
    phone: "Teléfono",
    team: "Equipo",
  };

  Object.keys(fieldLabels).forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", function () {
        validateField(id, fieldLabels[id]);
      });
    }
  });
}

function validateForm() {
  let valid = true;
  const fieldsToValidate = {
    documentType: "Tipo de Documento",
    documentNumber: "Número de Documento",
    firstName: "Primer Nombre",
    secondName: "Segundo Nombre",
    firstSurename: "Primer Apellido",
    secondSurename: "Segundo Apellido",
    representorName: "Nombre Representante",
    representorSurename: "Apellido Representante",
    age: "Edad",
    gender: "Género",
    birthDate: "Fecha de Nacimiento",
    incomingDate: "Fecha de Ingreso",
    email: "Correo Electrónico",
    phone: "Teléfono",
    team: "Equipo",
  };

  Object.entries(fieldsToValidate).forEach(([id, label]) => {
    if (!validateField(id, label)) {
      valid = false;
    }
  });
  return valid;
}

async function loadTeams() {
  const teamSelect = document.getElementById("team");

  let data = {};

  try {
    /*const response = await fetch(
      "https://c986-44-201-249-73.ngrok-free.app/team/getAll",*/
      const response = await fetch(
      "http://localhost:8080/team/getAll",

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    data = await response.json();

    if (data.code === "200" && Array.isArray(data.data)) {
      data.data.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.teamName;
        option.textContent = team.teamName;
        teamSelect.appendChild(option);
      });
    } else {
      console.error("Error: Respuesta inesperada del servicio", data);
    }
  } catch (error) {
    console.error("Error al obtener los equipos:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setUserIcon();

  loadTeams();

  const sessionData = {
    documentType: sessionStorage.getItem("userTypeDoc") || "",
    documentNumber: sessionStorage.getItem("userDoc") || "",
    firstName: sessionStorage.getItem("userFirstName") || "",
    lastName: sessionStorage.getItem("userLastName") || "",
    birthDate: sessionStorage.getItem("userBirthdate") || "",
    email: sessionStorage.getItem("userEmail") || "",
  };

  const edad = calcularEdad(sessionData.birthDate);

  document.getElementById("documentType").value = sessionData.documentType;
  document.getElementById("documentNumber").value = sessionData.documentNumber;
  document.getElementById("firstName").value = sessionData.firstName;
  document.getElementById("firstSurename").value = sessionData.lastName;
  document.getElementById("birthDate").value = sessionData.birthDate;
  document.getElementById("age").value = edad;
  document.getElementById("email").value = sessionData.email;

  attachRealTimeValidations();
});

document
  .getElementById("form-swimmer")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateForm()) {
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
    const swimmerK =
      document.getElementById("firstName").value.trim() +
      document.getElementById("firstSurename").value.trim();

    const requestData = {
      documentType: document.getElementById("documentType").value.trim(),
      documentNumber: document.getElementById("documentNumber").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      secondname: document.getElementById("secondName").value.trim(),
      firstSurename: document.getElementById("firstSurename").value.trim(),
      secondSurename: document.getElementById("secondSurename").value.trim(),
      age: parseInt(document.getElementById("age").value),
      gender: document.getElementById("gender").value.trim(),
      birthDate: document.getElementById("birthDate").value,
      incomingDate: document.getElementById("incomingDate").value,
      email: document.getElementById("email").value.trim(),
      swimmerKey: swimmerK,
      status: "A",
      representorName: document.getElementById("representorName").value.trim(),
      representorSurename: document
        .getElementById("representorSurename")
        .value.trim(),
      phone: document.getElementById("phone").value.trim(),
      team: document.getElementById("team").value.trim(),
    };

    try {
      /*const response = await fetch(
        "https://c986-44-201-249-73.ngrok-free.app/swimmer/create",*/
        const response = await fetch(
        "http://localhost:8080/swimmer/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      if (responseData.code === "201") {
        await Swal.fire({
          title: "Registro exitoso",
          text: "El nadador ha sido inscrito correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        window.location.href = "gestion.html";
      } else if (responseData.code === "409") {
        await Swal.fire({
          title: "Error",
          text: "Ya existe un usuario registrado con ese número de documento",
          icon: "error",
          confirmButtonText: "Aceptar",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      } else {
        throw new Error(
          responseData.message || "Error al registrar el usuario."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Intentar nuevamente",
      });
    } finally {
      submitButton.disabled = false;
    }
  });
