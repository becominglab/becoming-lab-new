'use client';

import { useEffect, useState } from 'react';
import { voices } from '@/content/voices';

const INTERVAL = 4500;
const FADE = 550;

export default function Voices() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || voices.length < 2) return;

    const timer = window.setInterval(() => {
      setFading(true);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % voices.length);
        setFading(false);
      }, FADE);
    }, INTERVAL);

    return () => window.clearInterval(timer);
  }, []);

  const voice = voices[index];

  return (
    <section className="bc-voices" aria-label="参加した方が持ち帰った言葉">
      <div className="bc-wrap">
        <p className="bc-eyebrow">その日、持ち帰ったもの</p>
        <p
          className={`bc-voice bc-voice-text${fading ? ' bc-fade-out' : ''}`}
          aria-live="polite"
        >
          {voice.text}
        </p>
        {voice.vol && (
          <p className={`bc-voice-meta${fading ? ' bc-fade-out' : ''}`}>
            vol.{voice.vol}
          </p>
        )}
      </div>
    </section>
  );
}
