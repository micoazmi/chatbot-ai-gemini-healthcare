const form = document.getElementById("chat-form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

const conversation = [];

// function addMessage(text, role) {
//     const div = document.createElement("div");

//     div.className = `message ${role}`;
//    // div.textContent = text;

//     // Gunakan marked jika library tersedia dan pengirimnya adalah bot
//     if (role === "bot" && typeof marked !== "undefined") {
//         div.innerHTML = marked.parse(text);
//     } else {
//         div.textContent = text;
//     }

//     messages.appendChild(div);

//     messages.scrollTop = messages.scrollHeight;
// }

function addMessage(text, role) {
    const div = document.createElement("div");

    div.className = `message ${role}`;

    if (role === "bot") {
        div.innerHTML = marked.parse(text);
    } else {
        div.textContent = text;
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;

    return div;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    conversation.push({
        role: "user",
        text
    });

    input.value = "";

    const loading = document.createElement("div");
    loading.className = "message bot";
    loading.textContent = "Sedang mengetik...";
    messages.appendChild(loading);

    try {

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                conversation
            })
        });

        const data = await response.json();

        loading.remove();

        if (data.error) {
            addMessage(data.error, "bot");
            return;
        }

        addMessage(data.response, "bot");

        conversation.push({
            role: "model",
            text: data.response
        });

    } catch (err) {

        loading.remove();

        addMessage(
            "Gagal menghubungi server.",
            "bot"
        );

        console.error(err);
    }
});