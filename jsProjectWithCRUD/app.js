const localDB = new PouchDB('sleep-quality-local');
const remoteDB = new PouchDB('http://admin:mtu12345@localhost:5984/sleep-quality');

let syncHandler = null;

function initializeSync() {
    syncHandler = localDB.sync(remoteDB, {
        live: true,
        retry: true
    }).on('change', function (info) {
        console.log('Sync change:', info);
        updateSyncStatus('Syncing...');
    }).on('paused', function () {
        console.log('Sync paused');
        updateSyncStatus('Connected (Offline-first)');
    }).on('active', function () {
        console.log('Sync active');
        updateSyncStatus('Syncing...');
    }).on('denied', function (err) {
        console.log('Sync denied:', err);
        updateSyncStatus('Sync denied');
    }).on('complete', function (info) {
        console.log('Sync complete:', info);
        updateSyncStatus('Sync complete');
    }).on('error', function (err) {
        console.log('Sync error:', err);
        updateSyncStatus('Connection error - Working offline');
    });
}

function updateSyncStatus(status) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

function checkSyncStatus() {
    remoteDB.info().then(function (info) {
        updateSyncStatus('Connected (Offline-first)');
        initializeSync();
    }).catch(function (err) {
        updateSyncStatus('Offline mode - Will sync when connection restored');
        console.log('Remote database not available:', err);
    });
}

function syncData() {
    updateSyncStatus('Syncing...');
    localDB.sync(remoteDB).then(function (result) {
        updateSyncStatus('Sync complete');
        showMessage('Sync completed successfully!', 'success');
    }).catch(function (err) {
        updateSyncStatus('Sync failed');
        showMessage('Sync failed: ' + err.message, 'error');
    });
}

function createRecord() {
    const form = document.getElementById('createForm');
    const formData = new FormData(form);
    
    const newDocument = {
        "Person ID": parseInt(formData.get('personId')),
        "Gender": formData.get('gender'),
        "Age": parseInt(formData.get('age')),
        "Occupation": formData.get('occupation'),
        "Sleep Duration": parseFloat(formData.get('sleepDuration')),
        "Quality of Sleep": parseInt(formData.get('qualityOfSleep')),
        "Physical Activity Level": parseInt(formData.get('physicalActivityLevel')),
        "Stress Level": parseInt(formData.get('stressLevel')),
        "BMI Category": formData.get('bmiCategory'),
        "Blood Pressure": formData.get('bloodPressure'),
        "Heart Rate": parseInt(formData.get('heartRate')),
        "Daily Steps": parseInt(formData.get('dailySteps')),
        "Sleep Disorder": formData.get('sleepDisorder')
    };
    
    localDB.post(newDocument).then(function (response) {
        showMessage('Document created successfully! ID: ' + response.id, 'success');
        form.reset();
    }).catch(function (err) {
        showMessage('Error creating document: ' + err.message, 'error');
    });
}

function searchById() {
    const searchId = document.getElementById('searchId').value.trim();
    if (!searchId) {
        showMessage('Please enter a document ID', 'error');
        return;
    }
    
    localDB.get(searchId).then(function (doc) {
        displaySearchResults([doc]);
    }).catch(function (err) {
        if (err.name === 'not_found') {
            showMessage('Document not found with ID: ' + searchId, 'error');
        } else {
            showMessage('Error searching: ' + err.message, 'error');
        }
        displaySearchResults([]);
    });
}

function viewAllRecords() {
    localDB.allDocs({
        include_docs: true
    }).then(function (result) {
        const docs = result.rows.map(row => row.doc);
        displaySearchResults(docs);
    }).catch(function (err) {
        showMessage('Error loading records: ' + err.message, 'error');
    });
}

function displaySearchResults(docs) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (docs.length === 0) {
        resultsContainer.innerHTML = '<p>No records found.</p>';
        return;
    }
    
    let html = '<h3>Search Results (' + docs.length + ' documents found)</h3>';
    
    docs.forEach(function (doc) {
        html += '<div class="record-card" style="border: 1px solid #ccc; margin: 10px 0; padding: 10px;">';
        html += '<h4>Document ID: ' + doc._id + '</h4>';
        html += '<p><strong>Person ID:</strong> ' + doc["Person ID"] + '</p>';
        html += '<p><strong>Gender:</strong> ' + doc["Gender"] + '</p>';
        html += '<p><strong>Age:</strong> ' + doc["Age"] + '</p>';
        html += '<p><strong>Occupation:</strong> ' + doc["Occupation"] + '</p>';
        html += '<p><strong>Sleep Duration:</strong> ' + doc["Sleep Duration"] + ' hours</p>';
        html += '<p><strong>Quality of Sleep:</strong> ' + doc["Quality of Sleep"] + '/10</p>';
        html += '<p><strong>Physical Activity Level:</strong> ' + doc["Physical Activity Level"] + '</p>';
        html += '<p><strong>Stress Level:</strong> ' + doc["Stress Level"] + '/10</p>';
        html += '<p><strong>BMI Category:</strong> ' + doc["BMI Category"] + '</p>';
        html += '<p><strong>Blood Pressure:</strong> ' + doc["Blood Pressure"] + '</p>';
        html += '<p><strong>Heart Rate:</strong> ' + doc["Heart Rate"] + ' bpm</p>';
        html += '<p><strong>Daily Steps:</strong> ' + doc["Daily Steps"] + '</p>';
        html += '<p><strong>Sleep Disorder:</strong> ' + doc["Sleep Disorder"] + '</p>';
        html += '<p><em>Revision: ' + doc._rev + '</em></p>';
        html += '</div>';
    });
    
    resultsContainer.innerHTML = html;
}

function loadDocumentForUpdate() {
    const searchId = document.getElementById('updateSearchId').value.trim();
    if (!searchId) {
        showMessage('Please enter a document ID', 'error');
        return;
    }
    
    localDB.get(searchId).then(function (doc) {
        document.getElementById('docId').value = doc._id;
        document.getElementById('docRev').value = doc._rev;
        document.getElementById('updatePersonId').value = doc["Person ID"];
        document.getElementById('updateGender').value = doc["Gender"];
        document.getElementById('updateAge').value = doc["Age"];
        document.getElementById('updateOccupation').value = doc["Occupation"];
        document.getElementById('updateSleepDuration').value = doc["Sleep Duration"];
        document.getElementById('updateQualityOfSleep').value = doc["Quality of Sleep"];
        document.getElementById('updatePhysicalActivityLevel').value = doc["Physical Activity Level"];
        document.getElementById('updateStressLevel').value = doc["Stress Level"];
        document.getElementById('updateBmiCategory').value = doc["BMI Category"];
        document.getElementById('updateBloodPressure').value = doc["Blood Pressure"];
        document.getElementById('updateHeartRate').value = doc["Heart Rate"];
        document.getElementById('updateDailySteps').value = doc["Daily Steps"];
        document.getElementById('updateSleepDisorder').value = doc["Sleep Disorder"];
        
        document.getElementById('updateFormSection').style.display = 'block';
        showMessage('Document loaded successfully. You can now edit the fields below.', 'success');
    }).catch(function (err) {
        if (err.name === 'not_found') {
            showMessage('Document not found with ID: ' + searchId, 'error');
        } else {
            showMessage('Error loading document: ' + err.message, 'error');
        }
    });
}

function updateRecord() {
    const docId = document.getElementById('docId').value;
    const docRev = document.getElementById('docRev').value;
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);
    
    const updatedDocument = {
        _id: docId,
        _rev: docRev,
        "Person ID": parseInt(formData.get('personId')),
        "Gender": formData.get('gender'),
        "Age": parseInt(formData.get('age')),
        "Occupation": formData.get('occupation'),
        "Sleep Duration": parseFloat(formData.get('sleepDuration')),
        "Quality of Sleep": parseInt(formData.get('qualityOfSleep')),
        "Physical Activity Level": parseInt(formData.get('physicalActivityLevel')),
        "Stress Level": parseInt(formData.get('stressLevel')),
        "BMI Category": formData.get('bmiCategory'),
        "Blood Pressure": formData.get('bloodPressure'),
        "Heart Rate": parseInt(formData.get('heartRate')),
        "Daily Steps": parseInt(formData.get('dailySteps')),
        "Sleep Disorder": formData.get('sleepDisorder')
    };

    localDB.put(updatedDocument).then(function (response) {
        showMessage('Document updated successfully!', 'success');
        cancelUpdate();
    }).catch(function (err) {
        showMessage('Error updating document: ' + err.message, 'error');
    });
}
function cancelUpdate() {
    document.getElementById('updateFormSection').style.display = 'none';
    document.getElementById('updateSearchId').value = '';
    document.getElementById('updateForm').reset();
}

function confirmDelete() {
    if (!window.docToDelete) {
        showMessage('No document loaded for deletion', 'error');
        return;
    }
    
    localDB.remove(window.docToDelete).then(function (response) {
        showMessage('Document deleted successfully!', 'success');
        cancelDelete();
    }).catch(function (err) {
        showMessage('Error deleting document: ' + err.message, 'error');
    });
}

function deleteDocument() { 
    const deleteId = document.getElementById('deleteId').value.trim();
    if (!deleteId) {
        showMessage('Please enter a document ID', 'error');
        return;
    }
    
    localDB.get(deleteId).then(function (doc) {
        return localDB.remove(doc);
    }).then(function (response) {
        showMessage('Document deleted successfully!', 'success');
        document.getElementById('deleteId').value = '';
    }).catch(function (err) {
        if (err.name === 'not_found') {
            showMessage('Document not found with ID: ' + deleteId, 'error');
        } else {
            showMessage('Error deleting document: ' + err.message, 'error');
        }
    });
}

function cancelDelete() {
    document.getElementById('deletePreviewSection').style.display = 'none';
    document.getElementById('deleteSearchId').value = '';
    window.docToDelete = null;
}

function showMessage(message, type) {
    let messageContainer = document.getElementById('message') || 
                          document.getElementById('updateMessage') || 
                          document.getElementById('deleteMessage');
    
    if (messageContainer) {
        messageContainer.innerHTML = '<p style="color: ' + (type === 'error' ? 'red' : 'green') + ';">' + message + '</p>';
        
        setTimeout(function() {
            messageContainer.innerHTML = '';
        }, 5000);
    } else {
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkSyncStatus();
});