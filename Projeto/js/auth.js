let incorrectPasswordCount = 0;

function login() {
  // Verifica se há um usuário logado e faz logout, se necessário
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }

  // Obtém o email ou login e a senha fornecidos pelo usuário
  const emailOrLogin = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Verifica se o valor inserido é um email ou um login
  const isEmail = emailOrLogin.includes("@");

  let credential;

  if (isEmail) {
    // Cria uma credencial com o email e senha fornecidos
    credential = firebase.auth.EmailAuthProvider.credential(emailOrLogin, password);
  } else {
    // Realiza uma consulta no Firestore para encontrar o usuário com o login fornecido
    const usersRef = firebase.firestore().collection("users");
    const query = usersRef.where("login", "==", emailOrLogin).limit(1);

    return query
      .get()
      .then((querySnapshot) => {
        // Verifica se a consulta não retornou nenhum documento (usuário não encontrado)
        if (querySnapshot.empty) {
          throw new Error("Usuário não encontrado");
        }

        // Obtém os dados do primeiro documento retornado pela consulta
        const user = querySnapshot.docs[0].data();
        // Cria uma credencial com o email encontrado no Firestore e a senha fornecida
        credential = firebase.auth.EmailAuthProvider.credential(user.email, password);

        // Realiza a autenticação com a credencial obtida
        return firebase.auth().signInWithCredential(credential);
      })
      .then(() => {
        // Exibe uma mensagem de sucesso e redireciona o usuário para a página de perfil após o login
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
        // Verifica o erro retornado e chama a função apropriada com base no tipo de erro
        if (error.message === "Usuário não encontrado") {
          exibirOpcaoCadastro();
        } else {
          handleIncorrectPassword();
        }
      });
  }

  // Realiza a autenticação com o email e senha fornecidos
  return firebase
    .auth()
    .signInWithEmailAndPassword(emailOrLogin, password)
    .then(() => {
      // Exibe uma mensagem de sucesso e redireciona o usuário para a página de perfil após o login
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
      // Chama a função handleIncorrectPassword() em caso de senha incorreta
      handleIncorrectPassword();
    });
}

function handleIncorrectPassword() {
  // Incrementa o contador de tentativas de senha incorreta
  incorrectPasswordCount++;
  if (incorrectPasswordCount === 3) {
    // Chama a função exibirOpcaoRecuperarSenha() quando o contador atingir 3
    exibirOpcaoRecuperarSenha();
    // Reinicia o contador após chamar a função exibirOpcaoRecuperarSenha()
    incorrectPasswordCount = 0;
  } else {
    // Exibe uma mensagem de erro informando ao usuário que a senha está incorreta
    swal.fire({
      icon: "error",
      title: "Senha incorreta!",
      text: "Tente novamente!",
    });
  }
}

function exibirOpcaoCadastro() {
  // Exibe um prompt perguntando se o usuário deseja se cadastrar
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
      // Redireciona o usuário para a página de cadastro se ele clicar em "Sim"
      if (result.value) {
        window.location.href = "cadastro.html";
      }
    });
}

function exibirOpcaoRecuperarSenha() {
  // Exibe um prompt perguntando se o usuário deseja recuperar a senha
  swal
    .fire({
      icon: "question",
      title: "Deseja recuperar a senha?",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    })
    .then((result) => {
      // Chama a função esqueceuSenha() se o usuário clicar em "Sim"
      if (result.value) {
        esqueceuSenha();
      }
    });
}

function signUp(email, password) {
  // Cria um novo usuário com o email e senha fornecidos
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      // Exibe uma mensagem de sucesso e redireciona o usuário para a página inicial após o cadastro
      swal
        .fire({ icon: "success", title: "Usuário foi criado com sucesso" })
        .then(() => {
          setTimeout(() => {
            window.location.replace("index.html");
          }, 1000);
        });
    })
    .catch((error) => {
      // Verifica o código de erro retornado e exibe uma mensagem de erro apropriada
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
  // Realiza o logout do usuário atualmente autenticado
  firebase.auth().signOut();
}

function esqueceuSenha() {
  // Exibe um prompt solicitando o email do usuário para recuperar a senha
  Swal.fire({
    title: "Esqueceu sua senha?",
    text: "Insira seu endereço de e-mail:",
    input: "email",
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: (email) => {
      // Verifica se o email fornecido está cadastrado
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .fetchSignInMethodsForEmail(email)
          .then((signInMethods) => {
            if (signInMethods.length === 0) {
              // Exibe uma mensagem de erro se o email não estiver cadastrado
              Swal.fire({
                title: "E-mail não cadastrado",
                text: "O endereço de e-mail fornecido não está cadastrado.",
                icon: "error",
              });
              reject("E-mail não cadastrado");
            } else {
              // Envia um email de redefinição de senha para o email fornecido
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
      // Exibe uma mensagem de sucesso se o email de recuperação de senha for enviado com sucesso
      if (result.value) {
        Swal.fire({
          title: "Enviado!",
          text: "Um e-mail de recuperação de senha foi enviado para o endereço fornecido.",
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Exibe uma mensagem de cancelamento se o usuário cancelar a recuperação de senha
        Swal.fire("Cancelado", "O processo de recuperação de senha foi cancelado.", "error");
      }
    })
    .catch((error) => {
      // Exibe uma mensagem de erro em caso de falha no processo de recuperação de senha
      Swal.fire("Erro!", error, "error");
    });
}
