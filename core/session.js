function checkSession(){
  const session = JSON.parse(localStorage.getItem("rf_session"));
  if(!session || !session.logado){
    window.location.href = "index.html";
  }
}

function logout(){
  localStorage.removeItem("rf_session");
  window.location.href = "index.html";
}
