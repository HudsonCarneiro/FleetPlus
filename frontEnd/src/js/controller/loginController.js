import { validateUser } from '../services/authServices';
document.getElementById('formLogin').addEventListener('submit', function(event){
    event.preventDefault();
    const user = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;
    validateUser(user, password);
})
