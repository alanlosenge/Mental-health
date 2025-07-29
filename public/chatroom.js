// UI Elements
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const typingIndicator = document.getElementById("typingIndicator");
const toggleMode = document.getElementById("toggleMode");
const currentRoomDisplay = document.getElementById("currentRoom");

// Assign random username
const username = "Anon" + Math.floor(Math.random() * 900 + 100);
let currentRoom = "General";
let isDark = false;

// Send message
sendBtn.onclick = () => {
  const text = messageInput.value.trim();
  if (text !== "") {
    appendMessage(text, username, "sent");
    simulateReply();
    messageInput.value = "";
  }
};

// Append message to chat
function appendMessage(text, sender, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerHTML = `
    <strong>${sender}</strong><br/>
    ${text}
    <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    <div class="reactions">
      <span onclick="react(this)">❤️</span> 
      <span onclick="react(this)">👍</span> 
      <span onclick="react(this)">😂</span>
    </div>
  `;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Simulate reply after 2 seconds
function simulateReply() {
  const botUsers = ["Anon707", "Anon828", "Anon639", "Anon501"];
  const sampleReplies = [
    "Hey there!",
    "Feeling overwhelmed, you?",
    "You're not alone.",
    "Want to talk more about it?",
    "Just take a deep breath 🌿"
  ];

  const randomUser = botUsers[Math.floor(Math.random() * botUsers.length)];
  const randomMsg = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

  typingIndicator.style.display = "block";

  setTimeout(() => {
    typingIndicator.style.display = "none";
    appendMessage(randomMsg, randomUser, "received");
  }, 2000);
}

// Emoji Picker
emojiBtn.onclick = () => {
  emojiPicker.style.display = emojiPicker.style.display === "block" ? "none" : "block";
  if (emojiPicker.innerHTML.trim() === "") {
    const emojis = "😊 😢 😂 😡 😍 🤔 😴 🙌 💬".split(" ");
    emojis.forEach(emoji => {
      const btn = document.createElement("button");
      btn.textContent = emoji;
      btn.onclick = () => {
        messageInput.value += emoji;
        emojiPicker.style.display = "none";
        messageInput.focus();
      };
      emojiPicker.appendChild(btn);
    });
  }
};

// Emoji reaction animation
function react(el) {
  el.style.transform = "scale(1.2)";
  setTimeout(() => el.style.transform = "scale(1)", 150);
}

// Dark mode toggle
toggleMode.onclick = () => {
  document.body.classList.toggle("dark-mode");
  isDark = !isDark;
};

// Room switch (simulated)
document.querySelectorAll(".room").forEach(roomEl => {
  roomEl.onclick = () => {
    document.querySelectorAll(".room").forEach(r => r.classList.remove("active"));
    roomEl.classList.add("active");
    currentRoom = roomEl.dataset.room;
    currentRoomDisplay.textContent = `# ${currentRoom}`;
    messagesDiv.innerHTML = ""; // Clear messages
  };
});

/* Simulated Incoming Messages (No Backend) */
const simulatedUsers = ["Anon101", "Anon202", "Anon303", "Anon404", "Anon505"];
const sampleMessages = [
  "Hey there!",
  "Anyone here feeling overwhelmed?",
  "This chat is really helpful.",
  "Sending good vibes 🌈",
  "Taking a deep breath always helps me.",
  "How’s everyone doing today?",
  "I’m here if anyone needs to talk 💬",
  "Mindfulness has changed my life.",
  "We got this 💪",
  "Let’s be kind to ourselves."
];

// Simulate random messages every 7–15 seconds
function simulateMessages() {
  setInterval(() => {
    const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
    const randomMsg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const messageData = {
      text: randomMsg,
      sender: randomUser,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: currentRoom
    };

    // Manually trigger the socket event listener
    socket.emit("chat_message", messageData);
  }, Math.floor(Math.random() * 8000) + 7000); // 7–15 seconds
}

// Replace real socket with mock emitter if no backend
if (typeof io === "function" && !socket.connected) {
  console.warn("No backend detected. Using simulated messages.");
  socket.emit = (event, data) => {
    if (event === "chat_message") {
      socket.onmessage && socket.onmessage({ data });
      socket._listeners?.["chat_message"]?.forEach(cb => cb(data));
    }
    if (event === "typing") {
      socket._listeners?.["typing"]?.forEach(cb => cb(data));
    }
    if (event === "stop_typing") {
      socket._listeners?.["stop_typing"]?.forEach(cb => cb(data));
    }
  };

  socket.on = (event, callback) => {
    socket._listeners = socket._listeners || {};
    socket._listeners[event] = socket._listeners[event] || [];
    socket._listeners[event].push(callback);
  };

  simulateMessagesWithTyping(); // Start fake messages WITH typing

  
}

// Simulated Typing Before Each Message
function simulateMessagesWithTyping() {
  setInterval(() => {
    const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
    const randomMsg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

    // Show "typing..." before sending
    socket.emit("typing", { room: currentRoom, sender: randomUser });

    setTimeout(() => {
      socket.emit("stop_typing", { room: currentRoom });

      const messageData = {
        text: randomMsg,
        sender: randomUser,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        room: currentRoom
      };

      socket.emit("chat_message", messageData);
    }, 2000 + Math.random() * 2000); // Typing lasts 2-4 seconds
  }, Math.floor(Math.random() * 8000) + 7000); // New message every 7-15 seconds
}
