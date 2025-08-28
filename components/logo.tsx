type LogoProps = {
  size?: "small" | "medium" | "large"
  className?: string
}

export default function Logo({ size = "medium", className = "" }: LogoProps) {
  // Logo boyutlarını artırıyorum, özellikle footer için
  const sizes = {
    small: { width: 110, height: 44 }, // Önceki: 90x36
    medium: { width: 150, height: 60 }, // Önceki: 130x52
    large: { width: 200, height: 80 }, // Önceki: 170x68
  }

  const { width, height } = sizes[size]

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <img
        src="/divona-garden-logo-new.png"
        alt="Divona Garden Logo"
        width={width}
        height={height}
        className="object-contain w-full h-full"
      />
    </div>
  )
}
