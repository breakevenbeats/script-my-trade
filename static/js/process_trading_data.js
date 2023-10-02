var datePicker = new Pikaday({
    field: document.getElementById('datePicker'),
    format: 'MM/DD/YYYY',
    yearRange: [2000, moment().year()],
});

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

document.addEventListener("DOMContentLoaded", function() {
    var copyButton = document.getElementById('copy-button');
    var copyIcon = document.getElementById('copy-icon');
    var copyText = document.getElementById('copy-text');

    copyButton.addEventListener('click', function() {
        var textToCopy = document.querySelector('.result-box ul').innerText;
        var textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        // Change the icon and text
        copyIcon.innerHTML = '&#x2713;'; // Unicode for checkmark
        copyText.textContent = 'Copied';

        // Revert back to original state after few seconds
        setTimeout(function() {
            copyIcon.innerHTML = '&#x1F4CB;'; // Unicode for clipboard icon
            copyText.textContent = 'Copy';
        }, 2000);
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
    var inputText = document.getElementById('tsvInput').value;
    var date = document.getElementById('datePicker').value;
    if (!date || !inputText) {
        alert('Please select a date and enter text before submitting.');
        return;
    }

    var parsedDate = new Date(Date.parse(date));
    var year = parsedDate.getFullYear();
    var month = parsedDate.getMonth() + 1; // JavaScript months are 0-indexed.
    var day = parsedDate.getDate();
    
    if (inputText) {
        var lines = inputText.split('\n');
        var results = [];
        for (let line of lines) {
            // Now, assuming each line is in the format: "<action> <type> <time>"
            // Example: "Buy Put 15:43"
            var parts = line.trim().split(' ');
            if (parts.length !== 3) {
                alert('Invalid input: ' + line);
                continue;
            }

            var action = parts[0].toLowerCase();
            var type = parts[1].toLowerCase();
            var time = parts[2]; // in HH:mm format
            var timeParts = time.split(':');
            var hour = parseInt(timeParts[0]);
            var minute = parseInt(timeParts[1]);
            var color = action === 'buy' ? 'color.red' : 'color.green';
            var text = type === 'call' ? 'Call' : 'Put';

            var result = `plotshape(time == timestamp(${year}, ${month}, ${day}, ${hour}, ${minute}), style=shape.triangleup, location=location.belowbar, color=${color}, size=size.small, text='${text}', textcolor=color.white, display=display.all - display.status_line)`;
            results.push(result);
        }
        
        var resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';
        results.forEach(result => {
            var listItem = document.createElement('li');
            listItem.textContent = result;
            resultsList.appendChild(listItem);
        });
    } else {
        alert('Please select a date and enter text before submitting.');
    }
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

