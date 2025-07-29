# EcommerceApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

---

## Description

An ecommerce application built with Angular 20, supporting PWA, Docker, ESLint, and Tailwind CSS for professional styling.

The app displays products, manages a shopping cart, and provides a smooth user experience with multi-language support via ngx-translate.  
It is configured as a Progressive Web App (PWA) and uses Docker for easy deployment.

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.  
The application will automatically reload whenever you modify any source files.

---

## Building

To build the project, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.  
By default, the production build optimizes your application for performance and speed.

For a production build with service worker and optimizations, run:

```bash
ng build --configuration production
```

---

## Running with Docker

To build and run the app with Docker:

1. Build the Docker image:

```bash
docker build -t ecommerce-app .
```

2. Run the Docker container:

```bash
docker run -p 4200:80 ecommerce-app
```

Open your browser at `http://localhost:4200/`.

---

## Technologies Used

- Angular 20  
- Angular Material  
- Angular Service Worker (PWA)  
- ngx-translate (for translations)  
- Docker  
- ESLint with Prettier  
- Tailwind CSS  
- RxJS  
- Angular Signals
-Angular Reactive Forms
---

## Code Quality

- ESLint and Prettier are used to enforce code formatting and style.  
- Please ensure your code passes linting rules before committing.

---

## Features

- Progressive Web App (PWA) support  
- Multi-language support via ngx-translate  
- Light/Dark mode toggle
- Docker support for easy deployment  
- Responsive UI with Angular Material and Tailwind CSS
- Advanced animations and transitions
- Advanced accessibility features (screen reader support, keyboard navigation)


---

## Future Features

### Testing Suite (Coming Soon)
- Unit Testing - Jest/Jasmine with comprehensive component testing
- Integration Testing - End-to-end testing with Cypress/Protractor
- Test Coverage - Code coverage reports and quality gates
- Automated Testing - CI/CD pipeline integration
- Performance Testing - Load testing and performance monitoring