"use client";

import { useState } from "react";

const PURPOSES = [
  "新規来店",
  "リピート相談",
  "コーディネート",
  "リノベーション",
  "家具選び",
];

export default function NewSessionModal({
  onStart,
}: {
  onStart: (name: string, purpose: string) => void;
}) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        paddingTop: "72px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: "#008AB7",
            display: "grid",
            placeItems: "center",
            fontSize: 28,
            color: "white",
            fontWeight: 800,
            margin: "0 auto 20px",
            boxShadow: "0 8px 32px rgba(0, 138, 183, 0.25)",
          }}
        >
          LH
        </div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#161616",
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Sales Navigator
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#9A9A9A",
            lineHeight: 1.6,
          }}
        >
          顧客の価値観を引き出し
          <br />
          最適な空間を提案する
        </p>
      </div>

      <div className="sn-card" style={{ width: "100%", maxWidth: 400 }}>
        <div className="sn-card-header">
          <span className="sn-card-title">新しい接客を開始</span>
        </div>

        <input
          type="text"
          className="sn-modal-input"
          placeholder="お客様名（例：山田様ご夫妻）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div
          style={{
            fontSize: 11,
            color: "#9A9A9A",
            fontWeight: 500,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          来店目的
        </div>
        <div className="sn-quick-actions" style={{ marginBottom: 20 }}>
          {PURPOSES.map((p) => (
            <button
              key={p}
              className="sn-quick-btn"
              onClick={() => setPurpose(p)}
              style={
                purpose === p
                  ? {
                      borderColor: "#008AB7",
                      color: "#008AB7",
                      background: "rgba(0, 138, 183, 0.08)",
                    }
                  : undefined
              }
            >
              {p}
            </button>
          ))}
        </div>

        <button
          className="sn-generate-btn"
          disabled={!name.trim() || !purpose}
          onClick={() => onStart(name.trim(), purpose)}
          style={{
            background:
              name.trim() && purpose
                ? "#008AB7"
                : undefined,
            color: name.trim() && purpose ? "white" : undefined,
          }}
        >
          接客を開始する
        </button>
      </div>
    </div>
  );
}
