document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn');

    // Initially hide email, message fields and submit button
    const emailGroup = emailInput.closest('.form-group');
    const messageGroup = messageInput.closest('.form-group');
    emailGroup.style.display = 'none';
    messageGroup.style.display = 'none';
    submitBtn.style.display = 'none';

    // Add arrow indicators to each input
    addInputArrow(nameInput);
    addInputArrow(emailInput);

    // Inbox popup toggle
    document.querySelector('.fa-inbox').parentElement.addEventListener('click', function(event) {
        const inboxPopup = document.getElementById('inbox-popup');
        inboxPopup.classList.toggle('active');
        // Reset form when opened
        resetForm();
    });

    // Close inbox on outside click
    document.addEventListener('click', function(event) {
        const inboxPopup = document.getElementById('inbox-popup');
        const inboxButton = document.querySelector('.fa-inbox').parentElement;
        if (inboxPopup.classList.contains('active') && 
            !inboxPopup.contains(event.target) && 
            !inboxButton.contains(event.target)) {
            inboxPopup.classList.remove('active');
        }
    });

    // Name input validation
    nameInput.addEventListener('input', function() {
        const nameValue = nameInput.value.trim();
        const arrow = nameInput.nextElementSibling;

        if (nameValue.length >= 2) {
            arrow.classList.add('active');
        } else {
            arrow.classList.remove('active');
        }
    });

    // Name input completion
    nameInput.addEventListener('keyup', function(e) {
        const nameValue = nameInput.value.trim();
        const arrow = nameInput.nextElementSibling;

        if ((e.key === 'Enter' || e.type === 'blur') && nameValue.length >= 2) {
            arrow.classList.add('complete');
            // Show the email field with animation
            emailGroup.style.display = 'flex';
            emailGroup.classList.add('animate-in');
            // Focus on email input
            setTimeout(() => emailInput.focus(), 600);
        }
    });

    nameInput.addEventListener('blur', function() {
        const nameValue = nameInput.value.trim();
        const arrow = nameInput.nextElementSibling;

        if (nameValue.length >= 2) {
            arrow.classList.add('complete');
            // Show the email field with animation
            emailGroup.style.display = 'flex';
            emailGroup.classList.add('animate-in');
        }
    });

    // Email validation
    emailInput.addEventListener('input', validateEmailInput);
    emailInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter' && validateEmail()) {
            const arrow = emailInput.nextElementSibling;
            arrow.classList.add('complete');
            // Show the message field with animation
            messageGroup.style.display = 'flex';
            messageGroup.classList.add('animate-in');
            // Focus on message textarea
            setTimeout(() => messageInput.focus(), 600);
        }
    });

    emailInput.addEventListener('blur', function() {
        if (validateEmail()) {
            const arrow = emailInput.nextElementSibling;
            arrow.classList.add('complete');
            // Show the message field with animation
            messageGroup.style.display = 'flex';
            messageGroup.classList.add('animate-in');
        }
    });

    // Message field validation
    messageInput.addEventListener('input', function() {
        const messageValue = messageInput.value.trim();

        if (messageValue.length >= 10) {
            // Show submit button
            submitBtn.style.display = 'flex';
            submitBtn.classList.add('animate-in');
        } else {
            submitBtn.style.display = 'none';
        }
    });

    // Form submission validation
    contactForm.addEventListener('submit', function(event) {
        if (!validateEmail()) {
            event.preventDefault();
        }

        // Add stars animation on submit if valid
        if (!emailInput.classList.contains('error')) {
            createStars();
        }
    });

    function validateEmailInput() {
        const email = emailInput.value.trim().toLowerCase();
        const arrow = emailInput.nextElementSibling;

        if (validateEmail()) {
            arrow.classList.add('active');
            emailInput.classList.remove('error');
        } else {
            arrow.classList.remove('active');
            arrow.classList.remove('complete');
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim().toLowerCase();
        const errorMsg = document.querySelector('.email-error');

        // Basic email validation
        if (!email || !email.includes('@') || !email.includes('.')) {
            emailInput.classList.add('error');
            errorMsg.style.display = 'block';
            return false;
        }

        // Get username part (before @)
        const username = email.split('@')[0];
        const domain = email.split('@')[1];

        // List of suspicious patterns
        const suspiciousPatterns = [
            /^temp/, /^fake/, /^dummy/, /^test/, /^disposable/,
            /^trash/, /^throw/, /^temporary/, /^noreply/,
            /^donotreply/, /^noemail/, /^spam/, /^junk/,
            /[0-9]{6,}/, // Emails with 6+ consecutive numbers
            /[a-z0-9]{10,}@/ // Very long usernames before @ that look random
        ];

        // Check for suspicious patterns
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(username)) {
                emailInput.classList.add('error');
                errorMsg.style.display = 'block';
                return false;
            }
        }

        // Valid email
        emailInput.classList.remove('error');
        errorMsg.style.display = 'none';
        return true;
    }

    function addInputArrow(input) {
        const arrow = document.createElement('div');
        arrow.className = 'input-arrow';
        arrow.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        input.parentNode.insertBefore(arrow, input.nextSibling);
    }

    function resetForm() {
        // Reset inputs
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';

        // Hide fields
        emailGroup.style.display = 'none';
        messageGroup.style.display = 'none';
        submitBtn.style.display = 'none';

        // Reset arrows
        document.querySelectorAll('.input-arrow').forEach(arrow => {
            arrow.classList.remove('active', 'complete');
        });

        // Remove error classes
        emailInput.classList.remove('error');
        document.querySelector('.email-error').style.display = 'none';

        // Reset animations
        emailGroup.classList.remove('animate-in');
        messageGroup.classList.remove('animate-in');

        // Focus on first field
        setTimeout(() => nameInput.focus(), 300);
    }

    // Create floating stars animation
    function createStars() {
        const submitBtn = document.querySelector('.submit-btn');
        const btnRect = submitBtn.getBoundingClientRect();

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'floating-stars';
                star.innerHTML = '✨';
                star.style.left = (btnRect.left + btnRect.width/2 + (Math.random() * 20 - 10)) + 'px';
                star.style.top = (btnRect.top + (Math.random() * 10)) + 'px';
                document.body.appendChild(star);

                // Remove stars after animation completes
                setTimeout(() => {
                    star.remove();
                }, 3000);
            }, i * 150);
        }
    }
});