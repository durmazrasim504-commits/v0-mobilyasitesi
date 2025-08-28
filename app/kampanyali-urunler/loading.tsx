import { Skeleton } from "@/components/ui/skeleton"

export default function DiscountedProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Skeleton className="h-6 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <Skeleton className="h-[200px] w-full" />
                <div className="absolute top-2 left-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
              <div className="p-4">
                <Skeleton className="h-5 w-[80%] mb-2" />
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-6 w-[60%]" />
                  <Skeleton className="h-5 w-[30%]" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-[100px]" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-10" />
            ))}
        </div>
      </div>
    </div>
  )
}
