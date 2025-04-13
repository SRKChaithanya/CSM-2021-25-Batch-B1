from app import app
import socket
import sys

def is_port_in_use(port):
    """Check if a port is in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

if __name__ == "__main__":
    # Try ports 5000 and 8080
    if not is_port_in_use(5000):
        app.run(host="0.0.0.0", port=5000, debug=True)
    else:
        print("Port 5000 is in use, trying port 8080 instead.")
        app.run(host="0.0.0.0", port=8080, debug=True)
