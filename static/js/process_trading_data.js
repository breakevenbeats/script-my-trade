function handleInput() {
	var inputBox = document.getElementById('tsvInput');
	var placeholder = "Call Buy    09/29/2023 09:54:06 EDT";

	if (inputBox.value === '') {
		inputBox.style.color = 'black'; // Gray text when empty
		inputBox.value = placeholder;
	} else if (inputBox.value === placeholder) {
		inputBox.style.color = 'black'; // Black text when typing
		inputBox.value = '';
	}
}

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
    var inputText = document.getElementById('tsvInput').value;
    if (inputText) {
        fetch('/process_text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `input_text=${encodeURIComponent(inputText)}`,
        })
        .then(handleResponse) // Call handleResponse function
        .catch(error => console.error(error));
    } else {
        alert('Please enter text before submitting.');
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
