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

