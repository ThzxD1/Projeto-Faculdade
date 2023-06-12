$(document).ready(function() {
     if (!firebase.apps.length) {
    // Configuração do Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyD9nbJCYpUT_mELezEvOtxfi7_wUppSaww",
        authDomain: "projeto-th-c0b8e.firebaseapp.com",
        projectId: "projeto-th-c0b8e",
        databaseURL: "https://projeto-th-c0b8e-default-rtdb.firebaseio.com",
        storageBucket: "projeto-th-c0b8e.appspot.com",
        messagingSenderId: "669797388911",
        appId: "1:669797388911:web:0297366b62a87a1e82b39a",
        measurementId: "G-JNT57720J3"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}
  
    // Referência para o Realtime Database
    var database = firebase.database();
    var usuariosRef = database.ref("usuarios");
  
    // Função para realizar o login
    function login() {
      // Coleta dos dados de login e senha do formulário
      var email = $('#login').val();
      var senha = $('#password').val();
  
      // Consulta no Realtime Database para buscar o usuário com o login informado
      usuariosRef.orderByChild("login").equalTo(email).once("value", function(snapshot) {
        if (snapshot.exists()) {
          // O usuário com o login informado existe no banco de dados
          snapshot.forEach(function(childSnapshot) {
            var userData = childSnapshot.val();
            // Verificar se a senha está correta
            if (userData.senha === senha) {
                Swal.fire({
                    icon: 'success',
                    title: 'Login realizado com sucesso!',
                    showConfirmButton: false,
                    timer: 2000
                  }).then(function() {
                    // Redirecionar para a página "index.html"
                    window.location.replace("perfil.html");
                });
            } else {
              // Senha incorreta
              Swal.fire({
                icon: 'error',
                title: 'Senha incorreta',
                text: 'Por favor, verifique a senha e tente novamente.'
              });
              // Exiba uma mensagem de erro para o usuário
              $('.error-message').text('Senha incorreta. Tente novamente.');
            }
          });
        } else {
          // O usuário com o login informado não existe no banco de dados
          Swal.fire({
            icon: 'error',
            title: 'Usuário não encontrado',
            text: 'Por favor, verifique o login e tente novamente.'
          });
        }
      });
    }
  
    // Validação ao enviar o formulário de login
    $('#login-form').submit(function(event) {
      event.preventDefault();
      login();
    });
  });
  