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
        const dt = e.dataTransfer;
        const files = dt.files;
        console.log(files)
        handleFiles(files);
    }

    function handleFiles(files) {
        const formData = new FormData();
        [...files].forEach(file => {
            formData.append('files', file); // 'files' to match the form key expected by Gin
        });

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const uploadedFiles = document.getElementById('uploaded-files');
                const preview = document.createElement('div');
                data.files.forEach(file => {
                    // Create a new preview element for each file
                    const filePreview = document.createElement('div');
                    filePreview.innerHTML = `<img src="/static/${file.Filename}" width="100" height="100">`; // Adjust the path as needed
                    uploadedFiles.appendChild(filePreview);
                });                // preview.innerHTML = `<img src="/static/${data.files}" width="100" height="100">`; // Make sure the data.file corresponds to a valid URL
            })
            .catch(error => {
                console.error('Upload error:', error);
            });
    }
});

// Optional: Add any additional functions or event listeners as needed.
