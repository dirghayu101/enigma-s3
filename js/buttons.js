document
  .getElementById("signout-button")
  .addEventListener("click", function () {
    Enigma.signOut();
  });

  document.getElementById('blue-button').addEventListener('click', () => {
    location.reload();
});