# Ayaan Sulman's Portfolio Website

A modern, responsive portfolio website built with Next.js and React.

## Features

- Modern, responsive design that works on all devices
- Smooth animations and transitions using Framer Motion
- Four main sections: Home, Projects, Resume, and Contact
- Dark theme with accent colors for a professional look

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AyaanSulman/portfolio-site.git
   cd portfolio-site
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Adding Your Content

### Profile Image
Replace the placeholder file in `/public/images/` with your profile picture named `profile-picture.jpg`.

### Project Images
Replace the placeholder files in `/public/images/` with your project screenshots:
- `flappy-bird.jpg` for your Flappy Bird game
- `rent-a-car.jpg` for your Rent A Car project

### Resume
Replace the placeholder file in `/public/` with your actual resume named `Resume.pdf`.

### Personal Information
Update your personal information in the following files:
- Contact details in `/src/pages/contact.js`
- Social media links in `/src/components/SocialLinks.js`
- About me text in `/src/pages/index.js`
- Project details in `/src/pages/projects.js`
- Resume details in `/src/pages/resume.js`

## Deployment to GitHub Pages

1. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. The static files will be generated in the `out` directory.

3. Copy the contents of the `out` directory to your GitHub Pages repository.

4. Push the changes to GitHub.

## Customization

### Colors
You can customize the colors by editing the CSS variables in `/src/styles/globals.css`.

### Adding More Projects
To add more projects, edit the `projects` array in `/src/pages/projects.js`.

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
