const db = firebase.firestore(); // Referência para o Firestore
let tasks = []; // Array para armazenar as tarefas
let currentUser = {}; // Objeto para armazenar os dados do usuário atual

// Função para obter o nome do usuário do banco de dados
function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid;
      // Obter os dados do usuário do documento correspondente no Firestore
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const userName = userData.name;
            let userLabel = document.getElementById("navbarDropdown");
            userLabel.innerHTML = userName; // Atualizar o nome do usuário no elemento do DOM
          }
        });
    } else {
      // Redirecionar para a página de login se o usuário não estiver autenticado
      swal
        .fire({
          icon: "warning",
          title: "Redirecionando para a tela de autenticação",
          text: "Você precisa estar logado para acessar essa página!"
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("login.html");
          }, 1000);
        });
    }
  });
}

window.onload = function() {
  getUser();
};

var currentFontSize = 0; // Variável para controlar o tamanho da fonte

// Função para aumentar o tamanho da fonte
function increaseFontSize() {
  currentFontSize++;
  updateFontSize();
}

// Função para diminuir o tamanho da fonte
function decreaseFontSize() {
  currentFontSize--;
  updateFontSize();
}

// Função para atualizar o tamanho da fonte no corpo do documento
function updateFontSize() {
  var fontClasses = [
    'font-size-small',
    'font-size-normal',
    'font-size-large',
    'font-size-xlarge',
    'font-size-xxlarge'
  ];

  if (currentFontSize < 0) {
    currentFontSize = 0;
  } else if (currentFontSize >= fontClasses.length) {
    currentFontSize = fontClasses.length - 1;
  }

  document.body.className = fontClasses[currentFontSize];
}

$(document).ready(function() {
  // Adiciona o evento de clique aos links de navegação que apontam para as seções
  $('a[href^="#"]').on('click', function(event) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      event.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top
      }, 1000); // Velocidade da rolagem em milissegundos
    }
  });
});

// Script para exibir ou ocultar o botão de voltar ao topo da página
window.addEventListener('scroll', function() {
  var backToTopButton = document.getElementById('back-to-top');
  if (window.pageYOffset > 100) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

// Função para rolar suavemente até o topo da página
document.getElementById('back-to-top').addEventListener('click', function(e) {
  e.preventDefault();
  scrollToTop(1000);
});

function scrollToTop(scrollDuration) {
  var scrollStep = -window.scrollY / (scrollDuration / 15);
  var scrollInterval = setInterval(function() {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep);
    } else {
      clearInterval(scrollInterval);
    }
  }, 15);
}

// Função para fazer logout do usuário
function logout() {
  firebase.auth().signOut();
  window.location.replace('index.html'); // Redirecionar para a página inicial após o logout
}
