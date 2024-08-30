

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('btnSalir');

var url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

// Validar el token de localstage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = "index.html"
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    console.log(userDB, tokenDB)
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocker();

}

const conectarSocker = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online');
    })

    socket.on('disconnect', () => {
        console.log('Socket offline');
    })

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensajes-privados', () => {

    })

}


const dibujarUsuarios = (usuarios = []) => {

    let userHtml = '';
    usuarios.forEach(({ nombre, uid }) => {

        userHtml += `
            <li>
                <h5 class="text-success">${nombre}</h5>
                <p>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;

    });

    ulUsuarios.innerHTML = userHtml;

}

const dibujarMensajes = (mensajes = []) => {

    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {

        mensajesHtml += `
            <li>
                <span class="text-primary">${nombre}</span>
                <span class="">${mensaje}</span>
            </li>
        `;

    });

    ulMensajes.innerHTML = mensajesHtml;

}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if (keyCode !== 13) {
        return;
    }
    if (mensaje.length <= 0) {
        return;
    }
    socket.emit('enviar-mensaje', {mensaje, uid});

    txtMensaje.value = '';
})


const main = async () => {

    await validarJWT();

}

main();

// const socket = io();