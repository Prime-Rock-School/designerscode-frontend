// =================================================================
// SCRIPT.JS - "ЗОЛОТОЙ СВИТОК" PRIME ROCK ACADEMY (ФИНАЛЬНАЯ ВЕРСИЯ)
// =================================================================

document.addEventListener('DOMContentLoaded', function() {

    // -----------------------------------------------------------------
    // Раздел I: Вспомогательные функции
    // -----------------------------------------------------------------

    // Функция для безопасной вставки текста или HTML
    function setContent(selector, content, isHtml = false) {
        const element = document.querySelector(selector);
        if (element) {
            isHtml ? element.innerHTML = content : element.textContent = content;
        }
    }

    // Функция для генерации списков элементов из массива данных
    function generateList(selector, items, renderFunction) {
        const container = document.querySelector(selector);
        if (container && Array.isArray(items)) {
            container.innerHTML = '';
            items.forEach(item => {
                container.innerHTML += renderFunction(item);
            });
        }
    }

    // --- НОВАЯ ФУНКЦИЯ АНИМАЦИИ СЧЕТЧИКА ---
    function animateCounter(element) {
        const targetText = element.textContent;
        const targetNumber = parseInt(targetText.replace(/\D/g, ''));
        if (isNaN(targetNumber)) return;

        let current = 0;
        const duration = 1500; // 1.5 секунды
        const stepTime = Math.abs(Math.floor(duration / targetNumber));
        
        const timer = setInterval(() => {
            current += Math.ceil(targetNumber / (duration / 16));
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            element.textContent = targetText.replace(/\d+/, current.toLocaleString('en-US'));
        }, 16);
    }


    // -----------------------------------------------------------------
    // Раздел II: Главная функция загрузки контента
    // -----------------------------------------------------------------

    async function loadContent() {
        try {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
            const content = await response.json();

            // --- Глобальные элементы ---
            document.title = content.siteTitle;
            setContent('#logo', content.logoText);

            // --- Навигация ---
            const navLinksContainer = document.querySelector('#nav-links');
            if (navLinksContainer) {
                navLinksContainer.innerHTML = '';
                for (const [key, value] of Object.entries(content.nav)) {
                    if (key !== 'ctaButton') {
                        navLinksContainer.innerHTML += `<a href="#${key}">${value}</a>`;
                    }
                }
                navLinksContainer.innerHTML += `<a href="#pricing" class="nav-cta">${content.nav.ctaButton}</a>`;
            }

            // --- Заполнение всех секций ---
            setContent('#hero-title', content.hero.title);
            setContent('#hero-subtitle', content.hero.subtitle);
            setContent('#hero-cta', content.hero.cta, true);

            setContent('#problems-title', content.problems.title, true);
            generateList('#problems-grid', content.problems.cards, card => `<div class="problem-card glass-card"><div class="problem-icon">${card.icon}</div><h3>${card.title}</h3><p>${card.text}</p></div>`);

            setContent('#solution-title', content.solution.title, true);
            setContent('#solution-p1', content.solution.p1, true);
            setContent('#solution-p2', content.solution.p2);

            setContent('#process-title', content.process.title, true);
            generateList('#process-timeline', content.process.steps, step => `<div class="process-step"><div class="step-number"><span>${step.number}</span></div><div class="step-content glass-card"><h3>${step.title}</h3><p>${step.text}</p></div></div>`);

            setContent('#results-title', content.results.title, true);
            generateList('#results-grid', content.results.cards, card => `<div class="result-card glass-card"><div class="result-number">${card.number}</div><h3>${card.title}</h3><p>${card.text}</p></div>`);
            
            setContent('#author-title', content.author.title);
            setContent('#author-p1', content.author.p1);
            setContent('#author-p2', content.author.p2, true);
            const authorImageContainer = document.querySelector('#author-image-container');
            if(authorImageContainer) {
                authorImageContainer.innerHTML = `<img src="${content.author.imageUrl}" alt="${content.author.name}">`;
            }

            setContent('#testimonials-title', content.testimonials.title, true);
            generateList('#testimonials-grid', content.testimonials.cards, card => `<div class="testimonial-card glass-card"><p class="testimonial-text">"${card.text}"</p><div class="testimonial-author-info"><img src="${card.imageUrl}" alt="${card.author}"><span class="testimonial-author-name">${card.author}</span></div></div>`);
            
            setContent('#bonuses-title', content.bonuses.title, true);
            generateList('#bonuses-grid', content.bonuses.cards, card => `<div class="bonus-card glass-card"><div class="bonus-icon">${card.icon}</div><h3>${card.title}</h3><p>${card.text}</p></div>`);
                
            setContent('#pricing-title', content.pricing.title, true);
            generateList('#pricing-grid', content.pricing.plans, plan => `<div class="pricing-card glass-card ${plan.isPopular ? 'popular' : ''}">${plan.isPopular ? `<div class="popular-badge">${plan.popularText}</div>` : ''}<h3>${plan.name}</h3><div class="price">${plan.price}</div><p class="description">${plan.description}</p><ul class="features">${plan.features.map(feature => `<li>${feature}</li>`).join('')}</ul><a href="#" class="cta-button-pricing">${plan.buttonText}</a></div>`);

            // --- Секция FAQ теперь управляется чатом, убираем генерацию старого списка ---
            setContent('#faq-title', content.faq.title, true);
            
            setContent('#final-cta-title', content.final_cta.title, true);
            setContent('#final-cta-subtitle', content.final_cta.subtitle);
            setContent('#final-cta-button', content.final_cta.cta, true);
            
            setContent('#footer', content.footer.copy);

        } catch (error) {
            console.error('Не удалось загрузить или отобразить контент:', error);
        }
    }

    // -----------------------------------------------------------------
    // Раздел III: Инициализация и обработчики событий
    // -----------------------------------------------------------------

    loadContent().then(() => {
        // Анимация появления элементов
        const animatedElements = document.querySelectorAll('.glass-card, .process-step');
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    visibilityObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => visibilityObserver.observe(el));

        // Анимация счетчиков
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target); // Теперь эта функция существует!
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });
        document.querySelectorAll('.result-number').forEach(counter => counterObserver.observe(counter));
        
        // Логика для FAQ-аккордеона (если он вернется)
        // На данный момент эта логика не нужна, так как FAQ управляется чатом
    });

    // --- Общие обработчики, не зависящие от динамического контента ---
    
    const nav = document.getElementById('navbar');
    const burgerMenu = document.getElementById('burgerMenu');
    // ... остальной код общих обработчиков ...

    // --- Логика чата (остается без изменений) ---
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const messagesContainer = document.getElementById('chat-messages');

    const BACKEND_URL = 'https://designerscode-oracle-backend.onrender.com/api/ask-oracle';

    function addMessage(text, sender) {
        if (!messagesContainer) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function handleSend() {
        if (!chatInput || !chatInput.value.trim()) return;
        const userMessage = chatInput.value.trim();
        addMessage(userMessage, 'user');
        chatInput.value = '';
        chatInput.focus();
        addMessage('Оракул ищет ответ в потоках света...', 'bot loading');
        const loadingIndicator = messagesContainer.querySelector('.loading');
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage }),
            });
            if (loadingIndicator) loadingIndicator.remove();
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка сети');
            }
            const data = await response.json();
            addMessage(data.answer, 'bot');
        } catch (error) {
            if (loadingIndicator) loadingIndicator.remove();
            console.error('Ошибка при связи с Оракулом:', error);
            addMessage('Произошла ошибка при связи с Оракулом. Пожалуйста, проверьте соединение или попробуйте позже.', 'bot error');
        }
    }
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
            }
        });
        setTimeout(() => {
             addMessage('Здравствуйте! Я — Оракул Академии. Я готов ответить на ваши вопросы о курсе.', 'bot');
        }, 1000);
    }
});