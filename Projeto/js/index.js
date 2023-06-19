const db = firebase.firestore()
let tasks = []
let currentUser = {}

//Pegar o Nome do Usuário no banco de dados
function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid;
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const userName = userData.name;
            let userLabel = document.getElementById("navbarDropdown");
            userLabel.innerHTML = userName;
          }
        })
        .catch((error) => {
          console.log("Erro ao buscar o nome do usuário:", error);
        });
    } 
})
}
window.onload = function () {
  getUser()
}
//Aumentar e Diminuir a fonte
var currentFontSize = 0;

function increaseFontSize() {
  currentFontSize++;
  updateFontSize();
}

function decreaseFontSize() {
  currentFontSize--;
  updateFontSize();
}

function updateFontSize() {
  var fontClasses = ['font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge', 'font-size-xxlarge'];

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
    //Script para voltar ao topo da página
    window.addEventListener('scroll', function() {
      var backToTopButton = document.getElementById('back-to-top');
      if (window.pageYOffset > 100) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });
    
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
    function logout() {
      firebase.auth().signOut()
      window.location.replace('index.html')
    }