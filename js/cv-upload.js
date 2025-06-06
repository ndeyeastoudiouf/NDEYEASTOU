// CV Upload Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cvUploadForm = document.getElementById('cv-upload-form');
    const cvFileInput = document.getElementById('cv-file');
    const uploadStatus = document.getElementById('upload-status');
    const studentCta = document.getElementById('student-cta');

    // Show CV upload section when "Dépose ton CV" button is clicked
    if (studentCta) {
        studentCta.addEventListener('click', () => {
            const cvUploadSection = document.querySelector('.cv-upload-section');
            cvUploadSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (cvUploadForm) {
        cvUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const file = cvFileInput.files[0];
            if (!file) {
                showUploadStatus('Veuillez sélectionner un fichier', 'error');
                return;
            }

            // Validate file type
            if (file.type !== 'application/pdf') {
                showUploadStatus('Seuls les fichiers PDF sont acceptés', 'error');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showUploadStatus('La taille du fichier ne doit pas dépasser 5MB', 'error');
                return;
            }

            // Show loading state
            showUploadStatus('Upload en cours...', 'loading');

            try {
                // In a real application, you would upload to a server
                // For demo purposes, we'll simulate an upload
                await simulateUpload(file);

                // Show success message
                showUploadStatus('CV uploadé avec succès!', 'success');
                
                // Clear the file input
                cvFileInput.value = '';

                // Store in localStorage for demo
                localStorage.setItem('userCV', file.name);
            } catch (error) {
                showUploadStatus('Erreur lors de l\'upload. Veuillez réessayer.', 'error');
            }
        });
    }

    function showUploadStatus(message, type) {
        uploadStatus.innerHTML = `
            <div class="upload-message ${type}">
                <i class="fas ${getStatusIcon(type)}"></i>
                ${message}
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .upload-message {
                padding: var(--space-2);
                border-radius: var(--border-radius-md);
                margin-top: var(--space-2);
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .upload-message.success {
                background-color: #d4edda;
                color: #155724;
            }
            .upload-message.error {
                background-color: #f8d7da;
                color: #721c24;
            }
            .upload-message.loading {
                background-color: #e2e3e5;
                color: #383d41;
            }
            .upload-message i {
                font-size: 1.2em;
            }
        `;
        document.head.appendChild(style);
    }

    function getStatusIcon(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'loading':
                return 'fa-spinner fa-spin';
            default:
                return 'fa-info-circle';
        }
    }

    function simulateUpload(file) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    // Check if user has already uploaded a CV
    const existingCV = localStorage.getItem('userCV');
    if (existingCV) {
        showUploadStatus(`CV actuel: ${existingCV}`, 'success');
    }
});