//selectores
const mascotNameInput = document.querySelector('#name_pet');
const namePersonInput = document.querySelector('#name_person');
const phoneInput = document.querySelector('#phone_person');
const dateCiteInput = document.querySelector('#date_cite');
const timeCiteInput = document.querySelector('#time_cite');
const descriptionInput = document.querySelector('#description');

//Contenedor de la tarjeta
const cardContainer = document.querySelector('.container-cites');

//Boton en cada tarjeta de cita
//Boton editar
const editCite = document.querySelector('.editar');

//Boton guardar
const btnSave = document.querySelector('#btnSave');

//Guarda las citas
let cites = [];

//carga del DOM
document.addEventListener('DOMContentLoaded', () => 
{
    //Obtiene los datos del localStorage y los asigna al mismo objeto de citas
    cites = JSON.parse(localStorage.getItem('citeStorage')) || [];

    //Carga el html al recargar la pagina
    addCiteHtml();
});
    
//Boton guardar cita
btnSave.addEventListener('click', () =>
{
    //Añadir una cita
    deleteHtml();
    
    //Agrega datos al objeto del arreglo
    addCite();

    //Añade la cita al html
    addCiteHtml();

    //sincronizamos el storage cuando le damos enviar o editar
    storage();
})

//Llenar objeto agregando la cita
function addCite()
{   
    //Objeto cita
    const cite = 
    {
        id: null,
        mascot: null,
        own: null,
        phone: null,
        date: null,
        hour: null,
        description: null,
    } 

    //llenar el objeto con una cita
    cite.mascot = mascotNameInput.value;
    cite.own = namePersonInput.value;
    cite.phone = phoneInput.value;
    cite.date = dateCiteInput.value;
    cite.hour = timeCiteInput.value;
    cite.description = descriptionInput.value;
    cite.id = Date.now();

    //Validar que se agrego una cita nueva
    if(alerta())
    {    
        //Añadir el objeto al arreglo
        cites.push(cite);
    }
}

//Alerta
function alerta()
{
    //Elemento donde se agrega la alerta
    const citesAlert = document.querySelector('.citasContainer h4');
    //Contenedor de la alerta
    const alerta = document.createElement('div');
    
    //Funcion de mostrar alerta(hacer los selectores globales)
    if(mascotNameInput.value === '' || namePersonInput.value === '' || phoneInput.value === '' || dateCiteInput.value === '' || timeCiteInput.value === '' || descriptionInput.value === '')
    {
        alerta.innerHTML = `<div class="alert alert-danger" role="alert">
                                Todos los campos son obligatorios!
                            </div>`;

        //Agregar alerta
        citesAlert.before(alerta, citesAlert);
    
        //Eliminar alerta despues de 2 segundos
        setTimeout(() =>
        {
            alerta.remove();
        },1500);
        
        //Retorna que no se agrego ninguna cita
        return false;
    }
    
    //mensaje de ingresar todos los datos
    alerta.innerHTML = `<div class="alert alert-success" role="alert">
                            Cita guardada satisfactoriamente!
                        </div>`;

    //Agregar alerta              
    citesAlert.before(alerta, citesAlert);

    //Eliminar el mensaje
    setTimeout(() =>
    {
        alerta.remove();
    },2000)

    //reset formulario
    document.querySelector('.form').reset();

    //Retorna que se agrego una cita
    return true;
}


function addCiteHtml()
{
    //Recorremos cada objeto para mostrar las citas con los diferentes datos
    cites.forEach(cita =>
    {
        let cardFull = document.createElement('div');
        //Contenedor Template tarjeta
        //Template de la tarjeta
        cardFull.innerHTML = `
                                <div class="card_cite">
                                    <div class="card-body">
                                        <h5 class="card-title fs-3 fw-bold">${cita.mascot}</h5>
                                        <p class="card-text">
                                            <div class="d-flex gap-2">
                                            <span class="fw-bold">Propietario:</span>
                                            <span>${cita.own}</span>
                                            </div>
                                            <div class="d-flex gap-2">
                                            <span class="fw-bold">Telefono:</span>
                                            <span>${cita.phone}</span>
                                            </div>
                                            <div class="d-flex gap-2">
                                            <span class="fw-bold">Fecha:</span>
                                            <span>${cita.date}</span>
                                            </div>
                                            
                                            <div class="d-flex gap-2">
                                            <span class="fw-bold">Hora:</span>
                                            <span>${cita.hour}</span>
                                            </div>
                                            <div class="d-flex gap-2">
                                            <span class="fw-bold">Sintomas:</span>
                                            <span>${cita.description}</span>
                                            </div>
                                        </p>
                                    </div>
                                </div>
        `;

        //creacion de botones
        const btnDeleteCite = document.createElement('button');
        const btnEditCite = document.createElement('button');

        btnDeleteCite.textContent = 'Eliminar';
        btnEditCite.textContent = 'Editar';

        //Le agrego las clases a los botones
        btnEditCite.classList.add('btn', 'btn-primary', 'mx-3', 'editar');
        btnDeleteCite.classList.add('btn', 'btn-danger', 'mx-3', 'eliminar');

        btnDeleteCite.setAttribute('id', cita.id);

        //Añado cada boton a cada tarjeta
        cardFull.appendChild(btnEditCite);
        cardFull.appendChild(btnDeleteCite);
        
        //Agregamos cada tarjeta al html
        cardContainer.appendChild(cardFull);

        //Cambia el texto del boton
        btnSave.textContent = 'Guardar';

        //boton de borrar seleccionado
        btnDeleteCite.addEventListener('click', () =>
        {
            //Borrar del html
            deleteHtml();

            //Borrar del arreglo
            deleteCite(cita.id);

            //Añadir el nuevo contenedor con citas actualizadas
            addCiteHtml();

            //Sincronizar el storage
            storage();
        });

        //Editar objeto y html
        btnEditCite.addEventListener('click', () =>
        {   
            //Editar el objeto
            editCiteMode(cita.id);

            //Reiniciar objeto para volver a llenar los inputs
            reiniciarObjeto(cita);

            //Borra del arreglo el anterior
            deleteCite(cita.id);

            //Sincronizar el storage
            storage();
        });
    });
}

//Elimina del arreglo la cita
function deleteCite(id)
{
    //Eliminamos del arreglo
    cites = cites.filter(cita => cita.id !== id);
}

//Elimina las anteriores tarjetas para agregar las actualizadas
function deleteHtml()
{
    while (cardContainer.firstChild) 
    {
        cardContainer.removeChild(cardContainer.firstChild);
    }
}

//Modo editar, me llena los inputs con el objeto seleccionado
function editCiteMode(id)
{
    const citeToEdit = cites.find(cita => cita.id === id);

    if (citeToEdit) 
    {
        const { mascot, own, phone, date, hour, description } = citeToEdit;

        // Asignar valores al formulario
        mascotNameInput.value = mascot;
        namePersonInput.value = own;
        phoneInput.value = phone;
        dateCiteInput.value = date;
        timeCiteInput.value = hour;
        descriptionInput.value = description;

        // Cambiar el texto del botón
        btnSave.textContent = 'Editar';
    }
}

//Reiniciamos el objeto
function reiniciarObjeto(cite)
{
	cite.mascot = '';
	cite.own = '';
	cite.phone = '';
	cite.date = '';
	cite.hour = '';
	cite.description = '';
    cite.id = '';
}

//localStorage
function storage()
{
    localStorage.setItem('citeStorage', JSON.stringify(cites));
}