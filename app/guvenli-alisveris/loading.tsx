import { Skeleton } from "@/components/ui/skeleton"

export default function SecureShoppingLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            ))}

          <div className="grid gap-4 md:grid-cols-3 py-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[150px] rounded-lg" />
              ))}
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        </div>
      </div>
    </div>
  )
}
