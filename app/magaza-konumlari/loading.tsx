import { Skeleton } from "@/components/ui/skeleton"

export default function StoreLocationsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-[200px] w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-[150px] mb-3" />
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 flex-shrink-0 mt-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 flex-shrink-0 mt-1" />
                    <Skeleton className="h-4 w-[80%]" />
                  </div>
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 flex-shrink-0 mt-1" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                </div>
                <div className="mt-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
