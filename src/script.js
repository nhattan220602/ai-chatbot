const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");



//Create message element with dynamic classes and return it
const createMessageElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
}

//Handle outgoing user messages
const HandelOutgoingMessage = (userMessage) => {
    
    //Create and display user message
    const messageContent = `<div class="message-text">${userMessage}</div>`;
    const outGoingMessageDiv = createMessageElement(messageContent, "user-message");
    chatBody.appendChild(outGoingMessageDiv);
};

//Handle Enter key press for sending message
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();

    if (e.key === "Enter" && userMessage) {
        HandelOutgoingMessage(userMessage);
    }
});
