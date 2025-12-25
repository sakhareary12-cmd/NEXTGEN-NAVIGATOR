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

const API_URL = "https://script.google.com/macros/s/AKfycbw5l1Rw7luDnTC4zyF6666bPiZQbllvKVbhqrJmc6FldcnlUFV-NcDdy2yZ-1PJC-Bklw/exec";
function loadDashboard() {
  fetch(API_URL + "?dashboard=true")
    .then(res => res.json())
    .then(data => {
      document.getElementById("monthTotal").innerText = "₹ " + data.thisMonth;
      document.getElementById("allTotal").innerText = "₹ " + data.total;
    });
}

function submitTransaction() {
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const account = document.getElementById("account").value;
  const category = document.getElementById("category").value;
  const sentTo = document.getElementById("sentTo").value;
  const receivedFrom = document.getElementById("receivedFrom").value;
  const reason = document.getElementById("reason").value;
  const submitPassword = document.getElementById("submitPassword").value;
  const sitePassword = document.getElementById("sitePassword").value;

  let date = new Date();
  let time = date.toTimeString().slice(0, 8);

  if (document.getElementById("date").value) {
    date = document.getElementById("date").value;
    time = document.getElementById("time").value;
  } else {
    date = date.toISOString().slice(0, 10);
  }

  const proofInput = document.getElementById("proof");
  if (!proofInput.files.length) {
    alert("Proof upload is mandatory");
    return;
  }

  const file = proofInput.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const base64Data = reader.result.split(",")[1];

    const payload = {
      sitePassword,
      submitPassword,
      amount,
      type,
      account,
      category,
      sentTo,
      receivedFrom,
      reason,
      date,
      time,
      proofFile: base64Data,
      proofType: file.type,
      proofName: file.name
    };

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
      document.getElementById("submitMsg").innerText = res.message;
      if (res.status === "success") {
        document.querySelector(".form").reset?.();
      }
    })
    .catch(err => {
      document.getElementById("submitMsg").innerText = err.toString();
    });
  };

  reader.readAsDataURL(file);
}
