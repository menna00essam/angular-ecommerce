module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        danger: 'var(--danger-color)',
        background: 'var(--background-color)',
        natural:'var(--black-color)',
        surface: 'var(--surface-color)',
        border: 'var(--border-color)',
        gray: {
          300: 'var(--gray-300)',
          600: 'var(--gray-600)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
      },
      zIndex: {
        60: '60',
      },
    },
  },
  plugins: [],
};
