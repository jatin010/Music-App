// ==========================================================================
// 1. NAVIGATION INTERACTIONS & NOTIFICATION SYSTEMS
// ==========================================================================

// Responsive dropdown trigger for tiny screens
document.querySelector('.nav-toggle').addEventListener('click', function() {
    document.querySelector('.nav-bar').classList.toggle('open');
});

// Apple Music Styling Alert System Banners
function showNotification(message, type = "info") {
    const notif = document.getElementById('notification');
    if (!notif) return;
    
    notif.textContent = message;
    notif.style.display = "block";
    
    if (type === "error") {
        notif.style.background = "rgba(255, 59, 48, 0.25)";
        notif.style.border = "1px solid rgba(255, 59, 48, 0.4)";
    } else if (type === "success") {
        notif.style.background = "rgba(40, 167, 69, 0.25)";
        notif.style.border = "1px solid rgba(40, 167, 69, 0.4)";
    } else {
        notif.style.background = "rgba(250, 36, 60, 0.25)";
        notif.style.border = "1px solid rgba(250, 36, 60, 0.4)";
    }
    notif.style.color = "#ffffff";
    
    setTimeout(() => { notif.style.display = "none"; }, 3000);
}

// Global Filter Interface Interceptor
document.querySelector('.search-button').addEventListener('click', () => {
    const query = document.querySelector('.search-bar').value.trim();
    if (query) {
        showNotification(`Searching for "${query}"...`, "info");
    } else {
        showNotification("Please enter a valid search parameter.", "error");
    }
});

// ==========================================================================
// 2. YOUTUBE MEDIA STREAMING CORE ENGINE
// ==========================================================================
let ytPlayer;

// Auto-executed interface listener fired by the structural Google CDN frame link
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: '', 
        playerVars: {
            'playsinline': 1,
            'controls': 0, 
            'disablekb': 1
        },
        events: {
            'onError': onPlayerError
        }
    });
}

function onPlayerError(event) {
    console.error("YT streaming pipeline interrupted with exception flag:", event.data);
    showNotification("This video source blocks direct external embedding playback streams.", "error");
}

// ==========================================================================
// 3. DOCUMENT DYNAMIC INJECTIONS GENERATION ENGINE
// ==========================================================================
function renderSongs(itemsArray) {
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Wipe loading feedback loops safely

    itemsArray.forEach(item => {
        const card = document.createElement('div');
        card.className = 'music-card';
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="card-artwork">
            <h4 class="card-title">${item.title}</h4>
            <p class="card-subtitle">${item.subtitle}</p>
        `;

        card.onclick = () => {
            if (ytPlayer && item.ytId) {
                try {
                    ytPlayer.loadVideoById(item.ytId);
                    ytPlayer.playVideo();
                    showNotification(`Streaming: ${item.title}`, "success");
                } catch(err) {
                    showNotification("Streaming pipeline failure.", "error");
                }
            } else {
                showNotification("Connecting to the YouTube API backend bridge...", "error");
            }
        };

        grid.appendChild(card);
    });
}

// ==========================================================================
// 4. RESOURCE RESOLUTIONS DISPATCH INIT
// ==========================================================================
showNotification("Loading your library...");

// Corrected: Target endpoint renamed to match your physical file structural setup ('Menifest.json')
fetch('Menifest.json')
    .then(response => {
        if (!response.ok) throw new Error("Target configuration manifest asset missing.");
        return response.json();
    })
    .then(data => {
        if (data.libraryItems && data.libraryItems.length > 0) {
            renderSongs(data.libraryItems);
            showNotification("Library loaded successfully!", "success");
        } else {
            throw new Error("Target resource library list structure array missing data elements.");
        }
    })
    .catch(error => {
        console.error("Initialization Failed:", error);
        showNotification("Failed to read configuration records.", "error");
        
        const grid = document.getElementById('library-grid');
        if (grid) {
            grid.innerHTML = '<div class="fallback-status">No music cards available. Check console errors.</div>';
        }
    });
}