# Overview

This is a professional website for **ARTFUL STRUCTURES LIMITED**, an interior and exterior design company. The website showcases the company's design services across residential, commercial, hospitality, and transformation projects. Built with a modern React frontend and Express backend, it features elegant design inspired by luxury interior design websites, with a focus on showcasing portfolios and facilitating client contact.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with **React 18** using **TypeScript** and follows a component-based architecture:

- **Router**: Uses `wouter` for lightweight client-side routing with pages for Home, About, Design Process, Portfolio, and Contact
- **UI Framework**: Implements **shadcn/ui** component library with **Radix UI** primitives for accessible, customizable components
- **Styling**: **Tailwind CSS** with custom luxury design tokens (cream, gold, charcoal color palette) and typography using Playfair Display and Inter fonts
- **State Management**: **TanStack Query** for server state management and API interactions
- **Form Handling**: **React Hook Form** with **Zod** validation for type-safe form submissions
- **Build Tool**: **Vite** for fast development and optimized production builds

## Backend Architecture

The backend uses **Express.js** with TypeScript in ESM format:

- **API Structure**: RESTful endpoints for contact form submissions (`/api/contact`, `/api/contact-submissions`)
- **Data Validation**: **Zod** schemas for request validation and type safety
- **Storage Layer**: Abstract storage interface with in-memory implementation (prepared for database integration)
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development Integration**: Hot module replacement with Vite middleware in development

## Database Design

Currently uses **Drizzle ORM** with PostgreSQL schema definitions:

- **Tables**: `users` (authentication ready) and `contact_submissions` (form data)
- **Schema Management**: Type-safe schema definitions with automatic TypeScript inference
- **Migration Support**: Drizzle Kit for database migrations and schema management
- **Connection**: Configured for **Neon Database** serverless PostgreSQL

## Component Architecture

**Shared Components**:
- `Navigation`: Responsive navbar with mobile menu
- `Footer`: Company information and social links
- `HeroSection`: Reusable hero banner component
- `ServiceCard`: Portfolio/service display cards
- `PortfolioModal`: Modal for detailed project views

**Page Components**:
- Dedicated page components for each route with consistent layout patterns
- Form components with validation and error handling
- Gallery and portfolio display components

## Design System

- **Typography**: Playfair Display for headings, Inter for body text
- **Color Palette**: Luxury-focused with cream backgrounds, charcoal text, and gold accents
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Animation**: Smooth transitions and hover effects for enhanced user experience

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire application
- **Vite**: Build tool and development server

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **Drizzle Kit**: Database migration and schema management tool

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern React component library
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Playfair Display and Inter font families

## Form and Data Management
- **React Hook Form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration with validation libraries
- **Zod**: Schema validation and type inference
- **TanStack Query**: Server state management and caching

## Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling integration
- **PostCSS**: CSS processing with Autoprefixer

## Routing and Navigation
- **wouter**: Lightweight routing library for React applications

## Additional Features
- **class-variance-authority**: Utility for creating component variants
- **clsx**: Conditional CSS class names utility
- **date-fns**: Date manipulation and formatting library