$("#sidebar-toggle").click(function (e) {
  e.preventDefault()
  $("#page").toggleClass("toggled")
})

function toggleTheme() {
  const body = document.querySelector("body");
  const sidebar = document.querySelector("#sidebar");
  const themeToggle = document.querySelector("#theme-toggle");

  body.classList.toggle("dark-theme");
  sidebar.classList.toggle("dark-theme");

  // Verifica se o tema atual é escuro e atualiza a aparência do botão
  if (body.classList.contains("dark-theme")) {
    themeToggle.textContent = "Modo Claro";
    themeToggle.classList.remove("btn-dark");
    themeToggle.classList.add("btn-light");
  } else {
    themeToggle.textContent = "Modo Escuro";
    themeToggle.classList.remove("btn-light");
    themeToggle.classList.add("btn-dark");
  }
}