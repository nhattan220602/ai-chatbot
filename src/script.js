/* 1. DOM Elements initialize */

const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatBotToggler = document.querySelector("#chatbot-toggler");
const closeChatBot = document.querySelector("#close-chatbot");

/* 2. Constants & State */

//API setup
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null,
    },
};

//
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

/* 3. UI Helper Functions */

//Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

/* 4. API Handling */

//Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    //Add user response to chat history
    chatHistory.push({
        role: "user",
        parts: [
            { text: userData.message },
            //Sending the file along with message
            ...(userData.file.data ? [{ inline_data: userData.file }] : []),
        ],
    });

    //API request options in AI google dev Documentation
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory,
        }),
    };

    //Fetch bot response from API
    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message);
        } else {
            //Extract and display bot's response in text
            const apiResponseText = data.candidates[0].content.parts[0].text
                //Remove extra asterisks from bot's response
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .trim();
            messageElement.innerText = apiResponseText;

            //Add bot response to chat history
            chatHistory.push({
                role: "model",
                parts: [{ text: apiResponseText }],
            });
        }
    } catch (error) {
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        //Reset user's file data
        userData.file = {};

        //Remove thinking indicator (class)
        incomingMessageDiv.classList.remove("thinking");
        //An automatic scrolling to bottom when sending or receiving messages
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: "smooth",
        });
    }
};

/* 5. Event Listeners */

//Handle outgoing user messages
const handelOutgoingMessage = (e) => {
    e.preventDefault(e);
    userData.message = messageInput.value.trim();

    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    //Create and display user message
    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data
            ? `<img src = "data:${userData.file.mime_type};base64, 
                            ${userData.file.data}" class="attachment" />`
            : ""
        } `;
    const outGoingMessageDiv = createMessageElement(
        messageContent,
        "user-message",
    );

    //Setting user's message as textContent to ensure proper text rendering
    outGoingMessageDiv.querySelector(".message-text").textContent =
        userData.message;
    chatBody.appendChild(outGoingMessageDiv);

    //An automatic scrolling when sending or receiving messages
    chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth",
    });

    //Stimulate bot response with thinking indicator after a delay
    setTimeout(() => {
        //Create and display bot message
        const messageContent = `<svg
            class="chatbot-logo"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 1024 1024">
            <title>AI Chatbot Avatar Icon</title>
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`;

        const incomingMessageDiv = createMessageElement(
            messageContent,
            "bot-message",
            "thinking",
        );
        chatBody.appendChild(incomingMessageDiv);
        //An automatic scrolling when sending or receiving messages
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: "smooth",
        });
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

//Handle Enter key press for sending message
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();

    // Send only if Enter is pressed without holding Shift (so users can still drop to a new line if they want)
    if (
        e.key === "Enter" &&
        !e.shiftKey &&
        userMessage &&
        window.innerWidth > 768
    ) {
        //Prevents a messy line break
        e.preventDefault();
        handelOutgoingMessage(e);
    }
});

// Adjust input field height dynamically
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius =
        messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

//Handle file input change
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) {
        return;
    } else {
        const reader = new FileReader();

        reader.onload = (e) => {
            //Preview the selected file
            fileUploadWrapper.querySelector("img").src = e.target.result;
            fileUploadWrapper.classList.add("file-uploaded");

            const base64String = e.target.result.split(",")[1];

            //Store file data in userData
            userData.file = {
                data: base64String,
                mime_type: file.type,
            };

            fileInput.value = "";
        };

        //Converting file to base64 format
        reader.readAsDataURL(file);
    }
});

/* 6. Initialization */

//Initialize emoji picker
const picker = new EmojiMart.Picker({
    theme: "dark",
    skinTonePosition: "none",
    previewPosition: "none",
    //Handel emoji selection
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },

    onClickOutside: (e) => {
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    },
});

document.querySelector(".chat-form").appendChild(picker);

/* 7. Click button event section: */

//Send the message when the "Send" button is clicked
sendMessageButton.addEventListener("click", (e) => {
    handelOutgoingMessage(e);
});

//Trigger the file input when the file upload button is clicked
document
    .querySelector("#file-upload")
    .addEventListener("click", () => fileInput.click());

//File cancel button
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

chatBotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot"),
);
closeChatBot.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot"),
);
