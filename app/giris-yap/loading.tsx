import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <Skeleton className="h-8 w-[200px] mx-auto mb-6" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </div>

        <div className="mt-6 pt-6 border-t text-center">
          <Skeleton className="h-5 w-[250px] mx-auto" />
          <Skeleton className="h-10 w-[150px] mx-auto mt-4" />
        </div>
      </div>
    </div>
  )
}
