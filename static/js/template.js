// Helper function to create input elements
//function createInput(type, className, value, required) {
//    const input = document.createElement('input');
//    input.type = type;
//    input.className = className;
//    if (value) input.value = value;
//    if (required) input.required = true;
//    return input;
//}

function addPartAQuestion() {
    const tbody = document.getElementById('partABody');
    const row = document.createElement('tr');
    const currentQCount = tbody.children.length;

    row.innerHTML = `
        <td>1</td>
        <td class="sub-question-label">${String.fromCharCode(97 + currentQCount)}</td>
        <td>
            <select class="form-select" required>
                <option value="">Select Unit</option>
                ${[1,2,3,4,5].map(i => `<option value="${i}">Unit ${i}</option>`).join('')}
            </select>
        </td>
        <td>2</td>
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeQuestion(this)">Remove</button>
        </td>
    `;
    tbody.appendChild(row);
    updatePartAData();
}

function addPartBQuestion() {
    const tbody = document.getElementById('partBBody');
    const currentQCount = tbody.children.length;
    const nextQNo = Math.floor(currentQCount / 2) + 2;

    // Add two rows for the OR question pair
    for(let i = 0; i < 2; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nextQNo}</td>
            <td>
                <select class="form-select" required>
                    <option value="">Select Unit</option>
                    ${[1,2,3,4,5].map(i => `<option value="${i}">Unit ${i}</option>`).join('')}
                </select>
            </td>
            <td>
                <input type="number" class="form-control marks-input" value="8" min="2" max="16" required>
            </td>
            <td></td>
            <td></td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeQuestion(this)">Remove</button>
            </td>
        `;
        tbody.appendChild(row);
    }
    updatePartBData();
}

function removeQuestion(button) {
    const row = button.closest('tr');
    const tbody = row.parentElement;
    tbody.removeChild(row);

    // Update question numbers and sub-question labels
    if(tbody.id === 'partABody') {
        Array.from(tbody.children).forEach((row, index) => {
            row.children[1].textContent = String.fromCharCode(97 + index);
        });
        updatePartAData();
    } else {
        Array.from(tbody.children).forEach((row, index) => {
            row.children[0].textContent = Math.floor(index / 2) + 2;
        });
        updatePartBData();
    }
}

function updatePartAData() {
    const tbody = document.getElementById('partABody');
    const data = Array.from(tbody.children).map(row => ({
        qno: row.children[0].textContent,
        sub_qno: row.children[1].textContent,
        unit: row.children[2].querySelector('select').value,
        marks: 2
    }));
    document.getElementById('partAData').value = JSON.stringify(data);
}

function updatePartBData() {
    const tbody = document.getElementById('partBBody');
    const data = Array.from(tbody.children).map(row => ({
        qno: row.children[0].textContent,
        unit: row.children[1].querySelector('select').value,
        marks: row.children[2].querySelector('input').value
    }));
    document.getElementById('partBData').value = JSON.stringify(data);
}

// Add event listeners for dynamic inputs
document.addEventListener('change', function(e) {
    if(e.target.matches('#partABody select')) {
        updatePartAData();
    } else if(e.target.matches('#partBBody select') || e.target.matches('#partBBody input')) {
        updatePartBData();
    }
});

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePartAData();
    updatePartBData();
});