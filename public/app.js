// Variables para el control de paginación
let page = 1; // Página inicial
const perPage = 4; // Cantidad de elementos por página
let allJobOffersLoaded = false; // Variable para controlar si se han cargado todas las ofertas disponibles
let endMessageDisplayed = false; // Variable para controlar si se ha mostrado el mensaje de finalización

// Función para cargar más ofertas de empleo
function loadMoreJobOffers() { 

    const loaderSimple = document.getElementById('loader-simple');
    loaderSimple.classList.remove('d-none');
    // Realizar la solicitud HTTP al backend
    fetch(`https://back.hugee.site/api/job-offers?page=${page}&perPage=${perPage}`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Error when obtaining job offers');
        }
        return response.json();
    })
    .then(data => {
        // Procesar los datos recibidos y mostrarlos en el frontend
        const jobOffersContainer = document.getElementById('job-offers-container');

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

        // Añadir evento de clic para eliminar
        btnEliminar.addEventListener('click', () => deleteJobOffer(jobOffer.id, jobOfferElement));

        // Añadir los botones al div de acciones
        //accionesDiv.appendChild(btnAprobar);
        accionesDiv.appendChild(btnEliminar);

        // Añadir el div de acciones al elemento de la oferta de empleo
        cardHeader.appendChild(accionesDiv);
        jobOfferElement.appendChild(cardHeader);

        const descriptionElement = document.createElement('p');
        const fullDescription = jobOffer.description;
        const shortDescription = fullDescription.length > 100 ? fullDescription.substring(0, 100) + '...' : fullDescription;
        descriptionElement.textContent = shortDescription;
        descriptionElement.classList.add('mt-0','pr-8', 'font-weight-landscape-300');
        jobOfferElement.appendChild(descriptionElement);
        if (fullDescription.length > 100) {
            const readMoreButton = document.createElement('span');
            readMoreButton.textContent = 'Read more';
            readMoreButton.classList.add('btn-link', 'fw-bold');
            readMoreButton.addEventListener('click', () => {
                if (readMoreButton.textContent === 'Read more') {
                    descriptionElement.textContent = fullDescription;
                    readMoreButton.textContent = 'Read less';
                } else {
                    descriptionElement.textContent = shortDescription;
                    readMoreButton.textContent = 'Read more';
                }
            });
            descriptionElement.appendChild(readMoreButton);
        }

        const contactElement = document.createElement('div');
        contactElement.classList.add('d-flex', 'gap-32', 'bt-1', 'pt-16','zona-contacto-oferta');

        if (jobOffer.whatsapp) {
            const whatsappLink = document.createElement('a');
            whatsappLink.href = `https://api.whatsapp.com/send?phone=${jobOffer.whatsapp}`;
            whatsappLink.textContent = '☎️ WhatsApp';
            whatsappLink.target = '_blank';
            contactElement.appendChild(whatsappLink);
        }

        if (jobOffer.mail) {
            const mailLink = document.createElement('a');
            mailLink.href = `mailto:${jobOffer.mail}`;
            mailLink.textContent = '✉️ Mail';
            contactElement.appendChild(mailLink);
        }

        jobOfferElement.appendChild(contactElement);

        // Agregar la oferta de empleo al contenedor
        jobOffersContainer.appendChild(jobOfferElement);
        });

        // Verificar si se han cargado todas las ofertas disponibles
        if (data.data.length === 0) {
            allJobOffersLoaded = true;
            const endMessageElement = document.createElement('p');
            if(!endMessageDisplayed){
                endMessageElement.textContent = 'There are no more offers available, we will publish more offers soon 😃';
                endMessageDisplayed = true;
            }
            
            jobOffersContainer.appendChild(endMessageElement);
        }

        loaderSimple.classList.add('d-none');
        
        page++; // Incrementa el número de página para la próxima carga
    })
    .catch(error => {
        console.error('Error:', error.message);
        // Manejar el error en caso de que ocurra
    });
    
}

// Función para verificar si se alcanzó el final de la página
function isBottomOfPage() { 

    var isBottomOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    return isBottomOfPage && !allJobOffersLoaded;
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

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    searchJobOffers();
});

function searchJobOffers() { 
    // Procesar los datos recibidos y mostrarlos en el frontend
    const jobOffersContainer = document.getElementById('job-offers-container');
    jobOffersContainer.textContent="";
    const loaderSimple = document.getElementById('loader-simple');
    loaderSimple.classList.remove('d-none');
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (searchQuery !== '') {
        // Realizar la solicitud HTTP al backend con el término de búsqueda
        fetch(`https://back.hugee.site/api/job-offers/search?query=${searchQuery}`)
            .then(response => {
                if (!response.ok) {
                    loaderSimple.textContent="Search error We will add more offers soon!";
                    throw new Error('Error when searching for job offers');
                }
                return response.json();
            })
            .then(data => {
                // Procesar los datos recibidos y mostrarlos en el frontend
                const jobOffersContainer = document.getElementById('job-offers-container');
        
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
        
                // Añadir evento de clic para eliminar
                btnEliminar.addEventListener('click', () => deleteJobOffer(jobOffer.id, jobOfferElement));

                // Añadir los botones al div de acciones
                //accionesDiv.appendChild(btnAprobar);
                accionesDiv.appendChild(btnEliminar);
        
                // Añadir el div de acciones al elemento de la oferta de empleo
                cardHeader.appendChild(accionesDiv);
                jobOfferElement.appendChild(cardHeader);
        
                const descriptionElement = document.createElement('p');
                const fullDescription = jobOffer.description;
                const shortDescription = fullDescription.length > 100 ? fullDescription.substring(0, 100) + '...' : fullDescription;
                descriptionElement.textContent = shortDescription;
                descriptionElement.classList.add('mt-0','pr-8', 'font-weight-landscape-300');
                jobOfferElement.appendChild(descriptionElement);
                if (fullDescription.length > 100) {
                    const readMoreButton = document.createElement('span');
                    readMoreButton.textContent = 'Read more';
                    readMoreButton.classList.add('btn-link', 'fw-bold');
                    readMoreButton.addEventListener('click', () => {
                        if (readMoreButton.textContent === 'Read more') {
                            descriptionElement.textContent = fullDescription;
                            readMoreButton.textContent = 'Read less';
                        } else {
                            descriptionElement.textContent = shortDescription;
                            readMoreButton.textContent = 'Read more';
                        }
                    });
                    descriptionElement.appendChild(readMoreButton);
                }
                
                const contactElement = document.createElement('div');
                contactElement.classList.add('d-flex', 'gap-32', 'bt-1', 'pt-16','zona-contacto-oferta');
        
                if (jobOffer.whatsapp) {
                    const whatsappLink = document.createElement('a');
                    whatsappLink.href = `https://api.whatsapp.com/send?phone=${jobOffer.whatsapp}`;
                    whatsappLink.textContent = '☎️ WhatsApp';
                    whatsappLink.target = '_blank';
                    contactElement.appendChild(whatsappLink);
                }
        
                if (jobOffer.mail) {
                    const mailLink = document.createElement('a');
                    mailLink.href = `mailto:${jobOffer.mail}`;
                    mailLink.textContent = '✉️ Mail';
                    contactElement.appendChild(mailLink);
                }
        
                jobOfferElement.appendChild(contactElement);
        
                // Agregar la oferta de empleo al contenedor
                jobOffersContainer.appendChild(jobOfferElement);
                });
        
                loaderSimple.classList.add('d-none');
                
            })
            .catch(error => {
                console.error('Error:', error.message);
                // Manejar el error en caso de que ocurra
            });
    } else {
        // El campo de búsqueda está vacío
        page = 1;
        loaderSimple.textContent="";
        loadMoreJobOffers()
    }
}

// Función para eliminar una oferta de trabajo
function deleteJobOffer(id, jobOfferElement) {
    fetch(`https://back.hugee.site/api/job-offers/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting job offer');
        }
        // Eliminar el elemento del DOM
        jobOfferElement.remove();
    })
    .catch(error => {
        console.error('Error:', error.message);
        // Manejar el error en caso de que ocurra
        alert('Error deleting job offer. Try again later.');
    });
}