import { Skeleton } from "@/components/ui/skeleton"

export default function OrderDetailLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <Skeleton className="h-6 w-[150px]" />
        <div className="space-y-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div>
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-5 w-[80px]" />
              </div>
            ))}
        </div>
        <div className="pt-3 space-y-2">
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
    </div>
  )
}
