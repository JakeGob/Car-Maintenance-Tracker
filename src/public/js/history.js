const tableBody = document.getElementById('history-tbody');


async function loadHistory(){
    try {
        const res = await fetch('/api/logs');
        if (!res.ok) {
            console.error('Failed to load logs', res.status);
            return;
        }
        const records = await res.json();
        tableBody.innerHTML = '';

        records.forEach(record => {
        record.service_date = new Date(record.service_date).toLocaleDateString('en-US', { timeZone: 'UTC' });
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button class="delete-btn" data-id="${record.id}">X</button></td>
            <td data-label="Service Date">${record.service_date}</td>
            <td data-label="Car Model">${record.car_model}</td>
            <td data-label="Service Type">${record.service_type}</td>
            <td data-label="Mileage">${record.mileage}</td>
            <td data-label="Cost">$${record.cost}</td>
            <td data-label="Notes">${record.notes || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });

    DeleteListener();

    } catch (err) {
        console.error('Error loading history', err);
    }
}

function DeleteListener() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const id = this.dataset.id;
            
            if (confirm('Are you sure you want to delete this record?')) {
                await deleteLog(id);
            }
        });
    });
}

async function deleteLog(id) {
    try {
        const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' });
        if(!res.ok){
            console.error('Failed to delete log', res.status);
            alert('Failed to delete record');
            return;
        }
        await loadHistory();
        alert('Record deleted successfully!');
    } catch (err) {
        console.error('Error deleting log', err);
        alert('Error deleting record');
    }
}

document.addEventListener('DOMContentLoaded', loadHistory);

