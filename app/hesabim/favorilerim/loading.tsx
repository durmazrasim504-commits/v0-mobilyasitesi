import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-[200px] w-full" />
              <div className="p-4">
                <Skeleton className="h-5 w-[80%] mb-2" />
                <Skeleton className="h-6 w-[60%] mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-[100px]" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
