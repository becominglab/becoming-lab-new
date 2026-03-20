"use client";

export default function TopBar({ isActive }: { isActive: boolean }) {
  return (
    <div className="sn-topbar">
      <div className="sn-topbar-logo">
        <div className="sn-topbar-logo-icon">LH</div>
        <span>Sales Navigator</span>
      </div>
      {isActive && (
        <div className="sn-topbar-status">
          <span className="sn-topbar-status-dot" />
          接客中
        </div>
      )}
    </div>
  );
}
