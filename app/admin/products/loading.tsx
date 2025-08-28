import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full md:w-[300px]" />
        <Skeleton className="h-10 w-full md:w-[200px]" />
      </div>

      <div className="rounded-lg border shadow">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-[150px]" />
        </div>
        <div className="p-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="py-3 flex items-center justify-between border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div>
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
        </div>
        <div className="p-4 border-t flex items-center justify-between">
          <Skeleton className="h-5 w-[100px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}
