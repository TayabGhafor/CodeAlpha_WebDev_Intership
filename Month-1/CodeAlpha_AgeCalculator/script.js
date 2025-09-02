// DOM Elements
const ageForm = document.getElementById('ageForm');
const resultCard = document.getElementById('resultCard');
const historyBtn = document.getElementById('historyBtn');
const historyDrawer = document.getElementById('historyDrawer');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');
const overlay = document.getElementById('overlay');
const shareBtn = document.getElementById('shareBtn');

// Input fields
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');

// Result elements
const yearsElement = document.getElementById('years');
const monthsElement = document.getElementById('months');
const daysElement = document.getElementById('days');
const resultDateElement = document.getElementById('resultDate');

// History storage key
const HISTORY_STORAGE_KEY = 'ageCalculatorHistory';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadHistory();
    addEventListeners();
});

// Initialize the application
function initializeApp() {
    // Add fade-in animation to input fields
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach((field, index) => {
        field.style.opacity = '0';
        field.style.transform = 'translateY(20px)';
        setTimeout(() => {
            field.style.transition = 'all 0.6s ease';
            field.style.opacity = '1';
            field.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Set current year as max for year input
    const currentYear = new Date().getFullYear();
    yearInput.max = currentYear;
}

// Add event listeners
function addEventListeners() {
    ageForm.addEventListener('submit', handleFormSubmit);
    historyBtn.addEventListener('click', toggleHistoryDrawer);
    closeHistoryBtn.addEventListener('click', closeHistoryDrawer);
    overlay.addEventListener('click', closeHistoryDrawer);
    clearHistoryBtn.addEventListener('click', clearHistory);
    shareBtn.addEventListener('click', shareResult);

    [dayInput, monthInput, yearInput].forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);
    });

    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const day = parseInt(dayInput.value);
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);

    if (!validateDate(day, month, year)) {
        showError('Please enter a valid date');
        return;
    }

    const age = calculateAge(day, month, year);
    displayResult(age, day, month, year);
    saveToHistory(age, day, month, year);
    
    resultCard.classList.add('success');
    setTimeout(() => resultCard.classList.remove('success'), 500);
}

// Calculate age from birth date
function calculateAge(day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    if (birthDate > currentDate) {
        throw new Error('Birth date cannot be in the future');
    }

    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

// Display age result
function displayResult(age, day, month, year) {
    const birthDate = new Date(year, month - 1, day);
    const formattedDate = birthDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    animateNumber(yearsElement, age.years);
    animateNumber(monthsElement, age.months);
    animateNumber(daysElement, age.days);
    
    resultDateElement.textContent = `Born on ${formattedDate}`;

    resultCard.style.display = 'block';
    resultCard.style.opacity = '0';
    resultCard.style.transform = 'translateY(40px)';
    
    setTimeout(() => {
        resultCard.style.transition = 'all 0.6s ease';
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'translateY(0)';
    }, 100);
}

// Animate number counting
function animateNumber(element, targetValue) {
    const duration = 1000;
    const increment = targetValue / (duration / 16);
    let currentValue = 0;

    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 16);
}

// Validate date input
function validateDate(day, month, year) {
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
        return false;
    }

    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
}

// Validate individual input
function validateInput(e) {
    const input = e.target;
    const value = parseInt(input.value);
    
    input.classList.remove('error');
    
    if (input.value === '') return;
    
    if (input === dayInput && (value < 1 || value > 31)) {
        input.classList.add('error');
    } else if (input === monthInput && (value < 1 || value > 12)) {
        input.classList.add('error');
    } else if (input === yearInput && (value < 1900 || value > new Date().getFullYear())) {
        input.classList.add('error');
    }
}

// Show error message
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Toggle history drawer
function toggleHistoryDrawer() {
    historyDrawer.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = historyDrawer.classList.contains('open') ? 'hidden' : '';
}

// Close history drawer
function closeHistoryDrawer() {
    historyDrawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Save calculation to history
function saveToHistory(age, day, month, year) {
    const history = getHistory();
    const newEntry = {
        id: Date.now(),
        birthDate: { day, month, year },
        age: age,
        timestamp: new Date().toISOString()
    };
    
    history.unshift(newEntry);
    
    if (history.length > 20) {
        history.splice(20);
    }
    
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    updateHistoryDisplay();
}

// Get history from localStorage
function getHistory() {
    const history = localStorage.getItem(HISTORY_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

// Load and display history
function loadHistory() {
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const history = getHistory();
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px 20px;">
                <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>No calculations yet</p>
                <p style="font-size: 0.9rem; margin-top: 5px;">Your calculation history will appear here</p>
            </div>
        `;
        return;
    }
    
    history.forEach(entry => {
        const historyItem = createHistoryItem(entry);
        historyList.appendChild(historyItem);
    });
}

// Create history item element
function createHistoryItem(entry) {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const birthDate = new Date(entry.birthDate.year, entry.birthDate.month - 1, entry.birthDate.day);
    const formattedDate = birthDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    const timestamp = new Date(entry.timestamp);
    const formattedTime = timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    item.innerHTML = `
        <div class="history-date">${formattedDate}</div>
        <div class="history-age">
            ${entry.age.years} years, ${entry.age.months} months, ${entry.age.days} days
        </div>
        <div class="history-timestamp">Calculated at ${formattedTime}</div>
        <button class="delete-history-btn" onclick="deleteHistoryItem(${entry.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return item;
}

// Delete individual history item
function deleteHistoryItem(id) {
    const history = getHistory();
    const updatedHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    updateHistoryDisplay();
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all calculation history?')) {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        updateHistoryDisplay();
    }
}

// Share result
function shareResult() {
    const resultText = `My age: ${yearsElement.textContent} years, ${monthsElement.textContent} months, ${daysElement.textContent} days`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Age Calculator Result',
            text: resultText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(resultText).then(() => {
            showSuccess('Result copied to clipboard!');
        }).catch(() => {
            showError('Failed to copy result');
        });
    }
}

// Show success message
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    if (e.key === 'Escape' && historyDrawer.classList.contains('open')) {
        closeHistoryDrawer();
    }
    
    if (e.key === 'Enter' && (e.target === dayInput || e.target === monthInput || e.target === yearInput)) {
        ageForm.dispatchEvent(new Event('submit'));
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-focus first input on page load
window.addEventListener('load', () => {
    dayInput.focus();
});
