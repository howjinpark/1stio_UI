class IstioTrafficManager {
    constructor() {
        this.services = [];
        this.selectedService = null;
        this.weights = {};
        
        // Initialize UI elements
        this.servicesList = document.getElementById('servicesList');
        this.weightDialog = document.getElementById('weightDialog');
        this.errorAlert = document.getElementById('errorAlert');
        
        // Initialize event listeners
        document.querySelector('.close').addEventListener('click', () => {
            this.weightDialog.close();
        });
        
        document.getElementById('saveWeights').addEventListener('click', () => {
            this.handleSave();
        });
        
        // Initial fetch
        this.fetchServices();
    }
    
    showError(message) {
        this.errorAlert.style.display = 'block';
        this.errorAlert.querySelector('.alert-content').textContent = message;
    }
    
    hideError() {
        this.errorAlert.style.display = 'none';
    }
    
    async fetchServices() {
        try {
            const response = await fetch('http://localhost:3001/api/services');
            this.services = await response.json();
            this.renderServices();
            this.hideError();
        } catch (error) {
            console.error('Error fetching services:', error);
            this.showError('Failed to fetch services');
        }
    }
    
    renderServices() {
        this.servicesList.innerHTML = '';
        
        this.services.forEach(service => {
            const listItem = document.createElement('li');
            listItem.className = 'service-item mdl-list__item';
            
            const ports = service.spec.ports.map(p => `${p.port}/${p.protocol}`).join(', ');
            
            listItem.innerHTML = `
                <div class="mdl-list__item-primary-content">
                    <div class="service-name">${service.metadata.name}</div>
                    <div class="service-details">
                        <div class="service-detail-item">
                            <span class="detail-label">Namespace:</span>
                            <span class="detail-value">${service.metadata.namespace}</span>
                        </div>
                        <div class="service-detail-item">
                            <span class="detail-label">Ports:</span>
                            <span class="detail-value">${ports}</span>
                        </div>
                    </div>
                </div>
                <div class="mdl-list__item-secondary-action">
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored edit-button">
                        <i class="material-icons">edit</i>
                    </button>
                </div>
            `;
            
            listItem.querySelector('.edit-button').addEventListener('click', () => {
                this.handleEditWeights(service);
            });
            
            this.servicesList.appendChild(listItem);
        });
    }
    
    async handleEditWeights(service) {
        try {
            const response = await fetch(
                `http://localhost:3001/api/services/${service.metadata.namespace}/${service.metadata.name}`
            );
            const details = await response.json();
            
            this.selectedService = service;
            this.weights = {};
            
            const routes = details.virtualService.spec.http[0].route;
            routes.forEach(route => {
                this.weights[route.destination.subset] = route.weight;
            });
            
            this.renderWeightDialog();
            this.weightDialog.showModal();
            this.hideError();
        } catch (error) {
            console.error('Error fetching service details:', error);
            this.showError('Failed to fetch service details');
        }
    }
    
    renderWeightDialog() {
        const container = document.getElementById('weightsContainer');
        container.innerHTML = '';
        
        Object.entries(this.weights).forEach(([version, weight]) => {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'weight-slider-container';
            
            sliderContainer.innerHTML = `
                <label>Version ${version}: <span class="weight-value">${weight}%</span></label>
                <input type="range" class="weight-slider" 
                       min="0" max="100" value="${weight}" 
                       data-version="${version}">
            `;
            
            const slider = sliderContainer.querySelector('.weight-slider');
            const weightValue = sliderContainer.querySelector('.weight-value');
            
            slider.addEventListener('input', (event) => {
                const value = parseInt(event.target.value);
                const version = event.target.dataset.version;
                this.handleWeightChange(version, value);
                weightValue.textContent = value + '%';
            });
            
            container.appendChild(sliderContainer);
        });
    }
    
    handleWeightChange(version, value) {
        const otherVersion = Object.keys(this.weights).find(k => k !== version);
        if (otherVersion) {
            this.weights[version] = value;
            this.weights[otherVersion] = 100 - value;
            
            // Update other slider
            const otherSlider = document.querySelector(`input[data-version="${otherVersion}"]`);
            const otherWeightValue = otherSlider.parentElement.querySelector('.weight-value');
            otherSlider.value = 100 - value;
            otherWeightValue.textContent = (100 - value) + '%';
        }
    }
    
    async handleSave() {
        if (!this.selectedService) return;
        
        try {
            await fetch(
                `http://localhost:3001/api/services/${this.selectedService.metadata.namespace}/${this.selectedService.metadata.name}/traffic`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ weights: this.weights })
                }
            );
            
            this.weightDialog.close();
            this.fetchServices();
            this.hideError();
        } catch (error) {
            console.error('Error updating weights:', error);
            this.showError('Failed to update traffic weights');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new IstioTrafficManager();
}); 