import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <Skeleton className="h-6 w-[150px] mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-[80%] mb-4" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          ))}
      </div>
    </div>
  )
}
