import { Skeleton } from "@/components/ui/skeleton"

export default function SslCertificationLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <Skeleton className="h-[150px] w-[150px] rounded-lg" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          </div>

          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
