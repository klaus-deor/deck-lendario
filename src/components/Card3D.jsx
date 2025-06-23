import { useState, useRef, useCallback, useEffect } from 'react'
import './Card3D.css'

const Card3D = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isMouseInScreen, setIsMouseInScreen] = useState(false)
  const cardRef = useRef(null)
  const animationRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return

    // Mouse está na tela, ativar brilho
    if (!isMouseInScreen) {
      setIsMouseInScreen(true)
    }

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

      // Calcular distância para influência na rotação
      const distanceFromCard = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
      const cardRadius = Math.max(rect.width, rect.height) / 2
      
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
  }, [isMouseInScreen])

  const handleMouseLeave = useCallback(() => {
    // Mouse saiu da tela, desativar brilho
    setIsMouseInScreen(false)
    
    // Cancelar qualquer animação pendente
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Retornar suavemente à posição original
    setRotation({ x: 0, y: 0 })
  }, [])

  const handleMouseEnter = useCallback(() => {
    // Mouse entrou na tela, ativar brilho
    setIsMouseInScreen(true)
  }, [])

  // Adicionar event listener global para movimento do mouse
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e)
    }

    // Adicionar listener na window inteira
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
      
      // Limpar animação pendente
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter])

  return (
    <div className="card-container">
      <div
        ref={cardRef}
        className={`card ${isMouseInScreen ? 'hovering' : ''}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
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