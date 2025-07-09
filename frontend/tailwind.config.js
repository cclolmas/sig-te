/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}'], // Define os arquivos onde o Tailwind deve procurar classes
  theme: {
    extend: {
      colors: {
        blue: {
          50: 'var(--blue-50)', // Cor primária do Design System gov.br
          100: 'var(--blue-100)',
          // ...adicione outros tons conforme necessário
        },
        gray: {
          90: 'var(--gray-90)', // Tons de cinza do Design System gov.br
          // ...adicione outros tons conforme necessário
        },
        // Adicione outras cores do Design System gov.br aqui
      },
    },
  },
  plugins: [], // Plugins adicionais podem ser adicionados aqui
};
