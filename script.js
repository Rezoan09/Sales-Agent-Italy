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
    btn.onclick = () => handleUserInput(option.value, true, option.label);
    quickReplies.appendChild(btn);
  });
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

function showMainMenu(showGreeting = true) {
  state = "main_menu";
  if (showGreeting) {
    addMessage("👋 Hello! Welcome to Ristorante Bella Trento.\nHow can I help you today?");
  }
  setQuickReplies([
    { label: "Book a table", value: "book_table" },
    { label: "See the menu", value: "see_menu" },
    { label: "Hours and location", value: "hours_location" },
    { label: "Talk to the staff", value: "talk_staff" }
  ]);
}

function finishBooking() {
  addMessage(
    `Perfect ✅\nReservation registered.\n\nSummary:\n- Day: ${bookingData.date}\n- People: ${bookingData.people}\n- Time: ${bookingData.time}\n- Name: ${bookingData.name}\n- Phone: ${bookingData.phone}\n- Special request: ${bookingData.specialRequest || "None"}`
  );

  addMessage("We will confirm you as soon as possible. Thank you! 😊");

  state = "booking_complete";
  setQuickReplies([
    { label: "New booking", value: "new_booking" },
    { label: "Main menu", value: "main_menu_only" }
  ]);
}

function handleUserInput(input, fromButton = false, displayText = null) {
  const text = input.trim();
  if (!text) return;

  addMessage(fromButton && displayText ? displayText : text, "user");

  switch (state) {
    case "main_menu":
      if (text === "book_table") {
        resetBookingData();
        state = "booking_date";
        addMessage("Perfect. For which day would you like to book?");
        setQuickReplies([
          { label: "Today", value: "Today" },
          { label: "Tomorrow", value: "Tomorrow" },
          { label: "Another date", value: "Another date" }
        ]);
      } else if (text === "see_menu") {
        state = "menu_followup";
        addMessage("Sure 😊\nHere is our demo menu:\n\n• Pizza Margherita\n• Pasta Carbonara\n• Tiramisù\n• Water / Coca-Cola");
        addMessage("Would you also like to book a table?");
        setQuickReplies([
          { label: "Yes, book now", value: "book_from_menu" },
          { label: "No, thanks", value: "no_thanks" }
        ]);
      } else if (text === "hours_location") {
        state = "hours_followup";
        addMessage("We are open:\nMon–Sun: 12:00–15:00 / 18:00–23:00\n\nFind us at:\nVia Roma 24, Trento");
        addMessage("Would you like to book a table?");
        setQuickReplies([
          { label: "Yes, book now", value: "book_from_hours" },
          { label: "No, thanks", value: "no_thanks" }
        ]);
      } else if (text === "talk_staff") {
        state = "staff_message";
        addMessage("Okay. Write your message below and we will forward it to our staff.");
        setQuickReplies([]);
      } else {
        addMessage("Sorry, I didn't understand that.");
        showMainMenu(false);
      }
      break;

    case "menu_followup":
    case "hours_followup":
      if (text === "book_from_menu" || text === "book_from_hours") {
        resetBookingData();
        state = "booking_date";
        addMessage("Perfect. For which day would you like to book?");
        setQuickReplies([
          { label: "Today", value: "Today" },
          { label: "Tomorrow", value: "Tomorrow" },
          { label: "Another date", value: "Another date" }
        ]);
      } else {
        addMessage("Okay 😊 If you need anything else, I’m here.");
        state = "main_menu";
        showMainMenu(false);
      }
      break;

    case "booking_date":
      if (text === "Another date") {
        state = "booking_custom_date";
        addMessage("Please type your preferred date.\nExample: April 12");
        setQuickReplies([]);
      } else {
        bookingData.date = text;
        state = "booking_people";
        addMessage("For how many people?");
        setQuickReplies([
          { label: "2 people", value: "2" },
          { label: "4 people", value: "4" },
          { label: "6 people", value: "6" },
          { label: "Other", value: "other_people" }
        ]);
      }
      break;

    case "booking_custom_date":
      bookingData.date = text;
      state = "booking_people";
      addMessage("For how many people?");
      setQuickReplies([
        { label: "2 people", value: "2" },
        { label: "4 people", value: "4" },
        { label: "6 people", value: "6" },
        { label: "Other", value: "other_people" }
      ]);
      break;

    case "booking_people":
      if (text === "other_people") {
        state = "booking_people_custom";
        addMessage("Please type the number of people.");
        setQuickReplies([]);
      } else {
        bookingData.people = text;
        state = "booking_time";
        addMessage("At what time would you prefer?");
        setQuickReplies([
          { label: "19:00", value: "19:00" },
          { label: "20:00", value: "20:00" },
          { label: "21:00", value: "21:00" },
          { label: "Other", value: "other_time" }
        ]);
      }
      break;

    case "booking_people_custom":
      bookingData.people = text;
      state = "booking_time";
      addMessage("At what time would you prefer?");
      setQuickReplies([
        { label: "19:00", value: "19:00" },
        { label: "20:00", value: "20:00" },
        { label: "21:00", value: "21:00" },
        { label: "Other", value: "other_time" }
      ]);
      break;

    case "booking_time":
      if (text === "other_time") {
        state = "booking_time_custom";
        addMessage("Please type your preferred time.\nExample: 20:30");
        setQuickReplies([]);
      } else {
        bookingData.time = text;
        state = "booking_name";
        addMessage("Great 👍 Please type your name.");
        setQuickReplies([]);
      }
      break;

    case "booking_time_custom":
      bookingData.time = text;
      state = "booking_name";
      addMessage("Great 👍 Please type your name.");
      setQuickReplies([]);
      break;

    case "booking_name":
      bookingData.name = text;
      state = "booking_phone";
      addMessage("Thanks. Now please type your phone number.");
      setQuickReplies([]);
      break;

    case "booking_phone":
      bookingData.phone = text;
      state = "booking_special_request";
      addMessage("Would you like to add any special request?");
      setQuickReplies([
        { label: "Yes", value: "special_yes" },
        { label: "No", value: "special_no" }
      ]);
      break;

    case "booking_special_request":
      if (text === "special_yes") {
        state = "booking_special_text";
        addMessage("Please write your special request.");
        setQuickReplies([]);
      } else {
        bookingData.specialRequest = "None";
        finishBooking();
      }
      break;

    case "booking_special_text":
      bookingData.specialRequest = text;
      finishBooking();
      break;

    case "booking_complete":
      if (text === "new_booking") {
        resetBookingData();
        state = "booking_date";
        addMessage("Perfect. For which day would you like to book?");
        setQuickReplies([
          { label: "Today", value: "Today" },
          { label: "Tomorrow", value: "Tomorrow" },
          { label: "Another date", value: "Another date" }
        ]);
      } else if (text === "main_menu_only") {
        showMainMenu(false);
      } else {
        addMessage("Please choose one of the options below.");
      }
      break;

    case "staff_message":
      addMessage("Thank you! Your message has been recorded. We will reply as soon as possible.");
      state = "main_menu";
      showMainMenu(false);
      break;

    default:
      state = "main_menu";
      showMainMenu(false);
      break;
  }
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

showMainMenu(true);
