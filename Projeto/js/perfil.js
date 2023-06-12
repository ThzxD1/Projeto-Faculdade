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
  
  firebase.initializeApp(firebaseConfig);
  
  // Referência para o Realtime Database
  var database = firebase.database();
  var usuariosRef = database.ref("usuarios");
  
  // Função para obter os dados do usuário e exibi-los na página de perfil
  function exibirPerfilUsuario() {
    var userId = firebase.auth().currentUser.uid;
    var usuarioRef = usuariosRef.child(userId);
  
    usuarioRef.once("value", function(snapshot) {
      if (snapshot.exists()) {
        var userData = snapshot.val();
        var profileDataElement = document.getElementById("profile-data");
  
        if (profileDataElement) {
          var profileHTML = `
            <p><strong>Nome:</strong> ${userData.nome}</p>
            <p><strong>Data de Nascimento:</strong> ${userData.dataNascimento}</p>
            <p><strong>Gênero:</strong> ${userData.sexo}</p>
            <p><strong>Nome Materno:</strong> ${userData.nomeMae}</p>
            <p><strong>CPF:</strong> ${userData.cpf}</p>
            <p><strong>Telefone Celular:</strong> ${userData.celular}</p>
            <p><strong>Telefone Fixo:</strong> ${userData.telefone}</p>
            <p><strong>CEP:</strong> ${userData.cep}</p>
            <p><strong>Endereço Completo:</strong> ${userData.endereco}</p>
            <p><strong>Login:</strong> ${userData.login}</p>
          `;
  
          profileDataElement.innerHTML = profileHTML;
        } else {
          console.error("Element with id 'profile-data' not found.");
        }
      } else {
        console.error("User data not found.");
      }
    });
  }
  
  // Verifica se o usuário está autenticado antes de exibir o perfil
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      exibirPerfilUsuario();
    } else {
      // Caso não esteja autenticado, redireciona para a página de login
      window.location.href = "login.html";
    }
  });
  