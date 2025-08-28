import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-[150px]" />
        </div>

        <div className="divide-y">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Skeleton className="h-5 w-[120px] mb-2" />
                    <Skeleton className="h-4 w-[180px] mb-1" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <div className="flex flex-col md:items-end">
                    <Skeleton className="h-6 w-[100px] mb-2" />
                    <Skeleton className="h-10 w-[120px]" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="p-4 border-t">
          <Skeleton className="h-5 w-[200px]" />
        </div>
      </div>
    </div>
  )
}
