import csv
from datetime import datetime
from flask import Flask, request, render_template, jsonify
import io

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html')

def parse_date_time(input_str):
    input_str = input_str.replace(" EDT", "")
    dt = datetime.strptime(input_str, "%m/%d/%Y %H:%M:%S")
    return dt.month, dt.year, dt.day, dt.hour, dt.minute, dt.strftime("%H:%M")

def process_input_data(input_data):
    try:
        tsv_reader = csv.reader(io.StringIO(input_data), delimiter="\t")
        results = []
        for row in tsv_reader:
            name, side, filled_time = row

            if name == "Name":
                continue
            mo, year, day, hh, mm, filled_time_str = parse_date_time(filled_time)

            if "Call" in name:
                name = "Call"
            elif "Put" in name:
                name = "Put"
            else:
                name = "Unknown"

            if side == "Buy":
                result = f"plotshape(time == timestamp({year}, {mo}, {day}, {hh}, {mm}), style=shape.triangleup, location=location.belowbar, color=color.red, size=size.small, text='{name}', textcolor=color.white)"
            else:
                result = f"plotshape(time == timestamp({year}, {mo}, {day}, {hh}, {mm}), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text='{name}', textcolor=color.white)"
            results.append(result)
        return results
    except Exception as e:
        return [f"An error occurred: {e}"]

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        return process_input_data(file.read().decode('utf-8'))
    else:
        return jsonify(results="No file provided")

if __name__ == '__main__':
    app.run(port=8000, debug=True)


