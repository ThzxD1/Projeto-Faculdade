const db = firebase.firestore()
let currentUser = {}
let profile = false

function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid
      getUserInfo(user.uid)
      let userLabel = document.getElementById("navbarDropdown")
      userLabel.innerHTML = user.email
    } else {
      swal
        .fire({
          icon: "success",
          title: "Redirecionando para a tela de autenticação",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("login.html")
          }, 1000)
        })
    }
  })
}

async function getUserInfo(uid) {
  const logUsers = await db.collection("users").doc(uid).get();
  let userInfo = document.getElementById("userInfo");
  if (!logUsers.exists) {
    userInfo.innerHTML = "Perfil não registrado";
  } else {
    userInfo.innerHTML = "Perfil registrado";
    const userData = logUsers.data();
    document.getElementById("name").value = userData.name || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("birth-date").value = userData.birthDate || "";
    document.getElementById("cpf").value = userData.cpf || "";
    document.getElementById("gender").value = userData.gender || "";
    document.getElementById("mother-name").value = userData.motherName || "";
    document.getElementById("cellphone").value = userData.cellphone || "";
    document.getElementById("phone").value = userData.phone || "";
    document.getElementById("cep").value = userData.cep || "";
    document.getElementById("address").value = userData.address || "";
    document.getElementById("house-number").value = userData.houseNumber || "";
  }
}

// Função para salvar o perfil do usuário no Firebase
function saveProfile() {
  // Recuperar os valores dos campos do formulário
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var birthDate = document.getElementById('birth-date').value;
  var cpf = document.getElementById('cpf').value;
  var gender = document.getElementById('gender').value;
  var motherName = document.getElementById('mother-name').value;
  var cellphone = document.getElementById('cellphone').value;
  var phone = document.getElementById('phone').value;
  var cep = document.getElementById('cep').value;
  var address = document.getElementById('address').value;
  var houseNumber = document.getElementById('house-number').value;

  // Verificar se todos os campos foram preenchidos
  if (
    name === '' ||
    email === '' ||
    birthDate === '' ||
    cpf === '' ||
    gender === '' ||
    motherName === '' ||
    cellphone === '' ||
    phone === '' ||
    cep === '' ||
    address === '' ||
    houseNumber === ''
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, preencha todos os campos!'
    });
    return;
  }

  // Salvar os dados do perfil do usuário no Firebase
  var user = firebase.auth().currentUser;
  var userId = user.uid;

  var userData = {
    name: name,
    email: email,
    birthDate: birthDate,
    cpf: cpf,
    gender: gender,
    motherName: motherName,
    cellphone: cellphone,
    phone: phone,
    cep: cep,
    address: address,
    houseNumber: houseNumber
  };

  db.collection('users')
    .doc(userId)
    .set(userData)
    .then(function() {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil salvo com sucesso!'
      });
    })
    .catch(function(error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Erro ao salvar o perfil: ' + error.message
      });
    });
}

window.onload = function () {
  getUser()
}
