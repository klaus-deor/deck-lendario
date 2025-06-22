import { useState, useRef, useEffect } from 'react'
import './Card3D.css'

const Card3D = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Calcular rotação baseada na posição do mouse
    // Limitando a rotação a 90 graus para cada lado
    const rotateY = (mouseX / (rect.width / 2)) * 45 // 45 graus máximo para cada lado
    const rotateX = -(mouseY / (rect.height / 2)) * 45 // 45 graus máximo para cima/baixo

    setRotation({
      x: Math.max(-45, Math.min(45, rotateX)),
      y: Math.max(-45, Math.min(45, rotateY))
    })
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setRotation({ x: 0, y: 0 })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

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