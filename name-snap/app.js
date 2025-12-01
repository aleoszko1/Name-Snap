class BabyNameSnap {
    constructor() {
        this.names = shuffleArray(australianBoyNames);
        this.currentIndex = 0;
        this.lastName = '';
        this.currentUser = '';
        this.userData = this.loadUserData();
        this.suggestions = this.loadSuggestions();
        
        this.initializeElements();
        this.bindEvents();
        this.loadState();
        this.buildNameQueue();
    }

    initializeElements() {
        // Screens
        this.setupScreen = document.getElementById('setup-screen');
        this.swipingScreen = document.getElementById('swiping-screen');
        this.matchesScreen = document.getElementById('matches-screen');
        
        // Setup elements
        this.lastNameInput = document.getElementById('last-name');
        this.userNameInput = document.getElementById('user-name');
        this.startSwipingBtn = document.getElementById('start-swiping');
        
        // Swiping elements
        this.currentCard = document.getElementById('current-card');
        this.currentNameEl = document.getElementById('current-name');
        this.fullNamePreview = document.getElementById('full-name-preview');
        this.cardNumber = document.getElementById('card-number');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.currentUserEl = document.querySelector('#current-user strong');
        
        // Buttons
        this.likeBtn = document.getElementById('like-btn');
        this.passBtn = document.getElementById('pass-btn');
        this.switchUserBtn = document.getElementById('switch-user');
        this.suggestNameBtn = document.getElementById('suggest-name');
        this.viewMatchesBtn = document.getElementById('view-matches');
        this.resetAppBtn = document.getElementById('reset-app');
        this.backToSwipingBtn = document.getElementById('back-to-swiping');
        
        // Modal elements
        this.userModal = document.getElementById('user-modal');
        this.switchUserNameInput = document.getElementById('switch-user-name');
        this.confirmSwitchBtn = document.getElementById('confirm-switch');
        this.cancelSwitchBtn = document.getElementById('cancel-switch');
        
        // Suggestion modal elements
        this.suggestModal = document.getElementById('suggest-modal');
        this.suggestedNameInput = document.getElementById('suggested-name');
        this.suggestionNoteInput = document.getElementById('suggestion-note');
        this.confirmSuggestionBtn = document.getElementById('confirm-suggestion');
        this.cancelSuggestionBtn = document.getElementById('cancel-suggestion');
        
        // Matches elements
        this.matchesList = document.getElementById('matches-list');
        this.noMatches = document.getElementById('no-matches');
    }

    bindEvents() {
        // Setup events
        this.startSwipingBtn.addEventListener('click', () => this.startSwiping());
        
        // Swiping events
        this.likeBtn.addEventListener('click', () => this.swipeRight());
        this.passBtn.addEventListener('click', () => this.swipeLeft());
        
        // Navigation events
        this.switchUserBtn.addEventListener('click', () => this.showUserModal());
        this.suggestNameBtn.addEventListener('click', () => this.showSuggestModal());
        this.viewMatchesBtn.addEventListener('click', () => this.showMatches());
        this.resetAppBtn.addEventListener('click', () => this.resetApp());
        this.backToSwipingBtn.addEventListener('click', () => this.showSwipingScreen());
        
        // Add export/import buttons if they exist
        const exportBtn = document.getElementById('export-data');
        const importBtn = document.getElementById('import-data');
        const importFile = document.getElementById('import-file');
        
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
        if (importBtn) importBtn.addEventListener('click', () => importFile.click());
        if (importFile) importFile.addEventListener('change', (e) => this.importData(e));
        
        // Modal events
        this.confirmSwitchBtn.addEventListener('click', () => this.switchUser());
        this.cancelSwitchBtn.addEventListener('click', () => this.hideUserModal());
        this.confirmSuggestionBtn.addEventListener('click', () => this.addSuggestion());
        this.cancelSuggestionBtn.addEventListener('click', () => this.hideSuggestModal());
        
        // Touch/mouse events for swiping
        this.bindSwipeEvents();
        
        // Enter key events
        this.userNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startSwiping();
        });
        
        this.switchUserNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.switchUser();
        });
        
        this.suggestedNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSuggestion();
        });
        
        this.suggestionNoteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addSuggestion();
        });
    }

    bindSwipeEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const onStart = (e) => {
            isDragging = true;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            this.currentCard.style.transition = 'none';
        };

        const onMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const deltaX = currentX - startX;
            const rotation = deltaX * 0.1;
            
            this.currentCard.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
            
            // Show indicators
            if (deltaX > 50) {
                this.currentCard.classList.add('indicating-like');
                this.currentCard.classList.remove('indicating-pass');
            } else if (deltaX < -50) {
                this.currentCard.classList.add('indicating-pass');
                this.currentCard.classList.remove('indicating-like');
            } else {
                this.currentCard.classList.remove('indicating-like', 'indicating-pass');
            }
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            
            const deltaX = currentX - startX;
            this.currentCard.style.transition = 'transform 0.3s ease';
            
            if (deltaX > 100) {
                this.swipeRight();
            } else if (deltaX < -100) {
                this.swipeLeft();
            } else {
                // Snap back
                this.currentCard.style.transform = '';
                this.currentCard.classList.remove('indicating-like', 'indicating-pass');
            }
        };

        // Mouse events
        this.currentCard.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        // Touch events
        this.currentCard.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    }

    loadUserData() {
        const saved = localStorage.getItem('babyNameSnapData');
        return saved ? JSON.parse(saved) : {};
    }

    saveUserData() {
        localStorage.setItem('babyNameSnapData', JSON.stringify(this.userData));
    }

    loadState() {
        const savedState = localStorage.getItem('babyNameSnapState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.lastName = state.lastName || '';
            this.currentUser = state.currentUser || '';
            this.currentIndex = state.currentIndex || 0;
            
            if (this.lastName && this.currentUser) {
                this.lastNameInput.value = this.lastName;
                this.showSwipingScreen();
            }
        }
    }

    saveState() {
        const state = {
            lastName: this.lastName,
            currentUser: this.currentUser,
            currentIndex: this.currentIndex
        };
        localStorage.setItem('babyNameSnapState', JSON.stringify(state));
    }

    startSwiping() {
        const lastName = this.lastNameInput.value.trim();
        const userName = this.userNameInput.value.trim();
        
        if (!lastName || !userName) {
            alert('Please enter both your last name and your name!');
            return;
        }
        
        this.lastName = lastName;
        this.currentUser = userName;
        this.saveState();
        this.showSwipingScreen();
    }

    showSwipingScreen() {
        this.setupScreen.classList.remove('active');
        this.matchesScreen.classList.remove('active');
        this.swipingScreen.classList.add('active');
        
        this.currentUserEl.textContent = this.currentUser;
        this.updateCard();
        this.updateProgress();
    }

    showMatches() {
        this.swipingScreen.classList.remove('active');
        this.matchesScreen.classList.add('active');
        this.renderMatches();
    }

    showUserModal() {
        this.userModal.classList.remove('hidden');
        this.switchUserNameInput.value = '';
        this.switchUserNameInput.focus();
    }

    hideUserModal() {
        this.userModal.classList.add('hidden');
    }

    switchUser() {
        const newUser = this.switchUserNameInput.value.trim();
        if (!newUser) {
            alert('Please enter a name!');
            return;
        }
        
        this.currentUser = newUser;
        this.currentUserEl.textContent = this.currentUser;
        this.saveState();
        this.hideUserModal();
    }

    updateCard() {
        if (this.currentIndex >= this.names.length) {
            this.showCompletionMessage();
            return;
        }
        
        const currentName = this.names[this.currentIndex];
        const fullName = `${currentName} ${this.lastName}`;
        
        this.currentNameEl.textContent = currentName;
        this.fullNamePreview.textContent = fullName;
        this.cardNumber.textContent = this.currentIndex + 1;
        
        // Add entrance animation
        this.currentCard.classList.add('entering');
        setTimeout(() => {
            this.currentCard.classList.remove('entering');
        }, 300);
    }

    updateProgress() {
        const progress = (this.currentIndex / this.names.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${this.currentIndex} / ${this.names.length}`;
    }

    swipeRight() {
        this.recordSwipe(true);
        this.animateSwipe('right');
    }

    swipeLeft() {
        this.recordSwipe(false);
        this.animateSwipe('left');
    }

    recordSwipe(liked) {
        const currentName = this.names[this.currentIndex];
        
        if (!this.userData[this.currentUser]) {
            this.userData[this.currentUser] = { likes: [], passes: [] };
        }
        
        if (liked) {
            this.userData[this.currentUser].likes.push(currentName);
        } else {
            this.userData[this.currentUser].passes.push(currentName);
        }
        
        this.saveUserData();
    }

    animateSwipe(direction) {
        this.currentCard.classList.add(`swiping-${direction}`);
        
        setTimeout(() => {
            this.currentCard.classList.remove(`swiping-${direction}`, 'indicating-like', 'indicating-pass');
            this.currentCard.style.transform = '';
            this.currentIndex++;
            this.updateCard();
            this.updateProgress();
            this.saveState();
        }, 300);
    }

    getMatches() {
        const users = Object.keys(this.userData);
        if (users.length < 2) return [];
        
        const matches = [];
        const allLikes = users.map(user => this.userData[user].likes || []);
        
        // Find names that appear in all users' likes
        const firstUserLikes = allLikes[0];
        firstUserLikes.forEach(name => {
            if (allLikes.every(likes => likes.includes(name))) {
                matches.push({
                    name: name,
                    fullName: `${name} ${this.lastName}`,
                    users: users
                });
            }
        });
        
        return matches;
    }

    renderMatches() {
        const matches = this.getMatches();
        
        if (matches.length === 0) {
            this.matchesList.innerHTML = '';
            this.noMatches.classList.remove('hidden');
            return;
        }
        
        this.noMatches.classList.add('hidden');
        
        this.matchesList.innerHTML = matches.map(match => `
            <div class="match-item highlight">
                <div class="match-name">${match.name}</div>
                <div class="match-full-name">${match.fullName}</div>
                <div class="match-users">💕 Loved by: ${match.users.join(' & ')}</div>
            </div>
        `).join('');
    }

    showCompletionMessage() {
        this.currentNameEl.textContent = "All Done! 🎉";
        this.fullNamePreview.textContent = "You've seen all the names!";
        this.cardNumber.textContent = this.names.length;
        
        // Hide action buttons
        document.querySelector('.action-buttons').style.display = 'none';
        
        // Show completion message
        setTimeout(() => {
            alert(`Congratulations! You've reviewed all ${this.names.length} names. Check your matches!`);
            this.showMatches();
        }, 1000);
    }

    // Suggestion functionality
    loadSuggestions() {
        const saved = localStorage.getItem('babyNameSnapSuggestions');
        return saved ? JSON.parse(saved) : [];
    }

    saveSuggestions() {
        localStorage.setItem('babyNameSnapSuggestions', JSON.stringify(this.suggestions));
    }

    showSuggestModal() {
        this.suggestModal.classList.remove('hidden');
        this.suggestedNameInput.value = '';
        this.suggestionNoteInput.value = '';
        this.suggestedNameInput.focus();
    }

    hideSuggestModal() {
        this.suggestModal.classList.add('hidden');
    }

    addSuggestion() {
        const suggestedName = this.suggestedNameInput.value.trim();
        const note = this.suggestionNoteInput.value.trim();
        
        if (!suggestedName) {
            alert('Please enter a name suggestion!');
            return;
        }

        // Capitalize first letter
        const formattedName = suggestedName.charAt(0).toUpperCase() + suggestedName.slice(1).toLowerCase();
        
        // Check if name already exists in suggestions or main list
        if (this.names.includes(formattedName) || this.suggestions.some(s => s.name === formattedName)) {
            alert('This name is already in the list!');
            return;
        }

        const suggestion = {
            name: formattedName,
            suggestedBy: this.currentUser,
            note: note,
            timestamp: new Date().toISOString()
        };

        this.suggestions.push(suggestion);
        this.saveSuggestions();
        this.buildNameQueue(); // Rebuild the name queue to include new suggestion
        
        alert(`Great! "${formattedName}" has been added to your partner's name list! 💡`);
        this.hideSuggestModal();
    }

    buildNameQueue() {
        // Start with original names
        let nameQueue = [...shuffleArray(australianBoyNames)];
        
        // Add suggestions for other users
        const otherUserSuggestions = this.suggestions.filter(s => s.suggestedBy !== this.currentUser);
        otherUserSuggestions.forEach(suggestion => {
            // Insert suggestions randomly throughout the queue
            const randomIndex = Math.floor(Math.random() * nameQueue.length);
            nameQueue.splice(randomIndex, 0, suggestion.name);
        });
        
        this.names = nameQueue;
        
        // Reset index if we're rebuilding mid-session
        if (this.currentIndex >= this.names.length) {
            this.currentIndex = 0;
        }
    }

    updateCard() {
        if (this.currentIndex >= this.names.length) {
            this.showCompletionMessage();
            return;
        }
        
        const currentName = this.names[this.currentIndex];
        const fullName = `${currentName} ${this.lastName}`;
        
        this.currentNameEl.textContent = currentName;
        this.fullNamePreview.textContent = fullName;
        this.cardNumber.textContent = this.currentIndex + 1;
        
        // Check if this is a suggested name
        const suggestion = this.suggestions.find(s => s.name === currentName);
        
        // Clear previous suggestion styling
        this.currentCard.classList.remove('suggested');
        const existingBadge = this.currentCard.querySelector('.suggestion-badge');
        const existingNote = this.currentCard.querySelector('.suggestion-note');
        if (existingBadge) existingBadge.remove();
        if (existingNote) existingNote.remove();
        
        if (suggestion && suggestion.suggestedBy !== this.currentUser) {
            // Style as suggested name
            this.currentCard.classList.add('suggested');
            
            // Add suggestion badge
            const badge = document.createElement('div');
            badge.className = 'suggestion-badge';
            badge.textContent = `💡 ${suggestion.suggestedBy}`;
            this.currentCard.appendChild(badge);
            
            // Add note if provided
            if (suggestion.note) {
                const noteEl = document.createElement('div');
                noteEl.className = 'suggestion-note';
                noteEl.textContent = `"${suggestion.note}"`;
                this.currentCard.appendChild(noteEl);
            }
        }
        
        // Add entrance animation
        this.currentCard.classList.add('entering');
        setTimeout(() => {
            this.currentCard.classList.remove('entering');
        }, 300);
    }

    renderMatches() {
        const matches = this.getMatches();
        
        if (matches.length === 0) {
            this.matchesList.innerHTML = '';
            this.noMatches.classList.remove('hidden');
            return;
        }
        
        this.noMatches.classList.add('hidden');
        
        this.matchesList.innerHTML = matches.map(match => {
            const suggestion = this.suggestions.find(s => s.name === match.name);
            const isSuggested = suggestion ? 'suggested' : '';
            const suggestionInfo = suggestion ? 
                `<div class="match-suggestion-info">💡 Suggested by ${suggestion.suggestedBy}</div>` : '';
            
            return `
                <div class="match-item highlight ${isSuggested}">
                    <div class="match-name">${match.name}</div>
                    <div class="match-full-name">${match.fullName}</div>
                    <div class="match-users">💕 Loved by: ${match.users.join(' & ')}</div>
                    ${suggestionInfo}
                </div>
            `;
        }).join('');
    }

    // Data export/import for privacy
    exportData() {
        const data = {
            userData: this.userData,
            suggestions: this.suggestions,
            state: {
                lastName: this.lastName,
                currentUser: this.currentUser,
                currentIndex: this.currentIndex
            },
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `baby-names-${this.lastName || 'data'}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Data exported! Share this file privately with your partner.');
    }
    
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('This will replace all current data. Are you sure?')) {
                    // Import data
                    this.userData = data.userData || {};
                    this.suggestions = data.suggestions || [];
                    
                    if (data.state) {
                        this.lastName = data.state.lastName || '';
                        this.currentUser = data.state.currentUser || '';
                        this.currentIndex = data.state.currentIndex || 0;
                    }
                    
                    // Save to localStorage
                    this.saveUserData();
                    this.saveSuggestions();
                    this.saveState();
                    this.buildNameQueue();
                    
                    alert('Data imported successfully!');
                    location.reload();
                }
            } catch (error) {
                alert('Error importing file. Please check the file format.');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    resetApp() {
        if (confirm('Are you sure you want to reset everything? This will delete all swipe data and suggestions.')) {
            localStorage.removeItem('babyNameSnapData');
            localStorage.removeItem('babyNameSnapState');
            localStorage.removeItem('babyNameSnapSuggestions');
            location.reload();
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BabyNameSnap();
});
