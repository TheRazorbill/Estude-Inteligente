/**
 * @type {import('tailwindcss').Config}
 * Configuração do Tailwind CSS.
 * Este arquivo define como o Tailwind CSS deve gerar as classes utilitárias
 * e quais arquivos ele deve escanear para encontrar essas classes.
 */
module.exports = {
  // 'content' especifica os arquivos onde o Tailwind deve procurar por classes.
  // Ele inclui todos os arquivos HTML e JavaScript dentro do diretório atual e subdiretórios.
  content: ["./**/*.{html,js}"],
  
  // 'darkMode' configura como o modo escuro é ativado.
  // 'class' significa que o modo escuro será ativado quando a classe 'dark' estiver presente no elemento <html>.
  darkMode: 'class',
  
  // 'theme' permite personalizar o design do seu projeto.
  theme: {
    // 'extend' permite adicionar novas configurações ou estender as existentes do Tailwind.
    extend: {
      // 'colors' define uma paleta de cores personalizada para o projeto.
      colors: {
        'primary': '#6A0572',    // Cor principal, um tom de roxo escuro.
        'secondary': '#8E299C',  // Cor secundária, um tom de roxo médio.
        'accent': '#FFD700',     // Cor de destaque, amarelo ouro.
        'text-dark': '#2C3E50',  // Cor de texto para o tema claro.
        'text-light': '#7F8C8D', // Cor de texto mais suave para o tema claro.
      }
    },
  },
  
  // 'plugins' permite adicionar plugins do Tailwind CSS.
  // Atualmente, nenhum plugin adicional está sendo usado.
  plugins: [],
}