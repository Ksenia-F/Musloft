/**
 * @param {string} sliderSelector 
 * @param {string} slideSelector 
 * @param {string} prevButtonSelector 
 * @param {string} nextButtonSelector
 */
function initSimpleSlider(sliderSelector, slideSelector, prevButtonSelector, nextButtonSelector) {
    if (window.innerWidth <= 461) {
        return;
    }

    const slider = document.querySelector(sliderSelector);
    const slides = document.querySelectorAll(slideSelector);
    const prevBtn = document.querySelector(prevButtonSelector);
    const nextBtn = document.querySelector(nextButtonSelector);

    if (!slider || !prevBtn || !nextBtn || slides.length === 0) {
        console.log('Не найдены элементы для слайдера:', { sliderSelector, slides: slides.length });
        return;
    }

    let currentIndex = 0;
    const gap = 40;

    let slidesContainer = slider.querySelector('.slides-container');
    if (!slidesContainer) {
        slidesContainer = document.createElement('div');
        slidesContainer.className = 'slides-container';
        slides.forEach(slide => slidesContainer.appendChild(slide.cloneNode(true)));
        slider.innerHTML = '';
        slider.appendChild(slidesContainer);
    }

    const currentSlides = slidesContainer.querySelectorAll(slideSelector);

    slidesContainer.style.display = 'flex';
    slidesContainer.style.gap = `${gap}px`;
    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    slider.style.overflow = 'hidden';

    function getSettings() {
        const width = window.innerWidth;
        if (width <= 450) return { visible: 1, scroll: 1 };
        if (width <= 1189) return { visible: 2, scroll: 2 };
        return { visible: 3, scroll: 3 };
    }

    function updateSlider() {
        const { visible, scroll } = getSettings();

        if (currentSlides.length === 0 || !currentSlides[0].offsetWidth) {
            setTimeout(updateSlider, 100);
            return;
        }

        const slideWidth = currentSlides[0].offsetWidth;

        const maxIndex = Math.max(0, currentSlides.length - visible);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        const translateX = -currentIndex * (slideWidth + gap);
        slidesContainer.style.transform = `translateX(${translateX}px)`;

        const canPrev = currentIndex > 0;
        const canNext = currentIndex < currentSlides.length - visible;

        setButtonActive(prevBtn, canPrev);
        setButtonActive(nextBtn, canNext);
    }

    function setButtonActive(button, isActive) {
        const circle = button.querySelector('circle');
        const path = button.querySelector('path');
        if (circle && path) {
            if (isActive) {
                circle.style.stroke = '#5299F6';
                path.style.stroke = '#5299F6';
                button.style.opacity = '1';
                button.style.pointerEvents = 'all';
            } else {
                circle.style.stroke = '#272727';
                path.style.stroke = '#262626';
                button.style.opacity = '0.5';
                button.style.pointerEvents = 'none';
            }
        }
    }

    prevBtn.addEventListener('click', () => {
        const { scroll } = getSettings();
        currentIndex = Math.max(0, currentIndex - scroll);
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        const { visible, scroll } = getSettings();
        currentIndex = Math.min(currentSlides.length - visible, currentIndex + scroll);
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);

    setTimeout(updateSlider, 100);
}

function initTeamSlider() {
    const teamBox = document.querySelector('.team_box');
    const teamCards = document.querySelectorAll('.team_card');
    const prevButton2 = document.querySelector('.love_artist .button_slide_1');
    const nextButton2 = document.querySelector('.love_artist .button_slide_2');

    if (!teamBox || !prevButton2 || !nextButton2 || teamCards.length === 0) {
        console.log('Элементы слайдера команды не найдены');
        return;
    }

    let currentIndex = 0;
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'team-slides-container';
    teamCards.forEach(card => {
        if (card.parentNode === teamBox) {
            slidesContainer.appendChild(card);
        }
    });

    teamBox.innerHTML = '';
    teamBox.appendChild(slidesContainer);

    const currentTeamCards = slidesContainer.querySelectorAll('.team_card');
    function getComputedGap() {
        if (currentTeamCards.length < 2) return 0;
        const rect1 = currentTeamCards[0].getBoundingClientRect();
        const rect2 = currentTeamCards[1].getBoundingClientRect();
        return rect2.left - rect1.right;
    }

    function updateSlider() {
        if (currentTeamCards.length === 0 || !currentTeamCards[0].offsetWidth) {
            setTimeout(updateSlider, 100);
            return;
        }

        const gap = getComputedGap();
        const cardWidth = currentTeamCards[0].offsetWidth;

        let visibleCards, cardsToScroll;
        const width = window.innerWidth;

        if (width <= 450) {
            visibleCards = 1;
            cardsToScroll = 1;
        } else if (width < 1190) {
            visibleCards = 3;
            cardsToScroll = 3;
        } else {
            visibleCards = 4;
            cardsToScroll = 4;
        }

        const maxIndex = Math.max(0, currentTeamCards.length - visibleCards);
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        const translateX = -currentIndex * (cardWidth + gap);
        slidesContainer.style.transform = `translateX(${translateX}px)`;

        slidesContainer.style.display = 'flex';
        slidesContainer.style.gap = `${gap}px`;
        slidesContainer.style.transition = 'transform 0.5s ease-in-out';
        teamBox.style.overflow = 'hidden';

        updateButtonsColor(visibleCards, cardsToScroll);
    }

    function updateButtonsColor(visibleCards, cardsToScroll) {
        const canPrev = currentIndex > 0;
        const canNext = currentIndex < currentTeamCards.length - visibleCards;
        setButtonActive(prevButton2, canPrev);
        setButtonActive(nextButton2, canNext);
    }

    prevButton2.addEventListener('click', () => {
        const width = window.innerWidth;
        const scroll = width <= 450 ? 1 : width < 1190 ? 3 : 4;
        currentIndex = Math.max(0, currentIndex - scroll);
        updateSlider();
    });

    nextButton2.addEventListener('click', () => {
        const width = window.innerWidth;
        const visible = width <= 450 ? 1 : width < 1190 ? 3 : 4;
        const scroll = width <= 450 ? 1 : width < 1190 ? 3 : 4;
        currentIndex = Math.min(currentTeamCards.length - visible, currentIndex + scroll);
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 100);
}

function initNewsSlider() {
    const slider = document.querySelector('.slider_news_acc');
    const slides = document.querySelectorAll('.slide_box_new');
    const prevBtn = document.querySelector('.prev_news_slider');
    const nextBtn = document.querySelector('.next_news_slider');

    if (!slider || !prevBtn || !nextBtn || slides.length === 0) {
        console.log('Элементы слайдера новинок не найдены');
        return;
    }

    let gap = 59;

    if (window.innerWidth < 1100) {
        gap = 43;
    }

    let currentIndex = 0;

    let slidesContainer = slider.querySelector('.slides-container-news');
    if (!slidesContainer) {
        slidesContainer = document.createElement('div');
        slidesContainer.className = 'slides-container-news';

        slides.forEach(slide => {
            if (slide.parentNode === slider) {
                slidesContainer.appendChild(slide);
            }
        });

        slider.insertBefore(slidesContainer, slider.firstChild);
    }

    const currentSlides = slidesContainer.querySelectorAll('.slide_box_new');

    function getSettings() {
        const width = window.innerWidth;
        if (width < 768) return { visible: 2, scroll: 2 };
        if (width < 1024) return { visible: 4, scroll: 4 };
        if (width < 1200) return { visible: 4, scroll: 4 };
        return { visible: 5, scroll: 5 };
    }

    function updateSlider() {
        if (currentSlides.length === 0 || !currentSlides[0].offsetWidth) {
            setTimeout(updateSlider, 100);
            return;
        }

        const { visible, scroll } = getSettings();
        const slideWidth = currentSlides[0].offsetWidth;
        const maxIndex = Math.max(0, currentSlides.length - visible);

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        const translateX = -currentIndex * (slideWidth + gap);
        slidesContainer.style.transform = `translateX(${translateX}px)`;

        setButtonActive(prevBtn, currentIndex > 0);
        setButtonActive(nextBtn, currentIndex < currentSlides.length - visible);
    }

    prevBtn.addEventListener('click', () => {
        const { scroll } = getSettings();
        currentIndex = Math.max(0, currentIndex - scroll);
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        const { visible, scroll } = getSettings();
        currentIndex = Math.min(currentSlides.length - visible, currentIndex + scroll);
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 100);
}

function setButtonActive(button, isActive) {
    const circle = button.querySelector('circle');
    const path = button.querySelector('path');
    if (circle && path) {
        if (isActive) {
            circle.style.stroke = '#5299F6';
            path.style.stroke = '#5299F6';
            button.style.opacity = '1';
            button.style.pointerEvents = 'all';
        } else {
            circle.style.stroke = '#272727';
            path.style.stroke = '#262626';
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';
        }
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function openModal(modal) {
    if (!modal) return;

    if (modal.id === 'modal_rev') {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'flex';
    }

    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function initLyricsModal() {
    const lyricsModal = document.getElementById('lyricsModal');
    const closeLyricsBtn = document.getElementById('closeLyricsBtn');
    const lyricsBtn = document.getElementById('lyricsBtn');

    if (!lyricsModal || !closeLyricsBtn) {
        console.log('Элементы модального окна текста песни не найдены');
        return;
    }

    function openLyricsModal() {
        lyricsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const audio = document.getElementById('audioElement');
        if (audio) {
            window.wasPlaying = !audio.paused;
        }
    }

    function closeLyricsModal() {
        lyricsModal.style.display = 'none';
        document.body.style.overflow = '';

        const audio = document.getElementById('audioElement');
        if (audio && window.wasPlaying && audio.paused) {
            audio.play().catch(e => console.log('Ошибка восстановления воспроизведения:', e));
        }
    }

    if (lyricsBtn) {
        lyricsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLyricsModal();
        });
    }

    closeLyricsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeLyricsModal();
    });

    lyricsModal.addEventListener('click', (e) => {
        if (e.target === lyricsModal) {
            closeLyricsModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lyricsModal.style.display === 'flex') {
            closeLyricsModal();
        }
    });

    const modalContent = lyricsModal.querySelector('.lyrics_modal_content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

function initPlayer() {
    const audio = document.getElementById('audioElement');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volumeBar');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');

    if (!audio || !playPauseBtn) {
        console.log('Элементы плеера не найдены');
        return;
    }

    function updatePlayerUI() {
        const trackTitle = document.getElementById('trackTitle');
        const trackCover = document.getElementById('trackCover');

        if (trackTitle && trackCover) {
            console.log('Плеер инициализирован с треком:', trackTitle.textContent);
        }
    }

    playPauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (audio.paused) {
            audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
            playPauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/></svg>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="white" /></svg>';
        }
    });

    if (progressBar) {
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100 || 0;
            progressBar.value = percent;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {
            if (durationEl) durationEl.textContent = formatTime(audio.duration);
        });

        progressBar.addEventListener('input', (e) => {
            e.stopPropagation();
            const time = (progressBar.value / 100) * audio.duration;
            audio.currentTime = time;
        });
    }

    if (volumeBar) {
        volumeBar.addEventListener('input', (e) => {
            e.stopPropagation();
            audio.volume = volumeBar.value / 100;
        });
    }

    if (likeBtn && dislikeBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            likeBtn.classList.toggle('active');
            if (dislikeBtn.classList.contains('active')) {
                dislikeBtn.classList.remove('active');
            }
        });

        dislikeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dislikeBtn.classList.toggle('active');
            if (likeBtn.classList.contains('active')) {
                likeBtn.classList.remove('active');
            }
        });
    }

    updatePlayerUI();
}

function initModals() {
    const modal = document.getElementById('modal_rev');
    const modalBody = document.querySelector('.modal_body_rev');
    const closeBtn = document.querySelector('.close_rev');

    if (modal && modalBody && closeBtn) {
        document.querySelectorAll('.read_more_rev').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = button.closest('.card_reviwes');
                const fullText = card.querySelector('.full_text_rev')?.innerHTML || '';
                modalBody.innerHTML = fullText;
                openModal(modal);
            });
        });

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(modal);
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    }

    const giftModal = document.getElementById('giftModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (giftModal) {
        document.querySelectorAll('.giftButton').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(giftModal);
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(giftModal);
            });
        }

        giftModal.addEventListener('click', (e) => {
            if (e.target === giftModal) {
                closeModal(giftModal);
            }
        });
    }

    const addTrackModal = document.getElementById('addTrackModal');
    if (addTrackModal) {
        document.querySelectorAll('.add_content').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(addTrackModal);
            });
        });

        addTrackModal.addEventListener('click', (e) => {
            if (e.target === addTrackModal) {
                closeModal(addTrackModal);
            }
        });

        addTrackModal.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(addTrackModal);
            });
        });
    }

    const editTextModal = document.getElementById('editTextModal');
    if (editTextModal) {
        document.querySelectorAll('.button_mytext_edit').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(editTextModal);
            });
        });

        editTextModal.addEventListener('click', (e) => {
            if (e.target === editTextModal) {
                closeModal(editTextModal);
            }
        });

        editTextModal.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(editTextModal);
            });
        });
    }

    const deleteTrackModal = document.getElementById('deleteTrackModal');
    if (deleteTrackModal) {
        document.querySelectorAll('.delete_track').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(deleteTrackModal);
            });
        });

        const cancelBtn = deleteTrackModal.querySelector('.cancel_btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(deleteTrackModal);
            });
        }

        deleteTrackModal.addEventListener('click', (e) => {
            if (e.target === deleteTrackModal) {
                closeModal(deleteTrackModal);
            }
        });

        deleteTrackModal.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal(deleteTrackModal);
            });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = [
                document.getElementById('modal_rev'),
                document.getElementById('giftModal'),
                document.getElementById('lyricsModal'),
                document.getElementById('addTrackModal'),
                document.getElementById('editTextModal'),
                document.getElementById('deleteTrackModal')
            ].filter(Boolean);

            for (const modal of modals) {
                if (modal.style.display === 'block' || modal.style.display === 'flex') {
                    closeModal(modal);
                    break;
                }
            }
        }
    });
}

document.querySelectorAll('.buttons_creativiti').forEach(container => {
    container.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

function initAll() {
    console.log('Инициализация приложения...');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeComponents, 100);
        });
    } else {
        setTimeout(initializeComponents, 100);
    }
}

function initializeComponents() {
    console.log('Инициализация компонентов...');

    if (window.innerWidth > 461) {
        initSimpleSlider('.slider_new', '.slide_new', '.button_slide_1', '.button_slide_2');
    }
    initSimpleSlider('.reviwes .reviwes_cat', '.reviwes .card_reviwes', '.reviwes .button_slide_1', '.reviwes .button_slide_2');
    initNewsSlider();
    initTeamSlider();

    initModals();
    initLyricsModal();

    initPlayer();

    initArtistPlayButton();
    initArtistTabs();
}

// === 1. Воспроизведение трека по кнопке .play_artist ===
function initArtistPlayButton() {
    const playArtistBtn = document.querySelector('.play_artist');
    const firstTrack = document.querySelector('.box_1_charts .item_charts');

    if (!playArtistBtn || !firstTrack) return;

    const artistName = firstTrack.getAttribute('data-artist');
    const trackSrc = firstTrack.getAttribute('data-src');
    const trackTitle = firstTrack.getAttribute('data-title') || 'Без названия';
    const trackCover = firstTrack.getAttribute('data-cover') || '';
    const trackDuration = firstTrack.getAttribute('data-duration') || '0:00';

    playArtistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!trackSrc) return;

        const audioElement = document.getElementById('audioElement');
        if (!audioElement) return;

        document.getElementById('trackTitle').textContent = trackTitle;
        document.getElementById('trackArtist').textContent = artistName;
        document.getElementById('trackCover').src = trackCover;
        document.getElementById('duration').textContent = trackDuration;
        document.getElementById('lyricsTitle').textContent = trackTitle;

        audioElement.src = trackSrc;
        audioElement.play().catch(err => console.log('Ошибка воспроизведения:', err));

        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="4" width="4" height="16" fill="#ffffff"/>
                        <rect x="14" y="4" width="4" height="16" fill="#ffffff"/>
                    </svg>
                `;
        }
    });
}


function initArtistTabs() {
    const tabs = document.querySelectorAll('.tabs span');
    if (tabs.length < 2) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tracks1 = document.querySelector('.artist_card_traks_1');
            const tracks2 = document.querySelector('.artist_card_traks_2');

            if (tracks1) tracks1.style.display = 'none';
            if (tracks2) tracks2.style.display = 'none';

            const tabType = tab.getAttribute('data-tab');
            if (tabType === 'popular' && tracks1) {
                tracks1.style.display = 'flex';
            } else if (tabType === 'all' && tracks2) {
                tracks2.style.display = 'flex';
            }
        });
    });

    const popularTab = document.querySelector('.tabs span.active') || document.querySelector('.tabs span');
    if (popularTab) popularTab.click();
}

initAll();

const audioElement = document.getElementById('audioElement');
const trackItems = document.querySelectorAll('.item_charts,  .track_card, .slide_box_new');

trackItems.forEach(item => {
    item.addEventListener('click', function () {
        const trackSrc = this.getAttribute('data-src');
        if (!trackSrc) return;
        const trackTitle = this.getAttribute('data-title') || 'Неизвестно';
        const trackArtist = this.getAttribute('data-artist') || 'Неизвестен';
        const trackCover = this.getAttribute('data-cover') || '';
        const trackDuration = this.getAttribute('data-duration') || '0:00';

        if (trackSrc) {
            audioElement.src = trackSrc;

            document.getElementById('trackTitle').textContent = trackTitle;
            document.getElementById('trackArtist').textContent = trackArtist;
            document.getElementById('trackCover').src = trackCover;
            document.getElementById('duration').textContent = trackDuration;

            document.getElementById('lyricsTitle').textContent = trackTitle;

            audioElement.play();
            document.getElementById('playPauseBtn').innerHTML = `
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6" y="4" width="4" height="16" fill="#ffffff"/>
                                <rect x="14" y="4" width="4" height="16" fill="#ffffff"/>
                            </svg>
                        `;
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger_menu');
    const closeBtn = document.querySelector('.close_menu');
    const mobileMenu = document.querySelector('.mobile_menu');
    const overlay = document.querySelector('.mobile_menu_overlay');

    if (!burger || !closeBtn || !mobileMenu || !overlay) return;

    const openMenu = () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        rootMargin: '0px 0px -70px 0px',
        threshold: 0
    });

    document.querySelectorAll('.fade_up').forEach(el => {
        observer.observe(el);
    });
});