function registerUser() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var login = document.getElementById('login').value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    // Verificar se todos os campos foram preenchidos
    if (!name || !login || !email || !password || !confirmPassword) {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, preencha todos os campos!",
      });
      return;
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "As senhas não coincidem!",
      });
      return;
    }
    if ($('.error-message').text() === '') {
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
        })
        .then(() => {
          swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Usuário cadastrado com sucesso!",
          })
          .then(() => {
            // Redirecionar para a página de perfil
            window.location.href = "login.html";
          });
        })
        .catch((error) => {
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
        swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      });
      }else{
          swal.fire({
          icon: "error",
          title: "Dados Incorretos!",
          text: "Verifique os dados e tente novamente!",
        });
      }

    
  }