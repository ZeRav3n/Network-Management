from scapy.layers.inet import IP, ICMP
from scapy.sendrecv import sr1

class Traceroute:
    def __init__(self, target):
        self.target = target

    def trace(self):
        hops = []
        max_ttl = 30

        for ttl in range(1, max_ttl + 1):
            p = IP(dst=self.target, ttl=ttl) / ICMP()
            r = sr1(p, verbose=0, timeout=2)

            if r is None:
                hops.append("*")
            elif r.type == 3:
                hops.append(r.src)
                break
            else:
                hops.append(r.src)

        return hops


if __name__ == "__main__":
    target = input("Enter a target (domain or IP address): ")
    tracer = Traceroute(target)
    hops = tracer.trace()

    for i, hop in enumerate(hops, start=1):
        print(f"{i}. {hop}")
