# BYPass - Password Generator & Vault

BYPass is a lightweight, fully functional browser extension built to generate secure passwords and store them in a local vault. It comes with a modern UI and injects a convenient inline popup into password input fields across the web for quickly auto-filling saved credentials.

## ✨ Features
- **Local Vault**: Safely manage and store your passwords using the browser's local storage.
- **Master Password Protection**: Protect your vault with a master unlock mechanism (default demo password: `admin`).
- **Password Generator**: Instantly generate strong, 16-character randomized passwords with one click.
- **Inline Auto-fill**: Automatically injects a stylish key icon into `type="password"` fields on web pages. Clicking it reveals a sleek glassmorphism popup to autofill passwords saved for that domain.
- **Dark & Light Themes**: Beautiful UI with a built-in toggle for Dark and Light modes.
- **Searchable Vault**: Quickly search through your saved accounts directly within the extension popup.
- **Dynamic Icons**: Automatically fetches and displays favicons (via DuckDuckGo) for saved websites based on the account name.

## 📁 Project Structure
- `manifest.json`: Manifest V3 configuration for the browser extension.
- `popup.html` / `popup.js`: Extension popup UI and logic for unlocking the vault, generating passwords, and viewing the list of stored accounts.
- `style.css`: Sleek styling and layout rules (including theme toggles) for the popup.
- `content.js`: A content script injected into all pages to find password fields and inject the custom BYPass auto-fill popup.

## 🚀 Installation
1. Clone or download this repository to your local machine.
2. Open Chrome (or any Chromium-based browser) and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click on **Load unpacked** and select the directory where you extracted the project files.
5. The BYPass extension is now installed. Pin it to your toolbar for easy access!

## 💡 Usage
1. Click on the BYPass extension icon.
2. Enter the master password (`admin`) to unlock your vault.
3. Fill in the Account Name, Username/Email, and use the **Gen** button if you need a new secure password.
4. Click **Save to Vault**.
5. When you go to a website, click on the key icon inside the password field to open the inline helper and easily select your saved credentials.

## 🛡️ Security Note
This project is intended as a demonstration of Chrome Extension capabilities and Manifest V3. Currently, the master password is hardcoded as `admin` and passwords are kept in memory/local storage without additional layers of encryption. *For professional deployments, always implement robust encryption algorithms (like AES-256) for data at rest and cryptographically hash the master password.*

## 🛠️ Built With
- HTML, Vanilla JavaScript, CSS
- Chrome Extensions API (Manifest V3)
- Chrome Storage API
