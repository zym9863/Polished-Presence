# Polished Presence - Personal Grooming Assistant

> **Languages / 语言:** [English](README_EN.md) | [中文](README.md)

A modern web application focused on personal image management, helping users develop good living habits and enhance personal cultivation and social etiquette.

## ✨ Features

### 🏠 Smart Dashboard
- Personalized welcome interface
- Real-time progress statistics
- Quick daily habit actions
- Personalized recommendation display
- Visual progress ring charts

### 👤 Personal Profile Management
- Complete user information setup
- Personalized preference configuration
- Color preference selection
- Profile completion tracking
- Intelligent guidance process

### 👔 Style Recommendation System
- Scenario-based outfit recommendations
- Color matching guides
- Clothing item database
- Seasonal suggestions
- Professional styling solutions

### 📚 Etiquette Guide
- Categorized etiquette knowledge
- Difficulty-graded learning
- Practical scenario examples
- Quick reference cards
- Interactive learning experience

### ⏰ Habit Formation
- Smart habit tracking
- Streak recording system
- Category management
- Progress visualization
- Personalized reminders

### ✅ Life Checklist
- Time-based checklist management
- Priority settings
- Deadline reminders
- Quick templates
- Completion statistics

## 🛠 Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **UI Component Library**: Element Plus
- **State Management**: Vue Composition API
- **Data Persistence**: LocalStorage
- **Build Tool**: Vite
- **Styling**: CSS3 + Flexbox/Grid

## 📦 Project Structure

```
src/
├── components/           # Vue components
│   ├── Dashboard.vue        # Dashboard
│   ├── UserProfile.vue      # User profile
│   ├── StyleRecommendations.vue  # Style recommendations
│   ├── EtiquetteGuide.vue   # Etiquette guide
│   ├── HabitsManager.vue    # Habit management
│   └── ChecklistManager.vue # Checklist management
├── composables/          # Composition functions
│   ├── useLocalStorage.ts   # Local storage
│   ├── useUserProfile.ts    # User profile management
│   ├── useHabits.ts         # Habit management
│   └── useStyleRecommendations.ts  # Style recommendations
├── types/                # TypeScript type definitions
│   └── index.ts
├── App.vue               # Main application component
└── main.ts              # Application entry point
```

## 🚀 Quick Start

### Requirements
- Node.js >= 16.0.0
- npm >= 7.0.0

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 💡 User Guide

### First Time Use
1. Open the application, the system will automatically guide you to the personal profile page
2. Fill in basic information (name, profession, personal style)
3. Set personal preferences (formality level, budget range, favorite colors)
4. After completing the setup, you can enter the main application interface

### Feature Usage

#### Dashboard
- View today's progress overview
- Quick habit check-ins
- Get personalized recommendations
- Monitor weekly progress statistics

#### Style Recommendations
- Select different scenarios for outfit suggestions
- Browse color matching guides
- View detailed styling tips
- Explore more styling options

#### Etiquette Guide
- Browse etiquette knowledge by category
- Choose learning content by difficulty
- View practical scenario examples
- Use quick reference features

#### Habit Management
- Add personal habit goals
- Daily check-in records
- View streak statistics
- Manage habits by category

#### Life Checklist
- Create time-based todo checklists
- Set priorities and deadlines
- Use quick templates
- Track completion progress

## 🎨 Design Philosophy

### User Experience
- **Simple & Intuitive**: Clear information architecture and navigation design
- **Responsive Design**: Adapts to various device screens
- **Progressive Guidance**: User-friendly onboarding flow
- **Instant Feedback**: Timely feedback on operations

### Visual Design
- **Modern & Minimal**: Fresh color schemes
- **Consistency**: Unified component and interaction design
- **Readability**: Optimized typography and spacing
- **Visual Hierarchy**: Proper information priority display

### Functional Design
- **Personalization**: Smart recommendations based on user preferences
- **Data-Driven**: Visual progress and statistics display
- **Practicality**: Life-oriented functional scenarios
- **Growth-Oriented**: Long-term habit formation tracking

## 🔧 Customization

### Theme Customization
The application uses CSS variables for theme management. You can customize the theme by modifying the following variables:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #48bb78;
  --warning-color: #ed8936;
  --danger-color: #f56565;
}
```

### Data Configuration
- Habit categories and templates can be customized in `useHabits.ts`
- Style recommendation data can be configured in `useStyleRecommendations.ts`
- Checklist templates can be adjusted in `ChecklistManager.vue`

## 📱 Responsive Support

The application fully supports responsive design with excellent user experience on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Data Security

- All data is stored locally in the user's browser
- No personal information is collected or uploaded
- Supports data export and backup
- Clearing browser data will reset the application state

## 🤝 Contributing

Welcome to submit issue reports and feature suggestions!

### Development Process
1. Fork the project repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Code Standards
- Use TypeScript for type checking
- Follow Vue 3 Composition API best practices
- Maintain single responsibility principle for components
- Write clear comments and documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Element Plus](https://element-plus.org/) - Vue 3 component library
- [Vite](https://vitejs.dev/) - Next generation frontend build tool

---

**Polished Presence** - Making elegance a way of life ✨
