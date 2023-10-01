import unittest
import io
from app import app  # Import your Flask Application

class FlaskAppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_upload_file_with_header(self):
         with open('test_data/test_data_with_header.tsv', 'rb') as f:
            data = {
                'file': (f, 'test_data_with_header.tsv')
            }
            response = self.app.post('/upload', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            expected_output = b'["plotshape(time == timestamp(2023, 9, 29, 15, 43), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Put\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 15, 32), style=shape.triangleup, location=location.belowbar, color=color.red, size=size.small, text=\'Put\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 10, 7), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 10, 7), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 9, 58), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 9, 54), style=shape.triangleup, location=location.belowbar, color=color.red, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)"]\n'
            self.assertEqual(response.data, expected_output)
    
    def test_upload_file_without_header(self):
        with open('test_data/test_data_without_header.tsv', 'rb') as f:
            data = {
                'file': (f, 'test_data_without_header.tsv')
            }
            response = self.app.post('/upload', data=data, content_type='multipart/form-data')
            self.assertEqual(response.status_code, 200)
            expected_output = b'["plotshape(time == timestamp(2023, 9, 29, 15, 43), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Put\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 15, 32), style=shape.triangleup, location=location.belowbar, color=color.red, size=size.small, text=\'Put\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 10, 7), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 10, 7), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 9, 58), style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)","plotshape(time == timestamp(2023, 9, 29, 9, 54), style=shape.triangleup, location=location.belowbar, color=color.red, size=size.small, text=\'Call\', textcolor=color.white, display=display.all - display.status_line)"]\n'
            self.assertEqual(response.data, expected_output)

    def test_process_input_data_when_uploading_tsv_without_header(self):
        from app import process_input_data
        input_data = "Call\tBuy\t09/29/2023 15:43:50 EDT"
        expected_output = ["plotshape(time == timestamp(2023, 9, 29, 15, 43), style=shape.triangleup, location=location.belowbar, color=color.red, size=size.small, text='Call', textcolor=color.white, display=display.all - display.status_line)"] 
        self.assertEqual(process_input_data(input_data), expected_output)

if __name__ == '__main__':
    unittest.main()

