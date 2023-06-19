let incorrectPasswordCount = 0;

function login() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }

  const emailOrLogin = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Verificar se o valor inserido é um email ou um login
  const isEmail = emailOrLogin.includes("@");

  let credential;

  if (isEmail) {
    credential = firebase.auth.EmailAuthProvider.credential(emailOrLogin, password);
  } else {
    // Realizar consulta no Firestore para encontrar o usuário com o login fornecido
    const usersRef = firebase.firestore().collection("users");
    const query = usersRef.where("login", "==", emailOrLogin).limit(1);

    return query
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          throw new Error("Usuário não encontrado");
        }

        const user = querySnapshot.docs[0].data();
        credential = firebase.auth.EmailAuthProvider.credential(user.email, password);

        // Realizar autenticação com a credencial obtida
        return firebase.auth().signInWithCredential(credential);
      })
      .then(() => {
        swal
          .fire({
            icon: "success",
            title: "Login realizado com sucesso",
          })
          .then(() => {
            setTimeout(() => {
              window.location.replace("profile.html");
            }, 1000);
          });
      })
      .catch((error) => {
        if (error.message === "Usuário não encontrado") {
          exibirOpcaoCadastro();
        } else {
          handleIncorrectPassword();
        }
      });
  }

  // Realizar autenticação com o email e senha fornecidos
  return firebase
    .auth()
    .signInWithEmailAndPassword(emailOrLogin, password)
    .then(() => {
      swal
        .fire({
          icon: "success",
          title: "Login realizado com sucesso",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("profile.html");
          }, 1000);
        });
    })
    .catch((error) => {
      handleIncorrectPassword();
    });
}

function handleIncorrectPassword() {
  incorrectPasswordCount++;
  if (incorrectPasswordCount === 3) {
    exibirOpcaoRecuperarSenha();
    incorrectPasswordCount = 0; // Reinicia o contador após chamar a função exibirOpcaoRecuperarSenha()
  } else {
    swal.fire({
      icon: "error",
      title: "Senha incorreta!",
      text: "Tente novamente!",
    });
  }
}

function exibirOpcaoCadastro() {
  swal
    .fire({
      icon: "warning",
      title: "O usuário não existe",
      text: "Deseja se cadastrar?",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    })
    .then((result) => {
      if (result.value) {
        window.location.href = "cadastro.html";
      }
    });
}
function exibirOpcaoRecuperarSenha() {
  swal
    .fire({
      icon: "question",
      title: "Deseja recuperar a senha?",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    })
    .then((result) => {
      if (result.value) {
        esqueceuSenha();
      }
    })
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
            window.location.replace("index.html");
          }, 1000);
        });
    })
    .catch((error) => {
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/weak-password":
          swal.fire({
            icon: "error",
            title: "Senha muito fraca",
          });
          break;

        default:
          swal.fire({
            icon: "error",
            title: error.message,
          });
      }
    });
}

function logout() {
  firebase.auth().signOut();
}

function esqueceuSenha() {
  Swal.fire({
    title: "Esqueceu sua senha?",
    text: "Insira seu endereço de e-mail:",
    input: "email",
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: (email) => {
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .fetchSignInMethodsForEmail(email)
          .then((signInMethods) => {
            if (signInMethods.length === 0) {
              Swal.fire({
                title: "E-mail não cadastrado",
                text: "O endereço de e-mail fornecido não está cadastrado.",
                icon: "error",
              });
              reject("E-mail não cadastrado");
            } else {
              firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error.message);
                });
            }
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
          title: "Enviado!",
          text: "Um e-mail de recuperação de senha foi enviado para o endereço fornecido.",
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "O processo de recuperação de senha foi cancelado.", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Erro!", error, "error");
    });
}
