# Codex Task — Replace CSS Logo Approximation with Official Conduct Alchemy Assets

Repository: `RapidStillz/conductalchemy-site`

Scope: `/licensing` visual update and shared Conduct Alchemy brand components.

## Required asset path

Ensure this folder exists in the repo:

```txt
public/brand/conduct-alchemy/
```

Use assets from the accompanying patch package.

## Required change

Replace any CSS-recreated Conduct Alchemy motif/logo with official SVG assets.

Preferred mapping:

```ts
const CA_LOGO_DARK = '/brand/conduct-alchemy/logo/svg/ca-logo-horizontal-white.svg';
const CA_LOGO_LIGHT = '/brand/conduct-alchemy/logo/svg/ca-logo-horizontal-black.svg';
const CA_MOTIF_DARK = '/brand/conduct-alchemy/marks/svg/ca-motif-vector-white.svg';
const CA_MOTIF_LIGHT = '/brand/conduct-alchemy/marks/svg/ca-motif-vector.svg';
```

## Logo rules

- Horizontal lockup = motif + Conduct Alchemy only. No divider. No strapline.
- Primary full lockup = motif + Conduct Alchemy + divider + FORGED IN RESONANCE.
- Motif only = symbol only.

## Suggested implementation

Create a small reusable component if one does not already exist:

```tsx
type ConductAlchemyLogoProps = {
  variant?: 'horizontal' | 'primary' | 'motif';
  tone?: 'dark' | 'light';
  className?: string;
};

export function ConductAlchemyLogo({
  variant = 'horizontal',
  tone = 'dark',
  className = '',
}: ConductAlchemyLogoProps) {
  const file = {
    horizontal: tone === 'dark'
      ? '/brand/conduct-alchemy/logo/svg/ca-logo-horizontal-white.svg'
      : '/brand/conduct-alchemy/logo/svg/ca-logo-horizontal-black.svg',
    primary: tone === 'dark'
      ? '/brand/conduct-alchemy/logo/svg/ca-logo-primary-white.svg'
      : '/brand/conduct-alchemy/logo/svg/ca-logo-primary-black.svg',
    motif: tone === 'dark'
      ? '/brand/conduct-alchemy/marks/svg/ca-motif-vector-white.svg'
      : '/brand/conduct-alchemy/marks/svg/ca-motif-vector.svg',
  }[variant];

  return <img src={file} alt="Conduct Alchemy" className={className} />;
}
```

## Acceptance criteria

- No CSS-drawn approximation of the Conduct Alchemy mark remains on `/licensing`.
- The header/nav uses the horizontal lockup, not the full lockup.
- No divider or strapline appears in the horizontal logo.
- Build passes.
- Visual check confirms logo proportions are not distorted.
