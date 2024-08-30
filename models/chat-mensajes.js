class Mensaje {

    constructor(id, nombre, mensaje, fecha){

        this.id = id;
        this.nombre = nombre;
        this.mensaje = mensaje;
        this.fecha = fecha;

    }

}

class ChatMensajes
{
    constructor(){
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values(this.usuarios);
    }

    enviarMensaje(uid, nombre, mensaje){
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje, new Date())
        )
    }

    conectarUsuario(usuario){
        this.usuarios[usuario.id] = usuario;
    }

    desconectarUsuario(id){
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes