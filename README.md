# 🚦 MiniGames-Rambu-Lalulintas (Traffic Sign Mini-Game)

A 3D educational simulation game designed to teach traffic signs and rules in an immersive mini-city environment. Built with **Three.js**, this project features a first-person exploration experience with a dynamic day/night cycle, realistic lighting, and interactive quizzes.

## 🌟 Features

*   **First-Person Exploration**: Walk around a procedurally generated city using standard WASD + Mouse controls.
*   **Dynamic Day/Night Cycle**: Realistic lighting transitions from sunrise to noon, sunset, and night. Shadows lengthen, and streetlights turn on automatically.
    *   Cycle Controls: `1` (Morning), `2` (Noon), `3` (Sunset), `4` (Night), `N` (Toggle Auto).
*   **Educational Traffic Signs**: Various traffic signs (Stop, Parking, Speed Limit, etc.) placed throughout the city.
    *   **Interactive Learning**: Click on signs to open a popup with detailed information and take a quiz to test your knowledge.
    *   **Minimap**: A real-time radar showing nearby signs and your orientation.
    *   **Missions**: Track your progress as you learn and master each sign.
*   **Lively Environment**:
    *   Procedural buildings and skyscrapers.
    *   Animated birds flying overhead.
    *   Dynamic clouds and celestial bodies (Sun/Moon).
    *   Smartly placed street lamps and trees.

## 🛠️ Technology Stack

*   **Core**: HTML5, CSS3, JavaScript (ES6+ Modules).
*   **3D Engine**: [Three.js](https://threejs.org/) (v0.152.0).
*   **Controls**: `PointerLockControls` for immersive FPS camera movement.
*   **Lighting**: Hemisphere + Directional Lights with shadow mapping.

## 🚀 Installation & Usage

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ahmazk/MiniGames-Rambu-Lalulintas.git
    cd MiniGames-Rambu-Lalulintas
    ```

2.  **Run Locally**
    Since this project uses ES6 Modules and loads textures, you **cannot** simply open `index.html` directly in a browser due to CORS (Cross-Origin Resource Sharing) policies. You must use a local server.

    *   **Using VS Code (Recommended)**:
        1.  Install the "Live Server" extension.
        2.  Right-click `index.html` and select "Open with Live Server".

    *   **Using Python**:
        ```bash
        # Python 3.x
        python -m http.server 8000
        ```
        Then open `http://localhost:8000` in your browser.

    *   **Using Node.js (http-server)**:
        ```bash
        npx http-server .
        ```

## 🎮 Controls

| Key | Action |
| :--- | :--- |
| **W / A / S / D** | Move Forward / Left / Backward / Right |
| **Mouse** | Look Around |
| **Left Click** | Interact with Game / Click Signs / Lock Cursor |
| **Shift** | Sprint (Move Faster) |
| **Esc** | Unlock Cursor / Pause |
| **1 - 4** | Change Time of Day |
| **N** | Toggle Auto Day/Night Cycle |

## 📂 Project Structure

```
MiniGames-Rambu-Lalulintas/
├── css/                # Styles for HUD and Popups
├── images/             # Textures for signs and UI
├── js/
│   ├── core/           # Scene, Camera, Controls setup
│   ├── data/           # Configuration data (Building layouts, Quiz questions)
│   ├── objects/        # 3D Object classes (Building, Road, Tree, etc.)
│   ├── ui/             # HUD, Popup, and Minimap logic
│   ├── world/          # World generators (Lighting, Buildings, Signs)
│   └── main.js         # Entry point and animation loop
├── index.html          # Main HTML file
└── README.md           # Project Documentation
```

## 👨‍💻 Credits

Developed for **Komputer Grafis** (Computer Graphics) Semester 5 Course.
*   **Author**: Ahmad Adzka
