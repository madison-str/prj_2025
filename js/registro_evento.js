const tournamentSelectGlobal = document.getElementById("tournament");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

let tournamentsData = [];

tournamentSelectGlobal.addEventListener("change", updateDates);

const form = document.querySelector("form");
const submitButton = form.querySelector("button[type='submit']");

function transformDate(birthDate) {
  let partes = birthDate.split("/");
  let birth_ = new Date(`${partes[2]}-${partes[1]}-${partes[0]}T00:00:00`);
  let year = birth_.getFullYear();
  let month = (birth_.getMonth() + 1).toString().padStart(2, "0");
  let day = birth_.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

function validateField(id, label) {
  let valid = true;
  const errorField = document.getElementById(
    "error" + id.charAt(0).toUpperCase() + id.slice(1)
  );

  if (id === "events_container") {
    if (selectedEvents.length === 0) {
      errorField.textContent = `Debe seleccionar al menos un ${label}.`;
      errorField.style.display = "block";
      valid = false;
    } else {
      errorField.textContent = "";
      errorField.style.display = "none";
    }
  } else {
    const field = document.getElementById(id);
    console.log("field:::" + field.value);
    if (!field || field.value.trim() === "") {
      errorField.textContent = `${label} es requerido.`;
      errorField.style.display = "block";
      valid = false;
    } else {
      errorField.textContent = "";
      errorField.style.display = "none";
    }
  }
  return valid;
}

function attachRealTimeValidations() {
  const fieldLabels = {
    tournament: "Torneo",
    events_container: "Evento",
    startDate: "Fecha Inicio",
    endDate: "Fecha Fin",
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

function updateDates() {
  const selectedTournament = tournamentSelectGlobal.value;
  console.log("torneo seleccionado: " + selectedTournament);

  console.log(tournamentsData);
  console.log(Array.isArray(tournamentsData));

  const tournament = tournamentsData.find(
    (item) => item.tournamentName === selectedTournament
  );

  if (tournament) {
    startDateInput.value = tournament.startDate;
    endDateInput.value = tournament.endDate;
  } else {
    startDateInput.value = "";
    endDateInput.value = "";
  }

  const fieldLabels = {
    startDate: "Fecha Inicio",
    endDate: "Fecha Fin",
  };
  console.log("valor de fields::" + fieldLabels.startDate, fieldLabels.endDate);
  Object.keys(fieldLabels).forEach((id) => {
    const element = document.getElementById(id);
    console.log("valor de element::" + element.value);
    if (element) {
      validateField(id, fieldLabels[id]);
    }
  });
}

function validateForm() {
  let valid = true;
  const fieldsToValidate = {
    tournament: "Torneo",
    events_container: "Evento",
    startDate: "Fecha Inicio",
    endDate: "Fecha Fin",
  };
  Object.entries(fieldsToValidate).forEach(([id, label]) => {
    if (!validateField(id, label)) {
      valid = false;
    }
  });
  return valid;
}

async function loadEvents() {
  let data = {};

  try {
    /*const response = await fetch(
      "https://c986-44-201-249-73.ngrok-free.app/tests/getList",*/
      const response = await fetch(
      "http://localhost:8080/tests/getList",
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

    if (data.code !== "200") {
      throw new Error(`La API respondió con código: ${data.code}`);
    }

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("La estructura de la respuesta no es válida.");
    }

    const teamsData = data.data.map((teamStr, index) => {
      const partes = teamStr.split(",").map((item) => item.trim());
      return {
        id: index + 1,
        estilo: partes[0],
        edad: partes[1],
        genero: partes[2],
        original: teamStr,
      };
    });

    if ($.fn.DataTable.isDataTable("#events_table")) {
      $("#events_table").DataTable().destroy();
    }
    $("#events_table").DataTable({
      data: teamsData,
      columns: [
        { data: "id", title: "ID" },
        { data: "estilo", title: "Estilo" },
        { data: "edad", title: "Edad" },
        { data: "genero", title: "Género" },
        {
          data: null,
          title: "Seleccionar",
          orderable: false,
          render: function (data, type, row) {
            return `<input type="checkbox" class="event-checkbox" data-id="${row.id}" style="
                
              ">`;
          },
        },
      ],
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      responsive: true,
      language: {
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        paginate: {
          previous: "Anterior",
          next: "Siguiente",
        },
      },
    });

    selectedEvents = [];

    $("#events_table tbody")
      .off("change")
      .on("change", ".event-checkbox", function () {
        const table = $("#events_table").DataTable();
        const rowData = table.row($(this).closest("tr")).data();

        if (this.checked) {
          if (!selectedEvents.find((event) => event.id === rowData.id)) {
            selectedEvents.push(rowData);
          }
        } else {
          selectedEvents = selectedEvents.filter(
            (event) => event.id !== rowData.id
          );
        }

        validateField("events_container", "Evento");

        console.log("Eventos seleccionados:", selectedEvents);
      });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

async function loadTournaments() {
  let data = {};
  const tournamentSelect = document.getElementById("tournament");

  try {
    /*const response = await fetch(
      "https://c986-44-201-249-73.ngrok-free.app/tournament/getList",*/
      const response = await fetch(
      "http://localhost:8080/team/getAll/tournament/getList",
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
      data.data.forEach((tournament) => {
        const option = document.createElement("option");
        option.value = tournament.tournamentName;
        option.textContent = tournament.tournamentName;
        tournamentSelect.appendChild(option);
        tournamentsData.push(tournament);
      });
    } else {
      console.error("Error: Respuesta inesperada del servicio", data);
    }
  } catch (error) {
    console.error("Error al obtener los torneos:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setUserIcon();
  loadTournaments();
  loadEvents();
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

    const eventsNames = selectedEvents.map((event) => event.original);
    const requestData = {
      tournamentName: document.getElementById("tournament").value.trim(),
      eventsNames: eventsNames,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
    };
    try {
      /*const response = await fetch(
        "https://c986-44-201-249-73.ngrok-free.app/events/create",*/
      const response = await fetch(
        "http://localhost:8080/events/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );
      const responseData = await response.json();

      if (responseData.code === "201") {
        const result = await Swal.fire({
          title: "Registro exitoso",
          text: "¿Desea continuar registrando eventos?",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
          confirmButtonColor: "#007bff",
          cancelButtonColor: "#d6d6d6",
          allowOutsideClick: false,
          allowEscapeKey: false,
          backdrop: true,
        });

        if (result.isConfirmed) {
          window.location.href = window.location.href;
        } else {
          window.location.href = "gestion.html";
        }
      } else if (responseData.code === "409") {
        await Swal.fire({
          title: "Error",
          text: "Ya se han registrado uno o más eventos con el mismo nombre, para ese torneo",
          icon: "error",
          confirmButtonText: "Intentar nuevamente",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      } else {
        throw new Error(
          responseData.message || "Error al registrar el evento."
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
