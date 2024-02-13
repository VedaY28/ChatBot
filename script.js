const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const chatCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "";

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }

    //Sends POST request to OpenAI API
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.textContent = "Opps! Something went wrong. Please Try Again!";
    }).finally(() =>  chatbox.scrollTo(0, chatbox.scrollHeight));
}


//Creates a chat <Li> with message and classname
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return; //Return if chat input empty
    
    //After User Inputs it Clear the Textfield
    chatInput.value = "";

    //Outputs the User's Message to Chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi(messageElement, "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

// chatInput.addEventListener("input", () => {
//     chatInput.style = ${}
// })

chatInput.addEventListener("keydown", (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
