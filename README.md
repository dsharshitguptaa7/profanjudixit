# Prof. Anju Dixit — Academic Physics & Materials Science Portfolio

An award-winning, production-grade academic portfolio website designed for **Prof. Anju Dixit**, Professor of Physics and Materials Science at Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur, India.

Designed with a **Quantum Noir × Scientific Elegance × Premium Academic Editorial** visual identity inspired by condensed matter physics, perovskite crystal lattices ($\text{BaTiO}_3$), and quantum phenomena.

---

## 🔬 Core Features & Scientific Visualizations

1. **Signature 3D Hero Experience (`Three.js`)**:
   - Real-time animated perovskite crystal lattice with glowing atomic nodes and quantum coordinate field lines.
   - Smooth mouse/touch parallax and orbital rotation.
   - Performance-optimized with capped DPR, reduced particles on mobile, and Page Visibility API pause states.
   - Respects `prefers-reduced-motion` with graceful WebGL fallbacks.

2. **Interactive Condensed Matter Experience — "The Beauty of Condensed Matter"**:
   - Real-time 3D interactive unit cell inspector of Barium Titanate ($\text{BaTiO}_3$).
   - Switchable **Paraelectric (Centrosymmetric Cubic, $T > 120^\circ\text{C}$)** and **Ferroelectric (Polarized Tetragonal, $T < 120^\circ\text{C}$)** modes.
   - Demonstrates $\text{Ti}^{4+}$ off-center displacement, octahedral cage distortion, and spontaneous electric dipole moment $\vec{P}$.
   - Orbit rotation, smooth zoom, atom raycasting hover/click inspection, reset view, and auto-rotation toggle.

3. **Academic Biography & Milestones**:
   - Verified academic career spanning Ph.D. from University of Puerto Rico, USA (2004), NSF Fellowship, Postdoctoral research at UPR & IIT Kanpur, DST Young Scientist Fellowship, and promotion to Professor under CAS in 2026.
   - Professional academic seal and monogram.

4. **8 Interactive Research Areas**:
   - Condensed Matter Physics
   - Ferroelectric & Dielectric Materials
   - $\text{BaTiO}_3$-Based Ceramics
   - Functional Oxides & Nanomaterials
   - Energy Storage & Supercapacitor Materials
   - Thermoelectric Materials
   - Fuel-Cell Electrode Materials
   - Materials Synthesis & Characterization

5. **Selected Publications Library**:
   - Real-time search filter by title, journal, keyword, or tag.
   - Year filter buttons (2026, 2025, 2023, All).
   - Expandable details, journal citations, and books/chapters section.
   - Maintained in modular data files (`src/data/publications.js`).

6. **Sponsored Research Projects & National Patents**:
   - 2 Active ongoing projects (CuO-ZnO nanocomposites, dielectric characterization platform).
   - 3 Completed projects (DST Young Women Scientist, UGC Major, CV Raman).
   - 8 Verified National Patents with one-click copy and feedback toast notifications.

7. **Academic Impact & Doctoral Mentorship**:
   - Animated counter metrics for 61+ Scopus/Web of Science papers, 8 patents, 9 books/chapters, ₹28 Lakhs grants, 19+ years service.
   - Distinct classification of Ph.D. scholars: 2 Degree Awarded, 1 Thesis Submitted, and 3 Active Ongoing.

8. **Teaching & University Leadership**:
   - Editorial timeline showcasing Deputy Director (School of Basic Sciences), Exam Centre Superintendent, Pre-Ph.D. Coordinator, and AR/VR Lab establishment.
   - Undergraduate, Postgraduate, and Pre-Ph.D. courses taught.

9. **Verified Contact & Academic Identifiers**:
   - Official CSJMU email: `anjudixit@csjmu.ac.in`
   - ORCID: `0000-0003-0945-4538`
   - Google Scholar: `KQ_4jrQAAAAJ`
   - Web of Science ResearcherID: `K-9748-2019`
   - Vidwan ID: `215694`

---

## 🛠️ Technology Stack

- **HTML5**: Semantic document structure with comprehensive Open Graph and SEO metadata.
- **CSS3**: Custom design tokens, glassmorphism, responsive grid & flexbox layouts, reduced-motion media queries.
- **Vanilla JavaScript (ES Modules)**: Application logic, state management, search/filtering, and interactive DOM controllers.
- **Three.js**: Real-time 3D WebGL rendering, orbit controls, custom geometry shaders, and raycaster picking.
- **Vite**: Ultra-fast build tool and development server.
- **Google Fonts**: *Cinzel* (Editorial Serif), *Plus Jakarta Sans* (Modern Sans-Serif), *JetBrains Mono* (Scientific Data).

---

## 🚀 Running the Project Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

### 4. Preview the Production Build
```bash
npm run preview
```
