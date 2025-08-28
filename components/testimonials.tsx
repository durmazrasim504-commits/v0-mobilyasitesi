import Image from "next/image"
import { Star } from "lucide-react"

interface Testimonial {
  id: number
  name: string
  avatar: string
  rating: number
  comment: string
  date: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Müşteri Yorumları</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{testimonial.comment}</p>
              <p className="text-xs text-gray-400">{testimonial.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Testimonials
