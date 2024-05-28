// Variables para el control de paginación
let page = 1; // Página inicial
const perPage = 3; // Cantidad de elementos por página

// Función para cargar más ofertas de empleo
function loadMoreJobOffers() {
// Realizar la solicitud HTTP al backend
fetch(`https://back.hugee.site/api/job-offers?page=${page}&perPage=${perPage}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener las ofertas de empleo');
    }
    return response.json();
  })
  .then(data => {
    // Procesar los datos recibidos y mostrarlos en el frontend
    const jobOffersContainer = document.getElementById('job-offers-container');
    
    // Limpiar el contenedor antes de agregar las nuevas ofertas
    jobOffersContainer.innerHTML = '';

    data.data.forEach(jobOffer => {
      // Crear un elemento div para cada oferta de empleo
      const jobOfferElement = document.createElement('div');
      jobOfferElement.classList.add('card');

      //Construir el card header
      const cardHeader = document.createElement('div');
      cardHeader.classList.add('pr-8','d-flex', 'justify-content-space-between', 'align-items-center');
      
      // Construir el contenido de la oferta de empleo
      const titleElement = document.createElement('h3');
      titleElement.classList.add('text-black', 'm-0');
      titleElement.textContent = jobOffer.title;
      cardHeader.appendChild(titleElement);


      // Crear el div que contendrá los botones de acción
    const accionesDiv = document.createElement('div');
    accionesDiv.className = 'card-acciones';

    // Crear el botón de aprobar
    const btnAprobar = document.createElement('span');
    btnAprobar.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M9 12l2 2l4 -4" />
        </svg>`;

    // Crear el botón de eliminar
    const btnEliminar = document.createElement('span');
    btnEliminar.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>`;

    // Añadir los botones al div de acciones
    accionesDiv.appendChild(btnAprobar);
    accionesDiv.appendChild(btnEliminar);

    // Añadir el div de acciones al elemento de la oferta de empleo
    cardHeader.appendChild(accionesDiv);
    jobOfferElement.appendChild(cardHeader);

      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = jobOffer.description;
      descriptionElement.classList.add('mt-0','pr-8', 'font-weight-landscape-300');
      jobOfferElement.appendChild(descriptionElement);

      const contactElement = document.createElement('div');
      contactElement.classList.add('d-flex', 'gap-32', 'bt-1', 'pt-16');

      if (jobOffer.whatsapp) {
        const whatsappLink = document.createElement('a');
        whatsappLink.href = `https://api.whatsapp.com/send?phone=${jobOffer.whatsapp}`;
        whatsappLink.textContent = 'WhatsApp';
        whatsappLink.target = '_blank';
        contactElement.appendChild(whatsappLink);
      }

      if (jobOffer.mail) {
        const mailLink = document.createElement('a');
        mailLink.href = `mailto:${jobOffer.mail}`;
        mailLink.textContent = 'Correo';
        contactElement.appendChild(mailLink);
      }

      jobOfferElement.appendChild(contactElement);

      // Agregar la oferta de empleo al contenedor
      jobOffersContainer.appendChild(jobOfferElement);
    });
  })
  .catch(error => {
    console.error('Error:', error.message);
    // Manejar el error en caso de que ocurra
  });
}

// Función para verificar si se alcanzó el final de la página
function isBottomOfPage() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

// Evento de scroll para cargar más ofertas cuando se llega al final de la página
window.addEventListener('scroll', () => { 
    if (isBottomOfPage()) {
        loadMoreJobOffers();
    }
});

// Carga las primeras ofertas al cargar la página
window.addEventListener('load', () => {
    loadMoreJobOffers();
});