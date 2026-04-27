## 1. Visual Theme & Atmosphere
This portfolio is a dark, expressive, design-heavy interface built around warmth, motion, and premium editorial pacing. It should feel crafted, atmospheric, and visually confident, not minimal or generic. The foundation is a near-black canvas with warm undertones, layered with cream, gold, bronze, smoked brass, muted green, and selected blue accents.
The site should keep its custom personality: glowing borders, animated cards, parallax images, interactive bento layouts, magnetic buttons, and polished hover details. The goal is not to reduce the design, but to make every visual decision feel intentional and part of one system.
Where Claude’s design feels like a calm literary salon, this design should feel like a premium creative studio at night: warm light, dark materials, editorial structure, and expressive interaction. Claude’s influence should appear in spacing, rhythm, typography hierarchy, warm neutrals, and component consistency, not in minimalism or a light parchment background.
**Key Characteristics:**
- Dark warm canvas instead of pure black
- Editorial spacing and section rhythm
- Flashy custom components with controlled rules
- Warm metallic accent system: cream, gold, bronze, smoked brass
- Muted green for organic/status contrast and muted blue for global/timezone moments
- Project-specific colors used sparingly
- Soft ring borders and subtle glows instead of random heavy lighting
- Consistent button, card, icon, and section header systems
- Strong design personality without visual chaos
---
## 2. Color Palette & Roles
### Core Backgrounds
**Deep Canvas** `#080808`  
The deepest page base. Used for the main shell, section endings, and dark immersive areas.
**Warm Near Black** `#141413`  
Primary dark surface inspired by Claude’s warm black. Used for premium dark sections, elevated containers, and areas where pure black would feel too harsh.
**Charcoal Base** `#1a1a1a`  
Current theme background. Used as the default site background through `--background`.
**Soft Black Midpoint** `#101010`  
Used in page-level gradients to soften transitions between dark sections.
**Card Charcoal** `#20201d`  
Recommended card surface. Warmer and more editorial than flat black.
**Existing Card Surface** `#2a2a2a`  
Used for current card/popover/sidebar surfaces. Can remain, but should be used intentionally.
**Secondary Surface** `#3a3a3a`  
Used for secondary muted panels and deeper UI contrast.
---
### Primary Warm Accents
**Warm Gold** `#dac5a7`  
Main brand accent. Used for primary highlights, key icons, borders, active states, CTA surfaces, and important UI details.
**Deep Bronze** `#8b7355`  
Secondary accent. Used for depth, gradients, inactive warm accents, profile visuals, and supporting details.
**Light Cream** `#f5efe4`  
Soft highlight. Used for bright text, glow highlights, thin borders, and refined accent details.
**Hero Cream** `#f7ead8`  
Used primarily in hero title gradients or high-emphasis display moments.
---
### Expanded Accent System
**Smoked Brass** `#a88c62`  
Primary expressive accent. Used for selected bento accents, depth, and brand personality without overpowering the cream/gold system.
**Champagne Bronze** `#c2a77b`  
Lighter warm accent. Used for hover states, subtle links, secondary expressive details, and friendly emphasis.
**Muted Olive Green** `#8fa58a`  
Organic contrast color. Used for availability, global/remote work, status moments, and calmer secondary highlights.
**Muted Steel Blue** `#7fa7c8`  
Cool contrast color. Used for timezone/global availability moments only.
**Warm Silver** `#b0aea5`  
Light muted text on dark surfaces. Use instead of cold gray where possible.
**Olive Gray** `#5e5d59`  
Warm secondary text for lighter or mixed surfaces.
**Stone Gray** `#87867f`  
Tertiary text, metadata, helper text.
---
### Project-Specific Accents
Project colors should add personality without taking over the full card.
**ANDCREATIVE White** `#f3f3f3`  
Used for category label, key feature headings/icons, and border glow.
**Kerma Gold** `#d4af37`  
Used for category label, key feature headings/icons, and border glow.
**Old Portfolio Pink** `#ff0066`  
Used for category label, key feature headings/icons, and border glow.
**Rule:**  
Do not apply project colors to every element. Keep buttons, year tags, and technology chips neutral unless intentionally redesigned.
---
### Neutral UI Transparencies
**Subtle White Border** `rgba(255, 255, 255, 0.10)`  
Default borders, dividers, separators.
**Strong White Border** `rgba(255, 255, 255, 0.15)`  
Inputs, active surfaces, stronger containment.
**Soft White Fill** `rgba(255, 255, 255, 0.04)`  
Very subtle card/button fill.
**Medium White Fill** `rgba(255, 255, 255, 0.06)`  
Neutral chips, secondary surfaces.
**Interactive White Fill** `rgba(255, 255, 255, 0.08)`  
Buttons and hoverable surfaces.
**Dark Overlay** `rgba(0, 0, 0, 0.30)`  
Glass overlays, button overlays, image protection.
**Deep Overlay** `rgba(0, 0, 0, 0.45)`  
Hero/project image gradients and strong legibility overlays.
---
### Semantic Colors
**Error Red** `#ef4444`  
Error states and destructive feedback.
**Available Green** `#4ade80`  
Availability/status dot.
**Focus Blue** `#3898ec`  
Accessibility-only focus state if needed. This should be the only cool utility color.
---
## 3. Typography Rules
### Font Direction
The portfolio can keep the current sans-led identity, but typography should become more editorial and consistent.
Use **Outfit + fallback sans for headings**, **Newsreader for accent words**, and **Source Sans 3 for body/small text**.
**Display / Hero:**  
Large expressive sans or current hero treatment. Gradients allowed.
**Section Headings:**  
Use strong but controlled heading sizes. Avoid random heading sizes per section.
**Body / UI:**  
Use Source Sans 3 for paragraph/small text readability while keeping core UI hierarchy clean and warm.
**Optional Editorial Accent:**  
If a serif is added later, use it only for large section headings or selected editorial moments. Do not mix serif everywhere.
Recommended accent serif: **Newsreader** for emphasis words.
---
### Hierarchy
| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Hero Display | 64px–154px responsive | 800–900 | 0.95–1.05 | Main hero name/title |
| Section Heading | 40px mobile / 52px desktop | 600–700 | 1.10–1.20 | Major section titles |
| Card Heading Large | 28px–36px | 600–700 | 1.15–1.25 | Bento/project feature titles |
| Card Heading | 20px–26px | 600 | 1.20–1.30 | Standard card titles |
| Body Large | 18px–20px | 400–500 | 1.60 | Intro paragraphs |
| Body | 16px | 400–500 | 1.55–1.65 | Standard text |
| Small Body | 14px–15px | 400–500 | 1.45–1.60 | Card descriptions |
| Label | 12px–14px | 500–600 | 1.25 | Section labels, metadata |
| Overline | 12px–14px | 500–600 | 1.40 | Uppercase section labels |
### Principles
- Headings should feel confident, not randomly oversized.
- Body text should use relaxed line-height around `1.6`.
- Section labels should be consistent: uppercase, tracked, warm accent or muted.
- Avoid mixing many text colors in one component.
- Use white/cream for major headings, warm silver for body, accent only for emphasis.
---
## 4. Layout & Spacing
### Spacing Scale
Use a consistent spacing rhythm inspired by Claude, but keep the portfolio expressive.
- `4px` micro spacing
- `8px` compact spacing
- `12px` small internal spacing
- `16px` standard UI spacing
- `24px` card/content gap
- `32px` card padding
- `48px` section header to content
- `72px` mobile section padding
- `96px` desktop section padding
- `120px` major editorial break when needed
### Section Spacing
**Desktop**
- Section vertical padding: `96px`
- Header bottom margin: `48px`
- Large section transitions: `96px–120px`
**Mobile**
- Section vertical padding: `56px–72px`
- Header bottom margin: `32px`
- Card gaps: `16px–20px`
### Container Widths
- Main content container: `max-w-7xl`
- Text headers: `max-w-3xl`
- Contact/form blocks: `max-w-6xl`
- Project cards: `max-w-7xl`
### Rule
Spacing should be generous and consistent. Visual complexity should come from component design and interaction, not cramped layouts.
---
## 5. Section Header System
Every major section should follow one structure:
```tsx
<div className="mx-auto mb-12 max-w-3xl text-center">
  <p className="mb-3 text-sm uppercase tracking-[0.28em] text-accent/70">
    Section Label
  </p>
  <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
    Section Heading
  </h2>
  <p className="mt-5 text-lg leading-8 text-muted-foreground">
    Optional section description.
  </p>
</div>
Rules
- No side lines around section labels unless it is a divider component.
- Labels should not feel smaller or visually unrelated between sections.
- Use consistent mb-3, mb-5, and text-lg description rhythm.
- Section labels should use warm accent or muted warm text.
---
6. Buttons
Primary Warm Button
Used for main CTAs.
- Background: #dac5a7 or #f5efe4
- Text: #141413
- Radius: 16px–20px
- Padding: 12px 24px
- Hover: transparent or darker warm surface depending context
- Border: matching accent
- Icon animation allowed
Neutral Dark Button
Used for secondary actions like project cards.
- Border: rgba(255,255,255,0.25)
- Background: rgba(255,255,255,0.08)
- Text: white
- Hover border: rgba(255,255,255,0.45)
- Hover background: rgba(255,255,255,0.14)
- No colored hover unless it is a primary CTA
Ghost Button
Used for low-priority links.
- Background: transparent
- Text: muted or accent
- Hover: subtle accent text or underline/ring
Icon Animation Rules
- Icon movement should be smooth and readable.
- Use one animation pattern per button type.
- Example: arrow exits right and re-enters left for project actions.
- Avoid overly fast transitions.
---
7. Cards & Containers
Base Card
- Surface: #20201d or rgba(255,255,255,0.04) over dark
- Border: 1px solid rgba(255,255,255,0.10)
- Radius: 20px–28px
- Padding: 24px–32px
- Shadow: subtle or none
- Depth: warm ring borders preferred over heavy shadows
Bento Cards
Bento cards should remain flashy and custom.
- Use dark warm surfaces with subtle gradients.
- Each card can have a controlled accent color:
  - Collaboration: Smoked Brass / Champagne Bronze
  - Product Systems: Warm Gold / Bronze
  - Contact: Warm Gold
  - Global Availability: Muted Steel Blue
  - Services: Bronze / Smoked Brass
- Avoid turning every element in the card accent-colored.
- Use accent for headings, icons, decorative patterns, or hover details.
Project Cards
- Keep project image dominant.
- Use project-specific accent only for:
  - Category label and dot
  - Key feature heading/icons
  - Border glow color
- Keep these neutral:
  - View Project button
  - Year tags
  - Technology chips
Contact Card
- Keep form card dark and premium.
- Inputs should use subtle dark fills, warm borders, and clear focus states.
- Submit button can use primary warm accent.
---
8. Border Glow & Effects
The site can keep glow effects, but they should behave consistently.
BorderGlow Rules
- Glow should read as edge/corner light, not a giant cursor-following light source.
- Card interior should be opaque enough to hide internal glow layers.
- Use glow sparingly on important containers.
- Avoid stacking many large glows in one section.
Glow Colors
- Default brand glow: #dac5a7
- Project glow: project-specific
- Avoid random colors outside the palette.
Hover Effects
Good hover effects:
- Slight scale
- Border brightening
- Icon movement
- Soft ring shadow
- Accent color reveal
Avoid:
- Large background flashes
- Uncontrolled glow blooms
- Multiple animations competing at once
---
9. Navigation
Desktop Nav
- Glass surface should feel warm, not gray/cold.
- Background: rgba(128,128,128,0.15) or warmer alternative.
- Border: rgba(255,255,255,0.10)
- Active indicator: soft white/warm line.
- Text: white active, white/70 inactive.
Mobile Nav
- Fullscreen menu can stay dramatic.
- Use warm dark panels and accent transition layers.
- Smooth-scroll anchor links should not jump.
- Touch targets should be large and comfortable.
Rules
- Nav should feel polished but not dominate the page.
- Avoid too much glow in nav.
- Active state should be clear and calm.
---
10. Social Icons
Social links should be consistent across About and Footer.
- Container: 44px x 44px
- Icon: 20px
- No heavy outer circle by default
- Hover: filled version of same icon path if possible
- Hover color: accent
- Contact form socials are allowed to remain distinct because they are part of the form UI
---
11. Forms
Inputs
- Background: rgba(0,0,0,0.35)
- Border: rgba(255,255,255,0.10)
- Text: white
- Placeholder: rgba(255,255,255,0.30)
- Focus border: rgba(218,197,167,0.45)
- Radius: 16px
- Padding: 12px 16px
Labels
- Text: rgba(255,255,255,0.75)
- Size: 14px
- Weight: 500
Submit Button
- Background: rgba(218,197,167,0.15)
- Border: rgba(218,197,167,0.35)
- Text: #dac5a7
- Hover: #dac5a7 background, dark text
---
12. Footer
Footer should be minimal and consistent with the Projects divider pattern.
- Background: same dark section background as About
- No glow
- Keep availability/local time pill
- Social links match About social links
- Nav links simple and warm-muted
- Center icon matches Projects sparkle icon container:
  - 44px x 44px
  - Rounded-xl
  - Accent border/fill
  - Icon scales slightly on hover
- Divider lines should be equal width and fade at outer edges
---
13. Color Usage By Section
Hero
- Strongest brand expression
- Gold/bronze/cream gradients allowed
- Light rays and large display type allowed
- Keep text readable and structured
About
- Warm dark editorial section
- Gold/bronze accents
- Keep profile interaction
- Clean social icons
Bento
- Flashy/custom section
- Multi-accent system:
  - Terracotta
  - Coral
  - Gold
  - Bronze
  - Muted green
- Keep cards visually related through shared surface/radius/border rules
Projects
- Project-specific accents only
- Neutral buttons and technology chips
- Strong image presentation
- Parallax image effect allowed
Tech Stack
- Neutral default layout
- Optional brand/accent hover moments
- Compact mobile tiles
- Clean desktop grid
Contact
- Warm dark form card
- Gold/terracotta CTA
- Clear field states
Footer
- Minimal, dark, no glow
- Social/nav only
- Consistent icon divider
---
14. Do’s and Don’ts
Do
- Keep the site dark, warm, and expressive.
- Use consistent spacing across all sections.
- Use accent colors intentionally, not everywhere.
- Keep custom components, but give them shared visual rules.
- Use warm-toned grays and borders.
- Use ring-like depth and subtle border changes.
- Let each major section breathe.
- Use project-specific colors sparingly.
- Keep mobile layouts compact but polished.
Don’t
- Don’t make the site minimal or parchment-light like Claude.
- Don’t use brown on every hover state.
- Don’t add glow behind every section.
- Don’t make every element in a project card project-colored.
- Don’t use cool blue-grays as default UI colors.
- Don’t use heavy drop shadows everywhere.
- Don’t create one-off button styles for every component.
- Don’t let animations feel random or too fast.
- Don’t reduce spacing to fit more content if it harms rhythm.
---
15. Implementation Priorities
Phase 1: System Foundation
- Add shared design classes/tokens for:
  - Section headers
  - Buttons
  - Cards
  - Icon buttons
  - Dividers
- Normalize section spacing.
Phase 2: Section Consistency
- Update About, Bento, Projects, Tech Stack, Contact, Footer headers and spacing.
- Make all section labels follow the same pattern.
Phase 3: Component Polish
- Refine buttons.
- Refine social icons.
- Refine footer divider/icon.
- Refine contact form states.
- Refine navbar active/hover states.
Phase 4: Color Expansion
- Add Warm Editorial Flash accents:
  - Terracotta
  - Coral
  - Muted Green
- Apply them mostly to Bento and selective CTA moments.
Phase 5: Final Pass
- Check desktop/mobile spacing.
- Reduce unnecessary glow.
- Ensure hover effects feel intentional.
- Keep custom interactions but make them consistent.
