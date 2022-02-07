const _COLORS = [
    '#f7403e', '#1f78b4', '#78de1d',
    '#33a02c', '#a6cee3', '#e31a1c',
    '#fdbf6f', '#ff7f00', '#cab2d6',
    '#6a3d9a', '#ffff99', '#b15928'
];

const L = _COLORS.length;
  
const colors = (i) => {
    return _COLORS[i % L]
}

export default colors;