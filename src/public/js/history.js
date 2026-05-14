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
            <td data-label="Service Date">${record.service_date}</td>
            <td data-label="Car Model">${record.car_model}</td>
            <td data-label="Service Type">${record.service_type}</td>
            <td data-label="Mileage">${record.mileage}</td>
            <td data-label="Cost">$${Number(record.cost || 0).toFixed(2)}</td>
            <td data-label="Notes">${record.notes || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });

    } catch (err) {
        console.error('Error loading history', err);
    }
}

document.addEventListener('DOMContentLoaded', loadHistory);
