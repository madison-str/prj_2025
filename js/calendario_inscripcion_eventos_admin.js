let selectedDates = [];
let events = {};
let finishedEvents = [];
let otherEvents = [];
let eventId = 1;
let dataTableInstance;
let data;
let plannedEvents_ = [];
const parametros = obtenerParametrosURL();
sessionStorage.setItem("month", parametros.mes);
sessionStorage.setItem("year", parametros.anio);
const resultado = infoMes(parametros.mes, parametros.anio);
let age;
let gender;
let genderMap;
let eventos = [];
let result = {};
let month;
let firstLetterGender;
let dayFormatted;

const Mes = document.getElementById("mes");
Mes.innerText = `${resultado.mesNombre} - ${resultado.anio}`;

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

  const fullName = `${firstName} ${lastName}`;

  const nameElem = document.getElementById("userName");
  const roleElem = document.getElementById("userRole");

  if (nameElem) nameElem.innerText = fullName;
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

  if (menu) {
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

document.addEventListener("change", async function (event) {
  if (event.target.classList.contains("inscribeCheckbox")) {
    const checkbox = event.target;

    const row = checkbox.closest("tr");

    const data = $("#eventTable").DataTable().row($(row)).data();

    const { documentType, documentNumber } = obtenerCedulaInfo("cedula");

    const eventData = {
      swimmerId: {
        documentType: documentType,
        documentNumber: documentNumber,
      },
      testDescription: data[3] || "Evento no encontrado",
    };

    if (checkbox.checked) {
      try {
        /*const response = await fetch(
          "https://c986-44-201-249-73.ngrok-free.app/mark/getMark",*/
        const response = await fetch(
          "http://localhost:8080/mark/getMark",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          }
        );
        const responseData = await response.json();

        if (responseData.code === "200") {
          row.cells[4].textContent = responseData.data;
        } else {
          await Swal.fire({
            title: "Error",
            text: responseData.message || "No se pudo actualizar el tiempo.",
            icon: "error",
            confirmButtonText: "Intentar nuevamente",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        }
      } catch (error) {
        console.error("Error al llamar el servicio:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "No se pudo conectar con el servidor.",
          icon: "error",
          confirmButtonText: "Intentar nuevamente",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } else {
      console.log("Checkbox desmarcado. No se realiza la llamada al servicio.");

      row.cells[4].textContent = "00:00:00";
    }
  }
});

function convertirFecha(fecha) {
  const partes = fecha.split("/");
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

//*//
function obtenerEventosSeleccionados() {
  const eventosSeleccionados = [];
  var table = $("#eventTable").DataTable();

  const checkboxes = document.querySelectorAll(
    "#eventTable .inscribeCheckbox:checked"
  );

  checkboxes.forEach((checkbox) => {
    const row = checkbox.closest("tr");

    const data = table.row(row).data();

    const tiempo = row.cells[4].textContent.trim();

    const fechas = data[1].split(" al ");
    const startDate = convertirFecha(fechas[0].trim());
    const endDate = convertirFecha(fechas[1].trim());

    eventosSeleccionados.push({
      tournamentName: data[2],
      startDate: startDate,
      endDate: endDate,
      eventName: data[3],
      mark: tiempo,
    });
  });

  return eventosSeleccionados;
}

function obtenerCedulaInfo(labelId) {
  const cedulaText = document.getElementById(labelId).innerText;

  const cedulaValue = cedulaText.replace("Cédula:", "").trim();

  const partes = cedulaValue.split("-");

  const documentType = partes[0];

  const documentNumber = partes.slice(1).join("-");

  return { documentType, documentNumber };
}

document
  .getElementById("registerEvent")
  .addEventListener("click", async function () {
    const submitButton = document.getElementById("registerEvent");
    eventos = obtenerEventosSeleccionados();

    if (eventos.length === 0) {
      await Swal.fire({
        title: "Advertencia",
        text: "Debe seleccionar al menos un evento para continuar.",
        icon: "warning",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    const { documentType, documentNumber } = obtenerCedulaInfo("cedula");

    const requestData = {
      swimmerDocumentType: documentType,
      swimmerDocumentNumber: documentNumber,
      eventsMarks: eventos,
    };

    try {
      /*const response = await fetch(
        "https://c986-44-201-249-73.ngrok-free.app/eventsregister/create",*/
      const response = await fetch(
        "http://localhost:8080/eventsregister/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      if (responseData.code === "201") {
        const pagoPendiente = await Swal.fire({
          title: "Inscripción registrada",
          text: "El nadador se ha inscrito correctamente. ¿Desea registrar su pago ahora?",
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

        if (pagoPendiente.isConfirmed) {
          window.location.href = "registro_pago_inscripcion.html";
        } else {
          const masInscripciones = await Swal.fire({
            title: "Pago pendiente",
            text: "Su inscripción fue exitosa. Sin embargo, queda pendiente el registro de su pago. ¿Desea realizar más inscripciones?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
            confirmButtonColor: "#007bff",
            cancelButtonColor: "#d6d6d6",
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
          });

          if (masInscripciones.isConfirmed) {
            //
          } else {
            window.location.href = "gestion.html";
          }
        }
      } else if (responseData.code === "409") {
        await Swal.fire({
          title: "Advertencia",
          text: "El nadador ya se encuentra registrado en uno o más eventos seleccionados",
          icon: "warning",
          confirmButtonText: "Intentar nuevamente",
          confirmButtonColor: "#007bff",
          allowOutsideClick: false,
          allowEscapeKey: false,
          backdrop: true,
        });
      } else {
        throw new Error(
          responseData.message || "Error al registrar el evento."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Intentar nuevamente",
        confirmButtonColor: "#007bff",
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true,
      });
    } finally {
      submitButton.disabled = false;
    }
  });

async function getOtherEventsCategories(age, gender, resultado) {
  const requestData = {
    month: resultado.mes || "",
    gender: gender.charAt(0) || "",
    age: age,
  };

  try {
    /*const response = await fetch(
      "https://c986-44-201-249-73.ngrok-free.app/events/outOfCategory",*/
      const response = await fetch(
      "http://localhost:8080/events/outOfCategory",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );
    const result = await response.json();

    if (result.code === "200" && result.data) {
      otherEvents = result.data || [];
    } else {
      console.error("Error en la respuesta:", result);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
  }
}

async function getFinishedEvents(age, gender, resultado) {
  const requestData = {
    month: resultado.mes || "",
    gender: gender.charAt(0) || "",
    age: age,
  };

  try {
    /*const response = await fetch(
      "https://c986-44-201-249-73.ngrok-free.app/events/finished",*/
    const response = await fetch(
      "http://localhost:8080/events/finished",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );
    const result = await response.json();

    if (result.code === "200" && result.data) {
      finishedEvents = result.data || [];
    } else {
      console.error("Error en la respuesta:", result);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
  }
}

async function getEventsByDate(age, gender, resultado) {
  const requestData = {
    month: resultado.mes || "",
    gender: gender.charAt(0) || "",
    age: age,
  };

  try {
    /*const response = await fetch(
      "https://c986-44-201-249-73.ngrok-free.app/events/programmed",*/
    const response = await fetch(
      "http://localhost:8080/events/programmed",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    result = await response.json();

    if (result.code === "200" && Array.isArray(result.data)) {
      let elements = document.getElementsByClassName("eventsCategory");

      for (let elem of elements) {
        elem.innerHTML = `Dentro de la Categoría: ${age} Años, ${genderMap[gender]}`;
      }

      result.data.forEach((ev) => {
        const day = ev.startDate;
        if (!events[day]) {
          events[day] = [];
        }

        ev.eventName.forEach((name, index) => {
          events[day].push({
            eventName: name,
            startDate: ev.startDate,
            endDate: ev.endDate?.[index] || ev.endDate || ev.startDate,
            tournamentName: ev.tournamentName?.[index] || "",
          });
        });
      });

      plannedEvents_ = result.data || [];
    } else {
      console.error("Error en la respuesta:", result);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
  }
}

async function searchSwimmer() {
  const requestData = {
    documentType: sessionStorage.getItem("userTypeDoc") || "",
    documentNumber: sessionStorage.getItem("userDoc") || "",
  };

  try {
    /*const response = await fetch(
      "https://c986-44-201-249-73.ngrok-free.app/swimmer/getById",*/
      const response = await fetch(
      "http://localhost:8080/swimmer/getById",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );
    const result = await response.json();

    if (result.code === "200" && result.data) {
      genderMap = {
        male: "Masculino",
        female: "Femenino",
        OTHER: "Otro",
      };

      function formatDate(isoDate) {
        if (!isoDate) return "Fecha no disponible";
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}/${year}`;
      }

      let age = result.data.age;
      let gender = result.data.gender;
      document.getElementById(
        "cedula"
      ).innerHTML = `<strong>Cédula:</strong> ${result.data.swimmerId.documentType}-${result.data.swimmerId.documentNumber}`;
      document.getElementById(
        "nombre"
      ).innerHTML = `<strong>Nombre:</strong> ${result.data.firstName}`;
      document.getElementById(
        "apellido"
      ).innerHTML = `<strong>Apellido:</strong> ${result.data.firstSurename}`;
      document.getElementById("sexo").innerHTML = `<strong>Género:</strong> ${
        genderMap[result.data.gender] || "No especificado"
      }`;
      document.getElementById(
        "edad"
      ).innerHTML = `<strong>Edad:</strong> ${result.data.age}`;
      document.getElementById(
        "fechaNac"
      ).innerHTML = `<strong>Fecha de Nacimiento:</strong> ${formatDate(
        result.data.birthDate
      )}`;

      await Promise.all([
        getEventsByDate(age, gender, resultado),
        getFinishedEvents(age, gender, resultado),
        getOtherEventsCategories(age, gender, resultado),
      ]);

      createCalendar(resultado.dias, resultado.primerDiaNumero);
    } else {
      console.error("Error: Respuesta inesperada del servicio", result);
    }
  } catch (error) {
    console.error("Error al obtener los datos del nadador:", error);
  }
}

function obtenerParametrosURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    mes: params.get("mes"),
    anio: params.get("anio"),
  };
}

function infoMes(mesParametro, anioParametro) {
  const mes = parseInt(mesParametro, 10);

  if (isNaN(mes) || mes < 1 || mes > 12) {
    return {
      error: "El parámetro 'mes' debe ser un número entre 1 y 12.",
    };
  }

  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const primerDiaFecha = new Date(anioParametro, mes - 1, 1);
  const primerDia = primerDiaFecha.getDay();

  const diasEnMes = new Date(anioParametro, mes, 0).getDate();

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return {
    anio: anioParametro,
    mes: mes,
    mesNombre: nombresMeses[mes - 1],
    dias: diasEnMes,
    primerDiaNumero: primerDia,
    primerDiaNombre: diasSemana[primerDia],
  };
}

function createCalendar(dias, primerDia) {
  const calendar = document.getElementById("calendar");
  const daysOfWeek = ["D", "L", "M", "M", "J", "V", "S"];
  const startDay = primerDia;
  const daysInMonth = dias;
  calendar.innerHTML = "";

  daysOfWeek.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day-header");
    dayElement.textContent = day;
    calendar.appendChild(dayElement);
  });

  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement("div");
    calendar.appendChild(emptyCell);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    let day = document.createElement("div");
    day.classList.add("day");
    day.textContent = i;

    if (events[i]) {
      day.classList.add("has-event");
      const eventIndicator = document.createElement("div");
      eventIndicator.classList.add("event", "planned");
      day.appendChild(eventIndicator);
      day.addEventListener("click", () => selectEvent(i, events[i]));
    }

    if (finishedEvents.some((event) => event.startDate === i)) {
      let finishedEventIndicator = document.createElement("div");
      finishedEventIndicator.classList.add("event", "finished");
      day.appendChild(finishedEventIndicator);
    }

    if (otherEvents.some((event) => event.startDate === i)) {
      let otherEventsIndicator = document.createElement("div");
      otherEventsIndicator.classList.add("event", "otherEvents");
      day.appendChild(otherEventsIndicator);
    }

    calendar.appendChild(day);
  }
}

function selectEvent(day, event) {
  let index = selectedDates.indexOf(day);

  const dayElement = document
    .querySelectorAll(".day")
    [day - 1]?.querySelector(".event");

  if (!dayElement) return;
  dayElement.classList.add("planned");

  if (index === -1) {
    selectedDates.push(day);
    dayElement.classList.add("selected");
  } else {
    selectedDates.splice(index, 1);
    dayElement.classList.remove("selected");

    const table = $("#eventTable").DataTable();

    const dayFormattedStart = `${day
      .toString()
      .padStart(2, "0")}/${resultado.mes.toString().padStart(2, "0")}/${
      resultado.anio
    }`;

    const rowIndexes = table
      .rows()
      .indexes()
      .toArray()
      .filter((index) => {
        const rowData = table.row(index).data();
        const fechaInicioEnTabla = rowData[1]?.split(" al ")[0];
        return fechaInicioEnTabla === dayFormattedStart;
      });

    for (let i = rowIndexes.length - 1; i >= 0; i--) {
      table.row(rowIndexes[i]).remove();
    }

    if (rowIndexes.length > 0) {
      table.draw(false);
    }
  }

  updateTable();
  reorganizeIndexes();
}

function updateTable() {
  let table = $("#eventTable").DataTable();
  let existingData = table.rows().data().toArray();

  selectedDates.forEach((day) => {
    let eventDataList = plannedEvents_.filter((item) => item.startDate === day);

    if (eventDataList.length > 0) {
      eventDataList.forEach((eventData) => {
        eventData.eventName.forEach((eventName, index) => {
          let tournamentsName = eventData.tournamentName[index] || "";

          let isExisting = existingData.some((row) => {
            return (
              row[1] ===
                `${day.toString().padStart(2, "0")}/${resultado.mes
                  .toString()
                  .padStart(2, "0")}/${resultado.anio} al ${eventData.endDate
                  .toString()
                  .padStart(2, "0")}/${resultado.mes
                  .toString()
                  .padStart(2, "0")}/${resultado.anio}` &&
              row[2] === tournamentsName &&
              row[3] === eventName
            );
          });

          if (!isExisting) {
            const createDropdown = (name, options) => {
              return `
                  <div class="custom-dropdown">
                    <div class="dropdown-selected" data-type="${name}" data-id="${eventId}">00</div>
                    <div class="dropdown-options">
                      ${options
                        .map(
                          (option) =>
                            `<div class="dropdown-option" onclick="selectOption(${eventId}, '${name}', ${option})">${
                              option < 10 ? "0" + option : option
                            }</div>`
                        )
                        .join("")}
                    </div>
                  </div>
                `;
            };

            table.row
              .add([
                eventId++,
                `${day.toString().padStart(2, "0")}/${resultado.mes
                  .toString()
                  .padStart(2, "0")}/${resultado.anio} al ${eventData.endDate
                  .toString()
                  .padStart(2, "0")}/${resultado.mes
                  .toString()
                  .padStart(2, "0")}/${resultado.anio}`,
                tournamentsName,
                eventName,

                `<span class="time" data-id="${eventId - 1}">00:00:00</span>`,
                `<input type="checkbox" class="inscribeCheckbox" data-index="${index}" style="display: block; margin: 0 auto;">`,
                `<i class="fas fa-trash-alt" title="Eliminar fila" style="color: blue; cursor: pointer; display: block; margin: 0 auto;"></i>`,
              ])
              .draw(false);
          }
        });
      });
    }
  });
}

function getTimeValues(eventName) {
  return {
    minutes: "00",
    seconds: "00",
    centiseconds: "00",
    time: "00:00:00",
  };
}

function scrollToTop() {
  const container = document.querySelector(".events-container");
  if (container) {
    container.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom() {
  document.querySelectorAll(".events-container").forEach((container) => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  });
}

function obtenerEstadoEvento(endDate, mes, anio) {
  const endDateValue = Array.isArray(endDate) ? endDate[0] : endDate;

  const parsedEndDate = parseInt(endDateValue, 10);
  if (isNaN(parsedEndDate)) {
    console.warn("endDate no válido:", endDateValue);
    return "DESCONOCIDO";
  }

  const fechaFinEvento = new Date(anio, mes - 1, parsedEndDate);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return fechaFinEvento >= hoy ? "PROGRAMADO" : "FINALIZADO";
}

$(document).ready(function () {
  dataTableInstance = $("#eventTable").DataTable({
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ entradas",
      infoEmpty: "Mostrando _TOTAL_ entradas",
      info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
      emptyTable:
        "Seleccione alguno de los eventos programados en el calendario",
    },
  });

  let plannedTable = $("#plannedEventsTable").DataTable({
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ entradas",
      infoEmpty: "Mostrando _TOTAL_ entradas",
      info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
      emptyTable: "No hay datos disponibles en la tabla",
    },
  });

  let otherEventsTable = $("#otherEventsTable").DataTable({
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ entradas",
      infoEmpty: "Mostrando _TOTAL_ entradas",
      info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
      emptyTable: "No hay datos disponibles en la tabla",
    },
  });

  let finishedTable = $("#finishedEventsTable").DataTable({
    language: {
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ entradas",
      infoEmpty: "Mostrando _TOTAL_ entradas",
      info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
      emptyTable: "No hay datos disponibles en la tabla",
    },
  });

  $("#eventTable tbody").on("click", ".fa-trash-alt", function () {
    const table = $("#eventTable").DataTable();
    let row = table.row($(this).parents("tr"));
    let rowData = row.data();

    let date = parseInt(rowData[1].split("/")[0]);

    let remainingRows = table
      .rows()
      .data()
      .toArray()
      .filter((data) => parseInt(data[1].split("/")[0]) === date);

    row.remove().draw();

    if (remainingRows.length === 1) {
      let dayElement = document
        .querySelectorAll(".day")
        [date - 1]?.querySelector(".event");
      if (dayElement) {
        dayElement.classList.remove("selected");
        selectedDates = [];
      }
    }

    reorganizeIndexes();
  });

  $("#clearEvents").on("click", function () {
    const table = $("#eventTable").DataTable();
    table.clear().draw();
    selectedDates = [];
    createCalendar(resultado.dias, resultado.primerDiaNumero);
    eventId = 1;
  });

  $("#planned-Events").on("click", function () {
    let idCounter = 1;
    let plannedEventsTable = $("#plannedEventsTable").DataTable();
    plannedEventsTable.clear().draw();

    $("#eyeIcon-1").toggleClass("fa-eye fa-eye-slash");
    $("#eyeIcon-1").css(
      "color",
      $("#eyeIcon-1").hasClass("fa-eye") ? "#012EDC" : "#f5754C"
    );

    plannedEvents_.forEach((event) => {
      event.eventName.forEach((eventName, index) => {
        let status = "PROGRAMADO" || "";
        let tournamentsName = event.tournamentName[index] || "";

        plannedEventsTable.row
          .add([
            idCounter++,
            `${event.startDate.toString().padStart(2, "0")}/${resultado.mes
              .toString()
              .padStart(2, "0")}/${resultado.anio} al ${event.endDate
              .toString()
              .padStart(2, "0")}/${resultado.mes.toString().padStart(2, "0")}/${
              resultado.anio
            }`,
            tournamentsName,
            eventName,
            status,
          ])
          .draw(false);
      });
    });
    $("#plannedEventsTableContainer").toggleClass("hidden");

    const plannedTitle = document.getElementById("plannedEventsTitle");
    if (plannedTitle) {
      plannedTitle.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  $("#showFinished").on("click", function () {
  let idCounter = 1;

    let finishedTable = $("#finishedEventsTable").DataTable();

    finishedTable.clear().draw();

    $("#eyeIcon-2").toggleClass("fa-eye fa-eye-slash");
    $("#eyeIcon-2").css(
      "color",
      $("#eyeIcon-2").hasClass("fa-eye") ? "#012EDC" : "#f5754C"
    );

    finishedEvents.forEach((event) => {
      event.eventName.forEach((eventName, index) => {
        let tournamentsName = event.tournamentName[index] || "";
        let status = "FINALIZADO" || "";

        finishedTable.row
          .add([
            idCounter++,
            `${event.startDate.toString().padStart(2, "0")}/${resultado.mes
              .toString()
              .padStart(2, "0")}/${resultado.anio} al ${event.endDate
              .toString()
              .padStart(2, "0")}/${resultado.mes.toString().padStart(2, "0")}/${
              resultado.anio
            }`,
            tournamentsName,
            eventName,
            status,
          ])
          .draw(false);
      });
    });
    $("#finishedEventsTableContainer").toggleClass("hidden");

    const finishedTitle = document.getElementById("finishedEventsTitle");
    if (finishedTitle) {
      finishedTitle.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  // Limpiar tabla antes de cargar nuevos datos
  /*const finishedTable = $("#finishedEventsTable").DataTable();
  finishedTable.clear();

  $("#eyeIcon-2").toggleClass("fa-eye fa-eye-slash");
  $("#eyeIcon-2").css(
    "color",
    $("#eyeIcon-2").hasClass("fa-eye") ? "#012EDC" : "#f5754C"
  );

  finishedEvents.forEach((event) => {
    event.eventName.forEach((eventName, index) => {
      let tournamentsName = event.tournamentName[index] || "";
      let status = "FINALIZADO";

      finishedTable.row.add([
        idCounter++,
        `${event.startDate.toString().padStart(2, "0")}/${resultado.mes
          .toString()
          .padStart(2, "0")}/${resultado.anio} al ${event.endDate
          .toString()
          .padStart(2, "0")}/${resultado.mes.toString().padStart(2, "0")}/${
          resultado.anio
        }`,
        tournamentsName,
        eventName,
        status,
        //`<input type="checkbox" class="inscribeCheckbox" data-index="${index}" style="display: block; margin: 0 auto;">`,
      ]);
    });
  });

  // Redibujar la tabla después de añadir todos los datos
  //finishedTable.draw();

  // Mostrar u ocultar contenedor
  $("#finishedEventsTableContainer").toggleClass("hidden");

  const finishedTitle = document.getElementById("finishedEventsTitle");
  if (finishedTitle) {
    finishedTitle.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Marcar o desmarcar todos los checkboxes visibles en todas las páginas
  /*$("#selectAllCheckbox")
    .off("change")
    .on("change", function () {
      const isChecked = $(this).is(":checked");
      finishedTable.rows().every(function () {
        const row = this.node();
        $(row).find(".inscribeCheckbox").prop("checked", isChecked);
      });
    });*/

  // Sincronizar estado del checkbox global si cambian individuales
  /*$(document).off("change", ".inscribeCheckbox").on("change", ".inscribeCheckbox", function () {
    const checkboxes = $(".inscribeCheckbox");
    const allChecked = checkboxes.length === checkboxes.filter(":checked").length;
    $("#selectAllCheckbox").prop("checked", allChecked);
  });
  
//});*/

  $("#showOtherEvents").on("click", function () {
    let idCounter = 1;
    let otherEventsTable = $("#otherEventsTable").DataTable();

    otherEventsTable.clear().draw();

    $("#eyeIcon-3").toggleClass("fa-eye fa-eye-slash");
    $("#eyeIcon-3").css(
      "color",
      $("#eyeIcon-3").hasClass("fa-eye") ? "#012EDC" : "#f5754C"
    );

    otherEvents.forEach((event) => {
      event.eventName.forEach((eventName, index) => {
        let status = obtenerEstadoEvento(
          event.endDate,
          resultado.mes,
          resultado.anio
        );
        let tournamentsName = event.tournamentName[index] || "";
        otherEventsTable.row
          .add([
            idCounter++,
            `${event.startDate.toString().padStart(2, "0")}/${resultado.mes
              .toString()
              .padStart(2, "0")}/${resultado.anio} al ${event.endDate
              .toString()
              .padStart(2, "0")}/${resultado.mes.toString().padStart(2, "0")}/${
              resultado.anio
            }`,
            tournamentsName,
            eventName,
            status,
          ])
          .draw(false);
      });
    });

    $("#otherEventsTableContainer").toggleClass("hidden");
    const otherEventsTitle = document.getElementById("otherEventsTitle");
    if (otherEventsTitle) {
      otherEventsTitle.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

function reorganizeIndexes() {
  let filas = document.querySelectorAll("#eventTable tbody tr");
  const table = $("#eventTable").DataTable();

  if (table.rows({ filter: "applied" }).data().length === 0) {
    const mensajeFila = document.createElement("tr");

    if (
      !document.querySelector('#eventTable tbody tr[data-empty-message="true"]')
    ) {
      mensajeFila.setAttribute("data-empty-message", "true");
      document.querySelector("#eventTable tbody").appendChild(mensajeFila);
    }

    eventId = 1;
  } else {
    filas.forEach((fila, index) => {
      fila.cells[0].textContent = index + 1;
    });
  }
}

setUserIcon();
searchSwimmer();
