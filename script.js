document.addEventListener("DOMContentLoaded", function () {
  const chatbox = document.getElementById("chatbox");
  const quickReplies = document.getElementById("quickReplies");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

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
    const message = document.createElement("div");
    message.className = `message ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    message.appendChild(bubble);
    chatbox.appendChild(message);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  function setQuickReplies(options) {
    quickReplies.innerHTML = "";

    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "quick-reply-btn";
      btn.textContent = option.label;
      btn.addEventListener("click", function () {
        handleUserInput(option.value, true, option.label);
      });
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
      addMessage(
        "👋 Welcome to Ristorante Bella Trento.\nI’m your AI dining assistant. I can help with reservations, menu questions, and customer requests."
      );
    }

    setQuickReplies([
      { label: "Book a Table", value: "book_table" },
      { label: "Browse Menu", value: "see_menu" },
      { label: "Hours & Location", value: "hours_location" },
      { label: "Talk to Staff", value: "talk_staff" }
    ]);
  }

  function finishBooking() {
    addMessage(
      `Perfect ✅\nReservation registered.\n\nSummary:\n- Day: ${bookingData.date}\n- People: ${bookingData.people}\n- Time: ${bookingData.time}\n- Name: ${bookingData.name}\n- Phone: ${bookingData.phone}\n- Special request: ${bookingData.specialRequest || "None"}`
    );

    addMessage("We will confirm you as soon as possible. Thank you! 😊");

    state = "booking_complete";
    setQuickReplies([
      { label: "New Booking", value: "new_booking" },
      { label: "Main Menu", value: "main_menu_only" }
    ]);
  }

  function handleUserInput(input, fromButton = false, displayText = null) {
    const text = String(input).trim();
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
            { label: "Another Date", value: "Another Date" }
          ]);
        } else if (text === "see_menu") {
          state = "menu_followup";
          addMessage(
            "Sure 😊\nHere is our demo menu:\n\n• Pizza Margherita — €8\n• Pasta Carbonara — €9\n• Tiramisu — €5\n• Water / Coca-Cola"
          );
          addMessage("Would you also like to book a table?");
          setQuickReplies([
            { label: "Yes, Book Now", value: "book_from_menu" },
            { label: "No, Thanks", value: "no_thanks" }
          ]);
        } else if (text === "hours_location") {
          state = "hours_followup";
          addMessage(
            "We are open:\nMon–Sun: 12:00–15:00 / 18:00–23:00\n\nFind us at:\nVia Roma 24, Trento"
          );
          addMessage("Would you like to book a table?");
          setQuickReplies([
            { label: "Yes, Book Now", value: "book_from_hours" },
            { label: "No, Thanks", value: "no_thanks" }
          ]);
        } else if (text === "talk_staff") {
          state = "staff_message";
          addMessage("Okay. Write your message below and we will forward it to our staff.");
          setQuickReplies([]);
        } else {
          addMessage("Sorry, I didn’t understand that.");
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
            { label: "Another Date", value: "Another Date" }
          ]);
        } else {
          addMessage("Okay 😊 If you need anything else, I’m here.");
          showMainMenu(false);
        }
        break;

      case "booking_date":
        if (text === "Another Date") {
          state = "booking_custom_date";
          addMessage("Please type your preferred date.\nExample: April 12");
          setQuickReplies([]);
        } else {
          bookingData.date = text;
          state = "booking_people";
          addMessage("For how many people?");
          setQuickReplies([
            { label: "2 People", value: "2" },
            { label: "4 People", value: "4" },
            { label: "6 People", value: "6" },
            { label: "Other", value: "other_people" }
          ]);
        }
        break;

      case "booking_custom_date":
        bookingData.date = text;
        state = "booking_people";
        addMessage("For how many people?");
        setQuickReplies([
          { label: "2 People", value: "2" },
          { label: "4 People", value: "4" },
          { label: "6 People", value: "6" },
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
            { label: "Another Date", value: "Another Date" }
          ]);
        } else if (text === "main_menu_only") {
          showMainMenu(false);
        } else {
          addMessage("Please choose one of the options below.");
        }
        break;

      case "staff_message":
        addMessage("Thank you! Your message has been recorded. We will reply as soon as possible.");
        showMainMenu(false);
        break;

      default:
        showMainMenu(false);
        break;
    }
  }

  sendBtn.addEventListener("click", function () {
    handleUserInput(userInput.value);
    userInput.value = "";
    userInput.focus();
  });

  userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUserInput(userInput.value);
      userInput.value = "";
    }
  });

  showMainMenu(true);
});
