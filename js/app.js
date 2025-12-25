/**************** CONFIG ****************/
const API_URL = "https://script.google.com/macros/s/AKfycbw5l1Rw7luDnTC4zyF6666bPiZQbllvKVbhqrJmc6FldcnlUFV-NcDdy2yZ-1PJC-Bklw/exec";

/**************** UI HELPERS ****************/
function unlockApp() {
  const pass = document.getElementById("sitePassword").value;
  if (!pass) {
    document.getElementById("lockError").innerText = "Password required";
    return;
  }

  // UI only – real security is backend
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

/**************** DASHBOARD ****************/
function loadDashboard() {
  fetch(API_URL + "?dashboard=true")
    .then(res => res.json())
    .then(data => {
      document.getElementById("monthTotal").innerText = "₹ " + data.thisMonth;
      document.getElementById("allTotal").innerText = "₹ " + data.total;
    })
    .catch(() => {
      document.getElementById("monthTotal").innerText = "₹ 0";
      document.getElementById("allTotal").innerText = "₹ 0";
    });
}

/**************** TRANSACTION SUBMIT ****************/
document.getElementById("transactionForm").addEventListener("submit", e => {
  e.preventDefault();

  const sitePassword = document.getElementById("sitePassword").value;
  const submitPassword = document.getElementById("submitPassword").value;

  if (!sitePassword || !submitPassword) {
    alert("Both passwords are required");
    return;
  }

  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const account = document.getElementById("account").value;
  const category = document.getElementById("category").value;
  const sentTo = document.getElementById("sentTo").value;
  const receivedFrom = document.getElementById("receivedFrom").value;
  const reason = document.getElementById("reason").value;

  let dateObj = new Date();
  let date = dateObj.toISOString().slice(0, 10);
  let time = dateObj.toTimeString().slice(0, 8);

  if (document.getElementById("date").value) {
    date = document.getElementById("date").value;
    time = document.getElementById("time").value;
  }

  const proofInput = document.getElementById("proof");
  if (!proofInput.files.length) {
    alert("Proof upload is mandatory");
    return;
  }

  const file = proofInput.files[0];
  const reader = new FileReader();

  reader.onload = async () => {
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
      proofFile: reader.result.split(",")[1],
      proofType: file.type,
      proofName: file.name
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.status !== "success") {
        alert("ERROR: " + result.message);
        return;
      }

      alert("Transaction added successfully");
      document.getElementById("transactionForm").reset();

    } catch (err) {
      alert("Network / Server error");
    }
  };

  reader.readAsDataURL(file);
});

/**************** INIT ****************/
window.onload = () => {
  loadDashboard();
};
