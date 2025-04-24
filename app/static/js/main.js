/**
 * Main JavaScript file for the Patient Outcomes Data Web Application
 * Handles table sorting, searching, archived data visibility, and error/sucess messages
 */

/**
 * Form validation function
 * Validates file input before form submission
 * @returns {boolean} Whether the form is valid
 */
function validateAndSubmit() {
    const fileInput = document.getElementById('file');
    const errorMessage = document.getElementById('errorMessage');

    if (!fileInput.files.length) {
        errorMessage.textContent = 'Please select a file to upload.';
        return false;
    }

    errorMessage.textContent = '';
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Flash Message Handler
     * Automatically removes flash messages after 5 seconds
     * Adds appropriate styling based on message type (success/error)
     */
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        if (message.textContent.toLowerCase().includes('success')) {
            message.classList.add('success');
        } else {
            message.classList.add('error');
        }
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    });

    // Initialize table functionality
    const table = document.getElementById('patient_outcomes-table');
    if (!table) return;
    
    /**
     * Sorting State Management
     * Tracks primary and secondary sort columns and their directions
     */
    let primarySortedColumn = 'patient_id'; // Default primary sort
    let secondarySortedColumn = 'recorded_at'; // Default secondary sort
    let primarySortDirection = 'asc';
    let secondarySortDirection = 'asc';

    // Initialize default sorting on page load
    initializeDefaultSorting();

    /**
     * Column Header Click Handlers
     * Sets up click events for sortable columns
     * Manages the sorting hierarchy (primary/secondary)
     */
    const headers = table.querySelectorAll('th.sortable');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-column');
            
            if (column === primarySortedColumn) {
                // Toggle primary sort direction if clicking the same column
                primarySortDirection = primarySortDirection === 'asc' ? 'desc' : 'asc';
                secondarySortDirection = 'asc'; // Reset secondary direction
            } else {
                // Set new primary column, move current primary to secondary
                secondarySortedColumn = primarySortedColumn;
                secondarySortDirection = primarySortDirection;
                primarySortedColumn = column;
                primarySortDirection = 'asc';
            }
            
            updateSortingIndicators();
            sortTable(table, primarySortedColumn, secondarySortedColumn, 
                     primarySortDirection, secondarySortDirection);
        });
    });

    /**
     * Initializes the default sorting state
     * Sets up visual indicators and performs initial sort
     */
    function initializeDefaultSorting() {
        const primaryHeader = table.querySelector(`th[data-column="${primarySortedColumn}"]`);
        const secondaryHeader = table.querySelector(`th[data-column="${secondarySortedColumn}"]`);
        
        if (primaryHeader) {
            primaryHeader.classList.add('primary', primarySortDirection);
            primaryHeader.setAttribute('data-sort-order', 'Primary Sort');
        }
        
        if (secondaryHeader) {
            secondaryHeader.classList.add('secondary', secondarySortDirection);
            secondaryHeader.setAttribute('data-sort-order', 'Secondary Sort');
        }
        
        sortTable(table, primarySortedColumn, secondarySortedColumn, 
                 primarySortDirection, secondarySortDirection);
    }

    /**
     * Updates the visual indicators for sorting
     * Shows which columns are being used for primary and secondary sorting
     */
    function updateSortingIndicators() {
        headers.forEach(header => {
            header.classList.remove('primary', 'secondary', 'asc', 'desc');
            header.removeAttribute('data-sort-order');
        });
        
        const primaryHeader = table.querySelector(`th[data-column="${primarySortedColumn}"]`);
        const secondaryHeader = table.querySelector(`th[data-column="${secondarySortedColumn}"]`);
        
        if (primaryHeader) {
            primaryHeader.classList.add('primary', primarySortDirection);
            primaryHeader.setAttribute('data-sort-order', 'Primary Sort');
        }
        
        if (secondaryHeader) {
            secondaryHeader.classList.add('secondary', secondarySortDirection);
            secondaryHeader.setAttribute('data-sort-order', 'Secondary Sort');
        }
    }

    /**
     * Performs the actual table sorting
     * @param {HTMLElement} table - The table element to sort
     * @param {string} primaryColumn - The primary sort column
     * @param {string} secondaryColumn - The secondary sort column
     * @param {string} primaryDir - The primary sort direction ('asc' or 'desc')
     * @param {string} secondaryDir - The secondary sort direction ('asc' or 'desc')
     */
    function sortTable(table, primaryColumn, secondaryColumn, primaryDir, secondaryDir) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Get column indices
        const headerRow = table.querySelector('thead tr');
        const headers = headerRow.querySelectorAll('th');
        let primaryIndex = -1;
        let secondaryIndex = -1;

        for (let i = 0; i < headers.length; i++) {
            if (headers[i].getAttribute('data-column') === primaryColumn) {
                primaryIndex = i;
            }
            if (headers[i].getAttribute('data-column') === secondaryColumn) {
                secondaryIndex = i;
            }
        }

        if (primaryIndex === -1 || secondaryIndex === -1) return;

        // Sort the rows
        rows.sort((a, b) => {
            const aPrimaryValue = a.cells[primaryIndex].textContent.trim();
            const bPrimaryValue = b.cells[primaryIndex].textContent.trim();
            const aSecondaryValue = a.cells[secondaryIndex].textContent.trim();
            const bSecondaryValue = b.cells[secondaryIndex].textContent.trim();

            // First sort by primary column
            const primaryComparison = primaryDir === 'asc' 
                ? aPrimaryValue.localeCompare(bPrimaryValue) 
                : bPrimaryValue.localeCompare(aPrimaryValue);

            // If primary values are equal, sort by secondary column
            if (primaryComparison === 0) {
                return secondaryDir === 'asc'
                    ? aSecondaryValue.localeCompare(bSecondaryValue)
                    : bSecondaryValue.localeCompare(aSecondaryValue);
            }
            return primaryComparison;
        });

        // Update the table with sorted rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        rows.forEach(row => {
            tbody.appendChild(row);
        });
    }

    /**
     * Archived Data Visibility Toggle
     * Handles showing/hiding of archived patient records
     */
    const showArchivedCheckbox = document.getElementById('show-archived');
    if (showArchivedCheckbox) {
        const inactiveRows = document.querySelectorAll('tr.inactive');
        inactiveRows.forEach(row => {
            if (showArchivedCheckbox.checked) {
                row.classList.add('show-archived');
            }
        });
        
        showArchivedCheckbox.addEventListener('change', function() {
            const inactiveRows = document.querySelectorAll('tr.inactive');
            inactiveRows.forEach(row => {
                if (this.checked) {
                    row.classList.add('show-archived');
                } else {
                    row.classList.remove('show-archived');
                }
            });
        });
    }
    
    /**
     * Patient Search Functionality
     * Filters the table rows based on patient ID search
     */
    const searchInput = document.getElementById('patient-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const patientId = row.getAttribute('data-patient-id').toLowerCase();
                if (patientId.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});