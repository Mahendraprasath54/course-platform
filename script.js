// Banking Academy - Form Handler & Email System
// Created for Online Banking Class Website

// Email configuration (replace with your actual email service)
const EMAIL_CONFIG = {
    serviceID: 'your_service_id', // Replace with your EmailJS service ID
    templateID: 'your_template_id', // Replace with your EmailJS template ID
    userID: 'your_user_id', // Replace with your EmailJS user ID
    adminEmail: 'admin@bankingacademy.com' // Your admin email
};

// Initialize EmailJS (uncomment when ready to use)
// emailjs.init(EMAIL_CONFIG.userID);

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFormValidation();
    addInteractiveEffects();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Main enquiry form
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', handleMainFormSubmit);
    }

    // Modal enquiry form
    const modalForm = document.getElementById('modalEnquiryForm');
    if (modalForm) {
        modalForm.addEventListener('submit', handleModalFormSubmit);
    }

    // Modal close events
    const modal = document.getElementById('enquiryModal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeEnquiryForm();
            }
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeEnquiryForm();
        }
    });
}

// Modal Functions
function openEnquiryForm() {
    const modal = document.getElementById('enquiryModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeEnquiryForm() {
    const modal = document.getElementById('enquiryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Main form submission handler
async function handleMainFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const submitButton = e.target.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    try {
        // Show loading state
        setButtonLoading(submitButton, true);
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Send emails
        await sendEmailToAdmin(data, 'main-form');
        await sendConfirmationEmail(data);
        
        // Show success message
        showNotification('Thank you for your enquiry! We will contact you within 24 hours.', 'success');
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        console.error('Form submission failed:', error);
        showNotification('There was an issue sending your enquiry. Please try calling us directly.', 'error');
    } finally {
        setButtonLoading(submitButton, false, originalText);
    }
}

// Modal form submission handler
async function handleModalFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const submitButton = e.target.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    try {
        // Show loading state
        setButtonLoading(submitButton, true);
        
        // Collect form data
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            course: formData.get('course'),
            message: formData.get('message') || 'Quick enrollment request'
        };
        
        // Send emails
        await sendEmailToAdmin(data, 'modal-form');
        await sendConfirmationEmail(data);
        
        // Show success message
        showNotification('Thank you for your interest! Our team will contact you shortly.', 'success');
        
        // Close modal and reset form
        closeEnquiryForm();
        e.target.reset();
        
    } catch (error) {
        console.error('Form submission failed:', error);
        showNotification('There was an issue processing your request. Please try calling us directly.', 'error');
    } finally {
        setButtonLoading(submitButton, false, originalText);
    }
}

// Email sending functions
async function sendEmailToAdmin(data, formType) {
    const emailContent = `
        New Enquiry from Banking Academy Website
        =====================================
        
        Form Type: ${formType === 'main-form' ? 'Main Contact Form' : 'Quick Enrollment Modal'}
        Timestamp: ${new Date().toLocaleString()}
        
        Student Details:
        ---------------
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Course Interest: ${data.course || 'Not specified'}
        Message: ${data.message || 'No additional message'}
        
        Please contact this student within 24 hours.
        
        Best regards,
        Banking Academy Website
    `;

    try {
        // Method 1: Using EmailJS (Recommended for client-side)
        /*
        const result = await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templateID,
            {
                to_email: EMAIL_CONFIG.adminEmail,
                from_name: data.name,
                from_email: data.email,
                phone: data.phone,
                course: data.course,
                message: data.message,
                form_type: formType,
                timestamp: new Date().toLocaleString()
            }
        );
        */
        
        // For demo purposes, we'll simulate the email sending
        console.log('Email would be sent to admin:', emailContent);
        
        // Send to server endpoint (if available)
        await sendToServer(data, 'admin');
        
        return Promise.resolve('Email sent successfully');
    } catch (error) {
        throw new Error('Failed to send admin notification: ' + error.message);
    }
}

async function sendConfirmationEmail(data) {
    const confirmationContent = `
        Dear ${data.name},
        
        Thank you for your interest in Banking Academy!
        
        We have received your enquiry with the following details:
        - Course: ${data.course || 'General Inquiry'}
        - Phone: ${data.phone}
        
        Our team will contact you within 24 hours to discuss:
        ✓ Course details and curriculum
        ✓ Batch timings and availability
        ✓ Fee structure and payment options
        ✓ Any specific questions you may have
        
        In the meantime, feel free to call us at:
        📞 +91 98765 43210
        📞 +91 87654 32109
        
        Best regards,
        Banking Academy Team
        
        ---
        This is an automated confirmation email.
    `;

    try {
        // Using EmailJS for user confirmation
        /*
        const result = await emailjs.send(
            EMAIL_CONFIG.serviceID,
            'confirmation_template_id', // Different template for confirmations
            {
                to_email: data.email,
                to_name: data.name,
                course: data.course,
                phone: data.phone
            }
        );
        */
        
        console.log('Confirmation email would be sent to user:', confirmationContent);
        
        // Send to server for processing
        await sendToServer(data, 'confirmation');
        
        return Promise.resolve('Confirmation sent');
    } catch (error) {
        // Don't throw error for confirmation email failure
        console.warn('Confirmation email failed:', error);
    }
}

// Send data to server (if you have a backend)
async function sendToServer(data, type) {
    try {
        const response = await fetch('/api/enquiry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                type: type,
                timestamp: new Date().toISOString(),
                source: 'website'
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Server communication failed:', error);
        // For demo purposes, we'll simulate success
        return Promise.resolve({ success: true, message: 'Data processed locally' });
    }
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        // Check if field is empty
        if (!value) {
            setFieldError(input, 'This field is required');
            isValid = false;
            return;
        }
        
        // Email validation
        if (input.type === 'email' && !isValidEmail(value)) {
            setFieldError(input, 'Please enter a valid email address');
            isValid = false;
            return;
        }
        
        // Phone validation
        if (input.type === 'tel' && !isValidPhone(value)) {
            setFieldError(input, 'Please enter a valid phone number');
            isValid = false;
            return;
        }
        
        // Clear error if valid
        clearFieldError(input);
    });
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Set field error
function setFieldError(field, message) {
    field.style.borderColor = '#ff6b6b';
    field.setAttribute('title', message);
    
    // Add shake animation
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    field.removeAttribute('title');
}

// Setup real-time form validation
function setupFormValidation() {
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                const value = this.value.trim();
                
                if (!value) {
                    setFieldError(this, 'This field is required');
                } else if (this.type === 'email' && !isValidEmail(value)) {
                    setFieldError(this, 'Please enter a valid email address');
                } else if (this.type === 'tel' && !isValidPhone(value)) {
                    setFieldError(this, 'Please enter a valid phone number');
                } else {
                    clearFieldError(this);
                }
            }
        });
        
        field.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(255, 107, 107)' && this.value.trim()) {
                clearFieldError(this);
            }
        });
    });
}

// Button loading state
function setButtonLoading(button, isLoading, originalText = '') {
    if (isLoading) {
        button.disabled = true;
        button.textContent = 'Sending...';
        button.style.opacity = '0.7';
    } else {
        button.disabled = false;
        button.textContent = originalText || 'Submit';
        button.style.opacity = '1';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Interactive effects
function addInteractiveEffects() {
    // Card hover effects
    document.querySelectorAll('.topic-card, .feature-item, .pricing-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('pricing-card')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // CTA button effects
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Contact card effects
    document.querySelectorAll('.contact-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Syllabus button effects
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Syllabus will be shared after enrollment. Contact us for details!', 'info');
        });
    });
}

// Smooth scrolling for anchor links
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Utility functions
const utils = {
    // Format phone number
    formatPhone: function(phone) {
        return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
    
    // Capitalize name
    capitalizeName: function(name) {
        return name.replace(/\b\w/g, l => l.toUpperCase());
    },
    
    // Get current timestamp
    getTimestamp: function() {
        return new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Add CSS for shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Export functions for global access
window.openEnquiryForm = openEnquiryForm;
window.closeEnquiryForm = closeEnquiryForm;
window.showNotification = showNotification;

// Console message
console.log('🏦 Banking Academy - Form Handler Loaded Successfully!');
console.log('📧 Email Configuration Required - Update EMAIL_CONFIG object');
console.log('🚀 Ready to handle student enquiries!');