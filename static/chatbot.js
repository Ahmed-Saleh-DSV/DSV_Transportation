// 🔧 Fix for mobile viewport height (ensures chat icon appears on load)
window.addEventListener('load', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// 🧠 Main logic
document.addEventListener('DOMContentLoaded', () => {
  // ✅ Chatbot logic
  const chatBox    = document.getElementById('chat-box');
  const chatToggle = document.querySelector('.chat-toggle');
  const chatClose  = document.getElementById('chat-close');
  const sendBtn    = document.getElementById('chat-send');
  const inputEl    = document.getElementById('chat-input');
  const msgsEl     = document.getElementById('chat-messages');

  if (chatToggle && chatBox && chatClose && sendBtn && inputEl && msgsEl) {
    chatToggle.addEventListener('click', () => chatBox.classList.toggle('open'));
    chatClose.addEventListener('click', () => chatBox.classList.remove('open'));
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
  }

  // ✅ Trip Type + Additional Cities logic
  const tripRadios     = document.querySelectorAll('input[name="trip_type"]');
  const stopsContainer = document.getElementById('stops-container');
  const stopsList      = document.getElementById('stops-list');
  const quoteCard      = document.querySelector('.quote-card');
  let stopCount        = 0;

  if (tripRadios.length && stopsContainer && stopsList && quoteCard) {
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

      const select = document.createElement('select');
      select.name = `destination${stopCount + 1}`;
      select.required = true;

      const cities = [
  "Mussafah", "Alain Industrial Area", "Al Ain City Limits", "AUH Airport", "Abu Dhabi City Limits", "Mafraq", "ICAD 2/ICAD3", "ICAD 4", "Al Wathba", "Mina Zayed/Free Port", "Tawazun Industrial Park", "KIZAD", "Khalifa Port/Taweelah", "Sweihan", "Yas Island", "Ghantoot", "Jebel Ali", "Dubai-Al Qusais",  "Dubai-Al Quoz",  "Dubai-DIP/DIC",  "Dubai-DMC", "Dubai-City Limits", "Sharjah", "Sharjah-Hamriyah", "Ajman", "Umm Al Quwain","Fujairah", "Ras Al Khaimah-Al Ghail","Ras Al Khaimah-Hamra", "Al Markaz Area","Baniyas"
];


      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = `— Select City ${stopCount + 1} —`;
      select.appendChild(defaultOption);

      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
      });

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn-remove';
      remove.textContent = 'Clear';
      remove.addEventListener('click', () => stopsList.removeChild(group));

      group.appendChild(select);
      group.appendChild(remove);
      stopsList.appendChild(group);
    }
  }

  // ✅ Truck Type + Count logic
  const truckTypeContainer = document.getElementById('truckTypeContainer');
  const addTruckBtn = document.getElementById('add-truck-type');

  if (truckTypeContainer && addTruckBtn) {
    addTruckBtn.addEventListener('click', addTruckTypeRow);

    function addTruckTypeRow() {
      const row = document.createElement('div');
      row.className = 'truck-type-row';

      const select = document.createElement('select');
      select.name = 'truck_type[]';
      select.required = true;
      select.innerHTML = `
        <option value="">— Select —</option>
        <option value="flatbed">Flatbed Truck (22–25 tons)</option>
        <option value="box">Box Truck / Curtainside (5–10 tons)</option>
        <option value="reefer">Refrigerated Truck (3–12 tons)</option>
        <option value="city">City Truck (1–3 tons)</option>
        <option value="tipper">Tipper / Dump Truck (15–20 tons)</option>
        <option value="double_trailer">Double Trailer</option>
        <option value="10_ton">10-Ton Truck</option>
        <option value="lowbed">Lowbed</option>
      `;

      const input = document.createElement('input');
      input.type = 'number';
      input.name = 'truck_count[]';
      input.placeholder = 'Count';
      input.min = '1';
      input.required = true;

      row.appendChild(select);
      row.appendChild(input);
      truckTypeContainer.appendChild(row);
    }

    addTruckTypeRow();
  }
});
