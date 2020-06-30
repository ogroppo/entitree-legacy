import React from "react";

export default function Logo() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 100 100">
      <circle fill="currentColor" cx="8" cy="50" r="8" />
      <path
        stroke="currentColor"
        stroke-linecap="butt"
        stroke-width="16"
        fill="none"
        d="M80,8 H40 A16 16 0 0 0 32 16 V76 A16 16 0 0 0 40 92 H80"
      />
      <path
        stroke="currentColor"
        stroke-linecap="butt"
        stroke-width="16"
        fill="none"
        d="M20,50 H80"
      />
      <circle fill="currentColor" cx="92" cy="8" r="8" />
      <circle fill="currentColor" cx="92" cy="50" r="8" />
      <circle fill="currentColor" cx="92" cy="92" r="8" />
    </svg>
  );
}
