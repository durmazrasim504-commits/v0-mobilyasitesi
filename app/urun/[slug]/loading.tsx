import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[100px]" />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="flex gap-2 overflow-x-auto">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded flex-shrink-0" />
              ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-[300px] mb-2" />
            <Skeleton className="h-6 w-[150px] mb-4" />
            <Skeleton className="h-5 w-full max-w-md" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-[100px]" />
            <div className="flex gap-2">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
            </div>
            <Skeleton className="h-12 flex-1" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <div>
          <Skeleton className="h-6 w-[200px] mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <div>
          <Skeleton className="h-6 w-[200px] mb-4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-[200px] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-[80%] mb-2" />
                    <Skeleton className="h-6 w-[60%] mb-3" />
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
