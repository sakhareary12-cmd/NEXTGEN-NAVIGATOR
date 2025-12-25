function unlockApp() {
  const pass = document.getElementById("sitePassword").value;
  if (!pass) {
    document.getElementById("lockError").innerText = "Password required";
    return;
  }
  // actual validation happens in backend
  document.getElementById("lockScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function toggleDateTime(cb) {
  document.getElementById("date").classList.toggle("hidden", !cb.checked);
  document.getElementById("time").classList.toggle("hidden", !cb.checked);
}

function submitTransaction() {
  document.getElementById("submitMsg").innerText =
    "Backend integration comes next step";
}
