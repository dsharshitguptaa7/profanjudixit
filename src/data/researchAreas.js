/**
 * Research Areas of Prof. Anju Dixit
 * Documented from verified faculty CV.
 */

export const researchAreas = [
  {
    id: "condensed-matter",
    title: "Condensed Matter Physics",
    badge: "Core Discipline",
    tag: "Fundamental Physics",
    description: "Investigating fundamental quantum phenomena, crystal lattice symmetries, electron correlations, and phase transitions in crystalline and nanostructured solid-state systems.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="6" stroke="#56D9FF" stroke-width="2" fill="rgba(86, 217, 255, 0.15)"/>
      <ellipse cx="24" cy="24" rx="20" ry="7" stroke="#A78BFA" stroke-width="1.5" stroke-dasharray="3 3"/>
      <ellipse cx="24" cy="24" rx="20" ry="7" transform="rotate(60 24 24)" stroke="#56D9FF" stroke-width="1.5"/>
      <ellipse cx="24" cy="24" rx="20" ry="7" transform="rotate(120 24 24)" stroke="#A78BFA" stroke-width="1.5"/>
      <circle cx="38" cy="24" r="2.5" fill="#56D9FF"/>
      <circle cx="17" cy="12" r="2.5" fill="#A78BFA"/>
      <circle cx="17" cy="36" r="2.5" fill="#56D9FF"/>
    </svg>`,
    targetCategory: "All"
  },
  {
    id: "ferroelectrics-dielectrics",
    title: "Ferroelectric & Dielectric Materials",
    badge: "Smart Materials",
    tag: "Polarization Dynamics",
    description: "Engineering spontaneous electric polarization, relaxor phenomena, and high dielectric permittivity systems for non-volatile memories, sensors, and solid-state actuators.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="32" height="28" rx="4" stroke="#56D9FF" stroke-width="2" fill="rgba(86, 217, 255, 0.05)"/>
      <path d="M16 20 L24 14 L32 20 L32 30 L24 36 L16 30 Z" stroke="#A78BFA" stroke-width="1.5"/>
      <path d="M24 14 V36" stroke="#56D9FF" stroke-width="1.5" stroke-dasharray="2 2"/>
      <path d="M24 18 L24 32" stroke="#56D9FF" stroke-width="2"/>
      <polygon points="24,14 21,20 27,20" fill="#56D9FF"/>
      <circle cx="24" cy="25" r="3" fill="#A78BFA"/>
    </svg>`,
    targetCategory: "BaTiO₃ & Ferroelectrics"
  },
  {
    id: "batio3-ceramics",
    title: "BaTiO₃-Based Ceramics",
    badge: "Perovskite Systems",
    tag: "A/B-Site Engineering",
    description: "Tailoring phase transitions, Curie temperature, and low-loss electroceramic performance in barium titanate via Bismuth (Bi), Strontium (Sr), and transition-metal doping.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14 L24 6 L36 14 L36 34 L24 42 L12 34 Z" stroke="#56D9FF" stroke-width="1.8"/>
      <path d="M24 6 V24 M24 24 L12 34 M24 24 L36 34 M24 24 V42" stroke="rgba(148, 163, 184, 0.6)" stroke-width="1.2"/>
      <circle cx="24" cy="24" r="4.5" fill="#A78BFA" stroke="#56D9FF" stroke-width="1"/>
      <circle cx="12" cy="14" r="2.5" fill="#56D9FF"/>
      <circle cx="36" cy="14" r="2.5" fill="#56D9FF"/>
      <circle cx="24" cy="42" r="2.5" fill="#56D9FF"/>
    </svg>`,
    targetCategory: "BaTiO₃ & Ferroelectrics"
  },
  {
    id: "functional-oxides",
    title: "Functional Oxides & Nanomaterials",
    badge: "Nanotechnology",
    tag: "Sol-Gel & Hydrothermal",
    description: "Synthesizing pure and doped oxide nanostructures (NiO, CeO₂, ZnO, CuO) to elucidate surface plasmons, defect equilibria, and size-dependent optoelectronic properties.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="18" r="8" stroke="#56D9FF" stroke-width="1.8" fill="rgba(86, 217, 255, 0.1)"/>
      <circle cx="32" cy="20" r="10" stroke="#A78BFA" stroke-width="1.8" fill="rgba(167, 139, 250, 0.1)"/>
      <circle cx="22" cy="33" r="7" stroke="#56D9FF" stroke-width="1.8" fill="rgba(86, 217, 255, 0.15)"/>
      <circle cx="16" cy="18" r="2" fill="#56D9FF"/>
      <circle cx="32" cy="20" r="3" fill="#A78BFA"/>
      <circle cx="22" cy="33" r="2" fill="#F4F6FA"/>
    </svg>`,
    targetCategory: "Functional Oxides & Energy Storage"
  },
  {
    id: "energy-storage",
    title: "Energy Storage & Supercapacitors",
    badge: "Sustainable Energy",
    tag: "High Energy Density",
    description: "Developing advanced pseudocapacitive electrodes and dielectric thin film heterostructures with remarkable cyclic stability, power density, and charge transfer kinetics.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="14" width="28" height="24" rx="3" stroke="#56D9FF" stroke-width="2"/>
      <path d="M16 8 V14 M32 8 V14" stroke="#56D9FF" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M26 18 L19 26 H27 L22 34" stroke="#A78BFA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    targetCategory: "Supercapacitors & Carbides"
  },
  {
    id: "thermoelectrics",
    title: "Thermoelectric Materials",
    badge: "Waste Heat Recovery",
    tag: "Seebeck & Bi₂Te₃",
    description: "Researching nanostructured bismuth tellurides ((Bi₂Te₃)₁₋ₓSnₓ) and heavy chalcogenides to decouple thermal and electrical conductivity for high figure-of-merit (ZT) conversion.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 36 L12 16 C12 13 16 13 16 16 L16 36" stroke="#56D9FF" stroke-width="2"/>
      <path d="M22 36 L22 12 C22 9 26 9 26 12 L26 36" stroke="#A78BFA" stroke-width="2"/>
      <path d="M32 36 L32 18 C32 15 36 15 36 18 L36 36" stroke="#56D9FF" stroke-width="2"/>
      <line x1="8" y1="36" x2="40" y2="36" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="12" x2="40" y2="12" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="2 2"/>
    </svg>`,
    targetCategory: "Thermoelectric Materials"
  },
  {
    id: "fuel-cells",
    title: "Fuel-Cell Electrode Materials",
    badge: "Clean Hydrogen",
    tag: "Transition Carbides",
    description: "Designing durable, cost-effective non-platinum electrocatalysts and transition-metal carbide electrodes exhibiting high oxygen reduction reaction (ORR) activity.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke="#56D9FF" stroke-width="2" stroke-dasharray="4 2"/>
      <path d="M20 18 H28 V24 H20 Z M20 24 H28 V30 H20 Z" stroke="#A78BFA" stroke-width="1.5"/>
      <path d="M14 24 H20 M28 24 H34" stroke="#56D9FF" stroke-width="2"/>
      <circle cx="24" cy="24" r="2.5" fill="#56D9FF"/>
    </svg>`,
    targetCategory: "Fuel-Cell Electrode Materials"
  },
  {
    id: "materials-characterization",
    title: "Materials Synthesis & Characterization",
    badge: "Analytical Precision",
    tag: "Micro-Raman & XRD",
    description: "Integrating wet-chemical sol-gel and hydrothermal synthesis with comprehensive XRD, SEM, AFM, Micro-Raman, and broad-frequency dielectric impedance spectroscopy.",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 38 L16 28 L22 34 L30 18 L38 28 L42 22" stroke="#56D9FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="8" y1="38" x2="42" y2="38" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="8" y1="12" x2="8" y2="38" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="30" cy="18" r="3.5" fill="#A78BFA"/>
      <line x1="30" y1="18" x2="30" y2="38" stroke="#A78BFA" stroke-width="1" stroke-dasharray="2 2"/>
    </svg>`,
    targetCategory: "All"
  }
];
