const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const conversation = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();

  if (!userMessage) return;

  appendMessage('user', userMessage);

  conversation.push({
    role: 'user',
    text: userMessage
  });

  input.value = '';

  const loadingMessage = appendMessage(
    'bot',
    'Gemini sedang mengetik...'
  );

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation
      })
    });

    const data = await response.json();

    loadingMessage.remove();

    if (!response.ok) {
      appendMessage(
        'bot',
        data.error || 'Terjadi kesalahan pada server'
      );
      return;
    }

    appendMessage('bot', data.response);

    conversation.push({
      role: 'model',
      text: data.response
    });

  } catch (error) {
    loadingMessage.remove();

    console.error(error);

    appendMessage(
      'bot',
      'Gagal terhubung ke server.'
    );
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');

  msg.classList.add('message');
  msg.classList.add(sender);

  msg.textContent = text;

  chatBox.appendChild(msg);

  chatBox.scrollTop = chatBox.scrollHeight;

  return msg;
}