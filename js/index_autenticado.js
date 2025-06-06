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

document.addEventListener("DOMContentLoaded", setUserIcon);
