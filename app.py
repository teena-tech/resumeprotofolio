"""
Teena Davis Portfolio - Flask Backend Server
Handles page rendering, project data API, resume download, and contact message submissions.
"""

import os
import json
import datetime
from flask import Flask, render_template, send_from_directory, request, jsonify, send_file

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')
RESUME_PATH = os.path.join(BASE_DIR, 'Teena Davis mobile app developer.pdf')

app = Flask(__name__, template_folder='templates', static_folder='static')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

@app.route('/')
def home():
    """Renders the main portfolio page."""
    return render_template('index.html')

@app.route('/download-resume')
def download_resume():
    """Directly downloads the Teena Davis resume PDF."""
    if os.path.exists(RESUME_PATH):
        return send_file(
            RESUME_PATH,
            as_attachment=True,
            download_name='Teena_Davis_Mobile_App_Developer.pdf',
            mimetype='application/pdf'
        )
    return jsonify({'error': 'Resume file not found'}), 404

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Returns the JSON list of projects."""
    projects_file = os.path.join(DATA_DIR, 'projects.json')
    if os.path.exists(projects_file):
        with open(projects_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    return jsonify([]), 404

@app.route('/data/projects.json')
def serve_projects_json():
    """Serves projects.json directly for frontend AJAX."""
    return send_from_directory(DATA_DIR, 'projects.json')

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    """Validates and persists incoming contact inquiries."""
    try:
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()

        if not name or not email or not message:
            return jsonify({
                'success': False,
                'error': 'Name, email, and message are required fields.'
            }), 400

        # Load existing messages
        messages = []
        if os.path.exists(MESSAGES_FILE):
            try:
                with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                    messages = json.load(f)
            except Exception:
                messages = []

        new_entry = {
            'id': len(messages) + 1,
            'name': name,
            'email': email,
            'subject': subject or 'General Inquiry',
            'message': message,
            'timestamp': datetime.datetime.now().isoformat(),
            'ip': request.remote_addr
        }
        messages.append(new_entry)

        # Save to messages.json
        with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)

        return jsonify({
            'success': true if hasattr(bool, '__name__') else True,
            'message': 'Thank you! Your message has been received.'
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🔥 Teena Davis Portfolio running at: http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
