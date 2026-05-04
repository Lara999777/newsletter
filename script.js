/* =====================================================
   앤가네 분식 뉴스레터 뷰어 — Script
   ===================================================== */

// ── Newsletter Data ──
const newsletters = [
    {
        vol: 1,
        date: '2024.05',
        title: '앤가네 분식 창간호',
        desc: '앤비젼 사내 뉴스레터 "앤가네 분식"의 첫 번째 이야기. 우리의 시작을 함께 만나보세요.',
        file: 'pdfs/vol1.pdf',
        size: '2.0 MB',
        color: 'linear-gradient(135deg, #005AA0, #1a7fd4)'
    },
    {
        vol: 2,
        date: '2024.08',
        title: '앤가네 분식 vol.2',
        desc: '여름의 열기와 함께 전해드리는 두 번째 뉴스레터. 앤비젼의 새로운 소식을 만나보세요.',
        file: 'pdfs/vol2.pdf',
        size: '2.0 MB',
        color: 'linear-gradient(135deg, #0d6ebd, #22A7F0)'
    },
    {
        vol: 3,
        date: '2024.11',
        title: '앤가네 분식 vol.3',
        desc: '가을의 정취를 담아 전하는 세 번째 뉴스레터. 풍성한 이야기를 즐겨주세요.',
        file: 'pdfs/vol3.pdf',
        size: '2.3 MB',
        color: 'linear-gradient(135deg, #1565C0, #42A5F5)'
    },
    {
        vol: 4,
        date: '2025.01',
        title: '앤가네 분식 vol.4',
        desc: '새해를 맞아 준비한 네 번째 뉴스레터. 2025년의 앤비젼 이야기를 만나보세요.',
        file: 'pdfs/vol4.pdf',
        size: '2.8 MB',
        color: 'linear-gradient(135deg, #0277BD, #4FC3F7)'
    },
    {
        vol: 5,
        date: '2025.04',
        title: '앤가네 분식 vol.5',
        desc: '봄과 함께 찾아온 다섯 번째 뉴스레터. 앤비젼의 다양한 소식을 전해드립니다.',
        file: 'pdfs/vol5.pdf',
        size: '3.3 MB',
        color: 'linear-gradient(135deg, #00838F, #26C6DA)'
    },
    {
        vol: 6,
        date: '2025.09',
        title: '앤가네 분식 vol.6',
        desc: '초가을의 신선한 바람과 함께 전하는 여섯 번째 뉴스레터.',
        file: 'pdfs/vol6.pdf',
        size: '3.1 MB',
        color: 'linear-gradient(135deg, #00695C, #26A69A)'
    },
    {
        vol: 7,
        date: '2025.11',
        title: '앤가네 분식 vol.7',
        desc: '겨울의 시작을 알리는 일곱 번째 뉴스레터. 따뜻한 이야기로 채워봅니다.',
        file: 'pdfs/vol7.pdf',
        size: '5.8 MB',
        color: 'linear-gradient(135deg, #4527A0, #7E57C2)'
    },
    {
        vol: 8,
        date: '2026.02',
        title: '앤가네 분식 vol.8',
        desc: '2026년 새해 첫 뉴스레터! 최신 앤비젼 소식과 이야기를 만나보세요.',
        file: 'pdfs/vol8.pdf',
        size: '1.5 MB',
        color: 'linear-gradient(135deg, #AD1457, #EC407A)'
    }
];

// Current modal state
let currentVolIndex = -1;

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    setupModal();
    setupScrollEffects();
    setupHeader();
    setupScrollTop();
    hideLoader();
});

// ── Render Newsletter Cards ──
function renderCards() {
    const grid = document.getElementById('newsletter-grid');
    // Show newest first
    const reversed = [...newsletters].reverse();

    reversed.forEach((nl, idx) => {
        const isLatest = idx === 0;
        const card = document.createElement('div');
        card.className = 'newsletter-card';
        card.setAttribute('data-vol', nl.vol);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${nl.title} 열기`);
        card.style.transitionDelay = `${idx * 0.08}s`;

        card.innerHTML = `
            <div class="card-cover">
                <div class="card-cover-gradient" style="background: ${nl.color}">
                    <div class="card-vol-display">
                        <div class="card-vol-number">${String(nl.vol).padStart(2, '0')}</div>
                        <div class="card-vol-label">Volume</div>
                    </div>
                </div>
                <div class="card-cover-overlay">
                    <i class="fas fa-book-open"></i>
                </div>
                ${isLatest ? '<span class="card-latest-badge">LATEST</span>' : ''}
            </div>
            <div class="card-body">
                <div class="card-date"><i class="fas fa-calendar-alt"></i> ${nl.date}</div>
                <div class="card-title">${nl.title}</div>
                <div class="card-desc">${nl.desc}</div>
            </div>
            <div class="card-footer">
                <div class="card-read-btn">
                    읽어보기 <i class="fas fa-arrow-right"></i>
                </div>
                <div class="card-size">${nl.size}</div>
            </div>
        `;

        card.addEventListener('click', () => openModal(nl.vol - 1));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(nl.vol - 1);
            }
        });

        grid.appendChild(card);
    });
}

// ── Modal Logic ──
function setupModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const downloadBtn = document.getElementById('modal-download');

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
    });

    prevBtn.addEventListener('click', () => navigateModal(-1));
    nextBtn.addEventListener('click', () => navigateModal(1));
    downloadBtn.addEventListener('click', downloadCurrentPDF);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!backdrop.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    });
}

function openModal(index) {
    currentVolIndex = index;
    const nl = newsletters[index];
    const backdrop = document.getElementById('modal-backdrop');
    const container = document.getElementById('pdf-render-container');
    const mobileLink = document.getElementById('mobile-download-link');
    const modalBodyScroll = document.getElementById('modal-body-scroll');

    // Update modal header
    document.getElementById('modal-vol-badge').textContent = `vol.${nl.vol}`;
    document.getElementById('modal-title-text').textContent = nl.title;
    document.getElementById('modal-date-text').textContent = nl.date;

    // Load PDF via pdf.js
    renderPDF(nl.file);
    if (mobileLink) {
        mobileLink.href = nl.file;
        mobileLink.download = `앤가네분식_vol${nl.vol}.pdf`;
    }

    // Update navigation
    updateModalNav();
    updateModalDots();

    // Show modal
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const container = document.getElementById('pdf-render-container');

    backdrop.classList.remove('active');
    document.body.style.overflow = '';

    // Clear PDF after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 400);
    currentVolIndex = -1;
}

// ── PDF.js Rendering ──
async function renderPDF(url) {
    const container = document.getElementById('pdf-render-container');
    const loader = document.getElementById('pdf-loader');
    const scrollBox = document.getElementById('modal-body-scroll');
    
    // Init state
    container.innerHTML = '';
    loader.style.display = 'flex';
    if (scrollBox) scrollBox.scrollTop = 0;

    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            
            // Set scale for high quality rendering (2.0 = double resolution)
            const viewport = page.getViewport({ scale: 2.0 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            container.appendChild(canvas);

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
        }
    } catch (err) {
        console.error('Error rendering PDF:', err);
        container.innerHTML = '<div style="color:white; padding:40px;">PDF를 불러오는 중 오류가 발생했습니다. 다운로드 버튼을 이용해 주세요.</div>';
    } finally {
        loader.style.display = 'none';
    }
}

function navigateModal(direction) {
    const newIndex = currentVolIndex + direction;
    if (newIndex < 0 || newIndex >= newsletters.length) return;
    openModal(newIndex);
}

function updateModalNav() {
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    prevBtn.disabled = currentVolIndex <= 0;
    nextBtn.disabled = currentVolIndex >= newsletters.length - 1;
}

function updateModalDots() {
    const dotsContainer = document.getElementById('modal-dots');
    dotsContainer.innerHTML = '';

    newsletters.forEach((nl, idx) => {
        const dot = document.createElement('button');
        dot.className = `modal-page-dot${idx === currentVolIndex ? ' active' : ''}`;
        dot.setAttribute('aria-label', `vol.${nl.vol}`);
        dot.addEventListener('click', () => openModal(idx));
        dotsContainer.appendChild(dot);
    });
}

function downloadCurrentPDF() {
    if (currentVolIndex < 0) return;
    const nl = newsletters[currentVolIndex];
    const link = document.createElement('a');
    link.href = nl.file;
    link.download = `앤가네분식_vol${nl.vol}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ── Scroll Reveal Animation ──
function setupScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    // Observe cards after a small delay to ensure they're rendered
    setTimeout(() => {
        document.querySelectorAll('.newsletter-card').forEach(card => {
            observer.observe(card);
        });
    }, 100);
}

// ── Header Scroll Effect ──
function setupHeader() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// ── Scroll to Top Button ──
function setupScrollTop() {
    const btn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Page Loader ──
function hideLoader() {
    setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('hidden');
    }, 600);
}
