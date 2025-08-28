import { Skeleton } from "@/components/ui/skeleton"

export default function FaqLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="max-w-3xl mx-auto space-y-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-[300px]" />
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
