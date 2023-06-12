
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

// Função para salvar os dados no Realtime Database
function saveUserData(userId, userData) {
  var usuarioRef = usuariosRef.child(userId); // Definir usuarioRef aqui

  return new Promise(function(resolve, reject) {
    usuarioRef
      .set(userData)
      .then(function() {
        console.log("Dados do usuário salvos com sucesso.");
        resolve(); // Resolvendo a promessa
      })
      .catch(function(error) {
        console.log("Erro ao salvar os dados do usuário:", error);
        reject(error); // Rejeitando a promessa com o erro
      });
  });
}

// Função para validar o formulário
function validateForm() {
  var name = $('#name').val();
  var birthdate = $('#birthdate').val();
  var gender = $('#gender').val();
  var motherName = $('#mother-name').val();
  var cpf = $('#cpf').val();
  var cellphone = $('#cellphone').val();
  var phone = $('#phone').val();
  var address = $('#address').val();
  var login = $('#login').val();
  var password = $('#password').val();
  var confirmPassword = $('#confirm-password').val();

  // Limpar mensagens de erro
  $('.error-message').text('');

  // Validação do nome
  if (name.trim() === '') {
    $('#name-error').text('Por favor, insira um nome válido.');
  }

  // Validação da data de nascimento
  if (birthdate.trim() === '') {
    $('#birthdate-error').text('Por favor, insira uma data de nascimento válida.');
  }

  // Validação do sexo
  if (gender.trim() === '') {
    $('#gender-error').text('Por favor, selecione um sexo.');
  }

  // Validação do nome materno
  if (motherName.trim() === '') {
    $('#mother-name-error').text('Por favor, insira um nome materno válido.');
  }

  // Validação do CPF
  if (cpf.trim() === '') {
    $('#cpf-error').text('Por favor, insira um CPF válido.');
  }

  // Validação do telefone celular
  if (cellphone.trim() === '') {
    $('#cellphone-error').text('Por favor, insira um telefone celular válido.');
  }

  // Validação do telefone fixo
  if (phone.trim() === '') {
    $('#phone-error').text('Por favor, insira um telefone fixo válido.');
  }

  // Validação do endereço
  if (address.trim() === '') {
    $('#address-error').text('Por favor, insira um endereço válido.');
  }

  // Validação do login
  if (login.trim() === '') {
    $('#login-error').text('Por favor, insira um login válido.');
  }

  // Validação da senha
  if (password.trim() === '') {
    $('#password-error').text('Por favor, insira uma senha válida.');
  }

  // Validação da confirmação de senha
  if (confirmPassword.trim() === '') {
    $('#confirm-password-error').text('Por favor, confirme a senha.');
  } else if (confirmPassword !== password) {
    $('#confirm-password-error').text('As senhas não coincidem.');
  }
}

$(document).ready(function() {
  // Validação ao enviar o formulário
  $('#registration-form').submit(function(event) {
    event.preventDefault();
    validateForm();

    if ($('.error-message').text() === '') {
      // Nenhum erro encontrado, exibe mensagem de sucesso
      Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        showConfirmButton: false,
        timer: 2000
      });

      // Coleta dos dados do formulário
      var userData = {
        nome: $('#name').val(),
        dataNascimento: $('#birthdate').val(),
        sexo: $('#gender').val(),
        nomeMae: $('#mother-name').val(),
        cpf: $('#cpf').val(),
        celular: $('#cellphone').val(),
        telefone: $('#phone').val(),
        cep: $('#cep').val(),
        endereco: $('#address').val(),
        login: $('#login').val(),
        senha: $('#password').val()
      };
      // Obtém o ID do usuário autenticado
      var userId = firebase.auth().currentUser.uid;

      // Salvar os dados do usuário no Realtime Database
      saveUserData(userId,userData)
        .then(() => {
          console.log('Dados do usuário salvos com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao salvar os dados:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao salvar os dados.',
            text: error.message,
            confirmButtonText: 'OK'
          });
        });
    }
  });
});