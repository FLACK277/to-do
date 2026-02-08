/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          🌿 Ghibli-Inspired 3D To-Do List App 🌿               ║
 * ║                                                                  ║
 * ║  A cozy, whimsical task manager with original characters,        ║
 * ║  hand-painted aesthetic, and magical interactions.                ║
 * ║                                                                  ║
 * ║  Tech: React 18 + React Three Fiber + Drei + Zustand + GSAP     ║
 * ║  Audio: Web Audio API (original synthesized music & SFX)         ║
 * ║  All assets are procedurally generated — no external files.      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 *  SETUP INSTRUCTIONS:
 *  ────────────────────
 *  Option A — Single HTML file (easiest):
 *    1. Save this entire file as "index.html"
 *    2. Open it in a modern browser (Chrome/Edge/Firefox)
 *    3. That's it! Everything loads from CDN.
 *
 *  Option B — With a bundler (Vite/CRA):
 *    1. npm create vite@latest ghibli-todo -- --template react
 *    2. npm install three @react-three/fiber @react-three/drei zustand gsap
 *    3. Copy the React code into your App.jsx
 *    4. npm run dev
 *
 *  FEATURES:
 *  ─────────
 *  ✅ Add / Edit / Delete / Complete tasks
 *  ✅ Drag & drop between To Do / Doing / Done columns
 *  ✅ Filter: All / Active / Completed
 *  ✅ Search tasks
 *  ✅ localStorage persistence
 *  ✅ 3 original fantasy characters with idle & reaction animations
 *  ✅ Procedural Ghibli-style environment (floating island, meadow, sky)
 *  ✅ Synthesized lo-fi piano background music (toggle on/off)
 *  ✅ Sound effects (chime, pop, paper sounds)
 *  ✅ Parallax camera following mouse
 *  ✅ Particles: pollen, leaves, dust motes
 *  ✅ Bloom, soft shadows, warm lighting
 *  ✅ Responsive desktop layout
 *
 *  FILE/COMPONENT STRUCTURE (logical sections within this file):
 *  ──────────────────────────────────────────────────────────────
 *  §1  — Constants & Theme
 *  §2  — Audio System (Web Audio API: music + SFX)
 *  §3  — State Management (Zustand store)
 *  §4  — 3D Scene Components
 *        §4a — Environment (sky, island, grass, clouds, particles)
 *        §4b — Characters (Kodama forest spirit, Sora flying cat, Tink robot)
 *        §4c — Task Cards (3D floating paper notes)
 *        §4d — Signboards & Furniture
 *  §5  — UI Overlay Components (HUD, input, filters, search)
 *  §6  — Main App Component
 *  §7  — Entry Point / Render
 */

// ═══════════════════════════════════════════════════════════════
// We wrap everything in an IIFE so it works as both an HTML file
// (with CDN imports) and as a JS module.
// ═══════════════════════════════════════════════════════════════

const APP_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🌿 Cozy To-Do — A Ghibli-Inspired Task Manager</title>

  <!-- ─── Fonts ─── -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet" />

  <!-- ─── Import Maps for ES modules from CDN ─── -->
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.2.0",
      "react-dom": "https://esm.sh/react-dom@18.2.0",
      "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
      "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime",
      "three": "https://esm.sh/three@0.160.0",
      "three/examples/jsm/": "https://esm.sh/three@0.160.0/examples/jsm/",
      "@react-three/fiber": "https://esm.sh/@react-three/fiber@8.15.12?deps=react@18.2.0,three@0.160.0",
      "@react-three/drei": "https://esm.sh/@react-three/drei@9.93.0?deps=react@18.2.0,three@0.160.0,@react-three/fiber@8.15.12",
      "@react-three/postprocessing": "https://esm.sh/@react-three/postprocessing@2.16.2?deps=react@18.2.0,three@0.160.0,@react-three/fiber@8.15.12",
      "postprocessing": "https://esm.sh/postprocessing@6.35.6?deps=three@0.160.0",
      "zustand": "https://esm.sh/zustand@4.4.7?deps=react@18.2.0",
      "zustand/middleware": "https://esm.sh/zustand@4.4.7/middleware?deps=react@18.2.0",
      "gsap": "https://esm.sh/gsap@3.12.4",
      "uuid": "https://esm.sh/uuid@9.0.0"
    }
  }
  <\/script>

  <style>
    /* ═══════════════════════════════════════════ */
    /*  §1 — GLOBAL STYLES & THEME                */
    /* ═══════════════════════════════════════════ */

    :root {
      --color-bg: #fdf6e3;
      --color-card: #fffef9;
      --color-primary: #7cb342;
      --color-primary-dark: #558b2f;
      --color-accent: #ffb74d;
      --color-accent-dark: #f57c00;
      --color-danger: #e57373;
      --color-text: #4e342e;
      --color-text-light: #8d6e63;
      --color-shadow: rgba(78, 52, 46, 0.15);
      --color-doing: #64b5f6;
      --color-done: #81c784;
      --font-display: 'Patrick Hand', cursive;
      --font-body: 'Quicksand', sans-serif;
      --radius: 16px;
      --radius-sm: 10px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body, #root {
      width: 100%; height: 100%;
      overflow: hidden;
      font-family: var(--font-body);
      color: var(--color-text);
      background: var(--color-bg);
    }

    /* ─── Canvas occupies full screen ─── */
    .canvas-container {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
    }

    /* ─── UI Overlay ─── */
    .ui-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 10;
      pointer-events: none;
      display: flex;
      flex-direction: column;
    }

    .ui-overlay > * {
      pointer-events: auto;
    }

    /* ─── Top Bar ─── */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: linear-gradient(180deg, rgba(253,246,227,0.95) 0%, rgba(253,246,227,0) 100%);
    }

    .app-title {
      font-family: var(--font-display);
      font-size: 2rem;
      color: var(--color-primary-dark);
      text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .top-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    /* ─── Buttons ─── */
    .btn {
      border: none;
      border-radius: var(--radius-sm);
      padding: 8px 16px;
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px var(--color-shadow);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--color-shadow);
    }

    .btn:active { transform: translateY(0); }

    .btn-primary {
      background: var(--color-primary);
      color: white;
    }

    .btn-accent {
      background: var(--color-accent);
      color: white;
    }

    .btn-ghost {
      background: rgba(255,255,255,0.7);
      color: var(--color-text);
      backdrop-filter: blur(4px);
    }

    .btn-ghost.active {
      background: var(--color-primary);
      color: white;
    }

    .btn-danger {
      background: var(--color-danger);
      color: white;
    }

    .btn-icon {
      width: 40px; height: 40px;
      padding: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    /* ─── Search Bar ─── */
    .search-bar {
      position: relative;
      width: 220px;
    }

    .search-bar input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      border: 2px solid transparent;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.75);
      backdrop-filter: blur(4px);
      font-family: var(--font-body);
      font-size: 0.9rem;
      color: var(--color-text);
      outline: none;
      transition: all 0.2s;
      box-shadow: 0 2px 8px var(--color-shadow);
    }

    .search-bar input:focus {
      border-color: var(--color-primary);
      background: rgba(255,255,255,0.95);
    }

    .search-bar .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem;
      opacity: 0.5;
    }

    /* ─── Filter Bar ─── */
    .filter-bar {
      display: flex;
      gap: 6px;
      padding: 0 24px 8px;
    }

    /* ─── Main Content Area ─── */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 24px;
      overflow: hidden;
    }

    /* ─── Columns Layout ─── */
    .columns {
      display: flex;
      gap: 16px;
      flex: 1;
      overflow: hidden;
      padding-bottom: 16px;
    }

    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: rgba(255,255,255,0.3);
      backdrop-filter: blur(8px);
      border-radius: var(--radius);
      padding: 12px;
      min-height: 200px;
      border: 2px dashed transparent;
      transition: all 0.3s ease;
    }

    .column.drag-over {
      border-color: var(--color-primary);
      background: rgba(124, 179, 66, 0.1);
    }

    .column-header {
      font-family: var(--font-display);
      font-size: 1.3rem;
      padding: 8px 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .column-header .badge {
      background: rgba(78,52,46,0.1);
      border-radius: 20px;
      padding: 2px 10px;
      font-size: 0.8rem;
      font-family: var(--font-body);
      font-weight: 600;
    }

    .column-todo .column-header { color: var(--color-accent-dark); }
    .column-doing .column-header { color: #1976d2; }
    .column-done .column-header { color: var(--color-primary-dark); }

    .column-tasks {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-right: 4px;
    }

    .column-tasks::-webkit-scrollbar { width: 4px; }
    .column-tasks::-webkit-scrollbar-track { background: transparent; }
    .column-tasks::-webkit-scrollbar-thumb {
      background: rgba(78,52,46,0.2);
      border-radius: 4px;
    }

    /* ─── Task Card ─── */
    .task-card {
      background: var(--color-card);
      border-radius: var(--radius-sm);
      padding: 12px;
      box-shadow: 0 2px 8px var(--color-shadow);
      cursor: grab;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      border-left: 4px solid var(--color-accent);
      user-select: none;
    }

    .task-card:hover {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: 0 6px 20px var(--color-shadow);
    }

    .task-card:active { cursor: grabbing; }

    .task-card.dragging {
      opacity: 0.5;
      transform: rotate(2deg);
    }

    .task-card.completed {
      border-left-color: var(--color-done);
      opacity: 0.75;
    }

    .task-card.completed .task-text {
      text-decoration: line-through;
      color: var(--color-text-light);
    }

    .task-card.doing {
      border-left-color: var(--color-doing);
    }

    .task-text {
      font-size: 0.95rem;
      line-height: 1.4;
      margin-bottom: 8px;
      word-break: break-word;
    }

    .task-actions {
      display: flex;
      gap: 6px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .task-card:hover .task-actions { opacity: 1; }

    .task-btn {
      border: none;
      background: rgba(78,52,46,0.08);
      border-radius: 6px;
      width: 28px; height: 28px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.15s;
    }

    .task-btn:hover {
      background: rgba(78,52,46,0.15);
      transform: scale(1.1);
    }

    .task-btn.check:hover { background: rgba(124,179,66,0.2); }
    .task-btn.delete:hover { background: rgba(229,115,115,0.2); }

    /* ─── Bottom Input Area ─── */
    .input-area {
      padding: 16px 24px 20px;
      background: linear-gradient(0deg, rgba(253,246,227,0.95) 0%, rgba(253,246,227,0) 100%);
    }

    .input-container {
      display: flex;
      gap: 10px;
      max-width: 600px;
      margin: 0 auto;
    }

    .input-container input {
      flex: 1;
      padding: 12px 18px;
      border: 2px solid rgba(78,52,46,0.15);
      border-radius: var(--radius);
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(4px);
      font-family: var(--font-display);
      font-size: 1.1rem;
      color: var(--color-text);
      outline: none;
      transition: all 0.2s;
      box-shadow: 0 2px 12px var(--color-shadow);
    }

    .input-container input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 4px 20px rgba(124,179,66,0.2);
    }

    .input-container input::placeholder {
      color: var(--color-text-light);
      opacity: 0.6;
    }

    /* ─── Edit Modal ─── */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(78,52,46,0.3);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      animation: fadeIn 0.2s ease;
    }

    .modal {
      background: var(--color-card);
      border-radius: var(--radius);
      padding: 24px;
      width: 400px;
      max-width: 90%;
      box-shadow: 0 12px 40px rgba(78,52,46,0.25);
      animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .modal h3 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      margin-bottom: 16px;
      color: var(--color-primary-dark);
    }

    .modal textarea {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 2px solid rgba(78,52,46,0.15);
      border-radius: var(--radius-sm);
      font-family: var(--font-display);
      font-size: 1.05rem;
      color: var(--color-text);
      resize: vertical;
      outline: none;
      transition: border-color 0.2s;
    }

    .modal textarea:focus {
      border-color: var(--color-primary);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }

    /* ─── Character tooltip ─── */
    .character-speech {
      position: fixed;
      bottom: 100px;
      left: 24px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(8px);
      border-radius: var(--radius);
      padding: 12px 18px;
      font-family: var(--font-display);
      font-size: 1rem;
      color: var(--color-text);
      box-shadow: 0 4px 16px var(--color-shadow);
      max-width: 280px;
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 20;
      pointer-events: none;
    }

    .character-speech::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 20px;
      width: 16px;
      height: 16px;
      background: rgba(255,255,255,0.92);
      transform: rotate(45deg);
      border-radius: 2px;
    }

    /* ─── Music indicator ─── */
    .music-indicator {
      display: flex;
      gap: 2px;
      align-items: flex-end;
      height: 16px;
    }

    .music-indicator .bar {
      width: 3px;
      background: currentColor;
      border-radius: 2px;
      animation: musicBar 0.8s ease-in-out infinite alternate;
    }

    .music-indicator .bar:nth-child(1) { height: 6px; animation-delay: 0s; }
    .music-indicator .bar:nth-child(2) { height: 10px; animation-delay: 0.2s; }
    .music-indicator .bar:nth-child(3) { height: 8px; animation-delay: 0.4s; }
    .music-indicator .bar:nth-child(4) { height: 12px; animation-delay: 0.1s; }

    .music-indicator.paused .bar { animation-play-state: paused; }

    @keyframes musicBar {
      to { height: 16px; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ─── Responsive adjustments ─── */
    @media (max-width: 900px) {
      .columns {
        flex-direction: column;
        overflow-y: auto;
      }
      .column { min-height: 150px; }
    }

    /* ─── Loading ─── */
    .loading-screen {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: var(--color-bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      font-family: var(--font-display);
    }

    .loading-screen h1 {
      font-size: 2.5rem;
      color: var(--color-primary-dark);
      margin-bottom: 16px;
    }

    .loading-dots {
      display: flex;
      gap: 8px;
    }

    .loading-dots span {
      width: 12px; height: 12px;
      border-radius: 50%;
      background: var(--color-primary);
      animation: bounce 0.6s ease-in-out infinite alternate;
    }

    .loading-dots span:nth-child(2) { animation-delay: 0.1s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.2s; }

    @keyframes bounce {
      to { transform: translateY(-8px); opacity: 0.5; }
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading-screen">
      <h1>🌿 Cozy To-Do</h1>
      <p style="color: #8d6e63; margin-bottom: 24px;">Preparing your cozy workspace...</p>
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>

  <script type="module">
// ═══════════════════════════════════════════════════════════════════
// §1 — IMPORTS
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  OrbitControls, Float, Text, Cloud, Stars, 
  Environment, Sparkles, Billboard, Html,
  Sphere, Box, Cylinder, Cone, Torus, RoundedBox
} from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import gsap from 'gsap';

const h = React.createElement;

// ═══════════════════════════════════════════════════════════════════
// §2 — AUDIO SYSTEM (Web Audio API)
// ═══════════════════════════════════════════════════════════════════

/**
 * AudioEngine — Synthesizes all music and sound effects procedurally.
 * No external audio files needed! Everything is generated in real-time.
 */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isPlaying = false;
    this.musicNodes = [];
    this.initialized = false;
    this.musicInterval = null;
  }

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.3;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.6;
    this.sfxGain.connect(this.masterGain);

    // Add reverb for warmth
    this.convolver = this.ctx.createConvolver();
    const rate = this.ctx.sampleRate;
    const length = rate * 2;
    const impulse = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    this.convolver.buffer = impulse;
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.15;
    this.convolver.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);

    this.initialized = true;
  }

  /**
   * Play a soft piano-like note using FM synthesis.
   */
  playNote(freq, startTime, duration, velocity = 0.3, pan = 0) {
    if (!this.ctx) return;
    const t = startTime;

    // Carrier oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Modulator for FM synthesis (gives piano-like timbre)
    const mod = this.ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.value = freq * 2;
    const modGain = this.ctx.createGain();
    modGain.gain.value = freq * 0.5;
    mod.connect(modGain);
    modGain.connect(osc.frequency);

    // Envelope
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(velocity, t + 0.02);
    env.gain.exponentialRampToValueAtTime(velocity * 0.6, t + 0.1);
    env.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // Panning
    const panner = this.ctx.createStereoPanner();
    panner.pan.value = pan;

    // Connect
    osc.connect(env);
    env.connect(panner);
    panner.connect(this.musicGain);
    panner.connect(this.convolver);

    osc.start(t);
    osc.stop(t + duration + 0.1);
    mod.start(t);
    mod.stop(t + duration + 0.1);

    return osc;
  }

  /**
   * Generate a Ghibli-style piano melody loop.
   * Uses pentatonic scale progressions reminiscent of warm, pastoral music.
   */
  startMusic() {
    if (!this.initialized) this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.musicGain.gain.value = 0.25;

    // Pentatonic scale in C major (Ghibli-like)
    const scale = [
      261.63, 293.66, 329.63, 392.00, 440.00, // C4 D4 E4 G4 A4
      523.25, 587.33, 659.25, 783.99, 880.00, // C5 D5 E5 G5 A5
    ];

    // Chord progressions (indices into scale)
    const progressions = [
      [0, 2, 4],    // C E G
      [3, 5, 7],    // G C E (up)
      [1, 3, 5],    // D G C
      [4, 6, 8],    // A D G
      [0, 2, 4],    // C E G
      [2, 4, 6],    // E G D
      [1, 4, 6],    // D G D
      [0, 3, 5],    // C G C
    ];

    // Melody patterns (scale degrees) — original composition
    const melodies = [
      [4, -1, 5, 4, 3, -1, 2, 0],
      [2, 3, 4, -1, 5, 4, 3, 2],
      [0, -1, 2, 4, 5, -1, 4, 3],
      [5, 4, 3, 2, -1, 0, 2, 3],
      [4, 5, 7, 5, 4, -1, 3, 2],
      [0, 2, 3, 4, -1, 5, 4, 2],
      [3, -1, 4, 5, 4, 3, 2, 0],
      [2, 4, 5, -1, 4, 3, 2, 0],
    ];

    let barIndex = 0;
    const bpm = 72;
    const beatDuration = 60 / bpm;
    const barDuration = beatDuration * 4;

    const playBar = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime + 0.1;
      const progIdx = barIndex % progressions.length;
      const melIdx = barIndex % melodies.length;
      const chord = progressions[progIdx];
      const melody = melodies[melIdx];

      // Play chord notes (soft, sustained)
      chord.forEach((noteIdx, i) => {
        const freq = scale[noteIdx] * 0.5; // One octave lower for warmth
        this.playNote(freq, now + i * 0.03, barDuration * 0.9, 0.12, (i - 1) * 0.3);
      });

      // Play melody notes
      melody.forEach((noteIdx, i) => {
        if (noteIdx === -1) return; // Rest
        const freq = scale[Math.min(noteIdx, scale.length - 1)];
        const time = now + i * (barDuration / melody.length);
        const dur = barDuration / melody.length * 0.8;
        const vel = 0.15 + Math.random() * 0.08;
        const p = (i / melody.length - 0.5) * 0.4;
        this.playNote(freq, time, dur, vel, p);
      });

      // Occasional high sparkle note
      if (Math.random() > 0.6) {
        const sparkleFreq = scale[Math.floor(Math.random() * 5)] * 2;
        const sparkleTime = now + Math.random() * barDuration * 0.5;
        this.playNote(sparkleFreq, sparkleTime, 0.8, 0.06, Math.random() * 0.6 - 0.3);
      }

      barIndex++;
    };

    playBar();
    this.musicInterval = setInterval(playBar, barDuration * 1000);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain) {
      this.musicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    }
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isPlaying;
  }

  // ─── Sound Effects ───

  playSfxAdd() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    // Gentle paper/writing sound + soft chime
    this.playChime(now, 523.25, 0.15); // C5
    this.playChime(now + 0.1, 659.25, 0.12); // E5
    this.playChime(now + 0.2, 783.99, 0.10); // G5
    this.playNoise(now, 0.08, 0.15); // paper rustle
  }

  playSfxComplete() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    // Happy ascending chime
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      this.playChime(now + i * 0.08, f, 0.2 - i * 0.03);
    });
    // Sparkle
    setTimeout(() => this.playSparkle(), 200);
  }

  playSfxDelete() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    // Soft descending pop
    this.playChime(now, 440, 0.12);
    this.playChime(now + 0.08, 349.23, 0.10);
    this.playNoise(now, 0.06, 0.1);
  }

  playSfxPop() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    this.playChime(now, 600 + Math.random() * 200, 0.08);
  }

  playChime(time, freq, velocity) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 3;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

    const env2 = this.ctx.createGain();
    env2.gain.setValueAtTime(0, time);
    env2.gain.linearRampToValueAtTime(velocity * 0.15, time + 0.005);
    env2.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.connect(env);
    osc2.connect(env2);
    env.connect(this.sfxGain);
    env2.connect(this.sfxGain);
    env.connect(this.convolver);

    osc.start(time);
    osc.stop(time + 0.7);
    osc2.start(time);
    osc2.stop(time + 0.4);
  }

  playNoise(time, velocity, duration) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(velocity, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(env);
    env.connect(this.sfxGain);
    noise.start(time);
    noise.stop(time + duration + 0.1);
  }

  playSparkle() {
    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const freq = 1200 + Math.random() * 800;
      const t = now + i * 0.05 + Math.random() * 0.03;
      this.playChime(t, freq, 0.04);
    }
  }
}

// Singleton audio engine
const audio = new AudioEngine();

// ═══════════════════════════════════════════════════════════════════
// §3 — STATE MANAGEMENT (Zustand with localStorage persistence)
// ═══════════════════════════════════════════════════════════════════

/**
 * Task shape:
 * {
 *   id: string,
 *   text: string,
 *   status: 'todo' | 'doing' | 'done',
 *   createdAt: number,
 *   completedAt: number | null
 * }
 */

const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

const useStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      filter: 'all',       // 'all' | 'active' | 'completed'
      searchQuery: '',
      musicOn: false,
      characterReaction: null, // { type: 'happy' | 'wave' | 'sparkle', timestamp }

      // ─── Task Actions ───
      addTask: (text) => {
        if (!text.trim()) return;
        const task = {
          id: generateId(),
          text: text.trim(),
          status: 'todo',
          createdAt: Date.now(),
          completedAt: null,
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        audio.playSfxAdd();
        set({ characterReaction: { type: 'wave', timestamp: Date.now() } });
      },

      editTask: (id, newText) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, text: newText.trim() } : t
          ),
        }));
        audio.playSfxPop();
      },

      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        audio.playSfxDelete();
      },

      toggleComplete: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        const newStatus = task?.status === 'done' ? 'todo' : 'done';
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: newStatus,
                  completedAt: newStatus === 'done' ? Date.now() : null,
                }
              : t
          ),
        }));
        if (newStatus === 'done') {
          audio.playSfxComplete();
          set({ characterReaction: { type: 'happy', timestamp: Date.now() } });
        } else {
          audio.playSfxPop();
        }
      },

      moveTask: (id, newStatus) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: newStatus,
                  completedAt: newStatus === 'done' ? Date.now() : t.completedAt,
                }
              : t
          ),
        }));
        audio.playSfxPop();
        if (newStatus === 'done') {
          set({ characterReaction: { type: 'happy', timestamp: Date.now() } });
        }
      },

      // ─── Filter & Search ───
      setFilter: (filter) => set({ filter }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ─── Music ───
      setMusicOn: (on) => set({ musicOn: on }),

      // Computed: filtered tasks
      getFilteredTasks: () => {
        const { tasks, filter, searchQuery } = get();
        let filtered = tasks;

        if (filter === 'active') {
          filtered = filtered.filter((t) => t.status !== 'done');
        } else if (filter === 'completed') {
          filtered = filtered.filter((t) => t.status === 'done');
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter((t) => t.text.toLowerCase().includes(q));
        }

        return filtered;
      },
    }),
    {
      name: 'ghibli-todo-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);


// ═══════════════════════════════════════════════════════════════════
// §4a — 3D ENVIRONMENT COMPONENTS
// ═══════════════════════════════════════════════════════════════════

/**
 * PastelSky — Gradient sky with moving clouds
 */
function PastelSky() {
  return h(React.Fragment, null,
    // Sky dome
    h('mesh', { position: [0, 0, 0], scale: [100, 100, 100] },
      h('sphereGeometry', { args: [1, 32, 32] }),
      h('meshBasicMaterial', {
        side: THREE.BackSide,
        color: '#87CEEB',
        toneMapped: false,
      })
    ),
    // Warm gradient plane behind scene
    h('mesh', { position: [0, 15, -30], rotation: [0, 0, 0] },
      h('planeGeometry', { args: [120, 60] }),
      h('meshBasicMaterial', {
        color: '#FFE4C4',
        transparent: true,
        opacity: 0.4,
        toneMapped: false,
      })
    ),
  );
}

/**
 * FloatingIsland — The main ground/island the scene sits on
 */
function FloatingIsland() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = -2.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return h('group', { ref: meshRef },
    // Main island body
    h('mesh', { position: [0, 0, 0], castShadow: true, receiveShadow: true },
      h('cylinderGeometry', { args: [8, 6, 2.5, 32, 1] }),
      h('meshStandardMaterial', {
        color: '#8B7355',
        roughness: 0.9,
        metalness: 0.05,
      })
    ),
    // Green top
    h('mesh', { position: [0, 1.3, 0], receiveShadow: true },
      h('cylinderGeometry', { args: [8.2, 8, 0.4, 32, 1] }),
      h('meshStandardMaterial', {
        color: '#7CB342',
        roughness: 0.85,
        metalness: 0,
      })
    ),
    // Dirt underside
    h('mesh', { position: [0, -1.5, 0] },
      h('coneGeometry', { args: [5, 3, 16] }),
      h('meshStandardMaterial', {
        color: '#6D4C41',
        roughness: 1,
      })
    ),
    // Small rocks
    ...[
      [5, 1.2, 3, 0.4], [-4, 1.2, 4, 0.3], [6, 1.1, -2, 0.35],
      [-5, 1.1, -3, 0.25], [3, 1.3, -5, 0.3],
    ].map(([x, y, z, s], i) =>
      h('mesh', { key: 'rock' + i, position: [x, y, z], rotation: [Math.random(), Math.random(), 0] },
        h('dodecahedronGeometry', { args: [s, 0] }),
        h('meshStandardMaterial', { color: '#9E9E9E', roughness: 0.95 })
      )
    ),
  );
}

/**
 * GrassPatches — Small grass tufts on the island
 */
function GrassPatches() {
  const grassPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 6;
      positions.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        scale: 0.3 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI,
      });
    }
    return positions;
  }, []);

  return h('group', { position: [0, -1, 0] },
    ...grassPositions.map((g, i) =>
      h(GrassTuft, { key: i, position: [g.x, 0, g.z], scale: g.scale, rotation: g.rotation })
    )
  );
}

function GrassTuft({ position, scale, rotation }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 3) * 0.05;
    }
  });

  return h('group', { ref, position, scale: [scale, scale, scale] },
    ...[0, 0.3, -0.3].map((offset, i) =>
      h('mesh', {
        key: i,
        position: [offset * 0.5, 0.3, 0],
        rotation: [0, rotation + i * 0.5, offset * 0.3],
      },
        h('coneGeometry', { args: [0.08, 0.6, 4] }),
        h('meshStandardMaterial', {
          color: i === 1 ? '#66BB6A' : '#43A047',
          roughness: 0.9,
          side: THREE.DoubleSide,
        })
      )
    )
  );
}

/**
 * AnimatedClouds — Fluffy clouds drifting by
 */
function AnimatedClouds() {
  const clouds = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: (Math.random() - 0.5) * 40,
      y: 6 + Math.random() * 6,
      z: -10 - Math.random() * 15,
      scale: 1.5 + Math.random() * 2,
      speed: 0.1 + Math.random() * 0.15,
    })),
    []
  );

  return h('group', null,
    ...clouds.map((c, i) => h(CloudPuff, { key: i, ...c }))
  );
}

function CloudPuff({ x, y, z, scale, speed }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = x + Math.sin(state.clock.elapsedTime * speed) * 3;
      ref.current.position.y = y + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  return h('group', { ref, position: [x, y, z] },
    ...[
      [0, 0, 0, 1],
      [0.8, 0.2, 0.3, 0.7],
      [-0.6, 0.1, -0.2, 0.8],
      [0.3, 0.4, 0.1, 0.6],
      [-0.4, 0.3, 0.4, 0.5],
    ].map(([ox, oy, oz, s], i) =>
      h('mesh', { key: i, position: [ox * scale, oy * scale, oz * scale] },
        h('sphereGeometry', { args: [s * scale * 0.5, 12, 12] }),
        h('meshStandardMaterial', {
          color: '#FFFFFF',
          transparent: true,
          opacity: 0.85,
          roughness: 1,
        })
      )
    )
  );
}

/**
 * Particles — Floating pollen, dust motes, and leaves
 */
function MagicParticles() {
  return h(React.Fragment, null,
    h(Sparkles, {
      count: 60,
      size: 2,
      scale: [20, 10, 20],
      position: [0, 3, 0],
      speed: 0.3,
      color: '#FFD54F',
      opacity: 0.5,
    }),
    h(FloatingLeaves),
    h(DustMotes),
  );
}

function FloatingLeaves() {
  const leaves = useMemo(() =>
    Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: Math.random() * 8,
      z: (Math.random() - 0.5) * 16,
      speed: 0.2 + Math.random() * 0.3,
      rotSpeed: 0.5 + Math.random(),
      phase: Math.random() * Math.PI * 2,
    })),
    []
  );

  return h('group', null,
    ...leaves.map((leaf, i) => h(Leaf, { key: i, ...leaf }))
  );
}

function Leaf({ x, y, z, speed, rotSpeed, phase }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = x + Math.sin(t * speed + phase) * 2;
      ref.current.position.y = y + Math.sin(t * speed * 0.7 + phase) * 1.5;
      ref.current.position.z = z + Math.cos(t * speed * 0.5 + phase) * 1.5;
      ref.current.rotation.x = t * rotSpeed;
      ref.current.rotation.y = t * rotSpeed * 0.7;
    }
  });

  return h('mesh', { ref, position: [x, y, z] },
    h('planeGeometry', { args: [0.15, 0.1] }),
    h('meshStandardMaterial', {
      color: '#66BB6A',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    })
  );
}

function DustMotes() {
  const motes = useMemo(() =>
    Array.from({ length: 30 }, () => ({
      pos: [
        (Math.random() - 0.5) * 20,
        Math.random() * 8 + 1,
        (Math.random() - 0.5) * 20,
      ],
      size: 0.02 + Math.random() * 0.04,
    })),
    []
  );

  return h('group', null,
    ...motes.map((m, i) =>
      h(Float, {
        key: i,
        speed: 0.5 + Math.random(),
        floatIntensity: 0.5 + Math.random() * 0.5,
        rotationIntensity: 0,
      },
        h('mesh', { position: m.pos },
          h('sphereGeometry', { args: [m.size, 6, 6] }),
          h('meshBasicMaterial', {
            color: '#FFECB3',
            transparent: true,
            opacity: 0.4,
          })
        )
      )
    )
  );
}


// ═══════════════════════════════════════════════════════════════════
// §4b — CHARACTERS
// ════════════════════════════════════════════════════════════���══════

/**
 * Kodama — A small forest spirit (glowing white, round, with simple face)
 * Inspired by forest spirits, NOT any specific copyrighted character.
 */
function KodamaSpirit({ position = [-3, 0, 2] }) {
  const groupRef = useRef();
  const headRef = useRef();
  const reaction = useStore((s) => s.characterReaction);
  const [reacting, setReacting] = useState(false);

  // Idle animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current && !reacting) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    }
  });

  // Reaction to task completion
  useEffect(() => {
    if (reaction && groupRef.current) {
      setReacting(true);
      if (reaction.type === 'happy') {
        gsap.to(groupRef.current.position, {
          y: position[1] + 1,
          duration: 0.3,
          ease: 'back.out(3)',
          yoyo: true,
          repeat: 3,
          onComplete: () => setReacting(false),
        });
        gsap.to(groupRef.current.scale, {
          x: 1.2, y: 0.85, z: 1.2,
          duration: 0.15,
          yoyo: true,
          repeat: 5,
          ease: 'power2.inOut',
        });
      } else {
        gsap.to(groupRef.current.rotation, {
          y: Math.PI * 2,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            if (groupRef.current) groupRef.current.rotation.y = 0;
            setReacting(false);
          },
        });
      }
    }
  }, [reaction]);

  return h('group', { ref: groupRef, position },
    // Body (pill shape)
    h('mesh', { castShadow: true },
      h('capsuleGeometry', { args: [0.25, 0.4, 8, 16] }),
      h('meshStandardMaterial', {
        color: '#FAFAFA',
        roughness: 0.3,
        emissive: '#FFF8E1',
        emissiveIntensity: 0.3,
      })
    ),
    // Head
    h('group', { ref: headRef, position: [0, 0.55, 0] },
      h('mesh', { castShadow: true },
        h('sphereGeometry', { args: [0.3, 16, 16] }),
        h('meshStandardMaterial', {
          color: '#FAFAFA',
          roughness: 0.3,
          emissive: '#FFF8E1',
          emissiveIntensity: 0.3,
        })
      ),
      // Eyes (simple dots)
      h('mesh', { position: [-0.08, 0.05, 0.27] },
        h('sphereGeometry', { args: [0.035, 8, 8] }),
        h('meshBasicMaterial', { color: '#4E342E' })
      ),
      h('mesh', { position: [0.08, 0.05, 0.27] },
        h('sphereGeometry', { args: [0.035, 8, 8] }),
        h('meshBasicMaterial', { color: '#4E342E' })
      ),
      // Mouth (tiny smile)
      h('mesh', { position: [0, -0.05, 0.28], rotation: [0, 0, 0] },
        h('torusGeometry', { args: [0.04, 0.008, 8, 12, Math.PI] }),
        h('meshBasicMaterial', { color: '#795548' })
      ),
      // Head rattle/antennae
      h('mesh', { position: [0, 0.32, 0] },
        h('sphereGeometry', { args: [0.06, 8, 8] }),
        h('meshStandardMaterial', {
          color: '#C5E1A5',
          emissive: '#C5E1A5',
          emissiveIntensity: 0.5,
        })
      ),
      h('mesh', { position: [0, 0.2, 0] },
        h('cylinderGeometry', { args: [0.015, 0.015, 0.2, 6] }),
        h('meshStandardMaterial', { color: '#A5D6A7' })
      ),
    ),
    // Arms (small stubs)
    h('mesh', { position: [-0.28