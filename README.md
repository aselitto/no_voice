# 🎤 Voice Soundboard

A voice assistance soundboard application designed for people who have lost their voice. This app provides quick access to commonly-used phrases through an intuitive, iPhone-style interface.

## Features

### 📝 Text-to-Speech
- Type any custom message and have it spoken aloud
- Choose from available system voices
- Press Enter to speak (Shift+Enter for new lines)

### 🎵 Quick Phrases (5×5 Grid)
- 25 pre-programmed common phrases
- One-tap access to essential communications:
  - Greetings (Hello, Goodbye)
  - Responses (Yes, No, I don't know)
  - Needs (Water, Bathroom, Food)
  - Medical (Pain, Doctor, Medicine)
  - Courtesy (Please, Thank you, Sorry)
  - And more!

### ✏️ Custom Buttons (2×5 Grid)
- 10 customizable button slots
- Create your own personalized phrases
- Add emojis and labels for easy recognition
- **Double-click** or **right-click** any button to edit
- Buttons are saved locally in your browser

## How to Use

### Speaking Text
1. Type your message in the text area at the top
2. (Optional) Select a voice from the dropdown
3. Click "🔊 Speak" or press Enter

### Using Quick Phrases
- Simply click any emoji button in the 5×5 grid
- The phrase will be spoken immediately
- Buttons pulse while speaking

### Creating Custom Buttons
1. Find an empty slot (marked with ➕) in the custom buttons section
2. **Double-click** or **right-click** the slot
3. Fill in:
   - **Emoji**: Any emoji character
   - **Label**: Short button label (visible on button)
   - **Text**: The full phrase to be spoken
4. Click "Save"

### Editing Custom Buttons
- **Double-click** or **right-click** any custom button
- Modify the emoji, label, or text
- Click "Save" to update or "Clear" to remove

## Technical Details

- **No installation required** - runs directly in your web browser
- **Offline capable** - works without internet (after initial load)
- **Data persistence** - custom buttons saved in browser localStorage
- **Web Speech API** - uses built-in browser text-to-speech
- **Responsive design** - works on desktop, tablet, and mobile

## Browser Compatibility

Works best in modern browsers that support the Web Speech API:
- ✅ Google Chrome / Microsoft Edge (Recommended)
- ✅ Safari
- ⚠️ Firefox (limited voice options)

## Getting Started

1. Open `index.html` in your web browser
2. Allow microphone/speech permissions if prompted
3. Start communicating!

## Design

The interface is inspired by iOS home screen design:
- Clean, minimalist aesthetic
- Large, touch-friendly buttons
- Smooth animations and transitions
- Purple gradient background
- Glass-morphism effects

## Accessibility

- Large emoji icons for easy visibility
- Clear labels on all buttons
- Keyboard shortcuts (Enter to speak, Escape to close modals)
- High contrast design
- Touch and click friendly

## Privacy

- All data stored locally in your browser
- No external servers or data collection
- No account or login required

## Future Improvements

Possible enhancements:
- Import/export custom button configurations
- Voice recording for custom sounds
- Multiple pages of custom buttons
- Adjustable speech rate and pitch
- Themes and color customization

---

Made with ❤️ for those who need it.
