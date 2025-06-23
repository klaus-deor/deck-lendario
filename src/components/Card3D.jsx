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
    setIsMouseInScreen(true)

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
  }, [])

  const handleMouseLeave = useCallback(() => {
    // Mouse saiu da tela, desativar brilho IMEDIATAMENTE
    setIsMouseInScreen(false)
    
    // Cancelar qualquer animação pendente
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Retornar suavemente à posição original
    setRotation({ x: 0, y: 0 })
  }, [])

  // Adicionar event listener global para movimento do mouse
  useEffect(() => {
    // Listener para detectar quando mouse entra na tela
    const handleDocumentMouseEnter = () => {
      setIsMouseInScreen(true)
    }

    // Listener para detectar quando mouse sai da tela
    const handleDocumentMouseLeave = () => {
      setIsMouseInScreen(false)
      setRotation({ x: 0, y: 0 })
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    // Adicionar listeners no document para capturar entrada/saída corretamente
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleDocumentMouseLeave)
    document.addEventListener('mouseenter', handleDocumentMouseEnter)
    
    // Listener adicional na window para garantir que capture saída da tela
    window.addEventListener('mouseout', (e) => {
      // Verificar se o mouse realmente saiu da janela
      if (!e.relatedTarget || e.relatedTarget === null) {
        setIsMouseInScreen(false)
        setRotation({ x: 0, y: 0 })
        
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleDocumentMouseLeave)
      document.removeEventListener('mouseenter', handleDocumentMouseEnter)
      
      // Limpar animação pendente
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [handleMouseMove])

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