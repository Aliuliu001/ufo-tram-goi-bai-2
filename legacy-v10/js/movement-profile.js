export function panicSpeed(intensity) {
  // Giảm base speed để nhìn rõ hơn, thêm intensity cao hơn khi nguy hiểm
  return 1.6 + Math.max(0, Math.min(1, intensity)) * 2.4;
}

export function escapeMove(index) {
  return ['dodge', 'tumble', 'hide'][index % 3];
}

export function getEscapeAction(character, hideouts, currentPos) {
  // Random chọn hành động tránh
  const actions = ['roll', 'dive', 'jump'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  // Nếu dive và có hideout gần, target đến hideout
  if (action === 'dive' && hideouts.length > 0) {
    const nearest = hideouts.reduce((best, h) => {
      const dist = currentPos.distanceTo(h);
      return !best || dist < best.dist ? { pos: h, dist } : best;
    }, null);
    
    if (nearest && nearest.dist < 8) {
      return { action: 'dive', target: nearest.pos };
    }
  }
  
  return { action, target: null };
}
