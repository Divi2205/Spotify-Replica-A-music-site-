// Sample Data
const songsData = [
    { id: 1, name: "Blinding Lights", artist: "The Weeknd", duration: "3:20", cover: "🌃" },
    { id: 2, name: "Shape of You", artist: "Ed Sheeran", duration: "3:53", cover: "🎵" },
    { id: 3, name: "Starboy", artist: "The Weeknd", duration: "3:50", cover: "⭐" },
    { id: 4, name: "Perfect", artist: "Ed Sheeran", duration: "4:23", cover: "💝" },
    { id: 5, name: "Levitating", artist: "Dua Lipa", duration: "3:23", cover: "✨" },
    { id: 6, name: "Save Your Tears", artist: "The Weeknd", duration: "3:35", cover: "😢" },
    { id: 7, name: "Bad Habits", artist: "Ed Sheeran", duration: "3:50", cover: "🎸" },
    { id: 8, name: "Don't Start Now", artist: "Dua Lipa", duration: "3:03", cover: "💃" },
    { id: 9, name: "Peaches", artist: "Justin Bieber", duration: "3:18", cover: "🍑" },
    { id: 10, name: "Stay", artist: "Justin Bieber", duration: "2:21", cover: "🏠" }
];

const playlistsData = {
    madeForYou: [
        { title: "Daily Mix 1", description: "The Weeknd, Dua Lipa, and more", icon: "🎧" },
        { title: "Daily Mix 2", description: "Ed Sheeran, Coldplay, and more", icon: "🎵" },
        { title: "Discover Weekly", description: "Your weekly mixtape of fresh music", icon: "🔍" },
        { title: "Release Radar", description: "Catch all the latest music", icon: "📡" },
        { title: "On Repeat", description: "Your most played songs", icon: "🔁" }
    ],
    recentlyPlayed: [
        { title: "Chill Vibes", description: "Kick back to the best new and recent chill", icon: "🌊" },
        { title: "Rock Classics", description: "Rock legends & epic songs", icon: "🎸" },
        { title: "Pop Hits", description: "The hottest 50 tracks right now", icon: "🔥" },
        { title: "Workout Mix", description: "Get your sweat on", icon: "💪" },
        { title: "Study Music", description: "Focus with soft study music", icon: "📚" }
    ],
    popularPlaylists: [
        { title: "Today's Top Hits", description: "Ed Sheeran is on top of the Hottest 50!", icon: "📈" },
        { title: "RapCaviar", description: "New music from Lil Baby and Gunna", icon: "🎤" },
        { title: "All Out 2010s", description: "The biggest songs of the 2010s", icon: "⏰" },
        { title: "Rock This", description: "The best new rock tracks", icon: "🤘" },
        { title: "Peaceful Piano", description: "Relax and indulge with beautiful piano", icon: "🎹" }
    ]
};

// State Management
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: repeat all, 2: repeat one
let currentPlaylist = songsData;
let currentTime = 0;
let duration = 200; // Simulated duration in seconds
let volume = 0.7;

// DOM Elements
const playPauseBtn = document.getElementById('play-pause-btn');
const prevTrackBtn = document.getElementById('prev-track-btn');
const nextTrackBtn = document.getElementById('next-track-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const progressHandle = document.querySelector('.progress-handle');
const currentTimeDisplay = document.querySelector('.current-time');
const totalTimeDisplay = document.querySelector('.total-time');
const volumeBar = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const volumeBtn = document.getElementById('volume-btn');
const likeButton = document.querySelector('.like-button');
const searchInput = document.getElementById('search-input');

// Initialize App
function init() {
    updateGreeting();
    renderPlaylists();
    loadSong(currentSongIndex);
    attachEventListeners();
    startProgressSimulation();
}

// Update Greeting Based on Time
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    
    if (hour < 12) {
        greetingEl.textContent = 'Good morning';
    } else if (hour < 18) {
        greetingEl.textContent = 'Good afternoon';
    } else {
        greetingEl.textContent = 'Good evening';
    }
}

// Render Playlists
function renderPlaylists() {
    renderPlaylistSection('made-for-you', playlistsData.madeForYou);
    renderPlaylistSection('recently-played', playlistsData.recentlyPlayed);
    renderPlaylistSection('popular-playlists', playlistsData.popularPlaylists);
}

function renderPlaylistSection(sectionId, playlists) {
    const container = document.getElementById(sectionId);
    container.innerHTML = '';
    
    playlists.forEach((playlist, index) => {
        const card = createPlaylistCard(playlist, index);
        container.appendChild(card);
    });
}

function createPlaylistCard(playlist, index) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    
    card.innerHTML = `
        <div class="card-image" style="background: ${colors[index % colors.length]}">
            <span style="font-size: 64px;">${playlist.icon}</span>
        </div>
        <div class="card-title">${playlist.title}</div>
        <div class="card-description">${playlist.description}</div>
        <button class="card-play-btn">
            <i class="fas fa-play"></i>
        </button>
    `;
    
    card.querySelector('.card-play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playPlaylist(index);
    });
    
    return card;
}

// Load Song
function loadSong(index) {
    const song = currentPlaylist[index];
    document.querySelector('.song-name').textContent = song.name;
    document.querySelector('.artist-name').textContent = song.artist;
    document.querySelector('.song-cover').textContent = song.cover;
    totalTimeDisplay.textContent = song.duration;
    currentSongIndex = index;
    
    // Reset progress
    currentTime = 0;
    updateProgress();
}

// Play/Pause Functions
function togglePlayPause() {
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

function playPlaylist(playlistIndex) {
    currentSongIndex = playlistIndex % currentPlaylist.length;
    loadSong(currentSongIndex);
    isPlaying = true;
    updatePlayPauseButton();
    showNotification(`Playing ${currentPlaylist[currentSongIndex].name}`);
}

// Navigation Functions
function nextTrack() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        updatePlayPauseButton();
    }
}

function prevTrack() {
    if (currentTime > 3) {
        currentTime = 0;
        updateProgress();
    } else {
        currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        loadSong(currentSongIndex);
    }
}

// Shuffle Function
function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleBtn.classList.add('active');
    } else {
        shuffleBtn.classList.remove('active');
    }
}

// Repeat Function
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    const icon = repeatBtn.querySelector('i');
    
    repeatBtn.classList.remove('active');
    
    switch (repeatMode) {
        case 0:
            icon.className = 'fas fa-redo';
            break;
        case 1:
            icon.className = 'fas fa-redo';
            repeatBtn.classList.add('active');
            break;
        case 2:
            icon.className = 'fas fa-redo-alt';
            repeatBtn.classList.add('active');
            break;
    }
}

// Progress Bar Functions
function updateProgress() {
    const percent = (currentTime / duration) * 100;
    progressFill.style.width = `${percent}%`;
    progressHandle.style.left = `${percent}%`;
    currentTimeDisplay.textContent = formatTime(currentTime);
}

function setProgress(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    currentTime = (clickX / width) * duration;
    updateProgress();
}

// Volume Functions
function setVolume(e) {
    const width = volumeBar.clientWidth;
    const clickX = e.offsetX;
    volume = clickX / width;
    volumeFill.style.width = `${volume * 100}%`;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const icon = volumeBtn.querySelector('i');
    if (volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

function toggleMute() {
    if (volume > 0) {
        volume = 0;
    } else {
        volume = 0.7;
    }
    volumeFill.style.width = `${volume * 100}%`;
    updateVolumeIcon();
}

// Like Button
function toggleLike() {
    const icon = likeButton.querySelector('i');
    likeButton.classList.toggle('active');
    
    if (likeButton.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        showNotification('Added to Liked Songs');
    } else {
        icon.className = 'far fa-heart';
        showNotification('Removed from Liked Songs');
    }
}

// Search Function
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length > 0) {
        const results = songsData.filter(song => 
            song.name.toLowerCase().includes(query) || 
            song.artist.toLowerCase().includes(query)
        );
        console.log('Search results:', results);
        // You can display results in a dropdown or update the UI
    }
}

// Time Formatter
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Progress Simulation
function startProgressSimulation() {
    setInterval(() => {
        if (isPlaying) {
            currentTime += 1;
            if (currentTime >= duration) {
                if (repeatMode === 2) {
                    currentTime = 0;
                } else if (repeatMode === 1) {
                    nextTrack();
                } else {
                    if (currentSongIndex === currentPlaylist.length - 1) {
                        isPlaying = false;
                        updatePlayPauseButton();
                        currentTime = 0;
                    } else {
                        nextTrack();
                    }
                }
            }
            updateProgress();
        }
    }, 1000);
}

// Quick Playlist Card Handlers
function attachQuickPlaylistHandlers() {
    document.querySelectorAll('.quick-playlist-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            playPlaylist(index);
        });
    });
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background-color: #2e77d0;
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Event Listeners
function attachEventListeners() {
    // Player Controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextTrackBtn.addEventListener('click', nextTrack);
    prevTrackBtn.addEventListener('click', prevTrack);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress Bar
    progressBar.addEventListener('click', setProgress);
    
    // Volume
    volumeBar.addEventListener('click', setVolume);
    volumeBtn.addEventListener('click', toggleMute);
    
    // Like Button
    likeButton.addEventListener('click', toggleLike);
    
    // Search
    searchInput.addEventListener('input', handleSearch);
    
    // Quick Playlists
    attachQuickPlaylistHandlers();
    
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-nav a, .sidebar-actions a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');
        });
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
    } else if (e.key === 'ArrowRight') {
        nextTrack();
    } else if (e.key === 'ArrowLeft') {
        prevTrack();
    }
});

// Initialize on Load
window.addEventListener('DOMContentLoaded', init);

// Dynamic Background Color Change
function updateBackgroundGradient() {
    const colors = [
        'rgba(91, 87, 115, 0.5)',
        'rgba(83, 122, 161, 0.5)',
        'rgba(29, 185, 84, 0.3)',
        'rgba(255, 100, 55, 0.4)',
        'rgba(141, 103, 171, 0.5)'
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('.main-content').style.background = 
        `linear-gradient(to bottom, ${randomColor} 0%, var(--spotify-dark-gray) 100%)`;
}

// Change background color every 10 seconds
setInterval(updateBackgroundGradient, 10000);

console.log('🎵 Spotify Clone Loaded Successfully!');
console.log('💡 Tip: Press SPACE to play/pause, Arrow keys to navigate tracks');
