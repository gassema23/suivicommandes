"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function FingerprintLoader() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulation du chargement - retire après 5 secondes pour la démo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Chargement terminé !</h2>
          <button
            onClick={() => setIsLoading(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Relancer l'animation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <FingerprintLoaderComponent />
        <motion.p
          className="mt-6 text-lg text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Chargement en cours...
        </motion.p>
      </div>
    </div>
  )
}

function FingerprintLoaderComponent() {
  return (
    <div className="relative">
      {/* Cercle de fond */}
      <motion.div
        className="w-32 h-32 rounded-full bg-white shadow-lg border-4 border-gray-200 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* SVG de l'empreinte digitale */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Lignes de l'empreinte - du centre vers l'extérieur */}
          {fingerprintPaths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              stroke="#3B82F6"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{
                pathLength: 0,
                opacity: 0.2,
                strokeWidth: 1,
              }}
              animate={{
                pathLength: 1,
                opacity: 1,
                strokeWidth: 1.5,
              }}
              transition={{
                pathLength: {
                  duration: 2,
                  delay: index * 0.1,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.5,
                  delay: index * 0.1 + 0.5,
                  ease: "easeOut",
                },
                strokeWidth: {
                  duration: 0.3,
                  delay: index * 0.1 + 1,
                  ease: "easeOut",
                },
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Effet de pulsation autour du cercle */}
      <motion.div
        className="absolute inset-0 w-32 h-32 rounded-full border-2 border-blue-300"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Deuxième cercle de pulsation */}
      <motion.div
        className="absolute inset-0 w-32 h-32 rounded-full border border-blue-200"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </div>
  )
}

// Chemins SVG pour créer les lignes de l'empreinte digitale
const fingerprintPaths = [
  // Centre - lignes courbes concentriques
  "M40 25 Q45 30 40 35 Q35 30 40 25",
  "M40 20 Q50 30 40 40 Q30 30 40 20",
  "M40 15 Q55 30 40 45 Q25 30 40 15",
  "M40 10 Q60 30 40 50 Q20 30 40 10",

  // Lignes latérales gauches
  "M25 20 Q30 25 25 35 Q20 30 25 20",
  "M20 25 Q25 35 20 45 Q15 35 20 25",
  "M15 30 Q20 40 15 50 Q10 40 15 30",

  // Lignes latérales droites
  "M55 20 Q60 25 55 35 Q50 30 55 20",
  "M60 25 Q65 35 60 45 Q55 35 60 25",
  "M65 30 Q70 40 65 50 Q60 40 65 30",

  // Lignes du bas
  "M30 55 Q40 60 50 55 Q45 50 40 52 Q35 50 30 55",
  "M25 60 Q40 65 55 60 Q50 55 40 57 Q30 55 25 60",

  // Lignes de détail supplémentaires
  "M35 12 Q40 18 45 12",
  "M32 45 Q40 50 48 45",
  "M28 35 Q32 40 28 45",
  "M52 35 Q48 40 52 45",
]
