import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="rounded-lg border shadow">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-[150px]" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="px-6 py-3 text-left">
                      <Skeleton className="h-4 w-[80px]" />
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <tr key={i}>
                    {Array(6)
                      .fill(0)
                      .map((_, j) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-[80px]" />
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex items-center justify-between">
          <Skeleton className="h-5 w-[100px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}
