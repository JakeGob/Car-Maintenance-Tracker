const totalServices = document.getElementById('total-services');
const totalCost = document.getElementById('total-money');
const mostRecentService = document.getElementById('last-service');

async function loadStats(){
    try {
        const res = await fetch('/api/stats');
        if (!res.ok) {
            console.error('Failed to load stats', res.status);
            return;
        }
        const stats = await res.json();
        totalServices.innerText = stats.total_services || 0;
        totalCost.innerText = `$${stats.total_cost || 0}`;
        
        if (stats.most_recent_date !== 'N/A'){
            mostRecentService.innerText = new Date(stats.most_recent_date).toLocaleDateString('en-US', { timeZone: 'UTC' });
        } else {
            mostRecentService.innerText = 'N/A';
        }

    } catch (error) {
        console.error('Error loading stats', error);
    }
}
loadStats();