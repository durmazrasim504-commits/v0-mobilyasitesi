import { Skeleton } from "@/components/ui/skeleton"

export default function AccountSettingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-[250px] mb-6" />

      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton className="h-6 w-[200px] mb-6" />

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <Skeleton className="h-6 w-[200px] mb-6" />

        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>
    </div>
  )
}
