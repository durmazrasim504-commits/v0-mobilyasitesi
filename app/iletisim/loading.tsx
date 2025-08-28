import { Skeleton } from "@/components/ui/skeleton"

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <Skeleton className="h-6 w-[200px]" />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-32 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <Skeleton className="h-6 w-[200px]" />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <Skeleton className="h-5 w-[150px] mb-1" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <Skeleton className="h-5 w-[150px] mb-1" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <Skeleton className="h-5 w-[150px] mb-1" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
              </div>
            </div>
          </div>

          <Skeleton className="h-[300px] rounded-lg" />
        </div>
      </div>
    </div>
  )
}
