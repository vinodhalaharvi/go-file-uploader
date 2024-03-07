// This function should be responsible for the actual file upload logic
function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file); // Use the 'file' from the parameter
    console.log(file); // Log the file object for debugging

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const uploadedFiles = document.getElementById('uploaded-files');
            const preview = document.createElement('div');
            preview.innerHTML = `<img src="${data.file}" width="100" height="100">`; // Make sure the data.file corresponds to a valid URL
            uploadedFiles.appendChild(preview);
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded')
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');

    // Add event listeners for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        console.log(eventName)
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        console.log('preventDefaults')
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        console.log(eventName)
        dropArea.addEventListener(eventName, () => dropArea.classList.add('active'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        console.log(eventName)
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('active'), false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        console.log('handleDrop')
        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        ([...files]).forEach(file => {
            uploadFile(file);
        });
    }
});

// Optional: Add any additional functions or event listeners as needed.
