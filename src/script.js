const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.querySelector("#send-message");

const userData = {
    message: null
}

//Create message element with dynamic classes and return it
const createMessageElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
}

//Handle outgoing user messages
const handelOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();

    messageInput.value = "";

    //Safety checks if the user is not sending any messages
    if (!userData.message) {
        return;
    };

    //Create and display user message
    const messageContent = `<div class="message-text"></div>`;
    const outGoingMessageDiv = createMessageElement(messageContent, "user-message");

    //Setting user's message as textContent to ensure proper text rendering 
    outGoingMessageDiv.querySelector(".message-text").textContent = userData.message;

    chatBody.appendChild(outGoingMessageDiv);


    // Clear the input field automatically after sendin
    messageInput.value = "";
};

//Handle Enter key press for sending message
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();

    // Send only if Enter is pressed without holding Shift (so users can still drop to a new line if they want)
    if (e.key === "Enter" && !e.shiftKey && userMessage) {
        //Prevents a messy line break 
        e.preventDefault();
        HandelOutgoingMessage(userMessage);
    }
});


//Send the message when the "Send" button is clicked
sendMessageButton.addEventListener("click", (e) => {
    handelOutgoingMessage(e);
});