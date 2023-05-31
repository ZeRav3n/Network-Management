from flask import Flask, request, jsonify
from flask_cors import CORS
from ping3 import ping, verbose_ping
from flask_sqlalchemy import SQLAlchemy
import dns.resolver
import ipaddress
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import traceback
from traceroute_scapy import Traceroute
from port_scanner import PortScanner
import psutil



app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///network_management_dashboard.db'
app.config['JWT_SECRET_KEY'] = 'asdfgh98765'

db = SQLAlchemy(app)
jwt = JWTManager(app)

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(15), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Device {self.name}>'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Add a new device
@app.route('/devices', methods=['POST'])
def add_device():
    data = request.get_json()
    device = Device(
        name=data['name'],
        ip_address=data['ip_address'],
        device_type=data['device_type']
    )
    db.session.add(device)
    db.session.commit()
    return jsonify({"message": "Device added"}), 201

# Get all devices
@app.route('/devices', methods=['GET'])
def get_devices():
    devices = Device.query.all()
    return jsonify([{"id": d.id, "name": d.name, "ip_address": d.ip_address, "device_type": d.device_type} for d in devices])

# Update a device
@app.route('/devices/<int:device_id>', methods=['PUT'])
def update_device(device_id):
    data = request.get_json()
    device = Device.query.get_or_404(device_id)
    device.name = data['name']
    device.ip_address = data['ip_address']
    device.device_type = data['device_type']
    db.session.commit()
    return jsonify({"message": "Device updated"})

# Delete a device
@app.route('/devices/<int:device_id>', methods=['DELETE'])
def delete_device(device_id):
    device = Device.query.get_or_404(device_id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({"message": "Device deleted"})

# Ping a device
@app.route('/ping', methods=['POST'])
def perform_ping():
    data = request.get_json()
    target = data['target']
    try:
        count = 10
        total_response_time = 0
        sent_packets = 0
        received_packets = 0
        min_time = float('inf')
        max_time = 0

        for _ in range(count):
            response_time = ping(target, timeout=2)
            if response_time is not None:
                received_packets += 1
                total_response_time += response_time
                min_time = min(min_time, response_time)
                max_time = max(max_time, response_time)
            sent_packets += 1

        if received_packets > 0:
            avg_time = total_response_time / received_packets
            packet_loss = ((sent_packets - received_packets) / sent_packets) * 100
            return jsonify({
                "status": "success",
                "responseTime": avg_time,
                "packetLoss": packet_loss,
                "minTime": min_time,
                "maxTime": max_time,
                "sentPackets": sent_packets,
                "receivedPackets": received_packets
            })
        else:
            return jsonify({"status": "timeout"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})



# DNS Lookup
@app.route('/dns_lookup', methods=['POST'])
def dns_lookup():
    data = request.get_json()
    target = data['target']
    try:
        result = dns.resolver.resolve(target, "A")
        ip_addresses = [record.to_text() for record in result]
        return jsonify({"status": "success", "ip_addresses": ip_addresses})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# Subnet Calculator    
@app.route('/subnet_calculator', methods=['POST'])
def subnet_calculator():
    data = request.get_json()
    ip = data['ip']
    subnet_mask = data['subnet_mask']

    try:
        network = ipaddress.IPv4Network(f"{ip}/{subnet_mask}", strict=False)
        # Usable Hosts Range
        first_usable_ip = network.network_address
        last_usable_ip = network.broadcast_address

        # Available Host IPs (including network and broadcast addresses)
        host_ips = [str(host) for host in network]
        return jsonify({
            "status": "success",
            "network_address": str(network.network_address),
            "broadcast_address": str(network.broadcast_address),
            "num_addresses": network.num_addresses,
            "usable_hosts_range": {
                "first_usable_ip": str(first_usable_ip),
                "last_usable_ip": str(last_usable_ip),
            },
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    
# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"}), 201

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Traceroute function
@app.route('/traceroute', methods=['POST'])
def perform_traceroute():
    data = request.get_json()
    target = data['target']

    try:
        tracer = Traceroute(target)
        hops = tracer.trace()
        formatted_hops = [f"{i+1}. {hop}" for i, hop in enumerate(hops)]
        print("Hops:", formatted_hops)
        return jsonify({"status": "success", "hops": formatted_hops})
    except Exception as e:
        print(f"Exception type: {type(e)}")
        print(f"Exception message: {str(e)}")
        print("Traceback:")
        print(traceback.format_exc())
        return jsonify({"status": "error", "message": str(e)})

# Port Scanner
@app.route('/port_scan', methods=['POST'])
def port_scan():
    data = request.get_json()
    target = data['target']
    start_port = int(data['start_port'])
    end_port = int(data['end_port'])

    scanner = PortScanner(target)
    open_ports = scanner.scan_ports(start_port, end_port)

    return jsonify({"open_ports": open_ports})

# Network Stats
@app.route('/network_stats', methods=['GET'])
def network_stats():
    try:
        net_io_counters = psutil.net_io_counters()
        net_connections = psutil.net_connections(kind='inet')
        net_if_addrs = psutil.net_if_addrs()
        net_if_stats = psutil.net_if_stats()

        return jsonify({
            "status": "success",
            "net_io_counters": net_io_counters._asdict(),
            "net_connections": len(net_connections),
            "net_if_addrs": {k: [addr._asdict() for addr in v] for k, v in net_if_addrs.items()},
            "net_if_stats": {k: v._asdict() for k, v in net_if_stats.items()},
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)