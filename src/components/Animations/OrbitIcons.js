export default function OrbitIcons({
  icons,
  outerIcons = [],
  size = 500,
  iconSize = 48,
  outerIconSize = 48,
}) {
  const outerSize = size + 180;
  const radius = size / 2 - iconSize / 2;
  const outerRadius = outerSize / 2 - outerIconSize / 2;
  const count = icons.length;
  const outerCount = outerIcons.length;

  return (
    <div
      className="orbit-outer-container group"
      style={{
        width: outerSize,
        height: outerSize,
        position: "relative",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Circle Big Out */}
      <div
        className="orbit-outer-circle"
        style={{
          width: outerSize,
          height: outerSize,
          borderRadius: "50%",
          border: "1px solid",
          position: "absolute",
          top: 0,
          left: 0,
          boxSizing: "border-box",
          zIndex: 1,
        }}
      />
      {/* Icon Out */}
      <div
        className="orbit-outer-icons-group"
        style={{
          width: outerSize,
          height: outerSize,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {outerIcons.map((icon, i) => {
          const angle = (360 / outerCount) * i;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: outerIconSize,
                height: outerIconSize,
                marginLeft: -outerIconSize / 2,
                marginTop: -outerIconSize / 2,
                pointerEvents: "auto",
                transform: `rotate(${angle}deg) translate(${outerRadius + outerIconSize / 2}px)`,
                transition: "transform 0.3s",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "white",
                  borderRadius: "50%",
                }}
              >
                {icon}
              </div>
            </div>
          );
        })}
      </div>
      {/* Circle small int */}
      <div
        className="orbit-container"
        style={{
          width: size,
          height: size,
          position: "absolute",
          top: (outerSize - size) / 2,
          left: (outerSize - size) / 2,
          zIndex: 3,
        }}
      >
        <div
          className="orbit-circle"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: "1px solid",
            position: "absolute",
            top: 0,
            left: 0,
            boxSizing: "border-box",
          }}
        />
        <div
          className="orbit-icons-group"
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        >
          {icons.map((icon, i) => {
            const angle = (360 / count) * i;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: iconSize,
                  height: iconSize,
                  marginLeft: -iconSize / 2,
                  marginTop: -iconSize / 2,
                  pointerEvents: "auto",
                  transform: `rotate(${angle}deg) translate(${radius + iconSize / 2}px)`,
                  transition: "transform 0.3s",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  {icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .orbit-outer-container .orbit-container,
        .orbit-outer-container .orbit-outer-circle,
        .orbit-outer-container .orbit-outer-icons-group,
        .orbit-outer-container .orbit-icons-group {
          animation: orbit-spin 10s linear infinite;
        }
        @keyframes orbit-spin {
          100% {
            transform: rotate(360deg);
          }
        }
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .orbit-outer-circle,
          .orbit-circle {
            border-color: #fff !important;
          }
        }
      `}</style>
    </div>
  )
}
