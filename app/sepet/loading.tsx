import { Skeleton } from "@/components/ui/skeleton"

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[200px] mb-6" />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <Skeleton className="h-6 w-[150px]" />
            </div>

            <div className="divide-y">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4 flex gap-4">
                    <Skeleton className="h-24 w-24 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-[200px] mb-2" />
                      <Skeleton className="h-4 w-[150px] mb-3" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-10" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                        <Skeleton className="h-6 w-[80px]" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-10 w-[120px]" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <Skeleton className="h-6 w-[150px] mb-4" />

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[100px]" />
              </div>
            </div>

            <Skeleton className="h-12 w-full mb-3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
