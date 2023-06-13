$(document).ready(function() {
    // Função para exibir mensagem de erro
    function showError(inputId, errorMessage) {
      $('#' + inputId + '-error').text(errorMessage);
    }
  
    // Função para ocultar mensagem de erro
    function hideError(inputId) {
      $('#' + inputId + '-error').text('');
    }
  
    // Função para validar o nome
    function validateName() {
      var name = $('#name').val();
      if (name.length < 15 || name.length > 60) {
        showError('name', 'O nome deve conter entre 15 e 60 caracteres alfabéticos.');
      } else {
        hideError('name');
      }
    }
    function fetchAddressByCep(cep) {
      var url = 'https://viacep.com.br/ws/' + cep + '/json/';
      $.getJSON(url, function(data) {
        if (!data.erro) {
          fillAddressFields(data);
        }
      });
    }
    $('#cep').blur(function() {
      var cep = $(this).val();
      if (cep.length === 9) {
        fetchAddressByCep(cep);
      }
    });
    // Função para validar a data de nascimento
    function validateBirthdate() {
      var birthdate = $('#birth-date').val();
      if (!birthdate) {
        showError('birth-date', 'A data de nascimento deve ser informada.');
      } else {
        hideError('birth-date');
      }
    }
  
    // Função para validar o sexo
    function validateGender() {
      var gender = $('#gender').val();
      if (!gender) {
        showError('gender', 'O sexo deve ser selecionado.');
      } else {
        hideError('gender');
      }
    }
  
    // Função para validar o nome materno
    function validateMotherName() {
      var motherName = $('#mother-name').val();
      if (!motherName) {
        showError('mother-name', 'O nome materno deve ser informado.');
      } else {
        hideError('mother-name');
      }
    }
  
    // Função para validar o CPF
    function validateCpf() {
      var cpf = $('#cpf').val();
      if (!cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
        showError('cpf', 'O CPF deve estar no formato 999.999.999-99.');
      } else {
        hideError('cpf');
      }
    }
  
    // Função para validar o telefone celular
    function validateCellphone() {
      var cellphone = $('#cellphone').val();
      if (!cellphone || !/^\(\+55\)\d{2} \d{5}-\d{4}$/.test(cellphone)) {
        showError('cellphone', 'O telefone celular deve estar no formato (+55)XX XXXXX-XXXX.');
      } else {
        hideError('cellphone');
      }
    }
  
    // Função para validar o telefone fixo
    function validatePhone() {
      var phone = $('#phone').val();
      if (!phone || !/^\(\+55\)\d{2} \d{4}-\d{4}$/.test(phone)) {
        showError('phone', 'O telefone fixo deve estar no formato (+55)XX XXXX-XXXX.');
      } else {
        hideError('phone');
      }
    }
  
    // Função para validar o endereço
    function validateAddress() {
      var address = $('#address').val();
      if (!address) {
        showError('address', 'O endereço completo deve ser informado.');
      } else {
        hideError('address');
      }
    }
  
    // Função para validar a senha
    function validatePassword() {
      var password = $('#password').val();
      if (password.length !== 8 || !/^[a-zA-Z]+$/.test(password)) {
        showError('password', 'A senha deve conter exatamente 8 caracteres alfabéticos.');
      } else {
        hideError('password');
      }
    }
  
    // Função para validar a confirmação de senha
    function validateConfirmPassword() {
      var password = $('#password').val();
      var confirmPassword = $('#confirm-password').val();
      if (password !== confirmPassword) {
        showError('confirm-password', 'A senha e a confirmação de senha devem ser iguais.');
      } else {
        hideError('confirm-password');
      }
    }
  
    // Função para preencher os campos de endereço
    function fillAddressFields(data) {
      $('#address').val(data.logradouro);
      $('#neighborhood').val(data.bairro);
      $('#city').val(data.localidade);
      $('#state').val(data.uf);
    }
  
    // Função para obter o endereço a partir do CEP
    function fetchAddressByCep(cep) {
      var url = 'https://viacep.com.br/ws/' + cep + '/json/';
      $.getJSON(url, function(data) {
        if (!data.erro) {
          fillAddressFields(data);
        }
      });
    }
  
    // Função para validar o formulário
    function validateForm() {
      validateName();
      validateBirthdate();
      validateGender();
      validateMotherName();
      validateCpf();
      validateCellphone();
      validatePhone();
      validateAddress();
      validatePassword();
      validateConfirmPassword();
  
      // Verifica se há algum campo com erro
      if ($('.error-message').text() === '') {
        // Nenhum erro encontrado, salva os dados no Firebase Firestore
        var usuario = {
          nome: $('#name').val(),
          dataNascimento: $('#birth-date').val(),
          sexo: $('#gender').val(),
          nomeMae: $('#mother-name').val(),
          cpf: $('#cpf').val(),
          celular: $('#cellphone').val(),
          telefone: $('#phone').val(),
          endereco: $('#address').val(),
          login: $('#login').val(),
          senha: $('#password').val()
        };
  
        // Salva o usuário no Firebase Firestore
        usuariosRef.push(usuario)
          .then(function() {
            // Sucesso ao salvar, exibe mensagem de sucesso
            Swal.fire({
              icon: 'success',
              title: 'Cadastro realizado com sucesso!',
              showConfirmButton: false,
              timer: 2000
            });
            window.location.replace('login.html');
          })
          .catch(function(error) {
            // Erro ao salvar, exibe mensagem de erro
            Swal.fire({
              icon: 'error',
              title: 'Erro ao salvar os dados.',
              text: error.message,
              confirmButtonText: 'OK'
            });
          });
      }
    }
  
    // Máscaras dos campos
    $('#cpf').mask('000.000.000-00');
    $('#cellphone').mask('(+55)00 00000-0000');
    $('#phone').mask('(+55)00 0000-0000');
    $('#cep').mask('99999-999');
  
    // Validação ao sair do campo
    $('#name').blur(validateName);
    $('#birth-date').blur(validateBirthdate);
    $('#gender').blur(validateGender);
    $('#mother-name').blur(validateMotherName);
    $('#cpf').blur(validateCpf);
    $('#cellphone').blur(validateCellphone);
    $('#phone').blur(validatePhone);
    $('#address').blur(validateAddress);
    $('#password').blur(validatePassword);
    $('#confirm-password').blur(validateConfirmPassword);
  
    // Validação ao enviar o formulário
    $('#registration-form').submit(function(event) {
      event.preventDefault();
      validateForm();
    });
  });
  