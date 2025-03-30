document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const amazonUrlInput = document.getElementById('amazon-url');
    const analyzeButton = document.getElementById('analyze-button');
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const closeModal = document.querySelector('.close');
    const privacyLink = document.getElementById('privacy-link');
    
    // Only initialize if we're on the home page
    if (analyzeButton) {
        // Add event listener to the analyze button
        analyzeButton.addEventListener('click', function() {
            // Get the URL
            const url = amazonUrlInput.value.trim();
            
            // Validate URL (simple check)
            if (!url) {
                showError('Please enter an Amazon product URL');
                return;
            }
            
            if (!url.includes('amazon.com') && !url.includes('amazon.')) {
                showError('Please enter a valid Amazon product URL');
                return;
            }
            
            // Show loading indicator and hide error message
            loadingIndicator.classList.remove('hidden');
            errorMessage.classList.add('hidden');
            
            // Send request to the server
            fetch('/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            })
            .then(response => response.json())
            .then(data => {
                loadingIndicator.classList.add('hidden');
                
                if (data.error) {
                    showError(data.error);
                } else {
                    // Redirect to scraping page
                    window.location.href = '/scraping_page';
                }
            })
            .catch(error => {
                loadingIndicator.classList.add('hidden');
                showError('Error connecting to server. Please try again.');
                console.error('Error:', error);
            });
        });
        
        // Allow pressing Enter to submit
        amazonUrlInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                analyzeButton.click();
            }
        });
    }
    
    // About modal functionality
    if (aboutLink) {
        aboutLink.addEventListener('click', function() {
            aboutModal.classList.remove('hidden');
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            aboutModal.classList.add('hidden');
        });
    }
    
    // Privacy Policy link
    if (privacyLink) {
        privacyLink.addEventListener('click', function() {
            alert('Privacy Policy: We do not store your Amazon product URLs or scraped data after your session ends.');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === aboutModal) {
            aboutModal.classList.add('hidden');
        }
    });
    
    // Helper function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});