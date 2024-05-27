document.getElementById('new-offer').addEventListener('submit', function(event) {
    event.preventDefault();

    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var whatsapp = document.getElementById('whatsapp').value;
    var mail = document.getElementById('mail').value;

     // Validar que al menos uno de los campos email o whatsapp esté lleno
     if (!whatsapp && !mail) {
        var error ='Error: Debes proporcionar al menos un número de WhatsApp o una dirección de correo electrónico.';
        console.error(error);
        var successMessage = document.getElementById('success-message');
        successMessage.classList.remove('show-message');
        var errorMessage = document.getElementById('error-message');
        errorMessage.innerText = error;
        errorMessage.classList.add('show-message');
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://back.hugee.site/api/job-offers', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200 || xhr.status === 201) {
                var response = JSON.parse(xhr.responseText);
                var message = response.message;
                console.log('message:', message);
                // Aquí podrías redireccionar a otra página, mostrar un mensaje de éxito, etc.
                var errorMessage = document.getElementById('error-message');
                errorMessage.classList.remove('show-message');
                var successMessage = document.getElementById('success-message');
                successMessage.innerText = message + "Será redirigido al listado de ofertas. . .";
                successMessage.classList.add('show-message');
                // Publicación exitosa, redirigir a las ofertas
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 3000); 
                
            } else {
                var response = JSON.parse(xhr.responseText);
                var error = response.error;
                var errors = response.errors || 'Error no identificado.';
                var message = response.message || 'Ocurrió un error al procesar la solicitud.';
                console.error('Error:', error);
                console.error('Detalles del error:', errors);
                console.error('Message:', message);
                var successMessage = document.getElementById('success-message');
                successMessage.classList.remove('show-message');
                var errorMessage = document.getElementById('error-message');
                errorMessage.innerText = message + ': ' + error;
                errorMessage.classList.add('show-message');
                // Aquí podrías mostrar un mensaje de error al usuario
            }
        }
    };

    var data = JSON.stringify({ 
        title: title,
        description: description,
        whatsapp: whatsapp,
        mail: mail
    });
    xhr.send(data);
});
