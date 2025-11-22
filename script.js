document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const textInput = document.getElementById('textInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const speakBtn = document.getElementById('speakBtn');
    const quickPhrasesGrid = document.getElementById('quickPhrasesGrid');
    const customButtonsGrid = document.getElementById('customButtonsGrid');
    const editModal = document.getElementById('editModal');
    const modalText = document.getElementById('modalText');
    const modalVoiceSelect = document.getElementById('modalVoiceSelect');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const historyBtn = document.getElementById('historyBtn');
    const historyDropdown = document.getElementById('historyDropdown');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Web Speech API
    const synth = window.speechSynthesis;
    let voices = [];
    let currentUtterance = null;
    let editingIndex = null;

    // Random emojis for custom buttons
    const randomEmojis = ['💬', '🗨️', '💭', '📢', '🔔', '✨', '⭐', '🌟', '💫', '🎯'];

    // Quick phrases (35 total for 7x5 grid) - Generalized Universal Word Builder
    const quickPhrases = [
        // Row 1 - Complete Phrases (GREEN)
        { label: 'YES', text: 'Yes', color: 'green' },
        { label: 'NO', text: 'No', color: 'green' },
        { label: 'PLEASE', text: 'Please', color: 'green' },
        { label: 'THANK YOU', text: 'Thank you', color: 'green' },
        { label: 'HELP', text: 'Help', color: 'green' },
        
        // Row 2 - Subjects (BLUE)
        { label: 'I', text: 'I', color: 'blue' },
        { label: 'YOU', text: 'You', color: 'blue' },
        { label: 'WE', text: 'We', color: 'blue' },
        { label: 'THEY', text: 'They', color: 'blue' },
        { label: 'IT', text: 'It', color: 'blue' },
        
        // Row 3 - Core Actions (PURPLE)
        { label: 'WANT', text: 'want', color: 'purple' },
        { label: 'NEED', text: 'need', color: 'purple' },
        { label: 'LIKE', text: 'like', color: 'purple' },
        { label: 'GO', text: 'go', color: 'purple' },
        { label: 'COME', text: 'come', color: 'purple' },
        
        // Row 4 - More Actions (PURPLE)
        { label: 'SEE', text: 'see', color: 'purple' },
        { label: 'HAVE', text: 'have', color: 'purple' },
        { label: 'EAT', text: 'eat', color: 'purple' },
        { label: 'DRINK', text: 'drink', color: 'purple' },
        { label: 'STOP', text: 'stop', color: 'purple' },
        
        // Row 5 - Modifiers (ORANGE)
        { label: 'NOT', text: 'not', color: 'orange' },
        { label: 'TOO', text: 'too', color: 'orange' },
        { label: 'CAN', text: 'can', color: 'orange' },
        { label: 'WILL', text: 'will', color: 'orange' },
        { label: 'MORE', text: 'more', color: 'orange' },
        
        // Row 6 - Pointers/Objects (PINK)
        { label: 'THIS', text: 'this', color: 'pink' },
        { label: 'THAT', text: 'that', color: 'pink' },
        { label: 'HERE', text: 'here', color: 'pink' },
        { label: 'THERE', text: 'there', color: 'pink' },
        { label: 'THING', text: 'thing', color: 'pink' },
        
        // Row 7 - Questions/Time (YELLOW)
        { label: 'WHAT', text: 'what', color: 'yellow' },
        { label: 'WHERE', text: 'where', color: 'yellow' },
        { label: 'WHEN', text: 'when', color: 'yellow' },
        { label: 'NOW', text: 'now', color: 'yellow' },
        { label: 'LATER', text: 'later', color: 'yellow' }
    ];

    // Initialize the app
    function init() {
        loadVoices();
        createQuickPhrases();
        loadCustomButtons();
        setupEventListeners();
        
        // When voices are loaded, update the voice select dropdown
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    // Dynamic font size calculator based on text length
    function calculateFontSize(text, maxSize = 14, minSize = 8) {
        const length = text.length;
        if (length <= 3) return maxSize;
        if (length <= 5) return maxSize - 1;
        if (length <= 7) return maxSize - 2;
        if (length <= 10) return maxSize - 3;
        return minSize;
    }

    // Create quick phrase buttons (7x5 grid) - Text only with colors
    function createQuickPhrases() {
        quickPhrasesGrid.innerHTML = '';
        quickPhrases.forEach(phrase => {
            const btn = document.createElement('button');
            btn.className = `phrase-btn color-${phrase.color}`;
            const fontSize = calculateFontSize(phrase.label);
            btn.innerHTML = `<div class="btn-text" style="font-size: ${fontSize}px;">${phrase.label}</div>`;
            btn.addEventListener('click', () => speakText(phrase.text, btn));
            quickPhrasesGrid.appendChild(btn);
        });
    }

    // Load custom buttons from localStorage (2x5 grid = 10 slots)
    function loadCustomButtons() {
        const savedButtons = JSON.parse(localStorage.getItem('customButtons')) || [];
        customButtonsGrid.innerHTML = '';
        
        for (let i = 0; i < 10; i++) {
            const btn = document.createElement('button');
            btn.className = 'custom-btn';
            
            if (savedButtons[i]) {
                const emoji = savedButtons[i].emoji || randomEmojis[i % randomEmojis.length];
                const shortText = savedButtons[i].text.length > 12 
                    ? savedButtons[i].text.substring(0, 12) + '...' 
                    : savedButtons[i].text;
                
                const fontSize = calculateFontSize(shortText, 12, 8);
                
                btn.innerHTML = `
                    <div class="emoji">${emoji}</div>
                    <div class="label" style="font-size: ${fontSize}px;">${shortText}</div>
                `;
                
                // Pass the voice name if set
                const voiceName = savedButtons[i].voiceName;
                btn.addEventListener('click', () => speakText(savedButtons[i].text, btn, voiceName));
            } else {
                btn.classList.add('empty');
                btn.innerHTML = `
                    <div class="emoji">➕</div>
                `;
            }
            
            // Long press or right click to edit
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                openEditModal(i, savedButtons[i]);
            });
            
            btn.addEventListener('dblclick', () => {
                openEditModal(i, savedButtons[i]);
            });
            
            customButtonsGrid.appendChild(btn);
        }
    }

    // Load available voices
    function loadVoices() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = '<option value="">Default Voice</option>';
        modalVoiceSelect.innerHTML = '<option value="">Use Global Voice</option>';
        
        voices.forEach(voice => {
            // For global voice select
            const option1 = document.createElement('option');
            option1.textContent = `${voice.name} (${voice.lang})`;
            option1.setAttribute('data-lang', voice.lang);
            option1.setAttribute('data-name', voice.name);
            
            if (voice.default) {
                option1.textContent += ' — DEFAULT';
            }
            
            voiceSelect.appendChild(option1);
            
            // For modal voice select
            const option2 = document.createElement('option');
            option2.textContent = `${voice.name} (${voice.lang})`;
            option2.setAttribute('data-lang', voice.lang);
            option2.setAttribute('data-name', voice.name);
            
            if (voice.default) {
                option2.textContent += ' — DEFAULT';
            }
            
            modalVoiceSelect.appendChild(option2);
        });
    }

    // Open edit modal for custom button
    function openEditModal(index, buttonData) {
        editingIndex = index;
        
        if (buttonData) {
            modalText.value = buttonData.text;
            
            // Set the voice if one was saved
            if (buttonData.voiceName) {
                // Find and select the matching option
                for (let i = 0; i < modalVoiceSelect.options.length; i++) {
                    if (modalVoiceSelect.options[i].getAttribute('data-name') === buttonData.voiceName) {
                        modalVoiceSelect.selectedIndex = i;
                        break;
                    }
                }
            } else {
                modalVoiceSelect.selectedIndex = 0;
            }
        } else {
            modalText.value = '';
            modalVoiceSelect.selectedIndex = 0;
        }
        
        editModal.classList.add('active');
        modalText.focus();
    }

    // Close edit modal
    function closeEditModal() {
        editModal.classList.remove('active');
        editingIndex = null;
    }

    // Save custom button
    function saveCustomButton() {
        const text = modalText.value.trim();
        
        if (!text) {
            alert('Please enter text for the button');
            return;
        }
        
        const savedButtons = JSON.parse(localStorage.getItem('customButtons')) || [];
        const emoji = randomEmojis[editingIndex % randomEmojis.length];
        
        // Get selected voice if any
        const selectedVoiceName = modalVoiceSelect.selectedOptions[0]?.getAttribute('data-name');
        
        savedButtons[editingIndex] = { 
            emoji, 
            text,
            voiceName: selectedVoiceName || null
        };
        localStorage.setItem('customButtons', JSON.stringify(savedButtons));
        
        closeEditModal();
        loadCustomButtons();
    }

    // Clear custom button
    function clearCustomButton() {
        if (confirm('Are you sure you want to clear this button?')) {
            const savedButtons = JSON.parse(localStorage.getItem('customButtons')) || [];
            savedButtons[editingIndex] = null;
            localStorage.setItem('customButtons', JSON.stringify(savedButtons));
            
            closeEditModal();
            loadCustomButtons();
        }
    }

    // Save text to history
    function saveToHistory(text) {
        if (!text || text.trim() === '') return;
        
        let history = JSON.parse(localStorage.getItem('textHistory')) || [];
        
        // Remove duplicate if exists
        history = history.filter(item => item.text !== text);
        
        // Add to beginning of array
        history.unshift({ text, timestamp: Date.now() });
        
        // Keep only last 20 items
        history = history.slice(0, 20);
        
        localStorage.setItem('textHistory', JSON.stringify(history));
    }

    // Load and display history
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('textHistory')) || [];
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No history yet</div>';
            return;
        }
        
        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'history-text';
            textSpan.textContent = item.text;
            textSpan.title = item.text;
            
            const actions = document.createElement('div');
            actions.className = 'history-actions';
            
            const useBtn = document.createElement('button');
            useBtn.textContent = '📝';
            useBtn.title = 'Use this text';
            useBtn.onclick = (e) => {
                e.stopPropagation();
                textInput.value = item.text;
                historyDropdown.classList.remove('active');
            };
            
            const speakBtn = document.createElement('button');
            speakBtn.textContent = '🔊';
            speakBtn.title = 'Speak this text';
            speakBtn.onclick = (e) => {
                e.stopPropagation();
                speakText(item.text);
            };
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = 'Delete';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteHistoryItem(index);
            };
            
            actions.appendChild(useBtn);
            actions.appendChild(speakBtn);
            actions.appendChild(deleteBtn);
            
            historyItem.appendChild(textSpan);
            historyItem.appendChild(actions);
            
            historyItem.onclick = () => {
                textInput.value = item.text;
                historyDropdown.classList.remove('active');
            };
            
            historyList.appendChild(historyItem);
        });
    }

    // Delete history item
    function deleteHistoryItem(index) {
        let history = JSON.parse(localStorage.getItem('textHistory')) || [];
        history.splice(index, 1);
        localStorage.setItem('textHistory', JSON.stringify(history));
        loadHistory();
    }

    // Clear all history
    function clearAllHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            localStorage.setItem('textHistory', JSON.stringify([]));
            loadHistory();
        }
    }

    // Toggle history dropdown
    function toggleHistory() {
        historyDropdown.classList.toggle('active');
        if (historyDropdown.classList.contains('active')) {
            loadHistory();
        }
    }

    // Speak text with visual feedback
    function speakText(text, button, customVoiceName = null) {
        if (synth.speaking) {
            synth.cancel();
        }
        
        if (text !== '') {
            // Save to history
            saveToHistory(text);
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Ensure voices are loaded
            if (voices.length === 0) {
                voices = synth.getVoices();
            }
            
            // First try to use custom voice name if provided
            if (customVoiceName) {
                const customVoice = voices.find(voice => voice.name === customVoiceName);
                if (customVoice) {
                    utterance.voice = customVoice;
                    console.log('Using custom voice:', customVoice.name);
                } else {
                    console.log('Custom voice not found:', customVoiceName);
                }
            } else {
                // Otherwise use global voice if one is selected
                const selectedOption = voiceSelect.selectedOptions[0]?.getAttribute('data-name');
                if (selectedOption) {
                    const selectedVoice = voices.find(voice => voice.name === selectedOption);
                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                        console.log('Using global voice:', selectedVoice.name);
                    }
                }
            }
            
            // Add visual feedback that auto-removes after animation
            if (button) {
                button.classList.add('speaking');
                
                // Remove class after animation completes (0.8s)
                setTimeout(() => {
                    button.classList.remove('speaking');
                }, 900);
                
                utterance.onend = () => {
                    button.classList.remove('speaking');
                };
            }
            
            currentUtterance = utterance;
            synth.speak(utterance);
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Speak button for text input
        speakBtn.addEventListener('click', () => {
            const text = textInput.value.trim();
            if (text) {
                speakText(text, speakBtn);
            }
        });
        
        // Allow Enter key in textarea to speak (Shift+Enter for new line)
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const text = textInput.value.trim();
                if (text) {
                    speakText(text, speakBtn);
                }
            }
        });
        
        // History button
        historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleHistory();
        });
        
        // Clear history button
        clearHistoryBtn.addEventListener('click', clearAllHistory);
        
        // Close history dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!historyDropdown.contains(e.target) && e.target !== historyBtn) {
                historyDropdown.classList.remove('active');
            }
        });
        
        // Modal buttons
        saveBtn.addEventListener('click', saveCustomButton);
        clearBtn.addEventListener('click', clearCustomButton);
        cancelBtn.addEventListener('click', closeEditModal);
        
        // Close modal when clicking outside
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditModal();
            }
        });
        
        // Escape key to close modal and history
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (editModal.classList.contains('active')) {
                    closeEditModal();
                }
                if (historyDropdown.classList.contains('active')) {
                    historyDropdown.classList.remove('active');
                }
            }
        });
    }

    // Initialize the app
    init();
});
