// =================================================================
// SCRIPT.JS - «ЧИСТАЯ АРХИТЕКТУРА» ЦИТАДЕЛИ АКАДЕМИИ v6.0 (СТАТИКА)
// =================================================================

document.addEventListener('DOMContentLoaded', function() {

    // -----------------------------------------------------------------
    // Раздел I: Функции инициализации интерактивных элементов
    // -----------------------------------------------------------------

    /**
     * Инициализирует анимации появления элементов при прокрутке.
     * Использует IntersectionObserver для отслеживания видимости элементов.
     */
    function initializeAnimations() {
        // Выбираем все элементы с атрибутом data-aos для анимации
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        // Проверяем, поддерживает ли браузер IntersectionObserver
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    // Если элемент появляется в области видимости
                    if (entry.isIntersecting) {
                        // Применяем задержку анимации из data-атрибута
                        const delay = entry.target.dataset.aosDelay || '0';
                        entry.target.style.animationDelay = delay;
                        
                        // Добавляем класс для запуска анимации (определенной в CSS)
                        entry.target.classList.add('animate-in');
                        
                        // Прекращаем наблюдение за элементом после одной анимации
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 }); // Анимация сработает, когда 10% элемента видно
            
            // Начинаем наблюдение за каждым элементом
            animatedElements.forEach(el => observer.observe(el));
        }
    }

    /**
     * Инициализирует всю динамику на странице: меню, FAQ, модальные окна, чат.
     */
    function initializeDynamicElements() {
        // --- Логика бургер-меню ---
        const burgerMenuButton = document.getElementById('burgerMenu');
        const navBar = document.getElementById('navbar');
        if (burgerMenuButton && navBar) {
            burgerMenuButton.addEventListener('click', () => {
                navBar.classList.toggle('nav--open');
            });
        }

        // --- Логика FAQ ---
        const faqContainer = document.querySelector('#faq-container');
        if (faqContainer) {
            faqContainer.addEventListener('click', (e) => {
                const questionButton = e.target.closest('.faq-question');
                if (questionButton) {
                    // Переключаем класс 'active' на родительском элементе .faq-item
                    questionButton.parentElement.classList.toggle('active');
                }
            });
        }

        // --- Функция для управления видимостью кнопки чата ---
        function toggleChatButtonVisibility(hide = false) {
            const chatButton = document.querySelector('.rocky-chat-button');
            if (chatButton) {
                if (hide) {
                    chatButton.classList.add('hidden');
                } else {
                    chatButton.classList.remove('hidden');
                }
            }
        }

        // --- Логика модального окна регистрации ---
        const modal = document.getElementById('registration-modal');
        const closeModalBtn = document.getElementById('modal-close-btn');
        
        // Открытие модального окна по клику на любую кнопку с классом .register-trigger
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.register-trigger')) {
                e.preventDefault();
                modal?.classList.add('modal--open');
                // Скрываем кнопку чата при открытии модального окна
                toggleChatButtonVisibility(true);
            }
        });
        
        // Закрытие модального окна через кнопку "крестик"
        closeModalBtn?.addEventListener('click', () => {
            modal?.classList.remove('modal--open');
            // Показываем кнопку чата при закрытии модального окна
            toggleChatButtonVisibility(false);
        });
        
        // Закрытие модального окна по клику на фон
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('modal--open');
                // Показываем кнопку чата при закрытии модального окна
                toggleChatButtonVisibility(false);
            }
        });
        
        // --- Логика чата "Роки" ---
        const chatContainer = document.getElementById('rocky-chat');
        if (chatContainer) {
            const chatToggleBtn = document.getElementById('rocky-chat-toggle');
            const chatForm = document.getElementById('chat-form');
            const chatMessages = document.getElementById('chat-messages');
            const chatInput = document.getElementById('chat-input');
            const API_ENDPOINT = 'https://designerscode-oracle-backend.onrender.com/api/ask-oracle';

            const addMessage = (text, sender) => {
                const loading = chatMessages.querySelector('.loading-indicator');
                if (loading) loading.remove();
                
                const msgContainer = document.createElement('div');
                msgContainer.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
                const p = document.createElement('p');
                p.textContent = text;
                msgContainer.appendChild(p);
                chatMessages.appendChild(msgContainer);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };

            const showLoadingIndicator = () => {
                const loadingContainer = document.createElement('div');
                loadingContainer.className = 'chat-message bot-message loading-indicator';
                loadingContainer.innerHTML = `<div class="loader-animation"><span></span><span></span><span></span><span></span></div><p>Ищу ответы в библиотеке Премудрости...</p>`;
                const existingLoading = chatMessages.querySelector('.loading-indicator');
                if (existingLoading) existingLoading.remove();
                chatMessages.appendChild(loadingContainer);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            };

            const isMobile = () => window.innerWidth <= 768;

            chatToggleBtn.addEventListener('click', () => {
                const isOpening = !chatContainer.classList.contains('chat--open');
                
                if (isOpening) {
                    chatContainer.classList.add('chat--open');
                    if (isMobile()) {
                        requestAnimationFrame(() => chatContainer.classList.add('show'));
                        document.body.style.overflow = 'hidden';
                    }
                    if (!sessionStorage.getItem('rockyWelcomeShown')) {
                        setTimeout(() => {
                            addMessage('Здравствуйте! Я Роки, ваш проводник. Спросите меня о курсе, тарифах или программе, и я найду ответ в Библиотеке Премудрости.', 'bot');
                            sessionStorage.setItem('rockyWelcomeShown', 'true');
                        }, isMobile() ? 800 : 500);
                    }
                } else {
                    if (isMobile()) {
                        chatContainer.classList.remove('show');
                        document.body.style.overflow = '';
                        setTimeout(() => chatContainer.classList.remove('chat--open'), 400);
                    } else {
                        chatContainer.classList.remove('chat--open');
                    }
                }
            });

            chatContainer.addEventListener('click', (e) => {
                if (e.target === chatContainer && isMobile()) {
                    chatContainer.classList.remove('show');
                    document.body.style.overflow = '';
                    setTimeout(() => chatContainer.classList.remove('chat--open'), 400);
                }
            });

            chatForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userMessage = chatInput.value.trim();
                if (!userMessage) return;

                addMessage(userMessage, 'user');
                chatInput.value = '';
                showLoadingIndicator();

                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question: userMessage }),
                    });
                    if (!response.ok) throw new Error(`Сетевая ошибка: ${response.status}`);
                    const data = await response.json();
                    setTimeout(() => addMessage(data.answer || 'Не удалось получить ответ.', 'bot'), 1200);
                } catch (error) {
                    console.error('Rocky: Ошибка связи с ИИ-ассистентом:', error);
                    setTimeout(() => addMessage('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.', 'bot'), 1200);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && chatContainer.classList.contains('chat--open')) {
                    if (isMobile()) {
                        chatContainer.classList.remove('show');
                        document.body.style.overflow = '';
                        setTimeout(() => chatContainer.classList.remove('chat--open'), 400);
                    } else {
                        chatContainer.classList.remove('chat--open');
                    }
                }
            });

            document.querySelector('.rocky-chat-window')?.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    // -----------------------------------------------------------------
    // Раздел II: Главная точка входа
    // -----------------------------------------------------------------
    
    // 1. Инициализируем всю динамику (меню, модалки, чат и т.д.)
    initializeDynamicElements();
    
    // 2. Инициализируем анимации появления для уже существующих в HTML элементов
    initializeAnimations();

    console.log("Rocky: Архитектура выстроена. Все статические и динамические системы запущены.");
});
