# Personal Resume Website

A modern, responsive personal resume website built with React that dynamically loads content from text files. The website features a clean design with dark/light theme toggle and smooth animations.

## 🌟 Features

- **Dynamic Content Loading**: All content is loaded from `.txt` files in the `public` folder
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with hover effects and animations
- **Easy Updates**: Simply edit text files to update your resume content
- **Auto-Deploy**: Automatically deploys to GitHub Pages when you push changes

## 🚀 Live Demo

Visit your website at: [https://preetirameshparmar.github.io](https://preetirameshparmar.github.io)

## 📁 Project Structure

```
├── public/
│   ├── personal.txt       # Personal information and bio
│   ├── education.txt      # Education details
│   ├── work-experience.txt # Work experience entries
│   ├── projects.txt       # Project showcases
│   ├── skills.txt         # Skills by category
│   └── web.txt           # Social media and web links
├── src/
│   ├── components/       # React components for each section
│   ├── App.js           # Main application component
│   └── index.css        # Global styles and theme variables
└── .github/workflows/
    └── deploy.yml       # Auto-deployment configuration
```

## 📝 How to Update Your Resume

### 1. Personal Information (`public/personal.txt`)

```
[Title]
Personal Information

[Content]
Name: Your Full Name
Phone: +1 234 567 8901
Email: your.email@example.com
Quote: A brief professional tagline or quote about yourself
```

### 2. Education (`public/education.txt`)

**Single Education Entry:**
```
[Title]
Education

[Order]
1

[Content]
Degree: Your Degree Name
Institution: University Name
City: City, Country
Start: 2020
End: 2024
```

**Multiple Education Entries:**
```
[Title]
Education

[Order]
1

[Content]
Degree: Masters in Computer Science
Institution: Stanford University
City: Stanford, CA
Start: 2022
End: 2024

Degree: Bachelors in Computer Science
Institution: UC Berkeley
City: Berkeley, CA
Start: 2018
End: 2022
```

### 3. Work Experience (`public/work-experience.txt`)

```
[Title]
Work Experience

[Order]
2

[Content]
Start: Jan 2023
End: Present
City: San Francisco, CA
Company Name: Tech Company Inc.
On Field work: Led a team of 5 developers to build scalable web applications...

Start: Jun 2021
End: Dec 2022
City: New York, NY
Company Name: Another Company
On Field work: Developed and maintained multiple React applications...
```

**Important Notes:**
- Each job entry is separated by a blank line
- Entries are automatically sorted by start date (newest first)
- Use format "MMM YYYY" for dates (e.g., "Jan 2023")

### 4. Projects (`public/projects.txt`)

```
[Title]
Projects

[Order]
-5

[Content]
Name: E-commerce Platform
Tech Stack: React, Node.js, MongoDB, AWS
Description: Built a full-stack e-commerce platform with payment integration and admin dashboard.

Name: Mobile Weather App
Tech Stack: React Native, OpenWeather API
Description: Cross-platform mobile app providing real-time weather updates with location-based forecasts.
```

### 5. Skills (`public/skills.txt`)

```
[Title]
Skills

[Order]
4

[Content]
Programming Languages: JavaScript, Python, Java, TypeScript
Frontend: React, Vue.js, HTML5, CSS3, Sass
Backend: Node.js, Express, Django, Spring Boot
Databases: MongoDB, PostgreSQL, MySQL
Tools & Technologies: Git, Docker, AWS, Firebase
```

### 6. Web Links (`public/web.txt`)

```
[Title]
Web Profiles

[Order]
3

[Content]
LinkedIn - https://linkedin.com/in/yourprofile
GitHub - https://github.com/yourusername
Portfolio - https://yourportfolio.com
Twitter - https://twitter.com/yourhandle
```

**Supported Icons:**
- LinkedIn (automatically detects "linkedin" in name)
- GitHub (automatically detects "github" in name)  
- Portfolio/Website (automatically detects "portfolio" in name)
- Other links get a generic globe icon

## 🎯 Section Ordering

Each section can have an `[Order]` field that determines its position in the navigation and on the page:

- **Lower numbers appear first** (e.g., Order: 1 comes before Order: 2)
- **Negative numbers** can be used (e.g., Order: -5 appears very early)
- **Personal section** is always first regardless of order
- **Default order** if not specified:
  - Personal: Always first
  - Education: 1
  - Work Experience: 2
  - Web Links: 3
  - Skills: 4
  - Projects: 5

## 🎨 Customization

### Changing Colors and Fonts

Edit `src/index.css` to customize the theme:

```css
:root {
  --primary-color: #6366f1;        /* Main accent color */
  --text-dark: #1f2937;            /* Dark text color */
  --text-light: #6b7280;           /* Light text color */
  --background: #f9fafb;           /* Background color */
  --background-paper: #ffffff;     /* Card background */
}
```

### Adding New Sections

1. Create a new `.txt` file in the `public` folder
2. Follow the format: `[Title]`, `[Order]`, `[Content]`
3. Create a new React component in `src/components/`
4. Add the component to `src/App.js`

## 🚀 Deployment

The website automatically deploys to GitHub Pages when you push changes to the `master` branch.

### Manual Deployment

If you need to deploy manually:

```bash
npm run build
npm run deploy
```

### Setting Up Auto-Deployment

1. Go to your repository Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select "gh-pages" branch and "/ (root)" folder
4. Save the settings

## 🛠️ Development

### Running Locally

```bash
# Clone the repository
git clone https://github.com/preetirameshparmar/preetirameshparmar.github.io.git

# Install dependencies
npm install

# Start development server
npm start
```

The website will open at `http://localhost:3000`

### Making Changes

1. **Content Changes**: Edit the `.txt` files in the `public` folder
2. **Design Changes**: Modify the CSS files in `src/components/`
3. **Functionality Changes**: Edit the React components in `src/components/`

### Testing Changes

Always test your changes locally before pushing:

```bash
npm start  # Test in development mode
npm run build  # Test production build
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (320px - 767px)

## 🎯 Best Practices

### Content Guidelines

- **Keep descriptions concise** but informative
- **Use action verbs** in work experience descriptions
- **Include quantifiable achievements** when possible
- **Update regularly** to keep content fresh
- **Proofread** all content before publishing

### Technical Guidelines

- **Test locally** before pushing changes
- **Keep file sizes small** for faster loading
- **Use semantic HTML** for better accessibility
- **Optimize images** if you add any custom images

## 🐛 Troubleshooting

### Common Issues

**Website showing old content:**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Wait 5-10 minutes for GitHub Pages to update
- Check that changes were pushed to the repository

**Deployment failing:**
- Check the Actions tab for error messages
- Ensure all `.txt` files follow the correct format
- Verify there are no syntax errors in the content

**Content not loading:**
- Check that `.txt` files are in the `public` folder
- Ensure files follow the `[Title]` and `[Content]` format
- Verify there are no special characters causing parsing issues

## 📞 Support

If you encounter any issues:

1. Check the GitHub Actions logs for deployment errors
2. Verify your `.txt` file formats match the examples
3. Test changes locally before pushing
4. Clear browser cache if content isn't updating

---

*Last updated: July 2025*