export const COLORS = {
  bgPrimary: 'rgb(3, 12, 27)',
  bgHeader: 'linear-gradient(180deg, rgb(18, 11, 41) 0%, rgb(13, 18, 41) 40%, rgb(4, 16, 32) 70%, rgb(3, 12, 27) 100%)',
  bgPanel: 'linear-gradient(135deg, rgb(18, 11, 41), rgb(13, 18, 41))',
  accent: 'rgb(157, 78, 221)',
  accentAlpha: 'rgba(157, 78, 221, 0.3)',
  accentBorder: 'rgba(157, 78, 221, 0.5)',
  textPrimary: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
};

export const BUTTON_STYLES = {
  primary: {
    background: COLORS.accent,
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  secondary: {
    background: 'transparent',
    color: COLORS.accent,
    border: `1px solid ${COLORS.accent}`,
    borderRadius: '0.375rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  gradient: {
    position: 'relative' as const,
    padding: '1rem 2rem',
    background: 'transparent',
    color: '#ffffff',
    border: '2px solid transparent',
    borderRadius: '1rem',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    transition: 'all 0.3s',
    cursor: 'pointer',
    backgroundImage: 'linear-gradient(#030c1b, #030c1b), linear-gradient(135deg, #9d4edd 0%, #c084fc 100%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export const PANEL_STYLES = {
  main: {
    background: COLORS.bgPanel,
    border: `1px solid ${COLORS.accentBorder}`,
    borderRadius: '0.75rem',
    padding: '1rem',
  },
  card: {
    background: COLORS.bgPrimary,
    border: `1px solid ${COLORS.accentBorder}`,
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  glassmorphic: {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(12px)',
    border: `1px solid rgba(157, 78, 221, 0.15)`,
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  }
};

export const CURV_ANIMATIONS = {
  hoverLift: {
    transition: 'all 300ms ease-in-out',
    cursor: 'pointer',
  },
  hoverLiftActive: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(157, 78, 221, 0.3)',
  },
  scaleOnHover: {
    transition: 'transform 300ms ease-in-out',
    cursor: 'pointer',
  },
  scaleOnHoverActive: {
    transform: 'scale(1.02)',
  },
  fadeIn: {
    animation: 'fadeIn 500ms ease-in-out',
  }
};

export const CURV_EFFECTS = {
  purpleGlow: {
    boxShadow: '0 0 20px rgba(157, 78, 221, 0.4), 0 0 40px rgba(157, 78, 221, 0.2)',
  },
  gradientBorder: {
    background: 'linear-gradient(#030c1b, #030c1b) padding-box, linear-gradient(135deg, #9d4edd 0%, #c084fc 100%) border-box',
    border: '2px solid transparent',
  }
};