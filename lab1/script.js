let softwareList = JSON.parse(localStorage.getItem('lab_software_db')) || [];
let editId = null;

const form = document.getElementById('softwareForm');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const filterLicense = document.getElementById('filterLicense');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        const data = {
            name: document.getElementById('name').value,
            licenseType: document.getElementById('licenseType').value,
            version: document.getElementById('version').value,
            installDate: document.getElementById('installDate').value
        };

        if (editId) {
            updateItem(editId, data);
        } else {
            addItem(data);
        }

        resetForm();
        render();
    }
});

tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    const id = row.dataset.id;

    if (e.target.classList.contains('delete-btn')) {
        deleteItem(id);
    } else if (e.target.classList.contains('edit-btn')) {
        prepareEdit(id);
    }
});

searchInput.addEventListener('input', render);
filterLicense.addEventListener('change', render);

function addItem(data) {
    const newItem = { ...data, id: Date.now().toString() };
    softwareList.push(newItem);
    save();
}

function updateItem(id, data) {
    softwareList = softwareList.map(item => item.id === id ? { ...data, id } : item);
    save();
}

function deleteItem(id) {
    if (confirm('Видалити цей запис?')) {
        softwareList = softwareList.filter(item => item.id !== id);
        save();
        render();
    }
}

function prepareEdit(id) {
    const item = softwareList.find(i => i.id === id);
    if (!item) return;

    document.getElementById('name').value = item.name;
    document.getElementById('licenseType').value = item.licenseType;
    document.getElementById('version').value = item.version;
    document.getElementById('installDate').value = item.installDate;

    editId = id;
    submitBtn.textContent = 'Оновити дані';
    formTitle.textContent = 'Редагування запису';
    document.getElementById('name').focus();
}

function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        const errorDiv = document.getElementById(`${input.id}Error`);
        if (!input.value.trim()) {
            input.classList.add('invalid');
            if (errorDiv) errorDiv.style.display = 'block';
            isValid = false;
        } else {
            input.classList.remove('invalid');
            if (errorDiv) errorDiv.style.display = 'none';
        }
    });
    return isValid;
}

function resetForm() {
    form.reset();
    editId = null;
    submitBtn.textContent = 'Зберегти запис';
    formTitle.textContent = 'Додати ПЗ';
}

function save() {
    localStorage.setItem('lab_software_db', JSON.stringify(softwareList));
}

function render() {
    const search = searchInput.value.toLowerCase();
    const filter = filterLicense.value;

    tableBody.innerHTML = '';

    const filtered = softwareList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search);
        const matchesFilter = filter === 'all' || item.licenseType === filter;
        return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => a.name.localeCompare(b.name));

    filtered.forEach(item => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.licenseType}</td>
            <td>${item.version}</td>
            <td>${item.installDate}</td>
            <td class="actions">
                <button class="edit-btn">Редагувати</button>
                <button class="delete-btn">Видалити</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

render();