import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "game": {
        "score": "Score",
        "paused": "Paused",
        "gameOver": "Game Over",
        "restart": "Restart",
        "resume": "Resume",
        "exit": "Exit",
        "fullscreen": "Fullscreen",
        "pause": "Pause"
      },
      "signIn": "Sign In",
      "signUp": "Sign Up",
      "logout": "Logout",
      "portal": "Game Portal",
      "games": "Games"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
