import { useRef, useEffect } from 'react'

function WheelCanvas({ tasks, colors = [] }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = canvas.width
    const radius = size / 2
    ctx.clearRect(0, 0, size, size)

    if (tasks.length === 0) return

    tasks.forEach((task, index) => {
      const startAngle = (index / tasks.length) * 2 * Math.PI
      const endAngle = ((index + 1) / tasks.length) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(radius, radius)
      ctx.arc(radius, radius, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = colors[index % colors.length] || '#888'
      ctx.fill()

      ctx.save()
      ctx.translate(radius, radius)
      ctx.rotate((startAngle + endAngle) / 2)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'right'
      const text = task.text.length > 15 ? task.text.substring(0, 15) + '\u2026' : task.text
      ctx.fillText(text, radius - 10, 4)
      ctx.restore()
    })
  }, [tasks, colors])

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className="w-80 h-80 rounded-full border-4 border-gray-600"
    />
  )
}

export default WheelCanvas
