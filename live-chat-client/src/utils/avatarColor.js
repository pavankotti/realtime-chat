const gradients = [
  'from-indigo-500 to-purple-500',
  'from-violet-500 to-fuchsia-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
];

export function getAvatarGradient(name = '') {
  if (!name) return gradients[0];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}
