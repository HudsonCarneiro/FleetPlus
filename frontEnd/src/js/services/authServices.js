export function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '../pages/formLogin.html'; 
}
