"""
Teena Davis Portfolio - Zero-Dependency Python Server
Runs using standard Python 3 library (no pip packages needed).
Supports static asset serving, contact API, and resume download.
"""

import os
import json
import datetime
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get('PORT', 8080))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
DATA_DIR = os.path.join(BASE_DIR, 'data')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')
RESUME_PATH = os.path.join(BASE_DIR, 'Teena Davis mobile app developer.pdf')

os.makedirs(DATA_DIR, exist_ok=True)

MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon'
}

class PortfolioHandler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        # Route: Home Page
        if path == '/' or path == '/index.html':
            html_file = os.path.join(TEMPLATES_DIR, 'index.html')
            self.serve_file(html_file, 'text/html; charset=utf-8')
            return

        # Route: Download Resume
        if path == '/download-resume':
            if os.path.exists(RESUME_PATH):
                with open(RESUME_PATH, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/pdf')
                self.send_header('Content-Disposition', 'attachment; filename="Teena_Davis_Mobile_App_Developer.pdf"')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, 'Resume file not found')
            return

        # Route: Projects Data
        if path == '/api/projects' or path == '/data/projects.json':
            projects_file = os.path.join(DATA_DIR, 'projects.json')
            self.serve_file(projects_file, 'application/json; charset=utf-8')
            return

        # Static Assets
        if path.startswith('/static/'):
            relative_path = path[len('/static/'):]
            target_file = os.path.join(STATIC_DIR, relative_path.replace('/', os.sep))
            ext = os.path.splitext(target_file)[1].lower()
            mime = MIME_TYPES.get(ext, 'application/octet-stream')
            self.serve_file(target_file, mime)
            return

        # Direct file fallback if within workspace
        potential_file = os.path.join(BASE_DIR, path.lstrip('/').replace('/', os.sep))
        if os.path.isfile(potential_file):
            ext = os.path.splitext(potential_file)[1].lower()
            mime = MIME_TYPES.get(ext, 'application/octet-stream')
            self.serve_file(potential_file, mime)
            return

        self.send_error(404, 'File Not Found')

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        if path == '/api/contact':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body) if body else {}
                name = data.get('name', '').strip()
                email = data.get('email', '').strip()
                subject = data.get('subject', '').strip()
                message = data.get('message', '').strip()

                if not name or not email or not message:
                    self.send_json_response({'success': False, 'error': 'Name, email, and message are required.'}, 400)
                    return

                messages = []
                if os.path.exists(MESSAGES_FILE):
                    try:
                        with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                            messages = json.load(f)
                    except Exception:
                        messages = []

                entry = {
                    'id': len(messages) + 1,
                    'name': name,
                    'email': email,
                    'subject': subject or 'Inquiry',
                    'message': message,
                    'timestamp': datetime.datetime.now().isoformat()
                }
                messages.append(entry)

                with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
                    json.dump(messages, f, indent=2, ensure_ascii=False)

                self.send_json_response({
                    'success': True,
                    'message': 'Thank you! Your message has been received.'
                })
            except Exception as e:
                self.send_json_response({'success': False, 'error': str(e)}, 500)
            return

        self.send_error(404, 'Endpoint Not Found')

    def serve_file(self, filepath, content_type):
        if os.path.isfile(filepath):
            with open(filepath, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_error(404, 'File Not Found')

    def send_json_response(self, data, status_code=200):
        content = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format, *args):
        print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {format % args}")

def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, PortfolioHandler)
    print(f"==================================================")
    print(f"  BLOODY RED PORTFOLIO SERVER RUNNING")
    print(f"  URL: http://127.0.0.1:{PORT}")
    print(f"==================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == '__main__':
    run()
