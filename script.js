document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');
    const panelWrapper = document.querySelector('.panel-wrapper');
    const heroDisplay = document.querySelector('.hero-display');
    const skinDisplay = document.querySelector('.skin-display');
    const heroImage = document.querySelector('.hero-image');
    const heroDescription = document.querySelector('.hero-description');
    const showSkinButton = document.querySelector('.show-skin');
    const backToPanelButtons = document.querySelectorAll('.back-to-panel');
    const skinVideos = document.querySelectorAll('.skin-video');
    const skinDescriptions = document.querySelectorAll('.skin-description');
    const skinGrid = document.querySelector('.skin-grid');

    let currentIndex = 0;
    let currentSkins = []; // Untuk menyimpan daftar skin

    // Animasi panel saat di-scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                entry.target.classList.remove('hide');
            } else {
                entry.target.classList.remove('show');
                entry.target.classList.add('hide');
            }
        });
    }, {
        threshold: 0.1
    });

    panels.forEach(panel => {
        observer.observe(panel);
    });

    // Geser panel ke kiri atau kanan
    const movePanel = (direction) => {
        if (direction === 'left' && currentIndex > 0) {
            currentIndex--;
        } else if (direction === 'right' && currentIndex < panels.length - 1) {
            currentIndex++;
        }
        const offset = -currentIndex * (panels[0].offsetWidth + 15); // 15 adalah gap antara panel
        panelWrapper.style.transform = `translateX(${offset}px)`;
    };

    // Event listener untuk geser panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            movePanel('left');
        } else if (e.key === 'ArrowRight') {
            movePanel('right');
        }
    });

    // Menyiapkan suara untuk setiap panel
    const clickSounds = [
        new Audio('soundlunox.mp3'), // Suara untuk panel 1
        new Audio('soundkadita.mp3'), // Suara untuk panel 2
        new Audio('soundvexana.mp3'), // Suara untuk panel 3
        new Audio('soundvalentina.mp3'), // Suara untuk panel 4
        new Audio('soundlouyi.mp3')  // Suara untuk panel 5
    ];

    // Panel diklik
    panels.forEach((panel, index) => {
        panel.addEventListener('click', () => {
            // Memutar suara sesuai dengan panel yang diklik
            clickSounds[index].currentTime = 0; // Reset waktu ke awal
            clickSounds[index].play(); // Memutar suara

            // Tambahkan animasi klik
            panel.classList.add('clicked');

            // Hapus kelas clicked setelah animasi selesai
            setTimeout(() => {
                panel.classList.remove('clicked');
            }, 500); // Durasi animasi sesuai dengan yang ditentukan di CSS

            // Tambahkan animasi transisi sebelum menampilkan hero
            panelWrapper.style.transition = 'opacity 0.5s ease';
            panelWrapper.style.opacity = '0';

            setTimeout(() => {
                const heroId = panel.getAttribute('data-id');
                heroImage.src = panel.getAttribute('data-hero');
                heroDescription.textContent = panel.getAttribute('data-description');
                heroDisplay.style.display = 'flex';
                heroDisplay.setAttribute('data-hero', heroId);

                // Tambahkan event listener untuk gambar hero
                heroImage.addEventListener('click', () => {
                    const overlay = document.querySelector('.overlay');
                    const zoomedImage = document.querySelector('.zoomed-image');
                    overlay.style.display = 'flex';
                    zoomedImage.src = heroImage.src; // Set gambar yang diperbesar
                });

                // Tambahkan animasi saat hero ditampilkan
                const heroContent = document.querySelector('.hero-content');
                heroContent.classList.add('animate'); // Tambahkan kelas animasi

                // Simpan daftar skin dari atribut data-skins
                currentSkins = panel.getAttribute('data-skins').split(',');
            }, 500); // Tunggu animasi transisi selesai
        });
    });

    // Event listener untuk tombol close di overlay
    document.querySelector('.close-zoom').addEventListener('click', () => {
        document.querySelector('.overlay').style.display = 'none';
    });

    showSkinButton.addEventListener('click', () => {
        heroDisplay.style.display = 'none';
        skinDisplay.style.display = 'flex';

        // Ambil data hero yang digunakan di hero-display
        const heroId = heroDisplay.getAttribute('data-hero');
        // Terapkan data hero ke skin-display
        skinDisplay.setAttribute('data-hero', heroId);

        // Bersihkan konten skin grid sebelum menambahkan yang baru
        skinGrid.innerHTML = '';

        // Define skin descriptions for each hero
        const skinDescriptionsMap = {
            1: ["Divine Goddess", "Nature's Harmony", "Eyes of Eternity"],
            2: ["White Robin", "MPL", "Heart of the Sea"],
            3: ["The Sun Empress", "Circus Magician", "Zenith"],
            4: ["Celestial Judicator", "Archmagister", "Shadow Striker"],
            5: ["Oracle of Sol", "Elysium Guardian", "Siren Priestess"]
        };

        // Atur video atau gambar skin berdasarkan daftar skin yang disimpan
        currentSkins.forEach((skin, index) => {
            const skinItem = document.createElement('div');
            skinItem.classList.add('skin-item');

            if (skin.endsWith('.mp4')) {
                const video = document.createElement('video');
                video.classList.add('skin-video');
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                const source = document.createElement('source');
                source.src = skin;
                source.type = 'video/mp4';
                video.appendChild(source);
                skinItem.appendChild(video);
            } else if (skin.endsWith('.jpg')) {
                const img = document.createElement('img');
                img.src = skin;
                img.classList.add('skin-image');
                skinItem.appendChild(img);

                // Tambahkan event listener untuk gambar skin
                img.addEventListener('click', () => {
                    const overlay = document.querySelector('.overlay');
                    const zoomedImage = document.querySelector('.zoomed-image');
                    overlay.style.display = 'flex';
                    zoomedImage.src = img.src; // Set gambar yang diperbesar
                });
            }

            // tambah skin deskription
            const description = document.createElement('p');
            description.classList.add('skin-description');
            description.textContent = skinDescriptionsMap[heroId][index]; // Get the description based on heroId
            skinItem.appendChild(description);

            skinGrid.appendChild(skinItem);
        });
    });

    // Tombol Kembali ke Panel
    backToPanelButtons.forEach(button => {
        button.addEventListener('click', () => {
            heroDisplay.style.display = 'none';
            skinDisplay.style.display = 'none';
            document.querySelector('.container').style.display = 'flex';
            // Remove the data-hero attribute when going back
            heroDisplay.removeAttribute('data-hero');

            // Kembalikan opacity panel wrapper
            panelWrapper.style.opacity = '1';
        });
    });

    // Event listener untuk tombol close di overlay
    document.querySelector('.close-zoom').addEventListener('click', () => {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'none';
        // Hapus video jika ada
        const zoomedVideo = document.querySelector('.zoomed-video');
        if (zoomedVideo) {
            zoomedVideo.remove();
        }
    });
});