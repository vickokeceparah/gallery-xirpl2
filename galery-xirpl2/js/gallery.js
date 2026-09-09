// ========================================
// GALLERY DATA & RENDER
// ========================================

// Data photo (akan digabung dengan gallery-data.js)
// Pastikan gallery-data.js di-load sebelum file ini

// Render Gallery
function renderGallery(photos) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    photos.forEach((photo, index) => {
        const card = document.createElement('div');
        card.className = `photo-card fade-in fade-in-d${(index % 5) + 1}`;
        card.setAttribute('data-category', photo.category);

        card.innerHTML = `
            <img class="photo-img" src="${photo.image}" alt="${photo.title}" loading="lazy" />
            <span class="photo-tag">${photo.category}</span>
            <div class="photo-overlay">
                <div class="photo-info">
                    <h4><i class="fas fa-${photo.icon || 'camera'}"></i> ${photo.title}</h4>
                    <p>${photo.description}</p>
                </div>
            </div>
        `;

        // Click handler untuk modal (akan diimplementasikan di effects.js)
        card.addEventListener('click', () => {
            if (window.openModal) {
                window.openModal(photo);
            }
        });

        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

// Render Albums
function renderAlbums(albums) {
    const grid = document.getElementById('albumsGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    albums.forEach((album, index) => {
        const card = document.createElement('div');
        card.className = `album-card fade-in fade-in-d${(index % 4) + 1}`;

        card.innerHTML = `
            <img class="album-cover" src="${album.cover}" alt="${album.title}" loading="lazy" />
            <span class="album-count">${album.count} foto</span>
            <div class="album-body">
                <h4>${album.title}</h4>
                <p>${album.description}</p>
            </div>
        `;

        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

// Render Timeline
function renderTimeline(moments) {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    const fragment = document.createDocumentFragment();

    moments.forEach((moment, index) => {
        const item = document.createElement('div');
        item.className = `timeline-item fade-in fade-in-d${(index % 4) + 1}`;

        item.innerHTML = `
            <div class="timeline-year">${moment.year}</div>
            <div class="timeline-title">${moment.title}</div>
            <div class="timeline-desc">${moment.description}</div>
        `;

        fragment.appendChild(item);
    });

    timeline.appendChild(fragment);
}

// Render Family Members
function renderFamily(members) {
    const grid = document.getElementById('familyGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    members.forEach((member, index) => {
        const card = document.createElement('div');
        card.className = `family-card fade-in fade-in-d${(index % 4) + 1}`;

        card.innerHTML = `
            <img class="family-avatar" src="${member.avatar}" alt="${member.name}" loading="lazy" />
            <h4>${member.name}</h4>
            <span class="family-role">${member.role}</span>
            <p>${member.bio || ''}</p>
        `;

        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

// Filter Gallery
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('galleryGrid');
    if (!filterBtns.length || !grid) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            const cards = grid.querySelectorAll('.photo-card');

            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                    card.style.animation = 'scaleIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Load More
function setupLoadMore() {
    const loadBtn = document.getElementById('loadMoreBtn');
    const grid = document.getElementById('galleryGrid');
    if (!loadBtn || !grid) return;

    let currentCount = 12;
    const totalPhotos = window.galleryData ? window.galleryData.photos.length : 24;

    loadBtn.addEventListener('click', function() {
        const hiddenCards = grid.querySelectorAll('.photo-card[style*="display: none"]');
        const hiddenCount = hiddenCards.length;

        if (hiddenCount > 0) {
            let showCount = Math.min(6, hiddenCount);
            let shown = 0;
            hiddenCards.forEach(card => {
                if (shown < showCount) {
                    card.style.display = '';
                    card.style.animation = 'scaleIn 0.4s ease forwards';
                    shown++;
                }
            });
            currentCount += showCount;
        }

        if (currentCount >= totalPhotos) {
            loadBtn.style.opacity = '0.3';
            loadBtn.style.pointerEvents = 'none';
            loadBtn.innerHTML = '<i class="fas fa-check"></i> Semua foto dimuat';
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Data from gallery-data.js
    if (window.galleryData) {
        const data = window.galleryData;

        if (data.photos) renderGallery(data.photos);
        if (data.albums) renderAlbums(data.albums);
        if (data.timeline) renderTimeline(data.timeline);
        if (data.family) renderFamily(data.family);

        setupFilters();
        setupLoadMore();
    } else {
        console.warn('Gallery data not found. Using fallback data.');
        // Fallback: generate dummy data
        generateFallbackData();
    }
});

// Fallback jika data tidak ditemukan
function generateFallbackData() {
    const dummyPhotos = [];
    const categories = ['liburan', 'keluarga', 'acara', 'hobi', 'kuliner'];
    const titles = ['Liburan Seru', 'Kebersamaan', 'Momen Bahagia', 'Hobi Menyenangkan', 'Makan Enak', 'Petualangan', 'Santai', 'Tradisi'];

    for (let i = 1; i <= 18; i++) {
        const cat = categories[i % categories.length];
        dummyPhotos.push({
            id: i,
            title: titles[i % titles.length] + ` ${i}`,
            description: `Momen indah keluarga #${i}`,
            image: `https://picsum.photos/400/400?random=${i + 200}`,
            category: cat,
            icon: 'camera'
        });
    }

    renderGallery(dummyPhotos);
    setupFilters();
    setupLoadMore();
}