// Esta función configura la navegación dinámica de la página basada en secciones.
export function setupNavigation() {
  document.addEventListener("DOMContentLoaded", function () {
    // Elemento donde se muestra el nombre de la sección actual
    const currentSectionElement: HTMLElement | null = document.getElementById("current-section");

    // Enlaces de navegación (clases .link-section o .link-section-active)
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".link-section, .link-section-active");

    // Todas las secciones que tienen un atributo "id"
    const sections: NodeListOf<HTMLElement> = document.querySelectorAll("section[id]");

    /**
     * Actualiza el contenido del elemento que muestra la sección actual
     * @param sectionText - Nombre de la sección a mostrar, en formato .nombre()
     */
    function updateCurrentSection(sectionText: string | null): void {
      if (currentSectionElement && sectionText) {
        currentSectionElement.textContent = sectionText;
      }
    }

    /**
     * Marca como activa la sección del menú que corresponde al hash actual
     * @param hash - Fragmento de URL (ej: "#inicio")
     */
    function updateActiveLink(hash: string): void {
      navLinks.forEach((link: HTMLAnchorElement) => {
        if (link.getAttribute("href") === hash) {
          link.classList.add("link-section-active");
          link.classList.remove("link-section");
        } else {
          link.classList.remove("link-section-active");
          link.classList.add("link-section");
        }
      });
    }

    /**
     * Establece la sección activa inicial cuando se carga la página
     */
    function setInitialSection(): void {
      // Usar el hash de la URL si existe, si no usar la primera sección
      const hash: string = window.location.hash || (sections.length > 0 ? `#${sections[0].id}` : "#is");
      const activeLink: HTMLAnchorElement | null = document.querySelector(`a[href="${hash}"]`);

      if (activeLink) {
        const sectionName = hash.substring(1);
        const sectionText = `.${sectionName}()`;

        updateCurrentSection(sectionText);
        updateActiveLink(hash);
      }
    }

    /**
     * Configura el comportamiento al hacer clic en un enlace de navegación
     * Incluye desplazamiento suave, cambio de URL y actualización visual
     */
    navLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener("click", function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();

        const href: string | null = this.getAttribute("href");

        if (href) {
          const sectionName = href.substring(1);
          const sectionText = `.${sectionName}()`;

          updateCurrentSection(sectionText);
          updateActiveLink(href);

          const targetElement: HTMLElement | null = document.querySelector(href);

          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop,
              behavior: 'smooth'
            });

            // Actualiza la URL solo al hacer clic en los enlaces del navbar
            history.pushState(null, '', href);
          }
        }
      });
    });

    /**
     * Detecta qué sección es visible al hacer scroll para actualizar el estado del menú
     * pero sin modificar la URL
     */
    function handleScroll(): void {
      // Calcular el punto medio de la pantalla
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY + 250;

      let currentSection = "";
      let closestDistance = Infinity;

      sections.forEach((section: HTMLElement) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        // Comprobar si el punto medio de la pantalla está dentro de la sección
        if (scrollTop >= sectionTop && scrollTop < sectionBottom)
          {
          currentSection = `#${section.id}`;
          return; // Salir del bucle si encontramos una sección que contiene el punto medio
        }
      });

      if (currentSection) {
        const sectionName = currentSection.substring(1);
        const sectionText = `.${sectionName}()`;

        updateCurrentSection(sectionText);
        updateActiveLink(currentSection);
        
        // Ya no actualizamos la URL durante el scroll
        // La línea history.replaceState ha sido eliminada
      }
    }

    // Inicializar la sección actual
    setInitialSection();

    // Si al cargar hay un hash en la URL, hacer scroll a esa sección
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement: HTMLElement | null = document.querySelector(window.location.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    }

    // Añadir listeners para el scroll con "throttling" (optimización)
    let isScrolling = false;
    window.addEventListener("scroll", function () {
      if (!isScrolling) {
        window.requestAnimationFrame(function () {
          handleScroll();
          isScrolling = false;
        });
        isScrolling = true;
      }
    });

    // Recalcular cuando cambia el tamaño de la ventana
    window.addEventListener("resize", handleScroll);

    // Reestablecer la sección actual si el hash cambia manualmente
    window.addEventListener("hashchange", setInitialSection);
  });
}