function registerUser() {
  // Obter os valores dos campos do formulário
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var login = document.getElementById('login').value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm-password").value;
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
  if (!name || 
    !login || 
    !email || 
    !password || 
    !confirmPassword || 
    !birthDate || 
    !cpf || 
    !gender || 
    !motherName || 
    !cellphone || 
    !phone || 
    !cep || 
    !address || 
    !houseNumber) {
    // Exibir uma mensagem de erro se algum campo estiver vazio
    swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, preencha todos os campos!",
    });
    return;
  }

  // Verificar se as senhas coincidem
  if (password !== confirmPassword) {
    // Exibir uma mensagem de erro se as senhas não coincidirem
    swal.fire({
      icon: "error",
      title: "Oops...",
      text: "As senhas não coincidem!",
    });
    return;
  }

  if ($('.error-message').text() === '') {
    // Criar um novo usuário com email e senha no Firebase Authentication
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;

        // Salvar dados do usuário no Firestore
        firebase.firestore().collection("users").doc(user.uid).set({
          name: name,
          email: email,
          login: login,
          birthDate: birthDate,
          cpf: cpf,
          gender: gender,
          motherName: motherName,
          cellphone: cellphone,
          phone: phone,
          cep: cep,
          address: address,
          houseNumber: houseNumber
        })
        .then(() => {
          // Exibir uma mensagem de sucesso e redirecionar para a página de login após o cadastro
          swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Usuário cadastrado com sucesso!",
          })
          .then(() => {
            window.location.href = "login.html";
          });
        })
        .catch((error) => {
          // Exibir uma mensagem de erro se ocorrer um erro ao salvar os dados do usuário
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocorreu um erro ao salvar os dados do usuário!",
          });
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Exibir uma mensagem de erro informando o motivo do erro durante o cadastro
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      });
  } else {
    // Exibir uma mensagem de erro se houver dados incorretos no formulário
    swal.fire({
      icon: "error",
      title: "Dados Incorretos!",
      text: "Verifique os dados e tente novamente!",
    });
  }
}
