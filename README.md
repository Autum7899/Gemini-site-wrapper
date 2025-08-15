Autum's Gemini site wrapper
A simple, clean desktop wrapper for the Google Gemini website, built with Electron.

✨ Features
Dedicated Desktop Experience: Wraps the official Gemini website in a standalone desktop application.

System Tray Integration: Minimizes to the system tray when the window is closed, keeping the app running in the background.

Quick Access:

Single-click the tray icon to quickly show or hide the application window.

Use the global hotkey Alt+Space to toggle visibility from anywhere.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
You'll need Node.js (which includes npm) installed on your computer.

Installation & Setup
Clone the repository or download the source code.

Navigate to the project directory in your terminal:

cd path/to/your/project

Install the necessary dependencies:

npm install

💻 Development
To run the application in development mode (which allows for debugging and live changes), use the following command:

npm start

📦 Building the Application
To package the application into an executable installer (.exe for Windows), run the following command.

Important: On Windows, you may need to run this command in a terminal with Administrator privileges to avoid permissions errors.

npm run dist

After the build process is complete, the installer will be located in the newly created /dist folder.
