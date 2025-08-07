// 🔧 Fix for mobile viewport height
window.addEventListener('load', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 🧠 Main chatbot logic
document.addEventListener('DOMContentLoaded', () => {
  const chatBox    = document.getElementById('chat-box');
  const chatToggle = document.querySelector('.chat-toggle');
  const chatClose  = document.getElementById('chat-close');
  const sendBtn    = document.getElementById('chat-send');
  const inputEl    = document.getElementById('chat-input');
  const msgsEl     = document.getElementById('chat-messages');

  chatToggle.addEventListener('click', () => chatBox.classList.toggle('active'));
  chatClose.addEventListener('click', () => chatBox.classList.remove('active'));
  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    appendMessage('user', text);
    inputEl.value = '';

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const { reply } = await res.json();
      appendMessage('bot', reply, true);
    } catch {
      appendMessage('bot', 'Sorry, something went wrong.');
    }
  }

  function appendMessage(sender, text, typewriter = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    wrapper.appendChild(bubble);
    msgsEl.appendChild(wrapper);
    msgsEl.scrollTop = msgsEl.scrollHeight;

    if (!typewriter) {
      bubble.textContent = text;
    } else {
      let i = 0;
      (function typeChar() {
        if (i < text.length) {
          bubble.textContent += text.charAt(i++);
          msgsEl.scrollTop = msgsEl.scrollHeight;
          setTimeout(typeChar, 15);
        }
      })();
    }
  }

  // 🛣️ Trip type logic
  const tripRadios     = document.querySelectorAll('input[name="trip_type"]');
  const stopsContainer = document.getElementById('stops-container');
  const stopsList      = document.getElementById('stops-list');
  const quoteCard      = document.querySelector('.quote-card');
  let stopCount        = 0;

  tripRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      tripRadios.forEach(r => r.closest('label').classList.remove('selected'));
      radio.closest('label').classList.add('selected');

      if (radio.value === 'multi') {
        stopsContainer.style.display = 'block';
        quoteCard.classList.add('scroll-enabled');
        if (!stopCount) addStop();
      } else {
        stopsContainer.style.display = 'none';
        stopsList.innerHTML = '';
        stopCount = 0;
        quoteCard.classList.remove('scroll-enabled');
      }
    });
  });

  document.getElementById('add-stop').addEventListener('click', addStop);

  function addStop() {
    stopCount++;
    const group = document.createElement('div');
    group.className = 'stop-group';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = `destination${stopCount + 1}`;
    input.placeholder = `City ${stopCount + 1}`;
    input.required = true;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn-remove';
    remove.textContent = 'Clear';
    remove.addEventListener('click', () => stopsList.removeChild(group));

    group.appendChild(input);
    group.appendChild(remove);
    stopsList.appendChild(group);
  }
});
