$(document).ready(function() {

    // =================================================================
    // 1. GESTION DU HEADER (BARRE DE NAVIGATION) AU DÉFILEMENT
    // =================================================================
    $(window).on('scroll', function() {
        // Si on a défilé de plus de 50 pixels, on ajoute une classe à la navbar
        if ($(window).scrollTop() > 50) {
            $('#mainNav').addClass('navbar-scrolled');
        } else {
            // Sinon, on retire la classe pour la rendre transparente à nouveau
            $('#mainNav').removeClass('navbar-scrolled');
        }
    });


    // =================================================================
    // 2. LOGIQUE POUR LES CARTES DE MAISONS PROGRESSIVES
    // =================================================================
    // Pour chaque carte, on crée dynamiquement sa timeline pour éviter la répétition dans le HTML
    $('.house-card-pro').each(function() {
        const timelineHTML = `
            <div class="timeline-line"></div>
            <div class="timeline-step">
                <div class="timeline-dot active" data-target-stage="plan"></div>
                <div class="timeline-label">Plan</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-dot" data-target-stage="chantier"></div>
                <div class="timeline-label">Chantier</div>
            </div>
            <div class="timeline-step">
                <div class="timeline-dot" data-target-stage="finie"></div>
                <div class="timeline-label">Fini</div>
            </div>
        `;
        $(this).find('.card-timeline').html(timelineHTML);
    });

    // On attache l'événement click aux points de la timeline
    // On utilise 'body' pour la délégation d'événements, ce qui assure que ça fonctionne pour les éléments ajoutés dynamiquement
    $('body').on('click', '.timeline-dot', function() {
        let $dot = $(this);
        // On ne fait rien si le point est déjà actif pour éviter des actions inutiles
        if ($dot.hasClass('active')) {
            return;
        }

        // On récupère l'étape cible depuis l'attribut data (ex: "plan", "chantier", "finie")
        let targetStage = $dot.data('target-stage');
        // On trouve la carte parente la plus proche
        let $card = $dot.closest('.house-card-pro');

        // On gère les classes 'active' pour les points de la timeline
        $card.find('.timeline-dot').removeClass('active');
        $dot.addClass('active');

        // On gère les classes 'active' pour les images pour afficher la bonne
        $card.find('.house-image').removeClass('active');
        $card.find('.house-image.' + targetStage).addClass('active');
    });


    // =================================================================
    // 3. CARROUSEL DE TÉMOIGNAGES 3D (VERSION FINALE CORRIGÉE)
    // =================================================================
    const carousel = $('#testimonial-carousel');

    // On s'assure que le carrousel existe sur la page avant d'exécuter le code pour éviter les erreurs
    if (carousel.length) {
        const cards = $('.testimonial-card-3d');
        const cardCount = cards.length;
        let angle = 0;
        const rotationAngle = 360 / cardCount;

        // Fonction pour positionner initialement les cartes en cercle 3D
        function setupCarousel() {
            cards.each(function(i) {
                const currentAngle = i * rotationAngle;
                // On positionne chaque carte en la tournant sur l'axe Y et en la poussant vers l'extérieur
                $(this).css('transform', `rotateY(${currentAngle}deg) translateZ(350px)`);
            });
            updateActiveCard();
        }

        // Fonction pour mettre en évidence la carte qui est face à l'utilisateur
        function updateActiveCard() {
            // Logique de calcul de l'index fiabilisée pour trouver la carte active
            // L'astuce `+ cardCount) % cardCount` garantit un résultat positif dans la bonne plage d'index
            const activeIndex = (Math.round(-angle / rotationAngle) % cardCount + cardCount) % cardCount;

            cards.removeClass('active');
            $(cards[activeIndex]).addClass('active');
        }

        // Événement pour le bouton "Suivant"
        $('#next-testimonial').on('click', function() {
            angle -= rotationAngle; // On tourne le carrousel dans un sens
            carousel.css('transform', `rotateY(${angle}deg)`);
            updateActiveCard();
        });

        // Événement pour le bouton "Précédent"
        $('#prev-testimonial').on('click', function() {
            angle += rotationAngle; // On tourne le carrousel dans l'autre sens
            carousel.css('transform', `rotateY(${angle}deg)`);
            updateActiveCard();
        });

        // On lance la configuration initiale du carrousel
        setupCarousel();
    }

    // =================================================================
    // 4. ANIMATION PROGRESSIVE DES SECTIONS AU DÉFILEMENT
    // =================================================================
    
    // On sélectionne toutes les sections qui ont notre classe "cachée"
    const sectionsToAnimate = document.querySelectorAll('.section-hidden');

    // On crée un "observateur"
    const observer = new IntersectionObserver((entries) => {
        // Pour chaque section "observée"...
        entries.forEach(entry => {
            // Si la section entre dans le champ de vision...
            if (entry.isIntersecting) {
                // On remplace la classe "cachée" par la classe "visible"
                entry.target.classList.add('section-visible');
                entry.target.classList.remove('section-hidden');
                
                // On arrête d'observer cette section pour que l'animation ne se répète pas
                observer.unobserve(entry.target);
            }
        });
    }, {
        // L'animation se déclenchera quand 15% de la section sera visible
        threshold: 0.15 
    });

    // On dit à notre observateur de "surveiller" chacune de nos sections
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // =================================================================
    // 5. LOGIQUE POUR LES FILTRES ANIMÉS DE LA PAGE PROGRAMMES
    // =================================================================
    $('.filter-btn').on('click', function() {
        // Gérer le style du bouton actif
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        // Obtenir la catégorie du filtre
        const filterValue = $(this).data('filter');
        
        $('.programme-item').each(function() {
            const itemCategory = $(this).data('category');

            // Si "Tous" est sélectionné ou si la catégorie correspond
            if (filterValue === 'all' || itemCategory === filterValue) {
                $(this).removeClass('hide'); // Afficher l'élément
            } else {
                $(this).addClass('hide'); // Cacher l'élément
            }
        });
    });

     // =================================================================
    // 6. ANIMATION POUR LA TIMELINE DE LA PAGE SAVOIR-FAIRE
    // =================================================================
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5 // L'animation se déclenche quand 50% de l'étape est visible
        });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }
    
     // 7. VALIDATION DU FORMULAIRE DE CONTACT
    // =================================================================
    // Récupère toutes les formes auxquelles nous voulons appliquer des styles de validation Bootstrap personnalisés
    var forms = document.querySelectorAll('.needs-validation');

    // Boucle sur eux et empêche la soumission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });

    // =================================================================
    // 8. INITIALISATION DU CALENDRIER (FLATPICKR) DANS LE POPUP
    // =================================================================
    flatpickr("#datepicker", {
        "locale": "fr", // On utilise la traduction française
        altInput: true, // Crée un second champ visible plus lisible pour l'utilisateur
        altFormat: "j F Y", // Format lisible : 31 Juillet 2025
        dateFormat: "Y-m-d", // Format pour l'envoi des données
        minDate: "today", // On ne peut pas choisir une date passée
        "disable": [
            function(date) {
                // Bloque les Samedis (6) et Dimanches (0)
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
    });

    // =================================================================
    // 9. LOGIQUE POUR LE CURSEUR PERSONNALISÉ
    // =================================================================
    const cursor = $('.custom-cursor');

    $(window).on('mousemove', function(e) {
        cursor.css({
            top: e.clientY + 'px',
            left: e.clientX + 'px'
        });
    });

    $('a, button, .timeline-dot, .testimonial-nav').on('mouseenter', function() {
        cursor.addClass('hover-effect');
    }).on('mouseleave', function() {
        cursor.removeClass('hover-effect');
    });

    // 10. DÉCLENCHEMENT DE L'ANIMATION D'ENTRÉE DE LA NAVBAR
    // =================================================================
    // On vérifie qu'on est bien sur la page d'accueil
    if ($('#hero-carousel').length) {
        // On attend 500ms après le chargement du document pour démarrer l'animation
        setTimeout(function() {
            $('#mainNav').addClass('animation-started');
        }, 500);
    }
    

}); // Fin de $(document).ready()

// Ce code doit être en dehors du $(document).ready()
// car on utilise l'événement "load" de la fenêtre
$(window).on('load', function() {
    // On attend que toutes les images et ressources soient chargées
    $('#preloader').addClass('hidden');
});