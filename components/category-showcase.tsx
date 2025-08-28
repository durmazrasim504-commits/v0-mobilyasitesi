import Link from "next/link"
import Image from "next/image"

interface Category {
  id: number
  name: string
  imageUrl: string
  slug: string
}

interface CategoryShowcaseProps {
  title: string
  categories: Category[]
}

const CategoryShowcase = ({ title, categories }: CategoryShowcaseProps) => {
  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/${category.slug}`} className="group">
              <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="relative h-40 w-full">
                  <Image
                    src={category.imageUrl || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-lg font-bold text-center px-2">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryShowcase
