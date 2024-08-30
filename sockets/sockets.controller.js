const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const ChatMensajes = require("../models/chat-mensajes")

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {

    const token = socket.handshake.headers['x-token'];
   
    const usuario = await comprobarJWT(token)

    if(!usuario){
        return socket.disconnect();
    }

    //agregar usuario conectado;
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //limpiar cuando el usuario se desconecta;
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    //Recibir mensaje
    socket.on('enviar-mensaje', ({uid, mensaje}) => {
        chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        io.emit('recibir-mensajes', chatMensajes.ultimos10);
    });
}

module.exports = {
    socketController
}