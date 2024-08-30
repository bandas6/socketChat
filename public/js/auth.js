
const miFormulario = document.querySelector('form');

var url = (window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/auth/'
: 'https://restserver-curso-fher.herokuapp.com/api/auth/';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {};

    for (let input of miFormulario.elements) {
        if (input.name.length > 0) {
            formData[input.name] = input.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json() )
    .then(({msg , token})=> {
        if(msg){
            return console.error(msg);1
        }
        
        window.location = 'chat.html';
        localStorage.setItem('token', token);
    })
    .catch(err => {
        console.log(err)
    })

})

function onSignIn(googleUser) {

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            window.location = 'chat.html';
            console.log(token)
            localStorage.setItem('token', token);
        })
        .catch(console.log);

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}