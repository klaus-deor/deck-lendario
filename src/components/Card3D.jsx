import { useState, useRef, useCallback, useEffect } from 'react'
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

      // Calcular distância do mouse até o centro da carta
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // Calcular se o mouse está próximo da carta para ativar hover
      const distanceFromCard = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
      const cardRadius = Math.max(rect.width, rect.height) / 2
      const hoverRadius = cardRadius + 100 // 100px de margem extra

      // Ativar hover quando próximo da carta
      if (distanceFromCard <= hoverRadius && !isHovering) {
        setIsHovering(true)
      } else if (distanceFromCard > hoverRadius && isHovering) {
        setIsHovering(false)
      }

      // Calcular rotação baseada na distância da carta
      const maxRotation = 35
      const influence = Math.max(0, 1 - (distanceFromCard / (cardRadius * 2)))
      
      const rotateY = (mouseX / (rect.width / 2)) * maxRotation * influence
      const rotateX = -(mouseY / (rect.height / 2)) * maxRotation * influence

      // Aplicar limites suaves
      const clampedRotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX))
      const clampedRotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY))

      setRotation({
        x: clampedRotateX,
        y: clampedRotateY
      })
    })
  }, [isHovering])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    
    // Cancelar qualquer animação pendente
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Retornar suavemente à posição original
    setRotation({ x: 0, y: 0 })
  }, [])

  // Adicionar event listener global para movimento do mouse
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e)
    }

    // Adicionar listener na window inteira
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      
      // Limpar animação pendente
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <div className="card-container">
      <div
        ref={cardRef}
        className={`card ${isHovering ? 'hovering' : ''}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        <div className="card-inner">
          <div className="card-front">
            <img 
              src="/klaus-card.png" 
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