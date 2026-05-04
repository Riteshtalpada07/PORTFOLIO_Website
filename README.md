# Portfolio Website

A modern, responsive personal portfolio website built with HTML, CSS, JavaScript, and Node.js/Express backend.

## Features

- Clean and professional design
- Responsive layout for all devices
- Interactive UI elements
- Resume/CV download
- Project showcase section
- Contact information

## Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js

## Project Structure

```
├── index.html                 # Main HTML file
├── server.js                  # Express server
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables
├── .env.example               # Example env file
├── assets/                    # Static assets
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   └── script.js         # Client-side JavaScript
│   └── document/
│       └── RITESH TALPADA.pdf # Resume
├── images/                    # Image assets
│   ├── logos/
│   ├── backgrounds/
│   ├── profile/
│   └── icons/
└── node_modules/              # Dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Riteshtalpada07/PORTFOLIO_Website.git
cd "Portfolio Website"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The application will run on `http://localhost:3000`

## Customization

- Update personal information in `index.html`
- Modify styles in `assets/css/style.css`
- Add functionality in `assets/js/script.js`
- Add images to respective folders in `images/`
- Update resume in `assets/document/`

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload (if configured)

## License

MIT License - feel free to use this template for your own portfolio.
