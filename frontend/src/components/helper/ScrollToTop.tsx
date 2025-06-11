import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Smooth scroll für alle möglichen Container
      const scrollActions = [
        () => {
          const container = document.querySelector('.overflow-y-auto');
          if (container) {
            try {
              container.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
              });
            } catch (error) {
              // Fallback für ältere Browser
              container.scrollTop = 0;
            }
          }
        },
        () => {
          const main = document.querySelector('main');
          if (main) {
            try {
              main.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
              });
            } catch (error) {
              main.scrollTop = 0;
            }
          }
        },
        () => {
          try {
            document.documentElement.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          } catch (error) {
            document.documentElement.scrollTop = 0;
          }
        },
        () => {
          try {
            document.body.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          } catch (error) {
            document.body.scrollTop = 0;
          }
        },
        () => {
          try {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          } catch (error) {
            window.scrollTo(0, 0);
          }
        }
      ];

      // Führe alle Scroll-Aktionen aus
      scrollActions.forEach(action => {
        try {
          action();
        } catch (error) {
          // Ignoriere Fehler
        }
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;