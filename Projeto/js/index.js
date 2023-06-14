const db = firebase.firestore()
let tasks = []
let currentUser = {}

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

