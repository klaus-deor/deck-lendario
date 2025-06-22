import { useState, useRef, useCallback } from 'react'
import './Card3D.css'

const Card3D = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef(null)
  const animationRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return

    // Cancelar animação anterior se existir
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    animationRef.current = requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // Calcular rotação com suavização
      const maxRotation = 35 // Reduzido de 45 para 35 graus
      const rotateY = (mouseX / (rect.width / 2)) * maxRotation
      const rotateX = -(mouseY / (rect.height / 2)) * maxRotation

      // Aplicar limites suaves
      const clampedRotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX))
      const clampedRotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY))

      setRotation({
        x: clampedRotateX,
        y: clampedRotateY
      })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    
    // Cancelar qualquer animação pendente
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Retornar suavemente à posição original
    setRotation({ x: 0, y: 0 })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  return (
    <div className="card-container">
      <div
        ref={cardRef}
        className={`card ${isHovering ? 'hovering' : ''}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <div className="card-inner">
          <div className="card-front">
            <img 
              src="/klaus-card.jpg" 
              alt="Klaus Deor Card" 
              draggable={false}
            />
          </div>
          <div className="card-back">
            <div className="card-back-content">
              <div className="legendary-logo">LENDÁRIA</div>
              <div className="card-number">001</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card3D