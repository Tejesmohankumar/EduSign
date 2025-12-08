// Edusign Platform JavaScript

// Global Variables
let currentSection = 'home';
let isRecording = false;
let isVoiceRecording = false;
let isLessonPlaying = false;
let currentLesson = 0;
let lessonProgress = 25;
let audioEnabled = true;
let subtitlesEnabled = true;
let playbackSpeed = 1;
let cameraStream = null;
let cameraActive = false;

// Lessons Data
const lessons = [
    {
        id: 1,
        title: "Introduction to Mathematics",
        description: "Learn basic mathematical concepts with visual sign language explanations.",
        duration: "15 min",
        difficulty: "Beginner",
        progress: 25
    },
    {
        id: 2,
        title: "Basic Science Concepts",
        description: "Explore fundamental science principles through interactive demonstrations.",
        duration: "20 min",
        difficulty: "Beginner",
        progress: 60
    },
    {
        id: 3,
        title: "English Grammar Basics",
        description: "Master English grammar rules with sign language support.",
        duration: "18 min",
        difficulty: "Intermediate",
        progress: 80
    },
    {
        id: 4,
        title: "History Timeline",
        description: "Journey through important historical events and dates.",
        duration: "25 min",
        difficulty: "Intermediate",
        progress: 0
    },
    {
        id: 5,
        title: "Advanced Mathematics",
        description: "Dive into complex mathematical problems and solutions.",
        duration: "30 min",
        difficulty: "Advanced",
        progress: 0
    }
];

// Chat Messages
let chatMessages = [
    {
        type: 'ai',
        message: 'Hello! I\'m your AI teacher. How can I help you today?',
        timestamp: new Date().toLocaleTimeString()
    }
];

// Achievements Data
const achievements = [
    {
        id: 1,
        title: "First Steps",
        description: "Completed your first lesson",
        icon: "bi-award-fill",
        color: "text-success",
        date: "2024-01-15"
    },
    {
        id: 2,
        title: "Quick Learner",
        description: "Completed 5 lessons in one day",
        icon: "bi-lightning-fill",
        color: "text-warning",
        date: "2024-01-18"
    },
    {
        id: 3,
        title: "Sign Master",
        description: "Achieved 95% accuracy in sign recognition",
        icon: "bi-hand-thumbs-up-fill",
        color: "text-primary",
        date: "2024-01-20"
    },
    {
        id: 4,
        title: "Consistent Learner",
        description: "Maintained a 7-day learning streak",
        icon: "bi-fire",
        color: "text-danger",
        date: "2024-01-22"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize sections
    showSection('home');
    
    // Populate lessons
    populateLessons();
    
    // Populate achievements
    populateAchievements();
    
    // Initialize chat
    updateChatDisplay();
    
    // Set up mobile responsiveness
    handleMobileView();
    
    showNotification('Welcome to Edusign!', 'success');
}

function setupEventListeners() {
    // Chat input enter key
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Window resize handler
    window.addEventListener('resize', handleMobileView);
    
    // Settings change handlers
    document.getElementById('themeSelect').addEventListener('change', function() {
        changeTheme(this.value);
    });
    
    // Accessibility settings
    document.getElementById('highContrast').addEventListener('change', function() {
        toggleHighContrast(this.checked);
    });
    
    document.getElementById('largeText').addEventListener('change', function() {
        toggleLargeText(this.checked);
    });
}

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    
    currentSection = sectionId;
    
    // Collapse mobile menu
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navbarCollapse).hide();
    }
}

// Camera Functions
function toggleCamera() {
    const btn = document.getElementById('startCameraBtn');
    const video = document.getElementById('cameraFeed');
    const status = document.getElementById('cameraStatus');
    const recordBtn = document.getElementById('recordBtn');
    
    if (!cameraActive) {
        // Start camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                cameraStream = stream;
                video.srcObject = stream;
                video.style.display = 'block';
                status.style.display = 'none';
                video.play();
                
                btn.innerHTML = '<i class="bi bi-camera-video-off-fill me-2"></i>Stop Camera';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-danger');
                recordBtn.disabled = false;
                cameraActive = true;
                
                showNotification('Camera started successfully', 'success');
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
                showNotification('Camera access denied. Please allow camera permissions.', 'error');
            });
    } else {
        // Stop camera
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        video.style.display = 'none';
        status.style.display = 'block';
        
        btn.innerHTML = '<i class="bi bi-camera-video-fill me-2"></i>Start Camera';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
        recordBtn.disabled = true;
        cameraActive = false;
        
        // Stop recording if active
        if (isRecording) {
            toggleRecording();
        }
        
        showNotification('Camera stopped', 'info');
    }
}

function toggleRecording() {
    const btn = document.getElementById('recordBtn');
    
    if (!isRecording) {
        btn.innerHTML = '<i class="bi bi-stop-circle me-2"></i>Stop Recording';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-warning');
        isRecording = true;
        
        // Simulate sign recognition
        simulateSignRecognition();
        showNotification('Recording started - show your signs!', 'info');
    } else {
        btn.innerHTML = '<i class="bi bi-record-circle me-2"></i>Start Recording';
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-danger');
        isRecording = false;
        
        showNotification('Recording stopped', 'info');
    }
}

function toggleVoiceRecording() {
    const btn = document.getElementById('voiceBtn');
    
    if (!isVoiceRecording) {
        btn.innerHTML = '<i class="bi bi-mic-mute-fill me-2"></i>Stop Voice';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-warning');
        isVoiceRecording = true;
        
        showNotification('Voice recording started', 'info');
        
        // Simulate voice recognition
        setTimeout(() => {
            document.getElementById('detectedSign').textContent = 'Voice: "Hello, how are you?"';
            document.getElementById('aiResponse').textContent = 'I heard you say hello! Let me show you the sign for that.';
            updateConfidence(85);
        }, 2000);
    } else {
        btn.innerHTML = '<i class="bi bi-mic-fill me-2"></i>Voice Input';
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-secondary');
        isVoiceRecording = false;
        
        showNotification('Voice recording stopped', 'info');
    }
}

function processSign() {
    if (!cameraActive) {
        showNotification('Please start the camera first', 'warning');
        return;
    }
    
    showNotification('Processing sign language...', 'info');
    
    // Simulate processing
    setTimeout(() => {
        const signs = ['Hello', 'Thank you', 'Please', 'Good morning', 'How are you?', 'I love you', 'Good job'];
        const randomSign = signs[Math.floor(Math.random() * signs.length)];
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        document.getElementById('detectedSign').textContent = randomSign;
        document.getElementById('aiResponse').textContent = `Great! You signed "${randomSign}". Let me show you some variations.`;
        updateConfidence(confidence);
        
        showNotification(`Sign "${randomSign}" recognized with ${confidence}% confidence`, 'success');
    }, 1500);
}

function simulateSignRecognition() {
    if (!isRecording) return;
    
    const signs = ['Hello', 'Thank you', 'Please', 'Good morning', 'How are you?'];
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const confidence = Math.floor(Math.random() * 20) + 80;
    
    document.getElementById('detectedSign').textContent = randomSign;
    document.getElementById('aiResponse').textContent = `I see you're practicing "${randomSign}". Keep it up!`;
    updateConfidence(confidence);
    
    // Continue recognition
    setTimeout(simulateSignRecognition, 3000);
}

function updateConfidence(percentage) {
    const bar = document.getElementById('confidenceBar');
    const text = document.getElementById('confidenceText');
    
    bar.style.width = percentage + '%';
    text.textContent = percentage + '% Confidence';
    
    // Update color based on confidence
    bar.className = 'progress-bar';
    if (percentage >= 80) {
        bar.classList.add('bg-success');
    } else if (percentage >= 60) {
        bar.classList.add('bg-warning');
    } else {
        bar.classList.add('bg-danger');
    }
}

function startAvatarDemo() {
    showNotification('AI Avatar demo starting...', 'info');
    
    // Simulate avatar demonstration
    setTimeout(() => {
        showNotification('Avatar is demonstrating the sign for "Hello"', 'success');
    }, 1000);
}

// Lesson Functions
function populateLessons() {
    const lessonList = document.getElementById('lessonList');
    lessonList.innerHTML = '';
    
    lessons.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.className = `lesson-item ${index === currentLesson ? 'active' : ''}`;
        lessonItem.onclick = () => selectLesson(index);
        
        const progressColor = lesson.progress >= 80 ? 'success' : lesson.progress >= 50 ? 'warning' : 'info';
        
        lessonItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${lesson.title}</h6>
                    <p class="mb-2 text-muted small">${lesson.description}</p>
                    <div class="lesson-meta d-flex justify-content-between">
                        <small><i class="bi bi-clock me-1"></i>${lesson.duration}</small>
                        <small><i class="bi bi-bar-chart me-1"></i>${lesson.difficulty}</small>
                    </div>
                </div>
                <div class="ms-3">
                    <div class="progress" style="width: 60px; height: 6px;">
                        <div class="progress-bar bg-${progressColor}" style="width: ${lesson.progress}%"></div>
                    </div>
                    <small class="text-muted">${lesson.progress}%</small>
                </div>
            </div>
        `;
        
        lessonList.appendChild(lessonItem);
    });
    
    updateCurrentLessonDisplay();
}

function selectLesson(index) {
    currentLesson = index;
    populateLessons();
    updateCurrentLessonDisplay();
    showNotification(`Switched to: ${lessons[index].title}`, 'info');
}

function updateCurrentLessonDisplay() {
    const lesson = lessons[currentLesson];
    document.getElementById('currentLessonTitle').textContent = lesson.title;
    document.getElementById('currentLessonDesc').textContent = lesson.description;
    document.getElementById('lessonDuration').textContent = lesson.duration;
    document.getElementById('lessonDifficulty').textContent = lesson.difficulty;
    
    const progressBar = document.getElementById('lessonProgressBar');
    progressBar.style.width = lesson.progress + '%';
    progressBar.textContent = lesson.progress + '%';
}

function toggleLessonPlay() {
    const btn = document.getElementById('playPauseBtn');
    
    if (!isLessonPlaying) {
        btn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        isLessonPlaying = true;
        showNotification('Lesson started', 'success');
        
        // Simulate lesson progress
        simulateLessonProgress();
    } else {
        btn.innerHTML = '<i class="bi bi-play-fill"></i>';
        isLessonPlaying = false;
        showNotification('Lesson paused', 'info');
    }
}

function simulateLessonProgress() {
    if (!isLessonPlaying) return;
    
    const lesson = lessons[currentLesson];
    if (lesson.progress < 100) {
        lesson.progress += 1;
        updateCurrentLessonDisplay();
        populateLessons();
        
        setTimeout(simulateLessonProgress, 1000);
    } else {
        // Lesson completed
        toggleLessonPlay();
        showNotification('Lesson completed! 🎉', 'success');
    }
}

function previousLesson() {
    if (currentLesson > 0) {
        selectLesson(currentLesson - 1);
    } else {
        showNotification('This is the first lesson', 'info');
    }
}

function nextLesson() {
    if (currentLesson < lessons.length - 1) {
        selectLesson(currentLesson + 1);
    } else {
        showNotification('This is the last lesson', 'info');
    }
}

function toggleAudio() {
    const btn = document.getElementById('audioBtn');
    audioEnabled = !audioEnabled;
    
    if (audioEnabled) {
        btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        btn.classList.remove('btn-outline-danger');
        btn.classList.add('btn-outline-secondary');
        showNotification('Audio enabled', 'success');
    } else {
        btn.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-outline-danger');
        showNotification('Audio muted', 'info');
    }
}

function changePlaybackSpeed() {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    playbackSpeed = speeds[nextIndex];
    
    document.getElementById('speedText').textContent = playbackSpeed + 'x';
    showNotification(`Playback speed: ${playbackSpeed}x`, 'info');
}

function toggleSubtitles() {
    const btn = document.getElementById('subtitlesBtn');
    subtitlesEnabled = !subtitlesEnabled;
    
    if (subtitlesEnabled) {
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-outline-secondary');
        showNotification('Subtitles enabled', 'success');
    } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
        showNotification('Subtitles disabled', 'info');
    }
}

function markLessonComplete() {
    const lesson = lessons[currentLesson];
    lesson.progress = 100;
    updateCurrentLessonDisplay();
    populateLessons();
    showNotification(`"${lesson.title}" marked as complete! 🎉`, 'success');
}

// Progress Functions
function populateAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item d-flex align-items-center mb-3';
        achievementItem.onclick = () => showAchievementDetails(achievement);
        
        achievementItem.innerHTML = `
            <div class="achievement-icon me-3">
                <i class="bi ${achievement.icon} ${achievement.color} display-6"></i>
            </div>
            <div class="flex-grow-1">
                <h6 class="mb-1">${achievement.title}</h6>
                <p class="mb-1 text-muted">${achievement.description}</p>
                <small class="text-muted">Earned on ${achievement.date}</small>
            </div>
        `;
        
        achievementsList.appendChild(achievementItem);
    });
}

function showAchievementDetails(achievement) {
    showNotification(`Achievement: ${achievement.title} - ${achievement.description}`, 'success');
}

// Communication Functions
function updateChatDisplay() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    chatMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.type}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">${message.message}</div>
            <div class="timestamp">${message.timestamp}</div>
        `;
        
        chatContainer.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        chatMessages.push({
            type: 'user',
            message: message,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // Clear input
        input.value = '';
        
        // Update display
        updateChatDisplay();
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "That's a great question! Let me help you with that.",
                "I understand what you're asking. Here's what I suggest...",
                "Excellent! You're making great progress.",
                "Let me show you a different way to approach this.",
                "That's correct! Keep up the good work."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            chatMessages.push({
                type: 'ai',
                message: randomResponse,
                timestamp: new Date().toLocaleTimeString()
            });
            
            updateChatDisplay();
        }, 1000);
    }
}

function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage();
}

function convertTextToSign() {
    const text = document.getElementById('textToSign').value.trim();
    
    if (text) {
        showNotification('Converting text to sign language...', 'info');
        
        setTimeout(() => {
            showNotification(`Text "${text}" converted to sign language demonstration`, 'success');
            
            // Add to chat
            chatMessages.push({
                type: 'user',
                message: `Convert to signs: "${text}"`,
                timestamp: new Date().toLocaleTimeString()
            });
            
            chatMessages.push({
                type: 'ai',
                message: `Here's how to sign "${text}". Watch the avatar demonstration.`,
                timestamp: new Date().toLocaleTimeString()
            });
            
            updateChatDisplay();
            document.getElementById('textToSign').value = '';
        }, 1500);
    } else {
        showNotification('Please enter text to convert', 'warning');
    }
}

// Modal Functions
function showProfileModal() {
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function showSettingsModal() {
    const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
    modal.show();
}

function showHelpModal() {
    const modal = new bootstrap.Modal(document.getElementById('helpModal'));
    modal.show();
}

function saveProfile() {
    showNotification('Profile updated successfully!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
}

function saveSettings() {
    showNotification('Settings saved successfully!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('settingsModal')).hide();
}

function contactSupport() {
    showNotification('Support request sent! We\'ll get back to you soon.', 'success');
    bootstrap.Modal.getInstance(document.getElementById('helpModal')).hide();
}

// Settings Functions
function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    showNotification(`Theme changed to ${theme}`, 'info');
}

function toggleHighContrast(enabled) {
    if (enabled) {
        document.body.classList.add('high-contrast');
        showNotification('High contrast mode enabled', 'success');
    } else {
        document.body.classList.remove('high-contrast');
        showNotification('High contrast mode disabled', 'info');
    }
}

function toggleLargeText(enabled) {
    if (enabled) {
        document.body.classList.add('large-text');
        showNotification('Large text mode enabled', 'success');
    } else {
        document.body.classList.remove('large-text');
        showNotification('Large text mode disabled', 'info');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    
    const toastColors = {
        success: 'text-bg-success',
        error: 'text-bg-danger',
        warning: 'text-bg-warning',
        info: 'text-bg-primary'
    };
    
    const toastIcons = {
        success: 'bi-check-circle-fill',
        error: 'bi-exclamation-triangle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    
    const toastHTML = `
        <div id="${toastId}" class="toast ${toastColors[type]}" role="alert">
            <div class="toast-body d-flex align-items-center">
                <i class="bi ${toastIcons[type]} me-2"></i>
                ${message}
                <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function handleMobileView() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

function logout() {
    showNotification('Logging out...', 'info');
    setTimeout(() => {
        showNotification('You have been logged out successfully', 'success');
        // In a real app, redirect to login page
    }, 1000);
}