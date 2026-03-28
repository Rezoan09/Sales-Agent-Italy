const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const quickReplies = document.getElementById("quickReplies");

let state = "main_menu";

let bookingData = {
  date: "",
  people: "",
  time: "",
  name: "",
  phone: "",
  specialRequest: ""
};

function addMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function setQuickReplies(options = []) {
  quickReplies.innerHTML = "";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "quick-reply-btn";
    btn.textContent = option.label;
    btn.onclick = () => handleUserInput(option.value, true);
    quickReplies.appendChild(btn);
  });
}

function showMainMenu() {
  state = "main_menu";
  addMessage("Ciao 👋 Benvenuto da Ristorante Bella Trento.\nCome posso aiutarti oggi?");
  setQuickReplies([
    { label: "Prenotare un tavolo", value: "prenotare" },
    { label: "Vedere il menu", value: "menu" },
    { label: "Orari e posizione", value: "orari" },
    { label: "Parlare con lo staff", value: "staff" }
  ]);
}

function resetBookingData() {
  bookingData = {
    date: "",
    people: "",
    time: "",
    name: "",
    phone: "",
    specialRequest: ""
  };
}

function handleMainMenu(input) {
  const value = input.toLowerCase();

  if (value.includes("prenot")) {
    resetBookingData();
    state = "booking_date";
    addMessage("Perfetto. Per quale giorno vuoi prenotare?");
    setQuickReplies([
      { label: "Oggi", value: "Oggi" },
      { label: "Domani", value: "Domani" },
      { label: "Un'altra data", value: "Un'altra data" }
    ]);
  } else if (value.includes("menu")) {
    addMessage("Certo 😊\nEcco il nostro menu demo:\n\n• Pizza Margherita\n• Pasta Carbonara\n• Tiramisù\n• Acqua / Coca-Cola");
    addMessage("Vuoi anche prenotare un tavolo?");
    setQuickReplies([
      { label: "Sì, prenoto", value: "prenotare" },
      { label: "No, grazie", value: "no_thanks" }
    ]);
    state = "menu_followup";
  } else if (value.includes("orari")) {
    addMessage("Siamo aperti:\nLun–Dom: 12:00–15:00 / 18:00–23:00\n\nCi trovi qui:\nVia Roma 24, Trento");
    addMessage("Vuoi prenotare un tavolo?");
    setQuickReplies([
      { label: "Sì", value: "prenotare" },
      { label: "No", value: "no_thanks" }
    ]);
    state = "hours_followup";
  } else if (value.includes("staff")) {
    state = "staff_message";
    addMessage("Va bene. Scrivi il tuo messaggio qui sotto e lo inoltreremo al nostro staff.");
    setQuickReplies([]);
  } else {
    addMessage("Mi dispiace, non ho capito bene.");
    showMainMenu();
  }
}

function handleUserInput(input, fromButton = false) {
  const text = input.trim();
  if (!text) return;

  if (!fromButton) {
    addMessage(text, "user");
  } else {
    addMessage(text, "user");
  }

  switch (state) {
    case "main_menu":
      handleMainMenu(text);
      break;

    case "menu_followup":
    case "hours_followup":
      if (text.toLowerCase().includes("sì") || text.toLowerCase().includes("si") || text.toLowerCase().includes("prenot")) {
        resetBookingData();
        state = "booking_date";
        addMessage("Perfetto. Per quale giorno vuoi prenotare?");
        setQuickReplies([
          { label: "Oggi", value: "Oggi" },
          { label: "Domani", value: "Domani" },
          { label: "Un'altra data", value: "Un'altra data" }
        ]);
      } else {
        addMessage("Va bene 😊 Se hai bisogno di altro, sono qui.");
        showMainMenu();
      }
      break;

    case "booking_date":
      if (text.toLowerCase() === "un'altra data" || text.toLowerCase() === "un altra data") {
        state = "booking_custom_date";
        addMessage("Scrivi la data che preferisci.\nEsempio: 12 aprile");
        setQuickReplies([]);
      } else {
        bookingData.date = text;
        state = "booking_people";
        addMessage("Per quante persone?");
        setQuickReplies([
          { label: "2 persone", value: "2" },
          { label: "4 persone", value: "4" },
          { label: "6 persone", value: "6" },
          { label: "Altro", value: "altro" }
        ]);
      }
      break;

    case "booking_custom_date":
      bookingData.date = text;
      state = "booking_people";
      addMessage("Per quante persone?");
      setQuickReplies([
        { label: "2 persone", value: "2" },
        { label: "4 persone", value: "4" },
        { label: "6 persone", value: "6" },
        { label: "Altro", value: "altro" }
      ]);
      break;

    case "booking_people":
      if (text.toLowerCase() === "altro") {
        state = "booking_people_custom";
        addMessage("Scrivi il numero di persone.");
        setQuickReplies([]);
      } else {
        bookingData.people = text;
        state = "booking_time";
        addMessage("A che ora preferisci?");
        setQuickReplies([
          { label: "19:00", value: "19:00" },
          { label: "20:00", value: "20:00" },
          { label: "21:00", value: "21:00" },
          { label: "Altro", value: "altro" }
        ]);
      }
      break;

    case "booking_people_custom":
      bookingData.people = text;
      state = "booking_time";
      addMessage("A che ora preferisci?");
      setQuickReplies([
        { label: "19:00", value: "19:00" },
        { label: "20:00", value: "20:00" },
        { label: "21:00", value: "21:00" },
        { label: "Altro", value: "altro" }
      ]);
      break;

    case "booking_time":
      if (text.toLowerCase() === "altro") {
        state = "booking_time_custom";
        addMessage("Scrivi l'orario preferito.\nEsempio: 20:30");
        setQuickReplies([]);
      } else {
        bookingData.time = text;
        state = "booking_name";
        addMessage("Perfetto 👍 Scrivi il tuo nome, per favore.");
        setQuickReplies([]);
      }
      break;

    case "booking_time_custom":
      bookingData.time = text;
      state = "booking_name";
      addMessage("Perfetto 👍 Scrivi il tuo nome, per favore.");
      setQuickReplies([]);
      break;

    case "booking_name":
      bookingData.name = text;
      state = "booking_phone";
      addMessage("Grazie. Ora scrivi il tuo numero di telefono.");
      setQuickReplies([]);
      break;

    case "booking_phone":
      bookingData.phone = text;
      state = "booking_special_request";
      addMessage(
        `Grazie, ${bookingData.name}!\nRichiesta ricevuta per ${bookingData.date} alle ${bookingData.time} per ${bookingData.people} persone.\nVuoi aggiungere una richiesta speciale?`
      );
      setQuickReplies([
        { label: "Sì", value: "si_special" },
        { label: "No", value: "no_special" }
      ]);
      break;

    case "booking_special_request":
      if (text === "si_special" || text.toLowerCase() === "sì" || text.toLowerCase() === "si") {
        state = "booking_special_text";
        addMessage("Scrivila qui e la inoltreremo allo staff.");
        setQuickReplies([]);
      } else {
        bookingData.specialRequest = "Nessuna";
        finishBooking();
      }
      break;

    case "booking_special_text":
      bookingData.specialRequest = text;
      finishBooking();
      break;

    case "staff_message":
      addMessage("Grazie! Il tuo messaggio è stato registrato. Ti risponderemo al più presto.");
      showMainMenu();
      break;

    default:
      addMessage("Torniamo al menu principale.");
      showMainMenu();
      break;
  }
}

function finishBooking() {
  console.log("Prenotazione demo:", bookingData);

  addMessage(
    `Perfetto ✅\nPrenotazione registrata.\n\nRiepilogo:\n- Giorno: ${bookingData.date}\n- Persone: ${bookingData.people}\n- Ora: ${bookingData.time}\n- Nome: ${bookingData.name}\n- Telefono: ${bookingData.phone}\n- Richiesta speciale: ${bookingData.specialRequest}`
  );

  addMessage("Ti confermeremo al più presto. Grazie!");
  showMainMenu();
}

sendBtn.addEventListener("click", () => {
  handleUserInput(userInput.value);
  userInput.value = "";
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleUserInput(userInput.value);
    userInput.value = "";
  }
});

showMainMenu();
