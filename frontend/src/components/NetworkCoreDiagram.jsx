const CORE = { x: 686, y: 580 };
const NODES = [
  { id: "wireless", label: "WIRELESS", x: 686, y: 120 },
  { id: "hq", label: "HQ", x: 213, y: 293 },
  { id: "cloud", label: "CLOUD", x: 1167, y: 253 },
  { id: "branch", label: "BRANCH", x: 211, y: 855 },
  { id: "edge", label: "EDGE", x: 686, y: 935 },
  { id: "remote", label: "REMOTE", x: 1203, y: 855 },
];
const LINKS = [...NODES.map((n) => [CORE, n]), [NODES[2], NODES[5]]];

const NetworkCoreDiagram = ({ max = 560, className = "" }) => (
  <svg
    viewBox="0 0 1400 1083"
    className={`nw-core w-full h-auto ${className}`}
    style={{ maxWidth: max }}
    role="img"
    aria-label="HQ, branch, wireless, cloud, edge and remote sites connected to the network core"
    data-testid="network-core-image"
  >
    <defs>
      <radialGradient id="nwCoreGrad" cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="#ffd08a" />
        <stop offset="1" stopColor="#f28c1e" />
      </radialGradient>
    </defs>
    {LINKS.map(([a, b], i) => (
      <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b3c7e3" strokeWidth="3" />
    ))}
    {LINKS.map(([a, b], i) => (
      <circle key={`p${i}`} r="7" fill="#f5a33b">
        <animateMotion dur={`${3.2 + (i % 3) * 0.6}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" path={`M${a.x},${a.y} L${b.x},${b.y}`} />
      </circle>
    ))}
    {NODES.map((n, i) => (
      <g key={n.id} className="nw-node" style={{ "--i": i }}>
        <circle cx={n.x} cy={n.y} r="50" fill="#eef4fb" stroke="#1d4f91" strokeWidth="4" />
        <circle cx={n.x} cy={n.y} r="50" fill="none" stroke="#1d4f91" strokeWidth="2" className="nw-ring" />
        <circle cx={n.x} cy={n.y} r="11" fill="#f5a33b" />
        <text x={n.x} y={n.y + 105} textAnchor="middle" fill="#0f2a5e" fontSize="30" fontWeight="600" letterSpacing="6" fontFamily="DM Sans, sans-serif">{n.label}</text>
      </g>
    ))}
    <circle cx={CORE.x} cy={CORE.y} r="62" fill="#f5a33b" opacity="0.28" className="nw-core-glow" />
    <circle cx={CORE.x} cy={CORE.y} r="62" fill="url(#nwCoreGrad)" />
    <text x={CORE.x} y={CORE.y + 118} textAnchor="middle" fill="#0f2a5e" fontSize="30" fontWeight="600" letterSpacing="6" fontFamily="DM Sans, sans-serif">CORE</text>
  </svg>
);

export default NetworkCoreDiagram;
