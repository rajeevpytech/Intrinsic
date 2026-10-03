import React from "react";

/*
 * Decorative animated network graphic (nodes + flowing connections).
 * Purely visual motion for a modern, professional feel.
 */
const nodes = [
  { x: 60, y: 80 }, { x: 210, y: 40 }, { x: 360, y: 120 }, { x: 520, y: 60 },
  { x: 680, y: 140 }, { x: 140, y: 220 }, { x: 320, y: 260 }, { x: 480, y: 210 },
  { x: 640, y: 280 }, { x: 780, y: 200 },
];

const links = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [2, 6], [3, 7], [4, 9], [8, 9], [1, 6], [7, 4],
];

const NetworkGraphic = ({ color = "#ffffff", accent = "#faaf6a", className = "" }) => {
  return (
    <svg
      viewBox="0 0 840 320"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke={color} strokeWidth="1" opacity="0.5">
        {links.map(([a, b], i) => (
          <line
            key={i}
            className="net-line"
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            style={{ animationDelay: `${(i % 5) * -3}s` }}
          />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          className={i % 3 === 0 ? "net-node-lg" : "net-node"}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 5 : 3}
          fill={i % 4 === 0 ? accent : color}
          style={{ animationDelay: `${(i % 6) * -0.8}s` }}
        />
      ))}
    </svg>
  );
};

export default NetworkGraphic;
