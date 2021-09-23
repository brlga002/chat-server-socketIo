/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable spaced-comment */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-template */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable one-var */
/* eslint-disable spaced-comment */

let areaMessages, inputUsuario;

$(function () {
  areaMessages = $('#ul-msg');
  inputUsuario = $('#inputUsuario');

  var urlServe = 'http://localhost:5000';
  //var urlServe = 'https://chat-crtr19.herokuapp.com';

  socket = io.connect(urlServe, { query: { user_id: 'Anonimus' } });

  socket.on('new_message', (data) => {
    console.log(data);
    async function delayRenderMessage() {
      for (const item of data.message.mensages) {
        await sleep('600');
        render_mensage_receive(item);
      }
      render_choice(data.message.menu.options);
    }
    delayRenderMessage();
  });

  socket.on('render_choice', (choices) => {
    render_choice(choices);
  });

  socket.emit('welcome');

  socket.on('connect', () => {
    //localStorage.setItem('socketID', socket.id)
    //console.log(socket.id);
  });
});

$('#inputUsuario').on('keypress', function (e) {
  if (e.keyCode === 13) {
    sendMessageInputUser();
    return false;
  }
});

function scrollAltomatic() {
  areaMessages.animate({ scrollTop: areaMessages[0].scrollHeight }, 50);
}

function sendMessageInputUser() {
  render_mensage_send(inputUsuario.val());
  socket.emit('new_message', { message: inputUsuario.val() });
  inputUsuario.val('');
}

function solicitaBot(choice, nome) {
  socket.emit('usuario_solicita_bot', { choice });
  render_choice_send(nome);
}

function render_mensage_send(message) {
  areaMessages.append(`
        <li class="msg-item">
            <div class="d-flex flex-row-reverse card-msg">
                <div class="d-flex flex-row-reverse card-msg-receive">                       
                    <img src="img/user.png" class="avatar rounded-circle" alt="avatar user">
                    <p class="mr-1">${message}</p>
                </div> 
            </div>
        </li>`);
  scrollAltomatic();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function render_mensage_receive(data) {
  areaMessages.append(`
    <li class="msg-item">
        <div class="d-inline-flex card-msg">
            <img src="img/robo.jpg" class="avatar rounded-circle" alt="avatar robot">
            <p>${data.text}</p>
        </div>
    </li>`);
  scrollAltomatic();
}

function render_choice_send(nome) {
  areaMessages.append(`
    <li class="msg-item">
        <div class="container-choice d-flex flex-row-reverse card-msg">
            <p class="container-choice-item card-send-choice">${nome}</p>
            <div class="clearfix"></div>
        </div>
    </li>`);
}

function render_choice(choices) {
  console.log('choices');
  console.log([{ choices }]);
  var celcius = choices.reduce(function (prevVal, elem) {
    $elemento = `<button class="container-choice-item btn btn-outline-info" onclick="solicitaBot('${elem.nameBot}','${elem.textOption}')">${elem.textOption}</button>`;
    return prevVal + $elemento;
  }, (initialValue = ''));

  areaMessages.append(`
        <li class="msg-item">
            <div class="container-choice card-msg">
                ${celcius}
                <div class="clearfix"></div>
            </div>
        </li>`);
  scrollAltomatic();
}
