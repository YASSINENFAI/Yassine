(function () {
    'use strict';

    // --- Configuration ---
    const API_ENDPOINT = '/api/chat';
    const CHAT_TITLE = 'Virtual Assistant';
    const WELCOME_MESSAGE = 'مرحباً! أنا مساعدك الشخصي هنا. كيف يمكنني مساعدتك اليوم بخصوص الموقع أو خدماتي؟';
    const PLACEHOLDER_TEXT = 'اكتب رسالتك هنا...';

    // --- Create Chat UI ---
    function createChatWidget() {
        // 1. Create wrapper
        const wrapper = document.createElement('div');
        wrapper.id = 'yassine-chat-widget';

        // 2. Create Floating Button
        const button = document.createElement('button');
        button.className = 'chat-widget-fab';
        button.setAttribute('aria-label', 'Open Chat');
        button.innerHTML = `
      <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

        // 3. Create Modal
        const modal = document.createElement('div');
        modal.className = 'chat-widget-modal';
        modal.innerHTML = `
      <div class="chat-header">
        <div class="chat-title">
          <div class="chat-status-dot"></div>
          ${CHAT_TITLE}
        </div>
      </div>
      <div class="chat-messages" id="chat-messages">
        <!-- Messages will appear here -->
      </div>
      <div class="chat-input-area">
        <input type="text" id="chat-input" class="chat-input" placeholder="${PLACEHOLDER_TEXT}" autocomplete="off">
        <button id="chat-send" class="chat-send-btn" aria-label="Send Message" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;

        wrapper.appendChild(button);
        wrapper.appendChild(modal);
        document.body.appendChild(wrapper);

        return { button, modal };
    }

    // --- Logic ---
    const { button, modal } = createChatWidget();
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesContainer = document.getElementById('chat-messages');

    let isOpen = false;

    // Toggle Chat
    button.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            modal.classList.add('visible');
            button.classList.add('open');
            document.querySelector('.icon-chat').style.display = 'none';
            document.querySelector('.icon-close').style.display = 'block';
            setTimeout(() => input.focus(), 300); // Focus input after animation

            // Add welcome message if empty
            if (messagesContainer.children.length === 0) {
                addMessage(WELCOME_MESSAGE, 'ai');
            }
        } else {
            modal.classList.remove('visible');
            button.classList.remove('open');
            document.querySelector('.icon-chat').style.display = 'block';
            document.querySelector('.icon-close').style.display = 'none';
        }
    });

    // Handle Input State (enable/disable button)
    input.addEventListener('input', () => {
        sendBtn.disabled = input.value.trim() === '';
    });

    // Handle Enter Key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendBtn.disabled) {
            sendMessage();
        }
    });

    // Send Message
    sendBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
        const userText = input.value.trim();
        if (!userText) return;

        // 1. Add User Message
        addMessage(userText, 'user');
        input.value = '';
        sendBtn.disabled = true;

        // 2. Show Loading
        const loadingId = addLoadingIndicator();

        // 3. Call API
        try {
            // Build context from previous messages (simple history)
            const context = getMessageHistory();

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, history: context })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // 4. Remove Loading & Add AI Response
            removeLoadingIndicator(loadingId);
            addMessage(data.reply || "Sorry, I couldn't understand that.", 'ai');

        } catch (error) {
            console.error('Chat Error:', error);
            removeLoadingIndicator(loadingId);
            addMessage("عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.", 'error');
        }
    }

    // Helper: Get recent history for context (last 10 messages)
    function getMessageHistory() {
        const bubbles = Array.from(messagesContainer.querySelectorAll('.chat-message'));
        return bubbles.slice(-10).map(bubble => ({
            role: bubble.classList.contains('user') ? 'user' : 'assistant',
            content: bubble.innerText
        }));
    }

    // Helper: Add Message Bubble
    function addMessage(text, type) {
        const bubble = document.createElement('div');
        bubble.className = `chat-message ${type}`;
        bubble.innerText = text;
        messagesContainer.appendChild(bubble);
        scrollToBottom();
    }

    // Helper: Add Loading Indicator
    function addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const loader = document.createElement('div');
        loader.id = id;
        loader.className = 'typing-indicator';
        loader.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
        messagesContainer.appendChild(loader);
        scrollToBottom();
        return id;
    }

    // Helper: Remove Loading Indicator
    function removeLoadingIndicator(id) {
        const loader = document.getElementById(id);
        if (loader) loader.remove();
    }

    // Helper: Scroll to bottom
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

})();
