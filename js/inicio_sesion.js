document.addEventListener("DOMContentLoaded", function () {

    function updateUserEmail() {
        const userEmail = sessionStorage.getItem("userEmail") || "";
        const emailInput = document.getElementById("correo");
        if (emailInput) {
            emailInput.value = userEmail;
        }
    }

    updateUserEmail();

    const toggleIcons = document.querySelectorAll('.toggle-password');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const targetInputId = this.getAttribute('data-target');
            const input = document.getElementById(targetInputId);
            if (input) {
                input.type = input.type === "password" ? "text" : "password";
                this.classList.toggle("fa-eye");
                this.classList.toggle("fa-eye-slash");
            }
        });
    });

    const form = document.getElementById("loginForm");
    const btnLogin = document.getElementById("btnLogin");
    const correo = document.getElementById("correo");
    const contrasena = document.getElementById("contrasena");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorContrasena = document.getElementById("errorContrasena");

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    correo.addEventListener("input", function () {
        errorCorreo.textContent = correo.value.trim() === "" ? "El correo electrónico es requerido."
            : !regexEmail.test(correo.value) ? "Ingresa un correo electrónico válido." : "";
    });

    contrasena.addEventListener("input", function () {
        errorContrasena.textContent = contrasena.value.trim() === "" ? "La contraseña es requerida." : "";
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (correo.value.trim() === "") {
            errorCorreo.textContent = "El correo electrónico es requerido.";
        }
        if (contrasena.value.trim() === "") {
            errorContrasena.textContent = "La contraseña es requerida.";
        }
        if (errorCorreo.textContent || errorContrasena.textContent) {
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

        btnLogin.disabled = true;

        const requestData = { email: correo.value, password: contrasena.value };

        try {

           
            //let response = await fetch("https://c986-44-201-249-73.ngrok-free.app/login", {        
            let response = await fetch("http://localhost:8080/login", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData)
            });

           

          let responseData = await response.json();

                console.log("Response completo:", responseData);

                if(responseData.code === "403") {
        Swal.fire({
            title: "Cambio de contraseña requerido",
            text: "Esta es la primera vez que inicias sesión, por favor cambia tu contraseña",
            icon: "warning",
            confirmButtonText: "Aceptar"
        }).then(() => window.location.href = "cambio_clave.html");

    } else if (response.ok && responseData.data) {
        const { firstName, lastName, role, birthDate, email, userId } = responseData.data;
        const { documentType, documentNumber } = userId || {};
       

        sessionStorage.setItem("userFirstName", firstName || "");
        sessionStorage.setItem("userLastName", lastName || "");
        sessionStorage.setItem("userRole", role || "");
        sessionStorage.setItem("userBirthdate", birthDate || "");
        sessionStorage.setItem("userTypeDoc", documentType || "");
        sessionStorage.setItem("userDoc", documentNumber || "");
        sessionStorage.setItem("userEmail", email || "");

        window.location.href = "gestion.html";

    } else if (responseData.code === "404") {
        Swal.fire("Error", "El correo es incorrecto. Favor verificar", "error");

    } else if (responseData.code === "401") {
        Swal.fire("Error", "La contraseña es inválida. Favor verificar", "error");

    } else {
        Swal.fire("Error", responseData.message || "Credenciales incorrectas", "error");
    }

} catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", error.message || "No se pudo conectar con el servidor.", "error");
} finally {
    btnLogin.disabled = false;
}
  });
});


