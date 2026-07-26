# Blog App

A modern, responsive multi-page blog application built with vanilla JavaScript, HTML, CSS, Vite, Bootstrap, and Supabase.

## Features

✨ **Multi-Page Application**
- Home page with featured posts
- User registration and login
- Blog posts listing and detailed view
- Create, edit, and delete posts
- Admin dashboard for content management

📱 **Responsive Design**
- Desktop and mobile optimized
- Touch-friendly interface
- Adaptive layouts for all screen sizes

🎨 **Modern UI/UX**
- Bootstrap 5 components
- Bootstrap Icons for visual enhancement
- Smooth animations and transitions
- Visual feedback and loading states

🔐 **Authentication**
- User registration and login
- Admin role management
- Session persistence

## Project Structure

```
capstone-project-blog/
├── src/
│   ├── main.js              # Application entry point
│   ├── style.css            # Global styles
│   ├── config.js            # Configuration
│   ├── pages/
│   │   ├── homePage.js      # Home page
│   │   ├── loginPage.js     # Login page
│   │   ├── registerPage.js  # Registration page
│   │   ├── postsPage.js     # Posts list and detail view
│   │   └── adminPage.js     # Admin dashboard
│   └── js/
│       ├── router.js        # Client-side routing
│       ├── auth.js          # Authentication logic
│       ├── postService.js   # Post CRUD operations
│       └── utils.js         # Utility functions
├── index.html               # Main HTML entry
├── vite.config.js           # Vite configuration
├── package.json             # Project dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd capstone-project-blog
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

### Running the Application

**Development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Pages

### 1. Home Page (`/` or `#home`)
- Welcome section for guests and logged-in users
- Featured posts carousel
- Call-to-action buttons for login/register

### 2. Login Page (`#login`)
- Email and password authentication
- Link to registration page
- Demo credentials for testing

### 3. Register Page (`#register`)
- User account creation
- Email validation
- Password confirmation
- Terms & conditions acceptance

### 4. Posts Page (`#posts`)
- List all blog posts
- Create new posts (authenticated users)
- View individual post details
- Edit and delete posts (own posts)
- Tag-based filtering
- Responsive grid layout

### 5. Admin Panel (`#admin`)
- Dashboard with statistics
- Content management
- User management
- Site settings
- Analytics (mock data)

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Backend**: Supabase (for future integration)
- **Storage**: LocalStorage (current), Supabase (planned)

## Features Implemented

### Responsive Design
- ✅ Mobile-first approach
- ✅ Adaptive navigation bar
- ✅ Responsive grid layouts
- ✅ Touch-friendly buttons and forms

### User Interface
- ✅ Smooth page transitions
- ✅ Loading spinners
- ✅ Alert notifications
- ✅ Modal dialogs for forms
- ✅ Empty state illustrations
- ✅ Icons and visual cues

### Authentication
- ✅ User registration
- ✅ User login
- ✅ Admin role (demo user: admin@blog.com)
- ✅ Protected routes

### Post Management
- ✅ Create posts
- ✅ Read posts (list and detail)
- ✅ Update posts
- ✅ Delete posts
- ✅ Tag system
- ✅ Post metadata (author, date)

### Admin Features
- ✅ Dashboard with statistics
- ✅ Content management table
- ✅ Site settings
- ✅ User management interface

## Demo Credentials

**Regular User:**
- Email: `user@blog.com`
- Password: `any password` (6+ characters)

**Admin User:**
- Email: `admin@blog.com`
- Password: `any password` (6+ characters)

## Color Scheme

- **Primary**: #0d6efd (Blue)
- **Secondary**: #6c757d (Gray)
- **Success**: #198754 (Green)
- **Danger**: #dc3545 (Red)
- **Warning**: #ffc107 (Yellow)
- **Info**: #0dcaf0 (Cyan)

## Future Enhancements

- [ ] Supabase authentication integration
- [ ] Real database with Supabase
- [ ] File uploads for post images
- [ ] Comments system
- [ ] Search functionality
- [ ] Categories
- [ ] User profiles
- [ ] Email notifications
- [ ] SEO optimization
- [ ] Dark mode toggle
- [ ] Social sharing
- [ ] Analytics

## Performance

- Optimized bundle size
- Lazy loading support ready
- Responsive images
- CSS minification
- JS minification

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Support

For support, please open an issue in the repository.
