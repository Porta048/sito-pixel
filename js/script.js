// Gestisce lo scorrimento fluido quando si fa clic su un link che punta a un'ancora (#)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Impedisce il comportamento predefinito del link (salto brusco)
        e.preventDefault();

        // Trova l'elemento di destinazione usando l'attributo href del link
        const target = document.querySelector(this.getAttribute('href'));

        // Se l'elemento di destinazione esiste, scorri dolcemente fino a esso
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth', // Animazione di scorrimento fluida
                block: 'start'      // Allinea la parte superiore dell'elemento con la parte superiore della finestra
            });
        }
    });
});

// Funzione per creare un effetto di scrittura a macchina (typewriter)
function typeWriter(element, text, speed = 100) {
    let i = 0; // Inizializza il contatore dei caratteri
    element.textContent = ''; // Svuota il contenuto iniziale dell'elemento

    // Funzione interna che scrive un carattere alla volta
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i); // Aggiunge il carattere corrente
            i++;
            // Richiama se stessa dopo un breve ritardo (velocità di scrittura)
            setTimeout(type, speed);
        }
    }

    // Avvia l'effetto di scrittura
    type();
}

// Aggiunge un'animazione al pulsante "START GAME" quando viene cliccato
const startBtn = document.getElementById('startBtn'); // Seleziona il pulsante tramite il suo ID
if (startBtn) { // Controlla se il pulsante esiste prima di aggiungere l'evento
    startBtn.addEventListener('click', function() {
        // Rimpicciolisce leggermente il pulsante per dare un feedback visivo
        this.style.transform = 'scale(0.95)';
        
        // Dopo 100 millisecondi, riporta il pulsante alla sua dimensione originale
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            // Mostra un avviso per simulare l'inizio del gioco
            alert('Game Starting... 🎮');
        }, 100);
    });
}

// Crea un leggero effetto di parallasse per lo sfondo della sezione Hero durante lo scorrimento
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset; // Ottiene la quantità di pixel scrollati verticalmente
    const parallax = document.querySelector('.hero'); // Seleziona la sezione Hero
    
    // Sposta la posizione verticale dello sfondo a una velocità inferiore rispetto allo scorrimento
    if (parallax) {
        parallax.style.backgroundPositionY = scrolled * 0.5 + 'px'; // Il valore 0.5 determina l'intensità dell'effetto
    }
});

// Utilizza l'Intersection Observer per animare le card quando diventano visibili
const observerOptions = {
    threshold: 0.1, // L'animazione si attiva quando almeno il 10% della card è visibile
    rootMargin: '0px 0px -100px 0px' // Restringe l'area di osservazione, attivando l'animazione un po' prima che la card entri completamente nella vista
};

// Crea un nuovo observer
const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        // Se l'elemento sta entrando nell'area di osservazione
        if (entry.isIntersecting) {
            // Applica l'animazione e rende l'elemento visibile
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards'; // 'forwards' mantiene lo stato finale dell'animazione
            entry.target.style.opacity = '1';
            // Smette di osservare l'elemento una volta che l'animazione è stata attivata
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Seleziona tutte le card da animare e le osserva
document.querySelectorAll('.game-card, .character-card').forEach(card => {
    card.style.opacity = '0'; // Imposta l'opacità iniziale a 0 per nasconderle
    observer.observe(card);
});

// Inietta dinamicamente nel DOM le regole CSS per l'animazione 'fadeInUp'
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px); /* Parte da una posizione più bassa */
        }
        to {
            opacity: 1;
            transform: translateY(0); /* Ritorna alla sua posizione originale */
        }
    }
`;
document.head.appendChild(style); // Aggiunge le regole CSS all'head del documento

// Funzione (opzionale) per generare un semplice suono in stile 8-bit usando la Web Audio API
function playPixelSound() {
    // Crea un contesto audio (compatibile con vari browser)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Crea un oscillatore per generare l'onda sonora
    const oscillator = audioContext.createOscillator();
    // Crea un nodo di guadagno per controllare il volume
    const gainNode = audioContext.createGain();

    // Collega l'oscillatore al guadagno e il guadagno all'output audio
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Imposta le proprietà del suono
    oscillator.type = 'square'; // Onda quadra, tipica dei suoni retro
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Frequenza iniziale
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1); // Aumenta la frequenza rapidamente

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume iniziale
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Diminuisce il volume rapidamente (effetto "beep")

    // Avvia e interrompe il suono
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Aggiunge l'effetto sonoro al click di vari elementi interattivi
document.querySelectorAll('.nes-btn, .character-card, .game-card').forEach(element => {
    element.addEventListener('click', playPixelSound);
});