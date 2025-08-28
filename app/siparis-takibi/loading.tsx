import { Skeleton } from "@/components/ui/skeleton"

export default function OrderTrackingLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <Skeleton className="h-6 w-[200px] mx-auto mb-6" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    </div>
  )
}
