import { Skeleton } from "@/components/ui/skeleton"

export default function OrderDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-[150px]" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <Skeleton className="h-6 w-[200px] mb-4" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <Skeleton className="h-6 w-[200px] mb-4" />

        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <Skeleton className="h-20 w-20 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-[200px] mb-2" />
                  <Skeleton className="h-4 w-[150px] mb-1" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-[80px]" />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 pt-4 border-t space-y-2">
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton className="h-6 w-[200px] mb-4" />

        <div className="space-y-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-[250px] mb-1" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
