const form = document.querySelector("form");
        const submitButton = form.querySelector("button[type='submit']");
        const errorDate = document.getElementById("errorDate");
 
        var valid = true;
        function logout() {
            sessionStorage.clear();
            window.location.href = "index.html";
        }


        function limitarLongitud(input) {
            let valor = input.value;
            if (valor.length > 8) {
                input.value = valor.slice(0, 8); 
            }
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
            if (menu && userIcon && userContainer && !userContainer.contains(event.target)) {
                menu.style.display = "none";
                userIcon.style.backgroundColor = "#F36621";
            }
        });
       


        function validateField(id, label) {
            let valid = true;
           


            const errorField = document.getElementById("error" + id.charAt(0).toUpperCase() + id.slice(1));
            
            if (id === "teams_container") {
          
                const checkboxes = document.querySelectorAll('input[name="teamsNames[]"]:checked');
                if (checkboxes.length === 0) {
                    errorField.textContent = `Debe seleccionar al menos un ${label}.`;
                    errorField.style.display = "block";
                    valid = false;
                } else {
                    errorField.textContent = "";
                    errorField.style.display = "none";
                    valid = true;
                }
            } else {
                
                const field = document.getElementById(id);
                if (!field || field.value.trim() === "") {
                    errorField.textContent = `${label} es requerido.`;
                    errorField.style.display = "block";
                    valid = false;
                } else {
                    errorField.textContent = "";
                    errorField.style.display = "none";
                    valid = true;
                }
            }

            var fechaInicio = document.getElementById("startDate").value;
            var fechaFin = document.getElementById("endDate").value;

            
            var fechaInicioParts = fechaInicio.split('-');
            var fechaInicioDate = new Date(fechaInicioParts[0], fechaInicioParts[1] - 1, fechaInicioParts[2]);


            var fechaDatePartsfin = fechaFin.split('-');
            var fechaFinDate = new Date(fechaDatePartsfin[0], fechaDatePartsfin[1] - 1, fechaDatePartsfin[2]);

           
            var hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (fechaInicioDate < hoy) {
                errorDate.textContent = "La Fecha Inicio no puede ser menor que la fecha actual.";
                errorDate.style.display = "block";
                event.preventDefault();
                valid = false;
            } else if (fechaInicioDate.getTime() > fechaFinDate.getTime()) {
                errorDate.textContent = "La Fecha Inicio no puede ser mayor que la Fecha Fin.";
                errorDate.style.display = "block";
                event.preventDefault();
                valid = false;

            } else {           
                errorDate.textContent = "";
                errorDate.style.display = "none";

            }
            return valid;

        }


        function attachRealTimeValidations() {
            const fieldLabels = {

                tournament: "Torneo",
                numeroEquipo: "Número Equipo",
                teams_container: "Equipo",
                startDate: "Fecha Inicio",
                endDate: "Fecha Fin"

            };

            Object.keys(fieldLabels).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener("input", function () {
                        const prueba = validateField(id, fieldLabels[id]);

                    });


                }
            });
        }


        function validateForm() {
            let valid = true;
            const fieldsToValidate = {

                tournament: "Torneo",
                numeroEquipo: "Número Equipo",
                teams_container: "Equipo",
                startDate: "Fecha Inicio",
                endDate: "Fecha Fin"
            };

            Object.entries(fieldsToValidate).forEach(([id, label]) => {
                if (!validateField(id, label)) {
                    valid = false;
                }
            });
            return valid;
        }

        async function loadTeams() {

            let data = {};

            try {
                
                //const response = await fetch("https://c986-44-201-249-73.ngrok-free.app/team/getAll", {
                const response = await fetch("http://localhost:8080/team/getAll", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });

               

                data = await response.json();               
    

                if (data.code !== "200") {
                    throw new Error(`La API respondió con código: ${data.code}`);
                }

                               
                if (!data.data || !Array.isArray(data.data)) {

                    throw new Error('La estructura de la respuesta no es válida.');

                }

                const teams = data.data;
                const teamsContainer = document.getElementById('teams_container');
                teamsContainer.innerHTML = ''; 

                const column1 = document.createElement('div');
                const column2 = document.createElement('div');
             
                teamsContainer.style.display = 'flex';
                teamsContainer.style.gap = '2vw';
                column1.style.flex = '1';
                column2.style.flex = '1';


                teamsContainer.appendChild(column1);
                teamsContainer.appendChild(column2);

              
                const mitad = Math.ceil(teams.length / 2);
                const teamsCol1 = teams.slice(0, mitad);
                const teamsCol2 = teams.slice(mitad);

                function crearCheckboxes(teamsArray, container) {
                    teamsArray.forEach(team => {
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.style.width = "0.85vw";
                        checkbox.style.height = "0.85vw";
                        checkbox.style.appearance = "none";
                        checkbox.style.border = "0.1vw solid gray";
                        checkbox.style.padding = "0px";
                        checkbox.style.borderRadius = "0.2vw";
                        checkbox.style.marginLeft = "0.5%";
                        checkbox.style.outline = "none";
                        checkbox.style.position = "absolute";
                        checkbox.style.marginTop = "0.1%"

                        checkbox.name = 'teamsNames[]';
                        checkbox.value = team.teamName;
                        checkbox.id = `team-${team.id}`;

                        const label = document.createElement('label');
                        label.htmlFor = `team-${team.id}`;
                        label.textContent = team.teamName;
                        label.style.position = "absolute";
                        label.style.marginLeft = "1.5%"

                        const div = document.createElement('div');

                        div.style.height = "1.2vw";
                        div.style.maxHeight = "1.2vw";
                    
                        div.appendChild(checkbox);
                        div.appendChild(label);
                        container.appendChild(div);
                
                        checkbox.addEventListener('change', function () {
                            if (checkbox.checked) {

                                checkbox.style.backgroundImage = "url('data:image/svg+xml;charset=UTF-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path fill=%22white%22 d=%22M20.285 2.859a1 1 0 0 1 1.41 1.41l-12 12a1 1 0 0 1-1.41 0l-6-6a1 1 0 1 1 1.41-1.41L9 13.086l11.285-11.227z%22/></svg>')";
                                checkbox.style.backgroundSize = "contain";
                                checkbox.style.backgroundRepeat = "no-repeat";
                                checkbox.style.backgroundPosition = "center";
                                checkbox.style.backgroundColor = "blue";                           
                                checkbox.style.border = "0.1vw solid blue";
                            } else {

                                checkbox.style.backgroundColor = "transparent";
                                checkbox.style.backgroundImage = "none";
                                checkbox.style.border = "0.1vw solid gray";
                            }

                        });
                    });
                }

                crearCheckboxes(teamsCol1, column1);
                crearCheckboxes(teamsCol2, column2);
                

            } catch (error) {
                console.error('Error al cargar los equipos:', error);
            }

        }


        async function loadTournaments() {

            const tournamentSelect = document.getElementById("tournament"); 

            try {

                let data = {};               
                const response = await fetch("https://c986-44-201-249-73.ngrok-free.app/master-tournaments/getAll", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });


                data = await response.json();

                if (data.code === "200" && Array.isArray(data.data)) {
                    data.data.forEach(tournament => {
                        const option = document.createElement("option");
                        option.value = tournament.tournamentName;
                        option.textContent = tournament.tournamentName;
                        tournamentSelect.appendChild(option);
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
            loadTeams();
            attachRealTimeValidations();
        });


        document.getElementById("form-swimmer").addEventListener("submit", async function (event) {
            event.preventDefault();


            const checkboxes = document.querySelectorAll('input[name="teamsNames[]"]:checked');

            const selectedTeams = Array.from(checkboxes).map(cb => cb.value);

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

           
            const requestData = {

                tournamentName: document.getElementById("tournament").value.trim(),
                startDate: document.getElementById("startDate").value,
                endDate: document.getElementById("endDate").value,
                teamsNames: selectedTeams,
                teamNumber: document.getElementById("numeroEquipo").value

            };

            try {
              
                const response = await fetch("https://c986-44-201-249-73.ngrok-free.app/tournament/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData)
                });

                const responseData = await response.json();
              
                    if (responseData.code === "201") {
                        const result = await Swal.fire({
                          title: "Registro exitoso",
                          text: "¿Desea continuar registrando torneos?",
                          icon: "success",
                          showCancelButton: true,
                          confirmButtonText: "Sí",
                          cancelButtonText: "No",
                          confirmButtonColor: "#007bff",    
                          cancelButtonColor: "#d6d6d6" ,    
                          allowOutsideClick: false,
                          allowEscapeKey: false,
                          backdrop: true
                        });
                      
                        if (result.isConfirmed) {
                          
                          window.location.href = window.location.href;
                        } else {
                        
                          window.location.href = "gestion.html";
                        }
                      
                } else if (responseData.code === "409") {
                    await Swal.fire({
                        title: "Error",
                        text: "Ya existe un torneo con ese nombre y fechas",
                        icon: "error",
                        confirmButtonText: "Intentar nuevamente",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                } else {
                    throw new Error(responseData.message || "Error al registrar el torneo.");
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

       
        document.getElementById("teams_container").addEventListener("change", function () {
            const checkboxes = document.querySelectorAll('input[name="teamsNames[]"]:checked');
            const errorSpan = document.getElementById("errorTeams_container");

            if (checkboxes.length > 0) {
                errorSpan.style.display = "none"; 
            }
        });