import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <Skeleton className="h-[400px] rounded-lg" />
      </div>

      <div className="mt-12 space-y-6">
        <Skeleton className="h-6 w-[200px]" />

        <div className="grid gap-6 md:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 text-center">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-[150px] mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-[70%] mx-auto" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
