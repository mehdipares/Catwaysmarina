// URL de l'API
console.log('reservations.js chargé avec succès');
const API_URL = 'http://localhost:3000/api/reservations';

// Charger les réservations existantes
window.loadReservations = async function () {
    try {
        console.log('Tentative de récupération des réservations...');
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erreur lors de la récupération des réservations :', error);
            return;
        }

        const reservations = await response.json();
        console.log('Réservations récupérées :', reservations);

        const tableBody = document.getElementById('reservationsTableBody');
        tableBody.innerHTML = ''; // Réinitialise le tableau

        reservations.forEach(reservation => {
            const catwayNumber = reservation.catwayNumber || 'Inconnu';
            const clientName = reservation.clientName || 'Inconnu';
            const boatName = reservation.boatName || 'Inconnu';
            const startDate = reservation.startDate
                ? new Date(reservation.startDate).toLocaleDateString()
                : 'Inconnue';
            const endDate = reservation.endDate
                ? new Date(reservation.endDate).toLocaleDateString()
                : 'Inconnue';

            const row = `
                <tr data-reservation="${reservation._id}">
                    <td>${catwayNumber}</td>
                    <td>${clientName}</td>
                    <td>${boatName}</td>
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td>
                        <button onclick="deleteReservation('${reservation._id}')">Supprimer</button>
                        <button onclick="showEditForm('${reservation._id}')">Modifier</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erreur lors du chargement des réservations :', error);
    }
};

// Ajouter une réservation
document.getElementById('addReservationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const catwayNumber = document.getElementById('catwayNumber').value;
    const clientName = document.getElementById('clientName').value;
    const boatName = document.getElementById('boatName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({ catwayNumber, clientName, boatName, startDate, endDate }),
        });

        if (response.ok) {
            alert('Réservation ajoutée avec succès !');
            location.reload();
        } else {
            const error = await response.json();
            alert('Erreur : ' + error.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la réservation :', error);
    }
});

// Supprimer une réservation
window.deleteReservation = async function (reservationId) {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
        try {
            const response = await fetch(`${API_URL}/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            });

            if (response.ok) {
                alert('Réservation supprimée avec succès !');
                location.reload();
            } else {
                const error = await response.json();
                alert('Erreur : ' + error.message);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la réservation :', error);
        }
    }
};

// Afficher le formulaire de modification
window.showEditForm = function (reservationId) {
    const formHtml = `
        <h3>Modifier la Réservation</h3>
        <form id="editReservationForm">
            <label for="catwayNumberEdit">Numéro du catway :</label>
            <input type="number" id="catwayNumberEdit" required>

            <label for="clientNameEdit">Nom du client :</label>
            <input type="text" id="clientNameEdit" required>

            <label for="boatNameEdit">Nom du bateau :</label>
            <input type="text" id="boatNameEdit" required>

            <label for="startDateEdit">Date de début :</label>
            <input type="date" id="startDateEdit" required>

            <label for="endDateEdit">Date de fin :</label>
            <input type="date" id="endDateEdit" required>

            <button type="submit">Modifier</button>
        </form>
    `;
    document.getElementById('editFormContainer').innerHTML = formHtml;

    document.getElementById('editReservationForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const catwayNumber = document.getElementById('catwayNumberEdit').value;
        const clientName = document.getElementById('clientNameEdit').value;
        const boatName = document.getElementById('boatNameEdit').value;
        const startDate = document.getElementById('startDateEdit').value;
        const endDate = document.getElementById('endDateEdit').value;

        try {
            const response = await fetch(`${API_URL}/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify({ catwayNumber, clientName, boatName, startDate, endDate }),
            });

            if (response.ok) {
                alert('Réservation modifiée avec succès !');
                location.reload();
            } else {
                const error = await response.json();
                alert('Erreur : ' + error.message);
            }
        } catch (error) {
            console.error('Erreur lors de la modification de la réservation :', error);
        }
    });
};

// Charger les réservations au chargement de la page
window.onload = loadReservations;