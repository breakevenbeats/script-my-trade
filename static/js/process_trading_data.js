// Initialize Pikaday date picker
var datePicker = new Pikaday({
    field: document.getElementById('datePicker'),
    format: 'MM/DD/YYYY',
    yearRange: [2000, moment().year()],
});

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById('fileUploadForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var formData = new FormData(form);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
        // Update the results div with the response
        const ulElement = document.querySelector('.result-box ul');      ulElement.innerHTML = ''; // Clear the existing content if any
        data.forEach(item => {
            const liElement = document.createElement('li');
            liElement.textContent = item;
                ulElement.appendChild(liElement);
            });
        })
        .catch(error => console.error('Error:', error));
    });
});

function copyToClipboard() {
	var textToCopy = document.querySelector('.result-box ul').innerText;
	var textArea = document.createElement("textarea");
	textArea.value = textToCopy;
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand('copy');
	document.body.removeChild(textArea);
	alert("Copied to clipboard!");
}

function handleResponse(response) {
    if (response.ok) {
        return response.json().then(data => {
            if (data.results) {
                var resultsList = document.getElementById('resultsList');
                resultsList.innerHTML = '';
                data.results.forEach(result => {
                    var listItem = document.createElement('li');
                    listItem.textContent = result;
                    resultsList.appendChild(listItem);
                });
            } else if (data.error) {
                alert(data.error);
            }
        });
    } else {
        alert('An error occurred. Please try again later.');
    }
}

function processInput() {
    var date = document.getElementById('datePicker').value;
    var inputText = document.getElementById('tsvInput').value;

    if (!date || !inputText) {
        alert('Please select a date and enter text before submitting.');
        return;
    }

    // Split the inputText by newline to get each row
    var inputRows = inputText.split('\n');

    var resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = ''; // Clear the previous results

    inputRows.forEach(function(row) {
        try {
            var [action, type, time] = row.split(' ').map(e => e.toLowerCase());

            if (['buy', 'sell'].indexOf(action) === -1 || ['call', 'put'].indexOf(type) === -1) {
                alert(`Invalid action or type in row "${row}". Please enter "Buy" or "Sell" for action and "Call" or "Put" for type.`);
                return;
            }

            var [month, day, year] = date.split('/');
            var [hour, minute] = time.split(':');

            var color = action === 'buy' ? 'color.red' : 'color.green';
            var result = `plotshape(time == timestamp(${year}, ${month}, ${day}, ${hour}, ${minute}), style=shape.triangleup, location=location.belowbar, color=${color}, size=size.small, text='${type.charAt(0).toUpperCase() + type.slice(1)}', textcolor=color.white)`;

            var listItem = document.createElement('li');
            listItem.textContent = result;
            resultsList.appendChild(listItem);
        } catch (error) {
            console.error(error);
            alert(`An error occurred while processing the row "${row}".`);
        }
    });
}

function handleTabKey(event) {
	if (event.key === "Tab") {
		event.preventDefault();
		var textarea = document.getElementById('tsvInput');
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;
		var text = textarea.value;
		textarea.value = text.substring(0, start) + '\t' + text.substring(end);
		textarea.selectionStart = textarea.selectionEnd = start + 1;
	}
}

var textarea = document.getElementById('tsvInput');
var placeholderText = "Buy Call 9:30\nSell Call 9:45\nBuy Put 13:15\nSell Put 13:45";

textarea.value = placeholderText;
textarea.className = 'placeholderText';

textarea.addEventListener('focus', function() {
    // If the current value is the placeholder, clear it on focus
    if (this.value === placeholderText) {
        this.value = '';
        this.className = '';
        this.style.color = '#fff';
    }
});

textarea.addEventListener('blur', function() {
    // If the user didn't enter anything, put the placeholder back on blur
    if (this.value === '') {
        this.value = placeholderText;
        this.className = 'placeholderText';
        this.style.color = 'lightgray';
    }
});
