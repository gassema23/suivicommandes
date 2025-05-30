
export function getAvatarColor(initials: string) {
  // Palette de couleurs pastel avec leurs couleurs de texte correspondantes
  const colors = [
    { bg: "#E3F2FD", text: "#0D47A1", name: "bleu-pastel" }, // Bleu pâle / Bleu foncé
    { bg: "#E8F5E8", text: "#2E7D32", name: "vert-pastel" }, // Vert pâle / Vert foncé
    { bg: "#FFF8E1", text: "#E65100", name: "jaune-pastel" }, // Jaune pâle / Orange foncé
    { bg: "#FCE4EC", text: "#C2185B", name: "rose-pastel" }, // Rose pâle / Rose foncé
    { bg: "#F3E5F5", text: "#7B1FA2", name: "violet-pastel" }, // Violet pâle / Violet foncé
    { bg: "#E1F5FE", text: "#01579B", name: "cyan-pastel" }, // Cyan pâle / Cyan foncé
    { bg: "#FFF3E0", text: "#E65100", name: "orange-pastel" }, // Orange pâle / Orange foncé
    { bg: "#F1F8E9", text: "#33691E", name: "lime-pastel" }, // Lime pâle / Lime foncé
  ]

  // Générer un hash simple basé sur les initiales
  const hash = initials.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Sélectionner une couleur basée sur le hash
  const selectedColor = colors[hash % colors.length]

  return {
    backgroundColor: selectedColor.bg,
    color: selectedColor.text,
    cssVariable: selectedColor.name,
  }
}

// Fonction alternative utilisant des couleurs pastel basées sur vos variables CSS
export function getAvatarColorWithCSS(initials: string) {
  const pastelColors = [
    { bg: "#DAE6F0", text: "#095797" }, // Basé sur votre secondary et primary
    { bg: "#E8F4E8", text: "#4F813D" }, // Vert pastel basé sur success
    { bg: "#FDF6D3", text: "#B8860B" }, // Jaune pastel basé sur warning
    { bg: "#F5E6E6", text: "#CB381F" }, // Rose pastel basé sur destructive
    { bg: "#E8E3F0", text: "#6B4FA1" }, // Violet pastel basé sur chart-5
    { bg: "#E3F2FD", text: "#1472BF" }, // Bleu pastel basé sur chart-1
    { bg: "#F0F8FF", text: "#4A98D9" }, // Bleu clair pastel basé sur accent
    { bg: "#F1F1F2", text: "#6B778A" }, // Gris pastel basé sur muted
  ]

  const hash = initials.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const selectedColor = pastelColors[hash % pastelColors.length]

  return {
    backgroundColor: selectedColor.bg,
    color: selectedColor.text,
    cssVariable: "pastel-custom",
  }
}