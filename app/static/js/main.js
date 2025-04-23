document.addEventListener('DOMContentLoaded', function() {
    // Get the table element
    // const table = document.getElementById('data-table');      TODO: REmove later
    const table = document.getElementById('patient_outcomes-table');
    
    if (!table) return;
    
    // Add click event listeners to sortable column headers
    const headers = table.querySelectorAll('th.sortable');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-column');
            const isAsc = this.classList.contains('asc');
            
            // Remove sorting classes from all headers
            headers.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            
            // Add appropriate sorting class to clicked header
            this.classList.add(isAsc ? 'desc' : 'asc');
            
            // Sort the table
            sortTable(table, column, !isAsc);
        });
    });
});

function sortTable(table, column, asc) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Get the index of the column to sort by
    const headerRow = table.querySelector('thead tr');
    const headers = headerRow.querySelectorAll('th');
    let columnIndex = -1;
    
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].getAttribute('data-column') === column) {
            columnIndex = i;
            break;
        }
    }
    
    if (columnIndex === -1) return;
    
    // Sort the rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Check if values are numbers
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return asc ? aNum - bNum : bNum - aNum;
        }
        
        // Otherwise, sort as strings
        return asc 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
    });
    
    // Remove existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    
    // Add sorted rows
    rows.forEach(row => {
        tbody.appendChild(row);
    });
} 