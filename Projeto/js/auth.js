// Fução para a autenticação do usuário
function login() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut()
  }
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      swal
        .fire({
          icon: "success",
          title: "Login realizado com sucesso",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("profile.html")
          }, 1000)
        })
    })
    .catch((error) => {
      const errorCode = error.code
      switch (errorCode) {
        case "auth/wrong-password":
          swal.fire({
            icon: "error",
            title: "Senha inválida",
          })
          break
        case "auth/invalid-email":
          swal.fire({
            icon: "error",
            title: "E-mail inválido",
          })
          break
        case "auth/user-not-found":
          swal
            .fire({
              icon: "warning",
              title: "Usuário não encontrado",
              text: "Você está sendo redirecionando para a tela de cadastro!",

            }).then(() => {
              setTimeout(() => {
                window.location.replace("cadastro.html")
              }, 1000)
            })
            .then((result) => {
              if (result.value) {
                signUp(email, password)
              }
            })
          break
        default:
          swal.fire({
            icon: "error",
            title: error.message,
          })
      }
    })
}
function registrar(){
  window.location.href = "cadastro.html"
}
function signUp(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      swal
        .fire({ icon: "success", title: "Usuário foi criado com sucesso" })
        .then(() => {
          setTimeout(() => {
            window.location.replace("index.html")
          }, 1000)
        })
    })
    .catch((error) => {
      const errorCode = error.code
      switch (errorCode) {
        case "auth/weak-password":
          swal.fire({
            icon: "error",
            title: "Senha muito fraca",
          })
          break
        default:
          swal.fire({
            icon: "error",
            title: error.message,
          })
      }
    })
}

function logout() {
  firebase.auth().signOut()
}
//Função para recuperar a senha
function esqueceuSenha() {
  Swal.fire({
    title: 'Esqueceu sua senha?',
    text: 'Insira seu endereço de e-mail:',
    input: 'email',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    showLoaderOnConfirm: true,
    preConfirm: (email) => {
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error.message);
          });
      });
    },
  })
    .then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Enviado!',
          text: 'Um e-mail de recuperação de senha foi enviado para o endereço fornecido.',
          icon: 'success',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'O processo de recuperação de senha foi cancelado.', 'error');
      }
    })
    .catch((error) => {
      Swal.fire('Erro!', error, 'error');
    });
}