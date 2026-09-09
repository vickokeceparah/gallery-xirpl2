// ========================================
// EFFECTS & MODAL
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- CREATE MODAL ----------
    const modalHTML = `
        <div id="photoModal" class="modal-overlay">
            <div class="modal-container">
                <button class="modal-close" id="modalClose">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-content">
                    <img id="modalImage" src="" alt="Foto" />
                    <div class="modal-info">
                        <h3 id="modalTitle"></h3>
                        <p id="modalDesc"></p>
                        <span id="modalCategory"></span>
                    </div>
                </div>
                <button class="modal-nav modal-prev" id="modalPrev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="modal-nav modal-next" id="modalNext">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCategory = document.getElementById('modalCategory');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');

    let currentPhotos = [];
    let currentIndex = 0;

    // Open modal function (exposed globally)
    window.openModal = function(photo, photosArray) {
        const allPhotos = photosArray || window.galleryData?.photos || [];
        if (allPhotos.length) {
            currentPhotos = allPhotos;
            const index = allPhotos.findIndex(p => p.id === photo.id);
            currentIndex = index >= 0 ? index : 0;
        } else {
            // If no data, just use the photo
            currentPhotos = [photo];
            currentIndex = 0;
        }
        showModal(currentIndex);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function showModal(index) {
        const photo = currentPhotos[index];
        if (!photo) return;

        modalImage.src = photo.image;
        modalImage.alt = photo.title;
        modalTitle.textContent = photo.title;
        modalDesc.textContent = photo.description || 'Momen indah keluarga kami';
        modalCategory.textContent = photo.category || 'Keluarga';

        // Update nav buttons visibility
        if (currentPhotos.length <= 1) {
            modalPrev.style.display = 'none';
            modalNext.style.display = 'none';
        } else {
            modalPrev.style.display = 'flex';
            modalNext.style.display = 'flex';
        }
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    });

    function navigateModal(direction) {
        if (currentPhotos.length <= 1) return;
        currentIndex = (currentIndex + direction + currentPhotos.length) % currentPhotos.length;
        showModal(currentIndex);
    }

    modalPrev.addEventListener('click', () => navigateModal(-1));
    modalNext.addEventListener('click', () => navigateModal(1));

    // ---------- PARALLAX ON SCROLL ----------
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const images = hero.querySelectorAll('.float-img');
                images.forEach((img, i) => {
                    const speed = 0.03 + (i * 0.01);
                    img.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        });
    }

    // ---------- TILT EFFECT ON CARDS ----------
    const cards = document.querySelectorAll('.photo-card, .album-card, .family-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ---------- SMOOTH SCROLL ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---------- MOUSE GLOW ----------
    const glowOrb = document.querySelector('.glow-orb');
    if (glowOrb) {
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth * 100;
            const y = e.clientY / window.innerHeight * 100;
            glowOrb.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(77, 140, 255, 0.2), transparent 70%)`;
        });
    }

    console.log('✨ Efek & Modal siap!');
});

// ========================================
// MODAL STYLES (injected via JS)
// ========================================
(function injectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            padding: 2rem;
        }

        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-container {
            position: relative;
            max-width: 900px;
            width: 100%;
            background: var(--bg-secondary);
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
            transform: scale(0.9);
            transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }

        .modal-overlay.active .modal-container {
            transform: scale(1);
        }

        .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: 0.25s;
        }

        .modal-close:hover {
            background: rgba(255, 70, 70, 0.3);
            border-color: #ff6b6b;
        }

        .modal-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            min-height: 400px;
        }

        .modal-content img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            min-height: 300px;
        }

        .modal-info {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .modal-info h3 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .modal-info p {
            color: var(--text-secondary);
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1rem;
        }

        .modal-info span {
            display: inline-block;
            padding: 0.2rem 1rem;
            border-radius: 40px;
            background: rgba(77, 140, 255, 0.1);
            color: var(--accent);
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            align-self: flex-start;
        }

        .modal-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #fff;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.25s;
            cursor: pointer;
        }

        .modal-nav:hover {
            background: rgba(77, 140, 255, 0.2);
            border-color: var(--accent);
        }

        .modal-prev {
            left: 16px;
        }
        .modal-next {
            right: 16px;
        }

        @media (max-width: 768px) {
            .modal-content {
                grid-template-columns: 1fr;
            }
            .modal-content img {
                min-height: 200px;
                max-height: 300px;
            }
            .modal-info {
                padding: 1.2rem;
            }
            .modal-info h3 {
                font-size: 1.3rem;
            }
            .modal-nav {
                width: 36px;
                height: 36px;
                font-size: 0.9rem;
            }
            .modal-prev {
                left: 8px;
            }
            .modal-next {
                right: 8px;
            }
        }
    `;
    document.head.appendChild(style);
})();