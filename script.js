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

            // --- Секция Hero ---
            setContent('#hero-title', content.hero.title);
            setContent('#hero-subtitle', content.hero.subtitle);
            setContent('#hero-cta', content.hero.cta, true);

            // --- Секция Problems ---
            setContent('#problems-title', content.problems.title, true);
            generateList('#problems-grid', content.problems.cards, card => `
                <div class="problem-card glass-card">
                    <div class="problem-icon">${card.icon}</div>
                    <h3>${card.title}</h3><p>${card.text}</p>
                </div>`);

            // --- Секция Solution ---
            setContent('#solution-title', content.solution.title, true);
            setContent('#solution-p1', content.solution.p1, true);
            setContent('#solution-p2', content.solution.p2);

            // --- Секция Process ---
            setContent('#process-title', content.process.title, true);
            generateList('#process-timeline', content.process.steps, step => `
                <div class="process-step">
                    <div class="step-number"><span>${step.number}</span></div>
                    <div class="step-content glass-card"><h3>${step.title}</h3><p>${step.text}</p></div>
                </div>`);

            // --- Секция Results ---
            setContent('#results-title', content.results.title, true);
            generateList('#results-grid', content.results.cards, card => `
                <div class="result-card glass-card">
                    <div class="result-number">${card.number}</div>
                    <h3>${card.title}</h3><p>${card.text}</p>
                </div>`);
            
            // --- Секция Author ---
            setContent('#author-title', content.author.title);
            setContent('#author-p1', content.author.p1);
            setContent('#author-p2', content.author.p2, true);
            const authorImageContainer = document.querySelector('#author-image-container');
            if(authorImageContainer) {
                authorImageContainer.innerHTML = `<img src="${content.author.imageUrl}" alt="${content.author.name}">`;
            }

            // --- Секция Testimonials ---
            setContent('#testimonials-title', content.testimonials.title, true);
            generateList('#testimonials-grid', content.testimonials.cards, card => `
                <div class="testimonial-card glass-card">
                    <p class="testimonial-text">"${card.text}"</p>
                    <div class="testimonial-author-info">
                        <img src="${card.imageUrl}" alt="${card.author}">
                        <span class="testimonial-author-name">${card.author}</span>
                    </div>
                </div>`);
            
            // --- Секция Bonuses ---
            setContent('#bonuses-title', content.bonuses.title, true);
            generateList('#bonuses-grid', content.bonuses.cards, card => `
                <div class="bonus-card glass-card">
                    <div class="bonus-icon">${card.icon}</div>
                    <h3>${card.title}</h3><p>${card.text}</p>
                </div>`);
                
            // --- Секция Pricing ---
            setContent('#pricing-title', content.pricing.title, true);
            generateList('#pricing-grid', content.pricing.plans, plan => `
                <div class="pricing-card glass-card ${plan.isPopular ? 'popular' : ''}">
                    ${plan.isPopular ? `<div class="popular-badge">${plan.popularText}</div>` : ''}
                    <h3>${plan.name}</h3><div class="price">${plan.price}</div><p class="description">${plan.description}</p>
                    <ul class="features">${plan.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
                    <a href="#" class="cta-button-pricing">${plan.buttonText}</a>
                </div>`);

            // --- Секция FAQ ---
            setContent('#faq-title', content.faq.title, true);
            generateList('#faq-list', content.faq.questions, item => `
                <div class="faq-item">
                    <button class="faq-question">${item.question}</button>
                    <div class="faq-answer"><p>${item.answer}</p></div>
                </div>`);

            // --- Секция Final CTA ---
            setContent('#final-cta-title', content.final_cta.title, true);
            setContent('#final-cta-subtitle', content.final_cta.subtitle);
            setContent('#final-cta-button', content.final_cta.cta, true);
            
            // --- Футер ---
            setContent('#footer', content.footer.copy);

        } catch (error) {
            console.error('Не удалось загрузить или отобразить контент:', error);
        }
    }

    // -----------------------------------------------------------------
    // Раздел III: Инициализация и обработчики событий
    // -----------------------------------------------------------------

    // Сначала загружаем контент, а потом инициализируем все, что от него зависит
    loadContent().then(() => {
        // Анимация появления элементов
        const animatedElements = document.querySelectorAll('.glass-card, .process-step, .faq-item');
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
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });
        document.querySelectorAll('.result-number').forEach(counter => counterObserver.observe(counter));
        
        // Логика для FAQ-аккордеона
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                this.parentElement.classList.toggle('active');
            });
        });
    });

    // --- Общие обработчики, не зависящие от динамического контента ---
    
    // Переменные для общих элементов
    const nav = document.getElementById('navbar');
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinksContainer = document.getElementById('nav-links');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactiveElementsSelector = 'a, button, .faq-question';

    // Логика Бургер-меню
    if (burgerMenu && nav) {
        burgerMenu.addEventListener('click', () => nav.classList.toggle('nav--open'));
    }
    if (navLinksContainer) {
        navLinksContainer.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                nav.classList.remove('nav--open');
            }
        });
    }

    // Логика плавной прокрутки
    document.body.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // Анимация шапки при скролле
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Логика кастомного курсора
    window.addEventListener('mousemove', function(e) {
        const { clientX: posX, clientY: posY } = e;
        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }
        if (cursorOutline) {
            requestAnimationFrame(() => {
                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            });
        }
    });

    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElementsSelector)) cursorOutline.classList.add('grow');
    });
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElementsSelector)) cursorOutline.classList.remove('grow');
    });

    // IX. ЛОГИКА ДЛЯ ИНТЕРФЕЙСА AI-ЧАТА (Фронтенд-часть)
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const messagesContainer = document.getElementById('chat-messages');

    // Функция для добавления нового сообщения в чат
    function addMessage(text, sender) {
        if (!messagesContainer) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        // Прокручиваем вниз к новому сообщению
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleSend() {
        if (!chatInput || !chatInput.value.trim()) return;
        const userMessage = chatInput.value.trim();
        addMessage(userMessage, 'user');
        chatInput.value = '';
        chatInput.focus();

        // Имитируем "думающего" бота и даем шаблонный ответ
        setTimeout(() => {
            addMessage('Это демонстрация интерфейса. Бэкенд с ИИ Gemini еще не подключен.', 'bot');
        }, 1200);
    }
    
    // Инициализация
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
        // Приветственное сообщение при загрузке
        setTimeout(() => {
             addMessage('Здравствуйте! Я — Оракул Академии. Я готов ответить на ваши вопросы о курсе.', 'bot');
        }, 1000);
    }
});