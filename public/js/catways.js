// URL de l'API
console.log('catways.js chargé avec succès');
const API_URL = 'http://localhost:3000/api/catways';

// Ajouter un nouveau catway
window.addCatway = async function (event) {
    event.preventDefault();
    const catwayNumber = document.getElementById('catwayNumber').value;
    const catwayType = document.getElementById('catwayType').value;
    const catwayState = document.getElementById('catwayState').value;

    console.log('Tentative d\'ajout d\'un catway :', {
        catwayNumber,
        catwayType,
        catwayState,
    });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'), // Token JWT
            },
            body: JSON.stringify({ catwayNumber, catwayType, catwayState }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Réponse de l\'API après ajout :', data);
            alert('Catway ajouté avec succès !');
            location.reload(); // Recharge la page
        } else {
            const error = await response.json();
            console.error('Erreur retournée par l\'API :', error);
            alert('Erreur : ' + error.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du catway :', error);
    }
};

// Supprimer un catway
window.deleteCatway = async function (catwayNumber) {
    if (confirm('Voulez-vous vraiment supprimer ce catway ?')) {
        try {
            const response = await fetch(`${API_URL}/${catwayNumber}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            });

            if (response.ok) {
                alert('Catway supprimé avec succès !');
                location.reload();
            } else {
                const error = await response.json();
                alert('Erreur : ' + error.message);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du catway :', error);
        }
    }
};

// Afficher le formulaire de modification
window.showEditForm = function (catwayNumber) {
    console.log(`Affichage du formulaire pour modifier le catway ${catwayNumber}`);
    const formHtml = `
        <h3>Modifier le Catway ${catwayNumber}</h3>
        <form id="editCatwayForm">
            <label for="statusEdit">Nouvel état :</label>
            <input type="text" id="statusEdit" name="status" required>
            <button type="submit">Modifier</button>
        </form>
    `;
    document.getElementById('editFormContainer').innerHTML = formHtml;

    document.getElementById('editCatwayForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const catwayState = document.getElementById('statusEdit').value;

        console.log(`Modification du catway ${catwayNumber} avec le nouvel état : ${catwayState}`);

        try {
            const response = await fetch(`${API_URL}/${catwayNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify({ catwayState }), // Assurez-vous d'envoyer "catwayState"
            });

            if (response.ok) {
                const updatedCatway = await response.json();
                console.log('Catway modifié avec succès :', updatedCatway);

                alert('Catway modifié avec succès !');
                location.reload(); // Recharge la page après modification
            } else {
                const error = await response.json();
                console.error('Erreur lors de la modification du catway :', error);
                alert('Erreur : ' + error.message);
            }
        } catch (error) {
            console.error('Erreur lors de la modification du catway :', error);
        }
    });
};