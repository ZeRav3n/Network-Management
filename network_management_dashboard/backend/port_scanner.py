import socket
from typing import List, Tuple


class PortScanner:
    def __init__(self, target: str):
        self.target = target

    def scan_ports(self, start_port: int, end_port: int) -> List[Tuple[int, str]]:
        open_ports = []
        target_ip = socket.gethostbyname(self.target)

        for port in range(start_port, end_port + 1):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((target_ip, port))
            if result == 0:
                service_name = socket.getservbyport(port, "tcp")
                open_ports.append((port, service_name))
            sock.close()

        return open_ports